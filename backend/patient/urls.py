from django.urls import path
from .views import *


urlpatterns = [
    path('patients/', PatientsList.as_view(), name='patients-list'),
    # path('drugs/<str:pk>/', DrugDetailView.as_view(), name='drugs-detail'),
]
