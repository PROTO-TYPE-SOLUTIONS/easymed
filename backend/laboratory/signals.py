import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from laboratory.tasks import deduct_specimen_consumables, deduct_test_kit

from .models import (
    DisposedSample,
    LabTestRequestPanel,
    PatientSample,
    PatientSampleArchive,
    RetestSample,
)

logger = logging.getLogger(__name__)


def _dispatch(task, *args):
    """
    Run the stock task through Celery, falling back to running it inline when
    the broker is unavailable so stock is never silently left unposted.
    """
    try:
        task.delay(*args)
    except Exception as exc:
        logger.warning("Celery unavailable (%s); running %s inline", exc, task.name)
        task(*args)


@receiver(post_save, sender=LabTestRequestPanel)
def trigger_test_kit_deduction(sender, instance, **kwargs):
    """
    Consume reagents for a billed panel.

    This fires on every save of a billed panel; deduct_test_kit is idempotent
    per (panel, reagent) so only the first one actually consumes stock.
    """
    if instance.is_billed:
        _dispatch(deduct_test_kit, instance.id)


@receiver(post_save, sender=PatientSample)
def trigger_specimen_consumable_deduction(sender, instance, **kwargs):
    """Consume tubes/swabs/slides once a sample has actually been collected."""
    if instance.is_sample_collected:
        _dispatch(deduct_specimen_consumables, instance.id)


@receiver(post_save, sender=PatientSampleArchive)
def handle_archive_action(sender, instance, **kwargs):
    """When action is 'dispose' or 'retest', log the event and free the archive position."""
    if instance.action == 'dispose':
        DisposedSample.objects.create(
            patient_sample_code=instance.patient_sample.patient_sample_code,
            position_name=instance.position.name,
            archiving_date=instance.archiving_date,
            disposed_by=instance.created_by,
        )
        PatientSampleArchive.objects.filter(pk=instance.pk).delete()

    elif instance.action == 'retest':
        RetestSample.objects.create(
            patient_sample_code=instance.patient_sample.patient_sample_code,
            position_name=instance.position.name,
            archiving_date=instance.archiving_date,
            retested_by=instance.created_by,
        )
        PatientSampleArchive.objects.filter(pk=instance.pk).delete()