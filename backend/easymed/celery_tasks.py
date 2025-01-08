# import os
import logging
# import tempfile
from celery import shared_task, chain
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from weasyprint import HTML
from django.apps import apps
from django.conf import settings
from decouple import config
from django.template.loader import get_template
from django.core.mail import EmailMultiAlternatives
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
    InventoryArchive,
)
from billing.models import Invoice
from patient.models import AttendanceProcess
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
def inventory_garbage_collection():
    """
    Archives inventory records with zero quantity and removes them from the active inventory.
    This helps maintain database efficiency while preserving historical data.
    """
    logger.info("Starting inventory garbage collection")
    
    try:
        try:
            current_archive_count = InventoryArchive.objects.count()
            logger.info(f"Current archive count before task: {current_archive_count}")
        except Exception as e:
            logger.error(f"Error accessing InventoryArchive table: {str(e)}")
            raise
        
        with transaction.atomic():
            # Find records with zero quantity
            zero_quantity_items = list(Inventory.objects.filter(quantity_at_hand=0))
            count = len(zero_quantity_items)
            
            logger.info(f"Found {count} items with zero quantity")
            
            if count == 0:
                logger.info("No zero-quantity items found to archive")
                return "No items to archive"
            
            # Log the items that will be archived
            for item in zero_quantity_items:
                logger.info(f"Preparing to archive: Item={item.item.name}, Lot={item.lot_number}")
            
            # Create archive records
            archive_objects = []
            for item in zero_quantity_items:
                archive = InventoryArchive(
                    item=item.item,
                    purchase_price=item.purchase_price,
                    sale_price=item.sale_price,
                    quantity_at_hand=item.quantity_at_hand,
                    re_order_level=item.re_order_level,
                    date_created=item.date_created,  # Original creation date
                    category_one=item.category_one,
                    lot_number=item.lot_number,
                    expiry_date=item.expiry_date,
                )
                try:
                    # Try to save each archive individually to catch any validation errors
                    archive.save()
                    archive_objects.append(archive)
                except Exception as e:
                    raise Exception(f"Error archiving item {item.item.name}: {str(e)}")
            
            # Verify archives were created
            if len(archive_objects) != count:
                raise Exception(f"Expected to create {count} archives but only created {len(archive_objects)}")
            
            # Delete the zero quantity records
            for item in zero_quantity_items:
                try:
                    item.delete()
                    logger.info(f"Deleted item {item.item.name} with lot {item.lot_number}")
                except Exception as e:
                    logger.error(f"Error deleting item {item.item.name}: {str(e)}")
                    raise
            
            # Verify final archive count
            final_archive_count = InventoryArchive.objects.count()
            logger.info(f"Final archive count after task: {final_archive_count}")
            if final_archive_count != current_archive_count + count:
                raise Exception(f"Archive count mismatch. Expected {current_archive_count + count} but got {final_archive_count}")
            
            logger.info(f"Successfully archived and deleted {count} zero-quantity items")
            return f"{count} items archived and deleted"
            
    except Exception as e:
        logger.error(f"Error during inventory garbage collection: {str(e)}")
        logger.exception("Full traceback:")
        raise
