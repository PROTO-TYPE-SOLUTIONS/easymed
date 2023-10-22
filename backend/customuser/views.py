from rest_framework import generics
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
    DoctorProfile,
    LabTechProfile,
    NurseProfile,
    SysadminProfile,
)

# swagger
from drf_spectacular.utils import (
    extend_schema,
)

# serializers
from .serializers import (
    CustomUserSerializer, 
    CustomUserRegistrationSerializer, 
    CustomUserLoginSerializer
)

# utils
from utils.group_perms import user_in_group

# Register Endpoint
class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)

    @extend_schema(
        request=CustomUserRegistrationSerializer,
        responses=CustomUserRegistrationSerializer,

    )
    def post(self, request: Request, *args, **kwargs):
        data  = request.data
        serializer = CustomUserRegistrationSerializer(data=data)

        if not serializer.is_valid():
            return Response(serializer.error_messages, status=status.HTTP_400)
        
        role:str = serializer.validated_data.get("role")
        # anonymous user can only register as a patient
        if request.user.is_anonymous:
            if role == CustomUser.PATIENT:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"error_message": "Unauthorized request"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user:CustomUser = request.user
        if user.role == CustomUser.SYS_ADMIN and user_in_group(user, CustomUser.SYS_ADMIN):
            # There can only be one sys admin
            if role != CustomUser.SYS_ADMIN:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({"error_message": "This operation is not enabled"}, status=status.HTTP_401_UNAUTHORIZED)

        # doctor, nurse and lab tech can only create a patient and no other role  
        if user.role in [CustomUser.DOCTOR, CustomUser.LAB_TECH, CustomUser.NURSE]:
            if role == CustomUser.PATIENT:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response({"error_message": "Unauthorized request"}, status=status.HTTP_401_UNAUTHORIZED)


# Login Endpoint
class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomUserLoginSerializer

    def post(self, request:Request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            refresh["email"] = str(user.email)
            refresh["role"] = str(user.role)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)    


