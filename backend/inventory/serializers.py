from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import (
    Item,
    Inventory,
    Supplier,
    SupplierInvoice,
    IncomingItem,
    Department,
    Requisition,
    RequisitionItem,
    PurchaseOrder,
    PurchaseOrderItem,
    InsuranceItemSalePrice,
    GoodsReceiptNote,
    Quotation,
    QuotationItem,
    QuotationCustomer,
    InventoryArchive
)

from .validators import (
    validate_quantity_requested,
    validate_requisition_item_uniqueness,
    assign_default_supplier
)

CustomUser = get_user_model()

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class SupplierInvoiceSerializer(serializers.ModelSerializer):
    total_amount = serializers.DecimalField(source='amount', read_only=True, max_digits=10, decimal_places=2)
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    purchase_order_number = serializers.CharField(source='purchase_order.PO_number', read_only=True)
    requisition_number = serializers.SerializerMethodField()
    
    class Meta:
        model = SupplierInvoice
        fields = ['id', 'invoice_no', 'supplier', 'supplier_name', 'purchase_order', 
                 'purchase_order_number', 'requisition_number',
                 'status', 'total_amount', 'date_created']
        read_only_fields = ['total_amount', 'date_created', 'requisition_number']

    def get_requisition_number(self, obj):
        if obj.purchase_order and obj.purchase_order.requisition:
            return obj.purchase_order.requisition.requisition_number
        return None


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'    

