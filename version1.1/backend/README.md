# Mindfulness Therapy Backend

This is the backend API for the Mindfulness Therapy application.

## Getting Started

Follow these instructions to run the backend server.

### Prerequisites

- Python 3.8 or later
- pip (Python package installer)

### Installation

1. Create a virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

### Running the Server

We provide multiple options to run the server, depending on your needs:

#### Option 1: Manual Start (Recommended)

This script runs each step one by one, showing detailed output:

```bash
python manual_start.py
```

#### Option 2: Simple Start

If you're experiencing issues with the server reload functionality (especially on Windows):

```bash
python simple_start.py
```

#### Option 3: API Verification

To check if all API endpoints are correctly configured:

```bash
python api_check.py
```

#### Option 4: Original Start Script

```bash
python start_server.py
```

## API Endpoints

The API provides the following main endpoints:

- `/api/auth/` - Authentication endpoints (login, register)
- `/api/therapy/` - Therapy session endpoints
- `/api/mood/` - Mood tracking endpoints
- `/api/journal/` - Journal entry endpoints

For a full list of endpoints, run the server and visit `/docs`

## Troubleshooting

If you encounter issues:

1. **Database errors**: Check if SQLite is working correctly and the database file exists
2. **Import errors**: Ensure your Python path is correctly set and all dependencies are installed
3. **Server reload errors**: Try using `simple_start.py` which disables the reload functionality
4. **API endpoint errors**: Run `api_check.py` to verify all endpoints are correctly registered

## Development

The backend is built with:

- FastAPI - Modern, fast web framework
- SQLAlchemy - SQL toolkit and ORM
- Pydantic - Data validation and settings management

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Environment variables can be set in a `.env` file:

- `DATABASE_URL`: Database connection string (default: sqlite:///./therapy.db)
- `SECRET_KEY`: Secret key for JWT token generation
- `ALGORITHM`: Algorithm for JWT token generation (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time in minutes

## Health Check

To verify that the API is running correctly, use the health check endpoint:
```
GET http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
``` 