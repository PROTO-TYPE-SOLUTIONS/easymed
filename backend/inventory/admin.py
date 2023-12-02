from django.contrib import admin
from .models import OrderBill, PurchaseOrder, Inventory, Supplier, Item

admin.site.register(OrderBill)
admin.site.register(PurchaseOrder)
admin.site.register(Inventory)
admin.site.register(Supplier)
admin.site.register(Item)