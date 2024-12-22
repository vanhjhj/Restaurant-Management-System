from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import UserManager
from django.core.validators import MinValueValidator

class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('account_type', 'Admin')
        return super().create_superuser(username=username, password=password, email=email, **extra_fields)

# Create your models here.
class Account(AbstractUser):
    first_name = None
    last_name = None

    account_type = models.CharField(max_length=20, choices=[('Employee', 'Employee'), ('Customer', 'Customer')], default='Customer')
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    def __str__(self):
        return self.username + ' - ' + str(self.pk)

class Department(models.Model):
    name = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    def __str__(self):
        return self.name
class EmployeeAccount(models.Model):
    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(default=None, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Nam', 'Nam'), ('Nữ', 'Nữ')])
    phone_number = PhoneNumberField()
    start_working_date = models.DateField(default=None, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.full_name

class CustomerAccount(models.Model):
    account = models.OneToOneField(Account, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    phone_number = PhoneNumberField()
    gender = models.CharField(max_length=10, choices=[('Nam', 'Nam'), ('Nữ', 'Nữ')])

    def __str__(self):
        return self.full_name


class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    revoked = models.BooleanField(default=False)
    expired_at = models.DateTimeField()
    class Meta:
        unique_together = ['email', 'otp', 'expired_at']

