from rest_framework.permissions import (
    IsAdminUser,
    AllowAny,
)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request

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
    AddUserToGroupsSerializer,
    GroupSerializer,
    PermissionsSerializer,
    PermissionSerializer,
    AddPermissionSerializer

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
    permission_classes = (IsAdminUser,)

    @extend_schema(
        responses=GroupsSerializer,
    )
    def get(self, request: Request, *args, **kwargs: dict):
        groups = Group.objects.all()
        serializer = GroupsSerializer(groups, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupAPIView(APIView):
    permission_classes = (IsAdminUser,)

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
    permission_classes = (IsAdminUser,)

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


class EditGroupAPIView(APIView):
    def put(self, request: Request, *args, **kwargs: dict):
        pass


class DeleteGroupAPIView(APIView):
    def delete(self, request: Request, *args, **kwargs: dict):
        pass


class UserGroups(APIView):
    def get(self, request: Request, *args, **kwargs: dict):
        pass


class AddUserToGroupAPIView(APIView):
    permission_classes = (IsAdminUser,)

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
    def put(self, request: Request, *args, **kwargs: dict):
        pass


# permissions
class PermissionsAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request: Request, *args, **kwargs: dict):
        permissions = Permission.objects.all()
        serializer = PermissionsSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PermissionAPIView(APIView):
    permission_classes = (IsAdminUser,)

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
    permission_classes = (IsAdminUser,)

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
    def put(self, request: Request, *args, **kwargs: dict):
        pass


class DeletePermissionAPIView(APIView):
    def delete(self, request: Request, *args, **kwargs: dict):
        pass


class UserPermissionsAPIView(APIView):
    def get(self, request: Request, *args, **kwargs: dict):
        pass


class AddPermissionsToUserAPIView(APIView):
    def put(self, request: Request, *args, **kwargs: dict):
        pass


class RemovePermissionsFromUserAPIView(APIView):
    def put(self, request: Request, *args, **kwargs: dict):
        pass
