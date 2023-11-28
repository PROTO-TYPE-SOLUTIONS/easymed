from django.db import models
# from patient.models import Patient

class Supplier(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Inventory(models.Model):
    LOCATION_CHOICES = (
        ('mainst', 'Mainst'),
        ('laboratory', 'Laboratory'),
        ('radiology', 'Radiology'),
        ('pharmacy', 'Pharmacy'),
        ('reception', 'Reception'),
    )
    item_ID = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.CharField(max_length=255)
    location = models.CharField(max_length=10, choices=LOCATION_CHOICES, default='mainst')
    expiry_date = models.DateField()
    supplier_ID = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str(self.item_ID)


class Item(models.Model):
    UNIT_CHOICES = [
        ('unit', 'Unit'),
        ('mg', 'Milligram'),
        ('g', 'Gram'),
        ('kg', 'Kilogram'),
        ('ml', 'Milliliter'),
        ('L', 'Liter'),
    ]
    name = models.CharField(max_length=255)
    item_no = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=[
        ('SurgicalEquipment', 'Surgical Equipment'),
        ('LabReagent', 'Lab Reagent'),
        ('Drug', 'Drug'),
        ('Furniture', 'Furniture'),
        ('Lab Test', 'Lab Test'),
    ])
    units_of_measure = models.CharField(max_length=255, choices=UNIT_CHOICES)

    def __str__(self):
        return self.name

class PurchaseOrder(models.Model):
    supplier_ID = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    order_date = models.DateField()
    item_ID = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    Total_Cost = models.CharField(max_length=255)


class OrderBill (models.Model):
    STATUS_CHOICES = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
    )
    payment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='unpaid')
    # patient_ID =  models.ForeignKey(Patient, on_delete=models.CASCADE)
    bill_date = models.DateTimeField(auto_now_add=True)
    total_Cost = models.CharField(max_length=255, null=True, blank=True)
    