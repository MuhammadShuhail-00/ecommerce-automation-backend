from django.contrib import admin
from .models import Product, AutomationJob


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin interface for Product model.
    """
    list_display = ['name', 'price', 'stock', 'rating', 'last_updated']
    list_filter = ['rating', 'stock', 'last_updated']
    search_fields = ['name']
    readonly_fields = ['last_updated']


@admin.register(AutomationJob)
class AutomationJobAdmin(admin.ModelAdmin):
    """
    Admin interface for AutomationJob model.
    """
    list_display = ['id', 'job_type', 'status', 'created_at', 'finished_at']
    list_filter = ['job_type', 'status', 'created_at']
    readonly_fields = ['created_at', 'finished_at']
    search_fields = ['job_type', 'error_message']
