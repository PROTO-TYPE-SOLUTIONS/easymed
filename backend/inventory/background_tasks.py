from celery import shared_task
from django.db import transaction
from .models import Inventory, IncomingItem

@shared_task
def update_inventory_task(item_id, quantity, purchase_price, sale_price, packed, subpacked):
    with transaction.atomic():
        inventory, created = Inventory.objects.get_or_create(item_id=item_id)
        new_quantity = inventory.quantity_in_stock + quantity
        inventory.quantity_in_stock = new_quantity
        inventory.purchase_price = purchase_price
        inventory.sale_price = sale_price
        inventory.packed = packed
        inventory.subpacked = subpacked
        inventory.save()