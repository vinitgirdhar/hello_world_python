# backend/auth/deps.py
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from .utils import decode_token
from backend.services.mongo_client import users_col
from bson import ObjectId

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Verifies Bearer token, decodes it and loads user from DB.
    Raises 401 if token invalid or user not found.
    Returns the user document (dict).
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    try:
        payload = decode_token(token)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # Load user from DB
    try:
        user = await users_col.find_one({"_id": ObjectId(sub)})
    except Exception:
        user = None

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # convert ObjectId -> str and return
    user["id"] = str(user["_id"])
    user.pop("password", None)
    return user
