from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import render
from django.template.loader import get_template
from django.http import HttpResponse
from weasyprint import HTML
from .models import PurchaseOrderItem

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
)

from .serializers import (
    ItemSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer,
    IncomingItemSerializer,
    InventorySerializer,
    SupplierSerializer,
    DepartmentSerializer,
    DepartmentInventorySerializer,
    RequisitionSerializer,
    RequisitionItemSerializer,  

)

from .filters import (
    InventoryFilter,
    ItemFilter,
    PurchaseOrderFilter,
    SupplierFilter
)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ItemFilter

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PurchaseOrderFilter

class IncomingItemViewSet(viewsets.ModelViewSet):
    queryset = IncomingItem.objects.all()
    serializer_class = IncomingItemSerializer


class DepartmentInventoryViewSet(viewsets.ModelViewSet):
    queryset = DepartmentInventory.objects.all()
    serializer_class = DepartmentInventorySerializer

class RequisitionViewSet(viewsets.ModelViewSet):
    queryset = Requisition.objects.all()
    serializer_class = RequisitionSerializer

class RequisitionItemViewSet(viewsets.ModelViewSet):
    queryset = RequisitionItem.objects.all()
    serializer_class = RequisitionItemSerializer    

    @action(detail=False, methods=['GET'])
    def by_requisition_id(self, request, requisition_id):
        items = RequisitionItem.objects.filter(requisition_id=requisition_id)
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
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer

class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer 

    @action(detail=False, methods=['GET'])
    def by_purchase_order_id(self, request, purchase_order_id):
        items = PurchaseOrderItem.objects.filter(purchase_order_id=purchase_order_id)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)



'''
This view gets the geneated pdf and downloads it locally
pdf accessed here http://127.0.0.1:8080/download_requisition_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

from .models import Requisition
from company.models import Company

def download_requisition_pdf(request, requisition_id):
    requisition = get_object_or_404(Requisition, pk=requisition_id)
    requisition_items = RequisitionItem.objects.filter(requisition=requisition)
    html_template = get_template('requisition.html').render({'requisition_items': requisition_items})
    from weasyprint import HTML
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
    
    from weasyprint import HTML
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="purchase_order_report_{purchaseorder_id}.pdf"'

    return response
