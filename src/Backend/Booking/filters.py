import django_filters
from .models import Table, Reservation

class TableFilterSet(django_filters.FilterSet):
    nos_min = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='gte')
    nos_max = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='lte')
    status = django_filters.CharFilter(field_name="status", lookup_expr= 'exact')

    class Meta:
        model = Table
        fields = ['nos_min', 'nos_max', 'status']

class ReservationFilterSet(django_filters.FilterSet):
    date_range = django_filters.DateFromToRangeFilter(field_name="date")
    date = django_filters.DateFilter(field_name="date")
    time_range = django_filters.TimeRangeFilter(field_name="time")
    time = django_filters.TimeFilter(field_name="time")
    phone_number = django_filters.CharFilter(field_name="phone_number", lookup_expr='exact')

    class Meta:
        model = Reservation
        fields = ['date_range', 'date', 'time_range', 'time', 'phone_number']