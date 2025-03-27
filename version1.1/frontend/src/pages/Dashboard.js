import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatSessions } from '../redux/slices/chatSlice';
import { fetchJournalEntries } from '../redux/slices/journalSlice';
import { fetchMoodEntries, fetchMoodStats } from '../redux/slices/moodSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { sessions } = useSelector(state => state.chat);
  const { entries: journalEntries } = useSelector(state => state.journal);
  const { entries: moodEntries, stats: moodStats } = useSelector(state => state.mood);
  
  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchChatSessions());
    dispatch(fetchJournalEntries());
    dispatch(fetchMoodEntries());
    dispatch(fetchMoodStats('month'));
  }, [dispatch]);
  
  // Stats with actual data where available
  const stats = {
    lastLogin: new Date().toLocaleString(),
    journalEntries: journalEntries.length,
    moodEntries: moodEntries.length,
    therapySessions: sessions.length,
    exercises: 0
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.username || 'User'}</h1>
          <p className="last-login">Last login: {stats.lastLogin}</p>
        </div>
        
        <div className="stats-container">
          <div className="stats-card">
            <h3>Journal Entries</h3>
            <div className="stats-number">{stats.journalEntries}</div>
            <Link to="/journal" className="btn btn-primary btn-sm">View</Link>
          </div>
          
          <div className="stats-card">
            <h3>Mood Logs</h3>
            <div className="stats-number">{stats.moodEntries}</div>
            <Link to="/mood-tracker" className="btn btn-primary btn-sm">Track Mood</Link>
          </div>
          
          <div className="stats-card">
            <h3>Therapy Sessions</h3>
            <div className="stats-number">{stats.therapySessions}</div>
            <Link to="/therapy-history" className="btn btn-primary btn-sm">View</Link>
          </div>
          
          <div className="stats-card">
            <h3>Exercises Completed</h3>
            <div className="stats-number">{stats.exercises}</div>
            <Link to="/exercises" className="btn btn-primary btn-sm">View Exercises</Link>
          </div>
        </div>
        
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/therapy" className="btn btn-primary">
                Start Therapy Session
              </Link>
              <Link to="/journal/new" className="btn btn-primary">
                New Journal Entry
              </Link>
              <Link to="/mood-tracker/new" className="btn btn-primary">
                Log Current Mood
              </Link>
            </div>
          </div>
          
          <div className="dashboard-section">
            <h2>Mindfulness Reminder</h2>
            <div className="mindfulness-card">
              <p className="quote">
                "The present moment is the only time over which we have dominion."
              </p>
              <p className="author">— Thích Nhất Hạnh</p>
              <div className="breathing-exercise">
                <p>Take a moment to breathe:</p>
                <div className="breathing-circle"></div>
                <p className="breathing-instruction">Breathe in... Breathe out...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 