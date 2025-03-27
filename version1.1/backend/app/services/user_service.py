from datetime import timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.db.models import User, UserSettings
from app.schemas.user import UserCreate, UserSettings as UserSettingsSchema
from app.core.security import verify_password, get_password_hash, create_access_token as create_jwt_token
from app.core.config import settings


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """
    Get a user by username
    """
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Get a user by email
    """
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
    """
    Create a new user
    """
    # Check if username or email already exists
    if get_user_by_username(db, user_data.username) or get_user_by_email(db, user_data.email):
        return None
    
    # Create the user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        full_name=user_data.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create default user settings
    db_settings = UserSettings(user_id=db_user.id)
    db.add(db_settings)
    db.commit()
    
    return db_user


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """
    Authenticate a user
    """
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(user_id: str) -> str:
    """
    Create an access token for a user
    """
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_jwt_token(user_id, expires_delta)


def get_user_settings(db: Session, user_id: str) -> UserSettings:
    """
    Get user settings or create default settings if they don't exist
    """
    settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
    
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings


def update_user_settings(db: Session, user_id: str, settings_data: UserSettingsSchema) -> UserSettings:
    """
    Update user settings
    """
    db_settings = get_user_settings(db, user_id)
    
    # Update settings
    for field, value in settings_data.dict(exclude_unset=True).items():
        setattr(db_settings, field, value)
    
    db.commit()
    db.refresh(db_settings)
    return db_settings 