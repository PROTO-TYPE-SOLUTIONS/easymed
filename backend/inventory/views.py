from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Item, PurchaseOrder, OrderBill, Inventory, Supplier
from .serializers import (
    ItemSerializer,
    PurchaseSerializer,
    SaleSerializer,
    InventorySerializer,
    SupplierSerializer,
    OrderBillSerializer,
)

# filters
from .filters import (
    InventoryFilter,
    ItemFilter,
    OrderBillFilter,
    PurchaseOrderFilter,
    SupplierFilter
)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ItemFilter


class OrderBillViewSet(viewsets.ModelViewSet):
    queryset = OrderBill.objects.all()
    serializer_class = OrderBillSerializer  
    filter_backends = (DjangoFilterBackend,)
    filterset_class = OrderBillFilter  

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PurchaseOrderFilter

class SaleViewSet(viewsets.ModelViewSet):
    queryset = OrderBill.objects.all()
    serializer_class = SaleSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = InventoryFilter

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SupplierFilter
