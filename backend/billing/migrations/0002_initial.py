# Generated by Django 5.0.10 on 2025-01-24 04:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('billing', '0001_initial'),
        ('company', '0001_initial'),
        ('inventory', '0001_initial'),
        ('patient', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='patient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='patient.patient'),
        ),
        migrations.AddField(
            model_name='invoiceitem',
            name='invoice',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invoice_items', to='billing.invoice'),
        ),
        migrations.AddField(
            model_name='invoiceitem',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.item'),
        ),
        migrations.AddField(
            model_name='paymentmode',
            name='insurance',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='company.insurancecompany'),
        ),
        migrations.AddField(
            model_name='invoiceitem',
            name='payment_mode',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='billing.paymentmode'),
        ),
    ]
