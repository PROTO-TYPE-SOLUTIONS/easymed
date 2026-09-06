"""
Signals kept here are catalogue housekeeping only.

Stock is deliberately NOT touched from a signal. Every movement is posted from
an explicit call to `inventory.services.stock`, because stock changes that ride
on another model's save are impossible to order, impossible to roll back
predictably, and were the source of the lost updates this module used to have.
"""

import logging

from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Item, RequisitionItem
from .utils import generate_unique_item_code

logger = logging.getLogger(__name__)


@receiver(post_save, sender=RequisitionItem)
@receiver(post_delete, sender=RequisitionItem)
def refresh_requisition_status(sender, instance, **kwargs):
    """
    Keep the parent requisition's status in step with its lines.

    Generating a purchase order flips `ordered` on the lines it covers, which
    is what moves a requisition to partially/fully ordered. This is status
    bookkeeping over facts already committed, not a stock movement, so the
    caveat at the top of this module does not apply.
    """
    requisition = instance.requisition
    if requisition is None:
        return
    transaction.on_commit(requisition.refresh_status)


@receiver(post_save, sender=Item)
def sync_lab_test_item(sender, instance, created, **kwargs):
    """
    When a LabReagent item is saved, automatically maintain a paired
    'Lab Test' billing item so users never need to create one manually.

    - On create: generate and link a new Lab Test item.
    - On update: keep name and desc in sync with the paired item.
    """
    # QuerySet.update() does not fire signals, so we use it here to avoid
    # re-entering this receiver and causing infinite recursion.
    if instance.category != 'LabReagent':
        return

    with transaction.atomic():
        if instance.lab_test_item_id is None:
            # Multiple LabReagent variants (different units_of_measure) can
            # share a name, but they must pair to the same billing item —
            # the paired item's (name, category, units_of_measure) is fixed,
            # so a blind create() collides on the unique constraint.
            lab_test, created = Item.objects.get_or_create(
                name=instance.name,
                category='Lab Test',
                units_of_measure='test',
                defaults={
                    'desc': instance.desc,
                    'item_code': generate_unique_item_code(),
                    'is_stock_tracked': False,
                },
            )
            Item.objects.filter(pk=instance.pk).update(lab_test_item=lab_test)
            logger.info(
                "%s Lab Test item '%s' (#%s) for LabReagent '%s' (#%s)",
                "Auto-created" if created else "Linked existing",
                lab_test.name, lab_test.id, instance.name, instance.pk,
            )
        else:
            Item.objects.filter(pk=instance.lab_test_item_id).update(
                name=instance.name,
                desc=instance.desc,
            )


@receiver(post_delete, sender=Item)
def delete_paired_lab_test_item(sender, instance, **kwargs):
    """
    When a LabReagent item is deleted, cascade-delete its paired Lab Test item.
    The Lab Test item's category is 'Lab Test' so this receiver won't re-fire.
    """
    if instance.category == 'LabReagent' and instance.lab_test_item_id:
        Item.objects.filter(pk=instance.lab_test_item_id).delete()
        logger.info(
            "Deleted paired Lab Test item #%s for deleted LabReagent '%s' (#%s)",
            instance.lab_test_item_id, instance.name, instance.pk,
        )
