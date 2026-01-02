@echo off
echo Starting TypeScript Insights Service...
echo Service will run on http://localhost:3001
echo Press Ctrl+C to stop the service
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Start the service
call npm run dev


