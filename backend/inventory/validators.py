
from rest_framework.exceptions import ValidationError
from .models import RequisitionItem, Supplier

def validate_quantity_requested(value):
    """
    Ensure that the quantity requested is greater than 0.
    """
    if value <= 0:
        raise ValidationError("The quantity requested must be greater than 0.")
    return value

def validate_requisition_item_uniqueness(requisition_id, item, preferred_supplier, quantity_requested):
    """
    Ensure requisition item uniqueness or flag quantity update if it exists.
    """
    existing_item = RequisitionItem.objects.filter(
        requisition_id=requisition_id,
        item=item,
        preferred_supplier=preferred_supplier
    ).first()

    if existing_item:
        previous_quantity = existing_item.quantity_requested
        new_quantity = previous_quantity + quantity_requested
        raise ValidationError({
            "non_field_errors": [
                f"The item '{item.name}' with supplier '{preferred_supplier.official_name}' "
                f"already exists. Quantity updated from {previous_quantity} to {new_quantity}."
            ]
        })

def assign_default_supplier(attrs):
    """
    Assign a default supplier if none is provided.
    """
    if not attrs.get('preferred_supplier'):
        default_supplier = Supplier.objects.first()
        if not default_supplier:
            raise ValidationError("No supplier is available. Please add a supplier first.")
        attrs['preferred_supplier'] = default_supplier