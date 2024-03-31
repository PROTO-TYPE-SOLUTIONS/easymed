from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Invoice
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