from django.urls import path
from . import views

urlpatterns = [
    path('tables/', views.TableListCreateView.as_view(), name='table-list-create'),
    path('tables/<int:pk>/', views.TableRetrieveUpdateDestroyView.as_view(), name='table-retrieve-update-destroy'),
]