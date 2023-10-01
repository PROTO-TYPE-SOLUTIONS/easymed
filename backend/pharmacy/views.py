from rest_framework import viewsets
from .models import Drug
from .serializers import DrugSerializer

class DrugViewSet(viewsets.ModelViewSet):
    queryset = Drug.objects.all()
    serializer_class = DrugSerializer
