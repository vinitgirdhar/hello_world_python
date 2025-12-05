# backend/test_otp_flow.py
"""
Test script to verify the complete OTP authentication flow.
Run: python -m backend.test_otp_flow
"""
import requests
import time

BASE_URL = "http://localhost:8000"

def test_otp_flow():
    print("=" * 60)
    print("Testing Complete OTP Authentication Flow")
    print("=" * 60)
    
    test_email = "girdharvinit786@gmail.com"
    
    # Step 1: Request OTP
    print(f"\n[Step 1] Requesting OTP for {test_email}...")
    response = requests.post(
        f"{BASE_URL}/api/auth/otp/request",
        json={"email": test_email}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("\n✅ OTP sent successfully! Check your email.")
        print("\n" + "=" * 60)
        print("Now enter the OTP you received in your email:")
        otp = input("Enter OTP: ").strip()
        
        # Step 2: Verify OTP
        print(f"\n[Step 2] Verifying OTP: {otp}...")
        response = requests.post(
            f"{BASE_URL}/api/auth/otp/verify",
            json={"email": test_email, "otp": otp}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {data}")
        
        if response.status_code == 200:
            print("\n✅ LOGIN SUCCESSFUL!")
            print(f"Access Token: {data.get('access_token', 'N/A')[:50]}...")
            print(f"User: {data.get('user', {})}")
            return data.get('access_token')
        else:
            print("\n❌ OTP verification failed!")
    elif response.status_code == 404:
        print("\n❌ Email not registered. Please register first.")
    elif response.status_code == 429:
        print("\n⏱️ Rate limited. Wait 1 minute before requesting another OTP.")
    else:
        print(f"\n❌ Failed: {response.json()}")
    
    return None


def test_alert_creation(token):
    """Test creating a water alert (requires valid token from ASHA worker)"""
    print("\n" + "=" * 60)
    print("Testing Water Alert Creation")
    print("=" * 60)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.post(
        f"{BASE_URL}/api/alerts/create",
        headers=headers,
        json={
            "region": "Kamrup Metro",
            "title": "Water Contamination Detected",
            "description": "High levels of coliform bacteria detected in the water supply of Kamrup Metro area. Please boil water before drinking.",
            "severity": "high"
        }
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("\n✅ Alert created! Emails are being sent to users in the region.")
    elif response.status_code == 403:
        print("\n⚠️ Your account doesn't have permission to create alerts.")
        print("Only ASHA workers, health officials, and admins can create alerts.")
    else:
        print(f"\n❌ Failed: {response.json()}")


if __name__ == "__main__":
    token = test_otp_flow()
    
    if token:
        print("\nDo you want to test alert creation? (y/n): ", end="")
        if input().strip().lower() == 'y':
            test_alert_creation(token)
