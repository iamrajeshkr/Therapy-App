import os
import sys
import uvicorn
import importlib.util

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        "fastapi", "uvicorn", "sqlalchemy", "pydantic", 
        "python-jose", "passlib", "bcrypt", "python-multipart"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        spec = importlib.util.find_spec(package)
        if spec is None:
            missing_packages.append(package)
    
    if missing_packages:
        print("Error: Missing required packages:")
        for package in missing_packages:
            print(f"  - {package}")
        print("\nPlease install them using:")
        print(f"pip install -r requirements_fixed.txt")
        return False
    
    return True

def check_env_file():
    """Check if .env file exists"""
    if not os.path.exists(".env"):
        print("Warning: .env file not found. Using default settings.")
        # This is okay as we have defaults in Settings class
    return True

if __name__ == "__main__":
    print("Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    print("Checking environment configuration...")
    if not check_env_file():
        sys.exit(1)
    
    print("Starting server...")
    try:
        uvicorn.run(
            "app.main:app", 
            host="0.0.0.0", 
            port=8000, 
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1) 