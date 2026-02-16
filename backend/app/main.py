from fastapi import FastAPI, UploadFile, File, HTTPException
from pypdf import PdfReader
import io

app = FastAPI()

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health():
    return {"status": "ok"}


def extract_pdf_text(file: UploadFile) -> str:
    try:
        contents = file.file.read()

        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded.")

        pdf_reader = PdfReader(io.BytesIO(contents))

        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF."
            )

        return text.strip()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing error: {str(e)}"
        )


@app.post("/ask")
async def ask(query: str, file: UploadFile = File(None)):
    from app.rag.pipeline import ask_question_with_doc

    if not query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    uploaded_text = None

    if file:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported."
            )

        uploaded_text = extract_pdf_text(file)

    result = ask_question_with_doc(query, uploaded_text)

    return result
