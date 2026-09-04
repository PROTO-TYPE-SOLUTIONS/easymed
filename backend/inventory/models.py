import random
import uuid
from datetime import datetime

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q, Sum
from django.utils import timezone

from customuser.models import CustomUser
from company.models import InsuranceCompany

'''
Units of measure
----------------
An item has `packed` and `subpacked` properties.

    1 pack (box) of 20 syringes  ->  packed = 1, subpacked = 20
    60 syringes in stock         ->  3 packs

Throughout the system the base unit of measure is the SUBPACKED unit. Every
quantity persisted by the stock ledger is expressed in base units.

Stock model
-----------
Stock is NOT a mutable number. It is the running total of an append-only
ledger (`StockMovement`). `StockBalance` is a derived cache of that ledger,
maintained inside the same transaction as every movement and rebuildable at
any time with `manage.py rebuild_stock_balances`.

Nothing outside `inventory.services.stock` may write a movement or a balance.
'''


class AbstractBaseModel(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True


# Items tagged to this department are shared: every department can use them.
SHARED_DEPARTMENT_NAME = 'General'


class Department(AbstractBaseModel):
    '''
    A department doubles as a stock location. Strict naming should be employed
    as the frontend inventory query depends on it. Choices can be
    Lab
    Pharmacy
    General
    Main
    '''
    name = models.CharField(max_length=100, unique=True)
    is_stock_location = models.BooleanField(
        default=True,
        help_text="Whether stock can be held at this department"
    )

    @property
    def is_shared(self):
        '''The General department stands for "usable by everyone".'''
        return self.name.strip().lower() == SHARED_DEPARTMENT_NAME.lower()

    def __str__(self):
        return f"{self.id} - {self.name}"


class Supplier(AbstractBaseModel):
    official_name = models.CharField(max_length=255)
    common_name = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.id} - {self.official_name} ({self.common_name})"


class Unit(AbstractBaseModel):
    CATEGORY_CHOICES = [
        ('mass', 'Mass / Weight'),
        ('volume', 'Volume'),
        ('length', 'Length'),
        ('concentration', 'Concentration'),
        ('hematology', 'Hematology'),
        ('enzyme', 'Enzyme Activity'),
        ('hormone', 'Hormones & Tumor Markers'),
        ('microbiology', 'Microbiology'),
        ('urinalysis', 'Urinalysis'),
        ('coagulation', 'Coagulation'),
        ('blood_gas', 'Blood Gas'),
        ('osmolality', 'Osmolality & Density'),
        ('molecular', 'Molecular Biology'),
        ('dose', 'Dose & Ratio'),
        ('general', 'General'),
    ]
    symbol = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='general')

    class Meta:
        ordering = ['category', 'symbol']

    def __str__(self):
        return self.symbol


