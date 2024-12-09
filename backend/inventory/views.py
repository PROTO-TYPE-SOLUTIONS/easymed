import os
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response # type: ignore
from weasyprint import HTML

from django.shortcuts import render, get_object_or_404
from django.template.loader import get_template
from django.http import HttpResponse
from weasyprint import HTML
from .models import PurchaseOrderItem
from django.http import HttpResponse
from django.conf import settings


from .models import Requisition
from company.models import Company
from .models import (
    Item,
    Inventory,
    Supplier,
    IncomingItem,
    DepartmentInventory,
    RequisitionItem,
    Requisition,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceiptNote,
    GoodsReceiptNoteItem,
    InventoryInsuranceSaleprice,
    

)

from .serializers import (
    ItemSerializer,
    PurchaseOrderCreateSerializer,
    PurchaseOrderListSerializer,
    PurchaseOrderItemListUPdateSerializer,
    InventorySerializer,
    SupplierSerializer,
    RequisitionItemCreateSerializer,
    DepartmentInventorySerializer,
    RequisitionCreateSerializer,
    RequisitionUpdateSerializer,
    RequisitionItemListUpdateSerializer,
    RequisitionListSerializer,
    IncomingItemSerializer,
    InventoryInsuranceSalepriceSerializer,
    GoodsReceiptNoteSerializer
)

from .filters import (
    InventoryFilter,
    ItemFilter,
    PurchaseOrderFilter,
    SupplierFilter,
    RequisitionItemFilter
)
from authperms.permissions import IsSystemsAdminUser

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ItemFilter

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderCreateSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PurchaseOrderFilter

class IncomingItemViewSet(viewsets.ModelViewSet):
    queryset = IncomingItem.objects.all()
    serializer_class = IncomingItemSerializer


class DepartmentInventoryViewSet(viewsets.ModelViewSet):
    queryset = DepartmentInventory.objects.all()
    serializer_class = DepartmentInventorySerializer

class RequisitionViewSet(viewsets.ModelViewSet):
    """
    Allows CRUD operations for a requisition and individual requisition items. 
    It also facilitates the creation of a purchase order linked to a specific requisition.

                                **URL Patterns**
    1. **Create Requisition** (`POST /inventory/requisition/`):
        Example Request:
         {
           "requested_by": 1,
           "department": 3,
           "items": [
             {"item": 3, "quantity_requested": 10, "preferred_supplier": 1}
           ]
         }

    2. **List All Requisitions** (`GET /inventory/requisition/`)

    3. **Retrieve, Update, or Delete a Requisition** (`GET/PUT/PATCH/DELETE /inventory/requisition/<id>/`)

    4. **Retrieve, Update, or Delete a RequisitionItems** `/inventory/requisition/<id>/requisitionitems/`

    5. **Retrieve, Update, or Delete a a single requisition item** `/inventory/requisition/<id>/requisitionitems/<id>`

    6. **Retrieve all or create purchase orders linked to the requisition** `/inventory/requisition/<id>/purchase-orders/`

    """

    queryset = Requisition.objects.all()

    def get_serializer_class(self):
        if self.action in ['create']:
            return RequisitionCreateSerializer
        elif self.action in ['retrieve', 'list']:
            return RequisitionListSerializer
        elif self.action in ['update', 'partial_update']:
            return RequisitionUpdateSerializer
        return super().get_serializer_class()

    
class RequisitionItemViewSet(viewsets.ModelViewSet):
    """
    Provides CRUD operations for requisition items.

    1. **Retrieve or Create Requisition Items Linked to a Specific Requisition**
       - **Endpoint**: `/inventory/requisition/<requisition_pk>/requisitionitems/`
       - **Example Request Body for POST**:
         ```json
         {
           "item": 1,
           "quantity_requested": 10,
           "preferred_supplier": 3
         }
         ```

    2. **Retrieve, Update, or Delete a Specific Requisition Item**
       - **Endpoint**: `/inventory/requisition/<requisition_pk>/requisitionitems/<requisitionitem_id>/`

    3. **Retrieve All Requisition Items with Pending Status**
       - **Endpoint**: `/inventory/requisitionitems/all_items/`
    """

    queryset = RequisitionItem.objects.all()
    serializer_class = RequisitionItemListUpdateSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequisitionItemFilter

    def get_serializer_class(self):
        if self.request.method == "POST":
            return RequisitionItemCreateSerializer
        elif self.request.method in ["PUT", "PATCH"]:
            return RequisitionItemListUpdateSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        requisition_id = self.kwargs.get('requisition_pk')
        return  RequisitionItem.objects.filter(requisition=requisition_id)

    def get_serializer_context(self):
        requisition_id = self.kwargs.get('requisition_pk')
        return {'requisition_id': requisition_id}
    
    @action(detail=False, methods=['get'], url_path='all_items')
    def all_items(self, request):
        """Custom endpoint to return all requisition items ordered by status"""
        items = RequisitionItem.objects.filter(status='PENDING')
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)
    
