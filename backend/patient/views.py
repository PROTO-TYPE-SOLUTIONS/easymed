from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response

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
    Consultation,
    Referral,
    PatientProfile,
    Triage,
)
from .serializers import (
    InsuranceCompanySerializer,
    ContactDetailsSerializer,
    PatientSerializer,
    NextOfKinSerializer,
    AppointmentSerializer,
    PrescriptionSerializer,
    PrescribedDrugSerializer,
    PublicAppointmentSerializer,
    ServiceSerializer,
    ConsultationSerializer,
    ReferralSerializer,
    PatientProfileSerializer,
    TriageSerializer,
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)



class InsuranceCompanyViewSet(viewsets.ModelViewSet):
    queryset = InsuranceCompany.objects.all()
    serializer_class = InsuranceCompanySerializer


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class ContactDetailsViewSet(viewsets.ModelViewSet):
    queryset = ContactDetails.objects.all()
    serializer_class = ContactDetailsSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def create(self, request: Request, *args, **kwargs):
        data = request.data.copy()
        # extract extra fields

        appointment_date_time = data.pop("appointment_date_time", None)
        reason = data.pop("reason", None)
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            patient: Patient = serializer.save()
        except Exception as e:
            return Response()

        try:
            appointment = Appointment.objects.create(patient=patient)
            if appointment_date_time:
                appointment.appointment_date_time = appointment_date_time
            if reason:
                appointment.reason = reason
            appointment.save()
        except Exception as e:
            return Response({"message": f"creating a patient appointment failed {e}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": {"patient_id": patient.pk, "appointment_id": appointment.pk}}, status=status.HTTP_201_CREATED)


class PatientsProfileAPIView(APIView):
    def get_object(self, user_id: int):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        responses=PatientProfileSerializer,
    )
    def get(self, request: Request, user_id: int=None, *args, **kwargs):
        patient = self.get_object(user_id)
        if patient is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        profile = PatientProfile.objects.filter(user__pk=patient.pk).first()
        if profile:
            serializer = PatientProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)


class NextOfKinViewSet(viewsets.ModelViewSet):
    queryset = NextOfKin.objects.all()
    serializer_class = NextOfKinSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class PublicAppointmentViewSet(viewsets.ModelViewSet):
    queryset = PublicAppointment.objects.all()
    serializer_class = PublicAppointmentSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer


class PrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer


class TriageViewSet(viewsets.ModelViewSet):
    queryset = Triage.objects.all()
    serializer_class = TriageSerializer



# get appointments for a specific doctor
class DoctorAppointmentViewSet(viewsets.ViewSet):
    serializer_class = AppointmentSerializer

    def list(self, request, doctor_id):
        # Retrieve appointments for a specific doctor
        appointments = Appointment.objects.filter(assigned_doctor_id=doctor_id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)