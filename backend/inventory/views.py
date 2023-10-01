from rest_framework import viewsets
from .models import Item, Purchase_Order, Sale_Order, Inventory, Supplier
from .serializers import (
    ItemSerializer,
    PurchaseSerializer,
    SaleSerializer,
    InventorySerializer,
    SupplierSerializer,
)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase_Order.objects.all()
    serializer_class = PurchaseSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale_Order.objects.all()
    serializer_class = SaleSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
