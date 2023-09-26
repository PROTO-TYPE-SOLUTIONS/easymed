from django.shortcuts import render
from rest_framework import generics, permissions
from .models import *
from .serializers import DrugsListSerializer


class DrugsList(generics.ListCreateAPIView):
    queryset = Drug.objects.all()
    serializer_class = DrugsListSerializer
    

# class DrugDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Drug.objects.all()
#     serializer_class = DrugDetailsSerializer
