from . import views
from django.urls import path

urlpatterns = [
    path('category/', views.CategoryListCreateAPIView.as_view(), name='category'),
    path('category/<int:pk>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category'),
    path('menu/', views.MenuListCreateAPIView.as_view(), name='menu'),
    path('menu/<int:pk>/', views.MenuRetrieveUpdateDestroyAPIView.as_view(), name='menu'),
]