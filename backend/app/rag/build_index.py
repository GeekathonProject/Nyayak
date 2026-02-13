import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "legal_docs")
INDEX_PATH = os.path.join(BASE_DIR, "..", "faiss_index")


def load_documents():
    if not os.path.exists(DATA_PATH):
        print(f"❌ Directory not found: {DATA_PATH}")
        return []

    documents = []
    files = [f for f in os.listdir(DATA_PATH) if f.endswith(".txt")]

    if not files:
        print("⚠️ No .txt files found.")
        return []

    for file in files:
        loader = TextLoader(
            os.path.join(DATA_PATH, file),
            encoding="utf-8"
        )
        docs = loader.load()
        documents.extend(docs)
        print(f"📄 Loaded: {file}")

    return documents


def build_index():
    documents = load_documents()

    if not documents:
        print("🛑 No documents to index.")
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100
    )

    texts = splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(texts, embeddings)

    os.makedirs(INDEX_PATH, exist_ok=True)
    vectorstore.save_local(INDEX_PATH)

    print("✅ FAISS index created successfully.")


if __name__ == "__main__":
    build_index()
