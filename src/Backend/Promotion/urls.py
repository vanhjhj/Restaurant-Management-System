from . import views
from django.urls import path

urlpatterns = [
    path('promotions/', views.PromotionListCreateAPIView.as_view(), name='promotions'),
    path('promotions/<str:code>/', views.PromotionRetrieveUpdateDestroyAPIView.as_view(), name='promotion-detail'),  
]