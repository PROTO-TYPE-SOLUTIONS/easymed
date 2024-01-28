from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Prescription

from makeeasyhmis.celery_tasks import generate_prescription_pdf

# emails
from django.core.mail import send_mail
from django.conf import settings

# models
from .models import Patient, Appointment

@receiver(post_save, sender=Patient)
def create_appointment(sender: Patient, instance: Patient, created: bool, **kwargs):
    if not created:
        return
    try:
        Appointment.objects.create(patient=instance)
    except Exception as e:
        print(e)



'''signal to fire up celery task to  to generated pdf once Prescription tale gets a new entry'''
@receiver(post_save, sender=Prescription)
def generate_precription(sender, instance, created, **kwargs):
    if created:
        generate_prescription_pdf.delay(instance.pk)

