from rest_framework import serializers
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

class RequisitionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionItem
        fields = ['id', 'item', 'quantity_requested','quantity_approved', 'preferred_supplier', 'date_created']
        read_only_fields = ['id', 'date_created']

        def validate(self, attrs):
            if attrs['quantity_approved'] > attrs['quantity_requested']:
                raise serializers.ValidationError('quantity approved cannot exceed quantity requested')
            return attrs
        
    # def update(self, instance, validated_data):
    #     # Get the initial status before the update
    #     initial_status = instance.status

    #     # Update the instance with new data
    #     instance = super().update(instance, validated_data)

    #     # Check if the status has changed to 'APPROVED'
    #     if validated_data.get('status') == 'APPROVED' and initial_status != 'APPROVED':
    #         if PurchaseOrder.objects.filter(requisition=instance.requisition).exists():
    #             purchase_order=PurchaseOrder.objects.get(requisition=instance.requisition)
    #         else:
    #             purchase_order=PurchaseOrder.objects.create(requested_by=instance.requisition.requested_by,
    #                                                         requisition=instance.requisition
    #                                                         )
    #         print('wtf')
    #         order = PurchaseOrderItem.objects.create(item=instance.item, supplier=instance.supplier, quantity_purchased=validated_data.get('quantity_approved'), purchase_order=purchase_order,
    #                                          requisition_item=instance)

    #         print(order)

    #     return instance



class RequisitionCreateSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True)
    department=DepartmentSerializer()
    requested_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Requisition
        fields = ['requested_by', 'department','items']
        read_only_fields = ['id', 'date_created']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        requested_by = validated_data.pop('requested_by') 
        department_data = validated_data.pop('department')

        try:
            department_name=department_data.get('name')
            department = Department.objects.get(name=department_name)
        except Department.DoesNotExist:
            raise serializers.ValidationError(f'Department  "{department_name}" does not exist')

        requisition = Requisition.objects.create(requested_by=requested_by, department=department, **validated_data)
        
        # Create associated RequisitionItem instances
        for item_data in items_data:
            RequisitionItem.objects.create(requisition=requisition, **item_data)
        
        return requisition
    
class RequisitionListSerializer(serializers.ModelSerializer):
    items = RequisitionItemSerializer(many=True, read_only=True)
    requested_by = serializers.CharField(source='requested_by.first_name')

    class Meta:
        model = Requisition
        fields = ['id, requisiion_number', 'requested_by', 'items']


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = ['item', 'quantity_purchased', 'supplier']

class PurchaseOrderCreateSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True)

    class Meta:
        model = PurchaseOrder
        fields = ['requested_by', 'file', 'items']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
                                                  

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'requested_by', 'date_created', 'file', 'requisition', 'items']
     

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


