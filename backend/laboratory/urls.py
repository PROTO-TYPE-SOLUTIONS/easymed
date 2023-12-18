# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabReagentViewSet,
    LabTestResultViewSet,
    LabTestRequestViewSet,
    LabTestCategoryViewSet,
    LabTestProfileViewSet,
    LabEquipmentViewSet,
    EquipmentTestRequestViewSet,
    PublicLabTestRequestViewSet,
    LabTestProfileViewSet,
    LabTestRequestByPatientIdAPIView,
)

router = DefaultRouter()
router.register(r'lab-reagents', LabReagentViewSet)
router.register(r'lab-test-profile', LabTestProfileViewSet)
router.register(r'lab-test-results', LabTestResultViewSet)
router.register(r'lab-test-requests', LabTestRequestViewSet)
router.register(r'lab-test-categories', LabTestCategoryViewSet)
router.register(r'lab-equipment', LabEquipmentViewSet)
router.register(r'equipment-test-request', EquipmentTestRequestViewSet)
router.register(r'public-lab-test-request', PublicLabTestRequestViewSet)
router.register(r'lab-test-profile', LabTestProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('lab-test-request-by-patient-id/<int:patient_id>/', LabTestRequestByPatientIdAPIView.as_view()),
]
