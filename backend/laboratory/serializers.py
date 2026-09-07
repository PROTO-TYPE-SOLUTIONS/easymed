import pdb
from random import randrange, choices
from inventory.models import ItemConsumable
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from customuser.models import CustomUser
from inventory.services import stock as stock_service
from .models import (
    LabReagent,
    LabTestRequest,
    LabTestProfile,
    LabEquipment,
    PublicLabTestRequest,
    LabTestPanel,
    LabTestRequestPanel,
    ProcessTestRequest,
    PatientSample,
    Specimen,
    TestPanelReagent,
    LabTestInterpretation,
    ReferenceValue,
    ReagentConsumptionLog,
    LabSettings,
    Archive,
    ArchiveComponent,
    ArchiveSection,
    ArchiveRack,
    ArchivePosition,
    PatientSampleArchive,
    DisposedSample,
    RetestSample,
    ReleasedSample
    )


class ReagentStockSerializer(serializers.Serializer):
    """
    Reagent availability derived from the stock ledger.

    Replaces the old TestKitCounter table: the number is computed from
    StockMovement rather than maintained as a second copy of the same quantity.
    """
    id = serializers.IntegerField(read_only=True)
    reagent_item = serializers.IntegerField(read_only=True)
    reagent_name = serializers.CharField(read_only=True)
    reagent_code = serializers.CharField(read_only=True)
    available_tests = serializers.IntegerField(read_only=True)
    available_stock = serializers.IntegerField(read_only=True)
    minimum_threshold = serializers.IntegerField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    is_out_of_stock = serializers.BooleanField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    stock_percentage = serializers.FloatField(read_only=True)


# Historical names kept so existing imports and routes keep working.
TestKitCounterSerializer = ReagentStockSerializer
LowStockReagentSerializer = ReagentStockSerializer


class LabReagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabReagent
        fields = '__all__'


class LabTestProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestProfile
        fields = '__all__'


class LabTestPanelSerializer(serializers.ModelSerializer):
    reference_values = serializers.SerializerMethodField()
    available_runs = serializers.SerializerMethodField()
    item_name = serializers.ReadOnlyField(source='item.name')
    test_profile_name = serializers.ReadOnlyField(source='test_profile.name')
    specimen_name = serializers.ReadOnlyField(source='specimen.name')
    unit_symbol = serializers.ReadOnlyField(source='units.symbol')

    class Meta:
        model = LabTestPanel
        fields = "__all__"

    def get_reference_values(self, obj):
        patient = self.context.get('patient')
        if patient:
            return obj.get_reference_values(patient)
        return None

    def get_available_runs(self, obj):
        return obj.available_runs()
    

class PublicLabTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicLabTestRequest
        fields = '__all__'

class LabEquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabEquipment
        fields = '__all__'

class LabTestProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTestProfile
        fields = '__all__'        


