# Mindfulness Therapy Application

This application provides therapy assistance, mood tracking, and journaling features to help with mental health and mindfulness.

## Project Structure

- `/frontend` - React-based frontend
- `/backend` - FastAPI-based backend

## Setup and Running Instructions

### Backend (API)

#### Quick Start (Windows)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the startup batch file:
   ```
   start_backend.bat
   ```

#### Manual Setup (All Platforms)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Use the setup script to automatically set up everything:
   ```
   python setup.py
   ```
   
   Or follow the manual setup instructions in the backend README.

3. Access the API documentation at:
   - http://localhost:8000/docs

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies (if not done already):
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at:
   - http://localhost:3000

## Running Both Parts

1. Start the backend first (using the instructions above)
2. In a separate terminal, start the frontend
3. The application will automatically connect to the backend API

## Features

- **Therapy Chat**: AI-powered therapeutic chat sessions
- **Mood Tracking**: Record and track your mood over time
- **Journaling**: Keep a digital journal of thoughts and feelings
- **Analytics**: View trends and insights about your mental well-being

## Troubleshooting

### Backend Issues

- If you experience dependency issues, try installing the dependencies one by one:
  ```
  pip install fastapi==0.95.2 uvicorn==0.22.0 pydantic==1.10.8 python-jose==3.3.0 passlib==1.7.4 bcrypt==4.0.1 python-multipart==0.0.6 sqlalchemy==1.4.42 databases==0.7.0 aiosqlite==0.19.0 python-dotenv==1.0.0
  ```

- If you're using Python 3.13, some packages might not be compatible. Try using Python 3.11.

### Frontend Issues

- If you encounter package resolution issues:
  ```
  npm install --force
  ```

- If the frontend can't connect to the backend, make sure the backend is running and check the browser console for errors.

## Technology Stack

- **Frontend**: React.js with Redux for state management
- **Backend**: Python (FastAPI)
- **Database**: SQLite
- **LLM**: Ollama (Local inference)
- **Authentication**: JWT with local storage

## Core Features

1. User Management
   - Local authentication
   - User profiles
   - Mental health tracking

2. Therapy Agent
   - Conversational AI therapy interface
   - Mood tracking and analysis
   - Personalized recommendations
   - Journaling capabilities

3. Privacy-focused Design
   - Fully local, no cloud dependencies
   - End-to-end encryption
   - User-controlled data

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python 3.7+
- [Ollama](https://ollama.ai/) - For local LLM inference
- Git

### Ollama Setup

1. Install Ollama from https://ollama.ai/
2. Pull a model (recommended: mistral):
   ```
   ollama pull mistral
   ```
3. Start the Ollama server:
   ```
   ollama serve
   ```

## Environment Variables

For the backend, you can create a `.env` file in the backend directory with these variables:

```
SECRET_KEY=your_secure_secret_key
OLLAMA_MODEL=mistral
OLLAMA_BASE_URL=http://localhost:11434
```

## Development

- Backend API documentation: http://localhost:8000/docs
- Frontend development server: http://localhost:3000

## Privacy and Security

This application is designed to keep all data local and secure:

1. All data is stored in a local SQLite database
2. The LLM runs locally via Ollama
3. Authentication is managed using JWT tokens stored in local storage
4. No data is sent to external servers

## License

MIT 