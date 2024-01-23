from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
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


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    filter_backends = (DjangoFilterBackend,)
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



'''
This view gets the geneated pdf and downloads it locally
pdf accessed here http://127.0.0.1:8080/download_requisition_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

from .models import Requisition

def download_requisition_pdf(request, requisition_id):
    requisition = get_object_or_404(Requisition, pk=requisition_id)

    # Path to the generated PDF file
    # pdf_file_path = os.path.join(settings.MEDIA_ROOT, invoice.invoice_file.name)
    pdf_file_path = os.path.join('./makeeasyhmis/static/requisitions/', f'{requisition.id}.pdf')

    # Open the PDF file and serve it as an attachment
    with open(pdf_file_path, 'rb') as pdf_file:
        response = HttpResponse(pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{requisition.id}.pdf"'
        return response    