import pytest
from django.test import TestCase
from inventory.models import (
    Department,
    Inventory,
    IncomingItem,
    PurchaseOrder,
    Requisition,
    Item,
    Supplier
)

@pytest.mark.django_db
class TestInventoryDepartment:
    def test_inventory_department_from_incoming_item(self, user, requisition, department, item, supplier, purchase_order, supplier_invoice):
        """Test that inventory is created with correct department from incoming item's purchase order requisition"""

        # Create an incoming item
        incoming_item = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            supplier_invoice=supplier_invoice,
            purchase_order=purchase_order,
            quantity=10,
            sale_price=20.0,
            category_one="Resale",
        )

        # Get the created inventory
        inventory = Inventory.objects.filter(
            item=item,
            lot_number=incoming_item.lot_no
        ).first()

        # Assert that inventory was created with correct department
        assert inventory is not None
        assert inventory.department == department
        assert inventory.department.name == "Test Department"

    def test_inventory_department_update_with_new_lot(self, user, department, item, supplier, purchase_order, supplier_invoice):
        """Test that new inventory is created with correct department when lot number is different"""
        # Create first requisition and incoming item

        incoming_item1 = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            supplier_invoice=supplier_invoice,
            purchase_order=purchase_order,
            quantity=10,
            sale_price=20.0,
            category_one="Resale",
            lot_no="LOT-001"
        )

        # Create second department and incoming item
        department2 = Department.objects.create(name="Second Department")
        requisition2 = Requisition.objects.create(
            requested_by=user,
            department=department2,
        )

        purchase_order2 = PurchaseOrder.objects.create(
            ordered_by=user,
            requisition=requisition2,
        )

        incoming_item2 = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            supplier_invoice=supplier_invoice,
            purchase_order=purchase_order2,
            quantity=15,
            sale_price=25.0,
            category_one="Resale",
            lot_no="LOT-002"
        )

        # Get both inventory items
        inventory1 = Inventory.objects.get(lot_number="LOT-001")
        inventory2 = Inventory.objects.get(lot_number="LOT-002")

        # Assert that each inventory has correct department
        assert inventory1.department == department
        assert inventory2.department == department2

    def test_inventory_quantity_update_same_lot(self, user, department, item, supplier, purchase_order, supplier_invoice):
        """Test that inventory quantity is updated when incoming item has same lot number"""
        # Create initial incoming item
        incoming_item1 = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            supplier_invoice=supplier_invoice,
            purchase_order=purchase_order,
            quantity=10,
            sale_price=20.0,
            category_one="Resale",
            lot_no="LOT-001"
        )

        # Create second incoming item with same lot number
        incoming_item2 = IncomingItem.objects.create(
            item=item,
            supplier=supplier,
            supplier_invoice=supplier_invoice,
            purchase_order=purchase_order,
            quantity=5,
            sale_price=20.0,
            category_one="Resale",
            lot_no="LOT-001"
        )

        # Get the inventory
        inventory = Inventory.objects.get(lot_number="LOT-001")

        # Assert that quantity was updated and department remains the same
        assert inventory.quantity_at_hand == 15  # 10 + 5
        assert inventory.department == department
