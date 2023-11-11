from rest_framework import viewsets

# models
from .models import (
    LabReagent, 
    LabTestResult, 
    LabTestRequest, 
    LabTestCategory, 
    LabTestProfile
)
# serializers
from .serializers import (
    LabReagentSerializer,
    LabTestResultSerializer,
    LabTestRequestSerializer,
    LabTestCategorySerializer,
    LabTestProfileSerializer,
)

# permissions
from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser
)

class LabReagentViewSet(viewsets.ModelViewSet):
    queryset = LabReagent.objects.all()
    serializer_class = LabReagentSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestProfileViewSet(viewsets.ModelViewSet):
    queryset = LabTestProfile.objects.all()
    serializer_class = LabTestProfileSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestResultViewSet(viewsets.ModelViewSet):
    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = LabTestRequest.objects.all()
    serializer_class = LabTestRequestSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestCategoryViewSet(viewsets.ModelViewSet):
    queryset = LabTestCategory.objects.all()
    serializer_class = LabTestCategorySerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)
