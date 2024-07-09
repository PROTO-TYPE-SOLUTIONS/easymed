from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import AllowAny, IsAuthenticated
from patient.models import Patient
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import (
    LabReagent,
    LabTestRequest,
    LabTestProfile,
    LabEquipment,
    EquipmentTestRequest,
    PublicLabTestRequest,
    LabTestPanel,
    LabTestRequestPanel,
    ProcessTestRequest,
    PatientSample
)

from .serializers import (
    LabReagentSerializer,
    LabTestRequestSerializer,
    LabTestProfileSerializer,
    LabEquipmentSerializer,
    EquipmentTestRequestSerializer,
    PublicLabTestRequestSerializer,
    LabTestPanelSerializer,
    LabTestRequestPanelSerializer,
    ProcessTestRequestSerializer,
    PatientSampleSerializer
)


from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser,
    IsPatientUser
)

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

from django.template.loader import render_to_string
from weasyprint import HTML
from django.template.loader import get_template
from company.models import Company
from patient.models import AttendanceProcess

# utils
from .utils import (
    send_through_rs232,
    send_through_tcp
)

# filters
from .filters import (
    LabTestRequestFilter,
)

class LabReagentViewSet(viewsets.ModelViewSet):
    queryset = LabReagent.objects.all()
    serializer_class = LabReagentSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabEquipmentViewSet(viewsets.ModelViewSet):
    queryset = LabEquipment.objects.all()
    serializer_class = LabEquipmentSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)


'''Lab Test Profile and Panel'''
class LabTestProfileViewSet(viewsets.ModelViewSet):
    queryset = LabTestProfile.objects.all()
    serializer_class = LabTestProfileSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser | IsPatientUser,)


