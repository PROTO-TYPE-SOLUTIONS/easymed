from django.shortcuts import render
from rest_framework import viewsets
from .models import Company
from rest_framework.permissions import AllowAny, IsAuthenticated



class CompanyViewSets(viewsets.ModelViewSets):
    queryset = Company.objects.all()
    permission_class = (IsAuthenticated)
