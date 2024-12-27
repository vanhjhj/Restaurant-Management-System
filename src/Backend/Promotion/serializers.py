from rest_framework import serializers
from .models import Promotion

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ('code', 'title', 'startdate', 'enddate', 'description', 'image', 'discount', 'type')
        extra_kwargs = {
            'startdate': {'required': False},
            'enddate': {'required': False},
        }