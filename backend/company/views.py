from django.shortcuts import render
from rest_framework import viewsets
from .models import Company, CompanyBranch
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import CompanySerializer, CompanyBranchSerializer


class CompanyViewSets(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_class = (IsAuthenticated)


class CompanyBranchViewSets(viewsets.ModelViewSet):
    queryset = CompanyBranch.objects.all()
    serializer_class = CompanyBranchSerializer
    permission_class = (IsAuthenticated)