from rest_framework.permissions import (
    IsAdminUser,
    AllowAny,
)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request

# permissions
from .permissions import (
    IsSystemsAdminUser,
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)

# view
from rest_framework.views import APIView
# serializers
from .serializers import (
    GroupsSerializer,
    AddGroupSerializer,
    EditGroupNameSerializer,
    AddUserToGroupsSerializer,
    RemoveUserFromGroupSerializer,
    GroupSerializer,
    PermissionsSerializer,
    PermissionSerializer,
    AddPermissionSerializer,
    RemovePermissionsFromUserSerializer,
    ChangeUserRoleSerializer
)

# models
from django.contrib.auth.models import (
    Group,
    Permission,
)
from customuser.models import (
    CustomUser,
    DoctorProfile,
    LabTechProfile,
    NurseProfile,
    SysadminProfile,
)


# Group Endpoint

class GroupsAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    @extend_schema(
        responses=GroupsSerializer,
    )
    def get(self, request: Request, *args, **kwargs: dict):
        groups = Group.objects.all()
        serializer = GroupsSerializer(groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupAPIView(APIView):
    permission_classes = (IsSystemsAdminUser, IsAdminUser)

    def get_object(self, id: int):
        try:
            return Group.objects.get(id=id)
        except Group.DoesNotExist:
            return None

    @extend_schema(
        responses=GroupSerializer,
    )
    def get(self, request: Request, group_id: int = None, *args, **kwargs: dict):
        if group_id is None:
            return Response({"error_message": "Provide the group id"}, status=status.HTTP_400_BAD_REQUEST)

        group = self.get_object(group_id)
        if group is None:
            return Response({"error_message": "Group id doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddGroupAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    @extend_schema(
        request=AddGroupSerializer,
        responses=AddGroupSerializer,
    )
    def post(self, request: Request, *args, **kwargs: dict):
        data: dict = request.data
        serializer = AddGroupSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.error_messages, status=status.HTTP_400)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EditGroupNameAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, name: str):
        try:
            return Group.objects.get_by_natural_key(name)
        except Group.DoesNotExist:
            return None

    @extend_schema(
        request=EditGroupNameSerializer,
        responses=EditGroupNameSerializer,
    )
    def put(self, request: Request, group_name: str = None, *args, **kwargs: dict):
        data = request.data
        instance = self.get_object(group_name)
        if instance is None:
            return Response({"error_message": f"Group {group_name} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EditGroupNameSerializer(instance, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteGroupAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, group_name: str):
        try:
            return Group.objects.get_by_natural_key(group_name)
        except Group.DoesNotExist:
            return None

    @extend_schema()
    def delete(self, request: Request, group_name: str = None, *args, **kwargs: dict):
        instance = self.get_object(group_name)
        if instance is None:
            return Response({"error_message": f"Group {group_name} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserGroupsAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, user_id: str):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        responses=GroupsSerializer,
    )
    def get(self, request: Request, user_id: str = None, *args, **kwargs: dict):
        user = self.get_object(user_id)
        if user is None:
            return Response({"error_message": f"user id {user_id} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)

        groups = user.groups.all()
        serializer = GroupsSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddUserToGroupAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, id: int):
        try:
            return CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        request=AddUserToGroupsSerializer,
        responses=AddUserToGroupsSerializer,
    )
    def put(self, request: Request, user_id: int = None, *args, **kwargs: dict):
        if user_id is None:
            return Response({"error_message": "Provide the user id"}, status=status.HTTP_400_BAD_REQUEST)

        user = self.get_object(user_id)
        if user is None:
            return Response({"error_message": "User id doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

        data: dict = request.data["groups"]
        serializer = AddUserToGroupsSerializer(user, data=data)

        if not serializer.is_valid():
            return Response(serializer.error_messages, status=status.HTTP_400)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemoveUserFromGroupAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, user_id: str):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        request=RemoveUserFromGroupSerializer,
    )
    def post(self, request: Request, user_id: str = None, *args, **kwargs: dict):
        data = request.data
        user = self.get_object(user_id)
        if user is None:
            return Response({"error_message": "provide the user id"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RemoveUserFromGroupSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        group_names: list[str] = serializer.validated_data.get("group_name")
        for group_name in group_names:
            group = Group.objects.get_by_natural_key(group_name)
            user.groups.remove(group)

        return Response({"message": "user successfully removed from group(s)"}, status=status.HTTP_200_OK)

# permissions


class PermissionsAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    @extend_schema(
        responses=PermissionsSerializer,
    )
    def get(self, request: Request, *args, **kwargs: dict):
        permissions = Permission.objects.all()
        serializer = PermissionsSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PermissionAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, id: int):
        try:
            return Permission.objects.get(id=id)
        except Permission.DoesNotExist:
            return None

    @extend_schema(
        responses=PermissionSerializer,
    )
    def get(self, request: Request, permission_id: int = None, *args, **kwargs: dict):
        if permission_id is None:
            return Response({"error_message": "Provide the permission id"}, status=status.HTTP_400_BAD_REQUEST)

        permission = self.get_object(permission_id)
        if permission is None:
            return Response({"error_message": "Permission id doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PermissionSerializer(permission)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddPermissionAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    @extend_schema(
        request=AddPermissionSerializer,
        responses=AddPermissionSerializer,
    )
    def post(self, request: Request, *args, **kwargs: dict):
        data = request.data
        serializer = AddPermissionSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EditPermissionAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def put(self, request: Request, *args, **kwargs: dict):
        pass


class DeletePermissionAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, permission_id: int):
        try:
            return Permission.objects.get(id=permission_id)
        except Permission.DoesNotExist:
            return None

    @extend_schema()
    def delete(self, request: Request, permission_id: str = None, *args, **kwargs: dict):
        permission = self.get_object(permission_id)
        if permission is None:
            return Response({"error_message": f"Permission id {permission_id} doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        permission.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserPermissionsAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get(self, request: Request, *args, **kwargs: dict):
        pass


class AddPermissionsToUserAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def post(self, request: Request, *args, **kwargs: dict):
        pass


class RemovePermissionsFromUserAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, user_id: str):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        request=RemovePermissionsFromUserSerializer,
    )
    def post(self, request: Request, user_id: str = None, *args, **kwargs: dict):
        data = request.data
        user = self.get_object(user_id)
        if user is None:
            return Response({"error_message": "provide the user id"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RemovePermissionsFromUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        permissions: list[str] = serializer.validated_data.get("group_name")
        for permission_id in permissions:
            group = Permission.objects.get(id=permission_id)
            user.user_permissions.remove(group)

        return Response({"message": "permissions successfully removed"}, status=status.HTTP_200_OK)


class ChangeUserRoleAPIView(APIView):
    permission_classes = (IsSystemsAdminUser,)

    def get_object(self, user_id: int):
        try:
            return CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return None

    @extend_schema(
        request=ChangeUserRoleSerializer,
    )
    def post(self, request: Request, user_id: int = None, *args, **kwargs):
        data = request.data
        serializer = ChangeUserRoleSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = self.get_object(user_id)
        if user is None:
            return Response({"error_message": "provide the user id"}, status=status.HTTP_400_BAD_REQUEST)

        user.role = serializer.validated_data.get("role", user.role)
        user.save()
        return Response({"message": f"changed {user.first_name}'s role to {user.role}"}, status=status.HTTP_200_OK)
