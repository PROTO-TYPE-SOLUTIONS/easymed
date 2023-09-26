from .models import Patient
from rest_framework import serializers

class PatientsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'        