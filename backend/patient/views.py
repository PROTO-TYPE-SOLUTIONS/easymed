from rest_framework import viewsets, status
from rest_framework.request import Request
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
    Referral
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
        data = request.data
        # extract extra fields
        if "appointment_date_time" not in data.keys():
            return Response({"message": "appointment_date_time field should be provided"}, status=status.HTTP_400_BAD_REQUEST)
        if "reason" not in data.keys():
            return Response({"message": "reason field should be provided"}, status=status.HTTP_400_BAD_REQUEST)

        appointment_date_time = data.pop("appointment_date_time")
        reason = data.get("reason",)
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            patient: Patient = serializer.save()
        except Exception as e:
            return Response()

        try:
            appointment = Appointment.objects.create(
                patient=patient, appointment_date_time=appointment_date_time, reason=reason, )
        except Exception as e:
            return Response({"message": f"creating a patient appointment failed {e}"})
        
        return Response({"message": {"patient_id": patient.pk, "appointment_id": appointment.pk}}, status=status.HTTP_201_CREATED)


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
