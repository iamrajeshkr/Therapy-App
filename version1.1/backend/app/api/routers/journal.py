from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import User
from app.core.deps import get_current_user
from app.schemas.journal import (
    JournalEntry,
    JournalEntrySummary,
    JournalEntryCreate,
    JournalEntryUpdate,
    JournalTag,
    JournalStats,
)
from app.services.journal_service import (
    create_journal_entry,
    get_journal_entries,
    get_journal_entry,
    update_journal_entry,
    delete_journal_entry,
    get_journal_tags,
    get_journal_stats,
)

router = APIRouter()


@router.post("", response_model=JournalEntry)
def create_entry(
    entry_data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new journal entry
    """
    return create_journal_entry(db, current_user.id, entry_data)


@router.get("", response_model=List[JournalEntrySummary])
def list_entries(
    skip: int = 0,
    limit: int = 20,
    tag: str = None,
    start_date: str = None,
    end_date: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List journal entries with optional filtering
    """
    return get_journal_entries(
        db, 
        current_user.id, 
        skip=skip, 
        limit=limit, 
        tag=tag,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/stats", response_model=JournalStats)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get journal statistics
    """
    return get_journal_stats(db, current_user.id)


@router.get("/tags", response_model=List[JournalTag])
def list_tags(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all journal tags used by the user
    """
    return get_journal_tags(db, current_user.id)


@router.get("/{entry_id}", response_model=JournalEntry)
def get_entry(
    entry_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific journal entry
    """
    entry = get_journal_entry(db, entry_id, current_user.id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return entry


@router.put("/{entry_id}", response_model=JournalEntry)
def update_entry(
    entry_id: str,
    entry_data: JournalEntryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a journal entry
    """
    entry = update_journal_entry(db, entry_id, current_user.id, entry_data)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a journal entry
    """
    success = delete_journal_entry(db, entry_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return None 