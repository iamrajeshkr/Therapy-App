import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournalEntries, fetchJournalTags, deleteJournalEntry } from '../redux/slices/journalSlice';
import './Journal.css';

const Journal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { entries, tags, isLoading, error } = useSelector(state => state.journal);
  const [filter, setFilter] = useState({ tag: null, dateRange: null });

  // Load journal entries and tags when component mounts
  useEffect(() => {
    dispatch(fetchJournalEntries());
    dispatch(fetchJournalTags());
  }, [dispatch]);

  // Filter entries by tag
  const handleTagFilter = (tagName) => {
    setFilter(prev => ({
      ...prev,
      tag: prev.tag === tagName ? null : tagName
    }));
  };

  // Handle entry deletion
  const handleDeleteEntry = (entryId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      dispatch(deleteJournalEntry(entryId));
    }
  };

  // Navigate to entry detail page
  const handleEntryClick = (entryId) => {
    navigate(`/journal/${entryId}`);
  };

  // Get filtered entries
  const filteredEntries = entries.filter(entry => {
    // Tag filter
    if (filter.tag && (!entry.tags || !entry.tags.find(t => t.name === filter.tag))) {
      return false;
    }
    
    // Could add date filter logic here
    
    return true;
  });

  return (
    <div className="journal-page">
      <div className="container">
        <div className="journal-header">
          <h1>Journal</h1>
          <Link to="/journal/new" className="btn btn-primary">New Entry</Link>
        </div>
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        {isLoading && entries.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your journal entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📓</div>
            <h2>No Journal Entries Yet</h2>
            <p>Start your mindfulness journey by recording your thoughts and feelings.</p>
            <Link to="/journal/new" className="btn btn-primary">Write First Entry</Link>
          </div>
        ) : (
          <>
            <div className="journal-filters">
              <div className="tag-filters">
                {tags.map(tag => (
                  <button 
                    key={tag.id} 
                    className={`tag-filter ${filter.tag === tag.name ? 'active' : ''}`}
                    onClick={() => handleTagFilter(tag.name)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="journal-entries">
              {filteredEntries.map(entry => (
                <div 
                  key={entry.id} 
                  className="journal-entry-card"
                  onClick={() => handleEntryClick(entry.id)}
                >
                  <div className="entry-header">
                    <h3>{entry.title}</h3>
                    <span className="entry-date">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {entry.content && (
                    <p className="entry-preview">
                      {entry.content.length > 150 
                        ? `${entry.content.substring(0, 150)}...` 
                        : entry.content}
                    </p>
                  )}
                  
                  <div className="entry-footer">
                    <div className="entry-tags">
                      {entry.tags && entry.tags.map(tag => (
                        <span key={tag.id} className="entry-tag">{tag.name}</span>
                      ))}
                    </div>
                    
                    {entry.mood_rating && (
                      <div className="mood-indicator">
                        <span>Mood: </span>
                        <span className="mood-score">{entry.mood_rating}/10</span>
                      </div>
                    )}
                    
                    <div className="entry-actions">
                      <Link 
                        to={`/journal/${entry.id}/edit`} 
                        className="edit-link"
                        onClick={e => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <button 
                        className="delete-button"
                        onClick={(e) => handleDeleteEntry(entry.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Journal; 