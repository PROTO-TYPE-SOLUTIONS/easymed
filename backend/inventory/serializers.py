from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from rest_framework import serializers

from .models import (
    Department,
    GoodsReceiptNote,
    IncomingItem,
    InsuranceItemSalePrice,
    Item,
    ItemDepartment,
    ItemPrice,
    ItemUnit,
    PurchaseOrder,
    PurchaseOrderItem,
    Quotation,
    QuotationCustomer,
    QuotationItem,
    Requisition,
    RequisitionItem,
    StockBalance,
    StockLot,
    StockMovement,
    StockPolicy,
    StockReservation,
    StockTake,
    StockTakeLine,
    Supplier,
    SupplierInvoice,
    SupplierPaymentAllocation,
    SupplierPaymentReceipt,
    Unit,
)
from .services import stock as stock_service
from .utils import generate_unique_item_code
from .validators import (
    assign_default_supplier,
    greater_than_zero,
    validate_requisition_item_uniqueness,
)

CustomUser = get_user_model()


# ---------------------------------------------------------------------------
# Base serializers
# ---------------------------------------------------------------------------

class BaseItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_code = serializers.CharField(source='item.item_code', required=False)
    buying_price = serializers.DecimalField(
        source='item.buying_price', max_digits=14, decimal_places=2, read_only=True)
    selling_price = serializers.DecimalField(
        source='item.selling_price', max_digits=14, decimal_places=2, read_only=True)
    vat_rate = serializers.DecimalField(
        source='item.vat_rate', max_digits=10, decimal_places=2, read_only=True)


class BaseSupplierSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    preferred_supplier_name = serializers.CharField(source='preferred_supplier.official_name', read_only=True)


# ---------------------------------------------------------------------------
# Catalogue
# ---------------------------------------------------------------------------

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='official_name', read_only=True)  # alias for compatibility

    class Meta:
        model = Supplier
        fields = ['id', 'official_name', 'common_name', 'name']
        read_only_fields = ['id', 'name']


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = '__all__'


class ItemPriceSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = ItemPrice
        fields = ['id', 'item', 'item_name', 'sale_price', 'effective_from', 'effective_to', 'date_created']
        read_only_fields = ['id', 'date_created']


class ItemUnitSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    base_unit = serializers.ReadOnlyField(source='item.units_of_measure')

    class Meta:
        model = ItemUnit
        fields = ['id', 'item', 'item_name', 'name', 'factor_to_base',
                  'base_unit', 'is_purchase_default', 'is_sale_default']

    def validate_factor_to_base(self, value):
        if value <= 1:
            raise serializers.ValidationError(
                "A pack has to hold more than one base unit -- a factor of 1 is the base unit itself."
            )
        return value


class ItemSerializer(serializers.ModelSerializer):
    unit_conversions = ItemUnitSerializer(many=True, read_only=True)
    item_code = serializers.CharField(max_length=255, required=False)
    unit_symbol = serializers.CharField(source='units.symbol', read_only=True)
    # Price is not a column on Item any more; it is the current row of the
    # price list. Writing it opens a new effective-dated price.
    sale_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    buying_price = serializers.DecimalField(max_digits=14, decimal_places=4, read_only=True)
    quantity_at_hand = serializers.IntegerField(read_only=True)
    departments = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), many=True, required=False,
        help_text="Departments that use this item. Tag 'General' to share it with all")
    department_names = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Item
        fields = '__all__'

    def get_department_names(self, obj):
        return list(obj.departments.values_list('name', flat=True))

    def _apply_price(self, item, sale_price):
        if sale_price is not None:
            request = self.context.get('request')
            user = getattr(request, 'user', None) if request else None
            stock_service.set_sale_price(
                item, sale_price,
                created_by=user if user and user.is_authenticated else None,
            )

    def create(self, validated_data):
        sale_price = validated_data.pop('sale_price', None)
        departments = validated_data.pop('departments', None)
        if not validated_data.get('item_code'):
            validated_data['item_code'] = generate_unique_item_code()

        with transaction.atomic():
            item = super().create(validated_data)
            if departments is not None:
                self._set_departments(item, departments)
            self._apply_price(item, sale_price)
        return item

    def update(self, instance, validated_data):
        sale_price = validated_data.pop('sale_price', None)
        departments = validated_data.pop('departments', None)

        with transaction.atomic():
            item = super().update(instance, validated_data)
            if departments is not None:
                self._set_departments(item, departments)
            self._apply_price(item, sale_price)
        return item

    @staticmethod
    def _set_departments(item, departments):
        '''Replace the item's department tags, keeping the first as primary.'''
        wanted_ids = [department.id for department in departments]
        item.department_links.exclude(department_id__in=wanted_ids).delete()

        for index, department in enumerate(departments):
            ItemDepartment.objects.update_or_create(
                item=item, department=department,
                defaults={'is_primary': index == 0},
            )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['sale_price'] = instance.current_sale_price
        return data


class InsuranceItemSalePriceSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    item_id = serializers.ReadOnlyField(source='item.id')
    insurance_name = serializers.ReadOnlyField(source='insurance_company.name')

    class Meta:
        model = InsuranceItemSalePrice
        fields = '__all__'


# ---------------------------------------------------------------------------
# Procurement
# ---------------------------------------------------------------------------

class SupplierInvoiceSerializer(serializers.ModelSerializer):
    total_amount = serializers.DecimalField(source='amount', read_only=True, max_digits=12, decimal_places=2)
    invoice_number = serializers.CharField(source='invoice_no', read_only=True)  # alias for frontend
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    purchase_order_number = serializers.CharField(source='purchase_order.PO_number', read_only=True)
    requisition_number = serializers.SerializerMethodField()
    paid_amount = serializers.SerializerMethodField()

    class Meta:
        model = SupplierInvoice
        fields = ['id', 'invoice_no', 'invoice_number', 'supplier', 'supplier_name', 'purchase_order',
                  'purchase_order_number', 'requisition_number',
                  'status', 'total_amount', 'amount', 'paid_amount', 'date_created']
        read_only_fields = ['total_amount', 'paid_amount', 'date_created', 'requisition_number', 'invoice_number']

    def get_requisition_number(self, obj):
        if obj.purchase_order and obj.purchase_order.requisition:
            return obj.purchase_order.requisition.requisition_number
        return None

    def get_paid_amount(self, obj):
        total_paid = obj.payment_allocations.aggregate(total=Sum('amount_applied'))['total']
        return float(total_paid or 0)


def _unit_cost_for(item, requisition_item=None):
    """Cost for ONE of whatever the line is being ordered in."""
    if requisition_item is not None:
        return Decimal(requisition_item.effective_unit_cost)
    return Decimal(item.current_cost or 0)


class RequisitionItemSerializer(BaseItemSerializer, BaseSupplierSerializer):
    preferred_supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), required=False, write_only=True)
    requisition = serializers.PrimaryKeyRelatedField(source='requisition.id', read_only=True)
    requisition_number = serializers.CharField(source='requisition.requisition_number', read_only=True)
    requisition_date_created = serializers.DateTimeField(source='requisition.date_created', read_only=True)
    requested_by = serializers.CharField(source='requisition.requested_by.get_fullname', read_only=True)
    department_name = serializers.CharField(source='requisition.department.name', read_only=True)
    quantity_at_hand = serializers.SerializerMethodField(read_only=True)
    quantity_requested = serializers.IntegerField()
    quantity_approved = serializers.IntegerField(
        validators=[greater_than_zero("quantity_approved")], required=False)
    ordered = serializers.BooleanField(read_only=True)
    desc = serializers.CharField(source='item.desc', read_only=True)
    requested_amount = serializers.SerializerMethodField(read_only=True)
    unit_label = serializers.ReadOnlyField()
    conversion_factor = serializers.ReadOnlyField()
    base_quantity_requested = serializers.ReadOnlyField()
    base_unit = serializers.ReadOnlyField(source='item.units_of_measure')
    # Quoted per ordering unit, so a box of twelve shows the box price.
    buying_price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RequisitionItem
        fields = ['id', 'requisition_number', 'requisition_date_created', 'requested_by', 'ordered',
                  'item', 'item_code', 'item_name', 'desc', 'quantity_at_hand', 'quantity_requested',
                  'quantity_approved', 'preferred_supplier', 'preferred_supplier_name', 'buying_price',
                  'vat_rate', 'selling_price', 'requested_amount', 'date_created', 'department_name',
                  'requisition', 'unit_cost', 'item_unit', 'unit_label', 'conversion_factor',
                  'base_quantity_requested', 'base_unit']
        read_only_fields = ['id', 'date_created']

    def get_buying_price(self, obj):
        return float(_unit_cost_for(obj.item, obj))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['preferred_supplier'] = instance.preferred_supplier.official_name if instance.preferred_supplier else None
        data['item_code'] = instance.item.item_code
        return data

    def get_quantity_at_hand(self, obj):
        '''Stock on hand at the requesting department, in base units.'''
        return stock_service.on_hand_quantity(obj.item, obj.requisition.department)

    def get_requested_amount(self, obj):
        return float(obj.quantity_requested * _unit_cost_for(obj.item, obj))

    def validate(self, attrs):
        item = attrs.get('item') or getattr(self.instance, 'item', None)
        item_unit = attrs.get('item_unit', getattr(self.instance, 'item_unit', None))
        if item_unit is not None and item is not None and item_unit.item_id != item.id:
            raise serializers.ValidationError(
                {'item_unit': f"'{item_unit.name}' is a pack size for {item_unit.item.name}, not {item.name}."})

        if self.instance is None:  # Creation only
            requisition_id = self.context.get('requisition_id')
            preferred_supplier = attrs.get('preferred_supplier')
            quantity_requested = attrs.get('quantity_requested')
            if requisition_id and item and quantity_requested:
                # Merging only ever happens within one ordering unit.
                validation_result = validate_requisition_item_uniqueness(
                    requisition_id, item, preferred_supplier, quantity_requested, item_unit)
                if validation_result["exists"]:
                    self.context['validation_result'] = validation_result
        return attrs

    def create(self, validated_data):
        validated_data['requisition_id'] = self.context.get('requisition_id')

        with transaction.atomic():
            validation_result = self.context.get('validation_result')
            if validation_result and validation_result["exists"]:
                existing_item = validation_result["existing_item"]
                existing_item.quantity_requested = validation_result["new_quantity"]
                existing_item.save()
                return existing_item
            return RequisitionItem.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.quantity_approved = validated_data.get('quantity_approved', instance.quantity_approved)
        instance.unit_cost = validated_data.get('unit_cost', instance.unit_cost)
        instance.save()
        return instance


class RequisitionSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True, required=False)
    requested_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    ordered_by = serializers.CharField(source='requested_by.get_fullname', read_only=True)
    approved_by = serializers.CharField(source='approved_by.get_fullname', read_only=True, allow_null=True)
    total_items_requested = serializers.SerializerMethodField(read_only=True)
    total_amount = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Requisition
        fields = ['id', 'requisition_number', 'total_amount', 'department', 'total_items_requested',
                  'requested_by', 'ordered_by', 'approved_by', 'department_approved', 'procurement_approved',
                  'department_approval_date', 'procurement_approval_date', 'items', 'date_created']
        read_only_fields = ['id', 'requisition_number', 'date_created', 'ordered_by', 'approved_by',
                            'department_approval_date', 'procurement_approval_date']

    def validate(self, attrs):
        if 'items' in attrs:
            for item_data in attrs['items']:
                assign_default_supplier(item_data)
                if 'quantity_requested' in item_data:
                    item_data['quantity_requested'] = greater_than_zero("quantity_requested")(
                        item_data['quantity_requested'])
                validate_requisition_item_uniqueness(
                    attrs.get('id'), item_data['item'], item_data['preferred_supplier'],
                    item_data['quantity_requested'], item_data.get('item_unit'))
        return attrs

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        with transaction.atomic():
            requisition = Requisition.objects.create(**validated_data)
            if items_data:
                items_by_supplier = {}
                for item_data in items_data:
                    # The unit is part of the key: six boxes and four loose
                    # units of the same item are not ten of anything.
                    item_unit = item_data.get('item_unit')
                    key = (item_data['preferred_supplier'].id, item_data['item'].id,
                           item_unit.id if item_unit else None)
                    if key in items_by_supplier:
                        items_by_supplier[key]['quantity_requested'] += item_data['quantity_requested']
                    else:
                        items_by_supplier[key] = item_data
                for item_data in items_by_supplier.values():
                    RequisitionItem.objects.create(requisition=requisition, **item_data)
            return requisition

    def update(self, instance, validated_data):
        with transaction.atomic():
            validated_data.pop('items', None)
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            if instance.department_approved and not instance.department_approval_date:
                instance.department_approval_date = timezone.now()
            if instance.procurement_approved and not instance.procurement_approval_date:
                instance.procurement_approval_date = timezone.now()
            instance.save()
            return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['department'] = instance.department.name if instance.department else None
        return data

    def get_total_items_requested(self, obj):
        return RequisitionItem.objects.filter(requisition=obj).values('item').distinct().count()

    def get_total_amount(self, obj):
        total = Decimal('0')
        for line in obj.items.select_related('item'):
            total += Decimal(line.quantity_requested) * _unit_cost_for(line.item, line)
        return float(total)


