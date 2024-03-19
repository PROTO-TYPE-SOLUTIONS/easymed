from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CompanyViewSets,
    CompanyBranchViewSets
)

router = DefaultRouter()

router.register(r'company', CompanyViewSets)
router.register(r'company-branch', CompanyBranchViewSets)

urlpatterns = [
    path('', include(router.urls)),
]