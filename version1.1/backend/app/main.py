from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routers import auth, therapy, mood, journal
from app.core.config import settings
from app.db.database import create_db_and_tables

app = FastAPI(
    title="Mindfulness Therapy API",
    description="API for the Mindfulness Therapy Application",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(therapy.router, prefix="/api/therapy", tags=["Therapy"])
app.include_router(mood.router, prefix="/api/mood", tags=["Mood Tracking"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])

@app.on_event("startup")
async def startup_event():
    """
    Function that runs when the application starts.
    Creates database tables if they don't exist.
    """
    create_db_and_tables()

@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy", "version": settings.VERSION}

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint redirecting to API documentation.
    """
    return {"message": "Welcome to Mindfulness Therapy API", "docs": "/docs"}

# Only run the server if this file is executed directly
if __name__ == "__main__":
    import multiprocessing
    import sys
    
    # Fix for Windows multiprocessing issue
    if sys.platform.startswith('win'):
        multiprocessing.set_start_method('spawn', force=True)
        
    import uvicorn
    
    print("Starting server from main.py...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False) 