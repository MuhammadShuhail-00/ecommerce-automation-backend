from rest_framework import serializers
from .models import Product, AutomationJob


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model.
    """
    class Meta:
        model = Product
        fields = "__all__"


class AutomationJobSerializer(serializers.ModelSerializer):
    """
    Serializer for AutomationJob model.
    """
    class Meta:
        model = AutomationJob
        fields = "__all__"
