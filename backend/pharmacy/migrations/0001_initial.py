# Generated by Django 5.0.8 on 2024-08-24 10:13

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('patient', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PublicPrescriptionRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')], default='pending', max_length=10)),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_changed', models.DateField(auto_now=True)),
                ('public_prescription', models.FileField(blank=True, max_length=254, null=True, upload_to='Prescriptions/public-prescriptions', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'img', 'png', 'jpg'])])),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patient.patient')),
            ],
        ),
    ]
