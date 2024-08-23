import django_filters 

# models
from .models import (
    Appointment,
    Patient,
    Consultation,
    Triage,
    Prescription,
    PrescribedDrug,
)


class AppointmentFilter(django_filters.FilterSet):
    patient__id_umber = django_filters.NumberFilter(lookup_expr='exact', label='patient_id')
    assigned_doctor__id = django_filters.NumberFilter(lookup_expr='exact', label='doctor_id')
    class Meta:
        model = Appointment
        fields = ("patient__id_number", "assigned_doctor__id", "status",)

class PatientFilter(django_filters.FilterSet):
    first_name = django_filters.CharFilter(lookup_expr='icontains')
    second_name = django_filters.CharFilter(lookup_expr='icontains')
    user_id__id = django_filters.NumberFilter(lookup_expr='exact', label='user_id')
    id_number = django_filters.NumberFilter(lookup_expr= 'exact', label= 'id_number')
    class Meta:
        model = Patient
        fields = ("id_number", "user_id__id", "first_name", "second_name", "gender")


class ConsultationFilter(django_filters.FilterSet):
    doctor_ID__id = django_filters.NumberFilter(lookup_expr='exact', label='doctor_id')
    patient__id_number = django_filters.NumberFilter(lookup_expr='exact', label='patient_id')
    class Meta:
        model = Consultation
        fields = ("doctor_ID__id", "patient__id_number",)


class TriageFilter(django_filters.FilterSet):
    patient__id_number = django_filters.NumberFilter(lookup_expr='exact', label='patient_id')
    class Meta:
        model = Triage
        fields = ("patient__id_number", )

class PrescriptionFilter(django_filters.FilterSet):
    patient__id_number = django_filters.NumberFilter(lookup_expr='exact', label='patient_id')
    class Meta:
        model = Prescription
        fields = ("patient__id_number", "status")

class PrescribedDrugFilter(django_filters.FilterSet):
    prescription_id__id = django_filters.NumberFilter(lookup_expr='exact', label='prescription_id')
    item_ID__id = django_filters.NumberFilter(lookup_expr='exact', label='item_id')
    class Meta:
        model = PrescribedDrug
        fields = ("prescription_id__id", "item_ID__id")


