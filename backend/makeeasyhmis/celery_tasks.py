from celery import shared_task
from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import IncomingItem, Inventory
from billing.models import Invoice, InvoiceItem

from celery import shared_task
from inventory.models import IncomingItem, Inventory

@shared_task
def create_or_update_inventory_record(incoming_item_id):
    """
    Creates a new Inventory record or updates an existing one based on the IncomingItem.
    """
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
import os
from celery import shared_task
from django.template.loader import render_to_string
from weasyprint import HTML
from django.apps import apps
from django.conf import settings

@shared_task
def generate_invoice_pdf(invoice_id):
    from billing.models import Invoice

    # Retrieve the Invoice object
    invoice = Invoice.objects.get(pk=invoice_id)

    # Get the app's template directory
    app_template_dir = apps.get_app_config('billing').path + '/templates/'

    # Create HTML content for the invoice using a template
    html_content = render_to_string(app_template_dir + 'invoice.html', {'invoice': invoice})

    # Generate PDF from HTML content

    # Update the path to save the PDF file using the FileField upload_to logic
    # pdf_file_path = os.path.join(settings.MEDIA_ROOT, invoice.invoice_file.name)
    pdf_file_path = os.path.join('./makeeasyhmis/static/invoices/', f'{invoice.invoice_number}.pdf')


    # Create the target directory if it doesn't exist
    os.makedirs(os.path.dirname(pdf_file_path), exist_ok=True)

    # Write PDF content to the file
    HTML(string=html_content).write_pdf(pdf_file_path)

    # Update the invoice record with the generated PDF file path
    invoice.save()