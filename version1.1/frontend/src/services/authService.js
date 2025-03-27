import axios from 'axios';
import api, { API_URL, getErrorMessage } from './apiService';

// Auth service functions
const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        // Since our backend doesn't return the user, we'll create a simplified user object
        const user = {
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return {
        token: response.data.access_token,
        user: {
          username: userData.username,
          email: userData.email,
          full_name: userData.full_name
        }
      };
    } catch (error) {
      console.error('Registration error:', error.response);
      throw new Error(getErrorMessage(error));
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      // Convert our credentials to form data format expected by OAuth2 login endpoint
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      // OAuth2 endpoints expect form data, not JSON
      const response = await axios.post(
        `${API_URL}/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // Get user profile with the new token
        try {
          const userResponse = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${response.data.access_token}`
            }
          });
          
          localStorage.setItem('user', JSON.stringify(userResponse.data));
          
          return {
            token: response.data.access_token,
            user: userResponse.data
          };
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Return just the token if profile fetch fails
          return {
            token: response.data.access_token,
            user: { username: credentials.username }
          };
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response);
      throw new Error(getErrorMessage(error));
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  // Check if token is still valid
  validateToken: async () => {
    try {
      const response = await api.post('/auth/validate');
      return response.data;
    } catch (error) {
      // If token validation fails, log the user out
      authService.logout();
      throw error;
    }
  }
};

export default authService; 