from rest_framework import viewsets
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import PublicPrescriptionRequest, DrugsFeedback
from .serializers import PublicPrescriptionRequestSerializer, DrugsFeedbackSerializer

class PublicPrescriptionRequestViewSet(viewsets.ModelViewSet):
    queryset = PublicPrescriptionRequest.objects.all()
    serializer_class = PublicPrescriptionRequestSerializer 


class PublicPrescriptionRequestByPatientIDView(generics.ListAPIView):
    serializer_class = PublicPrescriptionRequestSerializer 
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        queryset = PublicPrescriptionRequest.objects.filter(patient_id=patient_id)
        return queryset
    

class DrugsFeedbackViewSet(viewsets.ModelViewSet):
    queryset = DrugsFeedback.objects.all()
    serializer_class = DrugsFeedbackSerializer