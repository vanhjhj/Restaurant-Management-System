from . import views
from django.urls import path

urlpatterns = [
    path('promotions/', views.PromotionListCreateAPIView.as_view(), name='promotions'),
    path('promotions/<int:pk>/', views.PromotionRetrieveUpdateDestroyAPIView.as_view(), name='promotions'),
]