from django.db import models
from customuser.models import CustomUser
from company.models import InsuranceCompany
from django.utils import timezone
from patient.base_model import BaseModel




class Department(BaseModel):
    name = models.CharField(max_length=100)
    

    def __str__(self):
        return f"{self.id} - {self.name}"
    
class Supplier(BaseModel):
    name = models.CharField(max_length=255)
    

    def __str__(self):
        return f"{self.id} - {self.name}"
    
class Item(BaseModel):
    UNIT_CHOICES = [
        ('unit', 'Unit'),
        ('mg', 'Milligram'),
        ('g', 'Gram'),
        ('kg', 'Kilogram'),
        ('ml', 'Milliliter'),
        ('L', 'Liter'),
    ]
    CATEGORY_CHOICES = [
        ('SurgicalEquipment', 'Surgical Equipment'),
        ('LabReagent', 'Lab Reagent'),
        ('Drug', 'Drug'),
        ('Furniture', 'Furniture'),
        ('Lab Test', 'Lab Test'),
        ('General Appointment', 'General Appointment'),
        ('Specialized Appointment', 'Specialized Appointment'),
        ('general', 'General'),
    ]
    item_code = models.CharField(max_length=255, editable=True)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    units_of_measure = models.CharField(max_length=255, choices=UNIT_CHOICES)
    

    def __str__(self):
        return f"{self.id} - {self.name}"


class Requisition(BaseModel):
    STATUS_CHOICES = [
        ('COMPLETED', 'completed'),
        ('PENDING', 'Pending'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default="PENDING")
    file = models.FileField(upload_to='requisitions', null=True, blank=True)

    def __str__(self):
        return self.status
        
class RequisitionItem(BaseModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_requested = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE)
    
    
    def __str__(self):
        return self.id    

class PurchaseOrder(BaseModel):
    STATUS_CHOICES = [
        ('COMPLETED', 'completed'),
        ('PENDING', 'Pending'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default="PENDING")
    file = models.FileField(upload_to='purchase-orders', null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.requested_by)

class PurchaseOrderItem(BaseModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_purchased = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    

    
    def __str__(self):
        return self.id


class IncomingItem(BaseModel):
    CATEGORY_1_CHOICES = [
        ('Resale', 'resale'),
        ('Internal', 'internal'),
    ]
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True,)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    quantity = models.IntegerField()
    category_one = models.CharField(max_length=255, choices=CATEGORY_1_CHOICES) 
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.item.name} - {self.created_at}"

class Inventory(BaseModel):
    CATEGORY_ONE_CHOICES = [
        ('Resale', 'resale'),
        ('Internal', 'internal'),
    ]
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.IntegerField()
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    category_one = models.CharField(max_length=255, choices=CATEGORY_ONE_CHOICES)

    def __str__(self):
        return f"{self.item.name} - {self.created_at}"
    
class InventoryInsuranceSaleprice(models.Model):
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('inventory_item', 'insurance_company')
    
    

class DepartmentInventory(BaseModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    

    def __str__(self):
        return str(self.item)










