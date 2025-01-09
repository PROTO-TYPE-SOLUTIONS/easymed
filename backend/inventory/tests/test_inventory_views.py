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

from unittest.mock import patch

@pytest.mark.django_db
@patch('inventory.views.HTML')  # Adjust the module path to where the function resides.
def test_download_supplier_invoice_pdf_template_rendering(mock_html, authenticated_client, supplier, supplier_invoice, incoming_item, company):
    """
    Test that the template is rendered with the correct context.
    """
    mock_html.return_value.write_pdf.return_value = b'%PDF-1.4'  # Mocking PDF output.
    
    url = reverse('download_supplier_invoice_pdf', kwargs={'supplier_id': supplier.id})  # Replace with your actual URL name.
    response = authenticated_client.get(url)

    assert mock_html.called
    context = mock_html.call_args[1]['string']  # Access the rendered template string.
    assert str(supplier_invoice.invoice_no) in context
    assert str(incoming_item.item.name) in context