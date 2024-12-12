from django.core.management.base import BaseCommand
from authperms.models import Permission, Group

class Command(BaseCommand):
    help = 'Setup initial permissions and groups'

    def handle(self, *args, **kwargs):
        # Create permissions
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

        permission_objects = {}
        for perm in permissions:
            permission, created = Permission.objects.get_or_create(name=perm)
            permission_objects[perm] = permission
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created permission: {perm}'))

        # Create groups with their permissions
        groups_config = {
            'SYS_ADMIN': permissions,  # All permissions
            'PATIENT': ['CAN_ACCESS_PATIENTS_DASHBOARD'],
            'DOCTOR': [
                'CAN_ACCESS_DOCTOR_DASHBOARD',
                'CAN_ACCESS_GENERAL_DASHBOARD',
                'CAN_ACCESS_AI_ASSISTANT_DASHBOARD'
            ],
            'PHARMACIST': [
                'CAN_ACCESS_PHARMACY_DASHBOARD',
                'CAN_ACCESS_GENERAL_DASHBOARD',
                'CAN_ACCESS_INVENTORY_DASHBOARD'
            ],
            'RECEPTIONIST': [
                'CAN_ACCESS_RECEPTION_DASHBOARD',
                'CAN_ACCESS_GENERAL_DASHBOARD',
                'CAN_ACCESS_BILLING_DASHBOARD'
            ],
            'LAB_TECH': [
                'CAN_ACCESS_LABORATORY_DASHBOARD',
                'CAN_ACCESS_GENERAL_DASHBOARD'
            ],
            'NURSE': [
                'CAN_ACCESS_NURSING_DASHBOARD',
                'CAN_ACCESS_GENERAL_DASHBOARD'
            ],
        }

        # Create groups in specific order
        group_order = ['SYS_ADMIN', 'PATIENT', 'DOCTOR', 'PHARMACIST', 'RECEPTIONIST', 'LAB_TECH', 'NURSE']
        
        for group_name in group_order:
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created group: {group_name}'))
            
            # Add permissions to group
            group_permissions = [permission_objects[perm] for perm in groups_config[group_name]]
            group.permissions.set(group_permissions)
            self.stdout.write(self.style.SUCCESS(f'Added permissions to group: {group_name}'))
