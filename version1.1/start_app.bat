@echo off
echo Starting the Mindfulness Therapy Application...

echo Starting the backend...
start cmd /k "cd backend && start_backend.bat"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak

echo Starting the frontend...
start cmd /k "cd frontend && npm start"

echo.
echo The application is now running:
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:3000
echo.
echo Press any key to exit this window (the application will continue running)
pause > nul 