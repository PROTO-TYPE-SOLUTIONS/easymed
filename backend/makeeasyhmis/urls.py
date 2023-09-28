from django.contrib import admin
from django.urls import path, include

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/pharmacy/', include('pharmacy.urls')),
    path('api/v1/patients/', include('patient.urls')),
    path('api/v1/users/', include('customusers.urls')),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc",),  
    path("api/v1/docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
