from django.shortcuts import render
from rest_framework import viewsets, status
from django.template.loader import get_template
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
from django.template.loader import get_template
from django.conf import settings
from weasyprint import HTML


from inventory.models import Inventory, Item
from company.models import Company


def download_invoice_pdf(request, invoice_id,):
    invoice = get_object_or_404(Invoice, pk=invoice_id)
    invoice_items = InvoiceItem.objects.filter(invoice=invoice)
    company = Company.objects.first()


    html_template = get_template('invoice.html').render({
        'invoice': invoice,
        'invoice_items': invoice_items,
        'company': company
    })
    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="invoice_report_{invoice_id}.pdf"'

    return response
