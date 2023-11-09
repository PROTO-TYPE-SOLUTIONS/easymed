# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('doctors/', DoctorsAPIView.as_view(), name='doctors'),
    path('nurses/', NurseAPIView.as_view(), name='nurses'),
    path('labtechs/', LabTechAPIView.as_view(), name='labtechs'),
    path('receptionists', ReceptionistAPIView.as_view(), name='receptionists'),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
]

