import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendChatMessage, fetchChatSessions, fetchChatMessages, setCurrentSession } from '../redux/slices/chatSlice';
import './TherapyChat.css';

const TherapyChat = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // Get data from Redux store
  const { isLoading, error: reduxError, currentSession, messages: reduxMessages, sessions } = useSelector(state => state.chat);
  
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your mindfulness therapy assistant. How are you feeling today?" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);

  // Parse session ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session');
    
    if (sessionId) {
      // Fetch messages for this session
      dispatch(fetchChatMessages(sessionId))
        .unwrap()
        .then(sessionData => {
          if (sessionData && sessionData.messages) {
            setMessages(sessionData.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })));
          }
        })
        .catch(error => {
          console.error('Error fetching session:', error);
          setError('Failed to load chat session. Starting a new one.');
          // Clear session ID from URL
          navigate('/therapy', { replace: true });
        });
    } else {
      // Ensure we're starting a new session
      dispatch(setCurrentSession(null));
    }
  }, [dispatch, location.search, navigate]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to fetch chat sessions when component mounts
  useEffect(() => {
    dispatch(fetchChatSessions());
  }, [dispatch]);

  // Effect to update messages from Redux if we have them
  useEffect(() => {
    if (reduxMessages && reduxMessages.length > 0) {
      const formattedMessages = reduxMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      setMessages(formattedMessages);
    }
  }, [reduxMessages]);

  // Effect to update error from Redux
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message to UI immediately
    const userMessage = { role: 'user', content: newMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    setError(null);
    
    try {
      // Dispatch the action to send message via Redux
      const resultAction = await dispatch(
        sendChatMessage({ 
          message: newMessage, 
          chatSessionId: currentSession 
        })
      );
      
      // Check if the action was fulfilled
      if (sendChatMessage.fulfilled.match(resultAction)) {
        // Add assistant response from the API
        setMessages([
          ...updatedMessages,
          { 
            role: 'assistant', 
            content: resultAction.payload.response 
          }
        ]);
        
        // If we got a new session ID and it's not in the URL, update the URL
        if (resultAction.payload.chat_session_id && !location.search.includes('session=')) {
          navigate(`/therapy?session=${resultAction.payload.chat_session_id}`, { replace: true });
        }
      } else {
        // Handle rejection - message is already shown via the error state
        setMessages([
          ...updatedMessages,
          { 
            role: 'assistant', 
            content: "I'm having trouble connecting to my therapy assistant right now. Please try again in a moment."
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to get a response. Please try again.');
    }
  };

  return (
    <div className="therapy-chat-page">
      <div className="container">
        <div className="chat-container">
          <div className="chat-header">
            <h1>Therapy Chat</h1>
            {sessions && sessions.length > 0 && currentSession && (
              <div className="session-info">
                {sessions.find(s => s.id === currentSession)?.title || 'Current Session'}
              </div>
            )}
            {error && <div className="error-banner">{error}</div>}
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message message-${message.role}`}>
                {message.content}
              </div>
            ))}
            
            {isLoading && (
              <div className="message message-assistant loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            
            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !newMessage.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapyChat; 