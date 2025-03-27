#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Starts both the backend and frontend of the Mindfulness Therapy Application.
.DESCRIPTION
    This script starts both the backend and frontend of the Mindfulness Therapy Application.
    It uses PowerShell jobs to run them in parallel.
#>

$ErrorActionPreference = "Stop"

function Start-Backend {
    Write-Host "Starting the backend..." -ForegroundColor Green
    
    $backendDir = Join-Path -Path $PSScriptRoot -ChildPath "backend"
    
    # Check if the batch file exists
    $batchFile = Join-Path -Path $backendDir -ChildPath "start_backend.bat"
    if (Test-Path $batchFile) {
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c", $batchFile
    } else {
        # Try using the setup script
        $setupScript = Join-Path -Path $backendDir -ChildPath "setup.py"
        if (Test-Path $setupScript) {
            Start-Process -FilePath "python" -ArgumentList $setupScript -WorkingDirectory $backendDir
        } else {
            Write-Host "Backend startup files not found. Please set up the backend manually." -ForegroundColor Red
            return $false
        }
    }
    
    # Wait a bit for the backend to start
    Start-Sleep -Seconds 5
    return $true
}

function Start-Frontend {
    Write-Host "Starting the frontend..." -ForegroundColor Green
    
    $frontendDir = Join-Path -Path $PSScriptRoot -ChildPath "frontend"
    
    # Check if node_modules exists
    $nodeModules = Join-Path -Path $frontendDir -ChildPath "node_modules"
    if (-not (Test-Path $nodeModules)) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Start-Process -FilePath "npm" -ArgumentList "install" -WorkingDirectory $frontendDir -Wait
    }
    
    # Start the frontend
    Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory $frontendDir
    
    return $true
}

function Test-BackendHealth {
    Write-Host "Testing backend health..." -ForegroundColor Yellow
    
    # Try to ping the backend health endpoint
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -Method GET -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "Backend is healthy!" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "Backend is not responding yet. Waiting..." -ForegroundColor Yellow
        return $false
    }
    
    return $false
}

# Main script
Write-Host "Starting the Mindfulness Therapy Application..." -ForegroundColor Cyan

# Start the backend
$backendStarted = Start-Backend

# Check backend health for a while
$attempts = 0
$maxAttempts = 10
$backendHealthy = $false

while (-not $backendHealthy -and $attempts -lt $maxAttempts) {
    $attempts++
    $backendHealthy = Test-BackendHealth
    if (-not $backendHealthy) {
        Start-Sleep -Seconds 3
    }
}

if (-not $backendHealthy) {
    Write-Host "Warning: Could not confirm backend health. Frontend may not work properly." -ForegroundColor Yellow
    $continueAnyway = Read-Host "Do you want to start the frontend anyway? (y/n)"
    if ($continueAnyway -ne "y") {
        Write-Host "Setup aborted. Please check the backend logs." -ForegroundColor Red
        exit 1
    }
}

# Start the frontend
$frontendStarted = Start-Frontend

if ($backendStarted -and $frontendStarted) {
    Write-Host "`nApplication is now running!" -ForegroundColor Green
    Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "Frontend UI: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop the application when done." -ForegroundColor Yellow
} else {
    Write-Host "Failed to start the application. Please check the logs." -ForegroundColor Red
    exit 1
}

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 10
    }
} finally {
    Write-Host "Shutting down..." -ForegroundColor Yellow
} 