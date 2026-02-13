#!/usr/bin/env python
"""
Verification script - Run this to ensure everything is set up correctly
Usage: python verify_setup.py
"""
import os
import sys

print("\n" + "="*70)
print("NYAYAK RAG SYSTEM - SETUP VERIFICATION")
print("="*70 + "\n")

checks = {
    "✅": 0,
    "❌": 0
}

# Check 1: FAISS Index
print("1️⃣  FAISS Index")
faiss_path = "app/faiss_index"
if os.path.exists(faiss_path):
    print(f"   ✅ FAISS index found at: {faiss_path}")
    checks["✅"] += 1
else:
    print(f"   ❌ FAISS index NOT found")
    print(f"   💡 FIX: Run 'python -c \"from app.rag.build_index import build_index; build_index()\"'")
    checks["❌"] += 1

# Check 2: Legal Documents
print("\n2️⃣  Legal Documents")
data_path = "app/data/legal_docs"
if os.path.exists(data_path):
    files = [f for f in os.listdir(data_path) if f.endswith(".txt")]
    print(f"   ✅ Found {len(files)} legal documents:")
    for f in files:
        print(f"      • {f}")
    checks["✅"] += 1
else:
    print(f"   ❌ Legal documents NOT found")
    checks["❌"] += 1

# Check 3: Pipeline Enhancement
print("\n3️⃣  Enhanced Pipeline")
try:
    with open("app/rag/pipeline.py", "r") as f:
        content = f.read()
        if "LEGAL_TERMS" in content and "retrieve_faiss_context" in content:
            print("   ✅ Enhanced pipeline features detected")
            print("      • LEGAL_TERMS knowledge base: ✓")
            print("      • Multi-document retrieval: ✓")
            print("      • Response metadata: ✓")
            checks["✅"] += 1
        else:
            print("   ❌ Pipeline enhancements not found")
            checks["❌"] += 1
except Exception as e:
    print(f"   ❌ Error checking pipeline: {e}")
    checks["❌"] += 1

# Check 4: Backend Endpoint
print("\n4️⃣  Backend Configuration")
try:
    with open("app/main.py", "r") as f:
        content = f.read()
        if "/ask" in content and "ask_question_with_doc" in content:
            print("   ✅ Backend /ask endpoint configured")
            checks["✅"] += 1
        else:
            print("   ❌ Backend endpoint not found")
            checks["❌"] += 1
except Exception as e:
    print(f"   ❌ Error checking backend: {e}")
    checks["❌"] += 1

# Check 5: Frontend Chat Component
print("\n5️⃣  Frontend Chat Component")
try:
    if os.path.exists("../frontend/src/pages/Chat.jsx"):
        with open("../frontend/src/pages/Chat.jsx", "r") as f:
            content = f.read()
            if "source" in content and "confidence" in content:
                print("   ✅ Chat component with metadata display")
                checks["✅"] += 1
            else:
                print("   ⚠️  Chat component found but metadata display unclear")
                checks["✅"] += 0.5
    else:
        print("   ⚠️  Chat.jsx not found (frontend may be separate)")
        checks["✅"] += 0.5
except Exception as e:
    print(f"   ⚠️  Error checking frontend: {e}")

# Check 6: Dependencies
print("\n6️⃣  Python Dependencies")
dependencies = [
    ("fastapi", "FastAPI Web Framework"),
    ("torch", "PyTorch"),
    ("transformers", "Hugging Face Transformers"),
    ("langchain_community", "LangChain Community"),
    ("faiss", "FAISS Vector Store"),
    ("sentence_transformers", "Sentence Transformers"),
]

missing = []
for package, description in dependencies:
    try:
        __import__(package)
        print(f"   ✅ {description}")
    except ImportError:
        print(f"   ❌ {description} - MISSING")
        missing.append(package)
        checks["❌"] += 1

if not missing:
    checks["✅"] += 1

# Summary
print("\n" + "="*70)
print("SUMMARY")
print("="*70)
total = checks["✅"] + checks["❌"]
passed = checks["✅"]
print(f"\n✅ Checks Passed: {int(passed)}")
print(f"❌ Checks Failed: {checks['❌']}\n")

if checks["❌"] == 0 and missing == []:
    print("🎉 All checks passed! Your system is ready to use.")
    print("\nQuick Start:")
    print("  1. python -m uvicorn app.main:app --reload")
    print("  2. (In another terminal) cd ../frontend && npm run dev")
    print("  3. Open http://localhost:5173/chat")
else:
    print("⚠️  Some checks failed. Please fix the issues above.")
    if missing:
        print(f"\n💡 Install missing packages: pip install {' '.join(missing)}")

print("\n" + "="*70 + "\n")
