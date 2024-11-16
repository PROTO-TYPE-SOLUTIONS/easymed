from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db.models import Sum
from decimal import Decimal
from django.utils import timezone
import random
from django.contrib.auth import get_user_model
from .models import (
    Item,
    Inventory,
    Supplier,
    IncomingItem,
    Department,
    DepartmentInventory,
    Requisition,
    RequisitionItem,
    PurchaseOrder,
    PurchaseOrderItem,
    InventoryInsuranceSaleprice
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

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ItemPOSerializer(serializers.ModelSerializer):
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'item_code', 'item_name', 'description', 'buying_price', 'quantity_approved', 'total_amount', 'selling_price', 'date_created']
        
    def get_total_amount(self, obj):
        return float(obj.quantity_approved * obj.buying_price)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.clean()
        instance.save()
        return instance    
    
class RequisitionItemCreateSerializer(serializers.ModelSerializer):
    preferred_supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all(), required=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    preferred_supplier_name = serializers.SerializerMethodField()

    def get_preferred_supplier_name(self, obj):
        if obj.preferred_supplier:
            return obj.preferred_supplier.official_name
        return ''

    class Meta:
        model = RequisitionItem
        fields = ['id', 'item', 'quantity_requested', 'preferred_supplier', 'preferred_supplier_name', 'date_created',
                  'item_code', 'item_name', 'status']
        read_only_fields = ['id', 'date_created', 'item_code', 'item_name', 'preffered_supplier_name', 'status']

    def create(self, validated_data):
        requisition_id = self.context.get('requisition_id')
        validated_data['requisition_id'] = requisition_id
        
        requisition_item = RequisitionItem.objects.create(**validated_data)
        
        return requisition_item
        
class RequisitionItemListUpdateSerializer(serializers.ModelSerializer):
    preferred_supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all(), required=True)
    item_code = serializers.CharField(source='item.item_code', read_only=True)
    item_name = serializers.CharField(source='item.name', read_only=True)
    buying_price = serializers.CharField(source='item.buying_price', read_only=True)
    selling_price = serializers.CharField(source='item.selling_price', read_only=True)
    desc = serializers.CharField(source='item.desc', read_only=True)
    quantity_at_hand = serializers.CharField(source='item.quantity_at_hand', read_only=True)
    preferred_supplier_name = serializers.SerializerMethodField()
    requested_amount = serializers.SerializerMethodField() 
    vat_rate = serializers.DecimalField(source='item.vat_rate', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = RequisitionItem
        fields = ['id', 'item','item_code','item_name', 'desc', 'status', 'quantity_at_hand','quantity_requested', 'quantity_approved',  'preferred_supplier', 
                  'preferred_supplier_name', 'buying_price', 'vat_rate', 'selling_price', 'requested_amount', 'date_created',
                     'status']
        read_only_fields = ['id', 'date_created', 'item_code', 'desc', 'item_name', 'preffered_supplier_name', 'status', 'buying_price', 'selling_price', 'quantity_at_hand', 'vat_rate']

    def validate(self, attrs):
        quantity_approved = attrs.get('quantity_approved')
        quantity_requested = attrs.get('quantity_requested')
        
        if quantity_approved is not None and quantity_approved <= 0:
            raise serializers.ValidationError('Quantity approved must be greater than 0.')

        if quantity_requested is not None and quantity_approved > quantity_requested:
            raise serializers.ValidationError('Quantity approved cannot exceed quantity requested.')
        
        return attrs
    
    def get_preferred_supplier_name(self, obj):
        if obj.preferred_supplier:
            return obj.preferred_supplier.official_name
        return ''
    
    def get_requested_amount(self, obj):
        return obj.quantity_requested * obj.item.buying_price
      
class RequisitionCreateSerializer(serializers.ModelSerializer):
    items = RequisitionItemCreateSerializer(many=True)
    requested_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    department=serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())

    class Meta:
        model = Requisition
        fields = ['requested_by', 'department','items']
        read_only_fields = ['id', 'date_created']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        requested_by = validated_data.pop('requested_by') 
        department = validated_data.pop('department')

        requisition = Requisition.objects.create(requested_by=requested_by, department=department, **validated_data)
        
        for item_data in items_data:
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
        instance.procumerent_approval_date = timezone.now()

        try:
            instance.save()
        except Exception as e:
            raise ValidationError(f"An error occurred while updating the requisition: {e}")
        return instance
    
