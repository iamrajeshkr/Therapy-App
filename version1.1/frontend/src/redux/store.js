import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    mood: moodReducer,
    journal: journalReducer,
    settings: settingsReducer,
  },
  // Add middleware for local storage persistence if needed
});

// Optional: Setup for persisting state to localStorage
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('mindfulness-therapy-state', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('mindfulness-therapy-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
}; 