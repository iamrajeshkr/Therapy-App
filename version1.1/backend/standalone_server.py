#!/usr/bin/env python
"""
Standalone minimal server for testing and development.
This is useful when the full backend has issues.
"""
import os
import sys
import json
from typing import List, Dict, Any, Optional

try:
    import uvicorn
    from fastapi import FastAPI, Depends, HTTPException, status
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
except ImportError:
    print("Error: Required packages not installed.")
    print("Please run: pip install fastapi uvicorn")
    sys.exit(1)

# Create a minimal FastAPI app
app = FastAPI(
    title="Mindfulness Therapy API (Minimal)",
    description="Minimal API for testing connectivity",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data
users = {
    "user1": {"id": "1", "username": "user1", "email": "user1@example.com", "full_name": "Test User"}
}

sessions = [
    {"id": "1", "title": "First Session", "user_id": "1", "created_at": "2023-06-01T10:00:00Z"}
]

mood_entries = [
    {"id": "1", "user_id": "1", "mood_score": 8, "notes": "Feeling good today", "recorded_at": "2023-06-01T10:00:00Z"}
]

journal_entries = [
    {"id": "1", "user_id": "1", "title": "My First Journal", "content": "Today was a good day.", "created_at": "2023-06-01T10:00:00Z"}
]

# Health check endpoint
@app.get("/api/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running.
    """
    return {"status": "healthy", "version": "0.1.0"}

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint redirecting to API documentation.
    """
    return {"message": "Welcome to Mindfulness Therapy API (Minimal)", "docs": "/docs"}

# Auth endpoints
@app.post("/api/auth/login", tags=["Auth"])
async def login(username: str = "user1", password: str = "password"):
    """
    Simple login endpoint (hardcoded for testing).
    """
    if username in users and password == "password":
        return {"access_token": "dummy_token", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/auth/me", tags=["Auth"])
async def get_current_user():
    """
    Get current user info (hardcoded for testing).
    """
    return users["user1"]

# Therapy endpoints
@app.get("/api/therapy/sessions", tags=["Therapy"])
async def get_sessions():
    """
    Get therapy sessions (hardcoded for testing).
    """
    return sessions

@app.post("/api/therapy/chat", tags=["Therapy"])
async def therapy_chat(message: str = "Hello"):
    """
    Simple chat endpoint for testing.
    """
    return {
        "response": f"This is a test response to: {message}",
        "chat_session_id": "1"
    }

# Mood endpoints
@app.get("/api/mood", tags=["Mood"])
async def get_mood_entries():
    """
    Get mood entries (hardcoded for testing).
    """
    return mood_entries

@app.post("/api/mood", tags=["Mood"])
async def create_mood_entry(mood_score: int = 7, notes: str = None):
    """
    Create a mood entry (hardcoded for testing).
    """
    entry = {
        "id": str(len(mood_entries) + 1),
        "user_id": "1",
        "mood_score": mood_score,
        "notes": notes,
        "recorded_at": "2023-06-02T10:00:00Z"
    }
    mood_entries.append(entry)
    return entry

# Journal endpoints
@app.get("/api/journal", tags=["Journal"])
async def get_journal_entries():
    """
    Get journal entries (hardcoded for testing).
    """
    return journal_entries

@app.post("/api/journal", tags=["Journal"])
async def create_journal_entry(title: str = "New Entry", content: str = ""):
    """
    Create a journal entry (hardcoded for testing).
    """
    entry = {
        "id": str(len(journal_entries) + 1),
        "user_id": "1",
        "title": title,
        "content": content,
        "created_at": "2023-06-02T10:00:00Z"
    }
    journal_entries.append(entry)
    return entry

if __name__ == "__main__":
    print("Starting Mindfulness Therapy API (Minimal)")
    print("This is a simplified version for testing only")
    print("Access the API documentation at http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000) 