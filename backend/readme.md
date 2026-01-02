# Django Backend - E-Commerce Automation System

Django REST Framework backend with MySQL database, Selenium web scraping, and Django-Q background job processing.

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.11+
- MySQL 8.0+
- Chrome/Chromium browser (for Selenium)

### 2. Setup

```bash
# Activate virtual environment
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=ecom_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

3. Generate a Django secret key (if needed):
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. (Optional) Create superuser:
```bash
python manage.py createsuperuser
```

### 5. Run the Server

**Terminal 1 - Django Server:**
```bash
python manage.py runserver
# Runs on http://127.0.0.1:8000
```

**Terminal 2 - Django-Q Cluster (Required for background jobs):**
```bash
python manage.py qcluster
```

## 📦 Dependencies

Key packages:
- `Django>=5.2.0` - Web framework
- `djangorestframework>=3.14.0` - REST API
- `django-q2>=1.9.0` - Background task queue
- `selenium>=4.15.0` - Web scraping
- `webdriver-manager>=4.0.0` - ChromeDriver management
- `mysqlclient>=2.2.0` - MySQL database adapter
- `django-cors-headers>=4.3.0` - CORS support
- `python-dotenv>=1.0.0` - Environment variables

Install all:
```bash
pip install -r requirements.txt
```

## 🗄️ Database Models

### Product
- `name` - Product name (CharField)
- `price` - Product price (DecimalField)
- `rating` - Product rating 0-5 (IntegerField)
- `stock` - Stock availability 0 or 1 (IntegerField)
- `image_url` - Product image URL (URLField)
- `source_url` - Original source URL (URLField)
- `url` - Product URL (URLField)
- `last_synced_at` - Last sync timestamp (DateTimeField)

### AutomationJob
- `job_type` - Type of job (CharField, e.g., 'scrape_products')
- `status` - Job status: 'queued', 'running', 'completed', 'failed' (CharField)
- `created_at` - Creation timestamp (DateTimeField)
- `finished_at` - Completion timestamp (DateTimeField, nullable)
- `error_message` - Error message if failed (TextField, nullable)

## 🔌 API Endpoints

### Products

- `GET /api/products/` - List all products
- `GET /api/products/<id>/` - Get product by ID
- `POST /api/products/` - Create new product
- `PUT /api/products/<id>/` - Update product
- `PATCH /api/products/<id>/` - Partial update
- `DELETE /api/products/<id>/` - Delete product

### Automation

- `POST /api/automation/scrape-products/` - Queue a scraping job
  - Returns: `{ "job_id": 1, "status": "queued" }`
- `GET /api/automation/jobs/` - List last 20 automation jobs

## 🤖 Automation & Web Scraping

### Selenium Scraper

The scraper (`automation/selenium_scraper.py`) fetches products from `https://books.toscrape.com`:

- Scrapes first 2 pages
- Extracts: name, price, rating, stock, image_url, source_url
- Uses headless Chrome browser
- Automatically manages ChromeDriver via `webdriver-manager`

### Background Jobs

Jobs are processed asynchronously using Django-Q:

1. Frontend calls `POST /api/automation/scrape-products/`
2. Django creates an `AutomationJob` with status 'queued'
3. Django-Q queues the `run_scrape_products_job` task
4. Task runs Selenium scraper and syncs products to database
5. Job status updates: queued → running → completed/failed

## ⚙️ Configuration

### Settings (`core/settings.py`)

Key configurations:
- **Database**: MySQL (configured via environment variables)
- **CORS**: Enabled for React frontend (`localhost:5173`)
- **Authentication**: Currently `AllowAny` (disabled for development)
- **Django-Q**: Uses ORM broker (no Redis required)

### Environment Variables

All sensitive settings use environment variables from `.env`:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` - Database config

## 🧪 Development

### Running Tests

```bash
python manage.py test
```

### Creating Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Django Admin

Access at `http://127.0.0.1:8000/admin/` (requires superuser)

### Debugging

- Check Django-Q cluster logs for background job issues
- Check browser console for Selenium errors
- Django logs: Check terminal output or `*.log` files

## 🐛 Troubleshooting

**Issue: `ModuleNotFoundError: No module named 'django'`**
- Solution: Activate virtual environment and install dependencies

**Issue: `django.db.utils.OperationalError: (2003, "Can't connect to MySQL server")`**
- Solution: Verify MySQL is running and `.env` credentials are correct

**Issue: Jobs stuck in 'queued' status**
- Solution: Ensure `python manage.py qcluster` is running

**Issue: Selenium scraping fails**
- Solution: Check Chrome/Chromium is installed and internet connection is active

**Issue: CORS errors from frontend**
- Solution: Verify `django-cors-headers` is installed and `CORS_ALLOW_ALL_ORIGINS = True` in settings

## 📝 Notes

- Authentication is currently disabled (`AllowAny`) for development
- In production, enable JWT authentication and restrict CORS origins
- Django-Q uses the database as broker (no Redis needed for development)
- Selenium runs in headless mode by default (change in `selenium_scraper.py`)

## 🔒 Security

- Never commit `.env` file (already in `.gitignore`)
- Use `.env.example` as a template
- Generate a strong `SECRET_KEY` for production
- Set `DEBUG=False` in production
- Configure proper `ALLOWED_HOSTS` for production
