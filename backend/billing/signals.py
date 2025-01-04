from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.apps import apps
from django.core.exceptions import ValidationError

from utils import check_quantity_availability, update_service_billed_status
from inventory.models import Inventory
from .models import Invoice, InvoiceItem
from easymed.celery_tasks import (
    generate_invoice_pdf,
    send_invoice_created_email,
    send_invoice_updated_email,
)


'''signal to fire up celery task to  to generated pdf once Invoice tale gets a new entry'''
@receiver(post_save, sender=Invoice)
def generate_invoice(sender, instance, created, **kwargs):
    if created:
        generate_invoice_pdf.delay(instance.pk,)


''''
Let's send an email whenever an invoice is created or status field changes
'''
@receiver(post_save, sender=Invoice)
def handle_invoice_created(sender, instance, created, **kwargs):
    if created:
        send_invoice_created_email.delay(instance.id)


def handle_invoice_status_change(sender, instance, created, **kwargs):
    if not created:
        if instance.status != instance.status:
            send_invoice_updated_email.delay(instance.id)
    instance._previous_status = instance.status



@receiver(post_save, sender=InvoiceItem)
def handle_invoice_item_created(sender, instance, created, **kwargs):
    ''''
    whenever an invoice item is created add the resulting price for the item to the invoice
    '''
    if created:  # Only proceed if the InvoiceItem instance was created
        if instance.invoice:
            invoice = instance.invoice
            # Fetch the related Inventory instance for the Item
            try:
                inventory = Inventory.objects.get(item=instance.item)
            except Inventory.DoesNotExist:
                # Handle the case where no Inventory instance is found for the Item
                return

            # Accessing the sale price through the fetched Inventory instance
            item_price = inventory.sale_price
            invoice.invoice_amount += item_price
            invoice.save()  # Save the updated invoice


@receiver(post_save, sender=InvoiceItem)
def update_related_models(sender, instance, **kwargs):
    '''
    When an InvoiceItem is saved, and the status field is changed to billed,
    we check if it's a Drug or a Lab Test. If it is, we update the is_billed
    field of the related PrescribedDrug or LabTestRequestPanel
    '''
    # TODO: Also update Consulation
    # Check if the item is a Drug or Lab Test to update billed status accordingly
    if instance.item.category in ['Drug', 'Lab Test']:
        update_service_billed_status(instance)     


@receiver(pre_save, sender=InvoiceItem)
def check_quantity_before_billing(sender, instance, **kwargs):
    '''
    Before an InvoiceItem is saved, check if the status field is being updated to "billed".
    Ensure that the available quantity is sufficient before proceeding.
    '''
    # Check if it's an update, not a new creation
    if instance.pk:
        try:
            previous_instance = InvoiceItem.objects.get(pk=instance.pk)
        except InvoiceItem.DoesNotExist:
            previous_instance = None
        
        # Check if the status is being updated to 'billed'
        if previous_instance and previous_instance.status != instance.status and instance.status == 'billed':
            # Check if the item is a Drug or Lab Test
            if instance.item.category in ['Drug', 'Lab Test']:
                # ? if not == false
                if not check_quantity_availability(instance):
                    raise ValidationError(f"Insufficient quantity available for {instance.item.name}.")
            # Allow the save to proceed if quantity is sufficient
    else:
        # Handle new creation logic if needed
        pass



