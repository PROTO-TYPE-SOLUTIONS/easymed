from django.db.models.signals import post_save
from django.dispatch import receiver
# models
from .models import (
    CustomUser,
)
from receptions.models import ReceptionistProfile


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender: CustomUser, instance: CustomUser, created: bool, **kwargs):
    if not created:
        return
    if instance.role == CustomUser.RECEPTIONIST:
        try:
            ReceptionistProfile.objects.create(user=instance)
            return
        except Exception as e:
            return
    

    