from rest_framework.permissions import BasePermission

class IsEmployeeOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.account_type == 'Employee' or request.user.is_staff)