class LabTestRequestPanelSerializer(serializers.ModelSerializer):
    test_panel_name = serializers.ReadOnlyField(source='test_panel.name')
    item = serializers.CharField(source='test_panel.item.id', read_only=True)
    sale_price = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    patient_age = serializers.SerializerMethodField()
    patient_sex = serializers.SerializerMethodField()
    reference_values = serializers.SerializerMethodField()
    is_qualitative = serializers.ReadOnlyField(source='test_panel.is_qualitative')
    is_quantitative = serializers.ReadOnlyField(source='test_panel.is_quantitative')
    tat = serializers.DurationField(source='test_panel.tat', read_only=True)

    def get_sale_price(self, instance):
        item = instance.test_panel.item if instance.test_panel else None
        return item.current_sale_price if item else None
        
    def get_patient_name(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return f"{patient.first_name} {patient.second_name}" if patient else None
        return None

    def get_patient_age(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return patient.age if patient else None
        return None

    def get_patient_sex(self, instance):
        if instance.patient_sample and instance.patient_sample.process:
            patient = instance.patient_sample.process.attendanceprocess.patient
            return patient.gender if patient else None
        return None
    
    def get_reference_values(self, instance):
        patient = self._get_patient(instance)
        if not patient:
            return None

        reference_value = instance.test_panel.reference_values.filter(
            sex=patient.gender,
            age_min__lte=patient.age,
            age_max__gte=patient.age
        ).first()
        
        # If no exact match for gender (e.g., gender 'O'), try male reference values as fallback
        if not reference_value and patient.gender not in ['M', 'F']:
            reference_value = instance.test_panel.reference_values.filter(
                sex='M',
                age_min__lte=patient.age,
                age_max__gte=patient.age
            ).first()

        if reference_value:
            return {
                "low": reference_value.ref_value_low,
                "high": reference_value.ref_value_high,
                "critical_low": reference_value.critical_low,
                "critical_high": reference_value.critical_high,
            }
        return None
    
    def _get_patient(self, instance):
        # Helper method to get the patient object
        if instance.patient_sample and instance.patient_sample.process:
            return instance.patient_sample.process.attendanceprocess.patient
        return None
    
    class Meta:
        model = LabTestRequestPanel
        fields = [
            'id',
            'result',
            'result_approved',
            'test_panel',
            'test_panel_name', 
            'item', 
            'sale_price', 
            'patient_name', 
            'patient_age', 
            'patient_sex',
            'reference_values',
            'lab_test_request',
            'is_billed',
            'is_quantitative',
            'is_qualitative',
            'tat',
            'auto_interpretation',
            'clinical_action',
            'requires_attention',
        ]


class LabTestRequestSerializer(serializers.ModelSerializer):
    patient_first_name = serializers.ReadOnlyField(source='patient.first_name')
    patient_last_name = serializers.ReadOnlyField(source='patient.second_name')
    test_profile_name = serializers.ReadOnlyField(source='test_profile.name')
    requested_by_name = serializers.ReadOnlyField(source='requested_by.get_fullname')
    category = serializers.CharField(source='test_profile.category', read_only=True)
    

    class Meta:
        model = LabTestRequest
        fields = "__all__"


class ProcessTestRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessTestRequest
        fields = '__all__'


class PatientSampleSerializer(serializers.ModelSerializer):
    specimen_name = serializers.SerializerMethodField()
    is_archived = serializers.SerializerMethodField()
    is_disposed = serializers.SerializerMethodField()
    is_retested = serializers.SerializerMethodField()
    is_released = serializers.SerializerMethodField()
    consumables = serializers.SerializerMethodField()

    class Meta:
        model = PatientSample
        fields = [
            'id',
            'patient_sample_code',
            'is_sample_collected',
            'specimen',
            'specimen_name',
            'lab_test_request',
            'process',
            'is_archived',
            'is_disposed',
            'is_retested',
            'is_released',
            'collected_on',
            'consumables',
        ]
        read_only_fields = [
            'patient_sample_code',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Shared across every sample this serializer renders, so a list of
        # blood samples looks up the syringe's stock once, not once per row.
        self._availability_cache = {}

    def get_specimen_name(self, obj):
        return obj.specimen.name

    def get_consumables(self, obj):
        """
        What the phlebotomist needs in hand to take this sample, and whether
        the lab actually has it.

        Read off the accompaniments of the tests on this sample -- the same
        rows billing checks before it will let the test be sold -- so the
        collection screen and the till can never disagree about what is
        needed. Stock leaves once, when the test is billed, not here.
        """
        return sample_consumable_rows(obj, self._availability_cache)

    def get_is_archived(self, obj):
        return hasattr(obj, 'archive_record')

    def get_is_disposed(self, obj):
        from .models import DisposedSample
        return DisposedSample.objects.filter(patient_sample_code=obj.patient_sample_code).exists()

    def get_is_retested(self, obj):
        from .models import RetestSample
        return RetestSample.objects.filter(patient_sample_code=obj.patient_sample_code).exists()

    def get_is_released(self, obj):
        return hasattr(obj, 'release_record')

class SpecimenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specimen
        fields = '__all__'


def _available_quantity(item):
    from .utils import lab_department

    return stock_service.available_quantity(item, lab_department())


class TestPanelReagentSerializer(serializers.ModelSerializer):
    test_panel_name = serializers.ReadOnlyField(source='test_panel.name')
    reagent_name = serializers.ReadOnlyField(source='reagent_item.name')
    reagent_code = serializers.ReadOnlyField(source='reagent_item.item_code')
    available_quantity = serializers.SerializerMethodField()

    class Meta:
        model = TestPanelReagent
        fields = [
            'id',
            'test_panel',
            'test_panel_name',
            'reagent_item',
            'reagent_name',
            'reagent_code',
            'units_consumed_per_run',
            'available_quantity',
        ]

    def get_available_quantity(self, obj):
        return _available_quantity(obj.reagent_item)

    def validate_reagent_item(self, value):
        # limit_choices_to only constrains forms, so the API has to check too.
        if value.category != 'LabReagent':
            raise serializers.ValidationError(
                f"'{value.name}' is a {value.category} item, not a Lab Reagent."
            )
        return value


def sample_consumable_rows(sample, availability_cache=None):
    """
    The accompaniments a sample's tests need, one row per consumable.

    A sample carries several panels and they often share a syringe, so the
    requirement is summed per consumable rather than listed per test -- the
    collector wants one line saying "3 swabs", not three saying "1 swab".

    Availability costs an aggregate pair per item, and a page of samples asks
    about the same handful of consumables over and over, so the caller can
    pass a cache to look each one up once.
    """
    cache = {} if availability_cache is None else availability_cache
    totals = {}

    links = ItemConsumable.objects.filter(
        item__labtestpanel__labtestrequestpanel__patient_sample=sample
    ).select_related('consumable')

    for link in links:
        consumable = link.consumable
        row = totals.setdefault(consumable.id, {
            # 'id' and 'item' are the keys the existing collection screen
            # reads; one row per consumable, so the consumable's own id serves.
            'id': consumable.id,
            'consumable': consumable.id,
            'item': consumable.id,
            'item_name': consumable.name,
            'item_code': consumable.item_code,
            'units_of_measure': consumable.units_of_measure,
            'quantity_per_collection': 0,
            'is_required': False,
        })
        row['quantity_per_collection'] += link.quantity_per_use
        row['is_required'] = row['is_required'] or link.is_required

        if consumable.id not in cache:
            cache[consumable.id] = _available_quantity(consumable)
        row['available_quantity'] = cache[consumable.id]

    return sorted(totals.values(), key=lambda row: row['item_name'])


class LabTestInterpretationSerializer(serializers.ModelSerializer):
    test_profile_name = serializers.ReadOnlyField(source='test_profile.name')
    
    class Meta:
        model = LabTestInterpretation
        fields = [
            'id',
            'test_profile',
            'test_profile_name',
            'interpretation',
            'clinical_action',
            'requires_immediate_attention',
            'created_on',
            'updated_on',
        ]
        read_only_fields = ['created_on', 'updated_on']


class ReferenceValueSerializer(serializers.ModelSerializer):
    lab_test_panel_name = serializers.ReadOnlyField(source='lab_test_panel.name')

    class Meta:
        model = ReferenceValue
        fields = [
            'id',
            'lab_test_panel',
            'lab_test_panel_name',
            'sex',
            'age_min',
            'age_max',
            'ref_value_low',
            'ref_value_high',
        ]


class ReagentConsumptionLogSerializer(serializers.ModelSerializer):
    reagent_name = serializers.CharField(source='reagent_item.name', read_only=True)
    test_panel_name = serializers.CharField(source='test_panel.name', read_only=True)
    performed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ReagentConsumptionLog
        fields = [
            'id',
            'reagent_item',
            'reagent_name',
            'test_panel',
            'test_panel_name',
            'tests_consumed',
            'available_tests_before',
            'available_tests_after',
            'stock_movement_reference',
            'consumed_at',
            'patient_name',
            'performed_by',
            'performed_by_name'
        ]
        read_only_fields = ['consumed_at']
    
    def get_performed_by_name(self, obj):
        if obj.performed_by:
            return f"{obj.performed_by.first_name} {obj.performed_by.last_name}"
        return "N/A"


class LabSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSettings
        fields = '__all__'


class ArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Archive
        fields = '__all__'


class ArchiveComponentSerializer(serializers.ModelSerializer):
    archive_name = serializers.ReadOnlyField(source='archive.name')

    class Meta:
        model = ArchiveComponent
        fields = '__all__'


class ArchiveSectionSerializer(serializers.ModelSerializer):
    component_name = serializers.ReadOnlyField(source='component.name')

    class Meta:
        model = ArchiveSection
        fields = '__all__'


class ArchiveRackSerializer(serializers.ModelSerializer):
    section_name = serializers.ReadOnlyField(source='section.name')

    class Meta:
        model = ArchiveRack
        fields = '__all__'


class ArchivePositionSerializer(serializers.ModelSerializer):
    rack_name = serializers.ReadOnlyField(source='rack.name')

    class Meta:
        model = ArchivePosition
        fields = '__all__'


class PatientSampleArchiveSerializer(serializers.ModelSerializer):
    patient_sample_code = serializers.ReadOnlyField(source='patient_sample.patient_sample_code')
    position_name = serializers.ReadOnlyField(source='position.name')
    created_by_name = serializers.ReadOnlyField(source='created_by.get_fullname')
    process_reference = serializers.ReadOnlyField(source='patient_sample.process.reference')
    attendance_process_id = serializers.ReadOnlyField(source='patient_sample.process.attendanceprocess.id')
    expiry_date = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = PatientSampleArchive
        fields = '__all__'

    def get_expiry_date(self, obj):
        from datetime import timedelta
        specimen = obj.patient_sample.specimen
        if specimen and specimen.max_archive_duration and obj.archiving_date:
            return obj.archiving_date + timedelta(days=specimen.max_archive_duration)
        return None

    def get_status(self, obj):
        from django.utils import timezone
        expiry_date = self.get_expiry_date(obj)
        if expiry_date and timezone.now().date() > expiry_date:
            return 'Expired'
        return 'Not Expired'


    def validate(self, attrs):
        position = attrs.get('position')
        patient_sample = attrs.get('patient_sample')
        instance = getattr(self, 'instance', None)

        if position:
            # Check if position is already occupied by another archive
            existing_archive_pos = PatientSampleArchive.objects.filter(position=position)
            if instance:
                existing_archive_pos = existing_archive_pos.exclude(pk=instance.pk)
            if existing_archive_pos.exists():
                raise serializers.ValidationError({
                    "position": "This position is already occupied by another patient sample."
                })

        if patient_sample:
            # Check if this sample is already archived
            existing_archive_sample = PatientSampleArchive.objects.filter(patient_sample=patient_sample)
            if instance:
                existing_archive_sample = existing_archive_sample.exclude(pk=instance.pk)
            if existing_archive_sample.exists():
                raise serializers.ValidationError({
                    "patient_sample": "This patient sample has already been archived."
                })

        return attrs


class DisposedSampleSerializer(serializers.ModelSerializer):
    disposed_by_name = serializers.ReadOnlyField(source='disposed_by.get_fullname')

    class Meta:
        model = DisposedSample
        fields = '__all__'


class RetestSampleSerializer(serializers.ModelSerializer):
    retested_by_name = serializers.ReadOnlyField(source='retested_by.get_fullname')

    class Meta:
        model = RetestSample
        fields = '__all__'


class ReleasedSampleSerializer(serializers.ModelSerializer):
    released_by_name = serializers.ReadOnlyField(source='released_by.get_fullname')

    class Meta:
        model = ReleasedSample
        fields = '__all__'
