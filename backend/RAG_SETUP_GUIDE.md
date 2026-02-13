# Enhanced RAG Pipeline Setup Guide

## What's Improved? 🚀

Your legal AI assistant now has:
1. **Better Context Retrieval** - Retrieves 3 relevant documents instead of 1
2. **Legal Knowledge Base** - Built-in definitions for common legal terms (FIR, Bail, CrPC, etc.)
3. **Smarter Prompting** - Better instructions for generating focused, accurate legal answers
4. **Response Metadata** - Shows whether answer came from your document or knowledge base + confidence score
5. **Multi-Source Learning** - Combines uploaded documents + FAISS index + legal knowledge base

## Setup Steps

### 1. Rebuild the FAISS Index (IMPORTANT!)

The FAISS index needs to be built from your legal documents. Run this command:

```bash
cd backend
python rebuild_index.py
```

This will:
- Load all files from `backend/app/data/legal_docs/`
- Create embeddings using sentence-transformers
- Save the index to `backend/app/faiss_index/`

**Expected Output:**
```
============================================================
FAISS INDEX REBUILD
============================================================
🔹 Step 1: Loading documents...
📄 Loaded: bail_procedure.txt
📄 Loaded: consumer_complaint.txt
📄 Loaded: cybercrime.txt
📄 Loaded: domestic_violence.txt
📄 Loaded: fir_process.txt
📄 Loaded: hearing_delay.txt
📄 Loaded: police_refusal.txt
📄 Loaded: tenant_rights.txt
✅ Success message...
```

### 2. Start Your Backend

```bash
cd backend
python -m uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Start Your Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173/chat

## How It Works

### For General Legal Questions (without uploading)

When you ask "What is FIR?":
1. ✅ Legal Knowledge Base triggers (has "FIR" definition)
2. ✅ FAISS retrieves relevant documents (fir_process.txt)
3. ✅ Model generates focused answer using all context
4. ✅ Response shows "Source: Legal Knowledge Base" + 85% confidence

### For Document-Specific Questions (with PDF upload)

When you upload a PDF and ask a question:
1. ✅ Extracts text from your PDF
2. ✅ Adds legal knowledge base context
3. ✅ Retrieves relevant legal procedures from FAISS
4. ✅ Model generates answer combining all sources
5. ✅ Response shows "Source: Your Uploaded Document" + 85%+ confidence

## Key Configuration

**Pipeline Parameters** (in `backend/app/rag/pipeline.py`):

```python
max_new_tokens=350          # Answer length (increased from 256)
temperature=0.5             # Specificity (higher = more creative, lower = factual)
top_p=0.95                  # Diversity control
repetition_penalty=1.2      # Prevent repeating answers
k=3                         # Number of documents to retrieve (increased from 1)
```

## Supported Legal Terms

The knowledge base includes definitions for:
- **FIR** - First Information Report
- **Bail** - Release from custody
- **Cognizable Offense** - Police can arrest without warrant
- **CrPC** - Criminal Procedure Code
- **IPC** - Indian Penal Code
- **Tenant Rights** - Renter protections
- **Cybercrime** - Digital offenses
- **Domestic Violence** - Family violence protection

## Adding More Legal Documents

1. Add `.txt` files to `backend/app/data/legal_docs/`
2. Run `python rebuild_index.py` again
3. Restart backend

**Format for legal documents:**
```
Topic Name

Brief description...

Key Points:
- Point 1
- Point 2

Procedures:
1. Step 1
2. Step 2
```

## Troubleshooting

### Issue: "No FAISS index found"
**Solution:** Run `python rebuild_index.py` in the backend directory

### Issue: Generic answers despite uploading PDF
**Solution:** 
1. Ensure FAISS index is built
2. Upload PDF related to legal documents in system
3. Ask specific questions about the content

### Issue: Backend timeout
**Solution:** Increase `max_new_tokens` is normal for CPU. Enable GPU if available:
```python
# Check if CUDA is available
python -c "import torch; print(torch.cuda.is_available())"
```

### Issue: Slow responses
**Solution:** Using CPU is slower. Responses should still be within 30-60 seconds.

## Testing the System

### Test 1: General Question
- **Question:** "What is FIR?"
- **Expected:** Detailed answer about FIR process from fir_process.txt
- **Source:** Legal Knowledge Base
- **Confidence:** 85%+

### Test 2: Document Upload
- **Upload:** Any legal PDF
- **Question:** Ask about content in the PDF
- **Expected:** Answer specific to your document
- **Source:** Your Uploaded Document
- **Confidence:** 85%+

## Next Steps

1. ✅ Run `python rebuild_index.py`
2. ✅ Start backend with `python -m uvicorn app.main:app --reload`
3. ✅ Start frontend with `npm run dev`
4. ✅ Visit http://localhost:5173/chat
5. ✅ Try asking legal questions!

---

**Questions?** Check that:
- FAISS index exists in `backend/app/faiss_index/`
- Backend is running on port 8000
- Frontend is running on port 5173
- Legal documents are in `backend/app/data/legal_docs/`
