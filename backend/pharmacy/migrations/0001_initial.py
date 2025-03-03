# Generated by Django 5.0.10 on 2025-02-15 15:07

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventory', '0001_initial'),
        ('patient', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='DrugsFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateField(auto_now_add=True)),
                ('date_changed', models.DateField(auto_now=True)),
                ('feedback', models.TextField(blank=True, max_length=1000, null=True)),
                ('drug', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
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
