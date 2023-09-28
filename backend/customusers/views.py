from django.shortcuts import render
from django.contrib.auth.decorators import permission_required
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .serializers import *

from rest_framework import generics, status
from rest_framework.response import Response

class CustomUserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]


class CustomUserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

class DoctorProfileList(generics.ListCreateAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

class DoctorProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

# Create similar views for NurseProfile, SysadminProfile, and LabTechProfile

# @permission_required('customusers.can_create_user', raise_exception=True)
class CreateUser(generics.CreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if the user has 'sysadmin' permission
        if not request.user.has_perm('auth.add_user'):
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        return super().create(request, *args, **kwargs)