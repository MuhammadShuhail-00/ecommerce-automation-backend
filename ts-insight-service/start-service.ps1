# PowerShell script to start the TypeScript Insights Service
Write-Host "Starting TypeScript Insights Service..." -ForegroundColor Cyan
Write-Host "Service will run on http://localhost:3001" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Gray
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the service
npm run dev