class RequisitionItemCreateSerializer(serializers.ModelSerializer):
    preferred_supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all(), required=False)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    quantity_at_hand = serializers.IntegerField(source='inventory.quantity_at_hand', read_only=True)
    quantity_requested = serializers.IntegerField()
    preferred_supplier_name = serializers.CharField(source='preferred_supplier.official_name', read_only=True)
    buying_price = serializers.SerializerMethodField()
    selling_price = serializers.SerializerMethodField()
    vat_rate = serializers.DecimalField(source='item.vat_rate', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = RequisitionItem
        fields = [
            'id',
            'item', 'item_code', 'item_name',
            'quantity_at_hand', 'quantity_requested',
            'preferred_supplier', 'preferred_supplier_name',
            'buying_price', 'selling_price', 'vat_rate', 'date_created', 
        ]

    def get_buying_price(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.item).order_by('expiry_date').first()
            return inventory.purchase_price
        except Inventory.DoesNotExist:
            return None

    def get_selling_price(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.item).order_by('expiry_date').first()
            return inventory.sale_price
        except Inventory.DoesNotExist:
            return None

    def validate_quantity_requested(self, value):
        return validate_quantity_requested(value)

    def validate(self, attrs):
        requisition_id = self.context.get('requisition_id')
        item = attrs.get('item')
        preferred_supplier = attrs.get('preferred_supplier')

        quantity_requested = attrs.get('quantity_requested')

        validation_result = validate_requisition_item_uniqueness(
            requisition_id, item, preferred_supplier, quantity_requested
        )

        if validation_result["exists"]:
            self.context['validation_result'] = validation_result
        return attrs

    def create(self, validated_data):
        requisition_id = self.context.get('requisition_id')
        validated_data['requisition_id'] = requisition_id

        with transaction.atomic():
            validation_result = self.context.get('validation_result')
            if validation_result and validation_result["exists"]:
                existing_item = validation_result["existing_item"]
                existing_item.quantity_requested = validation_result["new_quantity"]
                existing_item.save()
                return existing_item

            requisition_item = RequisitionItem.objects.create(**validated_data)
            return requisition_item

class RequisitionItemListUpdateSerializer(serializers.ModelSerializer):
    requisition_number = serializers.CharField(source='requisition.requisition_number', read_only=True)
    requisition_date_created = serializers.DateTimeField(source='requisition.date_created', read_only=True)
    requested_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='requisition.department.name', read_only=True)
    requested_by_name = serializers.CharField(source='requisition.requested_by.get_full_name', read_only=True)
    preferred_supplier = serializers.CharField(source='preferred_supplier.official_name', read_only=True)
    preferred_supplier_name = serializers.CharField(source='preferred_supplier.official_name', read_only=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    buying_price = serializers.SerializerMethodField()
    selling_price = serializers.SerializerMethodField()
    desc = serializers.CharField(source='item.desc', read_only=True)
    quantity_at_hand = serializers.SerializerMethodField()
    requested_amount = serializers.SerializerMethodField()
    vat_rate = serializers.DecimalField(source='item.vat_rate', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = RequisitionItem
        fields = [
            'id', 'requisition_number', 'requisition_date_created', 'requested_by', 'approved_by', 'ordered', 'item', 'item_code', 'item_name', 'ordered', 
            'desc', 'ordered', 'quantity_at_hand', 'quantity_requested', 'quantity_approved', 
            'preferred_supplier', 'buying_price', 
            'vat_rate', 'selling_price', 'requested_amount', 'date_created', 
            'department_name', 'requested_by_name', 'requisition', 'preferred_supplier_name']
        
        read_only_fields = [
            'id', 'ordered', 'date_created', 'item_code', 'desc', 'item_name', 
            'preferred_supplier_name', 'buying_price', 'selling_price', 
            'quantity_at_hand', 'vat_rate', 'requisition_number', 
            'requisition_status', 'requisition_date_created', 
            'department_name', 'requested_by_name', 'requisition'
        ]

    def get_buying_price(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.item).order_by('expiry_date').first()
            return inventory.purchase_price
        except Inventory.DoesNotExist:
            return None

    def get_selling_price(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.item).order_by('expiry_date').first()
            return inventory.sale_price
        except Inventory.DoesNotExist:
            return None

    def get_requested_amount(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.item).order_by('expiry_date').first()
            return float(obj.quantity_requested * inventory.purchase_price)
        except Inventory.DoesNotExist:
            return None

    def validate(self, attrs):
        quantity_approved = attrs.get('quantity_approved')
        
        if quantity_approved is not None and quantity_approved <= 0:
            raise serializers.ValidationError('Quantity approved must be greater than 0.')
        return attrs
    
    def get_requested_by(self, obj):
        if obj.requisition.requested_by:
            return f"{obj.requisition.requested_by.first_name} {obj.requisition.requested_by.last_name}"
        return None  

    def get_quantity_at_hand(self, obj):
        try:
            inventory = obj.item.active_inventory_items.first()
            return inventory.quantity_at_hand if inventory else 0
        except Exception as e:
            return 0

    def get_approved_by(self, obj):
        if obj.requisition.approved_by:  
            return f"{obj.requisition.approved_by.first_name} {obj.requisition.approved_by.last_name}"
        return None  

class RequisitionItemPurchaseOrderSerializer(RequisitionItemListUpdateSerializer):
    quantity_ordered = serializers.IntegerField(source='quantity_approved')
    
    class Meta(RequisitionItemListUpdateSerializer.Meta):
        model = RequisitionItem
        fields = [
            'id', 'requisition_number', 'requisition_date_created', 'requested_by', 
            'approved_by', 'ordered', 'item', 'item_code', 'item_name', 'ordered', 
            'desc', 'ordered', 'quantity_at_hand', 'quantity_requested', 'quantity_ordered', 
            'preferred_supplier', 'buying_price', 'vat_rate', 'selling_price', 
            'requested_amount', 'date_created', 'department_name', 'requested_by_name', 
            'requisition', 'preferred_supplier_name'
        ]

class RequisitionCreateSerializer(serializers.ModelSerializer):
    items = RequisitionItemCreateSerializer(many=True)
    requested_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = Requisition
        fields = ['requested_by', 'department', 'department_name', 'items']
        read_only_fields = ['id', 'date_created', 'department_name']

    def validate(self, attrs):
        """
        Custom validation to ensure quantity requested is greater than 0 and a default supplier is assigned if needed.
        """
        items_data = attrs.get('items', [])
        
        # Assign default supplier if not provided
        for item_data in items_data:
            assign_default_supplier(item_data)
            
            # Validate quantity requested
            if 'quantity_requested' in item_data:
                validate_quantity_requested(item_data['quantity_requested'])

            # Ensure requisition item uniqueness by supplier and item
            requisition_id = attrs.get('id')
            item = item_data['item']
            preferred_supplier = item_data['preferred_supplier']
            quantity_requested = item_data['quantity_requested']
            validate_requisition_item_uniqueness(requisition_id, item, preferred_supplier, quantity_requested)

        return attrs

    def create(self, validated_data):        
        items_data = validated_data.pop('items')
        requested_by = validated_data.pop('requested_by') 
        department = validated_data.pop('department')
        requisition = Requisition.objects.create(requested_by=requested_by, department=department, **validated_data)
        
        items_by_supplier = {}
        for item_data in items_data:
            supplier_id = item_data['preferred_supplier'].id
            item_id = item_data['item']

            if (supplier_id, item_id) in items_by_supplier:
                existing_item = items_by_supplier[(supplier_id, item_id)]
                existing_item['quantity_requested'] += item_data['quantity_requested']
            else:
                items_by_supplier[(supplier_id, item_id)] = item_data
        for item_data in items_by_supplier.values():
            RequisitionItem.objects.create(requisition=requisition, **item_data)
        
        return requisition

    def update(self, instance, validated_data):
        if self.context['request'].method in ['PUT', 'PATCH']:
            department = validated_data.get('department')
            if department:
                instance.department = department
                instance.save()
        return instance
    
class RequisitionUpdateSerializer(serializers.ModelSerializer):
    items = RequisitionItemCreateSerializer(many=True, read_only=True)

    class Meta:
        model = Requisition
        fields = ['department_approved', 'procurement_approved', 'items']

    def update(self, instance, validated_data):
        instance.department_approved = validated_data.get('department_approved', instance.department_approved)
        instance.procurement_approved = validated_data.get('procurement_approved', instance.procurement_approved)
        instance.department_approval_date = timezone.now()
        instance.procurement_approval_date = timezone.now()

        try:
            instance.save()
        except Exception as e:
            raise ValidationError(f"An error occurred while updating the requisition: {e}")
        return instance
    
class RequisitionListSerializer(serializers.ModelSerializer):
    items = RequisitionItemListUpdateSerializer(many=True, read_only=True)
    ordered_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    department = serializers.CharField(source='department.name')
    total_items_requested = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Requisition
        fields = ['id', 'requisition_number', 'total_amount', 'department', 'total_items_requested', 'ordered_by', 'approved_by', 'department_approved','procurement_approved', "department_approval_date" , "procurement_approval_date", 'items', 'date_created']
        
    def get_ordered_by(self, obj):
        return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"
    
    def get_approved_by(self, obj):
        return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"
    
    def get_total_items_requested(self, obj):
        requisition_items = RequisitionItem.objects.filter(requisition=obj)
        distinct_items = requisition_items.values('item').distinct()  
        return len(distinct_items)
    
    def get_total_amount(self, obj):
        total = 0
        items_data = RequisitionItemListUpdateSerializer(obj.items.all(), many=True).data
        for item in items_data:
            amount = item.get('requested_amount')
            if amount is not None:
                total += float(amount)
        return total

class PurchaseOrderItemListUPdateSerializer(serializers.ModelSerializer):
    requisition_number = serializers.CharField(source='requisition_item.requisition.requisition_number', read_only=True)
    requisition_date_created = serializers.DateTimeField(source='requisition_item.requisition.date_created', read_only=True)
    requested_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    ordered = serializers.BooleanField(source='requisition_item.ordered', read_only=True)
    item = serializers.PrimaryKeyRelatedField(source='requisition_item.item', read_only=True)
    item_code = serializers.CharField(source='requisition_item.item.item_code', read_only=True)
    item_name = serializers.CharField(source='requisition_item.item.name', read_only=True)
    desc = serializers.CharField(source='requisition_item.item.desc', read_only=True)
    quantity_at_hand = serializers.SerializerMethodField()
    quantity_requested = serializers.IntegerField(source='requisition_item.quantity_requested', read_only=True)
    quantity_approved = serializers.IntegerField(source='requisition_item.quantity_approved', read_only=True)
    quantity_ordered = serializers.IntegerField(read_only=True)  
    preferred_supplier = serializers.CharField(source='requisition_item.preferred_supplier.id', read_only=True)
    buying_price = serializers.SerializerMethodField()
    vat_rate = serializers.DecimalField(source='requisition_item.item.vat_rate', max_digits=5, decimal_places=2, read_only=True)
    selling_price = serializers.SerializerMethodField()
    requested_amount = serializers.SerializerMethodField()
    department_name = serializers.CharField(source='requisition_item.requisition.department.name', read_only=True)
    requested_by_name = serializers.SerializerMethodField()
    preferred_supplier_name = serializers.CharField(source='requisition_item.preferred_supplier.official_name', read_only=True)
    PO_number = serializers.CharField(source='purchase_order.PO_number', read_only=True)
    total_buying_amount = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderItem
        fields = [
            'id', 'PO_number', 'requisition_number', 'requisition_date_created', 
            'requested_by', 'approved_by', 'ordered', 'item', 'item_code', 
            'item_name', 'desc', 'quantity_at_hand', 'quantity_requested', 'quantity_approved',
            'quantity_ordered', 'quantity_received', 'preferred_supplier', 'buying_price', 'vat_rate', 
            'selling_price', 'requested_amount', 'department_name', 'requested_by_name',
            'preferred_supplier_name', 'total_buying_amount', 'date_created'
        ]

    def get_requested_by(self, obj):
        if obj.requisition_item.requisition.requested_by:
            return f"{obj.requisition_item.requisition.requested_by.first_name} {obj.requisition_item.requisition.requested_by.last_name}"
        return " "

    def get_approved_by(self, obj):
        if obj.requisition_item.requisition.approved_by:
            return f"{obj.requisition_item.requisition.approved_by.first_name} {obj.requisition_item.requisition.approved_by.last_name}"
        return None

    def get_quantity_at_hand(self, obj):
        try:
            inventory = obj.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
            return inventory.quantity_at_hand
        except (Inventory.DoesNotExist, Exception) as e:
            return 0

    def get_buying_price(self, obj):
        try:
            inventory = obj.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
            return inventory.purchase_price
        except (Inventory.DoesNotExist, Exception) as e:
            return 0

    def get_selling_price(self, obj):
        try:
            inventory = Inventory.objects.get(item=obj.requisition_item.item)
            return inventory.sale_price
        except (Inventory.DoesNotExist, Exception) as e:
            return 0

    def get_requested_amount(self, obj):
        try:
            inventory = obj.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
            return float(obj.requisition_item.quantity_requested * inventory.purchase_price)
        except Inventory.DoesNotExist:
            return None

    def get_total_buying_amount(self, obj):
        try:
            inventory = obj.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
            return float(obj.requisition_item.quantity_approved * inventory.purchase_price)
        except Inventory.DoesNotExist:
            return None

    def get_requested_by_name(self, obj):
        if obj.requisition_item.requisition.requested_by:
            return f"{obj.requisition_item.requisition.requested_by.first_name} {obj.requisition_item.requisition.requested_by.last_name}"
        return " "

    def validate(self, attrs):
        quantity_ordered = attrs.get('quantity_ordered')
        requisition_item = self.instance.requisition_item if self.instance else None
        quantity_ordered = requisition_item.quantity_approved if requisition_item else None

        if quantity_ordered is not None and quantity_received <= 0:
            raise serializers.ValidationError('Quantity ordered must be greater than 0.')

        if quantity_ordered is not None and quantity_ordered is not None and quantity_ordered > quantity_ordered:
            raise serializers.ValidationError('Quantity received cannot exceed the quantity ordered.')

        return attrs


    def update(self, instance, validated_data):
        
        instance.quantity_ordered = validated_data.get('quantity_ordered', instance.quantity_received)
        instance.save()
        return instance

    def get_total_buying_amount(self, obj):
        try:
            inventory = Inventory.objects.filter(item=obj.requisition_item.item).order_by('expiry_date').first()
            return float(obj.quantity_ordered * inventory.purchase_price)
        except Inventory.DoesNotExist:
            return None
    
class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    requisition_items = serializers.ListField(
        child=serializers.IntegerField(),  
        write_only=True
    )

    class Meta:
        model = PurchaseOrder
        fields = ['PO_number', 'ordered_by', 'requisition', 'is_dispatched', 'requisition_items', 'created_by',]
        read_only_fields = ['PO_number', 'date_created', 'is_dispatched']

    def create(self, validated_data):
        context = self.context
        request = context.get('request')
        requisition_id = context.get('requisition_id')
        ordered_by = context.get('requested_by')
        requisition_item_ids = validated_data.pop('requisition_items')  

        requisition_items = RequisitionItem.objects.filter(
            id__in=requisition_item_ids,
            requisition_id=requisition_id,
            ordered=False,
            quantity_approved__gt=0  
        )

        if not requisition_items.exists():
            raise serializers.ValidationError(
                "No unprocessed requisition items found with approved quantities greater than 0."
            )

        purchase_order = PurchaseOrder.objects.create(
            ordered_by=ordered_by,
            requisition_id=requisition_id
        )

        for req_item in requisition_items:
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                requisition_item=req_item,
                quantity_ordered=req_item.quantity_approved
            )   
            req_item.ordered = True
            req_item.save()

        return purchase_order


    def get_items(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        requisition_items = [purchase_order_item.requisition_item for purchase_order_item in purchase_order_items]
        return RequisitionItemPurchaseOrderSerializer(requisition_items, many=True).data
    
class PurchaseOrderListSerializer(serializers.ModelSerializer):
    PO_number = serializers.CharField()
    is_dispatched = serializers.BooleanField()
    items = serializers.SerializerMethodField()
    ordered_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    total_items_ordered = serializers.SerializerMethodField()
    total_amount_before_vat = serializers.SerializerMethodField()
    total_vat_amount = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrder
        fields = [
            'id', 'PO_number', 'is_dispatched', 'status',  'total_items_ordered',
            'total_amount_before_vat', 'total_vat_amount', 'total_amount', 
            'ordered_by', 'approved_by', 'items', 'requisition'
        ]

    def get_ordered_by(self, obj):
        return f"{obj.ordered_by.first_name} {obj.ordered_by.last_name}"
    
    def get_approved_by(self, obj):
        if obj.approved_by is not None:
            return f"{obj.approved_by.first_name} {obj.approved_by.last_name}"
        return "Not Approved"

    def get_items(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        return PurchaseOrderItemListUPdateSerializer(purchase_order_items, many=True).data
    
    def get_total_items_ordered(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        return purchase_order_items.count()

    def get_total_amount_before_vat(self, obj):
        total = 0
        for item in PurchaseOrderItem.objects.filter(purchase_order=obj):
            try:
                inventory = item.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
                if inventory:
                    total += item.requisition_item.quantity_approved * inventory.purchase_price
            except (Inventory.DoesNotExist, Exception) as e:
                continue
        return total

    def get_total_vat_amount(self, obj):
        total_vat = 0
        for item in PurchaseOrderItem.objects.filter(purchase_order=obj):
            try:
                inventory = item.requisition_item.item.active_inventory_items.order_by("expiry_date").first()
                amount = item.requisition_item.quantity_approved * inventory.purchase_price
                vat = amount * (item.requisition_item.item.vat_rate / 100)
                total_vat += vat
            except (Inventory.DoesNotExist, Exception) as e:
                continue
        return total_vat

    def get_total_amount(self, obj):
        total_before_vat = self.get_total_amount_before_vat(obj)
        vat_amount = self.get_total_vat_amount(obj)
        return total_before_vat + vat_amount

class IncomingItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.name', read_only=True)
    supplier_name = serializers.CharField(source='supplier.official_name', read_only=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = IncomingItem
        fields = ['id', 'item', 'item_name', 'item_code', 'supplier', 'supplier_name', 'purchase_price', 
                 'sale_price', 'quantity', 'supplier_invoice', 'purchase_order', 
                 'lot_no', 'expiry_date', 'total_price', 'date_created', 'category_one']
        read_only_fields = ['date_created', 'total_price', 'item_code']
    
    def get_total_price(self, obj):
        return obj.purchase_price * obj.quantity if obj.purchase_price and obj.quantity else 0

class InventorySerializer(serializers.ModelSerializer):
    insurance_sale_prices = serializers.SerializerMethodField()
    item_name = serializers.ReadOnlyField(source='item.name')
    department_name = serializers.ReadOnlyField(source='department.name')
    total_quantity = serializers.SerializerMethodField()
    class Meta:
        model = Inventory
        fields = ['id', 'item', 'item_name', 'department', 'department_name', 'purchase_price', 'sale_price', 
                 'quantity_at_hand', 'lot_number', 'expiry_date', 'date_created', 
                 'category_one', 'insurance_sale_prices', 'total_quantity']

    def get_insurance_sale_prices(self, obj):
        sale_prices = InsuranceItemSalePrice.objects.filter(item=obj)
        insurance_prices = []
        for sale in sale_prices:

            insurance_price = {
                "id": sale.insurance_company.id,
                "insurance_name": sale.insurance_company.name.lower().replace(" ", "_"),
                "price": str(sale.sale_price)
            }
            insurance_prices.append(insurance_price)
        return insurance_prices

    def get_total_quantity(self, obj):
        '''Get total quantity across all lots for this item'''
        total = Inventory.objects.filter(item=obj.item).order_by('expiry_date').aggregate(
            total_qty=Sum('quantity_at_hand'))['total_qty'] or 0
        return total


class InsuranceItemSalePriceSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    item_id = serializers.ReadOnlyField(source='item.id')
    insurance_name = serializers.ReadOnlyField(source='insurance_company.name')
    class Meta:
        model = InsuranceItemSalePrice
        fields = '__all__'

class InventoryArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryArchive
        fields = '__all__'

class GoodsReceiptNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoodsReceiptNote
        fields = '__all__'


class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'


class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'