class PurchaseOrderItemSerializer(BaseItemSerializer, BaseSupplierSerializer):
    requisition_number = serializers.CharField(
        source='requisition_item.requisition.requisition_number', read_only=True)
    requisition_date_created = serializers.DateTimeField(
        source='requisition_item.requisition.date_created', read_only=True)
    requested_by = serializers.CharField(
        source='requisition_item.requisition.requested_by.get_fullname', read_only=True)
    requested_by_name = serializers.CharField(
        source='requisition_item.requisition.requested_by.get_fullname', read_only=True)
    ordered = serializers.BooleanField(source='requisition_item.ordered', read_only=True)
    item = serializers.PrimaryKeyRelatedField(source='requisition_item.item', read_only=True)
    desc = serializers.CharField(source='requisition_item.item.desc', read_only=True)
    quantity_at_hand = serializers.SerializerMethodField(read_only=True)
    quantity_requested = serializers.IntegerField(source='requisition_item.quantity_requested', read_only=True)
    quantity_approved = serializers.IntegerField(source='requisition_item.quantity_approved', read_only=True)
    preferred_supplier = serializers.CharField(source='requisition_item.preferred_supplier.id', read_only=True)
    requested_amount = serializers.SerializerMethodField(read_only=True)
    department_name = serializers.CharField(
        source='requisition_item.requisition.department.name', read_only=True)
    PO_number = serializers.CharField(source='purchase_order.PO_number', read_only=True)
    total_buying_amount = serializers.SerializerMethodField(read_only=True)

    # Override base fields with correct sources
    item_name = serializers.CharField(source='requisition_item.item.name', read_only=True)
    item_code = serializers.CharField(source='requisition_item.item.item_code', read_only=True)
    buying_price = serializers.SerializerMethodField(read_only=True)
    selling_price = serializers.DecimalField(
        source='requisition_item.item.selling_price', max_digits=14, decimal_places=2, read_only=True)
    vat_rate = serializers.DecimalField(
        source='requisition_item.item.vat_rate', max_digits=10, decimal_places=2, read_only=True)
    preferred_supplier_name = serializers.CharField(
        source='requisition_item.preferred_supplier.official_name', read_only=True)

    item_unit = serializers.PrimaryKeyRelatedField(
        source='requisition_item.item_unit', read_only=True)
    unit_label = serializers.ReadOnlyField()
    conversion_factor = serializers.ReadOnlyField()
    base_quantity_ordered = serializers.ReadOnlyField()
    base_unit = serializers.ReadOnlyField(source='requisition_item.item.units_of_measure')

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'PO_number', 'requisition_number', 'requisition_date_created', 'requested_by', 'ordered',
                  'item', 'item_code', 'item_name', 'desc', 'quantity_at_hand', 'quantity_requested',
                  'quantity_approved', 'quantity_ordered', 'quantity_received', 'preferred_supplier',
                  'buying_price', 'vat_rate', 'selling_price', 'requested_amount', 'department_name',
                  'requested_by_name', 'preferred_supplier_name', 'total_buying_amount', 'date_created',
                  'item_unit', 'unit_label', 'conversion_factor', 'base_quantity_ordered', 'base_unit']
        read_only_fields = ['id', 'date_created']

    def validate(self, attrs):
        # PurchaseOrderItem.clean() is never reached through DRF, so the
        # over-receipt guard has to live here to actually run.
        ordered = attrs.get('quantity_ordered', getattr(self.instance, 'quantity_ordered', 0))
        received = attrs.get('quantity_received', getattr(self.instance, 'quantity_received', 0))
        if received > ordered:
            unit = self.instance.unit_label if self.instance else 'units'
            raise serializers.ValidationError({
                'quantity_received':
                    f"Cannot receive {received} {unit} against {ordered} ordered."})
        return attrs

    def _cost(self, obj):
        req_item = obj.requisition_item
        if req_item is None:
            return Decimal('0')
        return _unit_cost_for(req_item.item, req_item)

    def get_buying_price(self, obj):
        return float(self._cost(obj))

    def get_quantity_at_hand(self, obj):
        if obj.requisition_item is None:
            return 0
        return stock_service.on_hand_quantity(
            obj.requisition_item.item, obj.requisition_item.requisition.department)

    def get_requested_amount(self, obj):
        if obj.requisition_item is None:
            return None
        return float(obj.requisition_item.quantity_requested * self._cost(obj))

    def get_total_buying_amount(self, obj):
        return float(obj.quantity_ordered * self._cost(obj))


