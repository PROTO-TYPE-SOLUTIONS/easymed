from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import download_invoice_pdf
from django.conf.urls.static import static

from django.conf import settings


from .views import (
    InvoiceViewset,
    InvoiceItemViewset,
)

router = DefaultRouter()

router.register(r'invoices', InvoiceViewset)
router.register(r'invoice-items', InvoiceItemViewset)

urlpatterns = [
    path('', include(router.urls)),
    path('download_invoice_pdf/<int:invoice_id>/', download_invoice_pdf, name='download_invoice_pdf'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)