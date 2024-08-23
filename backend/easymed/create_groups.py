# create_groups.py

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', '.settings.base')
django.setup()

from authperms.models import Group, Permission

def create_groups_and_permissions():
    # Define permissions
    permissions = [
        'CAN_ACCESS_DOCTOR_DASHBOARD',
        'CAN_ACCESS_GENERAL_DASHBOARD',
        'CAN_ACCESS_ADMIN_DASHBOARD',
        'CAN_ACCESS_RECEPTION_DASHBOARD',
        'CAN_ACCESS_NURSING_DASHBOARD',
        'CAN_ACCESS_LABORATORY_DASHBOARD',
        'CAN_ACCESS_PATIENTS_DASHBOARD',
        'CAN_ACCESS_AI_ASSISTANT_DASHBOARD',
        'CAN_ACCESS_ANNOUNCEMENT_DASHBOARD',
        'CAN_ACCESS_PHARMACY_DASHBOARD',
        'CAN_ACCESS_INVENTORY_DASHBOARD',
        'CAN_ACCESS_BILLING_DASHBOARD',
    ]

    # Create or get Permission objects
    permission_objects = []
    for perm in permissions:
        permission, _ = Permission.objects.get_or_create(name=perm)
        permission_objects.append(permission)

    # Define groups and their permissions
    groups_permissions = {
        'SYS_ADMIN': permissions,  # All permissions
        'DOCTOR': ['CAN_ACCESS_DOCTOR_DASHBOARD', 'CAN_ACCESS_PATIENTS_DASHBOARD'],
        'PHARMACIST': ['CAN_ACCESS_PHARMACY_DASHBOARD', 'CAN_ACCESS_INVENTORY_DASHBOARD'],
        'RECEPTIONIST': ['CAN_ACCESS_RECEPTION_DASHBOARD'],
        'LAB_TECH': ['CAN_ACCESS_LABORATORY_DASHBOARD'],
        'NURSE': ['CAN_ACCESS_NURSING_DASHBOARD', 'CAN_ACCESS_PATIENTS_DASHBOARD'],
        'PATIENT': ['CAN_ACCESS_GENERAL_DASHBOARD', 'CAN_ACCESS_AI_ASSISTANT_DASHBOARD'],
    }

    # Create or get Group objects and assign permissions
    for group_name, perms in groups_permissions.items():
        group, _ = Group.objects.get_or_create(name=group_name)
        group.permissions.set(Permission.objects.filter(name__in=perms))
        group.save()

    print("Groups and permissions created successfully!")

if __name__ == '__main__':
    create_groups_and_permissions()
