from rest_framework import viewsets, status

from rest_framework.request import Request
from rest_framework.response import Response

from rest_framework.permissions import AllowAny

from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema


# models
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
# serializers
from .serializers import (
    InsuranceCompanySerializer,
    ContactDetailsSerializer,
    PatientSerializer,
    NextOfKinSerializer,
    AppointmentSerializer,
    PrescriptionSerializer,
    PrescribedDrugSerializer,
    PublicAppointmentSerializer ,
    ServiceSerializer  ,
    CreatePatientSerializer
)

class InsuranceCompanyViewSet(viewsets.ModelViewSet):
    queryset = InsuranceCompany.objects.all()
    serializer_class = InsuranceCompanySerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer  

class ContactDetailsViewSet(viewsets.ModelViewSet):
    queryset = ContactDetails.objects.all()
    serializer_class = ContactDetailsSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class NextOfKinViewSet(viewsets.ModelViewSet):
    queryset = NextOfKin.objects.all()
    serializer_class = NextOfKinSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


class PublicAppointmentViewSet(viewsets.ModelViewSet):
    queryset = PublicAppointment.objects.all()
    serializer_class = PublicAppointmentSerializer    

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

class PrescribedDrugViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer

# 
class CreatePublicAppointmentAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass


class CreatePatientAPIView(APIView):
    permission_classes = (AllowAny,)
    @extend_schema(
        request =CreatePatientSerializer,
    )
    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = CreatePatientSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        message = serializer.create_patient()
        return Response(message, status=status.HTTP_201_CREATED)
    