class PurchaseOrderSerializer(serializers.ModelSerializer):
    requisition_items = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    items = PurchaseOrderItemSerializer(source='po_items', many=True, read_only=True)
    ordered_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=True)
    approved_by = serializers.CharField(
        source='approved_by.get_fullname', read_only=True, allow_null=True, default="Not Approved")
    total_items_ordered = serializers.SerializerMethodField(read_only=True)
    total_amount_before_vat = serializers.SerializerMethodField(read_only=True)
    total_vat_amount = serializers.SerializerMethodField(read_only=True)
    total_amount = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'PO_number', 'is_dispatched', 'status', 'total_items_ordered', 'total_amount_before_vat',
                  'total_vat_amount', 'total_amount', 'ordered_by', 'approved_by', 'items', 'requisition',
                  'requisition_items', 'supplier']
        read_only_fields = ['id', 'PO_number', 'date_created', 'items']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['ordered_by'] = instance.ordered_by.get_fullname()
        return data

    def create(self, validated_data):
        requisition_item_ids = validated_data.pop('requisition_items', [])
        with transaction.atomic():
            if not requisition_item_ids:
                return PurchaseOrder.objects.create(**validated_data)

            requisition_items = RequisitionItem.objects.filter(
                id__in=requisition_item_ids, ordered=False, quantity_approved__gt=0)
            if not requisition_items.exists():
                raise serializers.ValidationError("No valid requisition items found.")

            purchase_order = PurchaseOrder.objects.create(**validated_data)
            purchase_order.requisition = requisition_items.first().requisition
            purchase_order.save()

            for req_item in requisition_items:
                PurchaseOrderItem.objects.create(
                    purchase_order=purchase_order, requisition_item=req_item,
                    quantity_ordered=req_item.quantity_approved)
                req_item.ordered = True
                req_item.save()
            return purchase_order

    def _lines(self, obj):
        return PurchaseOrderItem.objects.filter(purchase_order=obj).select_related(
            'requisition_item', 'requisition_item__item')

    def get_total_items_ordered(self, obj):
        return self._lines(obj).count()

    def get_total_amount_before_vat(self, obj):
        total = Decimal('0')
        for line in self._lines(obj):
            if line.requisition_item:
                total += Decimal(line.quantity_ordered) * _unit_cost_for(
                    line.requisition_item.item, line.requisition_item)
        return total

    def get_total_vat_amount(self, obj):
        total_vat = Decimal('0')
        for line in self._lines(obj):
            if line.requisition_item:
                amount = Decimal(line.quantity_ordered) * _unit_cost_for(
                    line.requisition_item.item, line.requisition_item)
                total_vat += amount * (line.requisition_item.item.vat_rate / 100)
        return total_vat

    def get_total_amount(self, obj):
        return self.get_total_amount_before_vat(obj) + self.get_total_vat_amount(obj)


class GoodsReceiptNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodsReceiptNote
        fields = '__all__'
        read_only_fields = ['grn_number', 'date_created']


