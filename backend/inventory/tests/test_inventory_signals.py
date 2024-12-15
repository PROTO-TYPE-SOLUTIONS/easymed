import pytest
from unittest.mock import patch
from django.test import TestCase


from customuser.models import CustomUser
from inventory.models import IncomingItem, Inventory, Item, Supplier, PurchaseOrder
from inventory.signals import update_inventory_after_incomingitem_creation

class UpdateInventoryTests(TestCase):
    @patch('inventory.models.Inventory.save')
    def test_inventory_created(self, mock_save):
        user = CustomUser.objects.create_user(
            email="9jg4t@example.com",
            password="password",
            first_name="Test",
            last_name="User",
            role="patient",
            profession="Test Profession",
            phone="+1234567890"
            )
        item = Item.objects.create(
            name="Test Item",
            desc="Test Description",
            category="General",
            units_of_measure="Unit",
            vat_rate=16.0,
            item_code="ABC123",
        )
        supplier = Supplier.objects.create(official_name="Test Supplier", common_name="Test")
        purchase_order = PurchaseOrder.objects.create(ordered_by=user)

        incoming_item = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            purchase_order=purchase_order,
            quantity=10,
            sale_price=20.0,
            category_one="resale",
        )

        update_inventory_after_incomingitem_creation(sender=IncomingItem, instance=incoming_item, created=True)

        inventory = Inventory.objects.get(item=incoming_item.item.id)
        assert inventory.quantity_at_hand == 10
        assert inventory.purchase_price == 15.0
        assert inventory.sale_price == 20.0
        mock_save.assert_called_once()