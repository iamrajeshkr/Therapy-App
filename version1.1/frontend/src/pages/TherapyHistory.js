import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatSessions } from '../redux/slices/chatSlice';
import './TherapyHistory.css';

const TherapyHistory = () => {
  const dispatch = useDispatch();
  const { sessions, isLoading, error } = useSelector(state => state.chat);

  useEffect(() => {
    dispatch(fetchChatSessions());
  }, [dispatch]);

  return (
    <div className="therapy-history-page">
      <div className="container">
        <div className="therapy-history-header">
          <h1>Therapy Session History</h1>
          <p>View and continue your previous therapy sessions</p>
        </div>

        {isLoading && (
          <div className="loading-indicator">
            <p>Loading sessions...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error loading sessions: {error}</p>
          </div>
        )}

        <div className="therapy-sessions-list">
          <div className="therapy-list-header">
            <div className="start-new-session">
              <Link to="/therapy" className="btn btn-primary">
                Start New Session
              </Link>
            </div>
            <div className="session-count">
              {sessions.length} {sessions.length === 1 ? 'Session' : 'Sessions'} Found
            </div>
          </div>

          {sessions.length === 0 && !isLoading ? (
            <div className="no-sessions-message">
              <p>You haven't had any therapy sessions yet.</p>
              <p>Start your first session to begin your mindfulness journey.</p>
              <Link to="/therapy" className="btn btn-primary">
                Start First Session
              </Link>
            </div>
          ) : (
            <div className="sessions-table">
              <div className="sessions-table-header">
                <div className="title-col">Session Title</div>
                <div className="date-col">Date</div>
                <div className="action-col">Actions</div>
              </div>
              {sessions.map(session => (
                <div key={session.id} className="session-row">
                  <div className="title-col">{session.title}</div>
                  <div className="date-col">{new Date(session.updated_at).toLocaleString()}</div>
                  <div className="action-col">
                    <Link to={`/therapy?session=${session.id}`} className="btn btn-secondary btn-sm">
                      Continue
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyHistory; 