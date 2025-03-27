import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Mindfulness Therapy</h1>
            <p className="hero-subtitle">
              A private, secure application for your mental wellbeing journey
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-secondary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Complete Privacy</h3>
              <p>Your data never leaves your device. All processing happens locally.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>AI Therapy Conversations</h3>
              <p>Engage with an AI therapy assistant for mindfulness exercises and support.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Mood Tracking</h3>
              <p>Track your emotional states over time and gain insights into patterns.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📓</div>
              <h3>Journaling</h3>
              <p>Document your thoughts and feelings in a secure, private journal.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Account</h3>
              <p>Set up your secure, local account to get started.</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Initial Assessment</h3>
              <p>Complete a brief assessment to personalize your experience.</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Engage With Therapy</h3>
              <p>Start conversations with your AI therapy assistant and track your moods.</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track Progress</h3>
              <p>View insights and track your mindfulness journey over time.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="disclaimer-section">
        <div className="container">
          <div className="disclaimer-box">
            <h3>Important Disclaimer</h3>
            <p>
              This application is not a substitute for professional mental health treatment. 
              If you're experiencing a crisis or severe mental health symptoms, please contact 
              emergency services or a mental health professional immediately.
            </p>
            <p>
              The AI therapy assistant is designed to provide mindfulness exercises and general 
              support but cannot diagnose or treat clinical conditions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 