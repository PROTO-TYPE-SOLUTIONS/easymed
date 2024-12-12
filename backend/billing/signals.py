from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.apps import apps
from django.core.exceptions import ValidationError

from patient.models import AttendanceProcess, PrescribedDrug
from inventory.models import Inventory
from laboratory.models import LabTestRequest, LabTestRequestPanel
from .models import Invoice, InvoiceItem
from company.models import Company
from easymed.celery_tasks import (
    generate_invoice_pdf,
    send_invoice_created_email,
    send_invoice_updated_email
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


''''
whenever an invoice item is created add the resulting price for the item to the invoice
'''
@receiver(post_save, sender=InvoiceItem)
def handle_invoice_item_created(sender, instance, created, **kwargs):
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
    # Check if the item is a Drug or Lab Test to update billed status accordingly
    if instance.item.category in ['Drug', 'Lab Test']:
        update_service_billed_status(instance)

def update_service_billed_status(instance):
    if instance.status == 'billed' and instance.item.category == 'Drug':
        try:
            # Get the related Prescription through the invoice's attendance process
            prescription = instance.invoice.attendanceprocess.prescription
            prescribed_drug = PrescribedDrug.objects.filter(
                prescription=prescription,  # Use the retrieved prescription object
                item=instance.item
            ).first()

            if prescribed_drug:
                prescribed_drug.is_billed = True
                prescribed_drug.save()
        except AttendanceProcess.DoesNotExist:
            # Handle the case where the InvoiceItem is not associated with an AttendanceProcess
            pass
            
    if instance.status== 'billed' and instance.item.category == 'Lab Test':
        try:
            process_test_request = instance.invoice.attendanceprocess.process_test_req
            lab_test_panel = LabTestRequestPanel.objects.filter(
                test_panel__item=instance.item,
                lab_test_request__process=process_test_request
            ).first()

            if lab_test_panel:
                lab_test_panel.is_billed = True
                lab_test_panel.save()
        except LabTestRequest.DoesNotExist:
            # Handle the case where the InvoiceItem is not associated with an LabTestRequest
            pass        


@receiver(pre_save, sender=InvoiceItem)
def check_quantity_before_billing(sender, instance, **kwargs):
    '''
    Before an InvoiceItem is saved, check if the status field is being updated to "billed".
    Ensure that the available quantity is sufficient before proceeding.
    '''
    # Check if it's an update, not a new creation
    if instance.pk:
        try:
            # Get the previous state of the object
            previous_instance = InvoiceItem.objects.get(pk=instance.pk)
        except InvoiceItem.DoesNotExist:
            previous_instance = None
        
        # Check if the status is being updated to 'billed'
        if previous_instance and previous_instance.status != instance.status and instance.status == 'billed':
            # Check if the item is a Drug or Lab Test
            if instance.item.category in ['Drug', 'Lab Test']:
                if not check_quantity_availability(instance):
                    raise ValidationError(f"Insufficient quantity available for {instance.item.name}.")
            # Allow the save to proceed if quantity is sufficient
    else:
        # Handle new creation logic if needed
        pass

def get_available_stock(instance):
    '''
    Function to get the available inventory stock for passed instance 
    '''
    inventory_item = Inventory.objects.get(item=instance.item)
    return inventory_item.quantity_at_hand

def check_quantity_availability(instance):
    '''
    Function to check if there is enough quantity available for the item before billing.
    Returns True if sufficient quantity is available, otherwise False.
    '''
    if instance.item.category == 'Drug':
        # For drugs, check the available stock
        stock_quantity = get_available_stock(instance)
        #check the prescribed drug quantity
        prescription = instance.invoice.attendanceprocess.prescription
        prescribed_drug = PrescribedDrug.objects.get(
                prescription=prescription,  # Use the retrieved prescription object
                item=instance.item
            )
        if prescribed_drug.quantity > stock_quantity:
            return False  # Insufficient stock
        else:
            update_stock_quantity_if_stock_is_available(instance, prescribed_drug.quantity)
            return True
    
    if instance.item.category == 'Lab Test':
        # Check Quantity available for instance drug
        stock_quantity = get_available_stock(instance)
        if stock_quantity < 1:
            return False
        else:
            update_stock_quantity_if_stock_is_available(instance, 1)
            return True

    return True

def update_stock_quantity_if_stock_is_available(instance, deductions):
    '''
    Funtions that deducts stock quantity from billed quantity and updates balances
    '''
    if instance.item.category == 'Drug':
        inventory_item = Inventory.objects.get(item=instance.item)
        remainder_quantity = inventory_item.quantity_in_stock - deductions
       # Ensure remainder quantity is not negative
        if remainder_quantity < 0:
            raise ValidationError(f"Not enough stock available for {instance.item.name}.")

        inventory_item.quantity_in_stock = remainder_quantity
        inventory_item.save()  # Save the changes to the inventory

    if instance.item.category == 'Lab Test':
        inventory_item = Inventory.objects.get(item=instance.item)
        remainder_quantity = inventory_item.quantity_at_hand - deductions
       # Ensure remainder quantity is not negative
        if remainder_quantity < 0:
            raise ValidationError(f"Not enough stock available for {instance.item.name}.")

         # Update and save the inventory item's stock quantity
        inventory_item.quantity_in_stock = remainder_quantity
        inventory_item.save()  # Save the changes to the inventory


