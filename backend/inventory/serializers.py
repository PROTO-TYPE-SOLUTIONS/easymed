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

class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'


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

class RequisitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requisition
        fields = '__all__'        

class RequisitionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequisitionItem
        fields = '__all__'        
