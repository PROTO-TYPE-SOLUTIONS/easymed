from django.db import models
from inventory.models import Sale_Order
from patient.models import Patient
from django.conf import settings
from customusers.models import CustomUser

class LabReagent(models.Model):
    name = models.CharField(max_length=255)
    # item = models.ForeignKey('Item', on_delete=models.CASCADE)
    cas_number = models.CharField(max_length=255)
    molecular_weight = models.DecimalField(max_digits=10, decimal_places=2)
    purity = models.DecimalField(max_digits=10, decimal_places=2)
    sale_id =  models.ForeignKey(Sale_Order, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.name
    

class PatientIdentifier(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    lab_number = models.CharField(max_length=45)

    def __str__(self):
        return f"Patient Identifier #{self.idpatient_identifier}"    

class LabResult(models.Model):
    patient_identifier = models.ForeignKey(PatientIdentifier, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    test_element =  models.CharField(max_length=45)
    value = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)
    lab_test = models.ForeignKey('LabTest', on_delete=models.CASCADE)

    def __str__(self):
        return f"LabResult {self.id}: {self.title} - {self.patient_name}"
    
class LabTest(models.Model):
    patient_identifier = models.ForeignKey(PatientIdentifier, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    test_element = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        editable=False
    )
    cost = models.CharField(max_length=45)
    sale_id = models.ForeignKey(Sale_Order, on_delete=models.CASCADE)

    def __str__(self):
        return f"LabResult {self.id}: {self.title} - {self.patient_name}" 

class LabTestCategory(models.Model):
    category = models.CharField(max_length=45)

    def __str__(self):
        return f"LabResult {self.id}: {self.title} - {self.patient_name}"          