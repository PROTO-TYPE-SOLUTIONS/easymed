# Generated by Django 5.0.6 on 2024-06-20 18:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('laboratory', '0010_labtestrequest_created_on'),
    ]

    operations = [
        migrations.AddField(
            model_name='labtestrequestpanel',
            name='approved_on',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
