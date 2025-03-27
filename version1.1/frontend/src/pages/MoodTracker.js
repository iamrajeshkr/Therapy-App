import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoodEntries, fetchMoodStats } from '../redux/slices/moodSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './MoodTracker.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodTracker = () => {
  const dispatch = useDispatch();
  const { entries, stats, isLoading, error } = useSelector(state => state.mood);
  const [period, setPeriod] = useState('month');
  
  // Fetch mood data when component mounts
  useEffect(() => {
    dispatch(fetchMoodEntries());
    dispatch(fetchMoodStats(period));
  }, [dispatch, period]);
  
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

  // Format mood data for chart
  const chartData = {
    labels: stats.mood_trend?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Mood',
        data: stats.mood_trend?.map(item => item.mood_score) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Energy',
        data: stats.mood_trend?.map(item => item.energy_level) || [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Stress',
        data: stats.mood_trend?.map(item => item.stress_level) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Sleep',
        data: stats.mood_trend?.map(item => item.sleep_quality) || [],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Mood Over Time',
      },
    },
  };
  
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };
  
  return (
    <div className="mood-tracker-page">
      <div className="container">
        <div className="page-header">
          <h1>Mood Tracker</h1>
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
            <p>Loading your mood data...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2>No Mood Entries Yet</h2>
            <p>Start tracking your mood to gain insights into your emotional patterns.</p>
            <Link to="/mood-tracker/new" className="btn btn-primary">
              Log Your First Mood
            </Link>
          </div>
        ) : (
          <div className="mood-content">
            <div className="mood-chart-container">
              <div className="period-selectors">
                <button 
                  className={`period-btn ${period === 'week' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('week')}
                >
                  Week
                </button>
                <button 
                  className={`period-btn ${period === 'month' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('month')}
                >
                  Month
                </button>
                <button 
                  className={`period-btn ${period === 'year' ? 'active' : ''}`}
                  onClick={() => handlePeriodChange('year')}
                >
                  Year
                </button>
              </div>
              
              <div className="chart-container">
                {stats.mood_trend && stats.mood_trend.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="chart-placeholder">
                    Not enough data to show trends
                  </div>
                )}
              </div>
              
              <div className="mood-stats">
                <div className="stat-item">
                  <span className="stat-label">Average Mood</span>
                  <span className="stat-value">{stats.average_mood.toFixed(1)}/10</span>
                </div>
                {stats.average_energy !== null && (
                  <div className="stat-item">
                    <span className="stat-label">Energy Level</span>
                    <span className="stat-value">{stats.average_energy.toFixed(1)}/10</span>
                  </div>
                )}
                {stats.average_stress !== null && (
                  <div className="stat-item">
                    <span className="stat-label">Stress Level</span>
                    <span className="stat-value">{stats.average_stress.toFixed(1)}/10</span>
                  </div>
                )}
                {stats.average_sleep !== null && (
                  <div className="stat-item">
                    <span className="stat-label">Sleep Quality</span>
                    <span className="stat-value">{stats.average_sleep.toFixed(1)}/10</span>
                  </div>
                )}
                <div className="stat-item">
                  <span className="stat-label">Total Entries</span>
                  <span className="stat-value">{stats.entry_count}</span>
                </div>
              </div>
            </div>
            
            <div className="mood-entries-list">
              <h2>Recent Entries</h2>
              {entries.slice(0, 5).map(entry => (
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
              {entries.length > 5 && (
                <div className="view-all-link">
                  <Link to="/mood-tracker/history">View All Entries</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker; 