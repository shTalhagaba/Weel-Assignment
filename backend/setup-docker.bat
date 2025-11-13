@echo off
echo Setting up Docker for Delivery App...

echo.
echo Step 1: Checking Docker Compose file...
if not exist "docker-compose.yml" (
    echo ❌ docker-compose.yml not found!
    exit /b 1
)

echo.
echo Step 2: Checking Dockerfile...
if not exist "Dockerfile" (
    echo ❌ Dockerfile not found!
    echo 💡 Make sure Dockerfile is in the current directory
    exit /b 1
)

echo.
echo Step 3: Building and starting services...
docker-compose down
docker-compose up --build

if %errorlevel% equ 0 (
    echo ✅ Docker setup successful!
) else (
    echo ❌ Docker setup failed
)

pause