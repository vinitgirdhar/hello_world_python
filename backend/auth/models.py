# backend/auth/models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2)
    email: EmailStr
    role: str = Field(..., min_length=1)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    organization: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str
    organization: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    created_at: Optional[datetime] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserTokenInfo(BaseModel):
    id: str
    email: EmailStr
    role: str
    full_name: Optional[str] = None
    organization: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Optional[UserTokenInfo] = None
