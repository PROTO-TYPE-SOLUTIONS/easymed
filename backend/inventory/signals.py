from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import IncomingItem, Inventory
from .tasks import update_inventory_task
from django.db import transaction

@receiver(post_save, sender=IncomingItem)
def update_inventory(sender, instance, **kwargs):
    with transaction.atomic():
        # Fetch or create the corresponding inventory record
        inventory, created = Inventory.objects.get_or_create(item=instance.item)

        # Calculate the new quantity in stock
        new_quantity = inventory.quantity_in_stock + instance.quantity

        # Update the inventory record
        inventory.quantity_in_stock = new_quantity
        inventory.purchase_price = instance.purchase_price
        inventory.sale_price = instance.sale_price
        inventory.packed = instance.packed
        inventory.subpacked = instance.subpacked
        inventory.save()
