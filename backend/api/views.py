from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import Product, AutomationJob
from .serializers import ProductSerializer, AutomationJobSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD operations.
    Supports: list, retrieve, create, update, partial_update, destroy
    Currently using AllowAny for development (no authentication required).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # No permission_classes - will use DEFAULT_PERMISSION_CLASSES (AllowAny) from settings

    def get_queryset(self):
        """
        Optionally filter products by query parameters.
        """
        queryset = Product.objects.all()
        return queryset.order_by('-last_updated')


class ScrapeProductsView(APIView):
    """
    POST endpoint to trigger product scraping automation job.
    Creates an AutomationJob and queues it using Django-Q.
    Currently using AllowAny for development (no authentication required).
    """
    # No permission_classes - will use DEFAULT_PERMISSION_CLASSES (AllowAny) from settings

    def post(self, request):
        """
        Create a new scraping job and queue it for background processing.
        """
        try:
            # Create AutomationJob with queued status
            job = AutomationJob.objects.create(
                job_type='scrape_products',
                status='queued'
            )

            # Queue the task using Django-Q
            from django_q.tasks import async_task
            from api.tasks import run_scrape_products_job
            
            task = async_task(
                run_scrape_products_job,
                job.id,
                task_name=f'scrape_products_{job.id}'
            )

            return Response(
                {
                    'job_id': job.id,
                    'status': job.status,
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {
                    'error': 'Failed to queue scraping job',
                    'detail': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AutomationJobListView(APIView):
    """
    GET endpoint to retrieve the last 20 automation jobs.
    Currently using AllowAny for development (no authentication required).
    """
    # No permission_classes - will use DEFAULT_PERMISSION_CLASSES (AllowAny) from settings

    def get(self, request):
        """
        Return the last 20 AutomationJob entries ordered by created_at desc.
        """
        jobs = AutomationJob.objects.all()[:20]
        serializer = AutomationJobSerializer(jobs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
