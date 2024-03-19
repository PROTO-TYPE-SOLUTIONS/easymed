from django.db import models
from django.core.validators import FileExtensionValidator

class Company(models.Model):
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250, null=True, blank=True)
    phone = models.CharField(max_length=250, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    logo = models.FileField(
        upload_to="Company/company-logo",
        max_length=254,
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'img', 'png', 'jpg'])]
    )

    class Meta:
        verbose_name_plural = "company"


    def __str__(self):
        return self.name    

class CompanyBranch(models.Model):
    name = models.CharField(max_length=250)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    address = models.CharField(max_length=250, null=True, blank=True)
    phone = models.CharField(max_length=250, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    logo = models.FileField(
        upload_to="Company/company-logo",
        max_length=254,
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'img', 'png', 'jpg'])]
    )

    class Meta:
        verbose_name_plural = "company"


    def __str__(self):
        return self.name   