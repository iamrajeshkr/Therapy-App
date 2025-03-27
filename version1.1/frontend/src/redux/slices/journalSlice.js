import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/journal', { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch journal entries');
    }
  }
);

export const fetchJournalEntry = createAsyncThunk(
  'journal/fetchEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/journal/${entryId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch journal entry');
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/journal', entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not create journal entry');
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ entryId, entryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/journal/${entryId}`, entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not update journal entry');
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (entryId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/journal/${entryId}`);
      return entryId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not delete journal entry');
    }
  }
);

export const fetchJournalTags = createAsyncThunk(
  'journal/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/journal/tags');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch journal tags');
    }
  }
);

export const fetchJournalStats = createAsyncThunk(
  'journal/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/journal/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch journal statistics');
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: [],
    currentEntry: null,
    tags: [],
    stats: null,
    isLoading: false,
    error: null
  },
  reducers: {
    clearJournalError: (state) => {
      state.error = null;
    },
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch entries
      .addCase(fetchJournalEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = action.payload;
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch single entry
      .addCase(fetchJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEntry = action.payload;
      })
      .addCase(fetchJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create entry
      .addCase(createJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries.unshift(action.payload);
        state.currentEntry = action.payload;
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update entry
      .addCase(updateJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.entries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        state.currentEntry = action.payload;
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete entry
      .addCase(deleteJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        if (state.currentEntry && state.currentEntry.id === action.payload) {
          state.currentEntry = null;
        }
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tags
      .addCase(fetchJournalTags.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalTags.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tags = action.payload;
      })
      .addCase(fetchJournalTags.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch stats
      .addCase(fetchJournalStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchJournalStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearJournalError, setCurrentEntry } = journalSlice.actions;

export default journalSlice.reducer; 