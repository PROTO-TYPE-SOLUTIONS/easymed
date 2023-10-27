from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response
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
    PatientProfileSerializer
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

    def get(self, request: Request, *args, **kwargs):
        profiles = PatientProfile.objects.all()
        serializer = PatientProfileSerializer(profiles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
