from django.urls import path
from .views import get_invoice_items_by_date_range

urlpatterns = [
    path('sale_by_date/', get_invoice_items_by_date_range, name='generate_pdf'),
]
