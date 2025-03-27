import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchMoodEntries = createAsyncThunk(
  'mood/fetchEntries',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/mood', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch mood entries');
    }
  }
);

export const fetchMoodStats = createAsyncThunk(
  'mood/fetchStats',
  async (period = 'month', { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/mood/stats?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch mood statistics');
    }
  }
);

export const createMoodEntry = createAsyncThunk(
  'mood/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/mood', entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not create mood entry');
    }
  }
);

export const getMoodEntry = createAsyncThunk(
  'mood/getEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/mood/${entryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch mood entry');
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [],
    currentEntry: null,
    stats: {
      average_mood: 0,
      average_energy: 0,
      average_stress: 0,
      average_sleep: 0,
      entry_count: 0,
      period: 'month',
      mood_trend: []
    },
    isLoading: false,
    error: null
  },
  reducers: {
    clearMoodError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchMoodEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMoodEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
      })
      .addCase(fetchMoodEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch stats
      .addCase(fetchMoodStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMoodStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchMoodStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create entry
      .addCase(createMoodEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries.unshift(action.payload);
      })
      .addCase(createMoodEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get single entry
      .addCase(getMoodEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEntry = action.payload;
      })
      .addCase(getMoodEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMoodError, setCurrentEntry } = moodSlice.actions;

export default moodSlice.reducer; 