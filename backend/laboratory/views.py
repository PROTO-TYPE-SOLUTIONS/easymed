# views.py
from rest_framework import viewsets
from .models import LabReagent, PatientIdentifier, LabResult, LabTest, LabTestCategory
from .serializers import (
    LabReagentSerializer,
    PatientIdentifierSerializer,
    LabResultSerializer,
    LabTestSerializer,
    LabTestCategorySerializer,
)

class LabReagentViewSet(viewsets.ModelViewSet):
    queryset = LabReagent.objects.all()
    serializer_class = LabReagentSerializer

class PatientIdentifierViewSet(viewsets.ModelViewSet):
    queryset = PatientIdentifier.objects.all()
    serializer_class = PatientIdentifierSerializer

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer

class LabTestViewSet(viewsets.ModelViewSet):
    queryset = LabTest.objects.all()
    serializer_class = LabTestSerializer

class LabTestCategoryViewSet(viewsets.ModelViewSet):
    queryset = LabTestCategory.objects.all()
    serializer_class = LabTestCategorySerializer
