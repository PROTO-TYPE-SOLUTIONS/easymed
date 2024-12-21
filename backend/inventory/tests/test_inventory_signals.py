import pytest
from unittest.mock import patch
from django.test import TestCase
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
def user(db):
    return CustomUser.objects.create_user(
        email="9jg4t@example.com",
        password="password",
        first_name="Test",
        last_name="User",
        role="patient",
        profession="Test Profession",
        phone="+1234567890"
    )

@pytest.fixture
def item(db):
    return Item.objects.create(
        name="Test Item",
        desc="Test Description",
        category="General",
        units_of_measure="Unit",
        vat_rate=16.0,
        item_code="ABC123",
    )

@pytest.fixture
def purchase_order(db, user):
    return PurchaseOrder.objects.create(ordered_by=user)

@pytest.fixture
def requisition(db, user):
    department = Department.objects.create(name="Nursing")
    return Requisition.objects.create(
        requisition_number="REQ001",
        department=department,
        requested_by=user
    )

@pytest.fixture
def incoming_item(db, item, supplier, purchase_order, requisition, supplier_invoice):
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

def test_inventory_created(incoming_item):
    print(f'Incoming Item is: {incoming_item.id}')
    
    inventory, created = Inventory.objects.get_or_create(
        item=incoming_item.item,
        defaults={
            'purchase_price': incoming_item.purchase_price,
            'sale_price': incoming_item.sale_price,
            'quantity_at_hand': 20 # initial quantity
        }
    )

    if not created:
        inventory.purchase_price = incoming_item.purchase_price
        inventory.sale_price = incoming_item.sale_price
        inventory.quantity_at_hand += incoming_item.quantity
        inventory.save()
    
    print(f'Inventory ID is: {inventory.id}, Quantity: {inventory.quantity_at_hand}')

    update_inventory_after_incomingitem_creation(sender=IncomingItem, instance=incoming_item, created=True)

    updated_inventory = Inventory.objects.get(item=incoming_item.item)
    print(f'Updated Inventory: {updated_inventory.id}, Quantity: {updated_inventory.quantity_at_hand}')

    assert updated_inventory.quantity_at_hand == incoming_item.quantity+20




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
