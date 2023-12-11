from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet,
    PurchaseViewSet,
    IncomingItemViewSet,
    InventoryViewSet,
    SupplierViewSet,
    DepartmentInventoryViewSet,
    RequisitionViewSet,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
# router.register(r'orderbill', SaleViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'department-inventory', DepartmentInventoryViewSet)
router.register(r'requisition', RequisitionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
