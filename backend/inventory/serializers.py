from rest_framework import serializers
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


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['item', 'quantity_purchased', 'supplier']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['requested_by', 'requisition', 'file', 'status', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        requisition = validated_data.get('requisition')

        # Check if the requisition is already completed
        if requisition.status == 'COMPLETED':
            raise serializers.ValidationError("This requisition is already completed.")

        purchase_order = PurchaseOrder.objects.create(**validated_data)

        for item_data in items_data:
            requisition_item = RequisitionItem.objects.get(
                requisition=requisition,
                item=item_data['item']
            )

            PurchaseOrderItem.objects.create(
                purchase_order=purchase_order,
                requisition_item=requisition_item,
                **item_data
            )
            
        purchase_order.update_status()

        return purchase_order


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = '__all__'        

class IncomingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncomingItem
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    insurance_sale_prices = serializers.SerializerMethodField()
    class Meta:
        model = Inventory
        fields = ['item', 'purchase_price', 'sale_price', 'quantity_in_stock', 'packed', 'subpacked', 'date_created', 'category_one', 'insurance_sale_prices']

    def get_insurance_sale_prices(self, obj):
        # Retrieve all related insurance sale prices
        sale_prices = InventoryInsuranceSaleprice.objects.filter(inventory_item=obj)
        insurance_prices = []
        for sale in sale_prices:
            # Create a dictionary for each sale price
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


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

# class RequisitionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Requisition
#         fields = '__all__'        

# class RequisitionItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RequisitionItem
#         fields = '__all__'        

# serializers.py
from rest_framework import serializers
from .models import Requisition, RequisitionItem
from django.contrib.auth import get_user_model

CustomUser = get_user_model()
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Department
        fields=['name']

class RequisitionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionItem
        fields = ['id', 'item', 'quantity_requested', 'supplier', 'date_created']
        read_only_fields = ['id', 'date_created']

class RequisitionSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True)
    department=DepartmentSerializer()
    requested_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Requisition
        fields = ['id', 'department', 'requested_by', 'date_created', 'status', 'file', 'items']
        read_only_fields = ['id', 'date_created']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        requested_by = validated_data.pop('requested_by')  # Remove requested_by from validated_data
        department_data = validated_data.pop('department')

        department_name=department_data.get('name')
        department, created = Department.objects.get_or_create(name=department_name)

        # Create the Requisition instance with the provided requested_by
        requisition = Requisition.objects.create(requested_by=requested_by, department=department, **validated_data)
        
        # Create associated RequisitionItem instances
        for item_data in items_data:
            RequisitionItem.objects.create(requisition=requisition, **item_data)
        
        return requisition
