"""
Database migration script to add the conversation_summary column to chat_sessions table
"""
import sqlite3
import os
from app.core.config import settings

def run_migration():
    """Run the database migration"""
    # Extract database path from the DATABASE_URL
    db_path = settings.DATABASE_URL.replace('sqlite:///', '')
    
    # Check if the database file exists
    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return False
    
    try:
        # Connect to the database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if the conversation_summary column already exists
        cursor.execute("PRAGMA table_info(chat_sessions)")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]
        
        if 'conversation_summary' not in column_names:
            # Add the conversation_summary column
            cursor.execute("ALTER TABLE chat_sessions ADD COLUMN conversation_summary TEXT")
            conn.commit()
            print("Added conversation_summary column to chat_sessions table")
        else:
            print("conversation_summary column already exists in chat_sessions table")
        
        conn.close()
        return True
    except Exception as e:
        print(f"Error during migration: {e}")
        return False

if __name__ == "__main__":
    success = run_migration()
    if success:
        print("Migration completed successfully.")
    else:
        print("Migration failed.") 