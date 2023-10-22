# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabReagentViewSet,
    LabTestResultViewSet,
    LabTestRequestViewSet,
    LabTestCategoryViewSet,
    LabTestProfileViewSet,
)

router = DefaultRouter()
router.register(r'lab-reagents', LabReagentViewSet)
router.register(r'lab-test-profile', LabTestProfileViewSet)
router.register(r'lab-test-results', LabTestResultViewSet)
router.register(r'lab-test-requests', LabTestRequestViewSet)
router.register(r'lab-test-categories', LabTestCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
