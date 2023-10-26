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
    Consultation,
    Referral,
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
        fields = ("id", "first_name", "second_name", "date_of_birth",
                  "gender", "insurance", "user_id",)
        read_only_fields = ("id",)
        write_only_fields = ("insurance",)
    
    def to_representation(self, instance: Patient):
        data = super().to_representation(instance)
        data["gender"] = instance.get_gender_display()
        if instance.insurance:
            data["insurance"] = instance.insurance.name
        return data


class NextOfKinSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextOfKin
        fields = '__all__'

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'



class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class PublicAppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PublicAppointment
        fields = [
            "id",
            'service',
            'first_name',
            'second_name',
            'date_of_birth',
            'gender',
            'appointment_date_time',
            'status',
            'reason',
            'date_created',
        ]
        read_only_fields = ("id", "date_created",)

    def to_representation(self, instance: PublicAppointment):
        data = super().to_representation(instance)
        data["gender"] = instance.get_gender_display()
        data["status"] = instance.get_status_display()
        if instance.service:
            data["service"] = instance.service.name
        return data

    def get_service_name(self, obj: PublicAppointment):
        return obj.service.name


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class PrescribedDrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescribedDrug
        fields = '__all__'


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = '__all__'