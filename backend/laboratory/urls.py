# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabReagentViewSet,
    PatientIdentifierViewSet,
    LabResultViewSet,
    LabTestViewSet,
    LabTestCategoryViewSet,
)

router = DefaultRouter()
router.register(r'lab-reagents', LabReagentViewSet)
router.register(r'patient-identifiers', PatientIdentifierViewSet)
router.register(r'lab-results', LabResultViewSet)
router.register(r'lab-tests', LabTestViewSet)
router.register(r'lab-test-categories', LabTestCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
