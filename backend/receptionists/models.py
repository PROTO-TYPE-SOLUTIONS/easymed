from django.db import models
from django.db.models.query import QuerySet

from customuser.models import (
    CustomUser,
    BaseUserManager,
)

class ReceptionistManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs) -> QuerySet:
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.RECEPTIONIST)

class Receptionist(CustomUser):
    class Meta:
        proxy = True

    objects = ReceptionistManager()
    BASE_ROLE = CustomUser.RECEPTIONIST


class ReceptionistProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    
    