from django.db import models
# from inventory.models import Item
# from patient.models import Patient
from django.db.models import Sum


def invoice_file_path(instance, filename):
    return f'invoices/{instance.invoice_number}/{filename}'

class PaymentMode(models.Model):
    PAYMENT_CATEGORY_CHOICES = (
        ('cash', 'Cash'),
        ('insurance', 'Insurance'),
        ('mpesa', 'MPesa'),
    )
    paymet_mode = models.CharField(max_length=20)
    insurance = models.ForeignKey('company.InsuranceCompany',null=True, on_delete=models.CASCADE)
    payment_category = models.CharField(
        max_length=20, choices=PAYMENT_CATEGORY_CHOICES, default='cash')
    
    def __str__(self):
        return self.payment_category + ' - ' + self.paymet_mode


class Invoice(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    )
    patient = models.ForeignKey('patient.Patient', on_delete=models.SET_NULL, null=True)
    invoice_number = models.CharField(max_length=50, null=True)
    invoice_date = models.DateField(null=True)
    invoice_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')
    invoice_description = models.CharField(max_length=200, null=True)
    invoice_file = models.FileField(upload_to=invoice_file_path, null=True, blank=True)
    invoice_created_at = models.DateTimeField(auto_now_add=True)
    invoice_updated_at = models.DateTimeField(auto_now=True)

    def calculate_invoice_amount(self):
        if self.pk:
            total_amount = self.invoice_items.aggregate(
                total_amount=Sum('item__inventory__sale_price'))['total_amount'] or 0
            self.invoice_amount = total_amount

    def save(self, *args, **kwargs):
        self.calculate_invoice_amount()
        super().save(*args, **kwargs) 

    # def __str__(self):
    #     return self.invoice_number

class InvoiceItem(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('billed', 'Billed'),
    )
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='invoice_items')
    item = models.ForeignKey('inventory.Item', on_delete=models.CASCADE)
    item_created_at = models.DateTimeField(auto_now_add=True)
    item_updated_at = models.DateTimeField(auto_now=True)
    payment_mode = models.ForeignKey(PaymentMode, on_delete=models.PROTECT, null=True)
    item_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.invoice.calculate_invoice_amount()
    
    def __str__(self):
        return self.item.name
    
    