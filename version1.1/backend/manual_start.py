"""
Manual startup script for the backend.
This script explicitly goes through each critical initialization step.
"""
import os
import sys
import time

def print_step(step, message):
    """Print a step with formatting"""
    print(f"\n{'='*80}")
    print(f"STEP {step}: {message}")
    print(f"{'='*80}\n")

def main():
    print_step(1, "Checking Python environment")
    import platform
    print(f"Python version: {platform.python_version()}")
    
    print_step(2, "Setting up environment variables")
    # Ensure .env file is loaded
    try:
        from dotenv import load_dotenv
        # Load environment variables from .env file
        env_loaded = load_dotenv()
        print(f"Environment variables loaded: {env_loaded}")
    except ImportError:
        print("Warning: python-dotenv not installed, using default settings")
    
    print_step(3, "Initializing database")
    try:
        # Run database migration first
        print("Running database migrations...")
        from migrate_db import run_migration
        migration_success = run_migration()
        if migration_success:
            print("Database migrations completed successfully")
        else:
            print("Warning: Database migrations may not have completed successfully")
        
        # Then create tables
        from app.db.database import create_db_and_tables
        create_db_and_tables()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        return 1
    
    print_step(4, "Starting API server")
    print("Starting server without hot reload (for maximum compatibility)")
    
    try:
        import uvicorn
        print("Server will start in 3 seconds...")
        time.sleep(3)
        
        # Start server with minimal configuration (no reload)
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=False,
            log_level="info"
        )
        return 0
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 