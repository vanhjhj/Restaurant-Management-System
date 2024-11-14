import django_filters
from .models import MenuItem

class MenuItemFilter(django_filters.FilterSet):
    category_search = django_filters.CharFilter(field_name="category__name", lookup_expr='icontains')  
    menuitem_search = django_filters.CharFilter(field_name="name", lookup_expr='icontains')  
    price_min = django_filters.NumberFilter(field_name="price", lookup_expr='gte')  
    price_max = django_filters.NumberFilter(field_name="price", lookup_expr='lte')  

    class Meta:
        model = MenuItem
        fields = ['category_search', 'menuitem_search', 'price_min', 'price_max']
