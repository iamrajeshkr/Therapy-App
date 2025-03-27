from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ChatMessageBase(BaseModel):
    """Base chat message schema"""
    role: str
    content: str


class ChatMessageCreate(ChatMessageBase):
    """Schema for creating a chat message"""
    pass


class ChatMessage(ChatMessageBase):
    """Schema for chat message response"""
    id: str
    chat_session_id: str
    timestamp: datetime
    
    class Config:
        orm_mode = True


class ChatSessionBase(BaseModel):
    """Base chat session schema"""
    title: Optional[str] = "New Chat"


class ChatSessionCreate(ChatSessionBase):
    """Schema for creating a chat session"""
    pass


class ChatSession(ChatSessionBase):
    """Schema for chat session response"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessage] = []
    
    class Config:
        orm_mode = True


class ChatSessionSummary(ChatSessionBase):
    """Summary schema for chat session (without messages)"""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class TherapyExerciseBase(BaseModel):
    """Base therapy exercise schema"""
    title: str
    description: str
    category: str
    duration_minutes: Optional[int] = None
    instructions: str


class TherapyExerciseCreate(TherapyExerciseBase):
    """Schema for creating a therapy exercise"""
    pass


class TherapyExercise(TherapyExerciseBase):
    """Schema for therapy exercise response"""
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class ExerciseCompletionBase(BaseModel):
    """Base exercise completion schema"""
    notes: Optional[str] = None
    rating: Optional[int] = None


class ExerciseCompletionCreate(ExerciseCompletionBase):
    """Schema for creating an exercise completion"""
    exercise_id: str


class ExerciseCompletion(ExerciseCompletionBase):
    """Schema for exercise completion response"""
    id: str
    user_id: str
    exercise_id: str
    completed_at: datetime
    
    class Config:
        orm_mode = True


class TherapyChatRequest(BaseModel):
    """Schema for therapy chat request"""
    message: str
    chat_session_id: Optional[str] = None
    
    
class TherapyChatResponse(BaseModel):
    """Schema for therapy chat response"""
    response: str
    chat_session_id: str 