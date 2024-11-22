from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import jwt
class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.account_type == 'Employee'

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.account_type == 'Customer'
    
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.username == obj.username and request.user.is_authenticated

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        return request.user.username == obj.username or request.user.is_staff