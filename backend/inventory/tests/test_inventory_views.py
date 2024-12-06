from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from inventory.models import Inventory, IncomingItem, Item
from celery import shared_task

import pytest
from inventory.models import Inventory
# from django_celery_results.models import TaskResult
from celery.result import AsyncResult
from easymed.celery_tasks import create_or_update_inventory_record

@pytest.mark.django_db
def test_incoming_item_updates_inventory(incoming_item, item):
    # Ensure there is an existing Inventory record for the item
    initial_inventory = Inventory.objects.create(
        item=item,
        quantity_in_stock=5,
        purchase_price=10.0,
        sale_price=20.0
    )

    # Trigger the signal by creating an IncomingItem
    incoming_item.save()
    
    # Get count of inventory items
    print(f'There are {Inventory.objects.count()} inventory items')
    
    # Check item quantity in stock
    print(f'There are {initial_inventory.quantity_in_stock} items in stock')

    # Confirm the inventory was updated
    updated_inventory = Inventory.objects.get(id=initial_inventory.id)

    assert updated_inventory.quantity_in_stock == initial_inventory.quantity_in_stock + incoming_item.quantity





#  class TestInventoryViews(APITestCase):
#     def setUp(self):
#         self.item = Item.objects.create(
#             name="Test Item",
#             desc="Test Description",
#             category="General",
#             units_of_measure="Unit",
#             quantity_at_hand=10,
#             re_order_level=5,
#             buying_price=10.0,
#             selling_price=20.0,
#             vat_rate=16.0,
#         )
#         self.inventory = Inventory.objects.create(
#             item=self.item,
#             quantity_in_stock=10,
#         )

# def test_incoming_item_updates_inventory(self):
#     initial_inventory_quantity = self.inventory.quantity_in_stock
#     incoming_item_data = {
#         "item": self.item.id,
#         "quantity": 5,
#     }
#     url = reverse("incoming-item-list")
#     response = self.client.post(url, incoming_item_data, format="json")
#     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#     # Run Celery tasks synchronously during the test
#     with self.settings(CELERY_ALWAYS_EAGER=True):
#         # The signal should be sent and the task should be executed here
#         pass
#     self.inventory.refresh_from_db()
#     self.assertEqual(self.inventory.quantity_in_stock, initial_inventory_quantity + incoming_item_data["quantity"])