class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ['item',]
    filterset_class = InventoryFilter

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SupplierFilter

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderCreateSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        requisition_id = self.kwargs.get('requisition_pk')
        if requisition_id:
            return PurchaseOrder.objects.filter(requisition_id=requisition_id)
        return PurchaseOrder.objects.all()

    def get_serializer_context(self):
        requisition_id = self.kwargs.get('requisition_pk')
        return {
            'request': self.request,
            'requisition_id': requisition_id,
            'requested_by': self.request.user 
        }
    
    def get_serializer_class(self):
        if self.request.method == 'post':
            return PurchaseOrderCreateSerializer
        return PurchaseOrderListSerializer
    
    def create(self, request, *args, **kwargs):
        context = self.get_serializer_context()
        serializer = PurchaseOrderCreateSerializer(data=request.data, context=context)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)},status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['get'])
    def all_purchase_orders(self, request):
        purchase_orders = PurchaseOrder.objects.all()
        serializer = PurchaseOrderListSerializer(purchase_orders, many=True)
        return Response(serializer.data)
    
class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseOrderItemListUPdateSerializer
    allowed_http_methods = ['get', 'put']
    lookup_field = 'id' 
    def get_queryset(self):
        purchase_order_id = self.kwargs.get('purchaseorder_pk')
        return PurchaseOrderItem.objects.filter(purchase_order=purchase_order_id)


class GoodsReceiptNoteViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceiptNote.objects.all()
    serializer_class = GoodsReceiptNoteSerializer

    def get_serializer_context(self):
        purchase_order_id = self.kwargs.get('purchaseorder_pk')
        print(self.request.user.id)
        return {
            'purchase_order_id': purchase_order_id,
            'updated_by': self.request.user
            }
    
class InventoryInsuranceSalepriceViewSet(viewsets.ModelViewSet):
    queryset = InventoryInsuranceSaleprice.objects.all()
    serializer_class = InventoryInsuranceSalepriceSerializer
    

def download_requisition_pdf(request, requisition_id):
    '''
    This view gets the geneated pdf and downloads it locally
    pdf accessed here http://127.0.0.1:8080/download_requisition_pdf/26/
    '''
    print(requisition_id)
    requisition = get_object_or_404(Requisition, pk=requisition_id)
    print(requisition)
    requisition_items = RequisitionItem.objects.filter(requisition=requisition)
    print(requisition_items)
    html_template = get_template('requisition.html').render({'requisition': requisition, 'requisition_items': requisition_items})
    
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="purchase_order_report_{requisition_id}.pdf"'

    return response


def download_purchaseorder_pdf(request, purchaseorder_id):
    purchase_order = get_object_or_404(PurchaseOrder, pk=purchaseorder_id)
    purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=purchase_order)
    company = Company.objects.first()

    html_template = get_template('purchaseorder.html').render({
        'purchaseorder': purchase_order,
        'purchaseorder_items': purchase_order_items,
        'company': company
    })
    
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="purchase_order_report_{purchaseorder_id}.pdf"'

    return response


def download_goods_receipt_note_pdf(request, receiptnote_id):
    receiptnote = get_object_or_404(GoodsReceiptNote, pk=receiptnote_id)
    receiptnote_items = GoodsReceiptNoteItem.objects.filter(receiptnote=receiptnote)
    company = Company.objects.first()

    html_template = get_template('goodsreceiptnote.html').render({
        'receiptnote': receiptnote,
        'receiptnote_items': receiptnote_items,
        'company': company
    })
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="receipt_note_report_{receiptnote_id}.pdf"'

    return response