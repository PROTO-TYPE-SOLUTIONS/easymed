from rest_framework import serializers
from .models import LabReagent, LabTestResult, LabTestRequest, LabTestCategory, LabTestProfile, LabEquipment

class LabReagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReagent
        fields = '__all__'

class LabEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabEquipment
        fields = '__all__'

class LabTestProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestProfile
        fields = '__all__'        

class LabTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResult
        fields = '__all__'

class LabTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestRequest
        fields = '__all__'

class LabTestCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestCategory
        fields = '__all__'
