#!/usr/bin/env python3
"""
FlipCut Backend API Testing Suite
Tests all API endpoints including auth, image upload, processing, and management
"""

import requests
import sys
import json
import time
from datetime import datetime
import tempfile
import os
from PIL import Image
import io

class FlipCutAPITester:
    def __init__(self, base_url="https://flipcut-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "response_data": response_data
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for multipart/form-data
                    test_headers.pop('Content-Type', None)
                    response = requests.post(url, files=files, data=data, headers=test_headers)
                else:
                    response = requests.post(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            response_data = None
            
            try:
                response_data = response.json()
            except:
                response_data = {"text": response.text}

            if success:
                self.log_test(name, True, f"Status: {response.status_code}", response_data)
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response.text}", response_data)

            return success, response_data

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test API root
        self.run_test("API Root", "GET", "", 200)
        
        # Test health check
        self.run_test("Health Check", "GET", "health", 200)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTH ENDPOINTS")
        print("="*50)
        
        # Test /auth/me without authentication (should fail)
        self.run_test("Auth Me (No Token)", "GET", "auth/me", 401)
        
        # Test session exchange with invalid session_id
        self.run_test("Session Exchange (Invalid)", "POST", "auth/session", 401, 
                     data={"session_id": "invalid_session_id"})

    def create_test_session(self):
        """Create a test session in MongoDB for testing protected endpoints"""
        print("\n" + "="*50)
        print("CREATING TEST SESSION")
        print("="*50)
        
        try:
            import subprocess
            
            # Generate unique test data
            timestamp = int(time.time())
            self.user_id = f"test-user-{timestamp}"
            self.session_token = f"test_session_{timestamp}"
            
            # MongoDB commands to create test user and session
            mongo_commands = f"""
use('test_database');
db.users.insertOne({{
  user_id: '{self.user_id}',
  email: 'test.user.{timestamp}@example.com',
  name: 'Test User {timestamp}',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
}});
db.user_sessions.insertOne({{
  user_id: '{self.user_id}',
  session_token: '{self.session_token}',
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
}});
print('Test session created successfully');
"""
            
            result = subprocess.run(
                ['mongosh', '--eval', mongo_commands],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print(f"✅ Test session created")
                print(f"   User ID: {self.user_id}")
                print(f"   Session Token: {self.session_token}")
                return True
            else:
                print(f"❌ Failed to create test session: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating test session: {str(e)}")
            return False

    def test_protected_auth_endpoints(self):
        """Test protected auth endpoints with valid session"""
        print("\n" + "="*50)
        print("TESTING PROTECTED AUTH ENDPOINTS")
        print("="*50)
        
        if not self.session_token:
            print("❌ No session token available, skipping protected auth tests")
            return
        
        # Test /auth/me with valid token
        success, response_data = self.run_test("Auth Me (Valid Token)", "GET", "auth/me", 200)
        
        if success and response_data:
            print(f"   User: {response_data.get('name')} ({response_data.get('email')})")
        
        # Test logout
        self.run_test("Logout", "POST", "auth/logout", 200)

    def create_test_image(self):
        """Create a test image for upload testing"""
        # Create a simple test image
        img = Image.new('RGB', (100, 100), color='red')
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        return img_buffer

    def test_image_endpoints(self):
        """Test image upload, processing, listing, and deletion"""
        print("\n" + "="*50)
        print("TESTING IMAGE ENDPOINTS")
        print("="*50)
        
        if not self.session_token:
            print("❌ No session token available, skipping image tests")
            return
        
        # Test image upload without authentication (should fail)
        temp_token = self.session_token
        self.session_token = None
        self.run_test("Image Upload (No Auth)", "POST", "images/upload", 401)
        self.session_token = temp_token
        
        # Test image upload with valid authentication
        test_image = self.create_test_image()
        files = {'file': ('test_image.png', test_image, 'image/png')}
        
        success, upload_response = self.run_test(
            "Image Upload (Valid Auth)", 
            "POST", 
            "images/upload", 
            200,
            files=files
        )
        
        image_id = None
        if success and upload_response:
            image_id = upload_response.get('image_id')
            print(f"   Uploaded Image ID: {image_id}")
        
        # Test image listing
        self.run_test("List Images", "GET", "images", 200)
        
        if image_id:
            # Test get single image
            self.run_test("Get Single Image", "GET", f"images/{image_id}", 200)
            
            # Test image processing (this will likely fail due to remove.bg API limits)
            print(f"\n🔍 Testing Image Processing (may fail due to API limits)...")
            success, process_response = self.run_test(
                "Process Image", 
                "POST", 
                f"images/{image_id}/process", 
                200
            )
            
            if not success:
                print("   Note: Processing failure expected due to remove.bg API limits or rate limiting")
            
            # Test image deletion
            self.run_test("Delete Image", "DELETE", f"images/{image_id}", 200)
        
        # Test invalid image operations
        self.run_test("Get Non-existent Image", "GET", "images/invalid_id", 404)
        self.run_test("Delete Non-existent Image", "DELETE", "images/invalid_id", 404)

    def test_file_validation(self):
        """Test file upload validation"""
        print("\n" + "="*50)
        print("TESTING FILE VALIDATION")
        print("="*50)
        
        if not self.session_token:
            print("❌ No session token available, skipping file validation tests")
            return
        
        # Test invalid file type
        invalid_file = io.BytesIO(b"This is not an image")
        files = {'file': ('test.txt', invalid_file, 'text/plain')}
        
        self.run_test(
            "Upload Invalid File Type", 
            "POST", 
            "images/upload", 
            400,
            files=files
        )

    def cleanup_test_data(self):
        """Clean up test data from MongoDB"""
        print("\n" + "="*50)
        print("CLEANING UP TEST DATA")
        print("="*50)
        
        try:
            import subprocess
            
            # MongoDB commands to clean up test data
            mongo_commands = f"""
use('test_database');
db.users.deleteMany({{email: /test\\.user\\./}});
db.user_sessions.deleteMany({{session_token: /test_session/}});
db.images.deleteMany({{user_id: /test-user-/}});
print('Test data cleaned up');
"""
            
            result = subprocess.run(
                ['mongosh', '--eval', mongo_commands],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                print("✅ Test data cleaned up successfully")
            else:
                print(f"⚠️  Cleanup warning: {result.stderr}")
                
        except Exception as e:
            print(f"⚠️  Cleanup error: {str(e)}")

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"Total tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "No tests run")
        
        # Print failed tests
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"   • {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    print("FlipCut Backend API Testing Suite")
    print("=" * 60)
    
    tester = FlipCutAPITester()
    
    # Run all tests
    tester.test_health_endpoints()
    tester.test_auth_endpoints()
    
    # Create test session for protected endpoint testing
    if tester.create_test_session():
        tester.test_protected_auth_endpoints()
        tester.test_image_endpoints()
        tester.test_file_validation()
        tester.cleanup_test_data()
    else:
        print("⚠️  Skipping protected endpoint tests due to session creation failure")
    
    # Print summary and return exit code
    success = tester.print_summary()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())