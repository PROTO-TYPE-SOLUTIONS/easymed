from django.db import models
from customuser.models import CustomUser
from pharmacy.models import Drug
from inventory.models import Item, OrderBill

from django.db.models.signals import post_save
from django.dispatch import receiver


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
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, )
    insurance = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE, null=True, blank=True)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.first_name
    
# meant to create an OrderBill item when a patient is created
# def order_bill_created(sender, instance, created, **kwargs):
#     if created:
#         order_bill = OrderBill.objects.create(patient_ID=Patient.objects.create())

# post_save.connect(order_bill_created, sender=Patient)
    

class NextOfKin(models.Model):
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    firts_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    relationship = models.CharField(max_length=40)
    contacts = models.ForeignKey(ContactDetails, on_delete=models.CASCADE)

class Service(models.Model):
    name = models.TextField(max_length=300)

    def __str__(self):
        return self.name

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
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE)
    fee =  models.CharField(max_length=40)

    order_bill_ID = models.ForeignKey(OrderBill, on_delete=models.CASCADE)

    # changed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Appointment #{self.patient.first_name}"

# appointments from landing page, with no user or patient registration
# will provide option to register as patient
class PublicAppointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, )
    appointment_date_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment #{self.first_name}"    
    

class Triage(models.Model):
    created_by = models.CharField(max_length=45)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.IntegerField()
    pulse = models.PositiveIntegerField()


class Consultation(models.Model):
    DISPOSITION_CHOICES = (
        ('admitted', 'Admitted'),
        ('referred', 'Referred'),
        ('discharged', 'Discharged'),
        ('lab', 'Lab'),
    )
    doctor_ID = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    complaint = models.TextField(null=True, blank=True)
    disposition = models.CharField(max_length=10, choices=DISPOSITION_CHOICES, default="")

class Prescription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('dispensed', 'Dispensed'),
    )
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Prescription #{self.patient_id}"    
    

class PrescribedDrug(models.Model):
    prescription_id = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=45)
    frequency = models.CharField(max_length=45)
    duration = models.CharField(max_length=45)
    note = models.TextField(null=True, blank=True)
    order_bill_ID = models.ForeignKey(OrderBill, on_delete=models.CASCADE)

    def __str__(self):
        return f"Prescribed Drug #{self.drug_id}"    
        