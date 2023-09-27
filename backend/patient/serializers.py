from .models import Patient
from rest_framework import serializers
from .models import Appointment

class PatientsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__' 

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'        