from django.db import models
from django.db.models import Sum
from django.apps import apps


def invoice_file_path(instance, filename):
    return f'invoices/{instance.invoice_number}/{filename}'


class PaymentMode(models.Model):
    '''
    For total_cash under Invoice to work,
    Cash PaymentMode.payment_category should be cash
    '''
    PAYMENT_CATEGORY_CHOICES = (
        ('cash', 'Cash'),
        ('insurance', 'Insurance'),
        ('mpesa', 'MPesa'),
    )
    paymet_mode = models.CharField(max_length=20, blank=True, null=True)
    insurance = models.ForeignKey(
            'company.InsuranceCompany',
            null=True,
            blank=True,
            on_delete=models.CASCADE
            )
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
    # get total amount with Payment Mode "Cash"
    total_cash = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calculate_invoice_totals(self):
        if self.pk:
            # Calculate total invoice amount
            self.invoice_amount = self.invoice_items.aggregate(
                total_amount=Sum('actual_total')
            )['total_amount'] or 0
            
            # Calculate total cash amount
            self.total_cash = self.invoice_items.filter(
                payment_mode__payment_category='cash'
            ).aggregate(
                total_cash=Sum('actual_total')
            )['total_cash'] or 0

    def save(self, *args, **kwargs):
        self.calculate_invoice_totals()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} - {self.invoice_date} - {self.invoice_amount} - {self.patient.first_name}"


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
    # amount after co-pay is deducted
    actual_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='pending')

    @property
    def sale_price(self):
        Inventory = apps.get_model('inventory', 'Inventory') 
        inventory = Inventory.objects.filter(item=self.item).first()
        if inventory:
            return inventory.sale_price
        return 0
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return self.item.name + ' - ' + str(self.item_created_at)

    
class InsuranceCoPay(models.Model):
    '''
    When an InvoiceItem is billed, check if it exists here. If it does, check its co-pay value
    then deduct that value from the InvoiceItem.item_amount and update the actual_total
    as a result of the subtraction
    '''
    insurance = models.ForeignKey('company.InsuranceCompany', on_delete=models.SET_NULL, null=True)
    co_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    item = models.ForeignKey('inventory.Item', on_delete=models.CASCADE)  