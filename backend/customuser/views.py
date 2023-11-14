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
    Doctor,
    Nurse,
    Receptionist,
    LabTech
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
    DoctorSerializer,
    NurseSerializer,
    LabTechSerializer,
    ReceptionistSerializer,

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

        serializer.is_valid(raise_exception=True)
        
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
        doctors = Doctor.objects.filter(role = CustomUser.DOCTOR)
        serializers = DoctorSerializer(doctors, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


class NurseAPIView(APIView):
    permission_classes = (IsStaffUser,)

    @extend_schema(
        request=NurseSerializer,
        responses=NurseSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        nurse = Nurse.objects.filter(role = CustomUser.DOCTOR)
        serializers = NurseSerializer(nurse, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


class LabTechAPIView(APIView):
    permission_classes = (IsStaffUser,)

    @extend_schema(
        request=LabTechSerializer,
        responses=LabTechSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        labtech = LabTech.objects.filter(role = CustomUser.DOCTOR)
        serializers = LabTechSerializer(labtech, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


class ReceptionistAPIView(APIView):
    permission_classes = (IsStaffUser,)

    @extend_schema(
        request=ReceptionistSerializer,
        responses=ReceptionistSerializer,
    )
    def get(self, request: Request, *args, **kwargs):
        receptionist = Receptionist.objects.filter(role = CustomUser.DOCTOR)
        serializers = ReceptionistSerializer(receptionist, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)
