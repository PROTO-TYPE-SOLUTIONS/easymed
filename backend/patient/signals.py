from django.db.models.signals import post_save
from django.dispatch import receiver

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

        