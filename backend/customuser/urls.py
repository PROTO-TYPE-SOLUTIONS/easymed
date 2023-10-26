# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('doctors/', DoctorsAPIView.as_view(), name='doctors'),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
]