# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LabReagentViewSet,
    LabTestResultViewSet,
    LabTestRequestViewSet,
    LabTestCategoryViewSet,
)

router = DefaultRouter()
router.register(r'lab-reagents', LabReagentViewSet)
router.register(r'lab-results', LabTestResultViewSet)
router.register(r'lab-tests', LabTestRequestViewSet)
router.register(r'lab-test-categories', LabTestCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
