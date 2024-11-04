from rest_framework import serializers
from .models import Account, CustomerAccount, EmployeeAccount, Department
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from phonenumber_field.serializerfields import PhoneNumberField
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = Account
        fields = ('id', 'username', 'password', 'account_type')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        print('create')
        account_data = {
            'username': validated_data.pop('username'),
            'password': make_password(validated_data.pop('password')),
            'account_type': validated_data.pop('account_type')
        }

        account = Account.objects.create(**account_data)
        return account

    def validate(self, attrs):
        if attrs.get('password'):
            try:
                validate_password(attrs.get('password'))
            except serializers.ValidationError as e:
                raise serializers.ValidationError({'password': list(e.messages)})
        
        return attrs
    

class EmployeeAccountSerializer(serializers.ModelSerializer):

    account_id = serializers.IntegerField()
    id = serializers.IntegerField(read_only=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())

    class Meta:
        model = EmployeeAccount
        fields = ('account_id', 'id', 'full_name', 'date_of_birth', 'gender', 'start_working_date', 'address', 'department')

    def create(self, validated_data):
        account_id = validated_data.pop('account_id')
        account = Account.objects.get(pk=account_id)
        employee = EmployeeAccount.objects.create(account=account, **validated_data)
        return employee
    
    def validate(self, attrs):
        #checking if account_id exists and is an employee account
        if attrs.get('account_id'):
            if not Account.objects.filter(pk= attrs.get('account_id')).exists():
                raise serializers.ValidationError({'account_id': 'Account does not exist'})
        
            if Account.objects.get(pk=attrs.get('account_id')).account_type != 'Employee':
                raise serializers.ValidationError({'account_type': 'Account is not an employee account'})

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

        if start_working_date < date_of_birth:
            raise serializers.ValidationError({'start_working_date': 'Start working date must be after date of birth'})

        return attrs


class CustomerAccountSerializer(serializers.ModelSerializer):
    account_id = serializers.IntegerField()
    id = serializers.IntegerField(read_only=True)
    class Meta:
        model = CustomerAccount
        fields = ('account_id', 'id', 'full_name', 'phone_number', 'gender')
    
    def to_representation(self, instance):
        # Trả về số điện thoại không có mã quốc gia
        representation = super().to_representation(instance)
        phone_number = representation.get('phone_number', '')
        if phone_number.startswith('+84'):
            representation['phone_number'] = '0' + phone_number[3:]  # Bỏ mã +84 và thêm số 0
        return representation
    
    def create(self, validated_data):
        account_id = validated_data.pop('account_id')
        account = Account.objects.get(pk=account_id)
        customer = CustomerAccount.objects.create(account=account, **validated_data)
        return customer
    
    def validate(self, attrs):
        #checking if account_id exists and is a customer account
        if attrs.get('account_id'):
            if not Account.objects.filter(pk= attrs.get('account_id')).exists():
                raise serializers.ValidationError({'account_id': 'Account does not exist'})
        
            if Account.objects.get(pk=attrs.get('account_id')).account_type != 'Customer':
                raise serializers.ValidationError({'account_type': 'Account is not a customer account'})
            
        return attrs


