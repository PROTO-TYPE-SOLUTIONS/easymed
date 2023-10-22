from rest_framework import viewsets
from .models import LabReagent, LabTestResult, LabTestRequest, LabTestCategory, LabTestProfile
from .serializers import (
    LabReagentSerializer,
    LabTestResultSerializer,
    LabTestRequestSerializer,
    LabTestCategorySerializer,
    LabTestProfileSerializer,
)

class LabReagentViewSet(viewsets.ModelViewSet):
    queryset = LabReagent.objects.all()
    serializer_class = LabReagentSerializer

class LabTestProfileViewSet(viewsets.ModelViewSet):
    queryset = LabTestProfile.objects.all()
    serializer_class = LabTestProfileSerializer    

class LabTestResultViewSet(viewsets.ModelViewSet):
    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer

class LabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = LabTestRequest.objects.all()
    serializer_class = LabTestRequestSerializer

class LabTestCategoryViewSet(viewsets.ModelViewSet):
    queryset = LabTestCategory.objects.all()
    serializer_class = LabTestCategorySerializer
