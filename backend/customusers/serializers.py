# serializers.py
from rest_framework import serializers
from .models import CustomUser, DoctorProfile, NurseProfile, SysadminProfile, LabTechProfile

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined')

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'

class NurseProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NurseProfile
        fields = '__all__'

class SysadminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SysadminProfile
        fields = '__all__'

class LabTechProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTechProfile
        fields = '__all__'
