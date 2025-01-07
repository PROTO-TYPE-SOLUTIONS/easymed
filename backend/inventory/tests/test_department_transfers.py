from django.contrib.auth import authenticate
import pytest
from django.urls import reverse
from rest_framework import status
from inventory.models import DepartmentInventory, Inventory
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

pytestmark = pytest.mark.django_db

class TestDepartmentInventoryTransfers:
    def test_transfer_single_batch(self, authenticated_client, department, item):
        """Test basic transfer from a single inventory batch"""
        # Create inventory with expiry date
        expiry_date = timezone.now().date() + timezone.timedelta(days=30)
        inventory = Inventory.objects.create(
            item=item,
            purchase_price=Decimal('100.00'),
            sale_price=Decimal('150.00'),
            quantity_at_hand=10,
            lot_number="LOT001",
            expiry_date=expiry_date
        )

        url = reverse('departmentinventory-list')
        payload = {
            "department": department.id,
            "item": item.id,
            "transfer_quantity": 5
        }

        response = authenticated_client.post(url, data=payload, content_type='application/json')
        assert response.status_code == status.HTTP_201_CREATED

        # Check department inventory was created
        dept_inv = DepartmentInventory.objects.get(
            department=department,
            item=item,
            lot_number="LOT001"
        )
        assert dept_inv.quantity_at_hand == 5
        assert dept_inv.expiry_date == expiry_date
        assert dept_inv.purchase_price == Decimal('100.00')
        assert dept_inv.sale_price == Decimal('150.00')
        assert dept_inv.main_inventory == inventory

        # Check source inventory was updated
        inventory.refresh_from_db()
        assert inventory.quantity_at_hand == 5  # 10 - 5

    def test_transfer_to_same_lot(self, authenticated_client, department, item):
        """Test transferring more items to existing lot number"""
        expiry_date = timezone.now().date() + timezone.timedelta(days=30)
        
        # Create source inventory
        inventory = Inventory.objects.create(
            item=item,
            purchase_price=Decimal('100.00'),
            sale_price=Decimal('150.00'),
            quantity_at_hand=10,
            lot_number="LOT001",
            expiry_date=expiry_date
        )
        
        # Create existing department inventory
        dept_inv = DepartmentInventory.objects.create(
            department=department,
            item=item,
            quantity_at_hand=3,
            lot_number="LOT001",
            expiry_date=expiry_date,
            purchase_price=Decimal('100.00'),
            sale_price=Decimal('150.00'),
            main_inventory=inventory
        )

        url = reverse('departmentinventory-list')
        payload = {
            "department": department.id,
            "item": item.id,
            "transfer_quantity": 5
        }

        response = authenticated_client.post(url, data=payload, content_type='application/json')
        assert response.status_code == status.HTTP_201_CREATED

        # Check quantities were added for same lot
        dept_inv.refresh_from_db()
        assert dept_inv.quantity_at_hand == 8  # 3 + 5
        assert DepartmentInventory.objects.count() == 1  # Still only one record

        # Check source inventory was updated
        inventory.refresh_from_db()
        assert inventory.quantity_at_hand == 5  # 10 - 5

    def test_transfer_fifo_multiple_lots(self, authenticated_client, department, item):
        """Test FIFO transfer across multiple batches with different lot numbers"""
        expiry_date = timezone.now().date() + timezone.timedelta(days=30)
        
        # Create first source inventory (older expiry)
        inventory1 = Inventory.objects.create(
            item=item,
            purchase_price=Decimal('100.00'),
            sale_price=Decimal('150.00'),
            quantity_at_hand=10,  # Only 10 available in oldest batch
            lot_number="LOT001",
            expiry_date=expiry_date
        )
        
        # Create second source inventory with different lot (newer expiry)
        inventory2 = Inventory.objects.create(
            item=item,
            purchase_price=Decimal('120.00'),  # Different price to verify correct batch
            sale_price=Decimal('180.00'),
            quantity_at_hand=8,
            lot_number="LOT002",
            expiry_date=expiry_date + timezone.timedelta(days=30)
        )

        url = reverse('departmentinventory-list')
        payload = {
            "department": department.id,
            "item": item.id,
            "transfer_quantity": 15  # Request more than available in first batch
        }

        response = authenticated_client.post(url, data=payload, content_type='application/json')
        assert response.status_code == status.HTTP_201_CREATED

        # Should create two department inventory records
        dept_inventories = DepartmentInventory.objects.filter(
            department=department,
            item=item
        ).order_by('expiry_date')
        
        assert dept_inventories.count() == 2
        
        # First record should use all 10 from oldest batch
        first_record = dept_inventories[0]
        assert first_record.lot_number == "LOT001"
        assert first_record.quantity_at_hand == 10
        assert first_record.expiry_date == expiry_date
        assert first_record.purchase_price == Decimal('100.00')
        assert first_record.sale_price == Decimal('150.00')
        assert first_record.main_inventory == inventory1
        
        # Second record should use remaining 5 from newer batch
        second_record = dept_inventories[1]
        assert second_record.lot_number == "LOT002"
        assert second_record.quantity_at_hand == 5
        assert second_record.expiry_date == expiry_date + timezone.timedelta(days=30)
        assert second_record.purchase_price == Decimal('120.00')
        assert second_record.sale_price == Decimal('180.00')
        assert second_record.main_inventory == inventory2

        # Verify source inventories were updated correctly
        inventory1.refresh_from_db()
        assert inventory1.quantity_at_hand == 0  # All 10 used
        
        inventory2.refresh_from_db()
        assert inventory2.quantity_at_hand == 3  # 8 - 5 remaining

    def test_transfer_insufficient_quantity(self, authenticated_client, department, item):
        """Test transferring more than available quantity"""
        expiry_date = timezone.now().date() + timezone.timedelta(days=30)
        inventory = Inventory.objects.create(
            item=item,
            purchase_price=Decimal('100.00'),
            sale_price=Decimal('150.00'),
            quantity_at_hand=3,  # Only 3 available
            lot_number="LOT001",
            expiry_date=expiry_date
        )

        url = reverse('departmentinventory-list')
        payload = {
            "department": department.id,
            "item": item.id,
            "transfer_quantity": 5  # Try to transfer 5
        }

        response = authenticated_client.post(url, data=payload, content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Insufficient quantity" in str(response.data)

        # Check inventory was not modified
        inventory.refresh_from_db()
        assert inventory.quantity_at_hand == 3

    def test_transfer_validation_errors(self, authenticated_client, department, item):
        """Test various validation error cases"""
        url = reverse('departmentinventory-list')

        # Test missing department
        response = authenticated_client.post(url, data={
            "item": item.id,
            "transfer_quantity": 5
        }, content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "department" in str(response.data)

        # Test missing item
        response = authenticated_client.post(url, data={
            "department": department.id,
            "transfer_quantity": 5
        }, content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "item" in str(response.data)

        # Test missing transfer quantity
        response = authenticated_client.post(url, data={
            "department": department.id,
            "item": item.id
        }, content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "transfer_quantity" in str(response.data)

        # Test zero transfer quantity
        response = authenticated_client.post(url, data={
            "department": department.id,
            "item": item.id,
            "transfer_quantity": 0
        }, content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "transfer_quantity" in str(response.data)