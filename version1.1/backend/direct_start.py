"""
Direct start script for the backend.
This is a simplified script that directly starts the uvicorn server
without any complex subprocess handling.
"""
import os
import sys
import multiprocessing

# Fix for Windows multiprocessing issue
if sys.platform.startswith('win'):
    # Explicitly set the start method to 'spawn'
    multiprocessing.set_start_method('spawn', force=True)

# Import uvicorn after setting the multiprocessing start method
import uvicorn

# Check if running directly or imported
if __name__ == "__main__":
    print("Starting Mindfulness Therapy API server...")
    print("Press Ctrl+C to stop the server")
    
    # Start the server directly
    # Note: when using reload=True, it's important this is guarded by if __name__ == "__main__"
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )
else:
    # This allows the file to be imported without running the server
    print("Direct start module imported (not running server)") 