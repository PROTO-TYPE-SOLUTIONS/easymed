# Generated by Django 5.0.10 on 2025-02-06 05:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('laboratory', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='labtestrequest',
            name='note',
            field=models.TextField(blank=True, null=True),
        ),
    ]
