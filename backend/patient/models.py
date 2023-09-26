from django.db import models


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