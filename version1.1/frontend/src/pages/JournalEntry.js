import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournalEntry, deleteJournalEntry } from '../redux/slices/journalSlice';
import './JournalEntry.css';

const JournalEntry = () => {
  const { entryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEntry, isLoading, error } = useSelector(state => state.journal);

  useEffect(() => {
    if (entryId) {
      dispatch(fetchJournalEntry(entryId));
    }
  }, [dispatch, entryId]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      dispatch(deleteJournalEntry(entryId))
        .unwrap()
        .then(() => {
          navigate('/journal');
        });
    }
  };

  if (isLoading) {
    return (
      <div className="journal-entry-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading journal entry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="journal-entry-page">
        <div className="container">
          <div className="error-state">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/journal" className="btn btn-primary">Back to Journal</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="journal-entry-page">
        <div className="container">
          <div className="not-found-state">
            <h2>Entry Not Found</h2>
            <p>The journal entry you're looking for doesn't exist.</p>
            <Link to="/journal" className="btn btn-primary">Back to Journal</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-entry-page">
      <div className="container">
        <div className="entry-header">
          <div className="entry-header-top">
            <Link to="/journal" className="back-link">
              ← Back to Journal
            </Link>
            <div className="entry-actions">
              <Link to={`/journal/${entryId}/edit`} className="btn btn-secondary">
                Edit
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
          <h1>{currentEntry.title}</h1>
          <div className="entry-meta">
            <div className="entry-date">
              {new Date(currentEntry.created_at).toLocaleDateString()} at {new Date(currentEntry.created_at).toLocaleTimeString()}
            </div>
            {currentEntry.mood_rating && (
              <div className="mood-indicator">
                <span>Mood: </span>
                <span className="mood-score">{currentEntry.mood_rating}/10</span>
              </div>
            )}
          </div>
          {currentEntry.tags && currentEntry.tags.length > 0 && (
            <div className="entry-tags">
              {currentEntry.tags.map(tag => (
                <span key={tag.id} className="entry-tag">{tag.name}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="entry-content">
          {currentEntry.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalEntry; 