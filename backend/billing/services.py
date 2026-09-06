"""
Where billing meets stock.

Billing an item for a patient is a stock issue. It is posted here, explicitly,
through `inventory.services.stock` -- not from a pre_save handler that mutated
inventory before the invoice line was even committed.
"""

import logging

from django.db import transaction

from inventory.models import Department, StockMovement
from inventory.services import stock as stock_service
from inventory.services.stock import InsufficientStock, StockError

logger = logging.getLogger(__name__)

# Which stock location an item is dispensed from when the invoice line does not
# name one. `source_tag` on the invoice item always wins.
CATEGORY_DEPARTMENTS = {
    'Drug': 'Pharmacy',
    'LabReagent': 'Lab',
    'LabConsumable': 'Lab',
}


def dispensing_department(invoice_item):
    """Resolve the location an invoice line is dispensed from."""
    if invoice_item.source_tag_id:
        return invoice_item.source_tag

    preferred = CATEGORY_DEPARTMENTS.get(invoice_item.item.category)
    if preferred:
        department = Department.objects.filter(
            name__iexact=preferred, is_stock_location=True).first()
        if department:
            return department

    return stock_service.default_department()


def check_stock_available(invoice_item):
    """
    Pure check, no side effects. Returns (ok, message).

    The old `check_quantity_availability` deducted stock as a side effect of
    answering this question, which is why an oversell could leave the ledger
    and the invoice disagreeing.
    """
    item = invoice_item.item
    if not item.is_stock_tracked:
        return True, ''

    quantity = invoice_item.quantity or 1
    department = dispensing_department(invoice_item)
    available = stock_service.available_quantity(item, department)

    if available < quantity:
        return False, (
            f"Insufficient stock for {item.name} at {department.name}: "
            f"need {quantity}, {available} available."
        )
    return True, ''


@transaction.atomic
def post_stock_for_invoice_item(invoice_item, performed_by=None):
    """
    Issue the stock an invoice line consumes.

    Idempotent on the invoice item id, so a re-save, a retried request or a
    duplicated signal cannot dispense the same drug twice.
    """
    item = invoice_item.item
    if not item.is_stock_tracked:
        return []

    quantity = invoice_item.quantity or 1
    department = dispensing_department(invoice_item)

    return stock_service.issue(
        item=item,
        department=department,
        quantity=quantity,
        movement_type=StockMovement.Type.SALE,
        performed_by=performed_by,
        reason=f"Billed on invoice {invoice_item.invoice_id}",
        source_type=StockMovement.Source.INVOICE_ITEM,
        source_id=invoice_item.pk,
        source_reference=str(getattr(invoice_item.invoice, 'invoice_number', '') or invoice_item.invoice_id),
        idempotency_key=f"invoice-item:{invoice_item.pk}",
    )


@transaction.atomic
def reverse_stock_for_invoice_item(invoice_item, reason, performed_by=None):
    """
    Put back what an invoice line took out, as contra entries. Used when a
    billed line is cancelled or returned.
    """
    movements = StockMovement.objects.filter(
        source_type=StockMovement.Source.INVOICE_ITEM,
        source_id=invoice_item.pk,
        reversals__isnull=True,
    ).exclude(movement_type=StockMovement.Type.REVERSAL)

    reversals = []
    for movement in movements:
        try:
            reversals.append(stock_service.reverse(movement, reason=reason, performed_by=performed_by))
        except StockError as exc:
            logger.error("Could not reverse movement %s: %s", movement.pk, exc)
    return reversals


__all__ = [
    'InsufficientStock',
    'check_stock_available',
    'dispensing_department',
    'post_stock_for_invoice_item',
    'reverse_stock_for_invoice_item',
]
