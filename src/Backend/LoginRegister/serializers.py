from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from phonenumber_field.serializerfields import PhoneNumberField
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Thêm account_type vào token payload
        token['account_type'] = user.account_type
        token['email'] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        return data

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Account
        fields = ('id', 'username', 'password', 'email', 'account_type')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        account_data = {
            'username': validated_data.pop('username'),
            'password': make_password(validated_data.pop('password')),
            'email': validated_data.pop('email'),
            'account_type': validated_data.pop('account_type')
        }

        account = Account.objects.create(**account_data)
        return account

    def validate(self, attrs):
        if attrs.get('password'):
            try:
                validate_password(attrs.get('password'))
            except ValidationError as e:
                raise serializers.ValidationError({'password': list(e.messages)})
        
        if attrs.get('email'):
            if Account.objects.filter(email=attrs.get('email')).exists():
                raise serializers.ValidationError({'email': 'Email already exists'})
        return attrs
    

class EmployeeAccountSerializer(serializers.ModelSerializer):

    account_id = serializers.IntegerField()
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())

    class Meta:
        model = EmployeeAccount
        fields = ('account_id', 'full_name', 'date_of_birth', 'gender', 'start_working_date', 'address', 'department')
    
    def validate(self, attrs):

        #checking if start_working_date is after date_of_birth
        if attrs.get('start_working_date') and attrs.get('date_of_birth'):
            date_of_birth = attrs['date_of_birth']
            start_working_date = attrs['start_working_date']
        elif attrs.get('start_working_date'):
            date_of_birth = self.instance.date_of_birth
            start_working_date = attrs['start_working_date']
        elif attrs.get('date_of_birth'):
            date_of_birth = attrs['date_of_birth']
            start_working_date = self.instance.start_working_date

        if start_working_date and date_of_birth and start_working_date < date_of_birth:
            raise serializers.ValidationError({'start_working_date': 'Start working date must be after date of birth'})

        return attrs


class CustomerAccountSerializer(serializers.ModelSerializer):
    account_id = serializers.IntegerField()
    class Meta:
        model = CustomerAccount
        fields = ('account_id', 'full_name', 'phone_number', 'gender')
    
    def to_representation(self, instance):
        # Trả về số điện thoại không có mã quốc gia
        representation = super().to_representation(instance)
        phone_number = representation.get('phone_number', '')
        if phone_number.startswith('+84'):
            representation['phone_number'] = '0' + phone_number[3:]  # Bỏ mã +84 và thêm số 0
        return representation


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        # check if email exists
        if not Account.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is not registered.")
        return value
    
class RegisterRequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, required=True)
    email = serializers.EmailField(required=True)

    def validate(self, attrs): 
        if not OTP.objects.filter(email=attrs.get('email'), otp=attrs.get('otp'), revoked=False).exists():
            raise serializers.ValidationError("Invalid OTP")
        otp = OTP.objects.get(email=attrs.get('email'), otp=attrs.get('otp'), revoked=False)
        if otp.expired_at < timezone.now():
            raise serializers.ValidationError("OTP has expired")
        return attrs
    
class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    def validate(self, attrs):        
        try:
            validate_password(attrs.get('password'))
        except serializers.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        
        return attrs