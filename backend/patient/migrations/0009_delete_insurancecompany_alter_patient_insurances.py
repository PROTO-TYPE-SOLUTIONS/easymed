# Generated by Django 5.0.6 on 2024-07-24 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0003_insurancecompany'),
        ('patient', '0008_remove_patient_insurance_patient_insurances'),
    ]

    operations = [
        migrations.DeleteModel(
            name='InsuranceCompany',
        ),
        migrations.AlterField(
            model_name='patient',
            name='insurances',
            field=models.ManyToManyField(blank=True, to='billing.insurancecompany'),
        ),
    ]
