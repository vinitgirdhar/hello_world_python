# backend/test_email.py
"""
Test script to verify email sending is working.
Run: python -m backend.test_email
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from backend.services.email_service import send_test_email, send_otp_email, generate_otp

def test_email_service():
    # Your test email
    test_email = "girdharvinit786@gmail.com"
    
    print("=" * 50)
    print("Testing Nirogya Email Service")
    print("=" * 50)
    
    api_key = os.getenv("RESEND_API_KEY", "")
    print(f"\nRESEND_API_KEY configured: {'Yes' if api_key else 'No (DEV MODE)'}")
    
    if api_key:
        print(f"API Key (first 10 chars): {api_key[:10]}...")
    
    # Test 1: Simple test email
    print("\n[Test 1] Sending test email...")
    result = send_test_email(test_email)
    print(f"Result: {'✅ Success' if result else '❌ Failed'}")
    
    # Test 2: OTP email
    print("\n[Test 2] Sending OTP email...")
    otp = generate_otp()
    print(f"Generated OTP: {otp}")
    result = send_otp_email(test_email, otp)
    print(f"Result: {'✅ Success' if result else '❌ Failed'}")
    
    print("\n" + "=" * 50)
    print("Test complete! Check your inbox at:", test_email)
    print("=" * 50)

if __name__ == "__main__":
    test_email_service()
