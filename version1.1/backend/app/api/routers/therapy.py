from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.deps import get_current_user
from app.schemas.therapy import (
    ChatSession, 
    ChatSessionCreate, 
    ChatSessionSummary,
    ChatMessage,
    TherapyChatRequest,
    TherapyChatResponse,
    TherapyExercise
)
from app.services.therapy_service import (
    create_chat_session,
    get_chat_sessions,
    get_chat_session,
    add_message_to_session,
    process_therapy_message,
    get_therapy_exercises
)

router = APIRouter()


@router.post("/chat", response_model=TherapyChatResponse)
async def chat(
    request: TherapyChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to the therapy chatbot and get a response
    """
    return await process_therapy_message(db, current_user.id, request)


@router.post("/sessions", response_model=ChatSession)
def create_session(
    session_data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new chat session
    """
    return create_chat_session(db, current_user.id, session_data)


@router.get("/sessions", response_model=List[ChatSessionSummary])
def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all chat sessions for the current user
    """
    return get_chat_sessions(db, current_user.id)


@router.get("/sessions/{session_id}", response_model=ChatSession)
def get_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific chat session with all messages
    """
    session = get_chat_session(db, session_id, current_user.id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found"
        )
    return session


@router.get("/exercises", response_model=List[TherapyExercise])
def list_exercises(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all available therapy exercises
    """
    return get_therapy_exercises(db) 