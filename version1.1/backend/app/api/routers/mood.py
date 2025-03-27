from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.deps import get_current_user
from app.schemas.mood import (
    MoodEntry,
    MoodEntryCreate,
    MoodStats,
)
from app.services.mood_service import (
    create_mood_entry,
    get_mood_entries,
    get_mood_entry,
    get_mood_stats,
)

router = APIRouter()


@router.post("", response_model=MoodEntry)
def create_entry(
    entry_data: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Record a new mood entry
    """
    return create_mood_entry(db, current_user.id, entry_data)


@router.get("", response_model=List[MoodEntry])
def list_entries(
    skip: int = 0,
    limit: int = 30,
    start_date: str = None,
    end_date: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List mood entries with optional filtering
    """
    return get_mood_entries(
        db, 
        current_user.id, 
        skip=skip, 
        limit=limit, 
        start_date=start_date,
        end_date=end_date
    )


@router.get("/stats", response_model=MoodStats)
def get_stats(
    period: str = "month",  # day, week, month, year
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get mood statistics and trends
    """
    return get_mood_stats(db, current_user.id, period)


@router.get("/{entry_id}", response_model=MoodEntry)
def get_entry(
    entry_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific mood entry
    """
    entry = get_mood_entry(db, entry_id, current_user.id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mood entry not found"
        )
    return entry 