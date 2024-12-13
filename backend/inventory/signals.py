from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import (
    Requisition,
    PurchaseOrder,
    IncomingItem,
    PurchaseOrderItem,
    SupplierInvoice,
    GoodsReceiptNote

    )
from easymed.celery_tasks import (
    generate_requisition_pdf,
    generate_purchase_order_pdf,
    create_or_update_inventory_record,
    create_purchase_order_task,
    create_purchase_order,

)


@receiver(post_save, sender=IncomingItem)
def update_inventory_after_incomingitem_creation(sender, instance, created, **kwargs):
    create_or_update_inventory_record.delay(instance.id)

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