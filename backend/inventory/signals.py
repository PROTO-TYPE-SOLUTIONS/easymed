from django.dispatch import receiver
from django.db.models.signals import post_save
# from easymed.celery_tasks import create_or_update_inventory_record
from .models import Requisition, PurchaseOrder, IncomingItem, Inventory
from easymed.celery_tasks import (
    generate_requisition_pdf,
    generate_purchase_order_pdf,
    create_or_update_inventory_record,
    create_purchase_order_task
)


@receiver(post_save, sender=IncomingItem)
def create_inventory_after_incoming_item_save(sender, instance, created, **kwargs):
    if created:
        create_or_update_inventory_record.delay(instance.id)



'''signal to fire up celery task to  to generated pdf once Requisition tale gets a new entry'''
@receiver(post_save, sender=Requisition)
def generate_invoice(sender, instance, created, **kwargs):
    if created:
        generate_requisition_pdf.delay(instance.pk)


'''signal to fire up celery task to  to generated pdf once PurchaseOrder tale gets a new entry'''
@receiver(post_save, sender=PurchaseOrder)
def generate_purchaseorder(sender, instance, created, **kwargs):
    if created:
        generate_purchase_order_pdf.delay(instance.pk)



@receiver(post_save, sender=Requisition)
def create_purchase_order(sender, instance, created, **kwargs):
    if created:
        # Trigger the Celery task to create a purchase order
        create_purchase_order_task.delay(instance.id)
