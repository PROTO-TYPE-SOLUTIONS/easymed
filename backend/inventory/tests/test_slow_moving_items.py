import pytest
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import status
from billing.models import Invoice, InvoiceItem
from inventory.models import Inventory

@pytest.fixture
def inventory_with_slow_moving_period(inventory):
    """Create an inventory item with a slow moving period"""
    inventory.slow_moving_period = 30  # 30 days
    inventory.save()
    return inventory

@pytest.fixture
def invoice(patient):
    """Create an invoice"""
    return Invoice.objects.create(
        patient=patient,
        status='billed'
    )

@pytest.fixture
def invoice_item_recent(invoice, inventory_with_slow_moving_period):
    """Create a recent invoice item (within slow moving period)"""
    return InvoiceItem.objects.create(
        invoice=invoice,
        item=inventory_with_slow_moving_period.item,
        item_created_at=timezone.now() - timedelta(days=15),  # 15 days ago
        status='billed'
    )

@pytest.fixture
def invoice_item_old(invoice, inventory_with_slow_moving_period):
    """Create an old invoice item (outside slow moving period)"""
    return InvoiceItem.objects.create(
        invoice=invoice,
        item=inventory_with_slow_moving_period.item,
        item_created_at=timezone.now() - timedelta(days=45),  # 45 days ago
        status='billed'
    )

@pytest.mark.django_db
class TestSlowMovingItems:
    def test_no_slow_moving_items(self, authenticated_client, inventory_with_slow_moving_period, invoice_item_recent):
        """
        Test when there are no slow-moving items because all sales are recent
        """
        url = '/inventory/inventories/slow-moving-items/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0  # No slow moving items

   
    def test_item_without_slow_moving_period(self, authenticated_client, inventory):
        """
        Test that items without slow_moving_period are not included
        """
        url = '/inventory/inventories/slow-moving-items/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_item_without_stock(self, authenticated_client, inventory_with_slow_moving_period):
        """
        Test that items with zero stock are not included
        """
        inventory_with_slow_moving_period.quantity_at_hand = 0
        inventory_with_slow_moving_period.save()
        
        url = '/inventory/inventories/slow-moving-items/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_multiple_sales_last_sale_old(self, authenticated_client, inventory_with_slow_moving_period, 
                                        invoice_item_recent, invoice_item_old):
        """
        Test that even with multiple sales, if the last sale is within the period,
        the item is not considered slow-moving
        """
        url = '/inventory/inventories/slow-moving-items/'
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0  # Not slow moving because has recent sale

  