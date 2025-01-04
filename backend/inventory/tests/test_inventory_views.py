import pytest
from django.urls import reverse
from datetime import datetime, timedelta

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

