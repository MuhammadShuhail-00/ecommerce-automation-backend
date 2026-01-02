# E-Commerce Automation System

A multi-service system for e-commerce product management with automation capabilities.

## Architecture

- **Django Backend** (`backend/`) - REST API with MySQL, Product CRUD, and Selenium automation jobs
- **TypeScript Microservice** (`ts-insight-service/`) - Product insights and analytics
- **React Admin Frontend** (`admin-frontend/`) - Web interface for managing products and automation jobs

## Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Chrome/Chromium (for Selenium)

## Setup Instructions

### 1. Django Backend

```bash
# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install django-q2 selenium webdriver-manager mysqlclient

# Configure database in backend/core/settings.py
# Update DATABASES settings with your MySQL credentials

# Run migrations
cd backend
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server (in one terminal)
python manage.py runserver

# Start Django-Q cluster (in another terminal)
python manage.py qcluster
```

### 2. TypeScript Insight Service

```bash
cd ts-insight-service

# Install dependencies
npm install

# Run in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

The service will run on `http://localhost:3001`

### 3. React Admin Frontend

```bash
cd admin-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Products (Django Backend - http://localhost:8000/api/)

- `GET /api/products/` - List all products
- `GET /api/products/<id>/` - Get product by ID
- `POST /api/products/` - Create new product
- `PUT /api/products/<id>/` - Update product
- `PATCH /api/products/<id>/` - Partial update product
- `DELETE /api/products/<id>/` - Delete product

### Automation (Django Backend)

- `POST /api/automation/scrape-products/` - Queue a scraping job
- `GET /api/automation/jobs/` - List last 20 automation jobs

### Insights (TypeScript Service - http://localhost:3001)

- `POST /insights` - Analyze products and return insights
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

## Development Notes

- Authentication is currently disabled (AllowAny) for development
- Django-Q uses ORM broker (no Redis required)
- Selenium uses webdriver-manager for automatic Chrome driver management
- Frontend auto-refreshes automation jobs every 10 seconds

## Project Structure

```
.
├── backend/              # Django backend
│   ├── api/            # Main app
│   │   ├── models.py   # Product, AutomationJob models
│   │   ├── views.py    # API views
│   │   ├── serializers.py
│   │   └── tasks.py    # Django-Q tasks
│   ├── automation/      # Automation module
│   │   └── selenium_scraper.py
│   └── core/           # Django settings
├── ts-insight-service/  # TypeScript microservice
│   └── src/
│       ├── server.ts
│       └── routes/
├── admin-frontend/      # React admin UI
│   └── src/
│       ├── pages/
│       └── App.tsx
└── venv/               # Python virtual environment
```

## License

MIT
