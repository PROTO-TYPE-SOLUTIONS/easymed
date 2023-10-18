from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    # pharmacy
    path('pharmacy/', include('pharmacy.urls')),
    # patients
    path('patients/', include('patient.urls')),
    # users
    path('users/', include('customuser.urls')),
    # lab
    path('api/v1/lab/', include('laboratory.urls')), 
    # inventory
    path('api/v1/inventory/', include('inventory.urls')), 
    # authperms
    path("api/v1/authperms/", include("authperms.urls")),
    # receptions
    path("api/v1/receptions/", include("receptions.urls")),
    # swagger view
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc",),  
    path("docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
