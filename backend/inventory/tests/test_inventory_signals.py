import pytest
from unittest.mock import patch
from django.db import transaction
from django.utils import timezone
from decimal import Decimal

from customuser.models import CustomUser
from inventory.models import (
    IncomingItem, Inventory, Item, Supplier,
    PurchaseOrder, Department, Requisition,
    SupplierInvoice, PurchaseOrderItem
)
from inventory.signals import (
    update_inventory_after_incomingitem_creation,
    update_purchase_order_status
)


'''
Given the complexity of database transactions and potential race conditions,
it's important to simulate conditions in a controlled environment.
'''
@pytest.fixture
def incoming_item2(db, item, supplier, purchase_order, requisition, supplier_invoice):
    return IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('100.00'),
        sale_price=Decimal('150.00'),
        quantity=2,
        lot_no="LOT001",
        expiry_date=timezone.now().date()
    )

@pytest.mark.django_db
def test_inventory_signal_on_incoming_item_creation(incoming_item2):
    # Create an IncomingItem instance
    incoming_item = IncomingItem(
        item=incoming_item2.item,
        supplier=incoming_item2.supplier,
        purchase_order=incoming_item2.purchase_order,
        supplier_invoice=incoming_item2.supplier_invoice,
        quantity=10,
        purchase_price=50.00,
        sale_price=100.00,
        lot_no="LOT123"
    )
    print(f'Incoming Item is: {incoming_item.item}, Lot: {incoming_item.lot_no}')

    # Trigger the save operation to invoke the signal
    with transaction.atomic():
        incoming_item.save()

    inventory = Inventory.objects.filter(
        item=incoming_item.item,
        lot_number=incoming_item.lot_no
    ).first()

    assert inventory is not None, "Inventory record should be created or updated"
    assert inventory.quantity_at_hand == incoming_item.quantity, \
        f"Expected quantity {incoming_item.quantity}, but got {inventory.quantity_at_hand}"
    assert inventory.purchase_price == incoming_item.purchase_price, \
        f"Expected purchase price {incoming_item.purchase_price}, but got {inventory.purchase_price}"
    assert inventory.sale_price == incoming_item.sale_price, \
        f"Expected sale price {incoming_item.sale_price}, but got {inventory.sale_price}"

    print(f"Inventory ID: {inventory.id}, Quantity: {inventory.quantity_at_hand}")


@pytest.mark.django_db
def test_update_purchase_order_status_completed(purchase_order, purchase_order_item):
    purchase_order_item.quantity_ordered = 10
    purchase_order_item.quantity_received = 10
    purchase_order_item.save()

    update_purchase_order_status(purchase_order)

    assert purchase_order.status == PurchaseOrder.Status.COMPLETED


@pytest.mark.django_db
def test_update_purchase_order_status_pending(purchase_order, purchase_order_item):
    purchase_order_item.quantity_ordered = 10
    purchase_order_item.quantity_received = 0
    purchase_order_item.save()

    update_purchase_order_status(purchase_order)

    assert purchase_order.status == PurchaseOrder.Status.PENDING


@pytest.mark.django_db
def test_update_purchase_order_status_partial(purchase_order, purchase_order_item):
    purchase_order_item.quantity_ordered = 10
    purchase_order_item.quantity_received = 5
    purchase_order_item.save()

    update_purchase_order_status(purchase_order)

    assert purchase_order.status == PurchaseOrder.Status.PARTIAL



@pytest.mark.django_db
def test_update_purchase_order_status_multiple_items(purchase_order):
    purchase_order_item1 = PurchaseOrderItem.objects.create(
        purchase_order=purchase_order,
        quantity_ordered=10,
        quantity_received=10
    )
    purchase_order_item2 = PurchaseOrderItem.objects.create(
        purchase_order=purchase_order,
        quantity_ordered=10,
        quantity_received=5
    )

    update_purchase_order_status(purchase_order)

    assert purchase_order.status == PurchaseOrder.Status.PARTIAL
