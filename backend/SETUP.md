# NYAYAK Backend - Setup Guide

## Quick Start for New Team Members

### Step 1: Prerequisites
- Python 3.8 or higher
- Git (for version control)
- Virtual Environment (recommended)

### Step 2: Clone the Repository
```bash
cd D:\GECATHON\Nyayak\backend
```

### Step 3: Create Virtual Environment (Recommended)
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 5: Download Required Models (First Time Only)
The models will be automatically downloaded on first run:
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (~100MB)
- **LLM Model**: `TinyLlama/TinyLlama-1.1B-Chat-v1.0` (~1.1GB)

### Step 6: Run the Application
```bash
# From the backend directory
python -m uvicorn app.main:app --reload

# Or with custom host/port
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 7: Test the API
Open your browser and visit:
- Health Check: `http://localhost:8000/`
- API Documentation: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

## Project Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   └── rag/
│       ├── pipeline.py      # RAG pipeline and LLM logic
│       ├── build_index.py   # FAISS index builder
│       └── test_rag.py      # RAG testing
├── faiss_index/             # Vector database (auto-generated)
├── venv/                    # Virtual environment
└── requirements.txt         # Dependencies list
```

## Environment Variables (Optional)
Create a `.env` file if needed:
```
# Example (not required for basic setup)
HF_TOKEN=your_huggingface_token
```

## Troubleshooting

### Problem: `ModuleNotFoundError: No module named 'transformers'`
**Solution**: Make sure you've activated the virtual environment and installed requirements
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

### Problem: CUDA/GPU issues
**Solution**: The setup uses CPU by default. For GPU support, install `torch` with CUDA:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Problem: Out of Memory
**Solution**: Reduce the batch size or use smaller models. Edit `pipeline.py` if needed.

## API Endpoints

### 1. Health Check
```
GET /
Response: {"message": "Legal AI Assistant is running 🚀"}
```

### 2. Ask Question
```
POST /ask
Body: {"question": "What are remedies for domestic violence?"}
Response: {
  "answer": "...",
  "confidence": 75.5,
  "sources": [...],
  "disclaimer": "...",
  "call_to_action": "..."
}
```

## For Development

### Install Dev Dependencies (Optional)
Uncomment in `requirements.txt`:
```bash
pip install pytest black pylint
```

### Run Tests
```bash
pytest app/rag/test_rag.py -v
```

### Code Quality
```bash
black app/
pylint app/
```

## Useful Commands

| Command | Purpose |
|---------|---------|
| `pip freeze > requirements.txt` | Update requirements.txt with current versions |
| `pip list` | Show all installed packages |
| `deactivate` | Exit virtual environment |
| `rm -r venv` | Delete virtual environment (Windows: `rmdir /s venv`) |

## Need Help?
- Check the RAG pipeline documentation in `pipeline.py`
- Review test cases in `test_rag.py`
- Refer to [LangChain Docs](https://python.langchain.com/)
- Check [FastAPI Docs](https://fastapi.tiangolo.com/)

---
**Last Updated**: 2026-02-12
**Team**: Nyayak Development Team
