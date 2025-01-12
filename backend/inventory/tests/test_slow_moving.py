import pytest
from datetime import timedelta
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from ..models import IncomingItem, Inventory

pytestmark = pytest.mark.django_db

@pytest.fixture
def old_incoming_item(incoming_item):
    """Create an incoming item from more than 3 months ago"""
    old_date = timezone.now() - timedelta(days=100)
    incoming_item.date_created = old_date
    incoming_item.save()
    return incoming_item

@pytest.fixture
def recent_incoming_item(item, supplier, purchase_order, supplier_invoice):
    """Create a recent incoming item (within last 3 months)"""
    return IncomingItem.objects.create(
        item=item,
        quantity=5,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        category_one='Resale',
        sale_price=100
    )

@pytest.fixture
def zero_quantity_inventory(item):
    """Create an inventory item with zero quantity"""
    return Inventory.objects.create(
        item=item,
        quantity_at_hand=0,
        category_one='Resale'
    )

def test_slow_moving_inventory_list(authenticated_client, inventory, old_incoming_item):
    """Test retrieving slow moving inventory items"""
    url = reverse('slow-moving-inventory')
    response = authenticated_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert 'count' in response.data
    assert 'results' in response.data
    
    # Should return the inventory item with old transaction
    assert response.data['count'] == 1
    assert len(response.data['results']) == 1
    
    # Check response structure
    result = response.data['results'][0]
    expected_fields = {
        'id', 'item', 'item_name', 'purchase_price', 'sale_price',
        'quantity_at_hand', 'lot_number', 'expiry_date', 'date_created',
        'category_one', 'insurance_sale_prices', 'total_quantity'
    }
    assert set(result.keys()) == expected_fields
    
    # Check specific values
    assert result['item'] == inventory.item.id
    assert result['item_name'] == inventory.item.name
    assert result['quantity_at_hand'] == inventory.quantity_at_hand
    assert result['category_one'] == inventory.category_one

def test_no_slow_moving_items(authenticated_client, inventory, recent_incoming_item):
    """Test when there are no slow moving items (all items have recent transactions)"""
    url = reverse('slow-moving-inventory')
    response = authenticated_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 0
    assert len(response.data['results']) == 0

def test_zero_quantity_items_excluded(authenticated_client, zero_quantity_inventory):
    """Test that items with zero quantity are not included in slow moving items"""
    url = reverse('slow-moving-inventory')
    response = authenticated_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 0
    assert len(response.data['results']) == 0

def test_recent_transaction_items_excluded(authenticated_client, inventory, recent_incoming_item):
    """Test that items with recent transactions are not included in slow moving items"""
    url = reverse('slow-moving-inventory')
    response = authenticated_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == 0
    assert len(response.data['results']) == 0