class IncomingItemSerializer(serializers.ModelSerializer):
    '''
    A goods-received line. Saving one posts a RECEIPT movement to the ledger
    through the service layer -- explicitly, inside the request transaction,
    and idempotently on the line id.
    '''
    item_name = serializers.CharField(source='item.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    base_units = serializers.IntegerField(read_only=True)
    unit_cost = serializers.DecimalField(max_digits=14, decimal_places=4, read_only=True)
    item_unit_name = serializers.CharField(source='item_unit.name', read_only=True)
    conversion_factor = serializers.IntegerField(read_only=True)
    total_price = serializers.SerializerMethodField()
    is_posted = serializers.BooleanField(read_only=True)

    class Meta:
        model = IncomingItem
        fields = ['id', 'item', 'item_name', 'item_code', 'supplier', 'supplier_name', 'department',
                  'department_name', 'purchase_price', 'sale_price', 'quantity', 'item_unit',
                  'item_unit_name', 'conversion_factor', 'base_units', 'unit_cost',
                  'supplier_invoice', 'purchase_order', 'lot_no',
                  'expiry_date', 'total_price', 'date_created', 'posted_at', 'is_posted']
        read_only_fields = ['date_created', 'total_price', 'item_code', 'posted_at', 'is_posted']

    def get_total_price(self, obj):
        return float(obj.line_total)

    def validate(self, attrs):
        item = attrs.get('item') or getattr(self.instance, 'item', None)
        if item is not None and not item.is_stock_tracked:
            raise serializers.ValidationError(
                {'item': f"{item.name} is a service and cannot be received into stock."})

        quantity = attrs.get('quantity', getattr(self.instance, 'quantity', None))
        if quantity is not None and quantity <= 0:
            raise serializers.ValidationError({'quantity': "Quantity received must be greater than zero."})

        item_unit = attrs.get('item_unit', getattr(self.instance, 'item_unit', None))
        if item_unit is not None and item is not None and item_unit.item_id != item.id:
            raise serializers.ValidationError(
                {'item_unit': f"'{item_unit.name}' is a pack size for {item_unit.item.name}, not {item.name}."})

        supplier_invoice = attrs.get('supplier_invoice')
        supplier = attrs.get('supplier')
        if supplier_invoice and supplier and supplier != supplier_invoice.supplier:
            raise serializers.ValidationError(
                {'supplier': "Supplier must match the supplier on the invoice."})
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        if user is not None and not user.is_authenticated:
            user = None

        with transaction.atomic():
            incoming_item = IncomingItem.objects.create(received_by=user, **validated_data)
            stock_service.receive_incoming_item(incoming_item, performed_by=user)
            self._sync_purchase_order(incoming_item)
        incoming_item.refresh_from_db()
        return incoming_item

    def update(self, instance, validated_data):
        if instance.is_posted:
            raise serializers.ValidationError(
                "This receipt has already been posted to the stock ledger. Post a stock "
                "adjustment or a return to supplier instead of editing it."
            )
        return super().update(instance, validated_data)

    @staticmethod
    def _sync_purchase_order(incoming_item):
        '''
        Accumulate what has actually been received against the PO line, so a
        second partial delivery adds to the first instead of replacing it.
        '''
        if not incoming_item.purchase_order_id:
            return

        po_item = PurchaseOrderItem.objects.filter(
            purchase_order=incoming_item.purchase_order,
            requisition_item__item=incoming_item.item,
        ).first()
        if po_item is None:
            return

        received = IncomingItem.objects.filter(
            purchase_order=incoming_item.purchase_order,
            item=incoming_item.item,
            posted_at__isnull=False,
        )
        po_item.quantity_received = sum(line.base_units for line in received)
        po_item.save(update_fields=['quantity_received'])

        from .utils import update_purchase_order_status
        update_purchase_order_status(po_item.purchase_order)


# ---------------------------------------------------------------------------
# Stock
# ---------------------------------------------------------------------------

class StockLotSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = StockLot
        fields = ['id', 'item', 'item_name', 'lot_number', 'expiry_date', 'supplier',
                  'is_expired', 'date_created']
        read_only_fields = ['id', 'date_created']


class StockBalanceSerializer(serializers.ModelSerializer):
    '''
    One row per item / lot / location, read from the derived balance cache.

    Field names deliberately match the old Inventory payload so the dashboard
    keeps working -- but `quantity_at_hand` is now the ledger's running total,
    not a column anyone can write to.
    '''
    item_name = serializers.ReadOnlyField(source='item.name')
    item_code = serializers.ReadOnlyField(source='item.item_code')
    category = serializers.ReadOnlyField(source='item.category')
    category_one = serializers.ReadOnlyField(source='item.category_one')
    units_of_measure = serializers.ReadOnlyField(source='item.units_of_measure')
    unit_conversions = serializers.SerializerMethodField()
    department_name = serializers.ReadOnlyField(source='department.name')
    lot_number = serializers.ReadOnlyField(source='lot.lot_number')
    expiry_date = serializers.ReadOnlyField(source='lot.expiry_date')
    is_expired = serializers.ReadOnlyField(source='lot.is_expired')

    quantity_at_hand = serializers.IntegerField(source='quantity', read_only=True)
    purchase_price = serializers.DecimalField(source='unit_cost', max_digits=14, decimal_places=4, read_only=True)
    sale_price = serializers.SerializerMethodField()
    re_order_level = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()
    available_quantity = serializers.SerializerMethodField()
    lot_value = serializers.SerializerMethodField()
    insurance_sale_prices = serializers.SerializerMethodField()

    class Meta:
        model = StockBalance
        fields = ['id', 'item', 'item_name', 'item_code', 'category', 'category_one', 'units_of_measure',
                  'unit_conversions', 'department', 'department_name', 'lot', 'lot_number', 'expiry_date',
                  'is_expired', 'quantity_at_hand', 'available_quantity', 'total_quantity', 'purchase_price',
                  'sale_price', 're_order_level', 'lot_value', 'last_movement_at', 'last_receipt_at',
                  'last_issue_at', 'insurance_sale_prices', 'date_created']

    def get_unit_conversions(self, obj):
        return ItemUnitSerializer(obj.item.unit_conversions.all(), many=True).data

    def get_sale_price(self, obj):
        return obj.item.current_sale_price

    def get_re_order_level(self, obj):
        return stock_service.re_order_level_for(obj.item, obj.department)

    def get_total_quantity(self, obj):
        '''Total across every lot of this item at this location.'''
        return stock_service.on_hand_quantity(obj.item, obj.department)

    def get_available_quantity(self, obj):
        return stock_service.available_quantity(obj.item, obj.department)

    def get_lot_value(self, obj):
        return float(obj.total_value)

    def get_insurance_sale_prices(self, obj):
        return [
            {
                "insurance": row.insurance_company_id,
                "insurance_name": row.insurance_company.name,
                "price": float(row.sale_price),
                "co_pay": float(row.co_pay),
            }
            for row in InsuranceItemSalePrice.objects.filter(
                item=obj.item).select_related('insurance_company')
        ]


# The dashboard still calls this endpoint "inventories".
InventorySerializer = StockBalanceSerializer


class StockMovementSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    expiry_date = serializers.DateField(source='lot.expiry_date', read_only=True)
    performed_by_name = serializers.SerializerMethodField()
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = StockMovement
        fields = ['id', 'reference', 'movement_type', 'movement_type_display', 'item', 'item_name',
                  'item_code', 'lot', 'lot_number', 'expiry_date', 'department', 'department_name',
                  'quantity', 'unit_cost', 'total_cost', 'balance_after', 'occurred_at', 'posted_at',
                  'performed_by', 'performed_by_name', 'reason', 'source_type', 'source_id',
                  'source_reference', 'reverses']
        read_only_fields = fields

    def get_performed_by_name(self, obj):
        if obj.performed_by:
            return obj.performed_by.get_fullname()
        return None

    def get_total_cost(self, obj):
        return float(obj.total_cost)


class StockPolicySerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = StockPolicy
        fields = ['id', 'item', 'item_name', 'department', 'department_name', 're_order_level',
                  'reorder_quantity', 'max_level', 'is_active', 'date_created']
        read_only_fields = ['id', 'date_created']


class StockReservationSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = StockReservation
        fields = ['id', 'reference', 'item', 'item_name', 'department', 'department_name', 'lot',
                  'quantity', 'status', 'expires_at', 'reason', 'source_type', 'source_id',
                  'resolved_at', 'date_created']
        read_only_fields = ['id', 'reference', 'status', 'resolved_at', 'date_created']

    def create(self, validated_data):
        request = self.context.get('request')
        user = getattr(request, 'user', None) if request else None
        return stock_service.reserve(
            item=validated_data['item'],
            department=validated_data['department'],
            quantity=validated_data['quantity'],
            expires_at=validated_data.get('expires_at'),
            reason=validated_data.get('reason', ''),
            created_by=user if user and user.is_authenticated else None,
        )


class StockTakeLineSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='lot.item.name', read_only=True)
    lot_number = serializers.CharField(source='lot.lot_number', read_only=True)
    expiry_date = serializers.DateField(source='lot.expiry_date', read_only=True)
    variance = serializers.IntegerField(read_only=True)

    class Meta:
        model = StockTakeLine
        fields = ['id', 'stock_take', 'lot', 'item_name', 'lot_number', 'expiry_date',
                  'system_quantity', 'counted_quantity', 'variance', 'note', 'movement']
        read_only_fields = ['id', 'system_quantity', 'variance', 'movement']

    def create(self, validated_data):
        # Snapshot what the ledger says right now, so the variance is meaningful.
        stock_take = validated_data['stock_take']
        lot = validated_data['lot']
        balance = StockBalance.objects.filter(
            lot=lot, department=stock_take.department).first()
        validated_data['system_quantity'] = balance.quantity if balance else 0
        return super().create(validated_data)


