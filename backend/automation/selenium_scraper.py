"""
Selenium-based web scraper for BooksToScrape website.
"""
import time
from typing import List, Dict
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager


def fetch_products_from_source() -> List[Dict]:
    """
    Scrape products from https://books.toscrape.com for the first 2 pages.
    
    Returns:
        List of dictionaries with keys: name, price, rating, stock, image_url, source_url
    
    Raises:
        Exception: If scraping fails
    """
    products = []
    
    # Configure Chrome options for optimal scraping
    chrome_options = Options()
    
    # Headless mode (set to False to see browser for debugging)
    chrome_options.add_argument('--headless=new')  # Use new headless mode
    
    # Stability and performance options
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--disable-software-rasterizer')
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--disable-logging')
    chrome_options.add_argument('--log-level=3')  # Suppress console logs
    
    # Window and display options
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--start-maximized')
    
    # User agent to avoid detection
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    # Additional options for better compatibility
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    driver = None
    
    try:
        # Initialize Chrome driver using webdriver-manager
        # This automatically downloads and manages the ChromeDriver
        print("Initializing Chrome driver...")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Set timeouts
        driver.implicitly_wait(10)
        driver.set_page_load_timeout(30)
        
        # Verify Chrome connection by checking driver capabilities
        print(f"Chrome driver initialized successfully. Browser: {driver.capabilities.get('browserName', 'Unknown')}, Version: {driver.capabilities.get('browserVersion', 'Unknown')}")
        
        
        # Scrape first 2 pages
        for page_num in range(1, 3):
            url = f"https://books.toscrape.com/catalogue/page-{page_num}.html" if page_num > 1 else "https://books.toscrape.com/"
            
            try:
                driver.get(url)
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "product_pod"))
                )
                
                # Find all product containers
                product_containers = driver.find_elements(By.CLASS_NAME, "product_pod")
                
                for container in product_containers:
                    try:
                        # Extract product name/title
                        name_elem = container.find_element(By.TAG_NAME, "h3")
                        name = name_elem.find_element(By.TAG_NAME, "a").get_attribute("title")
                        
                        # Extract price
                        price_elem = container.find_element(By.CLASS_NAME, "price_color")
                        price_text = price_elem.text.replace("£", "").strip()
                        
                        # Extract rating (convert star rating to integer 0-5)
                        rating_elem = container.find_element(By.CLASS_NAME, "star-rating")
                        rating_class = rating_elem.get_attribute("class")
                        rating_text = rating_class.split()[-1] if len(rating_class.split()) > 1 else "Zero"
                        # Convert text rating to integer (Zero=0, One=1, Two=2, Three=3, Four=4, Five=5)
                        rating_map = {"Zero": 0, "One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}
                        rating = rating_map.get(rating_text, 0)
                        
                        # Extract stock availability (as integer: 1 for in stock, 0 for out of stock)
                        availability_elem = container.find_element(By.CLASS_NAME, "availability")
                        stock_text = availability_elem.text.strip()
                        stock = 1 if "In stock" in stock_text else 0
                        
                        # Extract image URL
                        image_elem = container.find_element(By.TAG_NAME, "img")
                        image_url = image_elem.get_attribute("src")
                        # Convert relative URL to absolute
                        if image_url.startswith("../"):
                            image_url = "https://books.toscrape.com/" + image_url.replace("../", "")
                        elif not image_url.startswith("http"):
                            image_url = "https://books.toscrape.com/" + image_url
                        
                        # Extract source URL
                        link_elem = name_elem.find_element(By.TAG_NAME, "a")
                        source_url = link_elem.get_attribute("href")
                        # Convert relative URL to absolute
                        if source_url.startswith("../"):
                            source_url = "https://books.toscrape.com/catalogue/" + source_url.replace("../catalogue/", "")
                        elif not source_url.startswith("http"):
                            source_url = "https://books.toscrape.com/catalogue/" + source_url
                        
                        product_data = {
                            "name": name,
                            "price": price_text,
                            "rating": rating,
                            "stock": stock,
                            "image_url": image_url,
                            "source_url": source_url
                        }
                        
                        products.append(product_data)
                        
                    except Exception as e:
                        # Skip individual product if extraction fails
                        print(f"Error extracting product: {e}")
                        continue
                
                # Small delay between pages to be respectful
                time.sleep(1)
                
            except TimeoutException:
                print(f"Timeout loading page {page_num} - skipping...")
                continue
            except Exception as e:
                print(f"Error scraping page {page_num}: {e}")
                continue
        
        print(f"Successfully scraped {len(products)} products from 2 pages")
        
    except WebDriverException as e:
        error_msg = f"WebDriver error: {str(e)}"
        print(error_msg)
        raise Exception(error_msg)
    except Exception as e:
        error_msg = f"Scraping error: {str(e)}"
        print(error_msg)
        raise Exception(error_msg)
    finally:
        if driver:
            try:
                driver.quit()
                print("Chrome driver closed successfully")
            except Exception as e:
                print(f"Error closing Chrome driver: {e}")
    
    return products


def sync_products_to_db(scraped_products: List[Dict]):
    """
    Upsert Product objects based on name.
    Updates price, rating, stock, image_url, source_url, and last_synced_at.
    Uses bulk operations where reasonable for better performance.
    
    Args:
        scraped_products: List of product dictionaries from scraper
    """
    from api.models import Product
    from decimal import Decimal
    from django.utils import timezone
    
    products_to_create = []
    products_to_update = []
    now = timezone.now()
    
    # Get existing products by name for efficient lookup
    existing_names = set(Product.objects.values_list('name', flat=True))
    
    for product_data in scraped_products:
        try:
            name = product_data["name"]
            price = Decimal(product_data["price"])
            stock = product_data["stock"]  # Already an integer (0 or 1)
            rating = product_data["rating"]  # Already an integer (0-5)
            image_url = product_data["image_url"]
            source_url = product_data["source_url"]
            
            if name in existing_names:
                # Update existing product
                product = Product.objects.get(name=name)
                product.price = price
                product.stock = stock
                product.rating = rating
                product.image_url = image_url
                product.source_url = source_url
                product.url = source_url
                product.last_synced_at = now
                products_to_update.append(product)
            else:
                # Create new product
                products_to_create.append(Product(
                    name=name,
                    price=price,
                    stock=stock,
                    rating=rating,
                    image_url=image_url,
                    source_url=source_url,
                    url=source_url,
                    last_synced_at=now
                ))
                existing_names.add(name)  # Track newly created names
                
        except Exception as e:
            print(f"Error processing product {product_data.get('name', 'unknown')}: {e}")
            continue
    
    # Bulk create new products
    if products_to_create:
        Product.objects.bulk_create(products_to_create, ignore_conflicts=True)
    
    # Bulk update existing products
    if products_to_update:
        Product.objects.bulk_update(
            products_to_update,
            ['price', 'stock', 'rating', 'image_url', 'source_url', 'url', 'last_synced_at']
        )

