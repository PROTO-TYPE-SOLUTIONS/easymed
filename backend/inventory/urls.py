from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet,
    PurchaseViewSet,
    SaleViewSet,
    InventoryViewSet,
    SupplierViewSet,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'purchases', PurchaseViewSet)
router.register(r'sales', SaleViewSet)
router.register(r'orderbill', SaleViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
