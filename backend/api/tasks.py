"""
Django-Q background tasks for automation jobs.
This module serves as the entry point for Django-Q tasks.
"""
from django.utils import timezone
from api.models import AutomationJob
from automation.selenium_scraper import fetch_products_from_source, sync_products_to_db


def run_scrape_products_job(job_id: int):
    """
    Django-Q task to run product scraping automation job.
    
    Args:
        job_id: ID of the AutomationJob instance
        
    This task:
    1. Sets AutomationJob status to "running"
    2. Calls fetch_products_from_source()
    3. Calls sync_products_to_db()
    4. On success: sets status to "completed" and finished_at timestamp
    5. On exception: sets status to "failed" and saves error_message
    """
    try:
        # Get the job instance
        job = AutomationJob.objects.get(id=job_id)
        
        # Set status to running
        job.status = 'running'
        job.save()
        
        # Fetch products from source
        scraped_products = fetch_products_from_source()
        
        # Sync products to database
        sync_products_to_db(scraped_products)
        
        # Mark job as completed
        job.status = 'completed'
        job.finished_at = timezone.now()
        job.save()
        
    except AutomationJob.DoesNotExist:
        # Job doesn't exist - this shouldn't happen but handle gracefully
        print(f"AutomationJob with id {job_id} does not exist")
    except Exception as e:
        # Handle any errors during scraping
        try:
            job = AutomationJob.objects.get(id=job_id)
            job.status = 'failed'
            job.finished_at = timezone.now()
            job.error_message = str(e)
            job.save()
        except AutomationJob.DoesNotExist:
            print(f"Error updating job {job_id}: {e}")

