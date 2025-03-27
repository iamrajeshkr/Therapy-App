/**
 * API Service
 * Central service for handling API requests
 */
import axios from 'axios';

// Base URL for the API
export const API_URL = 'http://localhost:8000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiry
    if (error.response && error.response.status === 401) {
      // Clear local storage if token is invalid/expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper for formulating error messages
export const getErrorMessage = (error) => {
  // Handle validation errors (422)
  if (error.response?.status === 422) {
    const details = error.response.data?.detail;
    if (Array.isArray(details) && details.length > 0) {
      return details.map(err => `${err.loc[err.loc.length-1]}: ${err.msg}`).join(', ');
    }
  }
  
  return (
    error.message || 
    error.response?.data?.message || 
    'An error occurred. Please try again.'
  );
};

export default api; 