from uuid import uuid4
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.utils import timezone

from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", CustomUser.SYS_ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    PATIENT = 'patient'
    DOCTOR = 'doctor'
    NURSE = 'nurse'
    LAB_TECH = 'labtech'
    RECEPTIONIST = 'receptionist'
    SYS_ADMIN = 'sysadmin'

    BASE_ROLE = PATIENT

    ROLE_CHOICES = (
        (PATIENT, 'Patient'),
        (DOCTOR, 'Doctor'),
        (NURSE, 'Nurse'),
        (LAB_TECH, 'Lab Technician'),
        (RECEPTIONIST, 'Receptionist'),
        (SYS_ADMIN, 'Sysadmin'),
        
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=BASE_ROLE)

    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name='custom_users_permissions'
    )

    groups = models.ManyToManyField(Group, blank=True, related_name='custom_users')

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.id:
            self.role = self.PATIENT
            return super().save(*args, **kwargs)

class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    # Add doctor-specific fields here

class NurseProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    # Add nurse-specific fields here

class SysadminProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    # Add sysadmin-specific fields here

class LabTechProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    # Add lab-tech-specific fields here
    

class ReceptionistProfile(models.Model):
    id = models.UUIDField(default=uuid4, editable=False, unique=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


# proxy model

class ReceptionistManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.RECEPTIONIST)

class Receptionist(CustomUser):
    class Meta:
        proxy = True

    objects = ReceptionistManager()
    BASE_ROLE = CustomUser.RECEPTIONIST


  
class DoctorManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.DOCTOR)
    
class Doctor(CustomUser):
    class Meta:
        proxy = True

    objects = DoctorManager()
    BASE_ROLE = CustomUser.DOCTOR


class NurseManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.NURSE)
    

class Nurse(CustomUser):
    class Meta:
        proxy = True

    objects = NurseManager()
    BASE_ROLE = CustomUser.NURSE


class LabTechManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.LAB_TECH)
    

class LabTech(CustomUser):
    class Meta:
        proxy = True

    objects = LabTechManager()
    BASE_ROLE = CustomUser.LAB_TECH

    
class PatientManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        users = super().get_queryset(*args, **kwargs)
        return users.filter(role=CustomUser.PATIENT)
    

class Patient(CustomUser):
    class Meta:
        proxy = True

    objects = PatientManager()
    BASE_ROLE = CustomUser.PATIENT
