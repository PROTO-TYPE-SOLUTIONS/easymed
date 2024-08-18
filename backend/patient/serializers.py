from django.utils import timezone
from rest_framework import serializers
from .models import (
    ContactDetails,
    Patient,
    NextOfKin,
    Appointment,
    Prescription,
    PrescribedDrug,
    PublicAppointment,
    Consultation,
    Referral,
    Triage,
    AttendanceProcess,
)
from company.serializers import InsuranceCompanySerializer
from inventory.models import (
    Inventory,
    Item,
)
from billing.models import InvoiceItem
from billing.serializers import InvoiceItemSerializer

class ContactDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactDetails
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = "__all__"

    def get_age(self, obj: Patient):
        if obj.age:
            return obj.age
        return None
    
    def get_patient_insurances(self, obj: Patient):
        return [{"id": insurance.id, "name": insurance.name} for insurance in obj.insurances.all()]
    

    def to_representation(self, instance: Patient):
        data = super().to_representation(instance)
        data["gender"] = instance.get_gender_display()
        data["insurances"] = self.get_patient_insurances(instance)
        return data


class NextOfKinSerializer(serializers.ModelSerializer):
    class Meta:
        model = NextOfKin
        fields = '__all__'


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'


class ConvertToAppointmentsSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    second_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    date_of_birth = serializers.DateTimeField()
    gender = serializers.ChoiceField(choices=PublicAppointment.GENDER_CHOICES)
    appointment_date_time = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=PublicAppointment.STATUS_CHOICES)
    reason = serializers.CharField()

    def create_patient_appointment(self) -> int:
        try:
            patient = Patient.objects.create(
                first_name = self.validated_data.get("first_name"),
                second_name = self.validated_data.get("second_name"),
                date_of_birth = self.validated_data.get("date_of_birth"),
                gender = self.validated_data.get("gender"),
                email = self.validated_data.get("email"),
                phone_number = self.validated_data.get("phone_number"),
            )
        except Exception as e:
            return 400
        
        try:
            Appointment.objects.create(
                appointment_date_time = self.validated_data.get("appointment_date_time"),
                patient = patient,
                status = self.validated_data.get("status"),
                reason = self.validated_data.get("reason"),
            )
        except Exception as e:
            return 400
        

        return 201
    
class PublicAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicAppointment
        fields = [
            "id",
            'item',
            'first_name',
            'second_name',
            'date_of_birth',
            'gender',
            'appointment_date_time',
            'status',
            'reason',
            'date_created',
        ]
        read_only_fields = ("id", "date_created",)

    def to_representation(self, instance: PublicAppointment):
        data = super().to_representation(instance)
        data["gender"] = instance.get_gender_display()
        data["status"] = instance.get_status_display()
        if instance.item:
            data["item"] = instance.item.name
        return data

    def get_item_name(self, obj: PublicAppointment):
        return obj.item.name


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class PrescribedDrugSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    sale_price = serializers.SerializerMethodField()

    class Meta:
        model = PrescribedDrug
        fields = '__all__'


    def get_sale_price(self, instance):
        inventory = instance.item.inventory_set.first()
        return inventory.sale_price if inventory else None


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = '__all__'


# get appointments for a specific doctor
class AppointmentSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(
        queryset = Patient.objects.all(),
        required = False,
        allow_null= True,
    )
    item_name = serializers.ReadOnlyField(source='item.name')
    sale_price = serializers.SerializerMethodField()
    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ("id", "date_created", "date_changed")

    
    def to_representation(self, instance: Appointment):
        data = super().to_representation(instance)
        if instance.assigned_doctor:
            data["assigned_doctor"] = instance.assigned_doctor.get_fullname()

        if instance.patient:
            data["first_name"] = instance.patient.first_name
            data["second_name"] = instance.patient.second_name
            data["gender"] = instance.patient.gender
            data["age"] = instance.patient.age

        return data

    def get_sale_price(self, instance):
        if instance.item:
            inventory = instance.item.inventory_set.first()
            return inventory.sale_price if inventory else None
        return None


class TriageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Triage
        fields = '__all__'


class SendConfirmationMailSerializer(serializers.Serializer):
    appointments = serializers.PrimaryKeyRelatedField(
        queryset = Appointment.objects.all(),
        many = True,
        required = True,
        allow_null = False,
    )

class AttendanceProcessSerializer(serializers.ModelSerializer):
    insurances = serializers.SerializerMethodField()
    invoice_items = serializers.SerializerMethodField()
    class Meta:
        model = AttendanceProcess
        fields = '__all__'

    def get_insurances(self, obj):
        insurances = obj.patient.insurances.all()
        return InsuranceCompanySerializer(insurances, many=True).data
    
    def get_invoice_items(self, obj):
        invoice = obj.invoice.pk
        invoice_items = InvoiceItem.objects.filter(invoice=invoice)
        serialized_items = InvoiceItemSerializer(invoice_items, many=True)
        return serialized_items.data
    