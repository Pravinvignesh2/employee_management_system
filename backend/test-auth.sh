#!/bin/bash

echo "Testing HR Management System Authentication and User Creation"
echo "=============================================================="

# Test 1: Try to access users endpoint without authentication
echo "Test 1: Accessing /api/users without authentication (should return 403)"
curl -X GET http://localhost:8080/api/users -H "Content-Type: application/json" -w "\nHTTP Status: %{http_code}\n\n"

# Test 2: Login with admin credentials
echo "Test 2: Logging in with admin credentials"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hrm.com",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to extract token from login response"
    exit 1
fi

echo "Extracted Token: $TOKEN"
echo ""

# Test 3: Access users endpoint with authentication
echo "Test 3: Accessing /api/users with authentication (should return 200)"
curl -X GET http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Test 4: Create a new user
echo "Test 4: Creating a new user"
CREATE_RESPONSE=$(curl -s -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@hrm.com",
    "phoneNumber": "1234567890",
    "role": "EMPLOYEE",
    "department": "IT",
    "address": "123 Test Street",
    "emergencyContact": "0987654321"
  }')

echo "Create User Response: $CREATE_RESPONSE"
echo ""

# Test 5: Verify the user was created
echo "Test 5: Verifying the user was created"
curl -X GET http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "Test completed!" 