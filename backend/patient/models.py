from django.db import models
from customusers.models import CustomUser
from pharmacy.models import Drug

class InsuranceCompany(models.Model):
    name = models.CharField(max_length=30)
    
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
    firts_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    insurance = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)


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
    appointment_date = models.DateTimeField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assigned_doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    idappointment = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=45)
    doctor_id = models.CharField(max_length=45)
    appointment_date_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.CharField(max_length=45)
    date_created = models.CharField(max_length=45)
    date_changed = models.CharField(max_length=45)
    changed_by = models.CharField(max_length=45)

    def __str__(self):
        return f"Appointment #{self.idappointment}"


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
        