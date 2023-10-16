
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from rest_framework.views import APIView

from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)

# serializers

# models
from .models import (
    Receptionist,
    ReceptionistProfile,
)


class AssignPatientToDoctorAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass


class RegisterWalkInPatientsAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass


class ConvertAppointmentBookingToPatientAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass

class DischargePatientsAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass


class PrintInvoiceAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass

class PrintReceiptAPIView(APIView):
    def post(self, request: Request, *args, **kwargs):
        pass