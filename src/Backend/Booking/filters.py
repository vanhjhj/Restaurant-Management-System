import django_filters
from django.db.models import Case, When, IntegerField
from .models import Table, Reservation, Order, OrderItem

class TableFilterSet(django_filters.FilterSet):
    nos_min = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='gte')
    nos_max = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='lte')
    status = django_filters.CharFilter(field_name="status", lookup_expr= 'exact')

    class Meta:
        model = Table
        fields = ['number_of_seats', 'status']

def custom_status_reservation_order(queryset):
    queryset = queryset.annotate(
        status_order=Case(
            When(status='P', then=0),
            When(status='A', then=1),
            When(status='D', then=2),
            When(status='C', then=3),
            default=4,  # Nếu status không phải trong các giá trị trên
            output_field=IntegerField()
        )
    )
    
    return queryset.order_by('status_order')

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

class OrderItemFilterSet(django_filters.FilterSet):
    order = django_filters.NumberFilter(field_name="order", lookup_expr='exact')
    menu_item = django_filters.NumberFilter(field_name="menu_item", lookup_expr='exact')

    class Meta:
        model = OrderItem
        fields = ['order', 'menu_item']