from rest_framework import serializers

from .models import PublicPrescriptionRequest, DrugsFeedback

class PublicPrescriptionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicPrescriptionRequest
        fields = '__all__'


class DrugsFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = DrugsFeedback
        fields = '__all__'