import django_filters
from .models import Table

class TableFilterSet(django_filters.FilterSet):
    nos_min = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='gte')
    nos_max = django_filters.NumberFilter(field_name="number_of_seats", lookup_expr='lte')
    status = django_filters.CharFilter(field_name="status", lookup_expr= 'exact')

    class Meta:
        model = Table
        fields = ['nos_min', 'nos_max', 'status']