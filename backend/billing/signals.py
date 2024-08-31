from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps

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
