from django.db.models.signals import post_save
from django.dispatch import receiver
from makeeasyhmis.celery_tasks import generate_labtestresult_pdf
# models
from .models import (
    EquipmentTestRequest,
    LabTestRequest,
    LabEquipment,
    LabTestResult,
)
# utils
from .utils import (
    send_through_rs232,
    send_through_tcp,
    create_hl7_message,
    create_astm_message,
    send_to_network_folder,

)


@receiver(post_save, sender=EquipmentTestRequest)
def send_to_equipment(sender, instance, created, **kwargs):
    if created:  # Only proceed if the instance is newly created
        test_request = instance.test_request
        equipment = instance.equipment
        print("Send to equipment signal firing")
        print("Equipment Is:", equipment, test_request, equipment.data_format)

        if equipment.data_format == "hl7":
            data = create_hl7_message(test_request)
            print("Data is HL7")
            if equipment.category == "rs232":
                send_through_rs232(data=data)
                print("Data is: " + data)
            elif equipment.category == 'tcp':
                send_through_tcp(data=data)
                print("Data is: " + data)

        elif equipment.data_format == "astm":
            data = create_astm_message(test_request)
            print("Data is ASTM")
            if equipment.category == "rs232":
                send_through_rs232(data=data)
                print("Data is: " + data)
            elif equipment.category == 'tcp':
                send_through_tcp(data=data)
                print("Data is: " + data)

        else:
            print("Data not HL7")




'''signal to fire up celery task to  to generated pdf once LabTestResult table gets a new entry'''
@receiver(post_save, sender=LabTestResult)
def generate_labtestresult(sender, instance, created, **kwargs):
    if created:
        generate_labtestresult_pdf.delay(instance.pk)


'''
This will capture test request and send to HumaStar 100 Computer
HumaStar 100 uses network shared files
'''
@receiver(post_save, sender=EquipmentTestRequest)
def send_to_networked_equipment(sender, instance, created, **kwargs):
    if created:  # Only proceed if the instance is newly created
        test_request = instance.test_request
        equipment = instance.equipment
        print("Send to equipment signal firing")
        print("Equipment Is:", equipment, test_request, equipment.data_format, equipment.category)

        if equipment.data_format == "astm" and equipment.category == 'netshare':
            data = create_astm_message(test_request)
            print("Everything looks good, proceeding to send to equipment...")

            
            send_to_network_folder(data=data)
            print("Data is: " + data)

        elif equipment.category != 'netshare':
                print("Equipment not Network shared")

        elif equipment.data_format != 'astm':
                print("Data not AST format")      