@echo off
chcp 65001 > nul
echo Starting Delivery App Backend on Windows...

:: Check if Go is installed
go version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Go is not installed. Please install Go first.
    echo Download from: https://golang.org/dl/
    pause
    exit /b 1
)

:: Find PostgreSQL service
echo Checking PostgreSQL services...
for /f "tokens=1" %%i in ('sc query type^= service ^| findstr /i "postgres"') do (
    set "pgservice=%%i"
    goto :found_service
)

echo ERROR: No PostgreSQL service found!
echo Please make sure PostgreSQL is installed and running.
pause
exit /b 1

:found_service
echo Found PostgreSQL service: %pgservice%

:: Check if service is running
sc query %pgservice% | findstr "RUNNING" >nul
if errorlevel 1 (
    echo PostgreSQL service is not running. Attempting to start...
    net start %pgservice% >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Failed to start PostgreSQL automatically.
        echo Please start it manually from Services (services.msc)
        pause
        exit /b 1
    )
    echo PostgreSQL started successfully.
) else (
    echo PostgreSQL is already running.
)

echo Installing/updating dependencies...
go mod download
go mod tidy

echo Building application...
go build -o main.exe .

echo.
echo SUCCESS: Build completed!
echo Server starting on http://localhost:8080
echo Test credentials:
echo   Email: user@example.com
echo   Password: password
echo.
echo Press Ctrl+C to stop the server
echo.

main.exe

pause