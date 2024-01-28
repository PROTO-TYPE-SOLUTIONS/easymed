from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
from django.conf.urls.static import static

from billing.views import download_invoice_pdf
from inventory.views import download_requisition_pdf
from laboratory.views import download_labtestresult_pdf
from patient.views import download_prescription_pdf

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


urlpatterns = [
    # announcement
    path('announcement/', include('announcement.urls')),

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


    path('download_invoice_pdf/<int:invoice_id>/', download_invoice_pdf, name='download_invoice_pdf'),
    path('download_requisition_pdf/<int:requisition_id>/', download_requisition_pdf, name='download_requisition_pdf'),
    path('download_labtestresult_pdf/<int:labtestresult_id>/', download_labtestresult_pdf, name='download_labtestresult_pdf'),

    path('download_prescription_pdf/<int:prescription_id>/', download_prescription_pdf, name='download_prescription_pdf'),


]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
