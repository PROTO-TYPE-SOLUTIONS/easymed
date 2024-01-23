from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.conf import settings
from django.conf.urls.static import static


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
    download_requisition_pdf,
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
router.register(r'incoming-item', IncomingItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('download__requisition_pdf/<int:requisition_id>/', download_requisition_pdf, name='download__requisition_pdf'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)