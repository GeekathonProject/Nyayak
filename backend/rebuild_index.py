#!/usr/bin/env python

import sys
from app.rag.build_index import build_index

if __name__ == "__main__":
    print("=" * 60)
    print("REBUILDING FAISS INDEX")
    print("=" * 60)

    try:
        build_index()
        print("\n✅ Index rebuild completed successfully!")
    except Exception as e:
        print(f"\n❌ Error rebuilding index: {e}")
        sys.exit(1)
