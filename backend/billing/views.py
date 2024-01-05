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