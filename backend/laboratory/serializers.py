# serializers.py
from rest_framework import serializers
from .models import LabReagent, PatientIdentifier, LabResult, LabTest, LabTestCategory

class LabReagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReagent
        fields = '__all__'

class PatientIdentifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientIdentifier
        fields = '__all__'

class LabResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabResult
        fields = '__all__'

class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = '__all__'

class LabTestCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestCategory
        fields = '__all__'
