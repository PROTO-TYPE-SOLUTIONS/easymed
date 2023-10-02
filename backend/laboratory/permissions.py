from rest_framework import permissions

class IsDoctorRequestingLabResult(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the requesting user is the same as the user who created the LabTest
        return obj.lab_test.created_by == request.user
