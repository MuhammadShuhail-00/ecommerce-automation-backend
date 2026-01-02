# Ecommerce Automation Admin Frontend

React admin dashboard for managing the Django + Selenium + TypeScript automation backend.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

## Features

- **Dashboard** - Overview with quick stats and actions
- **Products Page** - View, manage, and analyze products
- **Automation Jobs Page** - Monitor scraping job status
- **Insights Integration** - Product analytics via TypeScript microservice

## Setup

### Prerequisites

1. **Backend (Django)** must be running:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Django-Q Cluster** must be running (in a separate terminal):
   ```bash
   cd backend
   python manage.py qcluster
   ```

3. **TypeScript Insight Service** must be running:
   ```bash
   cd ts-insight-service
   npm install
   npm run dev
   ```

### Install and Run Frontend

```bash
cd admin-frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Configuration

### API URLs

By default, the frontend connects to:
- **Backend API**: `http://127.0.0.1:8000/api`
- **Insights Service**: `http://localhost:3001`

To override these, create a `.env` file in the `admin-frontend` directory:

```env
VITE_API_BASE_URL=http://your-backend-url/api
VITE_INSIGHTS_BASE_URL=http://your-insights-url
```

## Pages

### Dashboard (`/`)

- Quick stats: Total products, last scraped time, completed/failed jobs
- Quick actions: View Products, View Jobs, Run Scraper
- Overview of system status

### Products Page (`/products`)

- **View Products**: Table showing all products with name, price, rating, stock, last synced
- **Refresh**: Reload products from backend
- **Run Scraper**: Trigger a new scraping job (redirects to Jobs page)
- **Analyze Products**: Get insights from TypeScript microservice
  - Shows summary text
  - Displays stats: count, avg price, avg rating, in stock count
- **Delete Products**: Remove products from the database

### Automation Jobs Page (`/jobs`)

- **View Jobs**: Table showing all automation jobs
  - Job ID, type, status (color-coded badges)
  - Created/finished timestamps
  - Error messages for failed jobs
- **Auto-refresh**: Toggle automatic refresh every 15 seconds
- **Refresh**: Manually reload jobs
- **Run Scraper**: Trigger a new scraping job
- **Empty State**: Shows "Run Scraper" button if no jobs exist

## API Integration

### Backend Endpoints

- `GET /api/products/` - List all products
- `POST /api/products/` - Create product
- `PUT /api/products/:id/` - Update product
- `DELETE /api/products/:id/` - Delete product
- `POST /api/automation/scrape-products/` - Queue scraping job
- `GET /api/automation/jobs/` - List automation jobs

### Insights Service

- `POST /insights` - Analyze products and return statistics

## Project Structure

```
admin-frontend/
├── src/
│   ├── api/
│   │   ├── client.ts          # Base fetch wrapper
│   │   ├── products.ts        # Products API
│   │   ├── jobs.ts            # Jobs API
│   │   └── insights.ts        # Insights API
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── Products/
│   │   │   └── ProductsTable.tsx
│   │   ├── Jobs/
│   │   │   └── JobsTable.tsx
│   │   └── Insights/
│   │       └── InsightsPanel.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useJobs.ts
│   │   └── useInsights.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── ProductsPage.tsx
│   │   └── JobsPage.tsx
│   ├── utils/
│   │   └── date.ts            # Date formatting helpers
│   ├── config.ts              # API URL configuration
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Error Handling

- All API errors are caught and displayed to the user
- Loading states shown during API calls
- Friendly error messages for network issues
- Validation errors from backend are displayed

## Styling

- Dark theme with purple/blue accents
- Responsive design (mobile-friendly)
- Tailwind CSS utility classes
- Consistent color scheme:
  - Background: Gray-900
  - Cards: Gray-800
  - Accent: Purple-600
  - Success: Green
  - Error: Red

## Authentication

Currently, authentication is disabled on the backend (AllowAny), so no login is required. The frontend is ready for authentication integration when needed.
