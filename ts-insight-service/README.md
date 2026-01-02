# TypeScript Insights Microservice

A lightweight Express.js + TypeScript microservice that provides product analytics and insights for the e-commerce automation system.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

   The service will start on `http://localhost:3001`

3. **Verify it's running**:
   - Open `http://localhost:3001/health` in your browser
   - You should see: `{"status":"ok"}`

## Alternative: Use Convenience Scripts

**Windows PowerShell:**
```powershell
.\start-service.ps1
```

**Windows CMD:**
```cmd
start-service.bat
```

## API Endpoints

### POST /insights
Analyze products and return insights.

**Request Body:**
```json
{
  "products": [
    {
      "name": "Product Name",
      "price": 29.99,
      "rating": 4,
      "stock": 10
    }
  ]
}
```

**Response:**
```json
{
  "summary": "Analyzed 1 product. Average price is 29.99. Average rating is 4.0. 1 item is currently in stock.",
  "stats": {
    "count": 1,
    "avgPrice": 29.99,
    "avgRating": 4.0,
    "inStock": 1
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

## Port Configuration

The service runs on port 3001 by default. You can change this by setting the `PORT` environment variable:

```bash
# Windows PowerShell
$env:PORT=3002; npm run dev

# Linux/Mac
PORT=3002 npm run dev
```

## CORS Configuration

CORS is enabled to allow requests from the React frontend. The service accepts requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Alternative Vite port)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`

## Error Handling

The service includes comprehensive error handling:
- Validates request body structure
- Returns appropriate HTTP status codes
- Provides descriptive error messages
- Handles empty product arrays gracefully

## Development

```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `typescript` - TypeScript compiler
- `@types/node`, `@types/express`, `@types/cors` - Type definitions
