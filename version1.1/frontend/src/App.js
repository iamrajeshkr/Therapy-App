import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TherapyChat from './pages/TherapyChat';
import TherapyHistory from './pages/TherapyHistory';
import Journal from './pages/Journal';
import JournalEntry from './pages/JournalEntry';
import JournalEditor from './pages/JournalEditor';
import MoodTracker from './pages/MoodTracker';
import MoodEntry from './pages/MoodEntry';
import MoodHistory from './pages/MoodHistory';
import Profile from './pages/Profile';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="/disclaimer" element={<Legal type="disclaimer" />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/therapy" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TherapyChat />
            </PrivateRoute>
          } />
          
          <Route path="/therapy-history" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TherapyHistory />
            </PrivateRoute>
          } />
          
          <Route path="/journal" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Journal />
            </PrivateRoute>
          } />
          
          <Route path="/journal/new" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <JournalEditor />
            </PrivateRoute>
          } />
          
          <Route path="/journal/:entryId" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <JournalEntry />
            </PrivateRoute>
          } />
          
          <Route path="/journal/:entryId/edit" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <JournalEditor />
            </PrivateRoute>
          } />
          
          <Route path="/mood-tracker" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MoodTracker />
            </PrivateRoute>
          } />
          
          <Route path="/mood-tracker/new" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MoodEntry />
            </PrivateRoute>
          } />
          
          <Route path="/mood-tracker/history" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MoodHistory />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </PrivateRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 