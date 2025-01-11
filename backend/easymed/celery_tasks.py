# import os
import logging
# import tempfile
from celery import shared_task, chain
from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.template.loader import render_to_string
# from weasyprint import HTML
# from django.apps import apps
from django.conf import settings
from decouple import config
from django.template.loader import get_template
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F
from django.core.exceptions import ObjectDoesNotExist, ValidationError


from inventory.models import (
    Inventory,
    PurchaseOrder,
    PurchaseOrderItem,
    Requisition,
    RequisitionItem,
)
from authperms.models import Group


logger = logging.getLogger(__name__)


# Helper function to get inventory safely
def get_inventory_or_error(item):
    try:
        return Inventory.objects.get(item=item)
    except Inventory.DoesNotExist:
        raise ValidationError(f"No inventory record found for item: {item.name}.")


# Deduct stock from inventory
def update_stock_quantity_if_stock_is_available(instance, deductions):
    """
    Deducts stock quantity based on the billed quantity and validates stock levels.
    Prioritizes inventory records with the nearest expiry date.
    """
    try:
        # Get inventory records for the item, ordered by expiry date (nearest first)
        inventory_records = Inventory.objects.filter(item=instance.item).order_by('expiry_date')

        if not inventory_records.exists():
            raise ValidationError(f"No inventory record found for item: {instance.item.name}.")

        remaining_deduction = deductions


        with transaction.atomic():
            # Iterate through the inventory records.
            # Deduct from the current record until the required quantity is fulfilled.
            # If a record’s quantity_at_hand is insufficient, it is set to 0, and the deduction continues with the next record.
            for inventory_record in inventory_records:
                if remaining_deduction <= 0:
                    break

                if inventory_record.quantity_at_hand >= remaining_deduction:
                    # Deduct from the current record
                    inventory_record.quantity_at_hand -= remaining_deduction
                    inventory_record.save()
                    logger.info(
                        "Stock updated successfully for item: %s, Lot: %s, Remaining: %d",
                        instance.item.name,
                        inventory_record.lot_number,
                        inventory_record.quantity_at_hand,
                    )
                    remaining_deduction = 0
                else:
                    # Use up the current record's stock and move to the next
                    remaining_deduction -= inventory_record.quantity_at_hand
                    inventory_record.quantity_at_hand = 0
                    inventory_record.save()
                    logger.info(
                        "Stock exhausted for item: %s, Lot: %s",
                        instance.item.name,
                        inventory_record.lot_number,
                    )

            if remaining_deduction > 0:
                raise ValidationError(f"Not enough stock available for {instance.item.name}.")

    except ValidationError as e:
        logger.error("Stock update failed: %s", e)
        raise
    except Exception as e:
        logger.exception("Unexpected error during stock update: %s", e)
        raise


@shared_task
def check_inventory_reorder_levels():
    """
    Periodically checks all inventory items for reorder levels and sends notifications if needed.
    """
    items = Inventory.objects.filter(quantity_at_hand__lte=F('re_order_level'))
    if not items.exists():
        print("No items found below reorder levels.")
        return

    groups_with_notification_permission = Group.objects.filter(
        permissions__name='CAN_RECEIVE_INVENTORY_NOTIFICATIONS'
    )
    if not groups_with_notification_permission.exists():
        print("No groups found with the required notification permission.")
        return

    User = get_user_model()
    users_to_notify = User.objects.filter(group__in=groups_with_notification_permission).distinct()
    if not users_to_notify.exists():
        print("No users found in groups with notification permissions.")
        return
    user_emails = list(users_to_notify.values_list('email', flat=True))

    channel_layer = get_channel_layer()
    for item in items:
        message = f"Low stock alert for {item.item.name}: Only {item.quantity_at_hand} items left."
        try:
            async_to_sync(channel_layer.group_send)(
                "inventory_notifications",
                {
                    "type": "send_notification",
                    "message": message,
                }
            )
        except Exception as ws_error:
            raise Exception(
                f"Failed to send WebSocket notification for {item.item.name}: {ws_error}"
            )

        try:
            send_mail(
                subject="Inventory Notification",
                message=message,
                from_email=settings.EMAIL_HOST_USER, 
                recipient_list=user_emails,
            )
        except Exception as email_error:
            print(f"Error sending email for {item.item.name}: {email_error}")


@shared_task
def create_purchase_order_task(requisition_id):
    """
    Task to create a Purchase Order and generate a PDF.
    """
    try:
        # Retrieve the requisition
        requisition = Requisition.objects.get(id=requisition_id)
        requisition_items = RequisitionItem.objects.filter(requisition=requisition)
        
        # Create a new purchase order linked to the requisition
        purchase_order = PurchaseOrder.objects.create(
            requested_by=requisition.requested_by,
            requisition=requisition,
            status='PENDING'
        )
        for item in requisition_items:
            PurchaseOrderItem.objects.create(
                item=item.item,
                quantity_purchased=item.quantity_requested,
                supplier=item.supplier,
                purchase_order=purchase_order
            )
        

        # # Generate PDF for the purchase order
        # generate_purchase_order_pdf(purchase_order.id)  # Call the PDF generation function with the purchase_order
    except Requisition.DoesNotExist:
        print(f"Requisition with id {requisition_id} does not exist.")
       
        
    except Requisition.DoesNotExist:
        # Handle the case where the requisition does not exist
        raise ValueError(f"Requisition with ID {requisition_id} does not exist.")
    except Exception as e:
        # Handle other exceptions that may arise
        raise ValueError(f"An error occurred while creating the purchase order: {str(e)}")
