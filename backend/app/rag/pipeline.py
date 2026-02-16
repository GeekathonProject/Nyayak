import os
import re
import traceback
from dotenv import load_dotenv
from google import genai
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.embeddings import Embeddings

# ==========================================
# LOAD ENV
# ==========================================
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# ==========================================
# GEMINI CLIENT
# ==========================================
client = genai.Client(api_key=api_key)

# ==========================================
# PATHS
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_INDEX_PATH = os.path.join(BASE_DIR, "..", "..", "faiss_base")
UPLOADED_INDEX_PATH = os.path.join(BASE_DIR, "..", "..", "faiss_uploaded")

os.makedirs(UPLOADED_INDEX_PATH, exist_ok=True)

# ==========================================
# EMBEDDINGS (Gemini Cloud)
# ==========================================
class GoogleGenAIEmbeddings(Embeddings):
    def __init__(self, model: str = "gemini-embedding-001"):
        self.model = model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        response = client.models.embed_content(
            model=self.model,
            contents=texts
        )

        return [e.values for e in response.embeddings]

    def embed_query(self, text: str) -> list[float]:
        response = client.models.embed_content(
            model=self.model,
            contents=[text]
        )

        return response.embeddings[0].values


_embeddings = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        _embeddings = GoogleGenAIEmbeddings()
    return _embeddings


# ==========================================
# LOAD BASE INDEX
# ==========================================
base_store = None

def get_base_store():
    global base_store
    if base_store is None and os.path.exists(BASE_INDEX_PATH):
        base_store = FAISS.load_local(
            BASE_INDEX_PATH,
            get_embeddings(),
            allow_dangerous_deserialization=True
        )
    return base_store


# ==========================================
# STATIC FALLBACK TERMS
# ==========================================
LEGAL_TERMS = {
    "fir": "FIR is recorded under Section 154 CrPC.",
    "bail": "Bail allows temporary release under CrPC provisions.",
    "ipc": "IPC 1860 defines criminal offences."
}


# ==========================================
# BUILD UPLOADED INDEX
# ==========================================
def build_uploaded_index(text: str):
    if not text or not text.strip():
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )

    chunks = splitter.split_text(text)

    if not chunks:
        return

    store = FAISS.from_texts(chunks, get_embeddings())
    store.save_local(UPLOADED_INDEX_PATH)


def load_uploaded_index():
    index_file = os.path.join(UPLOADED_INDEX_PATH, "index.faiss")

    if os.path.exists(index_file):
        return FAISS.load_local(
            UPLOADED_INDEX_PATH,
            get_embeddings(),
            allow_dangerous_deserialization=True
        )

    return None


# ==========================================
# RETRIEVE CONTEXT
# ==========================================
def retrieve_context(query: str):
    uploaded_store = load_uploaded_index()

    if uploaded_store:
        docs = uploaded_store.similarity_search(query, k=2)
        return [d.page_content for d in docs], "uploaded"

    base = get_base_store()
    if base:
        docs = base.similarity_search(query, k=2)
        return [d.page_content for d in docs], "base"

    return [], "none"


# ==========================================
# MAIN FUNCTION
# ==========================================
def ask_question_with_doc(query: str, uploaded_text: str = None):
    try:
        query_clean = query.strip().lower()

        # Greeting guard
        if re.match(r"^(hi+|hello+|hey+|namaste+)", query_clean):
            return {
                "answer": "Hello! I am NyaySetu AI. How can I assist you?",
                "mode": "greeting",
                "confidence": 100
            }

        # Build uploaded index if provided
        if uploaded_text and uploaded_text.strip():
            build_uploaded_index(uploaded_text)

        # Retrieve context
        contexts, mode = retrieve_context(query)

        # Static fallback
        if not contexts:
            fallback = ""
            for term, definition in LEGAL_TERMS.items():
                if term in query_clean:
                    fallback += definition + " "

            if fallback:
                contexts = [fallback]
                mode = "static"

        context_text = "\n\n".join(contexts) if contexts else "No relevant context found."

        system_prompt = """
You are a professional Indian legal assistant.

Guidelines:
- Use provided context first when relevant.
- If context is incomplete, rely on general Indian law knowledge.
- If unsure, recommend consulting a qualified lawyer.
- Be clear and concise.
"""

        final_prompt = f"""
{system_prompt}

Context:
{context_text}

Question:
{query}
"""

        # ==========================================
        # GEMINI GENERATION
        # ==========================================
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {
                    "role": "user",
                    "parts": [{"text": final_prompt}]
                }
            ]
        )

        # SAFE TEXT EXTRACTION (handles all SDK versions)
        answer = None

        if hasattr(response, "text") and response.text:
            answer = response.text
        elif hasattr(response, "candidates") and response.candidates:
            try:
                answer = response.candidates[0].content.parts[0].text
            except Exception:
                answer = None

        if not answer:
            answer = "I am unable to provide a clear legal answer. Please consult a qualified lawyer."

        answer = re.sub(r"\s+", " ", answer).strip()

        confidence = (
            95 if mode == "uploaded"
            else 85 if mode == "base"
            else 70 if mode == "static"
            else 50
        )

        return {
            "answer": answer,
            "mode": mode,
            "confidence": confidence,
            "disclaimer": "AI-generated informational response. Not legal advice."
        }

    except Exception as e:
        print("========= FULL TRACEBACK =========")
        traceback.print_exc()
        print("==================================")

        return {
            "answer": f"Internal error: {repr(e)}",
            "mode": "error",
            "confidence": 0
        }
