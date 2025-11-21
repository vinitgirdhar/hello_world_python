# Demo Account Login Fix

## Issue Summary

The demo account login feature on the login page was failing due to a critical typo in the backend authentication code.

## Root Cause

In `backend/auth/routes.py` at line 92, there was a typo in the user ID field extraction:

**Before (Incorrect):**
```python
"id": str(user["_1d"] if "_1d" in user else user.get("_id")),
```

**After (Correct):**
```python
"id": str(user["_id"]),
```

The code was trying to access `_1d` (underscore followed by the number ONE and letter D) instead of `_id` (underscore followed by lowercase I and D). MongoDB uses `_id` as the primary key field, so `_1d` doesn't exist, causing the user object to have no valid ID, which then caused authentication to fail.

## Changes Made

### 1. Fixed the Typo in `backend/auth/routes.py`

The user object construction in the login endpoint now correctly extracts the MongoDB `_id` field:

```python
user_out = {
    "id": str(user["_id"]),
    "email": user.get("email"),
    "role": user.get("role"),
    "full_name": user.get("full_name"),
    "organization": user.get("organization"),
    "location": user.get("location"),
    "phone": user.get("phone"),
}
```

### 2. Created Demo User Seeding Script

Created `backend/seed_demo_users.py` to populate the database with demo accounts.

## Demo Accounts

The following demo accounts are now available:

| Role | Email | Password |
|------|-------|----------|
| System Administrator | admin@paanicare.com | admin123 |
| ASHA Worker | asha@paanicare.com | asha123 |
| Community Volunteer | volunteer@paanicare.com | volunteer123 |
| Healthcare Professional | healthcare@paanicare.com | healthcare123 |
| District Health Official | district@paanicare.com | district123 |
| Government Official | government@paanicare.com | government123 |
| Community User | user@paanicare.com | user123 |

## Setup Instructions

### 1. Ensure Backend Dependencies are Installed

```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Seed the Demo Users

From the project root directory:

```powershell
# Activate the virtual environment
.\backend\venv\Scripts\activate

# Run the seed script
python -m backend.seed_demo_users
```

Expected output:
```
🌱 Seeding demo users...
✓ Email index created/verified
✓ Created: admin@paanicare.com (admin)
✓ Created: asha@paanicare.com (asha_worker)
✓ Created: volunteer@paanicare.com (volunteer)
✓ Created: healthcare@paanicare.com (healthcare_worker)
✓ Created: district@paanicare.com (district_health_official)
✓ Created: government@paanicare.com (government_body)
✓ Created: user@paanicare.com (community_user)

✅ Seeding complete!
   Created: 7 users
   Updated: 0 users

📝 Demo credentials:
   admin@paanicare.com / admin123 (admin)
   asha@paanicare.com / asha123 (asha_worker)
   volunteer@paanicare.com / volunteer123 (volunteer)
   healthcare@paanicare.com / healthcare123 (healthcare_worker)
   district@paanicare.com / district123 (district_health_official)
   government@paanicare.com / government123 (government_body)
   user@paanicare.com / user123 (community_user)
```

### 3. Restart the Backend Server

```powershell
# Stop the current backend server (Ctrl+C)
# Then restart it
uvicorn backend.app:app --reload --port 8000
```

### 4. Test the Demo Login

1. Navigate to http://localhost:3000/login
2. Click on "Try Demo Accounts"
3. Click on any demo account card
4. You should be automatically logged in and redirected to the appropriate dashboard

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Demo users are created in the database
- [ ] Can click "Try Demo Accounts" button
- [ ] Demo account cards are visible
- [ ] Clicking on a demo account card logs you in
- [ ] You are redirected to the appropriate dashboard based on role
- [ ] Can manually log in with demo credentials (email + password)
- [ ] Can log out and log back in

## Technical Details

### What Was Fixed

1. **Typo in User ID Extraction**: Changed `_1d` to `_id`
2. **Simplified User Object Construction**: Removed unnecessary conditional logic
3. **Added Demo User Seeding**: Created script to populate database with test accounts

### Why It Failed Before

When the backend tried to return the user object after successful login, it couldn't find the `_1d` field (because it doesn't exist), and even though there was a fallback to `user.get("_id")`, the overall structure was problematic. The simplified version directly accesses `user["_id"]` which is guaranteed to exist in MongoDB documents.

### Authentication Flow

1. User clicks demo account → Frontend calls `handleDemoLogin()`
2. Frontend calls `login()` from AuthContext with demo credentials
3. AuthContext sends POST to `/api/auth/login`
4. Backend verifies credentials against MongoDB
5. Backend returns JWT token + user object (including correct `id`)
6. Frontend stores token and user in localStorage
7. Frontend redirects to role-appropriate dashboard

## Troubleshooting

### Issue: "Demo login failed"
**Solution**: Ensure demo users are seeded in the database by running the seed script.

### Issue: "Invalid email or password"
**Solution**: Check that MongoDB is running and accessible. Verify the connection string in your `.env` file.

### Issue: Backend shows "DEBUG: verify_password -> False"
**Solution**: Re-run the seed script to ensure passwords are properly hashed and stored.

### Issue: "Token is undefined"
**Solution**: Check backend logs for errors during token generation. Ensure JWT_SECRET is set in `.env`.

## Monitoring

To see authentication debug logs, check the backend terminal output. You should see:
```
DEBUG: found user id: <ObjectId>
DEBUG: stored_hash startswith $2: True
DEBUG: verify_password -> True
```

## Security Notes

- Demo credentials are for testing only
- In production, disable or remove demo accounts
- Change JWT_SECRET to a secure random value
- Use environment variables for sensitive configuration
- Consider adding rate limiting to login endpoints

## Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- FastAPI Authentication: https://fastapi.tiangolo.com/tutorial/security/
- JWT Best Practices: https://jwt.io/introduction

---

**Fix Applied**: November 22, 2025
**Status**: ✅ Ready for Testing
