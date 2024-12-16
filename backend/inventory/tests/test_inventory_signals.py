import pytest
from unittest.mock import patch
from django.test import TestCase

from customuser.models import CustomUser
from inventory.models import IncomingItem, Inventory, Item, Supplier, PurchaseOrder
from inventory.signals import update_inventory_after_incomingitem_creation


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
def supplier(db):
    return Supplier.objects.create(official_name="Test Supplier", common_name="Test")

@pytest.fixture
def purchase_order(db, user):
    return PurchaseOrder.objects.create(ordered_by=user)

@pytest.fixture
def incoming_item(db, item, supplier, purchase_order):
    return IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        quantity=10,
        sale_price=20.0,
        category_one="resale",
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
