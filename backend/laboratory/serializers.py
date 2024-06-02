from random import randrange, choices
from rest_framework import serializers
import pdb

from customuser.models import CustomUser
from .models import (
    LabReagent, LabTestResult, 
    LabTestRequest, 
    # LabTestCategory, 
    LabTestProfile, 
    LabEquipment, 
    EquipmentTestRequest, 
    PublicLabTestRequest, 
    LabTestPanel, 
    LabTestResultPanel,
    LabTestRequestPanel,
    LabTestResultQualitative,
    LabTestResultPanelQualitative,
    ResultsVerification,
    QualitativeResultsVerification,
    ProcessTestRequest,
    PatientSample,
    Phlebotomy

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

class PhlebotomySerializer (serializers.ModelSerializer):
    class Meta:
        model = Phlebotomy
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

class LabTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResult
        fields = '__all__'


class LabTestResultPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResultPanel
        fields = '__all__'


class LabTestRequestPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestRequestPanel
        fields = '__all__'

class LabTestResultQualitativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResultQualitative
        fields = '__all__'

class LabTestResultPanelQualitativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestResultPanelQualitative
        fields = '__all__'

class EquipmentTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentTestRequest
        fields = '__all__'
class LabTestRequestSerializer(serializers.ModelSerializer):
    patient_first_name = serializers.ReadOnlyField(source='patient.first_name')
    patient_last_name = serializers.ReadOnlyField(source='patient.second_name')
    test_profile_name = serializers.ReadOnlyField(source='test_profile.name')
    sale_price = serializers.SerializerMethodField()
    category = serializers.CharField(source='test_profile.category', read_only=True)


    class Meta:
        model = LabTestRequest
        fields = "__all__"
        #Removed id and sample as they were readonly

    def get_sale_price(self, instance):
        if instance.test_profile and instance.test_profile.item:
            inventory = instance.test_profile.item.inventory_set.first()
            return inventory.sale_price if inventory else None
        return None

    def sample_code():
        sp_id = ""
        while True:
            random_number = [randrange(0,10000) for _ in range(4) ]
            sp_id = f"SP-{random_number}"
            lab_req = LabTestRequest.objects.filter(sample=sp_id)
            if not lab_req.exists():
                break

        return sp_id
    
    
    def generate_sample_code(self):
            sp_id = ""
            while True:
                random_number = "".join([str(randrange(0, 9)) for _ in range(4)])
                sp_id = f"SP-{random_number}"
                lab_req = LabTestRequest.objects.filter(sample=sp_id)
                if not lab_req.exists():
                    break
            return sp_id

    def create(self, validated_data: dict):
        validated_data["sample"] = self.generate_sample_code()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # If sample code is not provided, generate one
        print(f"Updating data: {validated_data}")

        if 'sample' in validated_data and validated_data['sample'] is not None:
            validated_data["sample"] = validated_data["sample"] + "-" + self.generate_sample_code()

        return super().update(instance, validated_data)


    def to_representation(self, instance: LabTestRequest):

        data = super().to_representation(instance)
        if instance.requested_by:
            try:
                user: CustomUser = CustomUser.objects.get(id=data.get("requested_by"))
                data["requested_name"] = user.get_fullname()
            except Exception as e:
                pass

        return data
    



# class LabTestCategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = LabTestCategory
#         fields = '__all__'

class ResultsVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultsVerification
        fields = '__all__'

class QualitativeResultsVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualitativeResultsVerification
        fields = '__all__'

class ProcessTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessTestRequest
        fields = '__all__'


class PatientSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientSample
        fields = "__all__"


