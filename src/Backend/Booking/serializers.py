from rest_framework import serializers
from .models import *
import datetime
from Menu.serializers import MenuItemSerializer


class TableSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Table
        fields = ('id', 'number_of_seats', 'status')


class ReservationSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    table = serializers.PrimaryKeyRelatedField(
        queryset=Table.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Reservation
        fields = ('id', 'guest_name', 'phone_number', 'date', 'time',
                  'number_of_guests', 'note', 'status', 'table')

    def to_representation(self, instance):
        # Trả về số điện thoại không có mã quốc gia
        representation = super().to_representation(instance)
        phone_number = representation.get('phone_number', '')
        if phone_number.startswith('+84'):
            representation['phone_number'] = '0' + \
                phone_number[3:]  # Bỏ mã +84 và thêm số 0
        return representation

    def validate(self, attrs):
        date = attrs.get('date')
        time = attrs.get('time')
        if date and time:
            if date < datetime.date.today():
                raise serializers.ValidationError(
                    {'date': 'Date must be greater than or equal to today'})
            elif date == datetime.date.today() and time < datetime.datetime.now().time():
                raise serializers.ValidationError(
                    {'time': 'Time must be greater than or equal to current time'})

        return attrs


class ReservationAssignTableSerializer(serializers.ModelSerializer):
    table = serializers.PrimaryKeyRelatedField(
        queryset=Table.objects.all(), required=True)

    class Meta:
        model = Reservation
        fields = ('table',)
        extra_kwargs = {
            'table': {'required': True}
        }


class OrderSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    table = serializers.PrimaryKeyRelatedField(queryset=Table.objects.all())

    class Meta:
        model = Order
        fields = ('id', 'datetime', 'total_price', 'total_discount',
                  'final_price', 'status', 'table')
        extra_kwargs = {
            'datetime': {'read_only': True},
            'total_price': {'read_only': True},
            'total_discount': {'read_only': True},
            'final_price': {'read_only': True},
        }

    def validate(self, attrs):
        # at once time only has one order link to table with NP status
        table_id = attrs.get('table')
        if Order.objects.filter(table=table_id, status='NP').exists():
            raise serializers.ValidationError(
                {'table': 'Table has already had an order'})
        return attrs


class OrderItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    menu_item = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(), write_only=True)
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'order', 'menu_item', 'menu_item_detail',
                  'quantity', 'price', 'total', 'note', 'status')
        extra_kwargs = {
            'price': {'read_only': True},
            'total': {'read_only': True},
        }
