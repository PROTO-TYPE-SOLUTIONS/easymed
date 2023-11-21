from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InsuranceCompanyViewSet,
    ContactDetailsViewSet,
    PatientViewSet,
    NextOfKinViewSet,
    AppointmentViewSet,
    PrescriptionViewSet,
    PrescribedDrugViewSet,
    PublicAppointmentViewSet,
    ServiceViewSet,
    ConsultationViewSet,
    ReferralViewSet,
    DoctorAppointmentViewSet,
    TriageViewSet,
    PatientByUserIdAPIView,
    ConvertToAppointmentAPIView
)

router = DefaultRouter()
router.register(r'insurance-companies', InsuranceCompanyViewSet)
router.register(r'contact-details', ContactDetailsViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'next-of-kin', NextOfKinViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'publicappointments', PublicAppointmentViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'prescribed-drugs', PrescribedDrugViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'referrals', ReferralViewSet)
router.register(r'triage', TriageViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')



urlpatterns = [
    path('', include(router.urls)),
    path('patients/<int:user_id>/', PatientByUserIdAPIView.as_view(), name="patient-by-userid"),
    path('convert-to-appointment/', ConvertToAppointmentAPIView.as_view(), name="convert-to-appointment"),
]
