# Generated by Django 5.0.10 on 2025-02-15 15:07

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('billing', '0001_initial'),
        ('company', '0001_initial'),
        ('inventory', '0001_initial'),
        ('laboratory', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tel_no', models.IntegerField(blank=True, null=True)),
                ('email_address', models.EmailField(blank=True, max_length=254, null=True)),
                ('residence', models.CharField(blank=True, max_length=30, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Triage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_by', models.CharField(max_length=45)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('temperature', models.DecimalField(decimal_places=2, max_digits=5, null=True)),
                ('height', models.DecimalField(decimal_places=2, max_digits=5, null=True)),
                ('weight', models.IntegerField(null=True)),
                ('pulse', models.PositiveIntegerField(null=True)),
                ('diastolic', models.PositiveIntegerField(null=True)),
                ('systolic', models.PositiveIntegerField(null=True)),
                ('bmi', models.DecimalField(decimal_places=1, max_digits=10, null=True)),
                ('fee', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('notes', models.CharField(blank=True, max_length=300, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unique_id', models.CharField(max_length=8, unique=True)),
                ('first_name', models.CharField(max_length=40)),
                ('phone', models.CharField(blank=True, max_length=30, null=True)),
                ('second_name', models.CharField(max_length=40)),
                ('date_of_birth', models.DateField(null=True)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1, null=True)),
                ('insurances', models.ManyToManyField(blank=True, to='company.insurancecompany')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='NextOfKin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, max_length=40, null=True)),
                ('second_name', models.CharField(blank=True, max_length=40, null=True)),
                ('relationship', models.CharField(blank=True, max_length=40, null=True)),
                ('contacts', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='patient.contactdetails')),
                ('patient', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='patient.patient')),
            ],
        ),
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('note', models.TextField(blank=True, null=True)),
                ('complaint', models.TextField(blank=True, null=True)),
                ('fee', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('disposition', models.CharField(choices=[('admitted', 'Admitted'), ('referred', 'Referred'), ('discharged', 'Discharged'), ('lab', 'Lab')], default='', max_length=10)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patient.patient')),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('start_date', models.DateField(null=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PublicAppointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=40)),
                ('phone', models.CharField(blank=True, max_length=30, null=True)),
                ('second_name', models.CharField(max_length=40)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=10)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=15)),
                ('appointment_date_time', models.DateTimeField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')], default='pending', max_length=10)),
                ('reason', models.TextField(max_length=300)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_changed', models.DateTimeField(auto_now=True)),
                ('item', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='inventory.item')),
            ],
        ),
        migrations.CreateModel(
            name='Referral',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('note', models.TextField(blank=True, null=True)),
                ('service', models.CharField(choices=[('general', 'General'), ('dentist', 'Dentist'), ('cardiologist', 'Cardiologist'), ('neurologist', 'Neurologist'), ('orthopedist', 'Orthopedist'), ('psychiatrist', 'Psychiatrist'), ('surgeon', 'Surgeon'), ('physiotherapist', 'Physiotherapist')], default='general', max_length=50)),
                ('email', models.EmailField(max_length=254)),
                ('referred_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AttendanceProcess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('track_number', models.CharField(max_length=50, null=True, unique=True)),
                ('patient_number', models.CharField(default=999, editable=False, max_length=8)),
                ('reason', models.TextField(max_length=300)),
                ('track', models.CharField(choices=[('reception', 'Reception'), ('triage', 'Triage'), ('doctor', 'Doctor'), ('pharmacy', 'Pharmacy'), ('lab', 'Lab'), ('awaiting result', 'Result'), ('added result', 'Resulted'), ('impatient', 'Impatient'), ('billing', 'Billing'), ('complete', 'Complete')], default='reception', max_length=50)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('doctor', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='doctor_attendance_processes', to=settings.AUTH_USER_MODEL)),
                ('invoice', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='billing.invoice')),
                ('lab_tech', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='labTech_attendance_processes', to=settings.AUTH_USER_MODEL)),
                ('pharmacist', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pharmacist_attendance_processes', to=settings.AUTH_USER_MODEL)),
                ('process_test_req', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='laboratory.processtestrequest')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patient.patient')),
                ('prescription', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='patient.prescription')),
                ('triage', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='patient.triage')),
            ],
        ),
        migrations.CreateModel(
            name='PrescribedDrug',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dosage', models.CharField(max_length=45)),
                ('frequency', models.CharField(max_length=45)),
                ('duration', models.CharField(max_length=45)),
                ('note', models.TextField(blank=True, null=True)),
                ('is_dispensed', models.BooleanField(default=False)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('is_billed', models.BooleanField(default=False)),
                ('created_on', models.DateField(auto_now_add=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.item')),
                ('prescription', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='patient.prescription')),
            ],
            options={
                'unique_together': {('prescription_id', 'item')},
            },
        ),
    ]
