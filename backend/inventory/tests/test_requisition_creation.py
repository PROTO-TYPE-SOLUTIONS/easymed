import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from weasyprint.css.computed_values import content
from weasyprint.draw import darken
from inventory.models import Requisition, RequisitionItem, Inventory
from rest_framework.test import APIClient

# ============================================================================
# Requisition Creation Tests
# ============================================================================

@pytest.mark.django_db
def test_create_requisition_success(authenticated_client, user, department, item, supplier):
    """Test successful requisition creation with valid data"""
    url = reverse('requisition-list')
    payload = {
        "requested_by": user.id,
        "department": department.id,
        "items": [
            {
                "item": item.id,
                "quantity_requested": 5,
                "preferred_supplier": supplier.id
            }
        ]
    }

    response = authenticated_client.post(url, data=payload, content_type='application/json')

    assert response.status_code == status.HTTP_201_CREATED, f"Response: {response.content}"
    assert Requisition.objects.count() == 1
    
    requisition = Requisition.objects.first()
    assert requisition.requested_by == user
    assert requisition.department == department

    assert RequisitionItem.objects.count() == 1
    requisition_item = RequisitionItem.objects.first()
    assert requisition_item.item == item
    assert requisition_item.quantity_requested == 5
    assert requisition_item.preferred_supplier == supplier


@pytest.mark.django_db
def test_create_requisition_missing_required_fields(authenticated_client, user, department, item):
    """Test requisition creation fails when required fields are missing"""
    url = reverse('requisition-list')
    
    # Test missing department
    data = {
        'requested_by': user.id,
        'items': [{
            'item': item.id,
            'quantity_requested': 10
        }]
    }
    response = authenticated_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'department' in str(response.content)

    # Test missing requested_by
    payload = {
        'department': department.id,
        'items': [{
            'item': item.id,
            'quantity_requested': 10
        }]
    }
    response = authenticated_client.post(url,   data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'requested_by' in str(response.content)


@pytest.mark.django_db
def test_create_requisition_with_invalid_items(authenticated_client, user, department, item, supplier):
    """Test requisition creation fails with invalid item data"""
    
    payload = {
        "requested_by": user.id,
        "department": department.id,
        "items": [
            {
                "item": item.id,
                "quantity_requested": -5,
                "preferred_supplier": supplier.id
            }
        ]
    }
    url = reverse('requisition-list')
    response = authenticated_client.post(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    response_content = response.json()
    assert 'quantity_requested' in str(response_content.get('items', [])[0]), f"Response: {response.content}"

    payload = {
        'requested_by': user.id,
        'department': department.id,
        'items': [{
            'item': 9999,
            'quantity_requested': 10,
            'preferred_supplier': supplier.id
        }]
    }
    response = authenticated_client.post(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'item' in str(response.content)


@pytest.mark.django_db
def test_create_requisition_with_multiple_items(authenticated_client, user, department, item, supplier):
    """Test creating a requisition with multiple items"""
    payload = {
        'requested_by': user.id,
        'department': department.id,
        'items': [
            {
                'item': item.id,
                'quantity_requested': 10,
                'preferred_supplier': supplier.id
            },
            {
                'item': item.id,
                'quantity_requested': 5,
                'preferred_supplier': supplier.id
            }
        ]
    }

    url = reverse('requisition-list')

    response = authenticated_client.post(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_201_CREATED, f"Response: {response.content}"
    assert Requisition.objects.count() == 1
    assert RequisitionItem.objects.count() == 1  # Should be 1 because same item is combined
    
    requisition_item = RequisitionItem.objects.first()
    assert requisition_item.quantity_requested == 15  # 10 + 5


@pytest.mark.django_db
def test_create_requisition_empty_items(authenticated_client, user, department):
    """Test requisition creation fails when no items are provided"""
    url = reverse('requisition-list')
    data = {
        'requested_by': user.id,
        'department': department.id,
        'items': []
    }

    response = authenticated_client.post(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'items' in str(response.content)


@pytest.mark.django_db
def test_create_requisition_unauthorized(client, user, department, item, supplier):
    """Test requisition creation fails for unauthorized users"""
    url = reverse('requisition-list')
    data = {
        'requested_by': user.id,
        'department': department.id,
        'items': [{
            'item': item.id,
            'quantity_requested': 10,
            'preferred_supplier': supplier.id
        }]
    }

    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED  # Using 401 for unauthenticated requests


# ============================================================================
# Requisition Item Update Tests
# ============================================================================

@pytest.mark.django_db
def test_update_requisitionitem_success(authenticated_client, user, department, item, supplier, requisition, requisition_item):
   
    url = reverse('requisitionitems-detail', kwargs={
        'requisition_pk': requisition.id,
        'pk': requisition_item.id
    })
    
    payload = {
        'quantity_requested': 15
    }
    response = authenticated_client.patch(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    
    requisition_item.refresh_from_db()
    assert requisition_item.quantity_requested == 15


@pytest.mark.django_db
def test_update_requisitionitem_quantity_approved_success(authenticated_client, user, department, item, supplier, requisition, requisition_item):
    """Test updating requisition item quantity_approved with valid value"""
    url = reverse('requisitionitems-detail', kwargs={
        'requisition_pk': requisition.id,
        'pk': requisition_item.id
    })
    
    payload = {
        'quantity_approved': 5
    }
    response = authenticated_client.patch(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_200_OK
    
    requisition_item.refresh_from_db()
    assert requisition_item.quantity_approved == 5


@pytest.mark.django_db
def test_update_requisitionitem_invalid_quantity_approved(authenticated_client, user, department, item, supplier, requisition, requisition_item):
    """Test updating requisition item with invalid quantity_approved values"""
    url = reverse('requisitionitems-detail', kwargs={
        'requisition_pk': requisition.id,
        'pk': requisition_item.id
    })
    
    # Test negative quantity
    payload = {
        'quantity_approved': -1
    }
    response = authenticated_client.patch(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'Quantity approved must be greater than 0' in str(response.content)
    
    # Test zero quantity
    payload = {
        'quantity_approved': 0
    }
    response = authenticated_client.patch(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'Quantity approved must be greater than 0' in str(response.content)
    
    # Verify original value wasn't changed
    requisition_item.refresh_from_db()
    assert requisition_item.quantity_approved == 0


@pytest.mark.django_db
def test_update_requisitionitem_quantity_approved_unauthorized(client, user, department, item, supplier, requisition, requisition_item):
    """Test updating requisition item quantity_approved fails for unauthorized users"""
    url = reverse('requisitionitems-detail', kwargs={
        'requisition_pk': requisition.id,
        'pk': requisition_item.id
    })
    
    payload = {
        'quantity_approved': 5
    }
    response = client.patch(url, data=payload, content_type='application/json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    # Verify original value wasn't changed
    requisition_item.refresh_from_db()
    assert requisition_item.quantity_approved == 0


# ============================================================================
# Requisition Listing and Filtering Tests
# ============================================================================

@pytest.mark.django_db
def test_list_requisitions_with_filters(authenticated_client, user, department, item, supplier, requisition, requisition_item):
    inventory = Inventory.objects.create(
        item=item,
        purchase_price=100.00,
        sale_price=150.00,
        quantity_at_hand=50
    )
    
    if not hasattr(requisition, 'items'):
        RequisitionItem.objects.create(
            requisition=requisition,
            item=item,
            quantity_requested=10,
            preferred_supplier=supplier
        )
    
    requisition.department_approved = True
    requisition.save()
    
    url = reverse('requisition-list')
    
    response = authenticated_client.get(f"{url}?department_approved=true")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    
    first_requisition = response.data[0]
    assert first_requisition['department_approved'] == True
    assert first_requisition['total_items_requested'] == 1
    assert float(first_requisition['total_amount']) == 1000.00  # 10 items * 100.00 price
    
    # Test filtering by department
    response = authenticated_client.get(f"{url}?department={department.id}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) > 0
    assert response.data[0]['department'] == department.name


@pytest.mark.django_db
def test_requisition_total_calculations(authenticated_client, user, department, item, supplier, requisition):
    inventory = Inventory.objects.create(
        item=item,
        purchase_price=100.00,
        sale_price=150.00,
        quantity_at_hand=50
    )
    
    # Create multiple items to test total calculations
    RequisitionItem.objects.create(
        requisition=requisition,
        item=item,
        quantity_requested=5,
        preferred_supplier=supplier
    )
    RequisitionItem.objects.create(
        requisition=requisition,
        item=item,
        quantity_requested=3,
        preferred_supplier=supplier
    )
    
    url = reverse('requisition-list')
    response = authenticated_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    
    requisition_data = response.data[0]
    assert requisition_data['total_items_requested'] == 1  # Because both items are the same item
    
    # Check total amount (should be quantity * purchase price)
    expected_amount = (5 + 3) * 100.00  # total quantity * purchase price
    assert float(requisition_data['total_amount']) == expected_amount
