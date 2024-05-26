from django.db import models
# from patient.models import AttendanceProcess
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
        ("netshare", "NETSHARE"),
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
    CATEGORY_CHOICE = (
        ("quantitative", "  QUANTITATIVE"),
        ("qualitative", "QUALITATIVE"),
    )
    name = models.CharField(max_length=255)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    category = models.CharField(max_length=20, default="quantitative", choices=CATEGORY_CHOICE,)

    def __str__(self):
        return self.name

class Specimen(models.Model):
    name = models.CharField(max_length=255)


class LabTestPanel(models.Model):
    name = models.CharField(max_length=255)
    specimen = models.ForeignKey(Specimen, on_delete=models.CASCADE)
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE)
    unit = models.CharField(max_length=255)
    ref_value_low = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ref_value_high = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.ref_value_low} - {self.ref_value_high} - {self.unit}"


class ProcessTestRequest(models.Model):
    reference = models.CharField(max_length=40)

class LabTestRequest(models.Model):
    process = models.ForeignKey(ProcessTestRequest, on_delete=models.CASCADE)
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField(null=True)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    sample_collected = models.BooleanField(default=False, null=True)
    sample = models.CharField(max_length=100, null=True)
    requested_on = models.TimeField(auto_now_add=True, null=True, blank=True)
    has_result = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)
    
class LabTestRequestPanel(models.Model):
    test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET("Deleted Panel"))
    lab_test_request = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.test_panel.name

class EquipmentTestRequest(models.Model):
    test_request = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    equipment = models.ForeignKey(LabEquipment, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.equipment.name + " " + self.equipment.ip_address + " " + self.equipment.port)
    
    
class LabTestResult(models.Model):
    CATEGORY_CHOICE = (
        ("quantitative", "  QUANTITATIVE"),
        ("qualitative", "QUALITATIVE"),
    )
    lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)
    recorded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name="recorded_by")
    note = models.CharField(max_length=255, null=True, blank=True)
    category = models.CharField(max_length=20, default="quantitative", choices=CATEGORY_CHOICE,)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class ResultsVerification(models.Model):
    lab_results = models.OneToOneField(LabTestResult, on_delete=models.CASCADE)
    lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
    approved_by = models.ForeignKey(CustomUser, blank=True, on_delete=models.CASCADE)


class LabTestResultPanel(models.Model):
    lab_test_result= models.ForeignKey(LabTestResult, on_delete=models.CASCADE)
    test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET_NULL, null=True, blank=True )
    result = models.CharField(max_length=45)
    difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.test_panel.name} - {self.test_panel.ref_value_low}"

    def save(self, *args, **kwargs):
        if self.test_panel and self.result:
            try:
                ref_value_low = float(self.test_panel.ref_value_low)
                ref_value_high = float(self.test_panel.ref_value_high)
                result_value = float(self.result)
                if result_value < ref_value_low:
                    self.difference = -round(ref_value_low - result_value, 2)
                elif result_value > ref_value_high:
                    self.difference = round(result_value - ref_value_high, 2)
            except ValueError:
                pass 
        super().save(*args, **kwargs)


class PublicLabTestRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    # patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    status = models.CharField( max_length=10, choices=STATUS_CHOICES, default='pending')
    date_created = models.DateField(auto_now_add=True)
    date_changed = models.DateField(auto_now=True)
    lab_request = models.FileField(
        upload_to="Lab Test Requests/public-requests",
        max_length=254,
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'img', 'png', 'jpg'])]
    )
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.PROTECT)
    sample_collected = models.BooleanField(default=False,null=True, blank=True)
    sample_id = models.CharField(max_length=100, null=True, blank=True)

    # def __str__(self):
    #     return f"PublicTestRequest #{self.patient.first_name} - {self.test_profile}"
    
    # @property
    # def age(self):
    #     if self.patient.date_of_birth:
    #         patient_age:int = (datetime.now().year - self.patient.date_of_birth.year)
    #         return patient_age
    #     return None
    


class LabTestResultQualitative(models.Model):
    lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
    title = models.CharField(max_length=45)
    date_created = models.DateField(auto_now_add=True)
    recorded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    approved = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class LabTestResultPanelQualitative(models.Model):
    lab_test_result= models.ForeignKey(LabTestResultQualitative, on_delete=models.CASCADE)
    test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET_NULL, null=True, blank=True )
    result = models.CharField(max_length=45)

    
    def __str__(self):
        return f"{self.test_panel.name}"

class QualitativeResultsVerification(models.Model):
    lab_results = models.OneToOneField(LabTestResultQualitative, on_delete=models.CASCADE)
    lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
    approved_by = models.ForeignKey(CustomUser, blank=True, on_delete=models.CASCADE)

class PatientSample(models.Model):
    specimen_name = models.CharField(max_length=40)
    sample_code = models.CharField(max_length=100)
    process_test_request = models.ForeignKey(ProcessTestRequest, on_delete=models.CASCADE)
    

