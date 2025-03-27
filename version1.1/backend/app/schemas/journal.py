from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class JournalTagBase(BaseModel):
    """Base journal tag schema"""
    name: str


class JournalTagCreate(JournalTagBase):
    """Schema for creating a journal tag"""
    pass


class JournalTag(JournalTagBase):
    """Schema for journal tag response"""
    id: str
    
    class Config:
        orm_mode = True


class JournalEntryBase(BaseModel):
    """Base journal entry schema"""
    title: str
    content: str
    mood_rating: Optional[int] = None


class JournalEntryCreate(JournalEntryBase):
    """Schema for creating a journal entry"""
    tags: Optional[List[str]] = []


class JournalEntryUpdate(BaseModel):
    """Schema for updating a journal entry"""
    title: Optional[str] = None
    content: Optional[str] = None
    mood_rating: Optional[int] = None
    tags: Optional[List[str]] = None


class JournalEntry(JournalEntryBase):
    """Schema for journal entry response"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    tags: List[JournalTag] = []
    
    class Config:
        orm_mode = True


class JournalEntrySummary(BaseModel):
    """Summary schema for journal entry (without content)"""
    id: str
    title: str
    mood_rating: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class JournalStats(BaseModel):
    """Schema for journal statistics"""
    total_entries: int
    entries_this_week: int
    entries_this_month: int
    average_mood: Optional[float] = None
    most_used_tags: List[str] = [] 