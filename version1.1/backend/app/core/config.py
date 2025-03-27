import os
from typing import List, Optional

# Use BaseSettings from pydantic if using Pydantic v1, 
# or directly use Settings for v2
try:
    from pydantic import BaseSettings
    
    class Settings(BaseSettings):
        """
        Application settings loaded from environment variables or .env file
        """
        # Base settings
        APP_NAME: str = "Mindfulness Therapy API"
        VERSION: str = "0.1.0"
        DESCRIPTION: str = "API for Mindfulness Therapy Application"
        API_PREFIX: str = "/api"
        
        # Security settings
        SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
        
        # Database settings
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./therapy.db")
        
        # CORS settings
        CORS_ORIGINS: List[str] = ["http://localhost:3000"]
        
        # Ollama settings
        OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "mistral")
        
        # Security
        ENCRYPTION_KEY: Optional[str] = os.getenv("ENCRYPTION_KEY")
        
        class Config:
            env_file = ".env"
            case_sensitive = True
    
except ImportError:
    # For Pydantic v2
    from pydantic_settings import BaseSettings, SettingsConfigDict
    
    class Settings(BaseSettings):
        """
        Application settings loaded from environment variables or .env file
        """
        # Base settings
        APP_NAME: str = "Mindfulness Therapy API"
        VERSION: str = "0.1.0"
        DESCRIPTION: str = "API for Mindfulness Therapy Application"
        API_PREFIX: str = "/api"
        
        # Security settings
        SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
        
        # Database settings
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./therapy.db")
        
        # CORS settings
        CORS_ORIGINS: List[str] = ["http://localhost:3000"]
        
        # Ollama settings
        OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "mistral")
        
        # Security
        ENCRYPTION_KEY: Optional[str] = os.getenv("ENCRYPTION_KEY")
        
        model_config = SettingsConfigDict(
            env_file=".env",
            case_sensitive=True
        )

# Initialize settings
settings = Settings() 