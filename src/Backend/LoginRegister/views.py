from django.shortcuts import render
from .models import *
from .serializers import *
from .permissions import *
from .authentications import *
from rest_framework import generics, permissions, authentication, decorators
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.settings import api_settings
import jwt

# Create your views here.

def generate_otp(length=6):
    """Generate a random OTP of specified length."""
    digits = "0123456789"
    otp = ''.join(random.choice(digits) for _ in range(length))
    return otp

class AccountCheckAPIView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = AccountSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            response = {
                'status': 'success',
                'message': 'Account is available'
            }
            return Response(response, status=status.HTTP_200_OK)
        #response the account is not available
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def get_authenticators(self):
        if self.request.method == 'POST':
            return [CustomTokenAuthentication()]
        return super().get_authenticators()

    def post(self, request, *args, **kwargs):
        #create account
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            account = serializer.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'User created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AccountRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrAdmin]


    def get(self, request, *args, **kwargs):
        account = self.get_object()
        serializer = self.serializer_class(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data.keys():
            return Response({'id': 'You cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' in request.data.keys():
            return Response({'username': 'You cannot update username field'}, status=status.HTTP_400_BAD_REQUEST)
        
        account = self.get_object()
        serializer = self.serializer_class(account, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):

            for key, value in request.data.items():
                if key == 'password':
                    account.set_password(value)
                else:
                    setattr(account, key, value)
                    
            account.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'User updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
    def delete(self, request, *args, **kwargs):
        account = self.get_object()
        try:
            account.delete()
        except IntegrityError:
            return Response({'message': 'Cannot delete this account due to integrity constraints.'}, status=status.HTTP_400_BAD_REQUEST)

        response = {
            'status': 'success',
            'message': 'User deleted successfully'
        }
        return Response(response, status=status.HTTP_200_OK)

class EmployeeAccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = EmployeeAccount.objects.all()
    serializer_class = EmployeeAccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        employee_data = request.data
        serializer = self.serializer_class(data=employee_data)

        if serializer.is_valid(raise_exception=True):
            employee = serializer.save()
            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Employee created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EmployeeAccountRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = EmployeeAccount.objects.all()
    serializer_class = EmployeeAccountSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwnerOrAdmin]

    def get(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = self.serializer_class(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data.keys():
            return Response({'id': 'You cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        if 'account_id' in request.data.keys():
            return Response({'account_id': 'You cannot update account_id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = self.get_object()
        serializer = self.serializer_class(employee, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            for key, value in request.data.items():
                if key == 'department':
                    department = Department.objects.get(pk=value)
                    setattr(employee, key, department)  
                else:
                    setattr(employee, key, value)
            employee.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Employee updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)

class CustomerAccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = CustomerAccount.objects.all()
    serializer_class = CustomerAccountSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]

        return super().get_permissions()

    def post(self, request, *args, **kwargs):
        customer_data = request.data
        serializer = self.serializer_class(data=customer_data)

        if serializer.is_valid(raise_exception=True):
            customer = serializer.save()
            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Customer created successfully'
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomerAccountRetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = CustomerAccount.objects.all()
    serializer_class = CustomerAccountSerializer
    lookup_field = 'pk'
    permission_classes = [IsOwner]

    def get(self, request, *args, **kwargs):
        employee = self.get_object()
        serializer = self.serializer_class(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        return Response({"detail": "Method 'PUT' not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def patch(self, request, *args, **kwargs):
        if 'id' in request.data.keys():
            return Response({'id': 'You cannot update id field'}, status=status.HTTP_400_BAD_REQUEST)
        if 'account_id' in request.data.keys():
            return Response({'account_id': 'You cannot update account_id field'}, status=status.HTTP_400_BAD_REQUEST)
        
        employee = self.get_object()
        serializer = self.serializer_class(employee, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            for key, value in request.data.items():
                setattr(employee, key, value)
            employee.save()

            response = {
                'data': serializer.data,
                'status': 'success',
                'message': 'Employee updated successfully'
            }
            return Response(response, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class AccountLogoutAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        
        # check if refresh token is provided
        if not refresh_token:
            return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # blacklist refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = {
                'status': 'success',
                'message': 'User logged out successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        
def gernerate_otp_and_send_email(email):
    #generate OTP
    otp = generate_otp()
    if OTP.objects.filter(email=email, revoked=False).exists():
        #revoke all previous OTPs
        OTP.objects.filter(email=email, revoked=False).update(revoked=True)
        
    OTP.objects.create(email=email, otp=otp, expired_at=timezone.now() + timezone.timedelta(minutes=5))

    send_mail(
        'Your OTP Code',
        f'Your OTP code is {otp}',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
    return True
class ForgotPasswordAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            #generate OTP and send email
            gernerate_otp_and_send_email(email)

            response = {
                'status': 'success',
                'message': 'OTP sent successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterOTPAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterRequestOTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            #generate OTP and send email
            gernerate_otp_and_send_email(email)

            response = {
                'status': 'success',
                'message': 'OTP sent successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def generate_custom_token(email):
    # save original user id field and claim
    original_user_id_field = api_settings.USER_ID_FIELD
    original_user_id_claim = api_settings.USER_ID_CLAIM

    # override user id field and claim
    api_settings.USER_ID_FIELD = 'email'
    api_settings.USER_ID_CLAIM = 'email'

    try:
        token = RefreshToken()
        token['email'] = email
        access_token = str(token.access_token)
        refresh_token = str(token)
    except TokenError as e:
        raise exceptions.AuthenticationFailed('Invalid token')
    finally:
        # restore original user id field and claim
        api_settings.USER_ID_FIELD = original_user_id_field
        api_settings.USER_ID_CLAIM = original_user_id_claim
    return access_token, refresh_token
        
class VerifyOTPAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyOTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')

            # generate token
            access_token, refresh_token = generate_custom_token(email)

            # return access token and refresh token
            response = {
                'status': 'success',
                'message': 'OTP verified successfully',
                'access_token': access_token,
                'refresh_token': refresh_token,
            }
            return Response(response, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResetPasswordAPIView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ResetPasswordSerializer
    authentication_classes = [CustomTokenAuthentication] # use custom token authentication

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            #get account and reset password
            account = Account.objects.get(email=serializer.validated_data.get('email'))
            account.set_password(serializer.validated_data.get('password'))
            account.save()
            
            response = {
                'status': 'success',
                'message': 'Password reset successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)