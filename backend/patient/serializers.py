from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from customuser.models import CustomUser
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
    class Meta:
        model = PublicAppointment
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class PrescribedDrugSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescribedDrug
        fields = '__all__'


class CreatePatientSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=15)
    first_name = serializers.CharField(max_length=30)
    second_name = serializers.CharField(
        max_length=40, required=False, allow_null=True)
    last_name = serializers.CharField(max_length=30,)
    date_of_birth = serializers.DateField()
    
    residence = serializers.CharField(help_text=_(
        "residence"), max_length=100, required=False, allow_null=True)
    insurance_name = serializers.CharField(help_text=_(
        "insurance company name"), max_length=30, required=False, allow_null=True)

    def create_patient(self):
        patient_info = self.validated_data
        user = None
        try:
            user = CustomUser.objects.create(email=patient_info.get("email"), phone_number=patient_info.get("phone_number"), first_name=patient_info.get(
                "first_name"), second_name=patient_info.get("second_name"), last_name=patient_info.get("last_name"), date_of_birth=patient_info.get("date_of_birth"), )
            print(f"{user=}")
        except Exception as e:
            print(e)
            return {"message": "there was a problem while creating a patient"}

        profile = self.create_patient_profile(user=user)
        return profile

    def create_patient_profile(self, user: CustomUser):
        patient_info = self.validated_data
        insurance_name = patient_info.get("insurance_name")
        residence = patient_info.get("residence")
        patient = Patient.objects.create(user=user)
        profile = PatientProfile.objects.create(user=patient)
        print(f"{patient_info=}")
        try:
            print(insurance_name)
            if insurance_name is not None:
                insurance = InsuranceCompany.objects.create(name=insurance_name)
                print(insurance)
                # profile.insurance = insurance
            if residence is not None:
                profile.residence = residence

            profile.save()
            return {"message": "successfully created patient"}

        except Exception as e:
            print(e)
            return {"message": "there was a problem while creating a patient profile"}
