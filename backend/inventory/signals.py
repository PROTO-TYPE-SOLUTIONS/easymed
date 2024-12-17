from django.dispatch import receiver
from django.db import transaction
from django.db.models.signals import post_save, post_delete
from django.db.models import Sum
from django.db import models

from .models import (
    Requisition,
    PurchaseOrder,
    IncomingItem,
    Inventory,
 
)
from easymed.celery_tasks import (
    generate_requisition_pdf,
    generate_purchase_order_pdf,
    create_purchase_order,

)

# There's a painful Race Condition when this is moved to celery
@receiver(post_save, sender=IncomingItem)
def update_inventory_after_incomingitem_creation(sender, instance, created, **kwargs):
    if created:
        try:
            with transaction.atomic():
                inventory, created = Inventory.objects.get_or_create(
                    item=instance.item
                )
                if created:
                    inventory.quantity_at_hand = instance.quantity
                else:
                    inventory.purchase_price = instance.purchase_price
                    inventory.sale_price = instance.sale_price
                    inventory.quantity_at_hand += instance.quantity
                inventory.save()
        except Exception as e:
            # Handle the exception appropriately (e.g., log the error)
            print(f"Error updating inventory for incoming item: {instance.id}, Error: {e}") 


#signal to fire up celery task to  to generated pdf once Requisition tale gets a new entry
@receiver(post_save, sender=Requisition)
def generate_requisition_note(sender, instance, created, **kwargs):
    if created:
        generate_requisition_pdf.delay(instance.pk)
        create_purchase_order.delay(instance.pk)

#signal to fire up celery task to  to generated pdf once PurchaseOrder table gets a new entry
@receiver(post_save, sender=PurchaseOrder)
def generate_purchaseorder_pdf(sender, instance, created, **kwargs):
    if created:
        generate_purchase_order_pdf.delay(instance.pk)

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

'''signal to fire up celery task to  to generated pdf once Requisition tale gets a new entry'''
@receiver(post_save, sender=Requisition)
def generate_requisition_note(sender, instance, created, **kwargs):
    if created:
        generate_requisition_pdf.delay(instance.pk)
        create_purchase_order.delay(instance.pk)

'''signal to fire up celery task to  to generated pdf once PurchaseOrder tale gets a new entry'''
@receiver(post_save, sender=PurchaseOrder)
def generate_purchaseorder_pdf(sender, instance, created, **kwargs):
    if created:
        generate_purchase_order_pdf.delay(instance.pk)