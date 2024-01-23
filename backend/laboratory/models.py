from django.db import models
from patient.models import Patient
from django.conf import settings
from customuser.models import CustomUser
from inventory.models import Item
from datetime import datetime
from django.core.validators import FileExtensionValidator


class LabEquipment(models.Model):
    CATEGORY_CHOICE = (
        ("none", "None"),
        ("rs232", "RS232"),
        ("tcp", "TCP"),
    )
    FORMAT_CHOICE = (
        ("hl7", "HL7"),
        ("astm", "ASTM"),
    )
    name = models.CharField(max_length=250)
    category = models.CharField(max_length=10, default="none", choices=CATEGORY_CHOICE,)
    ip_address = models.GenericIPAddressField(null=True) 
    port = models.CharField(max_length=20, null=True)
    data_format = models.CharField(max_length=10, choices=FORMAT_CHOICE, default="hl7")

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
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return self.name    

# i.e Sodium, Calcium,     
class LabTestPanel(models.Model):
    name = models.CharField(max_length=255)
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE)
    unit = models.CharField(max_length=255)

    def __str__(self):
        return self.name        


class LabTestRequest(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField()
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    sample_collected = models.BooleanField(default=False, null=True)
    sample = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return str(self.id)


class EquipmentTestRequest(models.Model):
    test_request = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    equipment = models.ForeignKey(LabEquipment, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.equipment.name + " " + self.test_request.test_profile_ID.name + " " + self.equipment.ip_address + " " + self.equipment.port)


class LabTestResult(models.Model):
    lab_test_request = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title  

class LabTestResultItem (models.Model):
    result_report= models.ForeignKey(LabTestResult, on_delete=models.CASCADE)
    test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET_NULL, null=True, blank=True )
    result = models.CharField(max_length=45)
    ref_value = models.CharField(max_length=45)

class LabTestCategory(models.Model):
    category = models.CharField(max_length=45)

    def __str__(self):
        return self.category 
    

class PublicLabTestRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,)
    appointment_date = models.DateField()
    status = models.CharField( max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300, null=True, blank=True)
    date_created = models.DateField(auto_now_add=True)
    date_changed = models.DateField(auto_now=True)
    lab_request = models.FileField(
        upload_to="Lab Test Requests",
        max_length=254,
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'img', 'png'])]
    )
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.PROTECT)
    sample_collected = models.BooleanField(default=False,null=True, blank=True)
    sample = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"PublicTestRequest #{self.first_name} - {self.test_profile}"
    
    @property
    def age(self):
        if self.date_of_birth:
            patient_age:int = (datetime.now().year - self.date_of_birth.year)
            return patient_age
        return None