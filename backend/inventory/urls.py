from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import (
    ItemViewSet,
    PurchaseOrderViewSet,
    PurchaseOrderItemViewSet,
    InventoryViewSet,
    SupplierViewSet,
    DepartmentInventoryViewSet,
    IncomingItemViewSet,
    RequisitionItemViewSet,
    RequisitionViewSet,
    download_requisition_pdf,
    download_purchaseorder_pdf,
    download_goods_receipt_note_pdf,
    InventoryInsuranceSalepriceViewSet,
    IncomingItemViewSet
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'department-inventory', DepartmentInventoryViewSet)
router.register(r'requisition', RequisitionViewSet, basename='requisition')
router.register(r'incoming-item', IncomingItemViewSet, basename='incoming-item-list')
router.register(r'insurance-prices', InventoryInsuranceSalepriceViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-orders')
router.register(r'requisitionitems', RequisitionItemViewSet, basename='requisitionitems')

requisition_url = NestedDefaultRouter(router, 'requisition', lookup='requisition')
requisition_url.register(r'requisitionitems', RequisitionItemViewSet, basename='requisitionitems')
requisition_url.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-orders')

purchase_orders_url = NestedDefaultRouter(router, 'purchase-orders', lookup='purchaseorder')
purchase_orders_url.register(r'purchaseorderitems', PurchaseOrderItemViewSet, basename='purchase_order_items')



urlpatterns = [
    path('', include(router.urls)),
    path('', include(requisition_url.urls)),
    path('', include(purchase_orders_url.urls)),
    path('download__requisition_pdf/<int:requisition_id>/', download_requisition_pdf, name='download__requisition_pdf'),
    path('purchase-orders/all_purchase_orders/', PurchaseOrderViewSet.as_view({'get': 'all_purchase_orders'}), name='all_purchase_orders'),
    path('all_items', RequisitionItemViewSet.as_view({'get': 'all_items'}), name='all_items'),
    path('download_purchaseorder_pdf/<int:purchaseorder_id>/', download_purchaseorder_pdf, name='download_purchaseorder_pdf'),
    path('download-goods-receipt-note', download_goods_receipt_note_pdf, name='download_goods_receipt_note_pdf'),
    path('purchase-orders/<int:purchase_order_id>/pdf/', download_goods_receipt_note_pdf, name='incoming_items_pdf'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
