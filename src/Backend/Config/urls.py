from django.urls import path
from .views import RestaurantSettingsAPIView

urlpatterns = [
    path('restaurant-configs/', RestaurantSettingsAPIView.as_view(), name='restaurant-configs'),
]