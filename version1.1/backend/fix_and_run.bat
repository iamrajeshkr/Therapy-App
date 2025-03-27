@echo off
echo Mindfulness Therapy Backend - Fix and Run Tool
echo =============================================
echo.

echo Step 1: Running quick fix to ensure all dependencies are installed...
python quick_fix.py

echo.
echo Step 2: Running debug diagnostics...
python debug_setup.py

echo.
echo Step 3: Starting the server...
echo Choose server type:
echo 1. Standalone server (recommended for most reliable operation)
echo 2. Direct start (simpler API start)
echo 3. Full server (may have dependency issues)
echo.

set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" (
    echo Starting standalone server...
    python standalone_server.py
) else if "%choice%"=="2" (
    echo Starting with direct start...
    python direct_start.py
) else if "%choice%"=="3" (
    echo Starting full server...
    python start_server.py
) else (
    echo Invalid choice. Starting standalone server by default...
    python standalone_server.py
)

pause 