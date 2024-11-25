from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt
from .models import Account, EmployeeAccount, CustomerAccount
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.account_type == 'Employee'

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.account_type == 'Customer'
    
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        print(obj.account.id)
        print(request.user.id)
        return request.user.id == obj.account.id and request.user.is_authenticated


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if isinstance(obj, Account): #if obj is an Account instance
            return request.user.id == obj.id or request.user.is_staff
        elif isinstance(obj, EmployeeAccount) or isinstance(obj, CustomerAccount): #if obj is an EmployeeAccount or CustomerAccount instance
            return request.user.id == obj.account.id or request.user.is_staff
        return False
