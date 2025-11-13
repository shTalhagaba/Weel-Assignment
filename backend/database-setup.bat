@echo off
chcp 65001 > nul
echo 🗄️ Setting up database...

:: Create database using psql
psql -U postgres -c "CREATE DATABASE deliveryapp;" 2>nul
if errorlevel 1 (
    echo ⚠️ Database might already exist, continuing...
)

echo ✅ Database setup complete
echo 💡 The tables will be created automatically when the app starts

pause