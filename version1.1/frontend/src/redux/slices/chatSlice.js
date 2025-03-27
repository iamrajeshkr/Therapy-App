import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchChatSessions = createAsyncThunk(
  'chat/fetchSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/therapy/sessions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch chat sessions');
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/therapy/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not fetch chat messages');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, chatSessionId = null }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/therapy/chat', {
        message,
        chat_session_id: chatSessionId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Could not send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    currentSession: null,
    messages: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    clearChatError: (state) => {
      state.error = null;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch sessions
      .addCase(fetchChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload.id;
        state.messages = action.payload.messages;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload.chat_session_id;
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentSession, clearChatError, addMessage } = chatSlice.actions;

export default chatSlice.reducer; 