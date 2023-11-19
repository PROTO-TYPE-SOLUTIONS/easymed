from django.db import models
from patient.models import Patient
from django.conf import settings
from customuser.models import CustomUser
from inventory.models import Item, OrderBill


class LabEquipment(models.Model):
    CATEGORY_CHOICE = (
        ("none", "None"),
        ("rss32", "RS232"),
        ("tcp", "TCP"),
    )
    name = models.CharField(max_length=250)
    category = models.CharField(max_length=10, default="none", choices=CATEGORY_CHOICE,)
    ip_address = models.GenericIPAddressField(null=True) 

    def __str__(self):
        return self.name

class LabReagent(models.Model):
    name = models.CharField(max_length=255)
    cas_number = models.CharField(max_length=255)
    molecular_weight = models.DecimalField(max_digits=10, decimal_places=2)
    purity = models.DecimalField(max_digits=10, decimal_places=2)
    item_number = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class LabTestProfile(models.Model):
    name = models.CharField(max_length=255)
    cost = models.CharField(max_length=255)
    item_ID = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.name    
    
class LabTestPanel(models.Model):
    name = models.CharField(max_length=255)
    test_profile_ID = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE)

    def __str__(self):
        return self.name        


# class LabEquipment(models.Model):
#     name = models.TextField()
#     ip_address = models. GenericIPAddressField()
#     port = models.IntegerField()

class LabTestRequest(models.Model):
    patient_ID = models.ForeignKey(Patient, on_delete=models.CASCADE)
    test_profile_ID = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE)
    note = models.TextField()
    order_bill = models.ForeignKey(OrderBill, on_delete=models.CASCADE, null=True, blank=True)
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    equipment = models.ForeignKey(LabEquipment, on_delete=models.PROTECT, null=True, blank=True)
    sample = models.BooleanField(null=True)

    def __str__(self):
        return str(self.test_profile_ID.name)

class EquipmentTestRequest():
    pass

class LabTestResult(models.Model):
    lab_test_request_ID = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    test_element =  models.CharField(max_length=45)
    value = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title  

class LabTestCategory(models.Model):
    category = models.CharField(max_length=45)

    def __str__(self):
        return self.category 