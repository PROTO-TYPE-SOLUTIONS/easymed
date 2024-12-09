import pytest
from inventory.models import Item, IncomingItem

@pytest.fixture
def item():
    """Create a test item"""
    return Item.objects.create(
        name="Test Item",
        desc="Test Description",
        category="Drug",
        units_of_measure="unit",
        item_code="TEST001",
        quantity_at_hand=10,
        re_order_level=5
    )

@pytest.fixture
def incoming_item(item):
    """Create a test incoming item"""
    return IncomingItem(
        item=item,
        purchase_price=10.0,
        sale_price=20.0,
        packed="Box",
        subpacked="Unit",
        quantity=10,
        category_one="Resale",
        item_code="TEST001"
    )
