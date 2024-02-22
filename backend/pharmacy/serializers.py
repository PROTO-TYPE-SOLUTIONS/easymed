from rest_framework import serializers

from .models import PublicPrescriptionRequest

class PublicPrescriptionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicPrescriptionRequest
        fields = '__all__'
