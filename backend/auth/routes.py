# backend/auth/routes.py
from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import Any, Dict

from backend.auth.models import RegisterRequest, UserOut, UserLogin, TokenResponse
from backend.auth.utils import hash_password, verify_password, create_access_token
from backend.auth.deps import get_current_user
from backend.services.mongo_client import users_col

router = APIRouter(prefix="/api/auth", tags=["auth"])


def user_helper(doc: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": str(doc["_id"]),
        "full_name": doc.get("full_name"),
        "email": doc.get("email"),
        "role": doc.get("role"),
        "organization": doc.get("organization"),
        "location": doc.get("location"),
        "phone": doc.get("phone"),
        "created_at": doc.get("created_at"),
    }


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    email = payload.email.lower().strip()

    # ensure unique index on email (no-op if exists)
    try:
        await users_col.create_index("email", unique=True)
    except Exception:
        pass

    existing = await users_col.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(payload.password)
    doc = {
        "full_name": payload.full_name.strip(),
        "email": email,
        "role": payload.role,
        "password": hashed,
        "organization": payload.organization,
        "location": payload.location,
        "phone": payload.phone,
        "created_at": datetime.utcnow(),
    }

    result = await users_col.insert_one(doc)
    # temporary debug prints
    print("DEBUG: inserted user id:", result.inserted_id)
    created = await users_col.find_one({"_id": result.inserted_id})
    print("DEBUG: created doc present:", created is not None)

    return user_helper(created)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    """
    Authenticate user and return JWT token.
    """
    email = payload.email.lower().strip()
    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    stored_hash = user.get("password", "")

    # --- debugging helpers (keeps inside function to avoid syntax errors) ---
    print("DEBUG: found user id:", user.get("_id"))
    print("DEBUG: stored_hash startswith $2:", str(stored_hash).startswith("$2"))

    ok = verify_password(payload.password, stored_hash)
    print("DEBUG: verify_password ->", ok)
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    # ---------------------------------------------------------------------

    token, exp = create_access_token(str(user["_id"]), extra={"email": user["email"], "role": user.get("role")})
    expires_in = int((exp - datetime.utcnow()).total_seconds())
    return {"access_token": token, "expires_in": expires_in, "token_type": "bearer"}


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    """
    Returns the authenticated user based on Authorization: Bearer <token>
    """
    return {
        "id": current_user.get("id"),
        "full_name": current_user.get("full_name"),
        "email": current_user.get("email"),
        "role": current_user.get("role"),
        "organization": current_user.get("organization"),
        "location": current_user.get("location"),
        "phone": current_user.get("phone"),
        "created_at": current_user.get("created_at"),
    }


@router.get("/users/me")
async def users_me(current_user: dict = Depends(get_current_user)):
    return await me(current_user)
