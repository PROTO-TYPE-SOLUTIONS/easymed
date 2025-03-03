# Generated by Django 5.0.10 on 2025-02-15 15:07

import billing.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invoice_number', models.CharField(max_length=50, null=True)),
                ('invoice_date', models.DateField(null=True)),
                ('invoice_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid')], default='pending', max_length=10)),
                ('invoice_description', models.CharField(blank=True, max_length=200, null=True)),
                ('invoice_file', models.FileField(blank=True, null=True, upload_to=billing.models.invoice_file_path)),
                ('invoice_created_at', models.DateTimeField(auto_now_add=True)),
                ('invoice_updated_at', models.DateTimeField(auto_now=True)),
                ('total_cash', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('cash_paid', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='InvoiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_created_at', models.DateTimeField(auto_now_add=True)),
                ('item_updated_at', models.DateTimeField(auto_now=True)),
                ('item_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('actual_total', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('billed', 'Billed')], default='pending', max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='InvoicePayment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payment_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('payment_date', models.DateField(null=True)),
                ('payment_created_at', models.DateTimeField(auto_now_add=True)),
                ('payment_updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentMode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paymet_mode', models.CharField(blank=True, default='cash', max_length=20, null=True)),
                ('payment_category', models.CharField(choices=[('cash', 'Cash'), ('insurance', 'Insurance'), ('mpesa', 'MPesa')], default='cash', max_length=20)),
            ],
        ),
    ]
