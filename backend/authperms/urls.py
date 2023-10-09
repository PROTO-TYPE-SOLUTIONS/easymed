from django.urls import path

# views
from .views import (
    GroupsAPIView,
    AddGroupAPIView,
    GroupAPIView,
    AddUserToGroupAPIView,
    PermissionsAPIView,
    PermissionAPIView,
    AddPermissionAPIView,
)

urlpatterns = [
    path("groups", GroupsAPIView.as_view(), name="groups"),
    path("groups/<int:group_id>", GroupAPIView.as_view(), name="add-group"),
    path("add-group", AddGroupAPIView.as_view(), name="add-group"),
    path("add-user-to-group/<int:user_id>", AddUserToGroupAPIView.as_view(), name="add-user-to-group"),
    path("permissions", PermissionsAPIView.as_view(), name="permissions"),
    path("permissions/<int:permission_id>", PermissionAPIView.as_view(), name="permission"),
    path("add-permission", AddPermissionAPIView.as_view(), name="add-permission")
]