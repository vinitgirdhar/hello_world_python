# backend/auth/otp_routes.py
"""
OTP-based Email Authentication Routes
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional

from backend.services.mongo_client import users_col, otp_col
from backend.services.email_service import generate_otp, send_otp_email
from backend.auth.utils import create_access_token

router = APIRouter(prefix="/api/auth/otp", tags=["otp-auth"])


class RequestOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str


class OTPResponse(BaseModel):
    message: str
    expires_in_minutes: int = 5


@router.post("/request", response_model=OTPResponse)
async def request_otp(payload: RequestOTPRequest):
    """
    Request OTP for email-based login.
    User must be registered first.
    """
    email = payload.email.lower().strip()
    
    # Check if user exists
    user = await users_col.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=404, 
            detail="Email not registered. Please register first."
        )
    
    # Check for rate limiting - no more than 1 OTP per minute
    recent_otp = await otp_col.find_one({
        "email": email,
        "created_at": {"$gt": datetime.utcnow() - timedelta(minutes=1)}
    })
    
    if recent_otp:
        raise HTTPException(
            status_code=429,
            detail="Please wait 1 minute before requesting another OTP"
        )
    
    # Invalidate any existing unused OTPs for this email
    await otp_col.update_many(
        {"email": email, "used": False},
        {"$set": {"used": True, "invalidated_at": datetime.utcnow()}}
    )
    
    # Generate new OTP
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Save OTP to database
    await otp_col.insert_one({
        "email": email,
        "user_id": str(user["_id"]),
        "otp_code": otp,  # In production, you might want to hash this
        "expires_at": expires_at,
        "used": False,
        "created_at": datetime.utcnow()
    })
    
    # Send OTP email
    email_sent = send_otp_email(email, otp)
    
    if not email_sent:
        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP email. Please try again."
        )
    
    return OTPResponse(message="OTP sent to your email", expires_in_minutes=5)


@router.post("/verify")
async def verify_otp(payload: VerifyOTPRequest):
    """
    Verify OTP and return JWT token for login.
    """
    email = payload.email.lower().strip()
    
    # Find valid OTP
    otp_record = await otp_col.find_one({
        "email": email,
        "otp_code": payload.otp,
        "used": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP. Please request a new one."
        )
    
    # Mark OTP as used
    await otp_col.update_one(
        {"_id": otp_record["_id"]},
        {"$set": {"used": True, "used_at": datetime.utcnow()}}
    )
    
    # Get user
    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create JWT token
    token, exp = create_access_token(
        str(user["_id"]), 
        extra={"email": user["email"], "role": user.get("role")}
    )
    expires_in = int((exp - datetime.utcnow()).total_seconds())
    
    # Return token and user info
    user_out = {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "role": user.get("role"),
        "full_name": user.get("full_name"),
        "organization": user.get("organization"),
        "location": user.get("location"),
        "phone": user.get("phone"),
    }
    
    return {
        "access_token": token,
        "expires_in": expires_in,
        "token_type": "bearer",
        "user": user_out,
        "message": "Login successful"
    }


@router.post("/resend", response_model=OTPResponse)
async def resend_otp(payload: RequestOTPRequest):
    """
    Resend OTP (same as request, but explicitly named for clarity).
    """
    return await request_otp(payload)
