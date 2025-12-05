# backend/auth/alert_routes.py
"""
Water Alert System Routes for ASHA workers and health officials
"""
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import asyncio

from backend.services.mongo_client import users_col, alerts_col
from backend.services.email_service import send_water_alert_email
from backend.auth.deps import get_current_user

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class CreateAlertRequest(BaseModel):
    region: str  # e.g., "Kamrup Metro", "Village A", pin code, etc.
    title: str
    description: str
    severity: str = "high"  # low, medium, high, critical


class AlertResponse(BaseModel):
    id: str
    region: str
    title: str
    description: str
    severity: str
    created_by: str
    created_at: datetime
    emails_sent: int
    status: str


async def send_alerts_to_region_users(alert_id: str, alert_data: dict, region: str):
    """
    Background task to send emails to all users in a region.
    """
    try:
        # Find users in the affected region
        # Match by: location field, district, region, or any field containing the region name
        users_cursor = users_col.find({
            "$or": [
                {"location": {"$regex": region, "$options": "i"}},
                {"district": {"$regex": region, "$options": "i"}},
                {"region": {"$regex": region, "$options": "i"}},
                {"address": {"$regex": region, "$options": "i"}}
            ]
        })
        
        users = await users_cursor.to_list(length=1000)
        
        print(f"[ALERT] Found {len(users)} users in region: {region}")
        
        sent_count = 0
        failed_count = 0
        
        for user in users:
            email = user.get("email")
            if email:
                try:
                    success = send_water_alert_email(email, alert_data)
                    if success:
                        sent_count += 1
                    else:
                        failed_count += 1
                except Exception as e:
                    print(f"[ALERT ERROR] Failed to send to {email}: {e}")
                    failed_count += 1
                
                # Small delay to avoid rate limiting (100ms)
                await asyncio.sleep(0.1)
        
        # Update alert with sent count
        from bson import ObjectId
        await alerts_col.update_one(
            {"_id": ObjectId(alert_id)},
            {
                "$set": {
                    "emails_sent": sent_count,
                    "emails_failed": failed_count,
                    "status": "sent",
                    "completed_at": datetime.utcnow()
                }
            }
        )
        
        print(f"[ALERT] Completed: {sent_count} sent, {failed_count} failed")
        
    except Exception as e:
        print(f"[ALERT ERROR] Background task failed: {e}")
        # Update alert status to failed
        from bson import ObjectId
        await alerts_col.update_one(
            {"_id": ObjectId(alert_id)},
            {"$set": {"status": "failed", "error": str(e)}}
        )


@router.post("/create", response_model=AlertResponse)
async def create_water_alert(
    payload: CreateAlertRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a water contamination alert and notify users in the region.
    Only ASHA workers, health officials, and admins can create alerts.
    """
    # Check permissions
    allowed_roles = [
        "admin", 
        "asha_worker", 
        "healthcare_worker", 
        "district_health_official", 
        "government_body",
        "health_official"
    ]
    user_role = current_user.get("role", "")
    
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail=f"You don't have permission to create alerts. Your role: {user_role}"
        )
    
    # Validate severity
    valid_severities = ["low", "medium", "high", "critical"]
    if payload.severity.lower() not in valid_severities:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid severity. Must be one of: {', '.join(valid_severities)}"
        )
    
    # Create alert document
    alert_doc = {
        "region": payload.region,
        "title": payload.title,
        "description": payload.description,
        "severity": payload.severity.lower(),
        "created_by": current_user.get("id"),
        "created_by_name": current_user.get("full_name", "Unknown"),
        "created_by_role": user_role,
        "created_at": datetime.utcnow(),
        "emails_sent": 0,
        "emails_failed": 0,
        "status": "pending"
    }
    
    result = await alerts_col.insert_one(alert_doc)
    alert_id = str(result.inserted_id)
    
    # Prepare alert data for emails
    email_alert_data = {
        "region": payload.region,
        "title": payload.title,
        "description": payload.description,
        "severity": payload.severity.lower(),
        "issued_by": current_user.get("full_name", "Health Department")
    }
    
    # Send emails in background (non-blocking)
    background_tasks.add_task(
        send_alerts_to_region_users, 
        alert_id, 
        email_alert_data, 
        payload.region
    )
    
    return AlertResponse(
        id=alert_id,
        region=payload.region,
        title=payload.title,
        description=payload.description,
        severity=payload.severity.lower(),
        created_by=current_user.get("full_name", "Unknown"),
        created_at=alert_doc["created_at"],
        emails_sent=0,
        status="sending"
    )


@router.get("/list")
async def list_alerts(
    limit: int = 20,
    current_user: dict = Depends(get_current_user)
):
    """Get recent water alerts."""
    alerts_cursor = alerts_col.find().sort("created_at", -1).limit(limit)
    alerts = await alerts_cursor.to_list(length=limit)
    
    return [
        {
            "id": str(alert["_id"]),
            "region": alert.get("region"),
            "title": alert.get("title"),
            "description": alert.get("description"),
            "severity": alert.get("severity"),
            "created_by": alert.get("created_by_name"),
            "created_by_role": alert.get("created_by_role"),
            "created_at": alert.get("created_at"),
            "emails_sent": alert.get("emails_sent", 0),
            "emails_failed": alert.get("emails_failed", 0),
            "status": alert.get("status", "unknown")
        }
        for alert in alerts
    ]


@router.get("/{alert_id}")
async def get_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific alert by ID."""
    from bson import ObjectId
    
    try:
        alert = await alerts_col.find_one({"_id": ObjectId(alert_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid alert ID")
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return {
        "id": str(alert["_id"]),
        "region": alert.get("region"),
        "title": alert.get("title"),
        "description": alert.get("description"),
        "severity": alert.get("severity"),
        "created_by": alert.get("created_by_name"),
        "created_by_role": alert.get("created_by_role"),
        "created_at": alert.get("created_at"),
        "completed_at": alert.get("completed_at"),
        "emails_sent": alert.get("emails_sent", 0),
        "emails_failed": alert.get("emails_failed", 0),
        "status": alert.get("status", "unknown"),
        "error": alert.get("error")
    }
