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
    json_to_hl7,
    send_through_rs232,
    send_through_tcp
)


@receiver(post_save, sender=EquipmentTestRequest)
def send_to_equipment(sender: EquipmentTestRequest, instance: EquipmentTestRequest, created: bool, **kwargs):
    if not created:
        return
    test_request: LabTestRequest = instance.test_request
    equipment: LabEquipment = instance.equipment
    print("send to equipment signal firing")
    if(equipment.data_format == "hl7"):
        data = json_to_hl7(test_request)
        if equipment.category == "rs32":
            send_through_rs232(data=data)
            print("Data is:" + data) 
            
        if equipment.category == 'tcp':
            send_through_tcp(data=data)
            print("Data is:" + data) 



'''signal to fire up celery task to  to generated pdf once LabTestResult tale gets a new entry'''
@receiver(post_save, sender=LabTestResult)
def generate_labtestresult(sender, instance, created, **kwargs):
    if created:
        generate_labtestresult_pdf.delay(instance.pk)

        