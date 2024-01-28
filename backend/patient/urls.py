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
    TriageViewSet,
    PatientByUserIdAPIView,
    ConvertToAppointmentAPIView,
    SendAppointmentConfirmationAPIView,
    AppointmentsByPatientIdAPIView,
    PrescribedDrugByPatinetIdAPIView,
    PrescribedDrugByPrescriptionViewSet,
    download_prescription_pdf
)

router = DefaultRouter()
router.register(r'insurance-companies', InsuranceCompanyViewSet)
router.register(r'contact-details', ContactDetailsViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'next-of-kin', NextOfKinViewSet)

router.register(r'publicappointments', PublicAppointmentViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'prescribed-drugs', PrescribedDrugViewSet)
router.register(r'consultations', ConsultationViewSet)
router.register(r'referrals', ReferralViewSet)
router.register(r'triage', TriageViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')
# router.register(r'prescribed_drugs_by_prescription', PrescribedDrugByPrescriptionViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('patients/<int:user_id>/', PatientByUserIdAPIView.as_view(), name="patient-by-userid"),
    
    path('appointments/by_patient_id/<int:patient_id>/', AppointmentsByPatientIdAPIView.as_view(), name="appointment-by-patientid"),
    path('prescribed-drugs/by_patient_id/<int:patient_id>/', PrescribedDrugByPatinetIdAPIView.as_view(), name="prescribed-drug-by-patientid"),

    path('convert-to-appointment/', ConvertToAppointmentAPIView.as_view(), name="convert-to-appointment"),
    path('send-appointment-confirmation/', SendAppointmentConfirmationAPIView.as_view(), name="send-appointment-confirmation"),
    
    path('prescribed-drugs/by-prescription/<int:prescription_id>/', PrescribedDrugByPrescriptionViewSet.as_view({'get': 'list'}), name='prescribed_drugs_by_prescription'),

    path('download_prescription_pdf/<int:prescription_id>/', download_prescription_pdf, name='download_prescription_pdf'),
]
