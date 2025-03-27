from typing import List, Optional
from sqlalchemy.orm import Session
import asyncio
from datetime import datetime

from app.db.models import ChatSession, ChatMessage, TherapyExercise
from app.schemas.therapy import (
    ChatSessionCreate,
    ChatMessageCreate,
    TherapyChatRequest,
    TherapyChatResponse,
)
from app.ollama.client import get_therapy_response, summarize_conversation


def create_chat_session(db: Session, user_id: str, session_data: ChatSessionCreate) -> ChatSession:
    """
    Create a new chat session
    """
    # Use formatted date for default title if not provided
    title = session_data.title
    if title == "New Chat" or not title:
        current_time = datetime.now().strftime("%B %d, %Y %I:%M %p")
        title = f"Therapy Session - {current_time}"
    
    db_session = ChatSession(
        user_id=user_id,
        title=title,
        conversation_summary=None  # No summary for new chat
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    # Add initial welcome message from assistant
    welcome_message = ChatMessage(
        chat_session_id=db_session.id,
        role="assistant",
        content="Hello! I'm your mindfulness therapy assistant. How are you feeling today?"
    )
    db.add(welcome_message)
    db.commit()
    
    return db_session


def get_chat_sessions(db: Session, user_id: str) -> List[ChatSession]:
    """
    Get all chat sessions for a user
    """
    return db.query(ChatSession).filter(ChatSession.user_id == user_id).order_by(ChatSession.updated_at.desc()).all()


def get_chat_session(db: Session, session_id: str, user_id: str) -> Optional[ChatSession]:
    """
    Get a specific chat session
    """
    return db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user_id
    ).first()


def update_session_summary(db: Session, session_id: str, summary: str):
    """
    Update the conversation summary for a session
    """
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        session.conversation_summary = summary
        db.commit()


def add_message_to_session(db: Session, session_id: str, message_data: ChatMessageCreate) -> ChatMessage:
    """
    Add a message to a chat session
    """
    db_message = ChatMessage(
        chat_session_id=session_id,
        role=message_data.role,
        content=message_data.content,
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Update session updated_at timestamp
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    db.commit()
    
    return db_message


def update_session_title(db: Session, session_id: str, first_message: str) -> None:
    """
    Update the session title based on the first user message
    """
    # Only update if the title was the default one
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session and "Therapy Session -" in session.title:
        # Generate a title based on the first message
        # Truncate the message if it's too long
        if len(first_message) > 30:
            title_text = first_message[:27] + "..."
        else:
            title_text = first_message
            
        session.title = f"Session: {title_text}"
        db.commit()


async def process_therapy_message(db: Session, user_id: str, request: TherapyChatRequest) -> TherapyChatResponse:
    """
    Process a message from the user and get an AI response
    """
    # Get or create chat session
    session_id = request.chat_session_id
    is_new_session = False
    
    if not session_id:
        # Create new session
        new_session = create_chat_session(db, user_id, ChatSessionCreate(title="New Chat"))
        session_id = new_session.id
        current_summary = None
        is_new_session = True
    else:
        # Verify session exists and belongs to user
        session = get_chat_session(db, session_id, user_id)
        if not session:
            raise ValueError("Chat session not found")
        current_summary = session.conversation_summary
    
    # Add user message to session
    add_message_to_session(db, session_id, ChatMessageCreate(role="user", content=request.message))
    
    # If this is a new session or the first user message, update the title
    if is_new_session:
        update_session_title(db, session_id, request.message)
    else:
        # Check if this is the first user message (meaning there's only one other message - the welcome message)
        message_count = db.query(ChatMessage).filter(ChatMessage.chat_session_id == session_id).count()
        if message_count == 2:  # welcome message + this first user message
            update_session_title(db, session_id, request.message)
    
    # Get full message history
    all_messages = db.query(ChatMessage).filter(
        ChatMessage.chat_session_id == session_id
    ).order_by(ChatMessage.timestamp.asc()).all()
    
    # Convert to format needed for LLM
    conversation_history = [{"role": msg.role, "content": msg.content} for msg in all_messages]
    
    # If we have more than 8 messages, we should summarize older messages
    should_summarize = len(conversation_history) > 8
    
    # If needed, create or update summary
    if should_summarize and (len(conversation_history) % 4 == 0 or current_summary is None):
        # We'll summarize all but the last 4 messages
        messages_to_summarize = conversation_history[:-4]
        new_summary = await summarize_conversation(messages_to_summarize)
        
        if new_summary:
            # Update the summary in the database
            update_session_summary(db, session_id, new_summary)
            current_summary = new_summary
    
    # Get AI response with a timeout for faster user experience
    try:
        # Set a timeout for the LLM response to ensure we don't keep the user waiting too long
        ai_response = await asyncio.wait_for(
            get_therapy_response(conversation_history, current_summary),
            timeout=15.0  # 15 second timeout for faster response
        )
    except asyncio.TimeoutError:
        ai_response = "I'm still thinking about my response. Please wait a moment and try again."
    
    # Add assistant response to session
    add_message_to_session(db, session_id, ChatMessageCreate(role="assistant", content=ai_response))
    
    return TherapyChatResponse(response=ai_response, chat_session_id=session_id)


def get_therapy_exercises(db: Session) -> List[TherapyExercise]:
    """
    Get all therapy exercises
    """
    return db.query(TherapyExercise).all() 