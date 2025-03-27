import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Profile.css';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [settings, setSettings] = useState({
    theme: 'light',
    notification_enabled: true,
    privacy_level: 2,
    therapy_model: 'mistral'
  });
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would dispatch an action to update settings
    alert('Settings would be saved in a real implementation');
  };
  
  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile Settings</h1>
        
        <div className="profile-container">
          <div className="profile-section user-info">
            <h2>Account Information</h2>
            <div className="user-info-details">
              <div className="info-item">
                <span className="label">Username:</span>
                <span className="value">{user?.username || 'Username'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="info-item">
                <span className="label">Full Name:</span>
                <span className="value">{user?.full_name || '-'}</span>
              </div>
              <div className="info-item">
                <span className="label">Account Created:</span>
                <span className="value">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString() 
                    : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="profile-section settings">
            <h2>Application Settings</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="theme">Theme</label>
                <select 
                  id="theme" 
                  name="theme" 
                  className="form-control"
                  value={settings.theme}
                  onChange={handleInputChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="notification_enabled"
                  name="notification_enabled"
                  checked={settings.notification_enabled}
                  onChange={handleInputChange}
                />
                <label htmlFor="notification_enabled">Enable Notifications</label>
              </div>
              
              <div className="form-group">
                <label htmlFor="privacy_level">Privacy Level</label>
                <select 
                  id="privacy_level" 
                  name="privacy_level" 
                  className="form-control"
                  value={settings.privacy_level}
                  onChange={handleInputChange}
                >
                  <option value="1">Low - Store all data</option>
                  <option value="2">Medium - Store limited data</option>
                  <option value="3">High - Minimize data storage</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="therapy_model">Therapy AI Model</label>
                <select 
                  id="therapy_model" 
                  name="therapy_model" 
                  className="form-control"
                  value={settings.therapy_model}
                  onChange={handleInputChange}
                >
                  <option value="mistral">Mistral (Default)</option>
                  <option value="llama2">Llama 2</option>
                  <option value="openhermes">OpenHermes</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </form>
          </div>
          
          <div className="profile-section data-management">
            <h2>Data Management</h2>
            <p className="data-management-info">
              All your data is stored locally on your device. No information is sent to external servers.
            </p>
            <div className="data-management-actions">
              <button className="btn btn-secondary">Export Data</button>
              <button className="btn btn-danger">Delete All Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 