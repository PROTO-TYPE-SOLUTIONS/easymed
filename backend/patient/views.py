from django.shortcuts import render
from rest_framework import generics, permissions

from .models import *
from .serializers import PatientsListSerializer


class PatientsList(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientsListSerializer