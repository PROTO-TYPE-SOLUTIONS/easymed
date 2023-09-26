# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.CustomUserList.as_view(), name='user-list'),
    path('users/<int:pk>/', views.CustomUserDetail.as_view(), name='user-detail'),
    path('doctors/', views.DoctorProfileList.as_view(), name='doctor-list'),
    path('doctors/<int:pk>/', views.DoctorProfileDetail.as_view(), name='doctor-detail'),
    # Add similar URL patterns for NurseProfile, SysadminProfile, and LabTechProfile
]


# separate URL pattern for user creation restricted to sysadmins
urlpatterns += [
    path('users/create/', views.CreateUser.as_view(), name='user-create'),
]