class StockTakeSerializer(serializers.ModelSerializer):
    lines = StockTakeLineSerializer(many=True, read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    counted_by_name = serializers.CharField(source='counted_by.get_fullname', read_only=True)

    class Meta:
        model = StockTake
        fields = ['id', 'reference_number', 'department', 'department_name', 'status', 'note',
                  'counted_by', 'counted_by_name', 'posted_by', 'posted_at', 'lines', 'date_created']
        read_only_fields = ['id', 'reference_number', 'status', 'posted_by', 'posted_at', 'date_created']


class StockAdjustmentSerializer(serializers.Serializer):
    '''Write an explicit, reasoned correction into the ledger.'''
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    lot = serializers.PrimaryKeyRelatedField(queryset=StockLot.objects.all(), required=False, allow_null=True)
    lot_number = serializers.CharField(required=False, allow_blank=True)
    expiry_date = serializers.DateField(required=False, allow_null=True)
    quantity = serializers.IntegerField(help_text="Signed. Negative writes stock off.")
    movement_type = serializers.ChoiceField(
        choices=[
            StockMovement.Type.ADJUSTMENT,
            StockMovement.Type.WASTAGE,
            StockMovement.Type.EXPIRY_WRITE_OFF,
            StockMovement.Type.RETURN_TO_SUPPLIER,
            StockMovement.Type.RETURN_FROM_ISSUE,
        ],
        default=StockMovement.Type.ADJUSTMENT,
    )
    reason = serializers.CharField(max_length=255)

    def validate(self, attrs):
        if attrs['quantity'] == 0:
            raise serializers.ValidationError({'quantity': "An adjustment of zero has no meaning."})
        if not attrs['item'].is_stock_tracked:
            raise serializers.ValidationError({'item': "Service items hold no stock."})
        if not attrs.get('lot') and attrs.get('lot_number') is None and attrs.get('expiry_date') is None:
            attrs['lot_number'] = ''
        return attrs


class StockTransferSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    from_department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    to_department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    quantity = serializers.IntegerField(min_value=1)
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs['from_department'] == attrs['to_department']:
            raise serializers.ValidationError("Source and destination departments must differ.")
        if not attrs['item'].is_stock_tracked:
            raise serializers.ValidationError({'item': "Service items hold no stock."})
        return attrs


class OpeningStockSerializer(serializers.Serializer):
    '''
    Manual stock entry from the dashboard. Accepts the shape the old
    "Add Inventory" form posted, but records it as an OPENING_BALANCE movement
    rather than conjuring a quantity column out of thin air.
    '''
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    quantity_at_hand = serializers.IntegerField(min_value=1)
    lot_number = serializers.CharField(required=False, allow_blank=True, default='')
    expiry_date = serializers.DateField(required=False, allow_null=True)
    purchase_price = serializers.DecimalField(max_digits=14, decimal_places=4, required=False, allow_null=True)
    sale_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    re_order_level = serializers.IntegerField(required=False, min_value=0)
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def validate_item(self, value):
        if not value.is_stock_tracked:
            raise serializers.ValidationError(
                f"{value.name} is a service item and cannot hold stock.")
        return value


# ---------------------------------------------------------------------------
# Quotations & supplier payments
# ---------------------------------------------------------------------------

class QuotationCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationCustomer
        fields = '__all__'


class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ['quotation_number', 'date_created']


class QuotationItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)

    class Meta:
        model = QuotationItem
        fields = '__all__'


