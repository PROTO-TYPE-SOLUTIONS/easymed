from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from customuser.models import CustomUser
from inventory.models import Item
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
    ConvertToAppointmentsSerializer,
    SendConfirmationMailSerializer,
)

# filters
from .filters import (
    AppointmentFilter,
    PatientFilter,
    ConsultationFilter,
    TriageFilter,
    PrescriptionFilter,
    PrescribedDrugFilter
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)

# utils
from .utils import send_appointment_email


class InsuranceCompanyViewSet(viewsets.ModelViewSet):
    queryset = InsuranceCompany.objects.all()
    serializer_class = InsuranceCompanySerializer


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = ConsultationFilter
    


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


class ConvertToAppointmentAPIView(APIView):

    @extend_schema(
        request=ConvertToAppointmentsSerializer,
        responses=ConvertToAppointmentsSerializer,
    )
    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = ConvertToAppointmentsSerializer(data=data)
        if serializer.is_valid():
            code = serializer.create_patient_appointment()
            if code == 400:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)


class PatientByUserIdAPIView(APIView):
    def get_object(self, user_id: int):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        responses=PatientSerializer,
    )
    def get(self, request: Request, user_id: int = None, *args, **kwargs):
        user = self.get_object(user_id)

        if user is None:
            return Response({"error_message": f"user id {user_id} doesn't exist"})

        patient = Patient.objects.filter(user_id__pk=user.pk)
        if not patient.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient.first())
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentsByPatientIdAPIView(APIView):
    def get_object(self, patient_id: int):
        try:
            return Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return None
    @extend_schema(
        responses=AppointmentSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        patient_id = self.kwargs.get('patient_id')
        patient = self.get_object(patient_id)
        if patient is None:
            return Response({"error_message": f"patient id {patient_id} doesn't exist"})
        appointments = Appointment.objects.filter(patient=patient)
        if not appointments.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PrescribedDrugByPatinetIdAPIView(APIView):
    def get_object(self, patient_id: int):
        try:
            return Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return None
    @extend_schema(
        responses=PrescribedDrugSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        patient_id = self.kwargs.get('patient_id')
        patient = self.get_object(patient_id)
        if patient is None:
            return Response({"error_message": f"patient id {patient_id} doesn't exist"})
        prescribed_drugs = PrescribedDrug.objects.filter(patient_id=patient_id)
        if not prescribed_drugs.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PrescribedDrugSerializer(prescribed_drugs, many=True)
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
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PrescriptionFilter


class PrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PrescribedDrugFilter


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all()
    serializer_class = ReferralSerializer


class TriageViewSet(viewsets.ModelViewSet):
    queryset = Triage.objects.all()
    serializer_class = TriageSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = TriageFilter


# # TODO
# # get appointments for a specific doctor
# class DoctorAppointmentViewSet(viewsets.ViewSet):
#     serializer_class = AppointmentSerializer

#     def list(self, request, doctor_id):
#         # Retrieve appointments for a specific doctor
#         appointments = Appointment.objects.filter(assigned_doctor_id=doctor_id)
#         serializer = AppointmentSerializer(appointments, many=True)
#         return Response(serializer.data)


class SendAppointmentConfirmationAPIView(APIView):
    @extend_schema(
        request=SendConfirmationMailSerializer,
        responses=str,
    )



    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = SendConfirmationMailSerializer(data=data)

        if serializer.is_valid():
            print(serializer.validated_data)
            appointments = serializer.validated_data.get("appointments")
            send_appointment_email(appointments)
            return Response("email sent successfully", status=status.HTTP_200_OK)

