"""
Quick test script to verify the enhanced RAG pipeline
Run this to test "What is FIR?" question
Usage: python test_pipeline.py
"""
import sys
sys.path.insert(0, 'app')

from app.rag.pipeline import ask_question_with_doc

print("=" * 70)
print("ENHANCED RAG PIPELINE TEST")
print("=" * 70)

# Test 1: General FIR question
print("\n📝 TEST 1: General Question - 'What is FIR?'")
print("-" * 70)
response = ask_question_with_doc("What is FIR?")
print(f"Answer: {response['answer']}\n")
print(f"Source: {response['source']}")
print(f"Confidence: {response['confidence']}%")
print(f"Disclaimer: {response['disclaimer']}\n")

# Test 2: Bail question
print("\n📝 TEST 2: General Question - 'What is bail and how to get it?'")
print("-" * 70)
response = ask_question_with_doc("What is bail and how to get it?")
print(f"Answer: {response['answer']}\n")
print(f"Source: {response['source']}")
print(f"Confidence: {response['confidence']}%\n")

# Test 3: Consumer complaint question
print("\n📝 TEST 3: General Question - 'How to file a consumer complaint?'")
print("-" * 70)
response = ask_question_with_doc("How to file a consumer complaint in India?")
print(f"Answer: {response['answer']}\n")
print(f"Source: {response['source']}")
print(f"Confidence: {response['confidence']}%\n")

print("=" * 70)
print("✅ Test completed! Check the answers above.")
print("=" * 70)
