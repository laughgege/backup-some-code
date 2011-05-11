# -*- coding:UTF-8 -*- 
from django.db import models

class Feedback(models.Model):
	id = models.AutoField(primary_key=True)
	project = models.CharField(max_length=100,null=True)
	user = models.CharField(max_length=200,null=True)
	point = models.TextField(max_length=300,null=True)
	suggest = models.TextField(null=True)
	patterns = models.TextField(null=True)
	diagnose = models.TextField(null=True)
	scale = models.TextField(null=True)
	enclosure = models.TextField(null=True)
	lastModify = models.DateTimeField(auto_now=True)
	
	def __unicode__(self):
		return self.point
