from django.db import models
from customuser.models import CustomUser
from company.models import InsuranceCompany
from django.utils import timezone


class Department(models.Model):
    name = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.name}"
    
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.name}"
    
class Item(models.Model):
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
    id = models.CharField(max_length=255, primary_key=True, editable=True)
    item_code=models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    units_of_measure = models.CharField(max_length=255, choices=UNIT_CHOICES)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.name}"


class Requisition(models.Model):
    STATUS_CHOICES = [
        ('COMPLETED', 'completed'),
        ('PENDING', 'Pending'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default="PENDING")
    file = models.FileField(upload_to='requisitions', null=True, blank=True)
    department=models.ForeignKey(Department, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.status
        
class RequisitionItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_requested = models.IntegerField()
    quantity_purchased = models.IntegerField(default=0, editable=False)  # New field to track purchased quantity
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE, related_name='items')
    date_created = models.DateTimeField(auto_now_add=True)

    @property
    def quantity_outstanding(self):
        return max(0, self.quantity_requested - self.quantity_purchased)

    def __str__(self):
        return f"{self.item.name} - Requested: {self.quantity_requested}, Purchased: {self.quantity_purchased}"


class PurchaseOrder(models.Model):
    class STATUS_CHOICES(models.TextChoices):
        COMPLETED = 'COMPLETED', 'Completed'
        PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED', 'Partially Completed'
        PENDING = 'PENDING', 'Pending'

    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES.choices, default=STATUS_CHOICES.PENDING)
    file = models.FileField(upload_to='purchase-orders', null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.SET_NULL, null=True, blank=True)

    def update_status(self):
        if all(item.quantity_purchased >= item.quantity_requested for item in self.requisition.items.all()):
            self.status = self.STATUS_CHOICES.COMPLETED
        elif any(item.quantity_purchased > 0 for item in self.requisition.items.all()):
            self.status = self.STATUS_CHOICES.PARTIALLY_COMPLETED
        else:
            self.status = self.STATUS_CHOICES.PENDING
        self.save()

    def __str__(self):
        return f"Purchase Order by {self.requested_by} - Status: {self.status}"


class PurchaseOrderItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_purchased = models.IntegerField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    requisition_item = models.ForeignKey(RequisitionItem, on_delete=models.CASCADE, related_name='purchase_order_items', null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.requisition_item:
            self.requisition_item.quantity_purchased += self.quantity_purchased
            self.requisition_item.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item.name} - Purchased: {self.quantity_purchased}"

class IncomingItem(models.Model):
    CATEGORY_1_CHOICES = [
        ('Resale', 'resale'),
        ('Internal', 'internal'),
    ]
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_code= models.CharField(max_length=255) # so as to hide names from user
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True,)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    quantity = models.IntegerField()
    category_one = models.CharField(max_length=255, choices=CATEGORY_1_CHOICES) 
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.item.name} - {self.date_created}"


class Inventory(models.Model):
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
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    category_one = models.CharField(max_length=255, choices=CATEGORY_ONE_CHOICES)

    def __str__(self):
        return f"{self.item.name} - {self.date_created}"
    
    class meta:
        verbose_name_plural = 'Inventory'
    
class InventoryInsuranceSaleprice(models.Model):
    inventory_item = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.inventory_item.item.name} - {self.insurance_company.name}"
    
    class Meta:
        unique_together = ('inventory_item', 'insurance_company')
    
    

class DepartmentInventory(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return str(self.item)










