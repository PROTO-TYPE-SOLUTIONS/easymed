from django.db import models
from customusers.models import CustomUser
from pharmacy.models import Drug

class InsuranceCompany(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    
class ContactDetails(models.Model):
    tel_no = models.IntegerField()
    email_address = models.EmailField()
    residence = models.CharField(max_length=30)

class Patient(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    insurance = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)

    def __str__(self):
        return self.first_name


class NextOfKin(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    firts_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    relationship = models.CharField(max_length=40)
    contacts = models.ForeignKey(ContactDetails, on_delete=models.CASCADE)


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )

    appointment_date_time = models.DateTimeField()
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE)
    assigned_doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)
    # changed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Appointment #{self.pk}"

class Prescription(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.CharField(max_length=45)
    start_date = models.CharField(max_length=45)
    created_by = models.CharField(max_length=45)
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('dispensed', 'Dispensed'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Prescription #{self.idprescription}"    
    

class PrescribedDrug(models.Model):
    prescription_id = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=45)
    frequency = models.CharField(max_length=45)
    duration = models.CharField(max_length=45)
    notes = models.TextField()  # Use TextField for potentially longer notes

    def __str__(self):
        return f"Prescribed Drug #{self.idprescribed_drug}"    
        