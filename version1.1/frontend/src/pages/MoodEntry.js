import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createMoodEntry } from '../redux/slices/moodSlice';
import './MoodEntry.css';

const MoodEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.mood);
  
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [notes, setNotes] = useState('');
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const moodData = {
      mood_score: moodScore,
      energy_level: energyLevel,
      stress_level: stressLevel,
      sleep_quality: sleepQuality,
      notes: notes.trim() || null,
    };
    
    const resultAction = await dispatch(createMoodEntry(moodData));
    if (createMoodEntry.fulfilled.match(resultAction)) {
      navigate('/mood-tracker');
    }
  };
  
  const handleCancel = () => {
    navigate('/mood-tracker');
  };
  
  return (
    <div className="mood-entry-page">
      <div className="container">
        <h1>Log Your Mood</h1>
        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}
        
        <form className="mood-entry-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label className="slider-label">
              <span className="label-text">How do you feel today?</span>
              <span className="label-value">{moodScore} - {moodLabels[moodScore]}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={moodScore} 
              onChange={(e) => setMoodScore(parseInt(e.target.value))}
              className="slider-input"
            />
            <div className="scale-markers">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
          </div>
          
          <div className="form-section">
            <label className="slider-label">
              <span className="label-text">Energy Level</span>
              <span className="label-value">{energyLevel}/10</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={energyLevel} 
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="slider-input"
            />
          </div>
          
          <div className="form-section">
            <label className="slider-label">
              <span className="label-text">Stress Level</span>
              <span className="label-value">{stressLevel}/10</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={stressLevel} 
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="slider-input"
            />
          </div>
          
          <div className="form-section">
            <label className="slider-label">
              <span className="label-text">Sleep Quality</span>
              <span className="label-value">{sleepQuality}/10</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={sleepQuality} 
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="slider-input"
            />
          </div>
          
          <div className="form-section">
            <label htmlFor="notes" className="text-label">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's influencing your mood today? Any notable events or thoughts?"
              className="notes-input"
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Mood Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodEntry; 