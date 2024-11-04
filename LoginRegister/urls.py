from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('accounts/', views.AccountListCreateAPIView.as_view(), name='accounts'),
    path('accounts/<int:pk>/', views.AccountRetrieveUpdateDestroyAPIView.as_view(), name='account'),
    path('employees/', views.EmployeeAccountListCreateAPIView.as_view(), name='employees'),
    path('employees/<int:pk>/', views.EmployeeAccountRetrieveUpdateAPIView.as_view(), name='employee'),
    path('customers/', views.CustomerAccountListCreateAPIView.as_view(), name='customers'),
    path('customers/<int:pk>/', views.CustomerAccountRetrieveUpdateAPIView.as_view(), name='customer'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.AccountLogoutAPIView.as_view(), name='logout')

]