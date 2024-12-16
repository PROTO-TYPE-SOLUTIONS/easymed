import pytest
from django.urls import reverse
from datetime import datetime, timedelta


from inventory.models import Inventory, Item
from inventory.signals import update_inventory_after_incomingitem_creation
from inventory.models import (
    Inventory,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceiptNote,
    SupplierInvoice,
    RequisitionItem,
    IncomingItem
    )



@pytest.mark.django_db
def test_incoming_item_updates_inventory(incoming_item, item, user, requisition):
    initial_inventory = Inventory.objects.create(
        item=item,
        quantity_at_hand=0,
        purchase_price=10.0,
        sale_price=20.0
    )
    
    print(f'There are {Inventory.objects.count()} inventory items')
    print(f'There are {initial_inventory.quantity_at_hand} items in stock')
    
    purchase_order = PurchaseOrder.objects.create(ordered_by=user)
    requisition_item = RequisitionItem.objects.create(
        item=item,
        quantity_requested=10,
        requisition_id=requisition.id
        )
    purchase_order_item = PurchaseOrderItem.objects.create(
        purchase_order=purchase_order,
        requisition_item=requisition_item,
        quantity_ordered=10,
    
    )
    
    incoming_item.purchase_order = purchase_order
    incoming_item.quantity = 10
    incoming_item.save()

    update_inventory_after_incomingitem_creation(sender=IncomingItem, instance=incoming_item, created=True)
    
    print(f'There are {Inventory.objects.count()} inventory items')
    print(f'There are {initial_inventory.quantity_at_hand} items in stock')
    
    updated_inventory = Inventory.objects.get(id=initial_inventory.id)
    
    assert updated_inventory.quantity_at_hand == initial_inventory.quantity_at_hand + incoming_item.quantity


@pytest.mark.django_db
def test_low_quantity_filter(authenticated_client, inventory, item):
    inventory.re_order_level = 15
    inventory.quantity_at_hand = 10
    inventory.item.category = "Drug"
    inventory.item.save()
    inventory.save()

    url = reverse('inventory-filter')
    response = authenticated_client.get(url, {'category': 'Drug', 'filter_type': 'low_quantity'})

    assert response.status_code == 200
    assert response.json()[0]['item_name'] == item.name


# TODO: Test that we're actually getting some data
@pytest.mark.django_db
def test_near_expiry_filter(authenticated_client, inventory, item):
    inventory.expiry_date = datetime.now() + timedelta(days=91)
    print(f'Expiry Date: {inventory.expiry_date}')
    inventory.item.category = "Drug"
    print(f'Category: {inventory.item.category} - {inventory.item.name}')
    inventory.item.save()

    url = reverse('inventory-filter')
    response = authenticated_client.get(url, {'category': 'Drug', 'filter_type': 'near_expiry'})
    print(f'Response: {response.json()}')

    assert response.status_code == 200
    #TODO: There's some seriouse headache here!
    # assert len(response.json()) == 1

