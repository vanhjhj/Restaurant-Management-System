from django.urls import path
from . import views

urlpatterns = [
    path('tables/', views.TableListCreateAPIView.as_view(), name='table-list-create'),
    path('tables/<int:pk>/', views.TableRetrieveUpdateDestroyAPIView.as_view(), name='table-retrieve-update-destroy'),

    path('reservations/', views.ReservationListCreateAPIView.as_view(), name='reservation-list-create'),
    path('reservations/<int:pk>/', views.ReservationRetrieveUpdateDestroyAPIView.as_view(), name='reservation-retrieve-update-destroy'),
    path('reservations/assign-table/<int:pk>/', views.ReservationAssignTableAPIView.as_view(), name='reservation-assign-table'),
    path('reservations/mark-done/<int:pk>/', views.ReservationMarkDoneAPIView.as_view(), name='reservation-mark-done'),
    path('reservations/mark-cancel/<int:pk>/', views.ReservationMarkCancelAPIView.as_view(), name='reservation-mark-cancel'),
    path('reservations/unassign-table/<int:pk>/', views.ReservationUnassignTableAPIView.as_view(), name='reservation-unassign-table'),
    
    path('orders/', views.OrderListCreateAPIView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', views.OrderRetrieveDestroyAPIView.as_view(), name='order-retrieve-destroy'),
    path('orders/mark-paid/<int:pk>/', views.OrderMarkPaidAPIView.as_view(), name='order-mark-paid'),
    path('orders/change-table/<int:pk>/', views.ChangeTableOrderAPIView.as_view(), name='order-change-table'),

    path('tables/current-order/<int:pk>/', views.GetCurrentTableOrderAPIView.as_view(), name='current-order'),
    path('tables/current-reservation/<int:pk>/', views.GetCurrentTableReservationAPIView.as_view(), name='current-reservation'),
    path('orders/add-item/', views.AddOrderItemAPIView.as_view(), name='add-item'),
    path('orders/remove-item/<int:pk>/', views.RemoveOrderItemAPIView.as_view(), name='remove-item'),
    path('orderitem/mark-done/<int:pk>/', views.MarkDoneOrderItemStatusAPIView.as_view(), name='mark-done-orderitem'),
    path('orderitem/update-item/<int:pk>/', views.UpdateOrderItemAPIView.as_view(), name='update-item'),
    path('orderitems/', views.OrderItemListAPIView.as_view(), name='orderitem-list'),
]