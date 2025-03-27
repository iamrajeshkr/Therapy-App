import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      // This would be replaced with a real API call
      // const response = await api.get('/api/auth/settings');
      // return response.data;
      
      // Return placeholder data for now
      return {
        theme: 'light',
        notification_enabled: true,
        privacy_level: 2,
        therapy_model: 'mistral'
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch user settings');
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      // This would be replaced with a real API call
      // const response = await api.put('/api/auth/settings', settingsData);
      // return response.data;
      
      // Return placeholder data for now
      return {
        ...settingsData
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not update user settings');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    theme: 'light',
    notification_enabled: true,
    privacy_level: 2,
    therapy_model: 'mistral',
    isLoading: false,
    error: null
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchUserSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        return {
          ...state,
          ...action.payload
        };
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update settings
      .addCase(updateUserSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        return {
          ...state,
          ...action.payload
        };
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSettingsError, setTheme } = settingsSlice.actions;

export default settingsSlice.reducer; 