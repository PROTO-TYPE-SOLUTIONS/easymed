from django.db import migrations, models
import django.core.validators

def create_default_company(apps, schema_editor):
    Company = apps.get_model('company', 'Company')
    Company.objects.create(
        name='Easymed',
        address1='123 Easy St.',
        address2='Suite 456',
        phone1='+1234567890',
        phone2='+0987654321',
        email1='contact@easymed.com',
        email2='support@easymed.com',
    )

class Migration(migrations.Migration):

    dependencies = [
        ('company', '0002_insurancecompany'),
    ]

    operations = [
        migrations.RunPython(create_default_company),
    ]