class Item(AbstractBaseModel):
    '''
    The catalogue entry. An Item carries no stock and no price of its own --
    stock lives in the ledger, prices live in ItemPrice / InsuranceItemSalePrice.
    '''
    CATEGORY_CHOICES = [
        ('SurgicalEquipment', 'Surgical Equipment'),
        ('LabReagent', 'Lab Reagent'),  # lab Test Kit
        ('LabConsumable', 'Lab Consumable'),
        ('Drug', 'Drug'),
        ('Furniture', 'Furniture'),
        ('Lab Test', 'Lab Test'),
        ('General Appointment', 'General Appointment'),
        ('Specialized Appointment', 'Specialized Appointment'),
        ('general', 'General'),
    ]

    # Categories that represent a service rather than something you can hold.
    # These are billable but never stock-tracked, which is why the system no
    # longer needs fake "9999 units in stock" rows to make billing work.
    SERVICE_CATEGORIES = frozenset({
        'Lab Test',
        'General Appointment',
        'Specialized Appointment',
    })

    CATEGORY_ONE_CHOICES = [
        ('Resale', 'Resale'),
        ('Internal', 'Internal'),
    ]

    item_code = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    category = models.CharField(max_length=255, choices=CATEGORY_CHOICES)
    category_one = models.CharField(
        max_length=20, choices=CATEGORY_ONE_CHOICES, default='Resale',
        help_text="Whether the item is bought for resale or for internal consumption"
    )
    units_of_measure = models.CharField(max_length=255, blank=True, default='')
    units = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    lab_test_item = models.OneToOneField(
        'self',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reagent_item',
        help_text="Auto-created Lab Test billing item paired to this Lab Reagent"
    )
    vat_rate = models.DecimalField(max_digits=5, decimal_places=2, default=16.0)
    # packed = number of boxes/packs per shipment unit
    # subpacked = units per box (base unit of measure throughout the system)
    packed = models.PositiveIntegerField(default=1)
    subpacked = models.PositiveIntegerField(default=1)
    slow_moving_period = models.IntegerField(default=90)
    is_stock_tracked = models.BooleanField(
        default=True,
        help_text="Services (lab tests, appointments) are billable but hold no stock"
    )
    default_re_order_level = models.PositiveIntegerField(
        default=5,
        help_text="Fallback re-order level when no per-department StockPolicy exists"
    )
    departments = models.ManyToManyField(
        Department,
        through='ItemDepartment',
        related_name='items',
        blank=True,
        help_text="Departments that use this item. Tag it 'General' to share it with all of them",
    )

    class Meta:
        unique_together = ('name', 'category', 'units_of_measure')

    def save(self, *args, **kwargs):
        # A service can never be stock tracked, regardless of what was posted.
        if self.category in self.SERVICE_CATEGORIES:
            self.is_stock_tracked = False
        super().save(*args, **kwargs)

    @property
    def current_sale_price(self):
        '''Cash sale price from the price list, or 0 when unpriced.'''
        price = ItemPrice.current_for(self)
        return price.sale_price if price else 0

    @property
    def current_cost(self):
        '''
        Weighted-average cost per base unit across all stock on hand.
        Returns 0 when nothing is in stock.
        '''
        rows = StockBalance.objects.filter(item=self, quantity__gt=0).values_list('quantity', 'unit_cost')
        total_qty = 0
        total_value = 0
        for qty, cost in rows:
            total_qty += qty
            total_value += qty * (cost or 0)
        if not total_qty:
            return 0
        return total_value / total_qty

    @property
    def quantity_at_hand(self):
        '''Total base units on hand across every lot and every location.'''
        return StockBalance.objects.filter(item=self).aggregate(
            total=Sum('quantity')
        )['total'] or 0

    def is_available_to(self, department):
        '''
        True when this item belongs to `department`, or is shared (tagged
        General), or has not been tagged at all yet.
        '''
        if department is None:
            return True
        links = self.department_links.select_related('department')
        if not links.exists():
            # Untagged items stay usable everywhere rather than disappearing
            # from every department the moment this feature ships.
            return True
        return any(
            link.department_id == department.id or link.department.is_shared
            for link in links
        )

    # Backwards-compatible aliases used by the serializers / front-end.
    @property
    def buying_price(self):
        return self.current_cost

    @property
    def selling_price(self):
        return self.current_sale_price

    def __str__(self):
        return f"{self.id} - {self.name} - {self.category}"


class ItemDepartment(AbstractBaseModel):
    '''
    Which departments use an item.

    Kept as its own table rather than a single FK on Item, because plenty of
    items are used by more than one department (gloves, syringes, saline). An
    item tagged to the General department is shared with every department, so
    there is no need to enumerate them.
    '''
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='department_links')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='item_links')
    is_primary = models.BooleanField(
        default=False,
        help_text="The department that owns this item, used as the default stock location"
    )

    class Meta:
        verbose_name = 'Item department'
        verbose_name_plural = 'Item departments'
        constraints = [
            models.UniqueConstraint(fields=['item', 'department'], name='uniq_item_department'),
        ]
        indexes = [models.Index(fields=['department', 'item'], name='inv_itemdept_dept_item_idx')]

    def __str__(self):
        return f"{self.item.name} @ {self.department.name}"


class ItemPrice(AbstractBaseModel):
    '''
    Cash price list. Prices are effective-dated so a price change never
    rewrites history -- an invoice raised last month keeps last month's price.
    '''
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='prices')
    sale_price = models.DecimalField(max_digits=12, decimal_places=2)
    effective_from = models.DateField(default=timezone.localdate)
    effective_to = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-effective_from', '-id']
        indexes = [models.Index(fields=['item', 'effective_from'], name='inv_itemprice_item_eff_idx')]

    @classmethod
    def current_for(cls, item, on=None):
        on = on or timezone.localdate()
        return cls.objects.filter(
            item=item,
            effective_from__lte=on,
        ).filter(
            Q(effective_to__isnull=True) | Q(effective_to__gte=on)
        ).order_by('-effective_from', '-id').first()

    def clean(self):
        if self.effective_to and self.effective_to < self.effective_from:
            raise ValidationError("effective_to cannot be before effective_from")

    def __str__(self):
        return f"{self.item.name} @ {self.sale_price} from {self.effective_from}"


