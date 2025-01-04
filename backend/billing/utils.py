from easymed.celery_tasks import update_stock_quantity_if_stock_is_available
from inventory.models import Inventory
from patient.models import AttendanceProcess, PrescribedDrug
from laboratory.models import LabTestRequest, LabTestRequestPanel


def update_service_billed_status(instance):
    '''
    When an InvoiceItem is saved, and the status field is changed to billed,
    we check if it's a Drug or a Lab Test. If it is, we update the is_billed
    field of the related PrescribedDrug or LabTestRequestPanel
    '''
    # TODO: Also update Consulation
    if instance.status == 'billed' and instance.item.category == 'Drug':
        try:
            # Get the related Prescription through the invoice's attendance process
            prescription = instance.invoice.attendanceprocess.prescription
            prescribed_drug = PrescribedDrug.objects.filter(
                prescription=prescription,  # Use the retrieved prescription object
                item=instance.item
            ).first()

            if prescribed_drug:
                prescribed_drug.is_billed = True
                prescribed_drug.save()
        except AttendanceProcess.DoesNotExist:
            # Handle the case where the InvoiceItem is not associated with an AttendanceProcess
            pass
            
    if instance.status== 'billed' and instance.item.category == 'Lab Test':
        try:
            process_test_request = instance.invoice.attendanceprocess.process_test_req
            lab_test_panel = LabTestRequestPanel.objects.filter(
                test_panel__item=instance.item,
                lab_test_request__process=process_test_request
            ).first()

            if lab_test_panel:
                lab_test_panel.is_billed = True
                lab_test_panel.save()
        except LabTestRequest.DoesNotExist:
            # Handle the case where the InvoiceItem is not associated with an LabTestRequest
            pass  


def get_available_stock(instance):
    '''
    Function to get the available inventory stock for passed instance 
    '''
    inventory_item = Inventory.objects.get(item=instance.item)
    return inventory_item.quantity_at_hand


def check_quantity_availability(instance):
    '''
    Function to check if there is enough quantity available for the item before billing.
    Returns True if sufficient quantity is available, otherwise False.
    Finaly, updates Inventory stock
    '''
    if instance.item.category == 'Drug' or instance.item.category == 'Lab Test':
        # For drugs, check the available stock
        stock_quantity = get_available_stock(instance)
        #check the prescribed drug quantity
        prescription = instance.invoice.attendanceprocess.prescription
        prescribed_drug = PrescribedDrug.objects.get(
                prescription=prescription,  # Use the retrieved prescription object
                item=instance.item
            )
        if prescribed_drug.quantity > stock_quantity:
            return False  # Insufficient stock
        else:
            update_stock_quantity_if_stock_is_available(instance, prescribed_drug.quantity)
            return True
    
    if instance.item.category == 'Lab Test':
        # Check Quantity available for instance drug
        stock_quantity = get_available_stock(instance)
        if stock_quantity < 1:
            return False
        else:
            update_stock_quantity_if_stock_is_available(instance, 1)
            return True

    return True
