from datetime import datetime
from uuid import uuid4
import random
from django.db import models
from customuser.models import CustomUser
# from pharmacy.models import Drug
from inventory.models import Item
from billing.models import Invoice
from company.models import InsuranceCompany
from laboratory.models import ProcessTestRequest
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.utils import timezone

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
    unique_id = models.CharField(max_length=8, unique=True, editable=False)
    first_name = models.CharField(max_length=40)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField(null=True)
    email = models.EmailField(null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    insurances = models.ManyToManyField(InsuranceCompany, blank=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.first_name
    
    @property
    def age(self):
        if self.date_of_birth:
            patient_age:int = (datetime.now().year - self.date_of_birth.year)
            return patient_age
        return None
    
    def save(self, *args, **kwargs):
        if not self.unique_id:
            self.unique_id = self.generate_unique_id()
        super(Patient, self).save(*args, **kwargs)

    def generate_unique_id(self):
        while True:
            unique_id = '{:08d}'.format(random.randint(0, 99999999))
            if not Patient.objects.filter(unique_id=unique_id).exists():
                return unique_id


class NextOfKin(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    relationship = models.CharField(max_length=40)   
    contacts = models.ForeignKey(ContactDetails, on_delete=models.CASCADE)


class Appointment(models.Model):
    class Meta:
        ordering = ("-date_created",)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    appointment_date_time = models.DateTimeField(null=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assigned_doctor = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, default=22)

    def __str__(self):
        return f"Appointment #{self.patient.first_name}"



class PublicAppointment(models.Model):
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
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    first_name = models.CharField(max_length=40)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, null=True, blank=True)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    appointment_date_time = models.DateTimeField()
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300,)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment #{self.first_name}"
    
    @property
    def age(self):
        if self.date_of_birth:
            patient_age:int = (datetime.now().year - self.date_of_birth.year)
            return patient_age
        return None


class Triage(models.Model):
    created_by = models.CharField(max_length=45)
    # patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True)
    weight = models.IntegerField(null=True)
    pulse = models.PositiveIntegerField(null=True)
    diastolic = models.PositiveIntegerField(null=True)
    systolic = models.PositiveIntegerField(null=True)
    bmi = models.DecimalField(max_digits=10, decimal_places=1, null=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.CharField(max_length=300, blank=True, null=True)


class Consultation(models.Model):
    DISPOSITION_CHOICES = (
        ('admitted', 'Admitted'),
        ('referred', 'Referred'),
        ('discharged', 'Discharged'),
        ('lab', 'Lab'),
    )
    doctor = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    complaint = models.TextField(null=True, blank=True)
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    disposition = models.CharField(
        max_length=10, choices=DISPOSITION_CHOICES, default="")
    
    def __str__(self):
        return self.note


class Prescription(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField(null=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return f"Prescription #{self.id}"


class PrescribedDrug(models.Model):
    class Meta:
        unique_together = ("prescription_id", "item")
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, null=True)
    dosage = models.CharField(max_length=45)
    frequency = models.CharField(max_length=45)
    duration = models.CharField(max_length=45)
    note = models.TextField(null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE,)
    is_dispensed = models.BooleanField(default=False)
    quantity = models.PositiveIntegerField(default=1)


    def __str__(self):
        return f"Prescribed Drug #{self.item.name}"    
        

class Referral(models.Model):
    SERVICE = (
        ('general', 'General'),
        ('dentist', 'Dentist'),
        ('cardiologist', 'Cardiologist'),
        ('neurologist', 'Neurologist'),
        ('orthopedist', 'Orthopedist'),
        ('psychiatrist', 'Psychiatrist'),
        ('surgeon', 'Surgeon'),
        ('physiotherapist', 'Physiotherapist'),
    )
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    referred_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    service = models.CharField(max_length=50, choices=SERVICE, default='general')
    email = models.EmailField()

    def __str__(self):
        return f"Referral #{self.patient_id}"
    
    def set_referred_by(self, CustomUser):
        self.referred_by = CustomUser

    def save(self, *args, **kwargs):
        if not self.pk:
            if not self.referred_by:
                raise ValueError("You must set the 'referred_by' user before saving.")
        super().save(*args, **kwargs)

class AttendanceProcess(models.Model):
    TRACK = (
        ('reception', 'Reception'),
        ('triage', 'Triage'),
        ('doctor', 'Doctor'),
        ('pharmacy', 'Pharmacy'),
        ('lab', 'Lab'),
        ('awaiting result', 'Result'),
        ('added result', 'Resulted'),
        ('impatient', 'Impatient'),
        ('billing', 'Billing'),
        ('complete', 'Complete'),
    )
    track_number = models.CharField(max_length=50, null=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    patient_number = models.CharField(max_length=8, editable=False, default=999)
    doctor = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctor_attendance_processes')
    lab_tech = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='labTech_attendance_processes')
    pharmacist = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='pharmacist_attendance_processes')
    reason = models.TextField(max_length=300)
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE, null=True)
    process_test_req = models.OneToOneField(ProcessTestRequest, on_delete=models.CASCADE, null=True) # id of ProcessTestRequest is stored here
    prescription = models.OneToOneField(Prescription, on_delete=models.CASCADE, null=True)
    triage = models.OneToOneField(Triage, on_delete=models.CASCADE, null=True)
    track = models.CharField(max_length=50, choices=TRACK, default='reception')
    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        # Check if the attendance process is being created for the first time
        if not self.pk:

            # Generate a unique track number
            self.track_number = str(uuid4())
            self.patient_number = self.patient.unique_id

            # Create a new invoice with a default amount of 0
            self.invoice = Invoice.objects.create(invoice_amount=0, invoice_number=self.track_number, patient=self.patient, invoice_date=self.created_at)
            self.process_test_req = ProcessTestRequest.objects.create(reference=self.track_number)
            self.triage = Triage.objects.create()
            self.prescription = Prescription.objects.create()

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.id} - {self.patient.first_name}"