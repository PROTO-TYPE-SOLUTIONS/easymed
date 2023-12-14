from django.utils import timezone
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
    Triage,
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
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = "__all__"

    def get_age(self, obj: Patient):
        if obj.age:
            return obj.age
        return None

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


# class AppointmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Appointment
#         fields = '__all__'

#     def to_representation(self, instance: Appointment):
#         data = super().to_representation(instance)
#         if instance.assigned_doctor:
#             data["assigned_doctor"] = instance.assigned_doctor.get_fullname()

#         if instance.patient:
#             data["first_name"] = instance.patient.first_name
#             data["second_name"] = instance.patient.second_name
#         return data

class ConvertToAppointmentsSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    second_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    date_of_birth = serializers.DateTimeField()
    gender = serializers.ChoiceField(choices=PublicAppointment.GENDER_CHOICES)
    appointment_date_time = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=PublicAppointment.STATUS_CHOICES)
    reason = serializers.CharField()

    def create_patient_appointment(self) -> int:
        try:
            patient = Patient.objects.create(
                first_name = self.validated_data.get("first_name"),
                second_name = self.validated_data.get("second_name"),
                date_of_birth = self.validated_data.get("date_of_birth"),
                gender = self.validated_data.get("gender"),
                email = self.validated_data.get("email"),
                phone_number = self.validated_data.get("phone_number"),
            )
        except Exception as e:
            return 400
        
        try:
            Appointment.objects.create(
                appointment_date_time = self.validated_data.get("appointment_date_time"),
                patient = patient,
                status = self.validated_data.get("status"),
                reason = self.validated_data.get("reason"),
            )
        except Exception as e:
            return 400
        

        return 201
    
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
    patient = serializers.PrimaryKeyRelatedField(
        queryset = Patient.objects.all(),
        required = False,
        allow_null= True,
    )
    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_changed")

    
    def to_representation(self, instance: Appointment):
        data = super().to_representation(instance)
        if instance.assigned_doctor:
            data["assigned_doctor"] = instance.assigned_doctor.get_fullname()

        if instance.patient:
            data["first_name"] = instance.patient.first_name
            data["second_name"] = instance.patient.second_name
            data["gender"] = instance.patient.gender
            data["age"] = instance.patient.age

        
        return data



class TriageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Triage
        fields = '__all__'


class SendConfirmationMailSerializer(serializers.Serializer):
    appointments = serializers.PrimaryKeyRelatedField(
        queryset = Appointment.objects.all(),
        many = True,
        required = True,
        allow_null = False,
    )
    