@echo off
echo Starting the Mindfulness Therapy Backend (Standalone Mode)...
echo This is a simplified version that should work without complex dependencies.
echo.

echo Installing minimal required packages...
pip install fastapi uvicorn

echo.
echo Starting the server...
python standalone_server.py

pause 