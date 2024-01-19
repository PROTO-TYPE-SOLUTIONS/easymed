from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import IncomingItem, Inventory
from makeeasyhmis.celery_tasks import create_or_update_inventory_record


@receiver(post_save, sender=IncomingItem)
def create_inventory_after_incoming_item_save(sender, instance, created, **kwargs):
    if created:
        create_or_update_inventory_record.delay(instance.id)