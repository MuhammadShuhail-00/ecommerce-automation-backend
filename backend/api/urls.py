from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import auth_views

# Create a router and register ProductViewSet
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')

urlpatterns = [
    # Product CRUD via ViewSet (handled by router)
    path('', include(router.urls)),
    
    # Automation endpoints
    path("automation/scrape-products/", views.ScrapeProductsView.as_view(), name="scrape_products"),
    path("automation/jobs/", views.AutomationJobListView.as_view(), name="automation_jobs"),

    # Auth
    path("auth/register/", auth_views.register_user, name="register_user"),
    path("auth/login/", auth_views.login_user, name="login_user"),
]
