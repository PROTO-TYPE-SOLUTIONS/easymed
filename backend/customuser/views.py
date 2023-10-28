from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny,
)


# rest views
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView


from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request

from rest_framework_simplejwt.tokens import RefreshToken

# models
from .models import (
    CustomUser,
    Doctor
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)

# serializers
from .serializers import (
    CustomUserSerializer,
    CustomUserRegistrationSerializer,
    CustomUserLoginSerializer,
    DoctorSerializer
)

# utils
from utils.group_perms import user_in_group

# permissions
from authperms.permissions import IsStaffUser

# Register Endpoint


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        request=CustomUserRegistrationSerializer,
        responses=CustomUserRegistrationSerializer,

    )
    def post(self, request: Request, *args, **kwargs):
        data = request.data
        serializer = CustomUserRegistrationSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.error_messages, status=status.HTTP_400)

        role: str = serializer.validated_data.get("role")
        # anonymous user can only register as a patient
        if request.user.is_anonymous:
            if role == CustomUser.PATIENT:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"error_message": "Unauthorized request"}, status=status.HTTP_401_UNAUTHORIZED)

        user: CustomUser = request.user
        if user.role == CustomUser.SYS_ADMIN:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # doctor, nurse and lab tech can only create a patient and no other role
        if user.role in [CustomUser.DOCTOR, CustomUser.LAB_TECH, CustomUser.NURSE, CustomUser.RECEPTIONIST]:
            if role == CustomUser.PATIENT:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response({"error_message": "Unauthorized request"}, status=status.HTTP_401_UNAUTHORIZED)


# Login Endpoint
class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomUserLoginSerializer

    @extend_schema(
        request=CustomUserLoginSerializer,
    )
    def post(self, request: Request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user: CustomUser = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            refresh["email"] = str(user.email)
            refresh["first_name"] = str(user.first_name)
            refresh["role"] = str(user.role)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class DoctorsAPIView(APIView):
    permission_classes = (IsStaffUser,)

    @extend_schema(
        request=DoctorSerializer,
        responses=DoctorSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        doctors = CustomUser.objects.filter(role = CustomUser.DOCTOR)
        serializers = CustomUserSerializer(doctors, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

