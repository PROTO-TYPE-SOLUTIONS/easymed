from django.db.models.signals import post_save, pre_save, post_delete
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.db.models import Sum

from .utils import check_quantity_availability, update_service_billed_status
from inventory.models import InsuranceItemSalePrice
from .models import InvoiceItem, InvoicePayment


@receiver(post_save, sender=InvoiceItem)
def update_invoice_on_item_save(sender, instance, created, **kwargs):
    """
    Update the total_cash and invoice_amount fields in the Invoice model
    when an InvoiceItem is created or updated.
    """
    if instance.invoice:
        invoice = instance.invoice

        # Recalculate total invoice amount
        invoice.invoice_amount = invoice.invoice_items.aggregate(
            total_amount=Sum('actual_total')
        )['total_amount'] or 0

        # Recalculate total_cash (sum of items with payment mode "Cash")
        invoice.total_cash = invoice.invoice_items.filter(
            payment_mode__payment_category='cash'
        ).aggregate(
            total_cash=Sum('actual_total')
        )['total_cash'] or 0

        invoice.save()


@receiver(post_delete, sender=InvoiceItem)
def update_invoice_on_item_delete(sender, instance, **kwargs):
    """
    Update the total_cash and invoice_amount fields in the Invoice model
    when an InvoiceItem is deleted.
    """
    if instance.invoice:
        invoice = instance.invoice

        # Recalculate totals after deletion
        invoice.invoice_amount = invoice.invoice_items.aggregate(
            total_amount=Sum('actual_total')
        )['total_amount'] or 0

        invoice.total_cash = invoice.invoice_items.filter(
            payment_mode__payment_category='cash'
        ).aggregate(
            total_cash=Sum('actual_total')
        )['total_cash'] or 0

        invoice.save()



@receiver(post_save, sender=InvoiceItem)
def update_is_billed_status(sender, instance, **kwargs):
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
        print("check_quantity_before_billing Signal fired")
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


def calculate_actual_total(invoice_item):
    try:
        # Retrieve the insurance company from the payment mode
        insurance_company = invoice_item.payment_mode.insurance if invoice_item.payment_mode else None
        
        if insurance_company:
            insurance_sale_price = InsuranceItemSalePrice.objects.get(
                item=invoice_item.item,
                insurance_company=insurance_company
            )
            co_pay = insurance_sale_price.co_pay
        else:
            co_pay = 0
    except InsuranceItemSalePrice.DoesNotExist:
        co_pay = 0

    invoice_item.actual_total = invoice_item.item_amount - co_pay


@receiver(pre_save, sender=InvoiceItem)
def update_invoice_item_actual_total(sender, instance, **kwargs):
    calculate_actual_total(instance)


# update Invoice.cash_paid when InvoicePayment is saved
@receiver(post_save, sender=InvoicePayment)
def update_invoice_cash_paid(sender, instance, created, **kwargs):
    if created:
        instance.invoice.cash_paid += instance.payment_amount
        instance.invoice.save()

