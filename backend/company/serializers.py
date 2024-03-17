from rest_framework import serializers

from .models import Company, CompanyBranch

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class CompanyBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model= CompanyBranch
        fields = '__all__'