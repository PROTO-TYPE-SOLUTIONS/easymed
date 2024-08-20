from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend


# permissions
from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser,
    IsPatientUser,
    IsReceptionistUser,

)


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



'''
Get prescribed drugs by prescription ID
'''
class PrescribedDrugByPrescriptionViewSet(viewsets.ModelViewSet):
    queryset = PrescribedDrug.objects.all()
    serializer_class = PrescribedDrugSerializer

    # Override the queryset to filter by prescription_id
    def get_queryset(self):
        prescription_id = self.kwargs.get('prescription_id')
        print(f"Prescription ID: {prescription_id}")
        return PrescribedDrug.objects.filter(prescription__id=prescription_id)


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



'''
This view gets the geneated pdf and downloads it locally
pdf accessed here http://127.0.0.1:8080/download_prescription_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.conf import settings
import os


from django.template.loader import render_to_string
from weasyprint import HTML
from company.models import Company

def download_prescription_pdf(request, prescription_id):
    prescription = get_object_or_404(Prescription, pk=prescription_id)
    prescribed_drugs = PrescribedDrug.objects.filter(prescription=prescription)
    company = Company.objects.first()

    # Render the HTML template with the context
    html = render_to_string('prescription.html', {
        'prescription': prescription,
        'prescribed_drugs': prescribed_drugs,
        'company': company
        })

    # Use WeasyPrint to generate the PDF from the rendered HTML
    pdf_file = HTML(string=html).write_pdf()

    # Create the HTTP response with the PDF file
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{prescription.id}.pdf"'
    return response


class PatientHistoryData(APIView):
    def get_data(self, request, id):
        #retrieve all the records based on the patient id
        patient = Patient.objects.filter(patient_id=id)
        triage = Triage.objects.filter(patient_id=id)
        appointments = Appointment.objects.filter(patient_id=id)
        consultations = Consultation.objects.filter(patient_id=id)
        prescriptions = Prescription.objects.filter(prescription__patient_id=id)
        referrals = Referral.objects.filter(referral__patient_id=id)
        
        #serializing the retrieved data
        patient_serializer = PatientSerializer(patient, many=True)
        triage_serializer = TriageSerializer(triage, many=True)
        appointments_serializer = AppointmentSerializer(appointments, many=True)
        consultations_serializer = ConsultationSerializer(consultations, many=True)
        prescriptions_serializer = PrescriptionSerializer(prescriptions, many=True)
        referrals_serializer = ReferralSerializer(referrals, many=True)

        #returning a JSON response containing all the serialized data
        return Response({
            'patient': patient_serializer.data,
            'triage': triage_serializer.data,
            'appointments': appointments_serializer.data,
            'consultations': consultations_serializer.data,
            'prescriptions': prescriptions_serializer.data,
            'referrals': referrals_serializer.data
        }, status=status.HTTP_200_OK)