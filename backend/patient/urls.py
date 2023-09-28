from django.urls import path
from .views import *


urlpatterns = [
    path('patients/', PatientsList.as_view(), name='patients-list'),
    path('appointments/', AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', AppointmentRetrieveUpdateView.as_view(), name='appointment-detail'),
    # path('drugs/<str:pk>/', DrugDetailView.as_view(), name='drugs-detail'),
]
