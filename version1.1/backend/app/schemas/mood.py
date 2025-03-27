from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date


class MoodEntryBase(BaseModel):
    """Base mood entry schema"""
    mood_score: int = Field(..., ge=1, le=10)
    energy_level: Optional[int] = Field(None, ge=1, le=10)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = None


class MoodEntryCreate(MoodEntryBase):
    """Schema for creating a mood entry"""
    pass


class MoodEntry(MoodEntryBase):
    """Schema for mood entry response"""
    id: str
    user_id: str
    recorded_at: datetime
    
    class Config:
        orm_mode = True


class MoodStats(BaseModel):
    """Schema for mood statistics"""
    average_mood: float
    average_energy: Optional[float] = None
    average_stress: Optional[float] = None
    average_sleep: Optional[float] = None
    mood_trend: List[Dict[str, Any]] = []  # List of daily mood scores
    
    
class MoodTrend(BaseModel):
    """Schema for mood trend data"""
    date: date
    mood_score: float
    energy_level: Optional[float] = None
    stress_level: Optional[float] = None
    sleep_quality: Optional[float] = None 