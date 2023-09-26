from django.urls import path
from .views import *

urlpatterns = [
    path('drugs/', DrugsList.as_view(), name='drugs-list'),
    # path('drugs/<str:pk>/', DrugDetailView.as_view(), name='drugs-detail'),
]
