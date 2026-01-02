# TypeScript Insights Microservice

This is a TypeScript microservice that provides product insights analysis.

## Quick Start

1. **Install dependencies** (if not already installed):
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
PORT=3002 npm run dev
```
