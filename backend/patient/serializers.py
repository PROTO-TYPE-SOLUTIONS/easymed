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
    PatientProfile
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
    

class PatientProfileSerializer(serializers.ModelSerializer):
    no_of_visits = serializers.SerializerMethodField()
    insurance_name = serializers.SerializerMethodField()
    all_assigned_doctors = serializers.SerializerMethodField()
    registered_date = serializers.SerializerMethodField()
    class Meta:
        model = PatientProfile
        fields = ("id", "patient", "no_of_visits", "insurance_name", "all_assigned_doctors", "current_status", "registered_date")

    def get_no_of_visits(self, obj: PatientProfile):
        return obj.no_of_visits

    def get_insurance_name(self, obj: PatientProfile):
        return obj.insurance_name
    def get_all_assigned_doctors(self, obj: PatientProfile):
        return obj.all_assigned_doctors
    def get_current_status(self, obj: PatientProfile):
        return obj.current_status
    def get_registered_date(self, obj: PatientProfile):
        return obj.registered_date
    
    def to_representation(self, instance: PatientProfile):
        data = super().to_representation(instance)
        data["patient"] = f"{instance.patient.first_name } {instance.patient.second_name}"
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

    def to_representation(self, instance: Appointment):
        data = super().to_representation(instance)
        if instance.assigned_doctor:
            data["assigned_doctor"] = instance.assigned_doctor.get_fullname()
        
        if instance.patient:
            data["first_name"] = instance.patient.first_name
            data["second_name"] = instance.patient.second_name
        return data


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


# get appointments for a specific doctor
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'         