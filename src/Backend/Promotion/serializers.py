from rest_framework import serializers
from .models import Promotion

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ('code', 'title', 'startdate', 'enddate', 'min_order', 'description', 'image', 'discount', 'type')