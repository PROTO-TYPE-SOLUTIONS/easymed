from django.contrib import admin
from .models import (
    LabReagent,
    LabTestProfile,
    LabTestPanel,
    LabTestRequest,
    LabTestRequestPanel,
    ProcessTestRequest,
    LabEquipment,
    Specimen,
    PatientSample,
    ReferenceValue,
    ProcessTestRequest,
    TestKit,
    TestKitCounter
)

admin.site.register(LabReagent)
admin.site.register(LabTestProfile)
admin.site.register(LabTestPanel)
admin.site.register(ProcessTestRequest)
admin.site.register(LabTestRequest)
admin.site.register(LabTestRequestPanel)
admin.site.register(LabEquipment)
admin.site.register(Specimen)
admin.site.register(PatientSample)
admin.site.register(ReferenceValue)
admin.site.register(TestKit)
admin.site.register(TestKitCounter)
