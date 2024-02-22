from django.urls import path, include
from rest_framework.routers import DefaultRouter


from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PublicPrescriptionRequestViewSet,
    PublicPrescriptionRequestByPatientIDView,
)

router = DefaultRouter()
router.register(r'public-prescription-requests', PublicPrescriptionRequestViewSet)




urlpatterns = [
    path('', include(router.urls)),
    path('public-prescription/by_patient_id/<int:patient_id>/', PublicPrescriptionRequestByPatientIDView.as_view(), name='prescriptions-by-patient'),
]
