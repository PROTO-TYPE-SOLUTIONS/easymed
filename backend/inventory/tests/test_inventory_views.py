import pytest

from inventory.models import (
    Inventory,
    PurchaseOrder,
    PurchaseOrderItem,
    GoodsReceiptNote,
    SupplierInvoice,
    RequisitionItem
    )


@pytest.mark.django_db
def test_goods_receipt_note_signal(supplier, purchase_order):
    assert GoodsReceiptNote.objects.count() == 0

    supplier_invoice = SupplierInvoice.objects.create(
        invoice_no="INV12345",
        amount=1000.0,
        supplier=supplier,
        purchase_order=purchase_order,
    )

    assert GoodsReceiptNote.objects.count() == 1

    goods_receipt_note = GoodsReceiptNote.objects.first()
    assert goods_receipt_note.purchase_order == supplier_invoice.purchase_order
    assert goods_receipt_note.note == f"Generated for Supplier Invoice: {supplier_invoice.invoice_no}"
    assert goods_receipt_note.grn_number is not None  # Check GRN number auto-generation



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
    
    # Update the purchase_order attribute of the incoming_item
    incoming_item.purchase_order = purchase_order
    incoming_item.quantity = 10
    incoming_item.save()
    
    # Manually call the create_or_update_inventory_record task
    from easymed.celery_tasks import create_or_update_inventory_record
    create_or_update_inventory_record(incoming_item.id)
    
    print(f'There are {Inventory.objects.count()} inventory items')
    print(f'There are {initial_inventory.quantity_at_hand} items in stock')
    
    updated_inventory = Inventory.objects.get(id=initial_inventory.id)
    
    assert updated_inventory.quantity_at_hand == initial_inventory.quantity_at_hand + incoming_item.quantity


from django.urls import reverse
from datetime import datetime, timedelta
from inventory.models import Inventory, Item


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
    # Add expiry date to the item and simulate near-expiry
    inventory.expiry_date = datetime.now() + timedelta(days=90)
    print(f'Expiry Date: {inventory.expiry_date}')
    inventory.item.category = "Drug"
    print(f'Category: {inventory.item.category} - {inventory.item.name}')
    inventory.item.save()

    # Make the request to the endpoint
    url = reverse('inventory-filter')
    response = authenticated_client.get(url, {'category': 'Drug', 'filter_type': 'near_expiry'})
    print(f'Response: {response.json()}')

    # Check the response
    assert response.status_code == 200
    # assert len(response.json()) == 1