class InsuranceItemSalePrice(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    insurance_company = models.ForeignKey(InsuranceCompany, on_delete=models.CASCADE)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    co_pay = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('item', 'insurance_company')
        verbose_name = "Insurance Item Sale Price"
        verbose_name_plural = "Insurance Item Sale Prices"

    def __str__(self):
        return f"{self.item.name} - {self.insurance_company.name}"


class Requisition(AbstractBaseModel):
    requisition_number = models.CharField(max_length=50, unique=True, editable=False)
    file = models.FileField(upload_to='requisitions', null=True, blank=True)
    department_approved = models.BooleanField(default=False)
    procurement_approved = models.BooleanField(default=False)
    department_approval_date = models.DateTimeField(null=True, blank=True)
    procurement_approval_date = models.DateTimeField(null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, max_length=255, null=False, blank=False)
    requested_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='req_requested_by')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='req_approved_by')

    def save(self, *args, **kwargs):
        '''Generate the requisition number once, on creation only.'''
        if not self.requisition_number:
            today = timezone.now()
            abbr = self.department.name[:3].upper()
            random_code = random.randint(1000, 9999)
            self.requisition_number = (
                f"{abbr}/{today.year % 100}/{today.month:02d}/{today.day:02d}/{random_code}"
            )
        super().save(*args, **kwargs)

    def __str__(self):
        return self.requisition_number


class RequisitionItem(AbstractBaseModel):
    quantity_requested = models.IntegerField()
    quantity_approved = models.IntegerField(default=0)
    ordered = models.BooleanField(default=False)
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE, related_name='items')
    preferred_supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id and (self.quantity_approved is None or self.quantity_approved == 0):
            self.quantity_approved = self.quantity_requested
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item.name} - Requested: {self.quantity_requested}, Approved: {self.quantity_approved}"


class PurchaseOrder(AbstractBaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PARTIAL = 'PARTIAL', 'Partial'
        COMPLETED = 'COMPLETED', 'Completed'

    PO_number = models.CharField(unique=True, max_length=255, editable=False)
    file = models.FileField(upload_to='purchase-orders', null=True, blank=True)
    is_dispatched = models.BooleanField(default=False)
    ordered_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='ordered_by')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='po_approved_by')
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.PENDING)
    requisition = models.ForeignKey(Requisition, on_delete=models.SET_NULL, null=True, blank=True, related_name='requisition')
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='supplier')

    class Meta:
        ordering = ['-date_created']

    def save(self, *args, **kwargs):
        """Generate purchase order number only on creation."""
        if not self.PO_number:
            today = timezone.now()
            random_code = random.randint(1000, 9999)
            self.PO_number = f"PO/{today.year % 100}/{today.month:02d}/{today.day:02d}/{random_code}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Purchase Order by {self.ordered_by} - PO Number: {self.PO_number} - Status {self.status}"


class PurchaseOrderItem(AbstractBaseModel):
    '''
    Quantities are in base units. The purchase order PDF converts them back to
    packs for the supplier.
    '''
    quantity_ordered = models.IntegerField(default=0)
    quantity_received = models.IntegerField(default=0)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='po_items')
    requisition_item = models.ForeignKey(RequisitionItem, on_delete=models.CASCADE, null=True, blank=True, related_name='purchase_order_items')

    def clean(self):
        if self.quantity_received > self.quantity_ordered:
            raise ValidationError("Quantity received cannot exceed quantity ordered")

    def __str__(self):
        return f"{self.requisition_item.item.name} - PO_no: {self.purchase_order.PO_number}"


class SupplierInvoice(AbstractBaseModel):
    STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]
    invoice_no = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    status = models.CharField(max_length=255, choices=STATUS, default="pending")
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='supplier_invoices')

    class Meta:
        ordering = ['-date_created']

    def recalculate_amount(self, save=True):
        '''Sum of the line totals of every receipt line billed on this invoice.'''
        total = sum((line.line_total for line in self.incomingitem_set.all()), 0)
        self.amount = total
        if save and self.pk:
            SupplierInvoice.objects.filter(pk=self.pk).update(amount=total)
        return total

    def __str__(self):
        return f"{self.invoice_no} - PO: {self.purchase_order.PO_number}"


