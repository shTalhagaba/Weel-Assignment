@echo off
echo Testing API Endpoints...

echo.
echo 1. Testing health endpoint...
curl http://localhost:8080/health

echo.
echo 2. Testing login endpoint...
curl -X POST http://localhost:8080/api/v1/auth/login -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password\"}"

echo.
echo If you see a token above, your API is working!
pause