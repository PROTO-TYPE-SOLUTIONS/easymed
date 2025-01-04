import os
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response # type: ignore
from rest_framework.exceptions import ValidationError
from weasyprint import HTML
from django.shortcuts import render, get_object_or_404
from django.template.loader import get_template
from django.http import HttpResponse
from django.conf import settings
from rest_framework.generics import ListAPIView
from django.utils.timezone import now
from django.db import models
from django.db.models import F
from datetime import timedelta


from company.models import Company
from customuser.models import CustomUser
from .models import (
    Item,
    Inventory,
    Supplier,
    SupplierInvoice,
    IncomingItem,
    DepartmentInventory,
    RequisitionItem,
    Requisition,
    PurchaseOrder,
    PurchaseOrderItem,
    InventoryInsuranceSaleprice,
    GoodsReceiptNote,
    Quotation,
    QuotationItem,
    SupplierInvoice
    

)

from .serializers import (
    ItemSerializer,
    PurchaseOrderCreateSerializer,
    PurchaseOrderListSerializer,
    PurchaseOrderItemListUPdateSerializer,
    InventorySerializer,
    SupplierSerializer,
    SupplierInvoiceSerializer,
    RequisitionItemCreateSerializer,
    DepartmentInventorySerializer,
    RequisitionCreateSerializer,
    RequisitionUpdateSerializer,
    RequisitionItemListUpdateSerializer,
    RequisitionListSerializer,
    IncomingItemSerializer,
    InventoryInsuranceSalepriceSerializer,
    GoodsReceiptNoteSerializer,
    QuotationSerializer,
    QuotationItemSerializer
)

from .filters import (
    InventoryFilter,
    ItemFilter,
    PurchaseOrderFilter,
    SupplierFilter,
    RequisitionItemFilter
)

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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['supplier_invoice', 'purchase_order', 'supplier']

    def perform_create(self, serializer):
        """
        When creating an IncomingItem, ensure it's linked to the correct supplier_invoice
        and the supplier matches the one on the invoice
        """
        supplier_invoice = serializer.validated_data.get('supplier_invoice')
        supplier = serializer.validated_data.get('supplier')
        
        if supplier_invoice and supplier != supplier_invoice.supplier:
            raise ValidationError(
                "Supplier must match the supplier on the invoice"
            )
        
        serializer.save()


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


class SupplierInvoiceViewSet(viewsets.ModelViewSet):
    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['supplier', 'purchase_order', 'status']

    def get_queryset(self):
        queryset = SupplierInvoice.objects.all().select_related(
            'supplier',
            'purchase_order',
            'purchase_order__requisition'
        ).prefetch_related(
            'incomingitem_set__goods_receipt_note'
        )
        return queryset

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
            serializer.save(created_by=self.request.user)
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

    
class InventoryInsuranceSalepriceViewSet(viewsets.ModelViewSet):
    queryset = InventoryInsuranceSaleprice.objects.all()
    serializer_class = InventoryInsuranceSalepriceSerializer


class InventoryFilterView(ListAPIView):
    '''
    To get Low Quantity Drugs, use: GET /inventory/filter/?category=Drug&filter_type=low_quantity
    To get near expiry drugs, use: GET /inventory/filter/?category=Drug&filter_type=near_expiry
    To get near-expiry Lab Reagents, use: GET /inventory/filter/?category=LabReagent&filter_type=near_expiry

    ...get it?
    '''
    serializer_class = InventorySerializer

    def get_queryset(self):
        category = self.request.query_params.get('category', None)
        filter_type = self.request.query_params.get('filter_type', None)

        if not category or not filter_type:
            raise ValidationError({"error": "Both 'category' and 'filter_type' parameters are required."})

        queryset = Inventory.objects.filter(item__category=category)

        # we can add more filter types
        if filter_type == 'low_quantity':
            queryset = queryset.filter(quantity_at_hand__lte=F('re_order_level'))
        elif filter_type == 'near_expiry':
            today = now().date()
            three_months_later = today + timedelta(days=90)  # 3 months from now
            five_months_later = today + timedelta(days=150)  # 5 months from now
            queryset = queryset.filter(expiry_date__range=[three_months_later, five_months_later])
        elif not queryset.exists():
            return Response([], status=status.HTTP_200_OK)
        else:
            raise ValidationError({"error": f"Invalid filter_type: {filter_type}. Must be 'low_quantity' or 'near_expiry'."})

        return queryset


class GoodsReceiptNoteViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceiptNote.objects.all()
    serializer_class = GoodsReceiptNoteSerializer

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer


class QuotationItemViewSet(viewsets.ModelViewSet):
    queryset = QuotationItem.objects.all()
    serializer_class = QuotationItemSerializer

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
    '''
    Picture this, you have 1 crate of 30 eggs
    Quantity ordered is 60 eggs.
    But on the LPO pdf we want to see 2 crates. Get it?
    '''
    purchase_order = get_object_or_404(PurchaseOrder, pk=purchaseorder_id)
    purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=purchase_order)
    company = Company.objects.first()
    user = CustomUser.objects.first()

    company_logo_url = request.build_absolute_uri(company.logo.url) if company.logo else None

    context = {
        'purchaseorder': purchase_order,
        'purchaseorder_items': purchase_order_items,
        'company': company,
        'company_logo_url': company_logo_url,
        'user': user
    }

    html_template = get_template('purchase_order_note.html').render(context)
    
    pdf_file = HTML(string=html_template).write_pdf()

    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="purchase_order_report_{purchaseorder_id}.pdf"'

    return response


def download_goods_receipt_note_pdf(request, purchase_order_id):
    incoming_items = IncomingItem.objects.filter(purchase_order_id=purchase_order_id)
    company = Company.objects.first()
    
    # Extract the Goods Receipt Note and its number (assuming all items share the same GRN)
    goods_receipt_note = incoming_items.first().goods_receipt_note if incoming_items.exists() else None
    grn_number = goods_receipt_note.grn_number if goods_receipt_note else "N/A"
    # Prepare data for the template
    item_details = []
    total_price_before_vat = 0
    total_vat = 0
    total_amount_after_vat = 0

    for item in incoming_items:
        amount_before_vat = item.purchase_price * item.quantity
        vat_amount = amount_before_vat * (item.item.vat_rate / 100)
        amount_with_vat = amount_before_vat + vat_amount
        
        total_price_before_vat += amount_before_vat
        total_vat += vat_amount
        total_amount_after_vat += amount_with_vat
        item_details.append({
            'supplier': item.supplier,
            'item_code': item.item.item_code,  # Fixed: Access item_code through the item relationship
            'lot_number': item.lot_no,
            'item_name': item.item.name,
            'quantity_received': item.quantity,
            'unit_price': item.purchase_price,
            'amount_before_vat': amount_before_vat,
            'vat_amount': vat_amount,
            'amount_with_vat': amount_with_vat
        })

    # Construct full logo URL for template
    company_logo_url = request.build_absolute_uri(company.logo.url) if company.logo else None

    context = {
        'incoming_items': incoming_items,
        'company': company,
        'company_logo_url': company_logo_url,
        'grn_number': grn_number,
        'item_details': item_details,
        'total_price_before_vat': total_price_before_vat,
        'total_vat': total_vat,
        'total_amount_after_vat': total_amount_after_vat
        
    }

    html_template = get_template('goods_receipt_note.html').render(context)
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="incoming_items.pdf"'
    return response


def download_supplier_invoice_pdf(request, supplier_id):
    supplier = get_object_or_404(Supplier, pk=supplier_id)
    supplier_invoices = SupplierInvoice.objects.filter(supplier=supplier).prefetch_related('incomingitem_set')
    incoming_items = IncomingItem.objects.filter(supplier_invoice__supplier=supplier)
    company = Company.objects.first()

    company_logo_url = request.build_absolute_uri(company.logo.url) if company.logo else None

    context = {
        'supplier': supplier,
        'supplier_invoices': supplier_invoices,
        'company': company,
        'company_logo_url': company_logo_url,
        'incoming_items': incoming_items,
    }

    html_template = get_template('supplier_invoice.html').render(context)

    pdf_file = HTML(string=html_template).write_pdf()

    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="supplier_invoice_report_{supplier_id}.pdf"'

    return response