class GoodsReceiptNote(AbstractBaseModel):
    note = models.TextField(max_length=255, null=True, blank=True)
    grn_number = models.CharField(max_length=50, null=True, blank=True, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk and not self.grn_number:
            today = datetime.now().strftime('%Y%m%d')
            unique_id = uuid.uuid4().hex[:6].upper()
            self.grn_number = f'{today}-GRN-{unique_id}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.note} - {self.grn_number} - {self.date_created}"


class IncomingItem(AbstractBaseModel):
    '''
    A goods-received line. Creating one does not itself change stock -- posting
    it does, via `inventory.services.stock.receive_incoming_item`, which writes
    a RECEIPT movement and stamps `posted_at` so a double submission is a no-op.
    '''
    QUANTITY_UNIT_CHOICES = [
        ('packs', 'Packs'),    # staff enters number of boxes/packs; system converts to base units
        ('units', 'Units'),    # staff enters base units (subpacked) directly
    ]
    purchase_price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Cost of ONE unit of `quantity_unit` (one pack, or one base unit)"
    )
    sale_price = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        help_text="Optional. When set, opens a new cash price for the item"
    )
    quantity = models.IntegerField()
    quantity_unit = models.CharField(max_length=10, choices=QUANTITY_UNIT_CHOICES, default='units')
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    department = models.ForeignKey(
        Department, on_delete=models.PROTECT, null=True, blank=True,
        related_name='incoming_items',
        help_text="Location the goods are received into. Defaults to the requisition's department"
    )
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, null=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.SET_NULL, null=True, blank=True)
    lot_no = models.CharField(max_length=255, null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    supplier_invoice = models.ForeignKey(SupplierInvoice, on_delete=models.SET_NULL, null=True, blank=True)
    goods_receipt_note = models.ForeignKey(GoodsReceiptNote, on_delete=models.SET_NULL, null=True, blank=True)
    posted_at = models.DateTimeField(
        null=True, blank=True,
        help_text="Set when the line has been posted to the stock ledger"
    )
    received_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-date_created']

    @property
    def base_units(self):
        '''`quantity` converted to base units (subpacked).'''
        if self.quantity_unit == 'packs':
            return self.quantity * (self.item.subpacked or 1)
        return self.quantity

    @property
    def unit_cost(self):
        '''Purchase price expressed per BASE unit.'''
        if self.purchase_price is None:
            return 0
        if self.quantity_unit == 'packs':
            return self.purchase_price / (self.item.subpacked or 1)
        return self.purchase_price

    @property
    def line_total(self):
        '''What the supplier charges for this line, in the unit they quoted.'''
        if self.purchase_price is None:
            return 0
        return self.purchase_price * self.quantity

    @property
    def is_posted(self):
        return self.posted_at is not None

    def __str__(self):
        return f"{self.item.name} - {self.date_created}"


# ---------------------------------------------------------------------------
# Stock ledger
# ---------------------------------------------------------------------------

class StockLot(AbstractBaseModel):
    '''
    The physical identity of a batch: which item, which lot number, which
    expiry. A lot is never revalued and never deleted -- cost belongs to the
    movements and balances that reference it.
    '''
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='lots')
    lot_number = models.CharField(
        max_length=100, blank=True, default='',
        help_text="Supplier batch number. Empty string means untracked/no lot"
    )
    expiry_date = models.DateField(null=True, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['expiry_date', 'id']
        constraints = [
            models.UniqueConstraint(
                fields=['item', 'lot_number', 'expiry_date'],
                condition=Q(expiry_date__isnull=False),
                name='uniq_stock_lot_dated',
            ),
            # Postgres treats NULLs as distinct, so undated lots need their own
            # partial constraint or duplicates slip through.
            models.UniqueConstraint(
                fields=['item', 'lot_number'],
                condition=Q(expiry_date__isnull=True),
                name='uniq_stock_lot_undated',
            ),
        ]
        indexes = [models.Index(fields=['item', 'expiry_date'], name='inv_stocklot_item_exp_idx')]

    @property
    def is_expired(self):
        return bool(self.expiry_date and self.expiry_date < timezone.localdate())

    def __str__(self):
        label = self.lot_number or 'no-lot'
        return f"{self.item.name} [{label}] exp {self.expiry_date or '-'}"


class StockMovement(AbstractBaseModel):
    '''
    THE LEDGER. Append-only: rows are never updated and never deleted. A
    mistake is corrected with a contra entry (see services.stock.reverse).
    '''

    class Type(models.TextChoices):
        OPENING_BALANCE = 'OPENING_BALANCE', 'Opening balance'
        RECEIPT = 'RECEIPT', 'Goods received'
        RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER', 'Return to supplier'
        SALE = 'SALE', 'Sale / dispense to patient'
        CONSUMPTION = 'CONSUMPTION', 'Internal consumption'
        TRANSFER_OUT = 'TRANSFER_OUT', 'Transfer out'
        TRANSFER_IN = 'TRANSFER_IN', 'Transfer in'
        ADJUSTMENT = 'ADJUSTMENT', 'Stock take adjustment'
        WASTAGE = 'WASTAGE', 'Wastage / breakage'
        EXPIRY_WRITE_OFF = 'EXPIRY_WRITE_OFF', 'Expiry write-off'
        RETURN_FROM_ISSUE = 'RETURN_FROM_ISSUE', 'Return from ward/patient'
        REVERSAL = 'REVERSAL', 'Reversal of an earlier movement'

    # Types whose quantity must be positive / negative. ADJUSTMENT and REVERSAL
    # are the only ones allowed to go either way.
    INFLOW_TYPES = frozenset({
        Type.OPENING_BALANCE, Type.RECEIPT, Type.TRANSFER_IN, Type.RETURN_FROM_ISSUE,
    })
    OUTFLOW_TYPES = frozenset({
        Type.SALE, Type.CONSUMPTION, Type.TRANSFER_OUT, Type.WASTAGE,
        Type.EXPIRY_WRITE_OFF, Type.RETURN_TO_SUPPLIER,
    })

    class Source(models.TextChoices):
        MANUAL = 'MANUAL', 'Manual entry'
        GOODS_RECEIPT = 'GOODS_RECEIPT', 'Goods receipt note'
        INVOICE_ITEM = 'INVOICE_ITEM', 'Invoice item'
        LAB_TEST = 'LAB_TEST', 'Lab test run'
        SAMPLE_COLLECTION = 'SAMPLE_COLLECTION', 'Sample collection'
        STOCK_TAKE = 'STOCK_TAKE', 'Stock take'
        TRANSFER = 'TRANSFER', 'Stock transfer'
        SYSTEM = 'SYSTEM', 'System'

    # Groups the legs of a single logical transaction (e.g. both sides of a
    # transfer, or every lot touched by one FEFO issue).
    reference = models.UUIDField(default=uuid.uuid4, db_index=True, editable=False)
    movement_type = models.CharField(max_length=30, choices=Type.choices)
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='stock_movements')
    lot = models.ForeignKey(StockLot, on_delete=models.PROTECT, related_name='movements')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='stock_movements')

    quantity = models.IntegerField(help_text="Signed, in base units. Negative = stock leaving")
    unit_cost = models.DecimalField(
        max_digits=14, decimal_places=4, default=0,
        help_text="Cost per base unit applied by this movement"
    )
    balance_after = models.IntegerField(
        default=0,
        help_text="Running balance of this item/lot/department after the movement"
    )

    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)
    posted_at = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.CharField(max_length=255, blank=True, default='')

    # Source document. Kept as a (type, id, reference) triple rather than a FK
    # per app so `inventory` does not have to import billing/laboratory.
    source_type = models.CharField(max_length=30, choices=Source.choices, default=Source.MANUAL)
    source_id = models.PositiveIntegerField(null=True, blank=True)
    source_reference = models.CharField(
        max_length=100, blank=True, default='',
        help_text="Human-readable document number, e.g. the GRN or invoice number"
    )

    # In-app source documents, kept as real FKs for integrity.
    goods_receipt_note = models.ForeignKey(
        GoodsReceiptNote, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_movements')
    incoming_item = models.ForeignKey(
        IncomingItem, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_movements')

    reverses = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='reversals')
    idempotency_key = models.CharField(max_length=120, null=True, blank=True, unique=True)

    class Meta:
        ordering = ['-posted_at', '-id']
        indexes = [
            models.Index(fields=['item', 'department', 'occurred_at'], name='inv_move_item_dept_at_idx'),
            models.Index(fields=['lot', 'occurred_at'], name='inv_move_lot_at_idx'),
            models.Index(fields=['movement_type', 'occurred_at'], name='inv_move_type_at_idx'),
            models.Index(fields=['source_type', 'source_id'], name='inv_move_source_idx'),
        ]
        constraints = [
            models.CheckConstraint(check=~Q(quantity=0), name='stock_movement_quantity_nonzero'),
        ]

    @property
    def total_cost(self):
        return self.quantity * self.unit_cost

    def save(self, *args, **kwargs):
        if self.pk and not self._state.adding:
            raise ValidationError(
                f"StockMovement is append-only. Post a reversal instead of editing movement #{self.pk}."
            )
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError(
            f"StockMovement is append-only. Post a reversal instead of deleting movement #{self.pk}."
        )

    def __str__(self):
        return f"{self.movement_type} {self.quantity:+d} {self.item.name} @ {self.department.name}"


class StockBalance(AbstractBaseModel):
    '''
    Derived cache of the ledger, one row per item / lot / location. Written
    only by inventory.services.stock, always under a row lock, always in the
    same transaction as the movement that changed it.

    `quantity` is deliberately signed: a negative balance is drift we want to
    see and alert on, not an IntegrityError that hides the cause.
    '''
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='balances')
    lot = models.ForeignKey(StockLot, on_delete=models.PROTECT, related_name='balances')
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='stock_balances')

    quantity = models.IntegerField(default=0)
    unit_cost = models.DecimalField(
        max_digits=14, decimal_places=4, default=0,
        help_text="Weighted-average cost per base unit for this lot at this location"
    )
    last_movement_at = models.DateTimeField(null=True, blank=True)
    last_receipt_at = models.DateTimeField(null=True, blank=True)
    last_issue_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Stock balance'
        verbose_name_plural = 'Stock balances'
        constraints = [
            models.UniqueConstraint(fields=['item', 'lot', 'department'], name='uniq_stock_balance'),
        ]
        indexes = [
            models.Index(fields=['item', 'department'], name='inv_bal_item_dept_idx'),
            models.Index(fields=['department', 'quantity'], name='inv_bal_dept_qty_idx'),
        ]

    @property
    def total_value(self):
        return self.quantity * self.unit_cost

    @property
    def quantity_at_hand(self):
        '''Alias kept so report templates and the dashboard read the same name.'''
        return self.quantity

    @property
    def expiry_date(self):
        return self.lot.expiry_date

    @property
    def lot_number(self):
        return self.lot.lot_number

    @property
    def is_expired(self):
        return self.lot.is_expired

    def __str__(self):
        return f"{self.item.name} @ {self.department.name} [{self.lot.lot_number or 'no-lot'}] = {self.quantity}"


