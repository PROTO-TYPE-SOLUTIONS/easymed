from django.db.models.signals import post_save
from django.dispatch import receiver

# models
from .models import Patient, PatientProfile
from customuser.models import CustomUser


@receiver(post_save, sender=Patient)
def create_patient_profile(sender: Patient, instance: Patient, created: bool, **kwargs):
    if created:
        try:
            if instance.user_id:
                user = CustomUser.objects.get(pk=instance.user_id.pk)
                PatientProfile.objects.create(user=user)
            return
        except Exception as e:
            print(e)
            return
        
        