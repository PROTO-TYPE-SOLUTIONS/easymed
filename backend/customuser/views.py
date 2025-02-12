import token
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import viewsets

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
    PasswordReset,
    PasswordHistory,
    Doctor,
    Nurse,
    Receptionist,
    LabTech,
    
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
    ResetPasswordRequestSerializer,
    PasswordResetConfirmSerializer,
    DoctorSerializer,
    NurseSerializer,
    LabTechSerializer,
    ReceptionistSerializer,

)

# utils
from utils.group_perms import user_in_group
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


# permissions
from authperms.permissions import IsStaffUser

User = get_user_model()

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
        role = serializer.validated_data.get("role")

        if role == CustomUser.BASE_ROLE:
            serializer.save()
        else:
            is_admin = bool(request.user.is_superuser and request.user.role == CustomUser.SYS_ADMIN)
            if not is_admin:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            
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


class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = ResetPasswordRequestSerializer
    permission_classes = (AllowAny,)

    @extend_schema(
        request=ResetPasswordRequestSerializer,
        responses={200: {"message": "Password reset link sent to email."}},
    )
    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)  

        token = PasswordResetTokenGenerator().make_token(user)

        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        password_reset_confirm_url = reverse('customuser:password_reset_confirm', kwargs={  # Use namespace:name
            'uidb64': uidb64,
            'token': token
        })
        full_url = request.build_absolute_uri(password_reset_confirm_url)

        send_mail(
            subject="Password Reset Request",
            message = f"Click the link below to reset your password:\n{full_url}\n\nThis link will expire in 10 minutes.  If you do not reset your password within this time, you will need to request a new password reset.",
            from_email=settings.EMAIL_HOST_USER,  
            recipient_list=[user.email],
            fail_silently=True,
        )

        return Response({"message": "Password reset link sent to email."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (ValueError, TypeError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid reset link'}, status=status.HTTP_400_BAD_REQUEST)

        if not PasswordResetTokenGenerator().check_token(user, token, ):
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']

            recent_passwords = PasswordHistory.objects.filter(user=user)[:5]
            for past_password in recent_passwords:
                if check_password(new_password, past_password.password_hash):
                    return Response({'error': 'Cannot reuse a recent password.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            PasswordHistory.objects.create(user=user, password_hash=user.password)

            return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

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


class UserListViewSet(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()