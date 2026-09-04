import pytest

from inventory.models import RequisitionItem, Item, Supplier
from inventory.serializers import RequisitionSerializer
from inventory.services import stock as stock_service

@pytest.fixture
def item2():
    return Item.objects.create(
        name="Test Item 2",
        desc="Test Description 2",
        category="General",
        units_of_measure="Unit",
        vat_rate=16.0,
        item_code="AyiC123",
    )

@pytest.fixture
def inventory2(item2, department):
    """Opening stock for item2, posted through the ledger."""
    return stock_service.receive(
        item=item2,
        department=department,
        quantity=10,
        unit_cost=10.0,
        lot_number="LOT-001",
    )


@pytest.mark.django_db
def test_requisition_successful_creation(requisition, item, item2, inventory2, inventory, supplier, authenticated_client, department):
    requisition_item1 = RequisitionItem.objects.create(
        quantity_requested=10,
        item=item,
        preferred_supplier=supplier,
        requisition=requisition
    )

    requisition_item2 = RequisitionItem.objects.create(
        quantity_requested=30,
        item=item2,  
        preferred_supplier=supplier,
        requisition=requisition
    )

    requisition.refresh_from_db()
    response = authenticated_client.get(f'/inventory/requisition/{requisition.id}/')
    assert response.status_code == 200
    assert len(response.data['items']) == 2  # Check if two items are returned in the response

@pytest.mark.django_db
def test_requsition_item_with_mising_supplier(requisition, user, supplier, inventory, authenticated_client, department, item):
    """
    Test that if a RequisitionItem is created without a preferred supplier,
    the first supplier in the database is automatically assigned via the serializer.
    """
    default_supplier = Supplier.objects.first()
    requisition_data = {
        "requested_by": user.id,
        "department": department.id,
        "items":[
            {
                "quantity_requested": 10,
                "item": item.id,  
                "requisition": requisition.id  
                # No 'preferred_supplier' provided (should default to the first supplier)
            }
        ]
    }

    serializer = RequisitionSerializer(data=requisition_data)
    assert serializer.is_valid(), serializer.errors  

    requisition = serializer.save()

    requisition.refresh_from_db()

    response = authenticated_client.get(f'/inventory/requisition/{requisition.id}/')
    assert response.status_code == 200
    assert response.data['items'][0]['preferred_supplier'] == default_supplier.official_name


@pytest.mark.django_db
def test_creating_requisition_with_same_item_same_supplier(
    requisition, item, user, inventory, supplier, department, authenticated_client
):
    """
    Items with the same supplier and item should be combined into a single RequisitionItem.
    """
    supplier2 = Supplier.objects.create(
        official_name="Supplier 2", common_name="Supplier 2"
    )

    requisition_data = {
        "requested_by": user.id,
        "department": department.id,
        "items": [
            {
                "quantity_requested": 10,
                "item": item.id,
                "requisition": requisition.id,
            },
            {
                "quantity_requested": 10,
                "item": item.id,
                "requisition": requisition.id,
            },
            {
                "quantity_requested": 10,
                "item": item.id,
                "requisition": requisition.id,
                "preferred_supplier": supplier2.id,
            },
        ],
    }

    serializer = RequisitionSerializer(data=requisition_data)
    assert serializer.is_valid(), serializer.errors

    requisition = serializer.save()
    requisition.refresh_from_db()

    requisition_items = requisition.items.filter(requisition=requisition)

    response = authenticated_client.get(f'/inventory/requisition/{requisition.id}/')

    assert response.status_code == 200
    assert len(response.data['items']) == 2  # First two items should be combined

    # Cost per base unit now comes from the ledger's weighted average, not from
    # whichever inventory row happened to sort first.
    total_amount_requested = sum(
        line.quantity_requested * (line.item.current_cost or 0)
        for line in requisition_items
    )

    assert total_amount_requested == 300.00