class StockPolicy(AbstractBaseModel):
    '''
    Per item, per location replenishment rule. A re-order level belongs to an
    item at a location, never to an individual lot.
    '''
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='stock_policies')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='stock_policies')
    re_order_level = models.PositiveIntegerField(default=5)
    reorder_quantity = models.PositiveIntegerField(default=0, help_text="Suggested quantity to order, in base units")
    max_level = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Stock policies'
        constraints = [
            models.UniqueConstraint(fields=['item', 'department'], name='uniq_stock_policy'),
        ]

    def __str__(self):
        return f"{self.item.name} @ {self.department.name} re-order at {self.re_order_level}"


class StockReservation(AbstractBaseModel):
    '''
    Soft allocation held between the moment stock is promised (prescribed,
    test ordered) and the moment it is issued. Available stock is the balance
    minus every ACTIVE reservation.
    '''
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        CONSUMED = 'CONSUMED', 'Consumed'
        RELEASED = 'RELEASED', 'Released'
        EXPIRED = 'EXPIRED', 'Expired'

    reference = models.UUIDField(default=uuid.uuid4, db_index=True, editable=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='reservations')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='stock_reservations')
    lot = models.ForeignKey(StockLot, on_delete=models.SET_NULL, null=True, blank=True, related_name='reservations')
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    expires_at = models.DateTimeField(null=True, blank=True)
    reason = models.CharField(max_length=255, blank=True, default='')
    source_type = models.CharField(
        max_length=30, choices=StockMovement.Source.choices, default=StockMovement.Source.MANUAL)
    source_id = models.PositiveIntegerField(null=True, blank=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['item', 'department', 'status'], name='inv_resv_item_dept_st_idx'),
            models.Index(fields=['status', 'expires_at'], name='inv_resv_status_exp_idx'),
        ]

    @property
    def is_live(self):
        if self.status != self.Status.ACTIVE:
            return False
        return not (self.expires_at and self.expires_at < timezone.now())

    def __str__(self):
        return f"{self.quantity} x {self.item.name} reserved @ {self.department.name} ({self.status})"


