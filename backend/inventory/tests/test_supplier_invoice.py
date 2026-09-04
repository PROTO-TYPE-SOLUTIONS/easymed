import pytest
from decimal import Decimal
from django.utils import timezone

from inventory.models import IncomingItem, StockBalance, SupplierInvoice
from inventory.serializers import IncomingItemSerializer
from inventory.services import stock as stock_service


def _receive(supplier_invoice, item, supplier, purchase_order, department,
             purchase_price, quantity, lot_no):
    """Create a goods-received line and post it, the way the API does."""
    line = IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        department=department,
        purchase_price=Decimal(purchase_price),
        sale_price=Decimal('150.00'),
        quantity=quantity,
        quantity_unit='units',
        lot_no=lot_no,
        expiry_date=timezone.now().date(),
    )
    stock_service.receive_incoming_item(line)
    return line


@pytest.mark.django_db
def test_posting_a_receipt_updates_invoice_amount(
    supplier_invoice, item, supplier, purchase_order, department
):
    _receive(supplier_invoice, item, supplier, purchase_order, department, '100.00', 2, 'LOT001')

    supplier_invoice.refresh_from_db()
    assert supplier_invoice.amount == Decimal('200.00')


@pytest.mark.django_db
def test_multiple_receipts_sum_correctly(
    supplier_invoice, item, supplier, purchase_order, department
):
    _receive(supplier_invoice, item, supplier, purchase_order, department, '100.00', 2, 'LOT001')
    _receive(supplier_invoice, item, supplier, purchase_order, department, '50.00', 3, 'LOT002')

    supplier_invoice.refresh_from_db()
    assert supplier_invoice.amount == Decimal('350.00')


@pytest.mark.django_db
def test_posting_a_receipt_brings_stock_in(
    supplier_invoice, item, supplier, purchase_order, department
):
    line = _receive(
        supplier_invoice, item, supplier, purchase_order, department, '100.00', 2, 'LOT001')

    line.refresh_from_db()
    assert line.is_posted
    assert StockBalance.objects.get(item=item, department=department).quantity == 2


@pytest.mark.django_db
def test_posting_the_same_receipt_twice_does_not_double_stock(
    supplier_invoice, item, supplier, purchase_order, department
):
    line = _receive(
        supplier_invoice, item, supplier, purchase_order, department, '100.00', 2, 'LOT001')

    stock_service.receive_incoming_item(line)

    assert StockBalance.objects.get(item=item, department=department).quantity == 2


@pytest.mark.django_db
def test_packs_are_converted_to_base_units(
    supplier_invoice, item, supplier, purchase_order, department
):
    """item.subpacked is 1 by default; give it a real pack size."""
    item.subpacked = 20
    item.save()

    line = IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        department=department,
        purchase_price=Decimal('200.00'),   # per pack
        quantity=3,                          # three packs
        quantity_unit='packs',
        lot_no='LOT-PACK',
        expiry_date=timezone.now().date(),
    )
    stock_service.receive_incoming_item(line)

    assert line.base_units == 60
    assert StockBalance.objects.get(item=item, department=department).quantity == 60
    # Cost is stored per base unit, not per pack.
    assert StockBalance.objects.get(item=item, department=department).unit_cost == Decimal('10.0000')


@pytest.mark.django_db
def test_a_posted_receipt_cannot_be_edited(
    supplier_invoice, item, supplier, purchase_order, department
):
    line = _receive(
        supplier_invoice, item, supplier, purchase_order, department, '100.00', 2, 'LOT001')

    serializer = IncomingItemSerializer(line, data={'quantity': 5}, partial=True)
    assert serializer.is_valid(), serializer.errors
    with pytest.raises(Exception):
        serializer.save()


@pytest.mark.django_db
def test_create_supplier_invoice(supplier, purchase_order):
    invoice = SupplierInvoice.objects.create(
        invoice_no="INV-2024-003",
        status="pending",
        supplier=supplier,
        purchase_order=purchase_order
    )
    assert invoice.invoice_no == "INV-2024-003"