class LabTestPanelViewSet(viewsets.ModelViewSet):
    queryset = LabTestPanel.objects.all()
    serializer_class = LabTestPanelSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)
    
    @action(detail=False, methods=['get'], url_path='labtestpanels-byprofile-id/(?P<profile_id>[^/.]+)')
    def by_test_profile(self, request, profile_id=None):
        """
        Retrieve LabTestPanel items by a given TestProfile ID.
        """
        try:
            test_profile = LabTestProfile.objects.get(pk=profile_id)
        except LabTestProfile.DoesNotExist:
            return Response({"error": "Test Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        lab_test_panels = LabTestPanel.objects.filter(test_profile=test_profile)
        serializer = LabTestPanelSerializer(lab_test_panels, many=True)
        return Response(serializer.data)


'''Lab Test Request and lab Test Request Panel'''
class LabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = LabTestRequest.objects.all().order_by('-id')
    serializer_class = LabTestRequestSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = LabTestRequestFilter

    @extend_schema(
        parameters=[
            OpenApiParameter(name='equipment', type=int,
                            location=OpenApiParameter.PATH)
        ],
    )
    @action(methods=['post'], detail=True)
    def send_to_equipment(self, request: Request,  equipment_id, pk=None):
        instance: LabTestRequest = self.get_object()
        try:
            equipment: LabEquipment = LabEquipment.objects.get(pk=equipment_id)
        except LabEquipment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if(equipment.data_format == "hl7"):
            data = json_to_hl7(instance)
            if equipment.category == "rs32":
                send_through_rs232(data=data)
                return Response({"message": "Data sent to RS232 equipment"}, status=status.HTTP_200_OK)
            if equipment.category == 'tcp':
                send_through_tcp(data=data)
                return Response({"message": "Data sent to TCP equipment"}, status=status.HTTP_200_OK)
        return Response({"message": "Functionality coming soon"}, status=status.HTTP_200_OK)



class LabTestRequestByPatientIdAPIView(APIView):
    def get_lab_test_requests_by_patient(self, patient_id: int):
        try:
            patient = get_object_or_404(Patient, id=patient_id)
            attendance_processes = AttendanceProcess.objects.filter(patient=patient)
            process_test_requests = ProcessTestRequest.objects.filter(attendanceprocess__in=attendance_processes)
            lab_test_requests = LabTestRequest.objects.filter(process__in=process_test_requests)
            return lab_test_requests
        except Patient.DoesNotExist:
            return None

    @extend_schema(
        responses=LabTestRequestSerializer,
    )
    def get(self, request: Request, patient_id: int, *args, **kwargs):
        lab_test_requests = self.get_lab_test_requests_by_patient(patient_id)
        if lab_test_requests is None:
            return Response({"error_message": f"Patient ID {patient_id} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        
        if not lab_test_requests.exists():
            return Response({"error_message": "No lab test requests found for the given patient"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LabTestRequestSerializer(lab_test_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class LabTestRequestPanelViewSet(viewsets.ModelViewSet):
    queryset = LabTestRequestPanel.objects.all()
    serializer_class = LabTestRequestPanelSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)    


class LabTestRequestPanelByLabTestRequestId(generics.ListAPIView):
    serializer_class = LabTestRequestPanelSerializer

    def get_queryset(self):
        lab_test_request_id = self.kwargs['lab_test_request_id']
        return LabTestRequestPanel.objects.filter(lab_test_request_id=lab_test_request_id)
    
    
class PatientSampleByProcessId(generics.ListAPIView):
    serializer_class = PatientSampleSerializer 

    def get_queryset(self):
        process_id = self.kwargs['process_id']
        return PatientSample.objects.filter(process=process_id)

class LabTestRequestByProcessId(generics.ListAPIView):
    serializer_class = LabTestRequestSerializer

    def get_queryset(self):
        process_id = self.kwargs['process_id']
        return LabTestRequest.objects.filter(process_id=process_id)

# '''Lab Test Result and Test Result Panel'''
# class LabTestResultViewSet(viewsets.ModelViewSet):
#     queryset = LabTestResult.objects.all()
#     serializer_class = LabTestResultSerializer
#     permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)


# class LabTestResultPanelViewSet(viewsets.ModelViewSet):
#     queryset = LabTestResultPanel.objects.all()
#     serializer_class = LabTestResultPanelSerializer
#     permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)   


# class LabTestResultPanelByLabTestResultId(generics.ListAPIView):
#     serializer_class = LabTestResultPanelSerializer

#     def get_queryset(self):
#         lab_test_result_id = self.kwargs['lab_test_result_id']
#         return LabTestResultPanel.objects.filter(lab_test_result_id=lab_test_result_id)

class EquipmentTestRequestViewSet(viewsets.ModelViewSet):
    queryset = EquipmentTestRequest.objects.all()
    serializer_class = EquipmentTestRequestSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)



class PublicLabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = PublicLabTestRequest.objects.all()
    serializer_class = PublicLabTestRequestSerializer
    permission_classes = (IsDoctorUser | IsPatientUser,)

# class ResultsVerificationViewSet(viewsets.ModelViewSet):
#     queryset = ResultsVerification.objects.all()
#     serializer_class = ResultsVerificationSerializer


class ProcessTestRequestViewSet(viewsets.ModelViewSet):
    queryset = ProcessTestRequest.objects.all().order_by('-id')
    serializer_class = ProcessTestRequestSerializer

class PatientSampleViewSet(viewsets.ModelViewSet):
    queryset = PatientSample.objects.all().order_by('-id')
    serializer_class = PatientSampleSerializer


'''
This view gets the geneated pdf and downloads it ocally
pdf accessed here http://127.0.0.1:8080/download_labtestresult_pdf/26/
'''
def download_labtestresult_pdf(request, processtestrequest_id):
    processtestrequest = get_object_or_404(ProcessTestRequest, pk=processtestrequest_id)
    labtestrequests = LabTestRequest.objects.filter(process=processtestrequest)
    panels = LabTestRequestPanel.objects.filter(lab_test_request__in=labtestrequests)
    company = Company.objects.first()

    # Retrieve the patient from the AttendanceProcess linked via ProcessTestRequest
    attendance_process = get_object_or_404(AttendanceProcess, process_test_req=processtestrequest)
    patient = attendance_process.patient

    html_template = get_template('labtestresult.html').render({
        'processtestrequest': processtestrequest,
        'labtestrequests': labtestrequests,
        'panels': panels,
        'patient': patient,
        'company': company,
        'attendance_process': attendance_process,
        'approved_on': panels.first().approved_on if panels.exists() else None
    })

    pdf_file = HTML(string=html_template).write_pdf()

    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="labtest_report_{processtestrequest_id}.pdf"'

    return response





class LabTestRequestPanelBySampleView(generics.ListAPIView):
    serializer_class = LabTestRequestPanelSerializer

    def get(self, request, *args, **kwargs):
        patient_sample_id = self.kwargs.get('patient_sample_id')
        try:
            patient_sample = PatientSample.objects.get(id=patient_sample_id)
        except PatientSample.DoesNotExist:
            return Response({"error": "PatientSample not found"}, status=status.HTTP_404_NOT_FOUND)

        lab_test_request_panels = LabTestRequestPanel.objects.filter(patient_sample=patient_sample)
        serializer = LabTestRequestPanelSerializer(lab_test_request_panels, many=True)
        return Response(serializer.data)