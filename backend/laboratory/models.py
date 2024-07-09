from django.db import models
from random import randrange, choices
# from patient.models import AttendanceProcess
from django.conf import settings
from customuser.models import CustomUser
from inventory.models import Item
from datetime import datetime
from django.core.validators import FileExtensionValidator
import logging


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
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class Specimen(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class LabTestPanel(models.Model):
    name = models.CharField(max_length=255)
    specimen = models.ForeignKey(Specimen, on_delete=models.CASCADE, null=True, blank=True)
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE)
    unit = models.CharField(max_length=255)
    ref_value_low = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    ref_value_high = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    is_qualitative = models.BooleanField(default=False)
    is_quantitative = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.ref_value_low} - {self.ref_value_high} - {self.specimen.name} - {self.unit} - { self.test_profile.name }"


class ProcessTestRequest(models.Model):
    reference = models.CharField(max_length=40) # track_number of AttendanceProcess is stored here

    def __str__(self):
        return self.reference

class LabTestRequest(models.Model):
    process = models.ForeignKey(ProcessTestRequest, on_delete=models.CASCADE, null=True, blank=True) # from patient app
    test_profile = models.ForeignKey(LabTestProfile, on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField(null=True)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    requested_on = models.TimeField(auto_now_add=True, null=True, blank=True)
    has_result = models.BooleanField(default=False)
    created_on= models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.id)


class PatientSample(models.Model):
    specimen = models.ForeignKey(Specimen, on_delete=models.CASCADE)
    lab_test_request = models.ForeignKey(LabTestRequest, null=True, on_delete=models.CASCADE)
    patient_sample_code = models.CharField(max_length=100)
    process = models.ForeignKey(ProcessTestRequest, on_delete=models.CASCADE, null=True, blank=True) # from patient app
    is_sample_collected = models.BooleanField(default=False)

    def generate_sample_code(self):
        while True:
            random_number = "".join([str(randrange(0, 9)) for _ in range(4)])
            sp_id = f"SC-{random_number}"
            # Check if the generated sample code already exists in PatientSample
            if not PatientSample.objects.filter(patient_sample_code=sp_id).exists():
                break
        return sp_id

    def save(self, *args, **kwargs):
        if not self.patient_sample_code:
            self.patient_sample_code = self.generate_sample_code()
        
        # Check if the lab_test_request has a process and assign it to the patient sample
        if self.lab_test_request and self.lab_test_request.process:
            self.process = self.lab_test_request.process    

        super().save(*args, **kwargs)

    def __str__(self):
        return str(f"{self.patient_sample_code} - {self.specimen.name} - {self.process}")


class LabTestRequestPanel(models.Model):
    patient_sample = models.ForeignKey(PatientSample, null=True, on_delete=models.CASCADE)
    result = models.CharField(max_length=45, null=True)  # actual result
    test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET("Deleted Panel"))
    lab_test_request = models.ForeignKey(LabTestRequest, on_delete=models.CASCADE)
    test_code = models.CharField(max_length=100, null=True)
    category = models.CharField(max_length=30, default="none")
    result_approved=models.BooleanField(default=False)
    approved_on = models.DateTimeField(null=True, blank=True) 

    def generate_test_code(self):
        while True:
            random_number = ''.join(choices('0123456789', k=4))
            test_id = f"TC-{random_number}"
            if not LabTestRequestPanel.objects.filter(test_code=test_id).exists():
                return test_id
    ''''
    Find or Create PatientSample:
    Attempt to find a PatientSample that matches the current lab_test_request and specimen.
    If no matching PatientSample is found, create a new one.
    Assign this PatientSample to the patient_sample field of the LabTestRequestPanel.
    Set Category: Determine the category (qualitative or quantitative) based on the LabTestPanel's boolean fields.
    Save the Model: Call the superclass's save method to ensure the object is saved to the database.
    '''
    def save(self, *args, **kwargs):
        if not self.test_code:
            self.test_code = self.generate_test_code()

        # Find or create a PatientSample for the current lab_test_request and specimen
        try:
            # Check if a matching PatientSample exists
            matching_sample = PatientSample.objects.get(
                process=self.lab_test_request.process, 
                specimen=self.test_panel.specimen
            )
        except PatientSample.DoesNotExist:
            # If not, create a new PatientSample
            matching_sample = PatientSample.objects.create(
                lab_test_request=self.lab_test_request,
                specimen=self.test_panel.specimen,
                # patient_sample_code=self.generate_sample_code()
            )
        self.patient_sample = matching_sample

        # Set the category based on the related LabTestPanel
        if self.test_panel.is_qualitative:
            self.category = 'qualitative'
        elif self.test_panel.is_quantitative:
            self.category = 'quantitative'
        else:
            self.category = 'none'

        # Check if result_approved is being set to True and set approved_on
        if self.result_approved and not self.approved_on:
            self.approved_on = datetime.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.test_panel.name

class EquipmentTestRequest(models.Model):
    test_request_panel = models.ForeignKey(LabTestRequestPanel, on_delete=models.CASCADE)
    equipment = models.ForeignKey(LabEquipment, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.equipment.name + " " + self.equipment.ip_address + " " + self.equipment.port)
    
    
# class LabTestResult(models.Model):
#     lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
#     title = models.CharField(max_length=45)
#     date_created = models.DateField(auto_now_add=True)
#     recorded_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name="recorded_by")
#     note = models.CharField(max_length=255, null=True, blank=True)
#     approved = models.BooleanField(default=False)

#     def __str__(self):
#         return self.title

# class ResultsVerification(models.Model):
#     lab_results = models.OneToOneField(LabTestResult, on_delete=models.CASCADE)
#     lab_test_request = models.OneToOneField(LabTestRequest, on_delete=models.CASCADE)
#     is_approved = models.BooleanField(default=False)
#     approved_by = models.ForeignKey(CustomUser, blank=True, on_delete=models.CASCADE)


# class LabTestResultPanel(models.Model):
#     lab_test_result= models.ForeignKey(LabTestResult, on_delete=models.CASCADE)
#     test_panel = models.ForeignKey(LabTestPanel, on_delete=models.SET_NULL, null=True, blank=True )
#     result = models.CharField(max_length=45)
#     difference = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

#     def __str__(self):
#         return f"{self.test_panel.name} - {self.test_panel.ref_value_low}"

#     def save(self, *args, **kwargs):
#         if self.test_panel and self.result:
#             try:
#                 ref_value_low = float(self.test_panel.ref_value_low)
#                 ref_value_high = float(self.test_panel.ref_value_high)
#                 result_value = float(self.result)
#                 if result_value < ref_value_low:
#                     self.difference = -round(ref_value_low - result_value, 2)
#                 elif result_value > ref_value_high:
#                     self.difference = round(result_value - ref_value_high, 2)
#             except ValueError:
#                 pass 
#         super().save(*args, **kwargs)


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

    def __str__(self):
        return f"PublicTestRequest #{self.patient.first_name} - {self.test_profile}"
    
    @property
    def age(self):
        if self.patient.date_of_birth:
            patient_age:int = (datetime.now().year - self.patient.date_of_birth.year)
            return patient_age
        return None
