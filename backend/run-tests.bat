@echo off
chcp 65001 > nul
echo 🧪 Running Tests...

go test ./tests/... -v

if errorlevel 1 (
    echo ❌ Tests failed
) else (
    echo ✅ All tests passed
)

pause