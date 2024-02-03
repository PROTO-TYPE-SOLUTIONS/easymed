from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import AllowAny
from patient.models import Patient

from django_filters.rest_framework import DjangoFilterBackend

from drf_spectacular.utils import extend_schema, OpenApiParameter

# models
from .models import (
    LabReagent,
    LabTestResult,
    LabTestRequest,
    LabTestCategory,
    LabTestProfile,
    LabEquipment,
    EquipmentTestRequest,
    PublicLabTestRequest,
    LabTestPanel,
    LabTestResultItem,
)
# serializers
from .serializers import (
    LabReagentSerializer,
    LabTestResultSerializer,
    LabTestRequestSerializer,
    LabTestCategorySerializer,
    LabTestProfileSerializer,
    LabEquipmentSerializer,
    EquipmentTestRequestSerializer,
    PublicLabTestRequestSerializer,
    LabTestPanelSerializer,
    LabTestResultItemSerializer,
)

# permissions
from authperms.permissions import (
    IsStaffUser,
    IsDoctorUser,
    IsLabTechUser,
    IsNurseUser,
    IsSystemsAdminUser
)

# utils
from .utils import (
    json_to_hl7,
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

# class LabTestProfileViewSet(viewsets.ModelViewSet):
#     queryset = LabReagent.objects.all()
#     serializer_class = LabTestProfileSerializer
#     permission_classes = (AllowAny,)

class LabEquipmentViewSet(viewsets.ModelViewSet):
    queryset = LabEquipment.objects.all()
    serializer_class = LabEquipmentSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestPanelViewSet(viewsets.ModelViewSet):
    queryset = LabTestPanel.objects.all()
    serializer_class = LabTestPanelSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestProfileViewSet(viewsets.ModelViewSet):
    queryset = LabTestProfile.objects.all()
    serializer_class = LabTestProfileSerializer
    permission_classes = (AllowAny,)


class LabTestResultViewSet(viewsets.ModelViewSet):
    queryset = LabTestResult.objects.all()
    serializer_class = LabTestResultSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)

class LabTestResultItemViewSet(viewsets.ModelViewSet):
    queryset = LabTestResultItem.objects.all()
    serializer_class = LabTestResultItemSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)    


class LabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = LabTestRequest.objects.all()
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
    def get_object(self, patient: int):
        try:
            return Patient.objects.get(id=patient)
        except Patient.DoesNotExist:
            return None

    @extend_schema(
        responses=LabTestRequestSerializer,
    )
    def get(self, request: Request, patient_id: int, *args, **kwargs):
        patient = self.get_object(patient_id)
        if patient is None:
            return Response({"error_message": f"patient id {patient_id} doesn't exist"})
        
        prescribed_drugs = LabTestRequest.objects.filter(patient=patient)
        if not prescribed_drugs.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = LabTestRequestSerializer(prescribed_drugs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class EquipmentTestRequestViewSet(viewsets.ModelViewSet):
    queryset = EquipmentTestRequest.objects.all()
    serializer_class = EquipmentTestRequestSerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)


class LabTestCategoryViewSet(viewsets.ModelViewSet):
    queryset = LabTestCategory.objects.all()
    serializer_class = LabTestCategorySerializer
    permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)


class PublicLabTestRequestViewSet(viewsets.ModelViewSet):
    queryset = PublicLabTestRequest.objects.all()
    serializer_class = PublicLabTestRequestSerializer
    # permission_classes = (IsDoctorUser | IsNurseUser | IsLabTechUser,)


'''
This view gets the geneated pdf and downloads it ocally
pdf accessed here http://127.0.0.1:8080/download_labtestresult_pdf/26/
'''
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

from django.template.loader import render_to_string
from weasyprint import HTML
from django.template.loader import get_template


from .models import LabTestResult

def download_labtestresult_pdf(request, labtestresult_id):
    labtestresult = get_object_or_404(LabTestResult, pk=labtestresult_id)
    labtestresultitem = LabTestResultItem.objects.filter(result_report=labtestresult)
    html_template = get_template('labtestresult.html').render({
        'labtestresult': labtestresult,
        'labtestresultiem':labtestresultitem
    })


    pdf_file = HTML(string=html_template).write_pdf()
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="invoice_report_{labtestresult_id}.pdf"'

    return response
