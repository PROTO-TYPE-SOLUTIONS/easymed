from django.contrib import admin
from .models import PurchaseOrder, Inventory, Supplier, Item


admin.site.register(PurchaseOrder)
admin.site.register(Inventory)
admin.site.register(Supplier)
admin.site.register(Item)