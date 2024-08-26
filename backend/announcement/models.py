from django.db import models
from customuser.models import CustomUser
from patient.base_model import BaseModel

class Common(BaseModel):
    title = models.CharField(max_length=45)
    content = content = models.CharField(max_length=45)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class Channel(models.Model):
     name = models.CharField(max_length=45)
     photo = models.FileField(upload_to='announcements/channel/', null=True, blank=True)
        
     def __str__(self):
        return self.name

class Announcement(Common):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    file = models.FileField(upload_to='announcements/file/', null=True, blank=True)


    def __str__(self):
        return self.title



class Comment(Common):
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE)
    file = models.FileField(upload_to='announcements/comments/', null=True, blank=True)


    def __str__(self):
        return self.title

