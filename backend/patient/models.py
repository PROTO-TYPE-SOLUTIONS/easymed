from uuid import uuid4
from django.contrib.auth.models import BaseUserManager
from django.db import models
from django.utils import timezone

# models
from customuser.models import (
    CustomUser,
)
from pharmacy.models import Drug
from inventory.models import Item, OrderBill

from django.utils.translation import gettext_lazy as _

from django.db.models.signals import post_save
from django.dispatch import receiver


class InsuranceCompany(models.Model):
    id = models.UUIDField(_("company id"), default=uuid4, unique=True, editable=False, primary_key=True)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name
    

class ContactDetails(models.Model):
    id = models.UUIDField(_("contact details id"), default=uuid4, unique=True, editable=False, primary_key=True)
    email_address = models.EmailField()
    residence = models.CharField(max_length=30)


class Patient(models.Model):
    id = models.UUIDField(_("patient id"), default=uuid4, unique=True, editable=False, primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)


# class Patient(models.Model):
#     GENDER_CHOICES = (
#         ('M', 'Male'),
#         ('F', 'Female'),
#         ('O', 'Other'),
#     )
#     first_name = models.CharField(max_length=40)
#     second_name = models.CharField(max_length=40)
#     date_of_birth = models.DateField()
#     gender = models.CharField(max_length=1, choices=GENDER_CHOICES, )
#     insurance = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE, null=True, blank=True)
#     user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)

#     def __str__(self):
#         return self.first_name
    
# meant to create an OrderBill item when a patient is created
def order_bill_created(sender, instance, created, **kwargs):
    if created:
        order_bill = OrderBill.objects.create(patient_ID=Patient.objects.create())

# post_save.connect(order_bill_created, sender=Patient)
    

class NextOfKin(models.Model):
    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    firts_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    relationship = models.CharField(max_length=40)
    contacts = models.ForeignKey(ContactDetails, on_delete=models.CASCADE, null=True)

class Service(models.Model):
    name = models.TextField(max_length=300)

    def __str__(self):
        return self.name
    

# class Appointment(models.Model):
#     # types
#     PUBLIC = "public"
#     WALKIN = "walkin"

#     TYPE_CHOICES = (
        
#     )
#     # status
#     PENDING = "pending"
#     CONFIRMED = "confirmed"
#     CANCELLED  = "cancelled"

#     STATUS_CHOICES = (
#         (PENDING, "Pending"),
#         (CONFIRMED, "Confirmed"),
#         (CANCELLED, "Cancelled"),
#     )
#     # gender
#     MALE = "male"
#     FEMALE = "female"

#     GENDER_CHOICES = (
#         (MALE, "Male"),
#         (FEMALE, "Female"),
#     )
#     class Meta:
#         default_related_name = _("appointments")
        
#     id = models.UUIDField(_("appointment id"), default=uuid4, unique=True, editable=False, primary_key=True)
#     first_name = models.CharField(_("first name"), max_length=40)
#     second_name = models.CharField(_("second name"), max_length=40, null=True)
#     last_name = models.CharField(_("last name"), max_length=40)
#     date_of_birth = models.DateField(_("date of birth"))
#     gender = models.CharField(_("gender"), max_length=6, choices=GENDER_CHOICES)
#     appointment_date_time = models.DateTimeField(_("appointment date"))
#     service = models.ForeignKey(Service, on_delete=models.CASCADE)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
#     reason = models.TextField(max_length=300)
#     created_at = models.DateTimeField(default=timezone.now)
    # updated_at = models.DateTimeField(editable=False)

    


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    appointment_date_time = models.DateTimeField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    assigned_doctor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True,)
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
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=40)
    second_name = models.CharField(max_length=40)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, )
    appointment_date_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(max_length=300)
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment #{self.first_name}"    
    

class Triage(models.Model):
    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
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
    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
    doctor_ID = models.ForeignKey(CustomUser, on_delete=models.CASCADE,)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE, )
    date_created = models.DateTimeField(auto_now_add=True)
    note = models.TextField(null=True, blank=True)
    complaint = models.TextField(null=True, blank=True)
    disposition = models.CharField(max_length=10, choices=DISPOSITION_CHOICES, default="")

class Prescription(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('dispensed', 'Dispensed'),
    )
    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
    patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE,)
    date_created = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Prescription #{self.patient_id}"    
    

class PrescribedDrug(models.Model):
    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
    prescription_id = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=45)
    frequency = models.CharField(max_length=45)
    duration = models.CharField(max_length=45)
    note = models.TextField(null=True, blank=True)
    order_bill_ID = models.ForeignKey(OrderBill, on_delete=models.CASCADE)

    def __str__(self):
        return f"Prescribed Drug #{self.drug_id}"    
        

class PatientProfile(models.Model):
    class Meta:
        default_related_name = _("patient_profile")
    
    id = models.UUIDField(_("patient profile id"), default=uuid4, unique=True, editable=False, primary_key=True)
    user = models.OneToOneField(Patient, on_delete=models.DO_NOTHING,)
    insurance = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE, null=True,)
    residence = models.CharField(max_length=100, null=True)




class PatientVisit(models.Model):
    class Meta:
        default_related_name = _("patient_visits")

    id = models.UUIDField(_("patient visit id"), default=uuid4, unique=True, editable=False, primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.DO_NOTHING, null=True, verbose_name=_("patient user"))
    prescription = models.ForeignKey(Prescription, on_delete=models.DO_NOTHING, null=True, verbose_name=_("prescription"))
    consultation = models.ForeignKey(Consultation, on_delete=models.DO_NOTHING, null=True, verbose_name=_("consultation"))



