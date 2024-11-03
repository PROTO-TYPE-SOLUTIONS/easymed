from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

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
    download_purchaseorder_pdf,
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'department-inventory', DepartmentInventoryViewSet)
router.register(r'requisition', RequisitionViewSet, basename='requisition')
router.register(r'purchase-order-item', PurchaseOrderItemViewSet)
router.register(r'incoming-item', IncomingItemViewSet)

requisition_url=NestedDefaultRouter(router, 'requisition', lookup='requisition')

requisition_url.register(r'requisitionitems', RequisitionItemViewSet, basename='requisitionitems')
requisition_url.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-orders')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(requisition_url.urls)),
    path('download__requisition_pdf/<int:requisition_id>/', download_requisition_pdf, name='download__requisition_pdf'),
    path('download_purchaseorder_pdf/<int:purchaseorder_id>/', download_purchaseorder_pdf, name='download_purchaseorder_pdf'),


    path('requisition-item/by-requisition-id/<int:requisition_id>/', RequisitionItemViewSet.as_view({'get': 'by_requisition_id'}), name='requisition-item-by-requisition-id'),
    path('purchase-order-item/by-purchase-order-id/<int:purchase_order_id>/', PurchaseOrderItemViewSet.as_view({'get': 'by_purchase_order_id'}), name='purchase-order-item-by-purchase-order-id'),

    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)