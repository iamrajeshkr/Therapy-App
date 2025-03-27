#!/usr/bin/env python
"""
Quick fix script for the backend.
This script will install the essential dependencies directly,
bypassing virtual environment issues.
"""
import os
import sys
import subprocess
import platform

# Define essential packages
ESSENTIAL_PACKAGES = [
    "fastapi==0.95.0",
    "uvicorn==0.22.0",
    "pydantic==1.10.7",
    "python-jose==3.3.0",
    "passlib==1.7.4",
    "bcrypt==4.0.1",
    "python-multipart==0.0.6",
    "sqlalchemy==1.4.42",
    "databases==0.7.0",
    "aiosqlite==0.19.0",
    "python-dotenv==1.0.0"
]

def run_command(cmd):
    """Run a command and print output"""
    print(f"Running: {cmd}")
    try:
        result = subprocess.run(
            cmd, 
            shell=True, 
            check=True, 
            text=True,
            capture_output=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print(f"Output: {e.stdout}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    """Main function"""
    print("Quick Fix for Mindfulness Therapy Backend")
    print("========================================")
    
    # 1. Ensure pip is updated
    print("\nUpdating pip...")
    run_command(f"{sys.executable} -m pip install --upgrade pip")
    
    # 2. Install essential packages
    print("\nInstalling essential packages...")
    for package in ESSENTIAL_PACKAGES:
        success = run_command(f"{sys.executable} -m pip install {package}")
        if not success:
            print(f"Warning: Failed to install {package}")
    
    # 3. Create a test script to verify imports
    print("\nCreating test script...")
    test_script = "test_imports.py"
    with open(test_script, "w") as f:
        f.write("import fastapi\n")
        f.write("import uvicorn\n")
        f.write("import pydantic\n")
        f.write("import sqlalchemy\n")
        f.write("print('All essential packages imported successfully!')\n")
    
    # 4. Run the test script
    print("\nTesting imports...")
    success = run_command(f"{sys.executable} {test_script}")
    if success:
        print("\nImport test successful!")
    
    # 5. Remove the test script
    os.remove(test_script)
    
    print("\nQuick fix complete. Now try running:")
    print(f"{sys.executable} direct_start.py")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 