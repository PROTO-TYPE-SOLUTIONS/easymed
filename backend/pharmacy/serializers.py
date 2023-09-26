from .models import Drug
from rest_framework import serializers

class DrugsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drug
        fields = '__all__'        