import django_filters 

# models
from .models import (
    Appointment,
    Patient,
)


class AppointmentFilter(django_filters.FilterSet):
    patient__id = django_filters.NumberFilter(lookup_expr='exact', label='patient_id')
    assigned_doctor__id = django_filters.NumberFilter(lookup_expr='exact', label='doctor_id')
    class Meta:
        model = Appointment
        fields = ("patient__id", "assigned_doctor__id", "status",)

class PatientFilter(django_filters.FilterSet):
    first_name = django_filters.CharFilter(lookup_expr='icontains')
    second_name = django_filters.CharFilter(lookup_expr='icontains')
    user_id__id = django_filters.NumberFilter(lookup_expr='exact', label='user_id')
    class Meta:
        model = Patient
        fields = ("user_id__id", "first_name", "second_name", "gender")