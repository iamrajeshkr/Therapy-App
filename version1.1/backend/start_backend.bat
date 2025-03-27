@echo off
echo Starting the Mindfulness Therapy Backend...

if not exist venv (
    echo Virtual environment not found. Running setup script...
    python setup.py
    exit /b
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting the server...
echo Note: Press Ctrl+C to stop the server when finished.
echo.

rem Using the simpler direct start script
python direct_start.py

rem If the above fails, try the regular start_server script
if %ERRORLEVEL% NEQ 0 (
    echo Direct start failed, trying alternative method...
    python start_server.py
)

pause 