import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMoodEntries } from '../redux/slices/moodSlice';
import './MoodHistory.css';

const MoodHistory = () => {
  const dispatch = useDispatch();
  const { entries, isLoading, error } = useSelector(state => state.mood);
  const [filter, setFilter] = useState('all'); // all, week, month
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc
  
  useEffect(() => {
    dispatch(fetchMoodEntries({ timeframe: filter !== 'all' ? filter : undefined }));
  }, [dispatch, filter]);
  
  const moodLabels = {
    1: 'Very Low',
    2: 'Low',
    3: 'Somewhat Low',
    4: 'Below Average',
    5: 'Average',
    6: 'Somewhat Good',
    7: 'Good',
    8: 'Very Good',
    9: 'Excellent',
    10: 'Perfect'
  };
  
  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.recorded_at);
    const dateB = new Date(b.recorded_at);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };
  
  return (
    <div className="mood-history-page">
      <div className="container">
        <div className="page-header">
          <div className="title-section">
            <h1>Mood History</h1>
            <Link to="/mood-tracker" className="back-link">
              &larr; Back to Mood Tracker
            </Link>
          </div>
          <Link to="/mood-tracker/new" className="btn btn-primary">
            Log New Mood
          </Link>
        </div>
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        {isLoading && entries.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your mood history...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No Mood Entries Yet</h2>
            <p>Start tracking your mood to build your history.</p>
            <Link to="/mood-tracker/new" className="btn btn-primary">
              Log Your First Mood
            </Link>
          </div>
        ) : (
          <div className="history-content">
            <div className="filters-bar">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Time
                </button>
                <button 
                  className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('month')}
                >
                  This Month
                </button>
                <button 
                  className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('week')}
                >
                  This Week
                </button>
              </div>
              <button 
                className="sort-button"
                onClick={toggleSortOrder}
              >
                Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
            
            <div className="entries-grid">
              {sortedEntries.map(entry => (
                <div key={entry.id} className="mood-entry-card">
                  <div className="mood-entry-header">
                    <div className="mood-score">
                      <span className="score-value">{entry.mood_score}</span>
                      <span className="score-label">{moodLabels[entry.mood_score]}</span>
                    </div>
                    <div className="entry-date">
                      {new Date(entry.recorded_at).toLocaleDateString()} at {new Date(entry.recorded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="mood-notes">
                      <p>{entry.notes}</p>
                    </div>
                  )}
                  <div className="mood-factors">
                    {entry.energy_level && (
                      <div className="factor">
                        <span className="factor-label">Energy:</span>
                        <span className="factor-value">{entry.energy_level}/10</span>
                      </div>
                    )}
                    {entry.stress_level && (
                      <div className="factor">
                        <span className="factor-label">Stress:</span>
                        <span className="factor-value">{entry.stress_level}/10</span>
                      </div>
                    )}
                    {entry.sleep_quality && (
                      <div className="factor">
                        <span className="factor-label">Sleep:</span>
                        <span className="factor-value">{entry.sleep_quality}/10</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodHistory; 