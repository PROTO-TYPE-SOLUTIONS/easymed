from django.db.models.signals import post_save
from django.dispatch import receiver
# models
from .models import (
    EquipmentTestRequest,
    LabTestRequest,
    LabEquipment
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
    if(equipment.data_format == "hl7"):
        data = json_to_hl7(instance)
        if equipment.category == "rs32":
            send_through_rs232(data=data)
            
        if equipment.category == 'tcp':
            send_through_tcp(data=data)

        