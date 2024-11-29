import django_filters
from .models import Table, Reservation, Order

class TableFilterSet(django_filters.FilterSet):
    nos_min = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='gte')
    nos_max = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='lte')
    status = django_filters.CharFilter(field_name="status", lookup_expr= 'exact')

    class Meta:
        model = Table
        fields = ['number_of_seats', 'status']

class ReservationFilterSet(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name="date")
    date = django_filters.DateFilter(field_name="date")
    time_range = django_filters.TimeRangeFilter(field_name="time")
    time = django_filters.TimeFilter(field_name="time")
    phone_number = django_filters.CharFilter(field_name="phone_number", lookup_expr='exact')

    class Meta:
        model = Reservation
        fields = ['date', 'time', 'phone_number']

class OrderFilterSet(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name="date")
    date = django_filters.DateFilter(field_name="date")
    total_price_range = django_filters.NumericRangeFilter(field_name="total_price")
    final_price_range = django_filters.NumericRangeFilter(field_name="final_price")
    total_discount_range = django_filters.NumericRangeFilter(field_name="total_discount")
    table = django_filters.NumberFilter(field_name="table", lookup_expr='exact')

    class Meta:
        model = Order
        fields = ['date', 'total_price', 'final_price', 'total_discount', 'table']