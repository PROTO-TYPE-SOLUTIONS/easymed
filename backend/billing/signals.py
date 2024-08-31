from django.db.models.signals import post_save
from django.dispatch import receiver

from patient.models import AttendanceProcess
from inventory.models import Inventory
from laboratory.models import LabTestRequest, LabTestRequestPanel
from .models import Invoice, InvoiceItem
from company.models import Company
from easymed.celery_tasks import (
    generate_invoice_pdf,
    send_invoice_created_email,
    send_invoice_updated_email
)


print("update_labtest_billed_on_invoice_item_save signal fired")



# @receiver(post_save, sender=InvoiceItem)
# def update_labtestrequestpanel_billed_status(sender, instance, **kwargs):
#     '''
#     If an InvoiceItem is of category LabTest, and the InvoiceItem status changes to
#     billed, updated the LabTestRequestPanel's is_billed field to True
#     '''
#     # Check if the status is 'billed' and the item is in the 'LabTest' category
#     if instance.status == 'billed' and instance.item.category == 'Lab Test':
#         # Find the related AttendanceProcess through the invoice
#         attendance_process = AttendanceProcess.objects.filter(invoice=instance.invoice).first()

#         if attendance_process and attendance_process.process_test_req:
#             # Find all LabTestRequest instances associated with this ProcessTestRequest
#             lab_test_requests = LabTestRequest.objects.filter(
#                 process=attendance_process.process_test_req
#             )

#             # Update the is_billed field to True in all related LabTestRequestPanels
#             LabTestRequestPanel.objects.filter(
#                 lab_test_request__in=lab_test_requests
#             ).update(is_billed=True)



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