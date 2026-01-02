# 🛒 E-Commerce Automation System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Django](https://img.shields.io/badge/Django-5.2+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)

A comprehensive multi-service e-commerce automation system featuring web scraping, product management, and analytics. Built with Django, React, and TypeScript.

## 🏗️ Architecture

This project consists of three main services:

- **🐍 Django Backend** (`backend/`) - REST API with MySQL, Product CRUD operations, and Selenium-based web scraping automation
- **📊 TypeScript Microservice** (`ts-insight-service/`) - Product insights and analytics service
- **⚛️ React Admin Frontend** (`admin-frontend/`) - Modern web interface for managing products and monitoring automation jobs

## ✨ Features

- **Product Management**: Full CRUD operations for products via REST API
- **Web Scraping**: Automated product scraping from e-commerce sites using Selenium
- **Background Jobs**: Asynchronous job processing with Django-Q
- **Product Analytics**: Real-time insights and statistics via TypeScript microservice
- **Modern UI**: Beautiful, responsive admin dashboard with dark theme
- **Environment Security**: Secure configuration using environment variables

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.11 or higher
- **Node.js** 18 or higher (and npm)
- **MySQL** 8.0 or higher
- **Chrome/Chromium** browser (for Selenium web scraping)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MuhammadShuhail-00/ecommerce-automation-backend.git
cd ecommerce-automation-backend
```

### 2. Environment Setup

#### Django Backend

1. Create and activate a virtual environment:

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. Install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

3. Configure environment variables:

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
# SECRET_KEY=your-secret-key-here
# DB_NAME=your_database_name
# DB_USER=your_database_user
# DB_PASSWORD=your_database_password
# DB_HOST=127.0.0.1
# DB_PORT=3306
```

4. Create MySQL database:

```sql
CREATE DATABASE ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

6. (Optional) Create superuser:

```bash
python manage.py createsuperuser
```

#### TypeScript Insight Service

```bash
cd ts-insight-service
npm install
```

#### React Admin Frontend

```bash
cd admin-frontend
npm install
```

### 3. Start All Services

You'll need **three terminal windows**:

**Terminal 1 - Django Backend:**
```bash
cd backend
python manage.py runserver
# Server runs on http://127.0.0.1:8000
```

**Terminal 2 - Django-Q Cluster (for background jobs):**
```bash
cd backend
python manage.py qcluster
```

**Terminal 3 - TypeScript Insight Service:**
```bash
cd ts-insight-service
npm run dev
# Service runs on http://localhost:3001
```

**Terminal 4 - React Frontend:**
```bash
cd admin-frontend
npm run dev
# Frontend runs on http://localhost:5173
```

## 📚 Detailed Setup

For detailed setup instructions for each service, see:

- [Django Backend Setup](backend/README.md)
- [TypeScript Insight Service](ts-insight-service/README.md)
- [React Admin Frontend](admin-frontend/README.md)

## 🔌 API Endpoints

### Products API (Django Backend - `http://localhost:8000/api/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/` | List all products |
| `GET` | `/api/products/<id>/` | Get product by ID |
| `POST` | `/api/products/` | Create new product |
| `PUT` | `/api/products/<id>/` | Update product |
| `PATCH` | `/api/products/<id>/` | Partial update product |
| `DELETE` | `/api/products/<id>/` | Delete product |

### Automation API (Django Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/automation/scrape-products/` | Queue a new scraping job |
| `GET` | `/api/automation/jobs/` | List last 20 automation jobs |

### Insights API (TypeScript Service - `http://localhost:3001`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/insights` | Analyze products and return insights |
| `GET` | `/health` | Health check endpoint |

**Example Request:**
```json
POST /insights
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

## 📁 Project Structure

```
.
├── backend/                    # Django backend
│   ├── api/                   # Main Django app
│   │   ├── models.py          # Product, AutomationJob models
│   │   ├── views.py           # API views (ProductViewSet, ScrapeProductsView)
│   │   ├── serializers.py    # DRF serializers
│   │   ├── tasks.py          # Django-Q background tasks
│   │   └── urls.py           # URL routing
│   ├── automation/            # Automation module
│   │   └── selenium_scraper.py # Selenium web scraper
│   ├── core/                  # Django settings
│   │   ├── settings.py        # Main settings (uses .env)
│   │   └── urls.py            # Root URL config
│   ├── .env.example           # Environment variables template
│   ├── requirements.txt       # Python dependencies
│   └── manage.py
├── ts-insight-service/         # TypeScript microservice
│   ├── src/
│   │   ├── server.ts          # Express server
│   │   ├── insights.ts        # Insight calculation logic
│   │   └── types.ts           # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
├── admin-frontend/             # React admin UI
│   ├── src/
│   │   ├── api/               # API client modules
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

The Django backend uses environment variables for configuration. See `backend/.env.example` for all available options.

**Required Variables:**
- `SECRET_KEY` - Django secret key (generate with: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `DB_NAME` - MySQL database name
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_HOST` - MySQL host (default: 127.0.0.1)
- `DB_PORT` - MySQL port (default: 3306)

### Frontend Configuration

The React frontend can be configured via environment variables:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_INSIGHTS_BASE_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Django Backend Issues

**Issue: `ModuleNotFoundError: No module named 'django'`**
- Solution: Make sure your virtual environment is activated and dependencies are installed: `pip install -r requirements.txt`

**Issue: `django.db.utils.OperationalError: (2003, "Can't connect to MySQL server")`**
- Solution: Verify MySQL is running and credentials in `.env` are correct

**Issue: `Django-Q cluster not processing jobs`**
- Solution: Make sure `python manage.py qcluster` is running in a separate terminal

### Selenium Issues

**Issue: ChromeDriver not found**
- Solution: `webdriver-manager` should auto-download it. Ensure Chrome/Chromium is installed.

**Issue: Scraping fails with timeout**
- Solution: Check internet connection and verify the target website is accessible

### Frontend Issues

**Issue: `NetworkError: Failed to reach backend`**
- Solution: Verify Django backend is running on `http://127.0.0.1:8000` and CORS is configured

**Issue: `Failed to reach insights service`**
- Solution: Ensure TypeScript insight service is running on `http://localhost:3001`

## 🧪 Development Notes

- **Authentication**: Currently disabled (AllowAny) for development. Enable JWT in production.
- **CORS**: Configured to allow all origins in development. Restrict in production.
- **Django-Q**: Uses ORM broker (no Redis required for development).
- **Selenium**: Uses `webdriver-manager` for automatic ChromeDriver management.
- **Auto-refresh**: Frontend auto-refreshes automation jobs every 10 seconds.

## 🚢 Production Deployment

Before deploying to production:

1. Set `DEBUG=False` in `.env`
2. Generate a new `SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS` in Django settings
4. Set up proper CORS origins
5. Use a production database (not SQLite)
6. Enable authentication (JWT)
7. Set up proper logging
8. Use a production WSGI server (e.g., Gunicorn)
9. Configure environment variables on your hosting platform

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Muhammad Shuhail**

- GitHub: [@MuhammadShuhail-00](https://github.com/MuhammadShuhail-00)

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- Selenium for web automation capabilities
- React and Vite for the modern frontend experience
- All open-source contributors whose packages made this project possible

---

⭐ If you find this project helpful, please consider giving it a star!
