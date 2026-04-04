import logging
from celery import shared_task
from django.contrib.auth import get_user_model
from django.db import models, transaction
from laboratory.models import TestKitCounter, LabTestRequestPanel, TestPanelReagent, ReagentConsumptionLog
from inventory.models import Inventory

User = get_user_model()

logger = logging.getLogger(__name__)


def _deduct_inventory_fefo(reagent_item, units_to_deduct):
    """
    Deduct base units from Inventory using FEFO (First Expiry, First Out).

    Iterates through inventory lots ordered by expiry_date (earliest first,
    nulls last) and deducts until the required amount is consumed.

    Returns the total units actually deducted (may be less than requested
    if stock is insufficient).
    """
    total_deducted = 0
    remaining = units_to_deduct

    inventories = Inventory.objects.filter(
        item=reagent_item,
        quantity_at_hand__gt=0,
    ).order_by(
        models.F('expiry_date').asc(nulls_last=True)
    )

    for inv in inventories:
        if remaining <= 0:
            break
        deduct = min(remaining, inv.quantity_at_hand)
        inv.quantity_at_hand -= deduct
        inv.save(update_fields=['quantity_at_hand'])
        remaining -= deduct
        total_deducted += deduct

    return total_deducted


@shared_task
def deduct_test_kit(lab_test_panel_id):
    """
    Deduct reagent stock when a lab test is billed.

    For each reagent linked to the test panel via TestPanelReagent:
    1. Deduct units_consumed_per_run from Inventory (FEFO)
    2. Keep TestKitCounter in sync
    3. Create a ReagentConsumptionLog entry for audit
    """
    try:
        lab_test_panel = LabTestRequestPanel.objects.select_related(
            'test_panel',
            'patient_sample__process__attendanceprocess__patient'
        ).get(id=lab_test_panel_id)

        if not lab_test_panel.is_billed:
            logger.warning(f"Lab test panel {lab_test_panel_id} is not billed yet")
            return

        # Get patient info for logging
        try:
            patient = lab_test_panel.patient_sample.process.attendanceprocess.patient
            patient_name = f"{patient.first_name} {patient.second_name}"
        except Exception:
            patient_name = "Unknown"

        # Get all reagents required for this test panel
        reagent_links = TestPanelReagent.objects.filter(test_panel=lab_test_panel.test_panel)

        if not reagent_links.exists():
            logger.info(f"No reagents configured for test panel: {lab_test_panel.test_panel.name}")
            return

        warnings = []

        with transaction.atomic():
            for reagent_link in reagent_links:
                units_to_deduct = reagent_link.units_consumed_per_run

                # --- 1. Deduct from Inventory (FEFO) ---
                actual_deducted = _deduct_inventory_fefo(
                    reagent_link.reagent_item, units_to_deduct
                )

                if actual_deducted < units_to_deduct:
                    warnings.append(
                        f"INSUFFICIENT STOCK: {reagent_link.reagent_item.name} — "
                        f"needed {units_to_deduct}, only {actual_deducted} available"
                    )
                    logger.error(
                        f"Reagent {reagent_link.reagent_item.name} has insufficient "
                        f"inventory ({actual_deducted}/{units_to_deduct}) but test was billed"
                    )

                # --- 2. Keep TestKitCounter in sync ---
                counter, created = TestKitCounter.objects.get_or_create(
                    reagent_item=reagent_link.reagent_item,
                    defaults={'available_tests': 0}
                )
                tests_before = counter.available_tests
                counter.available_tests = max(0, counter.available_tests - units_to_deduct)
                counter.save()

                if counter.is_low_stock() and not counter.is_out_of_stock():
                    warnings.append(
                        f"LOW STOCK: {reagent_link.reagent_item.name} — "
                        f"{counter.available_tests} tests remaining"
                    )

                # --- 3. Audit log ---
                ReagentConsumptionLog.objects.create(
                    reagent_item=reagent_link.reagent_item,
                    test_panel=lab_test_panel.test_panel,
                    lab_test_request_panel=lab_test_panel,
                    tests_consumed=units_to_deduct,
                    available_tests_before=tests_before,
                    available_tests_after=counter.available_tests,
                    patient_name=patient_name,
                    performed_by=(
                        lab_test_panel.lab_test_request.requested_by
                        if hasattr(lab_test_panel, 'lab_test_request')
                        else None
                    ),
                )

                logger.info(
                    f"Deducted {units_to_deduct} unit(s) from {reagent_link.reagent_item.name}. "
                    f"Inventory deducted: {actual_deducted}. Counter remaining: {counter.available_tests}"
                )

        if warnings:
            for warning in warnings:
                logger.warning(warning)

        logger.info(f"Successfully processed reagent deduction for lab test panel {lab_test_panel_id}")

    except LabTestRequestPanel.DoesNotExist:
        logger.error(f"LabTestRequestPanel with id {lab_test_panel_id} does not exist")
    except Exception as e:
        logger.error(f"Error deducting reagents for lab test panel {lab_test_panel_id}: {str(e)}")
        raise