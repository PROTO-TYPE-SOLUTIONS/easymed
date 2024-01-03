from django.contrib import admin
from .models import *


admin.site.register(LabTestProfile)
admin.site.register(LabTestResult)
admin.site.register(LabTestRequest)
admin.site.register(LabTestCategory)
admin.site.register(LabReagent)
admin.site.register(LabEquipment)
admin.site.register(EquipmentTestRequest)