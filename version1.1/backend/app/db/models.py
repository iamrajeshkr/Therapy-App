from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from app.db.database import Base

def generate_uuid():
    """Generate a unique UUID"""
    return str(uuid.uuid4())

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(100))
    full_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    chat_sessions = relationship("ChatSession", back_populates="user")
    journal_entries = relationship("JournalEntry", back_populates="user")
    mood_entries = relationship("MoodEntry", back_populates="user")
    user_settings = relationship("UserSettings", back_populates="user", uselist=False)

class UserSettings(Base):
    """User settings model"""
    __tablename__ = "user_settings"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    theme = Column(String(20), default="light")
    notification_enabled = Column(Boolean, default=True)
    privacy_level = Column(Integer, default=2)  # 1: Low, 2: Medium, 3: High
    therapy_model = Column(String(50), default="mistral")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_settings")

class ChatSession(Base):
    """Chat session model"""
    __tablename__ = "chat_sessions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String(100), default="New Chat")
    conversation_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="chat_session")

class ChatMessage(Base):
    """Chat message model"""
    __tablename__ = "chat_messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    chat_session_id = Column(String(36), ForeignKey("chat_sessions.id"))
    role = Column(String(10))  # "user" or "assistant"
    content = Column(Text)
    timestamp = Column(DateTime, default=func.now())
    
    # Relationships
    chat_session = relationship("ChatSession", back_populates="messages")

class JournalEntry(Base):
    """Journal entry model"""
    __tablename__ = "journal_entries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    title = Column(String(200))
    content = Column(Text)
    mood_rating = Column(Integer, nullable=True)  # 1-10 rating
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="journal_entries")
    tags = relationship("JournalTag", secondary="journal_entry_tags")

class JournalTag(Base):
    """Journal tag model"""
    __tablename__ = "journal_tags"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True)
    
    # Relationships
    # This is set up through the association table

class JournalEntryTag(Base):
    """Journal entry tag association model"""
    __tablename__ = "journal_entry_tags"
    
    journal_entry_id = Column(String(36), ForeignKey("journal_entries.id"), primary_key=True)
    tag_id = Column(String(36), ForeignKey("journal_tags.id"), primary_key=True)

class MoodEntry(Base):
    """Mood entry model"""
    __tablename__ = "mood_entries"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    mood_score = Column(Integer)  # 1-10 rating
    energy_level = Column(Integer, nullable=True)  # 1-10 rating
    stress_level = Column(Integer, nullable=True)  # 1-10 rating
    sleep_quality = Column(Integer, nullable=True)  # 1-10 rating
    notes = Column(Text, nullable=True)
    recorded_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="mood_entries")

class TherapyExercise(Base):
    """Therapy exercise model"""
    __tablename__ = "therapy_exercises"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(100))
    description = Column(Text)
    category = Column(String(50))  # meditation, breathing, cognitive, etc.
    duration_minutes = Column(Integer, nullable=True)
    instructions = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    completions = relationship("ExerciseCompletion", back_populates="exercise")

class ExerciseCompletion(Base):
    """Exercise completion model"""
    __tablename__ = "exercise_completions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"))
    exercise_id = Column(String(36), ForeignKey("therapy_exercises.id"))
    completed_at = Column(DateTime, default=func.now())
    notes = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5 rating
    
    # Relationships
    exercise = relationship("TherapyExercise", back_populates="completions") 