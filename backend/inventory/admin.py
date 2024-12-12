from django.contrib import admin
from .models import (
    PurchaseOrder, Inventory, Supplier, SupplierInvoice, Item,
    Requisition, IncomingItem, DepartmentInventory,
    Department, InventoryInsuranceSaleprice,
    GoodsReceiptNote, PurchaseOrderItem
)

admin.site.register(PurchaseOrder)
admin.site.register(PurchaseOrderItem)
admin.site.register(Inventory)
admin.site.register(Supplier)
admin.site.register(SupplierInvoice)
admin.site.register(Item)
admin.site.register(Requisition)
admin.site.register(IncomingItem)
admin.site.register(DepartmentInventory)
admin.site.register(Department)
admin.site.register(InventoryInsuranceSaleprice)
admin.site.register(GoodsReceiptNote)


