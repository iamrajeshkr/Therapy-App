from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class UserUpdate(BaseModel):
    """Schema for user update"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserInDB(UserBase):
    """Schema for user in database"""
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class User(UserBase):
    """Schema for user response"""
    id: str
    
    class Config:
        orm_mode = True


class UserSettings(BaseModel):
    """Schema for user settings"""
    theme: Optional[str] = "light"
    notification_enabled: Optional[bool] = True
    privacy_level: Optional[int] = 2
    therapy_model: Optional[str] = "mistral"
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    """Schema for token response"""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """Schema for token payload"""
    sub: str
    exp: int 