class RequisitionListSerializer(serializers.ModelSerializer):
    items = RequisitionItemListUpdateSerializer(many=True, read_only=True)
    ordered_by = serializers.SerializerMethodField()
    department = serializers.CharField(source='department.name')
    total_items_requested = serializers.SerializerMethodField()
    # total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Requisition
        fields = ['id', 'requisition_number', 'department', 'total_items_requested', 'ordered_by', 'status', 'department_approved','procurement_approved', "department_approval_date" , "procurement_approval_date", 'items', 'date_created']
        
    def get_ordered_by(self, obj):
        return f"{obj.requested_by.first_name} {obj.requested_by.last_name}"
    
    def get_total_items_requested(self, obj):
        requisition_items = RequisitionItem.objects.filter(requisition=obj)
        distinct_items = requisition_items.values('item').distinct()  # Assuming 'item' is the field you're distinguishing by
        return len(distinct_items)
    
    # def get_total_amount(self, obj):
    #     return sum(item.get('requested_amount') for item in RequisitionItemListSerializer(obj.items, many=True).data)

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='requisition_item.item.name', read_only=True)
    quantity_approved = serializers.IntegerField(source='requisition_item.quantity_approved', read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderItem
        fields = ['id', 'item_name', 'quantity_approved', 'total_amount', 'date_created', 'supplier']

    def get_total_amount(self, obj):
        return float(obj.quantity_approved * obj.requisition_item.item.buying_price)
    
class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = ['ordered_by', 'requisition']
        read_only_fields = ['PO_number', 'date_created']

    def create(self, validated_data):
        request = self.context.get('request')
        requisition_id = self.context.get('requisition_id')
        requisition_items = RequisitionItem.objects.filter(
            requisition_id=requisition_id,
            ordered=False
        )

        if not requisition_items.exists():
            raise serializers.ValidationError("No unprocessed requisition items found for the specified supplier.")

        purchase_order = PurchaseOrder.objects.create(
            ordered_by=request.user,
            requisition_id=requisition_id
        )
        for req_item in requisition_items:
            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                quantity_purchased=req_item.quantity_approved,
                supplier=req_item.preferred_supplier,
                requisition_item=req_item
            )
            req_item.ordered = True
            req_item.save()

        return purchase_order
    items = PurchaseOrderItemSerializer(many=True)


class PurchaseOrderListSerializer(serializers.ModelSerializer):
    PO_number = serializers.CharField()
    is_dispatched = serializers.BooleanField()
    items = serializers.SerializerMethodField()  #
    ordered_by = serializers.SerializerMethodField()
    approved_by = serializers.SerializerMethodField()
    total_items_ordered = serializers.SerializerMethodField()  
    total_amount = serializers.SerializerMethodField()  


    class Meta:
        model = PurchaseOrder
        fields = ['id', 'PO_number', 'is_dispatched','total_items_ordered', 'total_amount', 'ordered_by', 'approved_by', 'items']

    def get_ordered_by(self, obj):
        return f"{obj.ordered_by.first_name} {obj.ordered_by.last_name}"
    
    def get_approved_by(self, obj):
        if obj.approved_by is not None:
            return f"{obj.approved_by.first_name} {obj.approved_by.last_name}"
        return "Not Approved"  

    def get_items(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        requisition_items = [purchase_order_item.requisition_item for purchase_order_item in purchase_order_items]
        return RequisitionItemListSerializer(requisition_items, many=True).data
    
    def get_total_items_ordered(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        distinct_items = purchase_order_items.values('requisition_item__item').distinct()
        return len(distinct_items)

    def get_total_amount(self, obj):
        purchase_order_items = PurchaseOrderItem.objects.filter(purchase_order=obj)
        total_amount = sum(item.requisition_item.quantity_approved * item.requisition_item.item.buying_price for item in purchase_order_items)
        return total_amount

class IncomingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingItem
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    insurance_sale_prices = serializers.SerializerMethodField()
    item_name = serializers.ReadOnlyField(source='item.name')
    class Meta:
        model = Inventory
        fields = ['item', 'item_name', 'purchase_price', 'sale_price', 'quantity_in_stock', 'packed', 'subpacked', 'date_created', 'category_one', 'insurance_sale_prices']

    def get_insurance_sale_prices(self, obj):
        sale_prices = InventoryInsuranceSaleprice.objects.filter(inventory_item=obj)
        insurance_prices = []
        for sale in sale_prices:

            insurance_price = {
                "id": sale.insurance_company.id,
                "insurance_name": sale.insurance_company.name.lower().replace(" ", "_"),
                "price": str(sale.sale_price)
            }
            insurance_prices.append(insurance_price)
        return insurance_prices


class DepartmentInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentInventory
        fields = '__all__'


class InventoryInsuranceSalepriceSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='inventory_item.item.name')
    insurance_name = serializers.ReadOnlyField(source='insurance_company.name')
    class Meta:
        model = InventoryInsuranceSaleprice
        fields = '__all__'