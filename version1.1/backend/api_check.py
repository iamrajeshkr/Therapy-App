"""
API Endpoint Verification Script
This script loads the FastAPI application and prints all available routes.
"""
import sys
import importlib.util
from pathlib import Path

def import_app():
    """Import the app from app.main"""
    try:
        from app.main import app
        return app
    except Exception as e:
        print(f"Error importing app: {e}")
        sys.exit(1)

def print_header(message):
    """Print a formatted header"""
    print(f"\n{'='*80}")
    print(f"{message.center(80)}")
    print(f"{'='*80}\n")

def main():
    print_header("API ENDPOINT VERIFICATION")
    
    # Import the FastAPI app
    app = import_app()
    
    # Print app info
    print(f"App Title: {app.title}")
    print(f"App Version: {app.version}")
    
    # Retrieve all routes
    print_header("AVAILABLE ROUTES")
    
    for route in app.routes:
        # Get HTTP methods
        methods = getattr(route, "methods", None)
        if methods:
            methods_str = ", ".join(methods)
        else:
            methods_str = "N/A"
        
        # Get path
        path = getattr(route, "path", None)
        
        # Get name (endpoint function name)
        name = getattr(route, "name", None)
        
        if path and name:
            print(f"{methods_str.ljust(20)} {path.ljust(40)} {name}")
    
    print("\nTotal Routes:", len(app.routes))
    
    # Check for typical missing endpoint patterns
    essential_endpoints = [
        ("/api/auth/login", "Login endpoint"),
        ("/api/auth/register", "Registration endpoint"),
        ("/api/therapy/sessions", "Therapy sessions endpoint"),
        ("/api/mood", "Mood tracking endpoint"),
        ("/api/journal", "Journal entries endpoint"),
    ]
    
    print_header("ESSENTIAL ENDPOINTS CHECK")
    
    all_paths = [route.path for route in app.routes if hasattr(route, "path")]
    
    for endpoint, description in essential_endpoints:
        if any(endpoint in path for path in all_paths):
            print(f"✅ {description} found")
        else:
            print(f"❌ {description} not found - potential issue")
    
    print("\nAPI verification complete!")

if __name__ == "__main__":
    main() 