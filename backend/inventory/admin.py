from django.contrib import admin
from .models import PurchaseOrder, Inventory, Supplier, Item, Requisition, IncomingItem, DepartmentInventory, Department, InventoryInsuranceSaleprice

admin.site.register(PurchaseOrder)
admin.site.register(Inventory)
admin.site.register(Supplier)
admin.site.register(Item)
admin.site.register(Requisition)
admin.site.register(IncomingItem)
admin.site.register(DepartmentInventory)
admin.site.register(Department)
admin.site.register(InventoryInsuranceSaleprice)