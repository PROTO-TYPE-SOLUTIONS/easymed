import logging

from celery import shared_task
from django.contrib.auth import get_user_model
from django.db import transaction

from inventory.models import StockMovement
from inventory.services import stock as stock_service
from inventory.services.stock import StockError
from laboratory.models import (
    LabTestRequestPanel,
    PatientSample,
    ReagentConsumptionLog,
    TestPanelReagent,
)
from laboratory.utils import lab_department, reagent_threshold

User = get_user_model()

logger = logging.getLogger(__name__)


@shared_task
def deduct_test_kit(lab_test_panel_id):
    """
    Consume reagent stock when a lab test is billed.

    For each reagent linked to the test panel via TestPanelReagent, post a
    CONSUMPTION movement (FEFO across lots) and write an audit log entry.

    Idempotent per (panel, reagent): the panel's post_save fires on every save
    of a billed panel, and without this the same test would consume reagents
    again each time somebody touched the row.
    """
    try:
        lab_test_panel = LabTestRequestPanel.objects.select_related(
            'test_panel',
            'patient_sample__process__attendanceprocess__patient',
        ).get(id=lab_test_panel_id)

        if not lab_test_panel.is_billed:
            logger.warning("Lab test panel %s is not billed yet", lab_test_panel_id)
            return

        try:
            patient = lab_test_panel.patient_sample.process.attendanceprocess.patient
            patient_name = f"{patient.first_name} {patient.second_name}"
        except Exception:
            patient_name = "Unknown"

        reagent_links = TestPanelReagent.objects.filter(
            test_panel=lab_test_panel.test_panel).select_related('reagent_item')

        if not reagent_links.exists():
            logger.info("No reagents configured for test panel: %s", lab_test_panel.test_panel.name)
            return

        department = lab_department()
        warnings = []

        with transaction.atomic():
            for link in reagent_links:
                reagent = link.reagent_item
                units = link.units_consumed_per_run
                idempotency_key = f"lab-panel:{lab_test_panel.id}:reagent:{reagent.id}"

                if StockMovement.objects.filter(
                    idempotency_key__startswith=f"{idempotency_key}:"
                ).exists():
                    logger.info(
                        "Reagent %s already consumed for panel %s; skipping",
                        reagent.name, lab_test_panel.id)
                    continue

                stock_before = stock_service.on_hand_quantity(reagent, department)

                try:
                    movements = stock_service.issue(
                        item=reagent,
                        department=department,
                        quantity=units,
                        movement_type=StockMovement.Type.CONSUMPTION,
                        performed_by=getattr(lab_test_panel, 'lab_test_request', None)
                        and lab_test_panel.lab_test_request.requested_by,
                        reason=f"Ran {lab_test_panel.test_panel.name}",
                        source_type=StockMovement.Source.LAB_TEST,
                        source_id=lab_test_panel.id,
                        allow_partial=True,
                        idempotency_key=idempotency_key,
                    )
                except StockError as exc:
                    logger.error("Could not consume %s for panel %s: %s",
                                 reagent.name, lab_test_panel.id, exc)
                    warnings.append(str(exc))
                    continue

                deducted = sum(-m.quantity for m in movements)
                stock_after = stock_service.on_hand_quantity(reagent, department)

                if deducted < units:
                    warnings.append(
                        f"INSUFFICIENT STOCK: {reagent.name} - "
                        f"needed {units}, only {deducted} available"
                    )
                    logger.error(
                        "Reagent %s had insufficient stock (%s/%s) but the test was billed",
                        reagent.name, deducted, units)

                threshold = reagent_threshold(reagent, department)
                if 0 < stock_after <= threshold:
                    warnings.append(f"LOW STOCK: {reagent.name} - {stock_after} units remaining")

                ReagentConsumptionLog.objects.create(
                    reagent_item=reagent,
                    test_panel=lab_test_panel.test_panel,
                    lab_test_request_panel=lab_test_panel,
                    tests_consumed=units,
                    available_tests_before=stock_before,
                    available_tests_after=stock_after,
                    stock_movement_reference=movements[0].reference if movements else None,
                    patient_name=patient_name,
                    performed_by=(
                        lab_test_panel.lab_test_request.requested_by
                        if hasattr(lab_test_panel, 'lab_test_request') else None
                    ),
                )

                logger.info(
                    "Consumed %s unit(s) of %s for panel %s. Remaining: %s",
                    deducted, reagent.name, lab_test_panel.id, stock_after)

        for warning in warnings:
            logger.warning(warning)

        logger.info("Processed reagent consumption for lab test panel %s", lab_test_panel_id)

    except LabTestRequestPanel.DoesNotExist:
        logger.error("Lab test panel %s does not exist", lab_test_panel_id)


@shared_task
def deduct_specimen_consumables(patient_sample_id):
    """
    Kept as a no-op so an in-flight queued job does not fail on deploy.

    Accompaniments used to be deducted here, per specimen. They are now
    declared on the item (inventory.ItemConsumable) and leave stock once, when
    the test is billed, through billing.services.post_stock_for_invoice_item.
    Deducting again on collection would take a second syringe for the same
    draw. The collection screen still SHOWS what is needed -- see
    laboratory.serializers.sample_consumable_rows.
    """
    logger.debug(
        "deduct_specimen_consumables(%s) is a no-op; accompaniments are consumed at billing",
        patient_sample_id)
    return 0
