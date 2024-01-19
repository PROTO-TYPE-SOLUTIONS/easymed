from celery import shared_task
from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import IncomingItem, Inventory

from celery import shared_task
from inventory.models import IncomingItem, Inventory

@shared_task
def create_or_update_inventory_record(incoming_item_id):
    """
    Creates a new Inventory record or updates an existing one based on the IncomingItem.
    """
    try:
        incoming_item = IncomingItem.objects.get(id=incoming_item_id)

        # Check if an Inventory record exists for the item
        inventory, created = Inventory.objects.get_or_create(
            item=incoming_item.item
        )

        # Update the existing record or create a new one
        if created:
            print(f"Inventory record created for incoming item: {incoming_item}")
        else:
            inventory.purchase_price = incoming_item.purchase_price
            inventory.sale_price = incoming_item.sale_price
            inventory.quantity_in_stock += incoming_item.quantity  # Increment quantity
            inventory.packed = incoming_item.packed
            inventory.subpacked = incoming_item.subpacked
            inventory.category_one = incoming_item.catgeory_1
            inventory.save()
            print(f"Inventory record updated for incoming item: {incoming_item}")

    except IncomingItem.DoesNotExist:
        print(f"Incoming item with ID {incoming_item_id} not found.")
        # Handle the exception appropriately