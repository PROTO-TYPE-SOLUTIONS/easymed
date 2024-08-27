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

class LabTestPanelSerializer (serializers.ModelSerializer):
    class Meta:
        model = LabTestPanel
        fields = '__all__'

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

# class LabTestResultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTestResult
#         fields = '__all__'


# class LabTestResultPanelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTestResultPanel
#         fields = '__all__'


class LabTestRequestPanelSerializer(serializers.ModelSerializer):
    test_panel_name = serializers.ReadOnlyField(source='test_panel.name')
    item = serializers.CharField(source='test_panel.item.id', read_only=True)
    sale_price = serializers.SerializerMethodField()

    def get_sale_price(self, instance):
        if instance.test_panel and instance.test_panel.item:
            inventory = instance.test_panel.item.inventory_set.first()
            return inventory.sale_price if inventory else None
        return None

    class Meta:
        model = LabTestRequestPanel
        fields = '__all__'
        extra_fields = ['test_panel_name', 'sale_price']


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




    # def create(self, validated_data: dict):
    #     validated_data["sample"] = self.generate_sample_code()
    #     return super().create(validated_data)

    # def update(self, instance, validated_data):
    #     # If sample code is not provided, generate one
    #     print(f"Updating data: {validated_data}")

    #     if 'sample' in validated_data and validated_data['sample'] is not None:
    #         validated_data["sample"] = validated_data["sample"] + "-" + self.generate_sample_code()

    #     return super().update(instance, validated_data)


    # def to_representation(self, instance: LabTestRequest):

    #     data = super().to_representation(instance)
    #     if instance.requested_by:
    #         try:
    #             user: CustomUser = CustomUser.objects.get(id=data.get("requested_by"))
    #             data["requested_name"] = user.get_fullname()
    #         except Exception as e:
    #             pass

    #     return data
    

# class ResultsVerificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ResultsVerification
#         fields = '__all__'

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


