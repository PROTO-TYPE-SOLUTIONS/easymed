from django.contrib import admin

# models
from .models import Group, Permission

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    pass


admin.site.register(Group, GroupAdmin)


class PermissionAdmin(admin.ModelAdmin):
    pass


admin.site.register(Permission, PermissionAdmin)
