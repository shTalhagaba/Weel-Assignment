@echo off
chcp 65001 > nul
echo Starting Delivery App Backend...

echo Checking if PostgreSQL is accessible...
psql -U postgres -c "SELECT 1;" > nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to PostgreSQL. Please make sure it's running.
    pause
    exit /b 1
)

echo PostgreSQL is running and accessible.
echo Installing/updating dependencies...
go mod download
go mod tidy

echo Building application...
go build -o main.exe .
if errorlevel 1 (
    echo ERROR: Build failed! Check the errors above.
    pause
    exit /b 1
)

echo.
echo SUCCESS: Starting server on http://localhost:8080
echo Test credentials:
echo   Email: user@example.com  
echo   Password: password
echo.
main.exe
pause