class StockTake(AbstractBaseModel):
    '''
    A physical count. Posting one writes ADJUSTMENT movements for the variance
    on each line -- the count never overwrites a balance directly.
    '''
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        POSTED = 'POSTED', 'Posted'
        CANCELLED = 'CANCELLED', 'Cancelled'

    reference_number = models.CharField(max_length=50, unique=True, editable=False)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name='stock_takes')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    note = models.TextField(blank=True, default='')
    counted_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_takes_counted')
    posted_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_takes_posted')
    posted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date_created']

    def save(self, *args, **kwargs):
        if not self.reference_number:
            today = datetime.now().strftime('%Y%m%d')
            self.reference_number = f"ST-{today}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference_number} - {self.department.name} ({self.status})"


class StockTakeLine(models.Model):
    stock_take = models.ForeignKey(StockTake, on_delete=models.CASCADE, related_name='lines')
    lot = models.ForeignKey(StockLot, on_delete=models.PROTECT, related_name='stock_take_lines')
    system_quantity = models.IntegerField(default=0, help_text="Ledger balance captured when the line was created")
    counted_quantity = models.IntegerField(default=0)
    note = models.CharField(max_length=255, blank=True, default='')
    movement = models.ForeignKey(
        StockMovement, on_delete=models.SET_NULL, null=True, blank=True, related_name='stock_take_lines')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['stock_take', 'lot'], name='uniq_stock_take_line'),
        ]

    @property
    def variance(self):
        return self.counted_quantity - self.system_quantity

    def __str__(self):
        return f"{self.lot} counted {self.counted_quantity} (system {self.system_quantity})"


