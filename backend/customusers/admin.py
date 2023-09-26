from django.contrib import admin
from django.contrib import admin
from .models import *

admin.site.register(CustomUser)
admin.site.register(DoctorProfile)
admin.site.register(NurseProfile)
admin.site.register(SysadminProfile)
admin.site.register(LabTechProfile)
