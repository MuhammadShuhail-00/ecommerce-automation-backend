from django.db import models


class Product(models.Model):
    """
    Product model for storing e-commerce product information.
    """
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    url = models.URLField(max_length=500)
    rating = models.IntegerField(null=True, blank=True, help_text="Product rating as integer (0-5)")
    image_url = models.URLField(max_length=500, null=True, blank=True, help_text="URL of the product image")
    source_url = models.URLField(max_length=500, null=True, blank=True, help_text="Original source URL of the product")
    last_synced_at = models.DateTimeField(null=True, blank=True, help_text="Last time product was synced from source")
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-last_updated']

    def __str__(self):
        return self.name


class AutomationJob(models.Model):
    """
    Model to track automation jobs (scraping, etc.)
    """
    JOB_TYPE_CHOICES = [
        ('scrape_products', 'scrape_products'),
    ]

    STATUS_CHOICES = [
        ('queued', 'queued'),
        ('running', 'running'),
        ('completed', 'completed'),
        ('failed', 'failed'),
    ]

    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='queued')
    created_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.job_type} - {self.status} ({self.created_at})"
