from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserListViewSet)

from .views import ResetPasswordView

urlpatterns = [
    path('doctors/', DoctorsAPIView.as_view(), name='doctors'),
    path('nurses/', NurseAPIView.as_view(), name='nurses'),
    path('labtechs/', LabTechAPIView.as_view(), name='labtechs'),
    path('receptionists', ReceptionistAPIView.as_view(), name='receptionists'),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),

    path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),

    path('', include(router.urls)),
]

