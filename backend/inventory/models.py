from django.db import models
# from patient.models import Patient

class Item(models.Model):
    name = models.CharField(max_length=255)
    manufacturer = models.CharField(max_length=255)
   #item_type = models.CharField(max_length=255, choices=[('SurgicalEquipment', 'Surgical Equipment'), ('LabReagent', 'Lab Reagent'), ('Drug', 'Drug'), ('Furniture', 'Furniture')])
    is_asset = models.BooleanField(default=False)
 
    def __str__(self):
        return self.name

class Purchase(models.Model):
    supplier = models.ForeignKey('Supplier', on_delete=models.CASCADE)
    purchase_date = models.DateField()
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

class Sale(models.Model):
    # circular import error
    # patient_id = models.ForeignKey(Patient, on_delete=models.CASCADE)
    sale_date = models.DateField()
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

class Inventory(models.Model):
    item = models.ForeignKey('Item', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

class Supplier(models.Model):
    name = models.CharField(max_length=255)
