from django.contrib import admin
from .models import *

admin.site.register(LabResult)
admin.site.register(LabTest)
admin.site.register(PatientIdentifier)
admin.site.register(LabTestCategory)
admin.site.register(LabReagent)