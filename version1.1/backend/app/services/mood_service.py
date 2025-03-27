"""
Mood tracking service module.
Handles CRUD operations for mood entries and provides mood statistics.
"""
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.models import MoodEntry
from app.schemas.mood import MoodEntryCreate, MoodStats

def create_mood_entry(db: Session, user_id: str, mood_data: MoodEntryCreate) -> MoodEntry:
    """
    Create a new mood entry for a user
    """
    db_mood = MoodEntry(
        user_id=user_id,
        mood_score=mood_data.mood_score,
        energy_level=mood_data.energy_level,
        stress_level=mood_data.stress_level,
        sleep_quality=mood_data.sleep_quality,
        notes=mood_data.notes
    )
    db.add(db_mood)
    db.commit()
    db.refresh(db_mood)
    return db_mood

def get_mood_entry(db: Session, entry_id: str, user_id: str) -> Optional[MoodEntry]:
    """
    Retrieve a specific mood entry by ID
    """
    return db.query(MoodEntry).filter(
        MoodEntry.id == entry_id,
        MoodEntry.user_id == user_id
    ).first()

def get_mood_entries(
    db: Session, 
    user_id: str, 
    skip: int = 0, 
    limit: int = 30,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> List[MoodEntry]:
    """
    Get all mood entries for a user with optional date filtering
    """
    query = db.query(MoodEntry).filter(MoodEntry.user_id == user_id)
    
    # Apply date filters if provided
    if start_date:
        try:
            start_date_obj = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(MoodEntry.recorded_at >= start_date_obj)
        except ValueError:
            # Ignore invalid date format
            pass
            
    if end_date:
        try:
            end_date_obj = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(MoodEntry.recorded_at <= end_date_obj)
        except ValueError:
            # Ignore invalid date format
            pass
    
    # Order by most recent first
    return query.order_by(MoodEntry.recorded_at.desc()).offset(skip).limit(limit).all()

def get_mood_stats(db: Session, user_id: str, period: str = "month") -> MoodStats:
    """
    Calculate mood statistics and trends for a given time period
    """
    now = datetime.now()
    
    # Determine date range based on period
    if period == "day":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=now.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "year":
        start_date = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    else:  # Default to month
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Query entries within the time period
    entries = db.query(MoodEntry).filter(
        and_(
            MoodEntry.user_id == user_id,
            MoodEntry.recorded_at >= start_date,
            MoodEntry.recorded_at <= now
        )
    ).all()
    
    # Calculate statistics
    if not entries:
        return MoodStats(
            average_mood=0,
            average_energy=0,
            average_stress=0,
            average_sleep=0,
            entry_count=0,
            period=period
        )
    
    # Calculate averages
    mood_scores = [entry.mood_score for entry in entries if entry.mood_score is not None]
    energy_levels = [entry.energy_level for entry in entries if entry.energy_level is not None]
    stress_levels = [entry.stress_level for entry in entries if entry.stress_level is not None]
    sleep_quality = [entry.sleep_quality for entry in entries if entry.sleep_quality is not None]
    
    return MoodStats(
        average_mood=sum(mood_scores) / len(mood_scores) if mood_scores else 0,
        average_energy=sum(energy_levels) / len(energy_levels) if energy_levels else 0,
        average_stress=sum(stress_levels) / len(stress_levels) if stress_levels else 0,
        average_sleep=sum(sleep_quality) / len(sleep_quality) if sleep_quality else 0,
        entry_count=len(entries),
        period=period
    ) 