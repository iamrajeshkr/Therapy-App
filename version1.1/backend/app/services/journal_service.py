"""
Journal service module.
Handles CRUD operations for journal entries, tags, and statistics.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.db.models import JournalEntry, JournalTag, JournalEntryTag
from app.schemas.journal import JournalEntryCreate, JournalEntryUpdate, JournalStats

def create_journal_entry(db: Session, user_id: str, entry_data: JournalEntryCreate) -> JournalEntry:
    """
    Create a new journal entry
    """
    # Create the journal entry
    db_entry = JournalEntry(
        user_id=user_id,
        title=entry_data.title,
        content=entry_data.content,
        mood_rating=entry_data.mood_rating
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    # Process tags if any
    if entry_data.tags:
        _add_tags_to_entry(db, db_entry.id, entry_data.tags)
        db.commit()
        db.refresh(db_entry)
    
    return db_entry

def get_journal_entry(db: Session, entry_id: str, user_id: str) -> Optional[JournalEntry]:
    """
    Retrieve a specific journal entry by ID
    """
    return db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == user_id
    ).first()

def get_journal_entries(
    db: Session, 
    user_id: str, 
    skip: int = 0, 
    limit: int = 20,
    tag: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> List[JournalEntry]:
    """
    Get journal entries for a user with optional filtering
    """
    query = db.query(JournalEntry).filter(JournalEntry.user_id == user_id)
    
    # Apply tag filter if provided
    if tag:
        query = query.join(JournalEntryTag).join(JournalTag).filter(JournalTag.name == tag)
    
    # Apply date filters if provided
    if start_date:
        try:
            start_date_obj = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(JournalEntry.created_at >= start_date_obj)
        except ValueError:
            # Ignore invalid date format
            pass
            
    if end_date:
        try:
            end_date_obj = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(JournalEntry.created_at <= end_date_obj)
        except ValueError:
            # Ignore invalid date format
            pass
    
    # Order by most recent first
    return query.order_by(JournalEntry.created_at.desc()).offset(skip).limit(limit).all()

def update_journal_entry(
    db: Session, 
    entry_id: str, 
    user_id: str, 
    entry_data: JournalEntryUpdate
) -> Optional[JournalEntry]:
    """
    Update a journal entry
    """
    db_entry = get_journal_entry(db, entry_id, user_id)
    if not db_entry:
        return None
    
    # Update fields
    if entry_data.title is not None:
        db_entry.title = entry_data.title
    if entry_data.content is not None:
        db_entry.content = entry_data.content
    if entry_data.mood_rating is not None:
        db_entry.mood_rating = entry_data.mood_rating
    
    # Update tags if provided
    if entry_data.tags is not None:
        # Remove old tags
        db.query(JournalEntryTag).filter(JournalEntryTag.journal_entry_id == entry_id).delete()
        # Add new tags
        _add_tags_to_entry(db, entry_id, entry_data.tags)
    
    db.commit()
    db.refresh(db_entry)
    return db_entry

def delete_journal_entry(db: Session, entry_id: str, user_id: str) -> bool:
    """
    Delete a journal entry
    """
    db_entry = get_journal_entry(db, entry_id, user_id)
    if not db_entry:
        return False
    
    # Delete associated tags first
    db.query(JournalEntryTag).filter(JournalEntryTag.journal_entry_id == entry_id).delete()
    
    # Delete the entry
    db.delete(db_entry)
    db.commit()
    return True

def get_journal_tags(db: Session, user_id: str) -> List[JournalTag]:
    """
    Get all tags used by a user's journal entries
    """
    return (db.query(JournalTag)
              .join(JournalEntryTag)
              .join(JournalEntry)
              .filter(JournalEntry.user_id == user_id)
              .distinct()
              .all())

def get_journal_stats(db: Session, user_id: str) -> JournalStats:
    """
    Get statistics about the user's journal entries
    """
    # Count total entries
    total_entries = db.query(func.count(JournalEntry.id)).filter(
        JournalEntry.user_id == user_id
    ).scalar() or 0
    
    # Count entries in last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_entries = db.query(func.count(JournalEntry.id)).filter(
        JournalEntry.user_id == user_id,
        JournalEntry.created_at >= thirty_days_ago
    ).scalar() or 0
    
    # Get most used tags
    tag_counts = (db.query(JournalTag.name, func.count(JournalTag.id).label('count'))
                    .join(JournalEntryTag)
                    .join(JournalEntry)
                    .filter(JournalEntry.user_id == user_id)
                    .group_by(JournalTag.name)
                    .order_by(func.count(JournalTag.id).desc())
                    .limit(5)
                    .all())
    
    top_tags = [tag for tag, _ in tag_counts]
    
    return JournalStats(
        total_entries=total_entries,
        recent_entries=recent_entries,
        top_tags=top_tags
    )

def _add_tags_to_entry(db: Session, entry_id: str, tag_names: List[str]):
    """
    Helper function to add tags to a journal entry
    """
    for tag_name in tag_names:
        # Get or create tag
        tag = db.query(JournalTag).filter(JournalTag.name == tag_name).first()
        if not tag:
            tag = JournalTag(name=tag_name)
            db.add(tag)
            db.flush()  # Get the ID without committing
        
        # Create association
        entry_tag = JournalEntryTag(journal_entry_id=entry_id, tag_id=tag.id)
        db.add(entry_tag) 