
import os
from celery import shared_task
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from weasyprint import HTML
from django.apps import apps
from django.conf import settings
from decouple import config

from inventory.models import IncomingItem, Inventory, PurchaseOrder, Requisition
from billing.models import Invoice, InvoiceItem
from patient.models import Appointment

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer



from celery import chain



"""Creates a new Inventory record or updates an existing one based on the IncomingItem."""
@shared_task
def create_or_update_inventory_record(incoming_item_id):
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

        
'''Task to generated pdf once Invoice tale gets a new entry'''
@shared_task
def generate_invoice_pdf(invoice_id):
    from billing.models import Invoice
    invoice = Invoice.objects.get(pk=invoice_id)
    app_template_dir = apps.get_app_config('billing').path + '/templates/'
    html_content = render_to_string(app_template_dir + 'invoice.html', {'invoice': invoice})
    pdf_file_path = os.path.join('./easymed/static/invoices/', f'{invoice.invoice_number}.pdf')

    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)
    HTML(string=html_content).write_pdf(pdf_file_path)

    invoice.save()


'''Task to generated Requisition'''   
@shared_task
def generate_requisition_pdf(requisition_id):
    requisition = Requisition.objects.get(pk=requisition_id)
    app_template_dir  = apps.get_app_config('inventory').path + '/templates/'
    html_content = render_to_string(app_template_dir + 'requisition.html', {'requisition': requisition})
    pdf_file_path = os.path.join('./easymed/static/requisitions/', f'{requisition.id}.pdf')

    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)
    HTML(string=html_content).write_pdf(pdf_file_path)

    requisition.save


'''Task to generated Lab Results Report'''   
@shared_task
def generate_labtestresult_pdf(labtestresult_id):
    from laboratory.models import LabTestResult
    labtestresult = LabTestResult.objects.get(pk=labtestresult_id)
    app_template_dir  = apps.get_app_config('laboratory').path + '/templates/'
    html_content = render_to_string(app_template_dir + 'labtestresult.html', {'labtestresult': labtestresult})
    pdf_file_path = os.path.join('./easymed/static/labtestresult/', f'{labtestresult.id}.pdf')

    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)
    HTML(string=html_content).write_pdf(pdf_file_path)

    labtestresult.save()


'''Task to generated Lab Results Report'''   
@shared_task
def generate_prescription_pdf(prescription_id):
    from patient.models import Prescription
    prescription = Prescription.objects.get(pk=prescription_id)
    app_template_dir  = apps.get_app_config('patient').path + '/templates/'
    html_content = render_to_string(app_template_dir + 'prescription.html', {'prescription': prescription})
    pdf_file_path = os.path.join('./easymed/static/prescription/', f'{prescription.id}.pdf')
    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)
    HTML(string=html_content).write_pdf(pdf_file_path)

    prescription.save()


'''Task to generated Purchase Order Report'''   
@shared_task
def generate_purchaseorder_pdf(purchaseorder_id):
    from inventory.models import PurchaseOrder
    purchaseorder = PurchaseOrder.objects.get(pk=purchaseorder_id)
    app_template_dir  = apps.get_app_config('inventory').path + '/templates/'
    html_content = render_to_string(app_template_dir + 'purchaseorder.html', {'purchaseorder': purchaseorder})
    pdf_file_path = os.path.join('./easymed/static/purchaseorder/', f'{purchaseorder.id}.pdf')
    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)
    HTML(string=html_content).write_pdf(pdf_file_path)

    purchaseorder.save()

    

'''task to send the appointment assigned notification'''
@shared_task
def appointment_assign_notification(appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    message = f"You have been assigned appointment {appointment.appointment_date_time}."
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "doctor_notifications",
        {
            'type': 'send_notification',
            'message':message
        }
    )


'''Send email notifications on Appointment updated'''
from django.core.mail import send_mail
@shared_task
def send_appointment_status_email(appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    subject = f'Appointment #{appointment.id} Status Changed'
    message = f'Your appointment status has been changed to {appointment.status}.'
    from_email = config('EMAIL_HOST_USER')
    to_email = appointment.patient.email
    send_mail(subject, message, from_email, [to_email])


'''Send email notifications on Appointment created'''
@shared_task
def send_appointment_status_email(appointment_id):
    appointment = Appointment.objects.get(id=appointment_id)
    subject = f'Appointment #{appointment.id} created'
    message = f'Appointment has been created for #{appointment.appointment_date_time}. Reason #{appointment.reason}'
    from_email = config('EMAIL_HOST_USER')
    to_email = appointment.patient.email
    send_mail(subject, message, from_email, [to_email])    



''''
This task sends Invoice creation or status update emails with a generated PDF attachment
'''  
from company.models import Company
from django.template.loader import get_template
import tempfile
from django.core.mail import EmailMultiAlternatives
from logging import Logger




@shared_task
def send_invoice_created_email(invoice_id):
    invoice = Invoice.objects.get(id=invoice_id)
    subject = f'Invoice #{invoice} {invoice.status}'
    message = f'''
    Invoice #{invoice.invoice_number} created at {invoice.invoice_date} 
    Status: {invoice.status}
    Total amount: {invoice.invoice_amount}
    Description: {invoice.invoice_description}
    Invoice Items:
    '''
    for item in invoice.invoice_items.all():
        message += f'''
        - {item.item.name} - {item.item.inventory.sale_price}
        '''
    from_email = config('EMAIL_HOST_USER')
    to_email = invoice.patient.email
    send_mail(subject, message, from_email, [to_email])   




@shared_task
def send_invoice_updated_email(invoice_id):
    invoice = Invoice.objects.get(id=invoice_id)
    subject = f'Invoice #{invoice} {invoice.status}'
    message = f'Your invoice #{invoice.invoice_number} has been updated to {invoice.status}.'
    from_email = config('EMAIL_HOST_USER')
    to_email = invoice.patient.email
    send_mail(subject, message, from_email, [to_email])    