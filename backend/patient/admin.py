from django.contrib import admin
from django.contrib import admin
from .models import *

admin.site.register(InsuranceCompany)
admin.site.register(Patient)
admin.site.register(ContactDetails)
admin.site.register(Appointment)
admin.site.register(NextOfKin)
admin.site.register(PrescribedDrug)
admin.site.register(Prescription)