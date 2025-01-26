import django_filters

# models
from .models import (
    Inventory,
    Item,
    PurchaseOrder,
    Supplier,
    PurchaseOrderItem,
    RequisitionItem

)

class RequisitionItemFilter(django_filters.FilterSet):
    class Meta:
        model = RequisitionItem
        fields = ['preferred_supplier']


class InventoryFilter(django_filters.FilterSet):
    item = django_filters.CharFilter(field_name='item__id', lookup_expr='icontains')
    department = django_filters.NumberFilter(field_name='department__id')
    department_name = django_filters.CharFilter(field_name='department__name', lookup_expr='icontains')

    class Meta:
        model = Inventory
        fields = ['item', 'department', 'department_name']


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

class PurchaseOrderSupplierFilter(django_filters.FilterSet):
    supplier = django_filters.ModelChoiceFilter(
        queryset=Supplier.objects.all(),
        method='filter_by_supplier',
        label='Supplier'
    )

    class Meta:
        model = PurchaseOrder
        fields = ['supplier']  # This field will be used in filtering

    def filter_by_supplier(self, queryset, name, value):
        """
        Filters PurchaseOrders by the supplier of their related PurchaseOrderItems.
        """
        return queryset.filter(purchase_order__supplier=value).distinct()




class PurchaseOrderItemFilter(django_filters.FilterSet):
    class Meta:
        model = PurchaseOrderItem
        fields = ( 'id', 'requisition_item')


class SupplierFilter(django_filters.FilterSet):
    class Meta:
        model = Supplier
        fields = ('common_name',)