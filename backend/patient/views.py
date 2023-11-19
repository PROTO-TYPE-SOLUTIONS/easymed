from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

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
    TriageSerializer,
)

# filters
from .filters import (
    AppointmentFilter,
    PatientFilter
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
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PatientFilter

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


class PatientByUserIdAPIView(APIView):
    def get_object(self, user_id: int):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None
    
    @extend_schema(
        responses=PatientSerializer,
    )
    def get(self, request: Request, user_id:int=None, *args, **kwargs):
        user = self.get_object(user_id)

        if user is None:
            return Response({"error_message": f"user id {user_id} doesn't exist"})
        
        patient = Patient.objects.filter(user_id__pk=user.pk)
        if not patient.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = PatientSerializer(patient.first())
        return Response(serializer.data, status=status.HTTP_200_OK)

class NextOfKinViewSet(viewsets.ModelViewSet):
    queryset = NextOfKin.objects.all()
    serializer_class = NextOfKinSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = AppointmentFilter


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


# TODO
# get appointments for a specific doctor
class DoctorAppointmentViewSet(viewsets.ViewSet):
    serializer_class = AppointmentSerializer

    def list(self, request, doctor_id):
        # Retrieve appointments for a specific doctor
        appointments = Appointment.objects.filter(assigned_doctor_id=doctor_id)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)