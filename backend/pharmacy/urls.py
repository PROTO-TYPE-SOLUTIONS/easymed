from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DrugViewSet

router = DefaultRouter()
router.register(r'drugs', DrugViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
