from django.contrib import admin
from .models import Account, CustomerAccount, EmployeeAccount, Department

# Register your models here.
admin.site.register(Account)
admin.site.register(CustomerAccount)
admin.site.register(EmployeeAccount)
admin.site.register(Department)
