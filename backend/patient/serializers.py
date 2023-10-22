from rest_framework import serializers
from .models import (
    InsuranceCompany,
    ContactDetails,
    Patient,
    NextOfKin,
    Appointment,
    Prescription,
    PrescribedDrug,
    PublicAppointment,
    Service,
)

class InsuranceCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceCompany
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class ContactDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetails
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class NextOfKinSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextOfKin
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class PublicAppointmentSerializer(serializers.ModelSerializer):
    service_name = serializers.SerializerMethodField()
    class Meta:
        model = PublicAppointment
        fields = [
            'service_name',
            'first_name',
            'second_name',
            'date_of_birth',
            'gender',
            'appointment_date_time',
            'status',
            'reason',
            'date_created',
                  ]

    
    def get_service_name(self, obj):
        return obj.service.name    


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class PrescribedDrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescribedDrug
        fields = '__all__'