# ---------------------------------------------------------------------------
# Quotations & supplier payments
# ---------------------------------------------------------------------------

class QuotationCustomer(models.Model):
    customer = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    contact_person = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.email} - {self.phone} - {self.address}"


class Quotation(AbstractBaseModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    quotation_number = models.CharField(max_length=50, unique=True, editable=False)
    file = models.FileField(upload_to='quotations', null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='quotation_created_by')
    approved_by = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='quotation_approved_by')
    customer = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='customer')
    customer2 = models.ForeignKey(QuotationCustomer, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.quotation_number:
            today = datetime.now().strftime('%Y%m%d')
            self.quotation_number = f"QT-{today}-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quotation_number} - {self.date_created}"


class QuotationItem(models.Model):
    quantity = models.IntegerField()
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    quotation_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.item.name} - {self.quantity}"


class SupplierPaymentReceipt(AbstractBaseModel):
    """
    Records payments made to suppliers for their invoices.
    Similar to PaymentReceipt but for outgoing payments.
    """
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='payment_receipts')
    sub_account = models.ForeignKey(
        'billing.SubAccount', on_delete=models.SET_NULL, null=True, blank=True, related_name='supplier_receipts')
    payment_mode = models.ForeignKey('billing.PaymentMode', on_delete=models.PROTECT, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    reference_number = models.CharField(max_length=100)
    payment_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['supplier']),
            models.Index(fields=['payment_date']),
        ]

    def __str__(self):
        currency_label = (
            getattr(settings, 'EASYMED_CURRENCY_SYMBOL', '')
            or getattr(settings, 'EASYMED_CURRENCY_CODE', '')
            or ''
        ).strip()
        if currency_label:
            return f"Payment Receipt #{self.id} - {self.supplier.official_name} - {currency_label} {self.total_amount}"
        return f"Payment Receipt #{self.id} - {self.supplier.official_name} - {self.total_amount}"


class SupplierPaymentAllocation(models.Model):
    """
    Tracks how a supplier payment is allocated across supplier invoices.
    """
    receipt = models.ForeignKey(SupplierPaymentReceipt, on_delete=models.CASCADE, related_name='allocations')
    supplier_invoice = models.ForeignKey(SupplierInvoice, on_delete=models.CASCADE, related_name='payment_allocations')
    amount_applied = models.DecimalField(max_digits=12, decimal_places=2)
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['applied_at']),
            models.Index(fields=['supplier_invoice']),
        ]

    def __str__(self):
        return f"Allocation {self.amount_applied} to Invoice {self.supplier_invoice.invoice_no}"
