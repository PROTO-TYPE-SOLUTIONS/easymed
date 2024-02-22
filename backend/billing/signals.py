from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Invoice
from company.models import Company
from makeeasyhmis.celery_tasks import generate_invoice_pdf



'''signal to fire up celery task to  to generated pdf once Invoice tale gets a new entry'''
@receiver(post_save, sender=Invoice)
def generate_invoice(sender, instance, created, **kwargs):
    if created:
        generate_invoice_pdf.delay(instance.pk,)
