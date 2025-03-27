# Mindfulness Therapy Frontend

React frontend for the Mindfulness Therapy application.

## Getting Started

Follow these instructions to run the frontend application.

### Prerequisites

- Node.js 16 or later
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

### Running the Application

Start the development server:

```bash
npm start
# or
yarn start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Connecting to the Backend

The frontend is configured to connect to the backend API running at `http://localhost:8000`. Make sure the backend server is running before using the frontend application.

### Backend Connection Steps

1. Start the backend server first (in a separate terminal):
   ```bash
   cd ../backend
   python manual_start.py  # or another start script
   ```

2. Start the frontend (in this directory):
   ```bash
   npm start
   ```

3. Verify the connection:
   - The Health Check indicator in the UI should show "Connected" if the backend is running
   - You should be able to register/login using the authentication page

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Therapy Chat**: AI-powered therapy chat sessions
- **Mood Tracking**: Track and visualize mood patterns
- **Journaling**: Record daily thoughts and feelings

## Troubleshooting

If you encounter connection issues with the backend:

1. Check that the backend server is running and accessible at http://localhost:8000
2. Verify that the API URL is correctly configured in `src/api/config.js`
3. Check browser console for any CORS or network errors
4. If needed, restart both the backend and frontend services

## Development

This frontend is built with:

- React - UI library
- Redux Toolkit - State management
- React Router - Navigation
- Material UI - Component library

## Project Structure

- `/src/components` - React components
- `/src/redux` - Redux state management
- `/src/pages` - Page components
- `/src/services` - API services
- `/src/utils` - Utility functions
- `/src/hooks` - Custom React hooks

## State Management

This project uses Redux for state management with the following slices
- auth: User authentication state
- chat: Chat history and current conversation
- mood: Mood tracking data
- journal: Journal entries
- settings: User application settings 
