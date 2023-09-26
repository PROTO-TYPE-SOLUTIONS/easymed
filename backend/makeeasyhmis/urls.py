from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/pharmacy', include('pharmacy.urls')),
    path('api/v1/patients', include('patient.urls')),
]
