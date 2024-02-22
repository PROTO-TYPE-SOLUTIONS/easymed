from .models import Invoice, InvoiceItem, PaymentMode
from rest_framework import serializers


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'       


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = '__all__'


class PaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMode 
        fields = '__all__'       