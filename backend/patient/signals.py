from django.db.models.signals import post_save
from django.dispatch import receiver

# models
from .models import Patient, PatientProfile


@receiver(post_save, sender=Patient)
def create_patient_profile(sender: Patient, instance: Patient, created: bool, **kwargs):
    if created:
        try:
            PatientProfile.objects.create(patient=instance)
            return
        except Exception as e:
            return
        
        