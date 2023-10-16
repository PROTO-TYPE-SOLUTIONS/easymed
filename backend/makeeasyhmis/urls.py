from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('pharmacy/', include('pharmacy.urls')),
    path('patients/', include('patient.urls')),
    path('users/', include('customuser.urls')),

    path('api/v1/lab/', include('laboratory.urls')), 
    path('api/v1/inventory/', include('inventory.urls')), 
    path("api/v1/authperms/", include("authperms.urls")),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc",),  
    path("docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
