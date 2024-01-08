from django.db import models
from customuser.models import CustomUser


class Department(models.Model):
    name = models.CharField(max_length=100)
    date_created = models.DateField(auto_now_add=True)


    def __str__(self):
        return self.name
    
class Supplier(models.Model):
    name = models.CharField(max_length=255)
    date_created = models.DateField(auto_now_add=True)


    def __str__(self):
        return self.name
    
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
        ('general', 'General'),
    ]
    id = models.CharField(max_length=255, primary_key=True, editable=True)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    units_of_measure = models.CharField(max_length=255, choices=UNIT_CHOICES)
    date_created = models.DateField(auto_now_add=True)



    def __str__(self):
        return self.name

# will create signal to update Inventory table when this object is created
class IncomingItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    date_created = models.DateField(auto_now_add=True)



class DepartmentInventory(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    date_created = models.DateField(auto_now_add=True)

    
    def __str__(self):
        return str(self.item)

class Inventory(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_in_stock = models.IntegerField()
    packed = models.CharField(max_length=255)
    subpacked = models.CharField(max_length=255)
    date_created = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.item


class Requisition(models.Model):
    STATUS_CHOICES = [
        ('COMPLETED', 'completed'),
        ('PENDING', 'Pending'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default="PENDING")
    file = models.FileField(upload_to='requisitions', null=True, blank=True)

    def __str__(self):
        return self.id



class RequisitionItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_requested = models.CharField(max_length=255)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)

    
    def __str__(self):
        return self.id



class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('COMPLETED', 'completed'),
        ('PENDING', 'Pending'),
    ]
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default="PENDING")
    file = models.FileField(upload_to='purchase-orders', null=True, blank=True)

    def __str__(self):
        return self.id



class PurchaseOrderItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity_purchased = models.CharField(max_length=255)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)

    
    def __str__(self):
        return self.id
