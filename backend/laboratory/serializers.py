from random import randrange, choices
from rest_framework import serializers
import pdb

from customuser.models import CustomUser
from .models import (
    LabReagent,
    LabTestRequest, 
    LabTestProfile, 
    LabEquipment, 
    EquipmentTestRequest, 
    PublicLabTestRequest, 
    LabTestPanel, 
    LabTestRequestPanel,
    ProcessTestRequest,
    PatientSample,

    )


class LabReagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReagent
        fields = '__all__'

class LabTestProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestProfile
        fields = '__all__'


class LabTestPanelSerializer(serializers.ModelSerializer):
    reference_values = serializers.SerializerMethodField()

    class Meta:
        model = LabTestPanel
        fields = "__all__"

    def get_reference_values(self, obj):
        # Assuming `patient` is passed to the serializer context
        patient = self.context.get('patient')
        if patient:
            return obj.get_reference_values(patient)
        return None
    

class PublicLabTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicLabTestRequest
        fields = '__all__'

class LabEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabEquipment
        fields = '__all__'

class LabTestProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestProfile
        fields = '__all__'        


class LabTestRequestPanelSerializer(serializers.ModelSerializer):
    test_panel_name = serializers.ReadOnlyField(source='test_panel.name')
    item = serializers.CharField(source='test_panel.item.id', read_only=True)
    sale_price = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_sex = serializers.SerializerMethodField()
    reference_values = serializers.SerializerMethodField()

    def get_sale_price(self, instance):
        if instance.test_panel and instance.test_panel.item:
            inventory = instance.test_panel.item.inventory_set.first()
            return inventory.sale_price if inventory else None
        return None

    def get_patient_name(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return f"{patient.first_name} {patient.second_name}" if patient else None
        return None

    def get_patient_age(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return patient.age if patient else None
        return None

    def get_patient_sex(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return patient.gender if patient else None
        return None
    
    def get_reference_values(self, instance):
        patient = self._get_patient(instance)
        if not patient:
            return None

        reference_value = instance.test_panel.reference_values.filter(
            sex=patient.gender,
            age_min__lte=patient.age,
            age_max__gte=patient.age
        ).first()

        if reference_value:
            return {
                "low": reference_value.ref_value_low,
                "high": reference_value.ref_value_high
            }
        return None
    
    def _get_patient(self, instance):
        # Helper method to get the patient object
        if instance.patient_sample and instance.patient_sample.process:
            return instance.patient_sample.process.attendanceprocess.patient
        return None
    
    class Meta:
        model = LabTestRequestPanel
        fields = [
            'test_panel',
            'test_panel_name', 
            'item', 
            'sale_price', 
            'patient_name', 
            'patient_age', 
            'patient_sex',
            'reference_values',
            'lab_test_request',
        ]


class EquipmentTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentTestRequest
        fields = '__all__'


class LabTestRequestSerializer(serializers.ModelSerializer):
    patient_first_name = serializers.ReadOnlyField(source='patient.first_name')
    patient_last_name = serializers.ReadOnlyField(source='patient.second_name')
    test_profile_name = serializers.ReadOnlyField(source='test_profile.name')
    category = serializers.CharField(source='test_profile.category', read_only=True)

    class Meta:
        model = LabTestRequest
        fields = "__all__"
        #Removed id and sample as they were readonly


class ProcessTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessTestRequest
        fields = '__all__'


class PatientSampleSerializer(serializers.ModelSerializer):
    specimen_name = serializers.SerializerMethodField()

    class Meta:
        model = PatientSample
        fields = [
            'id',
            'patient_sample_code',
            'is_sample_collected',
            'specimen',
            'specimen_name',
            'lab_test_request',
            'process'
        ]

    def get_specimen_name(self, obj):
        return obj.specimen.name


