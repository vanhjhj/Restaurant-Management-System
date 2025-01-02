from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('accounts/', views.AccountListCreateAPIView.as_view(), name='account'),
    path('account-check/', views.AccountCheckAPIView.as_view(), name='account_check'),
    path('password-check/', views.CheckPasswordAPIView.as_view(), name='password_check'),
    path('account-exists-check/', views.CheckAccountExistsAPIView.as_view(), name='account_exists'),
    path('register-otp/', views.RegisterOTPAPIView.as_view(), name='register_otp'),
    path('accounts/<int:pk>/', views.AccountRetrieveUpdateDestroyAPIView.as_view(), name='account'),
    path('employees/', views.EmployeeAccountListCreateAPIView.as_view(), name='employees'),
    path('employees/<int:account_id>/', views.EmployeeAccountRetrieveUpdateAPIView.as_view(), name='employee'),
    path('customers/', views.CustomerAccountListCreateAPIView.as_view(), name='customers'),
    path('customers/<int:account_id>/', views.CustomerAccountRetrieveUpdateAPIView.as_view(), name='customer'),

    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('logout/', views.AccountLogoutAPIView.as_view(), name='logout'),

    path('forgot-password/', views.ForgotPasswordAPIView.as_view(), name='forgot_password'),
    path('verify-otp/', views.VerifyOTPAPIView.as_view(), name='verify_otp'),
    path('reset-password/', views.ResetPasswordAPIView.as_view(), name='reset_password'),

    path('departments/', views.DepartmentListCreateAPIView.as_view(), name='departments'),
    path('departments/<int:pk>/', views.DepartmentRetrieveUpdateDestroyAPIView.as_view(), name='department'),
]