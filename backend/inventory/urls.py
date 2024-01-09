from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet,
    IncomingItemViewSet,
    InventoryViewSet,
    SupplierViewSet,
    DepartmentInventoryViewSet,
    RequisitionViewSet,
    RequisitionItemViewSet,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'department-inventory', DepartmentInventoryViewSet)
router.register(r'requisition', RequisitionViewSet)
router.register(r'requisition-tem', RequisitionItemViewSet)
router.register(r'purchase-order', PurchaseOrderViewSet)
router.register(r'purchase-order-item', PurchaseOrderItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
