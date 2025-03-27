"""
Debug setup script for the backend.
This script checks for common issues and helps resolve them.
"""
import os
import sys
import importlib
import platform
import subprocess

def check_python_version():
    """Check Python version"""
    print(f"Python version: {platform.python_version()}")
    if sys.version_info < (3, 8):
        print("WARNING: Python version below 3.8 may cause compatibility issues.")
        print("Recommended: Python 3.8-3.11")
    elif sys.version_info >= (3, 12):
        print("WARNING: Python 3.12+ may have compatibility issues with some packages.")
        print("Recommended: Python 3.8-3.11")
    else:
        print("Python version is compatible.")
    
def check_dependencies():
    """Check if required dependencies are installed"""
    packages = [
        "fastapi", "uvicorn", "pydantic", "sqlalchemy", 
        "python-jose", "passlib", "bcrypt", "python-multipart"
    ]
    
    missing = []
    installed = []
    
    for package in packages:
        try:
            module = importlib.import_module(package)
            version = getattr(module, "__version__", "unknown")
            installed.append(f"{package} ({version})")
        except ImportError:
            missing.append(package)
    
    print("\nInstalled packages:")
    for pkg in installed:
        print(f"✓ {pkg}")
    
    if missing:
        print("\nMissing packages:")
        for pkg in missing:
            print(f"✗ {pkg}")
        
        print("\nTo install missing packages, run:")
        if os.path.exists("requirements_fixed.txt"):
            print("pip install -r requirements_fixed.txt")
        else:
            print("pip install " + " ".join(missing))
        return False
    
    return True

def check_database():
    """Check database access"""
    print("\nChecking database configuration...")
    try:
        from app.core.config import settings
        print(f"Database URL: {settings.DATABASE_URL}")
        
        # Check if we can import the database module
        from app.db import database
        print("Database module imported successfully.")
        
        # Try to create tables
        try:
            print("Attempting to create database tables...")
            database.create_db_and_tables()
            print("Database tables created successfully.")
        except Exception as e:
            print(f"Error creating database tables: {e}")
            return False
            
    except ImportError as e:
        print(f"Error importing database modules: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False
    
    return True

def test_api_startup():
    """Test starting the API"""
    print("\nTesting API startup...")
    try:
        print("Importing FastAPI app...")
        from app.main import app
        print("FastAPI app imported successfully.")
        
        print("Testing endpoint definitions...")
        routes = [route for route in app.routes]
        print(f"Found {len(routes)} route(s).")
        
        # Print a few routes for verification
        print("Sample routes:")
        for route in routes[:3]:
            print(f"- {route.path}")
            
        return True
    except ImportError as e:
        print(f"Error importing app: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def main():
    """Main function"""
    print("Mindfulness Therapy API Debug Tool")
    print("=================================\n")
    
    # Check Python version
    check_python_version()
    
    # Check dependencies
    deps_ok = check_dependencies()
    if not deps_ok:
        print("\nDependency check failed. Please install missing dependencies.")
    
    # Check database
    db_ok = check_database()
    if not db_ok:
        print("\nDatabase check failed. Please check your database configuration.")
    
    # Test API startup
    api_ok = test_api_startup()
    if not api_ok:
        print("\nAPI startup test failed. Please check error messages above.")
    
    # Overall status
    print("\nDebug Summary:")
    print(f"- Dependencies: {'OK' if deps_ok else 'FAILED'}")
    print(f"- Database: {'OK' if db_ok else 'FAILED'}")
    print(f"- API: {'OK' if api_ok else 'FAILED'}")
    
    if deps_ok and db_ok and api_ok:
        print("\nAll checks passed. You should be able to start the server with:")
        print("python direct_start.py")
    else:
        print("\nSome checks failed. Please fix the issues before starting the server.")
    
    return 0 if (deps_ok and db_ok and api_ok) else 1

if __name__ == "__main__":
    sys.exit(main()) 