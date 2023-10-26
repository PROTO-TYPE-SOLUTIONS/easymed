from rest_framework.permissions import BasePermission

# models
from customuser.models import (
    CustomUser,
    Doctor,
    Nurse,
    LabTech,
    Patient,
    Receptionist
)


class IsDoctorUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.role == Doctor.BASE_ROLE)


class IsNurseUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.role == Nurse.BASE_ROLE)


class IsLabTechUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.role == LabTech.BASE_ROLE)


class IsSystemsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return bool((request.user and request.user.is_staff and request.user.role == CustomUser.BASE_ROLE) or (request.user and request.user.is_staff and request.user.is_superuser))


class IsPatientUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == Patient.BASE_ROLE)


class IsReceptionistUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.role == Receptionist.BASE_ROLE)
