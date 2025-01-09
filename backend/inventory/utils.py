from .models import PurchaseOrder


def update_purchase_order_status(purchase_order):
    '''
    Determine the status based on the aggregate state:
        - If all items are fully received, set the status to COMPLETED.
        - If none are received, set the status to PENDING.
        - Otherwise, set the status to PARTIAL.
    '''
    items = purchase_order.po_items.all()
    
    all_completed = True
    none_received = True
    
    for item in items:
        if item.quantity_received < item.quantity_ordered:
            all_completed = False
        if item.quantity_received > 0:
            none_received = False
    
    if all_completed:
        purchase_order.status = PurchaseOrder.Status.COMPLETED
        print(f"All items received; status set to COMPLETED.")
    elif none_received:
        purchase_order.status = PurchaseOrder.Status.PENDING
        print(f"No items received; status set to PENDING.")
    else:
        purchase_order.status = PurchaseOrder.Status.PARTIAL
        print(f"Some items received; status set to PARTIAL.")
    
    purchase_order.save()

    print(f'Status set to {purchase_order.status}')