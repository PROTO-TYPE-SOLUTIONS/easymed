import logging
from django.dispatch import receiver
from django.db import transaction
from django.db.models import Q
from django.db.models import F
from django.db.models.signals import post_save, post_delete
from django.db.models import Sum
from django.db import models

from .models import (
    Requisition,
    PurchaseOrder,
    PurchaseOrderItem,
    IncomingItem,
    Inventory,
 
)

logger=logging.getLogger(__name__)

# There's a painful Race Condition when this is moved to celery
@receiver(post_save, sender=IncomingItem)
def update_inventory_after_incomingitem_creation(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                # Check if there is an existing inventory record for the same item and lot number
                # TODO: Add another check, expiry date, but could be redundand
                inventory = Inventory.objects.filter(
                    item=instance.item,
                    lot_number=instance.lot_no
                ).first()

                if inventory:
                    inventory.quantity_at_hand += instance.quantity
                    inventory.purchase_price = instance.purchase_price
                    inventory.sale_price = instance.sale_price
                    inventory.expiry_date = instance.expiry_date
                    inventory.save()
                else:
                    Inventory.objects.create(
                        item=instance.item,
                        purchase_price=instance.purchase_price,
                        sale_price=instance.sale_price,
                        quantity_at_hand=instance.quantity,
                        category_one=instance.category_one,
                        lot_number=instance.lot_no,
                        expiry_date=instance.expiry_date
                    )
        except Exception as e:
            # Handle the exception appropriately (e.g., log the error)
            print(f"Error updating inventory for incoming item: {instance.id}, Error: {e}")


@receiver([post_save, post_delete], sender=IncomingItem)
def update_supplier_invoice_amount(sender, instance, **kwargs):
    """
    Update the SupplierInvoice amount whenever an IncomingItem is created, updated, or deleted.
    The amount is calculated as the sum of (purchase_price * quantity) for all related IncomingItems.
    """
    if instance.supplier_invoice:
        try:
            with transaction.atomic():
                supplier_invoice = instance.supplier_invoice

                # Calculate total amount from all related IncomingItems
                total_amount = IncomingItem.objects.filter(
                    supplier_invoice=supplier_invoice
                ).aggregate(
                    total=Sum(models.F('purchase_price') * models.F('quantity'))
                )['total'] or 0.00
                
                # Update the supplier invoice amount
                supplier_invoice.amount = total_amount
                supplier_invoice.save()
        except Exception as e:
            print(f"Error updating supplier invoice amount: {e}")


@receiver([post_save, post_delete], sender=IncomingItem)
def update_supplier_invoice_amount(sender, instance, **kwargs):
    """
    Update the SupplierInvoice amount whenever an IncomingItem is created, updated, or deleted.
    The amount is calculated as the sum of (purchase_price * quantity) for all related IncomingItems.
    """
    if instance.supplier_invoice:
        try:
            with transaction.atomic():
                supplier_invoice = instance.supplier_invoice

                # Calculate total amount from all related IncomingItems
                total_amount = IncomingItem.objects.filter(
                    supplier_invoice=supplier_invoice
                ).aggregate(
                    total=Sum(models.F('purchase_price') * models.F('quantity'))
                )['total'] or 0.00
                
                # Update the supplier invoice amount
                supplier_invoice.amount = total_amount
                supplier_invoice.save()
        except Exception as e:
            print(f"Error updating supplier invoice amount: {e}")


@receiver([post_save], sender=IncomingItem)
def update_purchase_order_item_quantity_received(sender, instance, **kwargs):
    with transaction.atomic():
        purchase_order_item = PurchaseOrderItem.objects.filter(purchase_order=instance.purchase_order,
                        requisition_item__item=instance.item).first()

        if purchase_order_item:
            if instance.quantity:
                purchase_order_item.quantity_received = instance.quantity
                purchase_order_item.save()

                update_purchase_order_status(purchase_order_item.purchase_order)


@receiver(post_delete, sender=IncomingItem)
def update_purchase_order_item_quantity_received_on_delete(sender, instance, **kwargs):
    with transaction.atomic():
        purchase_order_item = PurchaseOrderItem.objects.filter(
            purchase_order=instance.purchase_order,
            requisition_item__item=instance.item  
        ).first()

        if purchase_order_item:
            purchase_order_item.quantity_received = instance.quantity
            purchase_order_item.save()

            update_purchase_order_status(purchase_order_item.purchase_order)

'''
Determine the status based on the aggregate state:
If all items are fully received, set the status to COMPLETED.
If none are received, set the status to PENDING.
Otherwise, set the status to PARTIAL.
'''
def update_purchase_order_status(purchase_order):
    items = purchase_order.po_items.all()
    
    all_completed = True
    none_received = True
    
    for item in items:
        if item.quantity_received < item.quantity_ordered:
            all_completed = False
        if item.quantity_received > 0:
            none_received = False
    
    if all_completed:
        purchase_order.status = PurchaseOrder.Status.COMPLETED
        print(f"All items received; status set to COMPLETED.")
    elif none_received:
        purchase_order.status = PurchaseOrder.Status.PENDING
        print(f"No items received; status set to PENDING.")
    else:
        purchase_order.status = PurchaseOrder.Status.PARTIAL
        print(f"Some items received; status set to PARTIAL.")
    
    purchase_order.save()
    print(f"Final status set to {purchase_order.status}")