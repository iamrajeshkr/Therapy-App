"""
Simple start script for the backend API.
This version avoids multiprocessing issues by disabling reload functionality.
It's designed for maximum compatibility across different environments.
"""

import uvicorn
import sys
from pathlib import Path

def main():
    print("\n" + "="*80)
    print(" MINDFULNESS THERAPY API ".center(80, "="))
    print("="*80 + "\n")
    
    print("Starting server without reload functionality...")
    print("Press Ctrl+C to stop the server\n")
    
    try:
        # Run without reload to avoid multiprocessing issues
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )
        return 0
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 