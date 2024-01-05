from django.contrib import admin
from .models import Invoice, InvoiceItem


admin.site.register(Invoice)
admin.site.register(InvoiceItem)