class SupplierPaymentAllocationSerializer(serializers.ModelSerializer):
    invoice_no = serializers.CharField(source='supplier_invoice.invoice_no', read_only=True)

    class Meta:
        model = SupplierPaymentAllocation
        fields = ['id', 'receipt', 'supplier_invoice', 'invoice_no', 'amount_applied', 'applied_at']
        read_only_fields = ['applied_at']


class SupplierPaymentReceiptSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    allocations = SupplierPaymentAllocationSerializer(many=True, read_only=True)
    sub_account_name = serializers.SerializerMethodField()
    invoice_numbers = serializers.SerializerMethodField()

    class Meta:
        model = SupplierPaymentReceipt
        fields = ['id', 'supplier', 'supplier_name', 'sub_account', 'sub_account_name', 'payment_mode',
                  'total_amount', 'reference_number', 'payment_date', 'created_at', 'allocations',
                  'invoice_numbers']
        read_only_fields = ['created_at']

    def get_sub_account_name(self, obj):
        if obj.sub_account:
            name = obj.sub_account.name
            if getattr(obj.sub_account, 'main_account', None):
                name += f' ({obj.sub_account.main_account.name})'
            return name
        return None

    def get_invoice_numbers(self, obj):
        return list(
            obj.allocations.values_list('supplier_invoice__invoice_no', flat=True).distinct()
        )


class AllocateSupplierPaymentRequestSerializer(serializers.Serializer):
    supplier_id = serializers.IntegerField(required=True)
    invoice_ids = serializers.ListField(child=serializers.IntegerField(), required=True)
    sub_account = serializers.IntegerField(required=True)
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)
    reference_number = serializers.CharField(max_length=100, required=True)
    payment_date = serializers.DateField(required=False, allow_null=True)
