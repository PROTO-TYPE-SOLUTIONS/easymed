from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    # patients
    path('patients/', include('patient.urls')),
    # lab
    path('lab/', include('laboratory.urls')),
    # billing
    path('billing/', include('billing.urls')),
    # inventory
    path('inventory/', include('inventory.urls')),
    # authperms/sysadmin
    path('authperms/', include('authperms.urls')),
    # customuser
    path('customuser/', include('customuser.urls')),
    # users
    path('users/', include('customuser.urls')),
    # schemas
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc",),  
    path("docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)#imp for what you want to achieve.
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
