import django_filters

# models
from .models import (
    Inventory,
    Item,
    OrderBill,
    PurchaseOrder,
    Supplier
)

class InventoryFilter(django_filters.FilterSet):
    location = django_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = Inventory
        fields = ('location',)


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
        fields = ('quantity', 'Total_Cost', 'supplier_ID__name')


class OrderBillFilter(django_filters.FilterSet):
    payment_status = django_filters.CharFilter(lookup_expr='exact')
    class Meta:
        model = OrderBill
        fields = ('payment_status',)


class SupplierFilter(django_filters.FilterSet):
    class Meta:
        model = Supplier
        fields = ('name',)