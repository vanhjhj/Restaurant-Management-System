from django.urls import path
from . import views

urlpatterns = [
    path('tables/', views.TableListCreateAPIView.as_view(), name='table-list-create'),
    path('tables/<int:pk>/', views.TableRetrieveUpdateDestroyAPIView.as_view(), name='table-retrieve-update-destroy'),
    path('reservations/', views.ReservationListCreateAPIView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', views.ReservationRetrieveUpdateDestroyAPIView.as_view(), name='reservation-retrieve-update-destroy'),
    path('orders/', views.OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', views.OrderRetrieveUpdateDestroyAPIView.as_view(), name='order-retrieve-update-destroy'),
    path('tables/current-order/<int:pk>/', views.GetCurrentTableOrderAPIView.as_view(), name='current-order'),
    path('orders/add-item/', views.AddOrderItemAPIView.as_view(), name='add-item'),
    path('orders/remove-item/', views.RemoveOrderItemAPIView.as_view(), name='remove-item'),
    path('orders/update-item/', views.UpdateOrderItemAPIView.as_view(), name='update-item'),
    path('orderitems/', views.OrderItemListAPIView.as_view(), name='orderitem-list'),
]