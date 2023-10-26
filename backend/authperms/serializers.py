from rest_framework import serializers

# models
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import (
    Group,
    Permission,

)
from customuser.models import CustomUser


class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = ("app_label", "model")


class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name", )


class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ("name", "permissions")

    def get_permissions(self, obj: Group):
        permissions_list = obj.permissions.all()
        return [{"name": permission.name} for permission in permissions_list]


class AddGroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)

    def validate_name(self, value: str):
        group_name_exists = Group.objects.filter(name=value).exists()
        if group_name_exists:
            raise serializers.ValidationError(
                "Group with this name already exists")

        return value

    def create(self, validated_data: dict):
        try:
            return Group.objects.create(**validated_data)
        except Exception as e:
            return serializers.ValidationError(e)


class EditGroupNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name",)
        read_only_fields = ("id",)

    def update(self, instance: Group, validated_data: dict):
        instance.name = validated_data.get("name", instance.name)
        instance.save()
        return instance


class AddPermissionToGroupSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        required=True,
    )

    class Meta:
        model = Group
        fields = ("id", "permissions")

    def validate(self, attrs: dict):
        group_id = attrs.get("id")
        permission_id = attrs.get("permissions")

        group = Group.objects.filter(pk=group_id)

        if not group.exists():
            return serializers.ValidationError("Group Id doesn't exists")

        if not Permission.objects.filter(pk=permission_id).exists():
            return serializers.ValidationError("Permission Id doesn't exists")

        if group.filter(permissions__pk=permission_id).exists():
            return serializers.ValidationError("Permission already exists in group")
        return super().validate(attrs)

    def update(self, instance: Group, validated_data: dict):
        permission_id = validated_data.get("permissions")
        permission = Permission.objects.get(pk=permission_id)
        instance.permissions.add(permission)
        instance.save()
        return instance


class AddUserToGroupsSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField()
    groups = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        required=True,
        many=True,
    )

    class Meta:
        model = CustomUser
        fields = ("user_id", "groups",)

    def get_user_id(self, obj: CustomUser):
        return obj.pk

    def validate(self, attrs: dict):
        group_ids: list[int] = attrs.get("groups")
        group_clone = group_ids.copy()
        if group_ids is None:
            return serializers.ValidationError("Provide a group id")
        for group_id in group_ids:
            # iterate over a group ids and remove those where the group id doesn't exist
            try:
                Group.objects.get(id=group_id)
            except Group.DoesNotExist:
                group_clone.remove(group_id)
            except Exception as e:
                return serializers.ValidationError(e)

        attrs["groups"] = group_clone
        return super().validate(attrs)

    def update(self, instance: CustomUser, validated_data: dict):
        group_list: list[int] = validated_data.get("groups")

        for group_id in group_list:
            group = Group.objects.get(id=group_id)
            instance.groups.add(group)

        return instance


class RemoveUserFromGroupSerializer(serializers.Serializer):
    group_names = serializers.ListField(
        child=serializers.CharField(max_length=50))

    def validate(self, attrs: dict):
        group_names: list[str] = attrs.get("group_names")
        if group_names is None or len(group_names) <1:
            raise serializers.ValidationError("group_names field is required")

        groups = group_names.copy()
        for group_name in groups:
            try:
                Group.objects.get_by_natural_key(group_name)
            except Group.DoesNotExist:
                group_names.remove(group_name)

        attrs["group_names"] = group_names
        return super().validate(attrs)


class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("id", "name",)


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("id", "name", "codename")


class AddPermissionSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    codename = serializers.CharField(max_length=50)
    content_type = serializers.PrimaryKeyRelatedField(
        queryset=ContentType.objects.all(),
        required=False,
        allow_null=True
    )

    def validate(self, attrs: dict):
        name = attrs.get("name", None)
        codename = attrs.get("codename", None)
        # validate name and codename uniqueness
        # permission name and codename must be unique together
        if name is None or codename is None:
            return serializers.ValidationError("permissions name and codename are required")

        if Permission.objects.filter(name=name).exists():
            if Permission.objects.filter(name=name).filter(codename=codename).exists():
                return serializers.ValidationError("Permission already exists")

        return super().validate(attrs)

    def create(self, validated_data: dict):
        try:
            return Permission.objects.create(**validated_data)
        except Exception as e:
            return serializers.ValidationError(e)


class EditPermissionNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("name", "codename")

    def update(self, instance: Permission, validated_data: dict):
        instance.name = validated_data.get("name", instance.name)
        instance.codename = validated_data.get("codename", instance.codename)
        instance.save()
        return instance


class RemovePermissionsFromUserSerializer(serializers.Serializer):
    permissions = serializers.ListField(
        child=serializers.IntegerField(),)

    def validate(self, attrs: dict):
        permissions: list[int] = attrs.get("permissions")
        if permissions is None or len(permissions)<1:
            raise serializers.ValidationError("permissions field is required")

        permissions_list = permissions.copy()
        for permission_id in permissions_list:
            try:
                Permission.objects.get(id=permission_id)
            except Permission.DoesNotExist:
                permissions.remove(permission_id)

        attrs["permissions"] = permissions
        return super().validate(attrs)


class ChangeUserRoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES)
    