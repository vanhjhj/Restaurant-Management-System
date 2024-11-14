from . import views
from django.urls import path

urlpatterns = [
    path('category/', views.CategoryListCreateAPIView.as_view(), name='category'),
    path('category/<int:pk>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category'),
    path('menuitem/', views.MenuItemListCreateAPIView.as_view(), name='menuitem'),
    path('menuitem/<int:pk>/', views.MenuItemRetrieveUpdateDestroyAPIView.as_view(), name='menuitem'),
]