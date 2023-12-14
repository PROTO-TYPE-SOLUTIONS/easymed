from django.urls import path, include
from rest_framework.routers import DefaultRouter


from .views import (
    InvoiceViewset,
    InvoiceItemViewset,
)

router = DefaultRouter()

router.register(r'invoices', InvoiceViewset)
router.register(r'invoice-items', InvoiceItemViewset)

urlpatterns = [
    path('', include(router.urls)),
]
