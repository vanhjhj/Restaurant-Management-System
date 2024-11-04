from django.shortcuts import render
from .models import Account, CustomerAccount, EmployeeAccount, Department
from .serializers import EmployeeAccountSerializer, AccountSerializer, CustomerAccountSerializer
from rest_framework import generics, permissions, authentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

class AccountListCreateAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_data = request.data
        serializer = self.serializer_class(data=user_data)

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
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

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


class AccountLogoutAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        
        # Kiểm tra xem refresh token có tồn tại không
        if not refresh_token:
            return Response({'message': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Tạo đối tượng RefreshToken và blacklist
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = {
                'status': 'success',
                'message': 'User logged out successfully'
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'message': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        
    
