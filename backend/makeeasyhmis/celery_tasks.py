from celery import shared_task
from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import IncomingItem, Inventory

from celery import shared_task
from inventory.models import IncomingItem, Inventory

@shared_task
def create_inventory_record(incoming_item_id):
    """
    Creates an Inventory record based on the provided IncomingItem ID.
    """
    try:
        incoming_item = IncomingItem.objects.get(id=incoming_item_id)

        # Create the Inventory record
        inventory = Inventory.objects.create(
            item=incoming_item.item,
            purchase_price=incoming_item.purchase_price,
            sale_price=incoming_item.sale_price,
            quantity_in_stock=incoming_item.quantity,
            packed=incoming_item.packed,
            subpacked=incoming_item.subpacked
        )

        # Log success or handle any errors if necessary
        print(f"Inventory record created for incoming item: {incoming_item}")
    except IncomingItem.DoesNotExist:
        print(f"Incoming item with ID {incoming_item_id} not found.")
        # Handle the exception appropriately, e.g., logging or notifying users