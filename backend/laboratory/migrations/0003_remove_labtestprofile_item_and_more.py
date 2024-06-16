# Generated by Django 5.0.3 on 2024-06-08 15:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0001_initial'),
        ('laboratory', '0002_remove_labtestresultqualitative_lab_test_request_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='labtestprofile',
            name='item',
        ),
        migrations.RemoveField(
            model_name='labtestrequestpanel',
            name='category',
        ),
        migrations.AddField(
            model_name='labtestpanel',
            name='item',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='inventory.item'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='labtestrequestpanel',
            name='is_sample_collected',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='resultsverification',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='Phlebotomy',
        ),
    ]