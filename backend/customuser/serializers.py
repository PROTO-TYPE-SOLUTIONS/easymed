from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser, Doctor

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomUserSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name',
                  'last_name', 'role', 'profession', 'age')
        
    def get_age(self, obj: CustomUser):
        if obj.age:
            return obj.age
        return None


class CustomUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'first_name',
                  'last_name', 'role', 'profession')

    def create(self, validated_data: dict):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role'],
            profession=validated_data['profession'],
        )
        return user


class CustomUserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict):
        email = data.get('email')
        password = data.get('password')

        user = authenticate(request=self.context.get(
            'request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        return {
            'user': user
        }


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"
