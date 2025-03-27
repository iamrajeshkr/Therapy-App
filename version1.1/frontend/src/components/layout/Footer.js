import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-column">
          <h3>Mindfulness Therapy</h3>
          <p>A private, secure therapy application for your mental wellbeing.</p>
        </div>
        
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/therapy">Therapy</Link></li>
            <li><Link to="/journal">Journal</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Important Information</h4>
          <ul className="footer-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Use</Link></li>
            <li><Link to="/disclaimer">Medical Disclaimer</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h4>Disclaimer</h4>
          <p className="disclaimer">
            This application is not a substitute for professional mental health treatment. 
            If you're experiencing a crisis, please contact emergency services or a mental health professional.
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>© {currentYear} Mindfulness Therapy. All rights reserved.</p>
          <p>100% Private. Your data never leaves your device.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 