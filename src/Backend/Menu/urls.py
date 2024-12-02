from . import views
from django.urls import path

urlpatterns = [
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='categories'),
    path('categories/<int:pk>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='categories'),
    path('menuitems/', views.MenuItemListCreateAPIView.as_view(), name='menuitems'),
    path('menuitems/<int:pk>/', views.MenuItemRetrieveUpdateDestroyAPIView.as_view(), name='menuitems'),
]


