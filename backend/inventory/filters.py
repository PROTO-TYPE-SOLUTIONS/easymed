import django_filters

# models
from .models import (
    Inventory,
    Item,
    PurchaseOrder,
    Supplier,
    PurchaseOrderItem
)

class InventoryFilter(django_filters.FilterSet):
    item = django_filters.CharFilter(field_name='item__id', lookup_expr='icontains')

    class Meta:
        model = Inventory
        fields = ['item']


class ItemFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    item_no = django_filters.CharFilter(lookup_expr='icontains')
    category = django_filters.CharFilter(lookup_expr='exact')
    class Meta:
        model = Item
        fields = ('name', 'item_no', 'category')


class PurchaseOrderFilter(django_filters.FilterSet):
    supplier_ID__name = django_filters.CharFilter(lookup_expr='icontains')
    class Meta:
        model = PurchaseOrder
        fields = ('id', 'supplier_ID__name')



class PurchaseOrderItemFilter(django_filters.FilterSet):
    class Meta:
        model = PurchaseOrderItem
        fields = ('quantity_purchased', 'id', 'item')


class SupplierFilter(django_filters.FilterSet):
    class Meta:
        model = Supplier
        fields = ('name',)