import os
import re
import torch
from typing import List

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


# ==========================================
# DEVICE & PATH SETUP
# ==========================================
device = "cuda" if torch.cuda.is_available() else "cpu"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_PATH = os.path.join(BASE_DIR, "..", "faiss_index")

if not os.path.exists(INDEX_PATH):
    INDEX_PATH = os.path.join(os.getcwd(), "faiss_index")


# ==========================================
# LOAD EMBEDDING MODEL
# ==========================================
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={"device": device}
)

vectorstore = None
if os.path.exists(INDEX_PATH):
    vectorstore = FAISS.load_local(
        INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )


# ==========================================
# LOAD LLM (ONLY ONCE)
# ==========================================
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    device_map="auto" if device == "cuda" else None,
).to(device)

model.eval()


# ==========================================
# STATIC LEGAL KNOWLEDGE BASE
# ==========================================
LEGAL_TERMS = {
    "fir": "FIR (First Information Report) is the first official record made by police when a cognizable offense is reported under Section 154 CrPC.",
    "bail": "Bail is a legal arrangement allowing a person to be released from custody pending trial under provisions of CrPC.",
    "cognizable": "A cognizable offense allows police to arrest without warrant and start investigation without court approval.",
    "non-cognizable": "A non-cognizable offense requires a warrant and court approval for investigation.",
    "crpc": "CrPC (Code of Criminal Procedure, 1973) governs criminal procedure in India.",
    "ipc": "IPC (Indian Penal Code, 1860) defines criminal offenses in India.",
    "tenant": "Tenant rights are protected under Rent Control Acts and Transfer of Property Act.",
    "cybercrime": "Cybercrime is punishable under the IT Act 2000 and IPC provisions.",
    "domestic violence": "Domestic violence is governed under the Protection of Women from Domestic Violence Act, 2005."
}


# ==========================================
# HELPERS
# ==========================================
def extract_text(file_input: str) -> str:
    """Extract text from PDF or raw string."""
    if not file_input:
        return ""

    if isinstance(file_input, str) and file_input.lower().endswith(".pdf"):
        if not fitz:
            return ""
        if not os.path.exists(file_input):
            return ""

        text = ""
        with fitz.open(file_input) as doc:
            for page in doc:
                text += page.get_text()
        return text

    return str(file_input)


def get_legal_term_context(query: str) -> str:
    query_lower = query.lower()
    matches = [definition for term, definition in LEGAL_TERMS.items()
               if term in query_lower]
    return " ".join(matches)


def retrieve_faiss_context(query: str, k: int = 3):
    if not vectorstore:
        return [], []

    try:
        docs_with_scores = vectorstore.similarity_search_with_score(query, k=k)

        # Filter weak matches
        filtered_docs = [(doc, score) for doc, score in docs_with_scores if score < 1.2]

        texts = [doc.page_content for doc, _ in filtered_docs]
        sources = list(
            set(doc.metadata.get("source", "unknown") for doc, _ in filtered_docs)
        )

        return texts, sources

    except Exception:
        return [], []


# ==========================================
# MAIN RAG FUNCTION
# ==========================================
def ask_question_with_doc(query: str, uploaded_input: str = None):

    uploaded_text = extract_text(uploaded_input)
    legal_term_context = get_legal_term_context(query)
    faiss_texts, sources = retrieve_faiss_context(query)

    context_parts: List[str] = []

    if uploaded_text.strip():
        context_parts.append("[UPLOADED DOCUMENT]\n" + uploaded_text[:1500])

    if legal_term_context:
        context_parts.append("[LEGAL DEFINITIONS]\n" + legal_term_context)

    if faiss_texts:
        context_parts.append("[LEGAL PROCEDURES]\n" +
                             "\n".join(text[:800] for text in faiss_texts))

    context = "\n\n".join(context_parts) if context_parts else "No legal documents retrieved."

    system_prompt = """

You are a professional Indian legal assistant.

Guidelines:
- Use simple and clear language.
- Provide practical, step-by-step guidance in paragraph form.
- Do not sound robotic or overly technical.
- Do not give illegal or harmful advice.
- Keep the answer calm, balanced, and realistic.
-if the ans is not clear, ask for more information instead of guessing.
-If the question is simple, respond briefly (2–3 sentences).
- If necessary, recommend consulting a lawyer.
-Answer based on the complexity of the question.
-Use simple, practical language.


"""

    prompt = f"""<|system|>
{system_prompt}</s>
<|user|>
{context}

Question: {query}</s>
<|assistant|>
"""

    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=500,
            temperature=0,
            top_p=0.2,
            repetition_penalty=1.15,
            eos_token_id=tokenizer.eos_token_id
        )

    generated = outputs[0][inputs["input_ids"].shape[-1]:]
    answer = tokenizer.decode(generated, skip_special_tokens=True)

    # Clean output
    answer = re.sub(r"\*\*.*?\*\*", "", answer)
    answer = re.sub(r"\s+", " ", answer).strip()

    # Confidence Logic
    if faiss_texts:
        confidence = 90
    elif legal_term_context:
        confidence = 80
    else:
        confidence = 65

    return {
        "answer": answer,
        "sources": sources,
        "disclaimer": "This AI-generated response is for informational purposes only. Consult a qualified lawyer for legal advice.",
        "confidence": confidence
    }
