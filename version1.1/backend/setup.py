#!/usr/bin/env python
"""
Setup script for the backend.
This script will:
1. Create a virtual environment (if it doesn't exist)
2. Install the required dependencies
3. Create the database and tables
4. Start the server
"""
import os
import sys
import subprocess
import platform

# Constants
VENV_DIR = "venv"
PYTHON_PATH = os.path.join(VENV_DIR, "Scripts" if platform.system() == "Windows" else "bin", "python")
PIP_PATH = os.path.join(VENV_DIR, "Scripts" if platform.system() == "Windows" else "bin", "pip")

def run_command(cmd, cwd=None):
    """Run a shell command and return the output"""
    print(f"Running command: {cmd}")
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            check=True, 
            cwd=cwd,
            capture_output=True,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}")
        print(f"Error message: {e.stderr}")
        return None

def create_venv():
    """Create a virtual environment if it doesn't exist"""
    if not os.path.exists(VENV_DIR):
        print("Creating virtual environment...")
        if run_command(f"python -m venv {VENV_DIR}") is None:
            return False
        print("Virtual environment created.")
    else:
        print("Virtual environment already exists.")
    return True

def install_dependencies():
    """Install the required dependencies"""
    print("Installing dependencies...")
    if os.path.exists("requirements_fixed.txt"):
        if run_command(f"{PIP_PATH} install -r requirements_fixed.txt") is None:
            return False
    else:
        print("Using fallback requirements approach...")
        # Install core dependencies one by one
        deps = [
            "fastapi==0.95.2",
            "uvicorn==0.22.0",
            "pydantic==1.10.8",
            "python-jose==3.3.0",
            "passlib==1.7.4",
            "bcrypt==4.0.1",
            "python-multipart==0.0.6",
            "sqlalchemy==1.4.42",
            "databases==0.7.0",
            "aiosqlite==0.19.0",
            "python-dotenv==1.0.0"
        ]
        for dep in deps:
            if run_command(f"{PIP_PATH} install {dep}") is None:
                return False
    
    print("Dependencies installed successfully.")
    return True

def start_server():
    """Start the server"""
    print("Starting the server...")
    
    # Instead of using subprocess, directly activate the virtualenv and run Python
    if platform.system() == "Windows":
        # For Windows, we use direct command execution for better error visibility
        print("Please run the following commands manually to start the server:")
        print(f"{VENV_DIR}\\Scripts\\activate")
        print(f"python start_server.py")
    else:
        # For Unix systems, we can create a helper script
        with open("run_server.sh", "w") as f:
            f.write("#!/bin/bash\n")
            f.write(f"source {VENV_DIR}/bin/activate\n")
            f.write("python start_server.py\n")
        os.chmod("run_server.sh", 0o755)
        print("Please run: ./run_server.sh")
    
    return True

def main():
    """Main function"""
    print("Setting up the backend...")
    
    if not create_venv():
        print("Failed to create virtual environment.")
        return 1
    
    if not install_dependencies():
        print("Failed to install dependencies.")
        return 1
    
    print("\nSetup completed successfully.")
    print("You can now start the server with:")
    if platform.system() == "Windows":
        print(f"{VENV_DIR}\\Scripts\\activate && python start_server.py")
    else:
        print(f"source {VENV_DIR}/bin/activate && python start_server.py")
    
    # Ask if the user wants to start the server now
    response = input("\nDo you want to start the server now? (y/n): ")
    if response.lower() in ["y", "yes"]:
        start_server()
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 