from django.shortcuts import render
from rest_framework import generics, permissions

from .models import *
from .serializers import PatientsListSerializer, AppointmentSerializer


class PatientsList(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientsListSerializer



class AppointmentListCreateView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AppointmentRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer