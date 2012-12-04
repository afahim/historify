from django.db import models

# Create your models here.

class Location(models.Model):
		name = models.CharField(max_length=200)

class Media(models.Model):
		media = models.FileField(upload_to='historify/uploads/')
		fileType = models.CharField(max_length=20)
		mimeType = models.CharField(max_length=20)
		location = models.ForeignKey(Location)
		label = models.CharField(max_length=200)
		description = models.TextField()
		year = models.IntegerField()
		rating = models.IntegerField()