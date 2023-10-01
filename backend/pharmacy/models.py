from django.db import models
from django.db import models
# from patient.models import patient

from django.db import models
from django.conf import settings
from django.utils import timezone

from inventory.models import Item


class Drug(models.Model):
    name = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        editable=False
    )
    max_daily_dose = models.DecimalField(max_digits=10, decimal_places=2)
    min_daily_dose = models.DecimalField(max_digits=10, decimal_places=2)
    strength = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    quantity_in_stock = models.PositiveIntegerField()
    expiration_date = models.DateField()

    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not self.created_by_id:
            self.created_by = settings.DEFAULT_USER_ID  # Set to a default user if needed
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
