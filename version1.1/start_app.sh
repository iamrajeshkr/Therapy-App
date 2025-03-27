#!/bin/bash
# Start script for the Mindfulness Therapy Application
# This script starts both the backend and frontend

# Stop on errors
set -e

# Function to start the backend
start_backend() {
    echo "Starting the backend..."
    
    cd "$(dirname "$0")/backend"
    
    # Check if setup.py exists
    if [ -f "setup.py" ]; then
        python setup.py
    else
        # Manual setup
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python -m venv venv
        fi
        
        echo "Activating virtual environment..."
        source venv/bin/activate
        
        if [ -f "requirements_fixed.txt" ]; then
            echo "Installing dependencies..."
            pip install -r requirements_fixed.txt
        else
            echo "Installing core dependencies..."
            pip install fastapi==0.95.2 uvicorn==0.22.0 pydantic==1.10.8 python-jose==3.3.0 passlib==1.7.4 bcrypt==4.0.1 python-multipart==0.0.6 sqlalchemy==1.4.42 databases==0.7.0 aiosqlite==0.19.0 python-dotenv==1.0.0
        fi
        
        # Start the server in the background
        echo "Starting the server..."
        python start_server.py &
    fi
    
    # Return to the root directory
    cd ..
}

# Function to start the frontend
start_frontend() {
    echo "Starting the frontend..."
    
    cd "$(dirname "$0")/frontend"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # Start the frontend
    npm start
}

# Function to check backend health
check_backend_health() {
    echo "Checking backend health..."
    
    # Try to ping the backend health endpoint
    for i in {1..10}; do
        if curl -s http://localhost:8000/api/health > /dev/null; then
            echo "Backend is healthy!"
            return 0
        fi
        
        echo "Backend not ready, waiting..."
        sleep 3
    done
    
    echo "Warning: Could not confirm backend health. Frontend may not work properly."
    read -p "Do you want to start the frontend anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup aborted. Please check the backend logs."
        exit 1
    fi
}

# Main script
echo "Starting the Mindfulness Therapy Application..."

# Start the backend in the background
start_backend &

# Give it a moment to initialize
sleep 5

# Check backend health
check_backend_health

# Start the frontend
start_frontend

# Keep the script running (this will be overtaken by the npm start command)
wait 