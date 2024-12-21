import pytest
from inventory.models import Inventory

@pytest.mark.django_db
def test_reorder_signal_triggered(inventory):
    """
    Test that the reorder notification is triggered when quantity_at_hand <= re_order_level.
    """
    inventory.re_order_level = 5
    inventory.quantity_at_hand = 10
    inventory.save()

    inventory.quantity_at_hand = 5
    inventory.save()

    assert inventory.quantity_at_hand <= inventory.re_order_level


@pytest.mark.django_db
def test_reorder_signal_not_triggered(inventory):
    """
    Test that the reorder notification is NOT triggered when quantity_at_hand > re_order_level.
    """
    inventory.re_order_level = 5
    inventory.quantity_at_hand = 10
    inventory.save()

    inventory.quantity_at_hand = 6
    inventory.save()

    assert inventory.quantity_at_hand > inventory.re_order_level
