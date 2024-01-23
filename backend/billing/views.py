from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Invoice, InvoiceItem
from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser
)
from .serializers import (InvoiceItemSerializer, InvoiceSerializer)

class InvoiceViewset(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class InvoiceItemViewset(viewsets.ModelViewSet):
        queryset = InvoiceItem.objects.all()
        serializer_class = InvoiceItemSerializer
        permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)




'''
This view gets the geneated pdf and downloads it ocally
pdf accessed here http://127.0.0.1:8080/download_invoice_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

from .models import Invoice

def download_invoice_pdf(request, invoice_id):
    invoice = get_object_or_404(Invoice, pk=invoice_id)

    # Path to the generated PDF file
    # pdf_file_path = os.path.join(settings.MEDIA_ROOT, invoice.invoice_file.name)
    pdf_file_path = os.path.join('./makeeasyhmis/static/invoices/', f'{invoice.invoice_number}.pdf')

    # Open the PDF file and serve it as an attachment
    with open(pdf_file_path, 'rb') as pdf_file:
        response = HttpResponse(pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{invoice.invoice_number}.pdf"'
        return response