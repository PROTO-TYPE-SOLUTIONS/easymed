from django.contrib import admin
from .models import Invoice, InvoiceItem, PaymentMode, InsuranceCoPay


admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(PaymentMode)
admin.site.register(InsuranceCoPay)


