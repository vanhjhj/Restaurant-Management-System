from rest_framework import serializers
from .models import *
import datetime

class TableSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Table
        fields = ('id', 'number_of_seats', 'status')
    

class ReservationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Reservation
        fields = ('id', 'guest_name', 'phone_number', 'date', 'time', 'note')
    
    def to_representation(self, instance):
        # Trả về số điện thoại không có mã quốc gia
        representation = super().to_representation(instance)
        phone_number = representation.get('phone_number', '')
        if phone_number.startswith('+84'):
            representation['phone_number'] = '0' + phone_number[3:]  # Bỏ mã +84 và thêm số 0
        return representation
    
    def validate(self, attrs):
        if attrs.get('date') < datetime.date.today():
            raise serializers.ValidationError({'date': 'Date must be greater than or equal to today'})
        elif attrs.get('date') == datetime.date.today() and attrs.get('time') < datetime.datetime.now().time():
            raise serializers.ValidationError({'time': 'Time must be greater than or equal to current time'})
        return attrs
    
