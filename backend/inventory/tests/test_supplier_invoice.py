import pytest
from decimal import Decimal
from django.utils import timezone
from django.db.models.signals import post_save, post_delete
from django.contrib.auth import get_user_model

from inventory.models import (
    SupplierInvoice,
    IncomingItem,
    Requisition,
    Department,
    Inventory  
)
from inventory import signals  

from inventory.tests.test_inventory_signals import supplier, purchase_order, requisition, incoming_item

@pytest.fixture
def supplier_invoice(db, supplier, purchase_order):
    return SupplierInvoice.objects.create(
        invoice_no="INV-2024-002",
        status="pending",
        supplier=supplier,
        purchase_order=purchase_order
    )

@pytest.mark.django_db
def test_create_incoming_item_updates_invoice_amount(supplier_invoice, item, supplier, purchase_order):
    incoming_item = IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('100.00'),
        sale_price=Decimal('150.00'),
        quantity=2,
        lot_no="LOT001",
        expiry_date=timezone.now().date()
    )
    
    supplier_invoice.refresh_from_db()
    
    assert supplier_invoice.amount == Decimal('200.00')

@pytest.mark.django_db
def test_multiple_incoming_items_sum_correctly(supplier_invoice, item, supplier, purchase_order):
    IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('100.00'),
        sale_price=Decimal('150.00'),
        quantity=2,
        lot_no="LOT001",
        expiry_date=timezone.now().date()
    )
    
    IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('50.00'),
        sale_price=Decimal('75.00'),
        quantity=3,
        lot_no="LOT002",
        expiry_date=timezone.now().date()
    )
    
    supplier_invoice.refresh_from_db()
    
    assert supplier_invoice.amount == Decimal('350.00')

@pytest.mark.django_db
def test_update_incoming_item_updates_invoice_amount(supplier_invoice, item, supplier, purchase_order):
    incoming_item = IncomingItem.objects.create(
        item=item,
        supplier=supplier,
        purchase_order=purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('100.00'),
        sale_price=Decimal('150.00'),
        quantity=2,
        lot_no="LOT001",
        expiry_date=timezone.now().date()
    )
    
    incoming_item.quantity = 3
    incoming_item.save()
    
    supplier_invoice.refresh_from_db()
    
    assert supplier_invoice.amount == Decimal('300.00')

@pytest.mark.django_db
def test_delete_incoming_item_updates_invoice_amount(incoming_item, supplier_invoice):
    # Create an additional incoming item
    item2 = IncomingItem.objects.create(
        item=incoming_item.item,
        supplier=incoming_item.supplier,
        purchase_order=incoming_item.purchase_order,
        supplier_invoice=supplier_invoice,
        purchase_price=Decimal('50.00'),
        sale_price=Decimal('75.00'),
        quantity=3,
        lot_no="LOT002",
        expiry_date=timezone.now().date()
    )
    
    # Calculate the initial amount
    supplier_invoice.refresh_from_db()
    initial_amount = supplier_invoice.amount
    assert initial_amount == (incoming_item.purchase_price * incoming_item.quantity + 
                               item2.purchase_price * item2.quantity)
    
    incoming_item.delete()
    supplier_invoice.refresh_from_db()
    
    updated_amount = initial_amount - (incoming_item.purchase_price * incoming_item.quantity)
    assert supplier_invoice.amount == updated_amount

@pytest.mark.django_db
def test_create_supplier_invoice(supplier, purchase_order):
    invoice = SupplierInvoice.objects.create(
        invoice_no="INV-2024-003",
        status="pending",
        supplier=supplier,
        purchase_order=purchase_order
    )
    assert invoice.invoice_no == "INV-2024-003"
