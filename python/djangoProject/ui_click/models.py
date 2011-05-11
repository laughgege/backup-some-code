from django.db import models

class clickData(models.Model):
	id = models.AutoField(primary_key=True)
	channel = models.CharField(max_length=50)
	page = models.CharField(max_length=50)
	content = models.TextField(null=True)
	
	def __unicode__(self):
		return self.page
	
class allOrders(models.Model):
	id = models.AutoField(primary_key=True)
	date = models.CharField(null=False, max_length=20)
	flight_on = models.IntegerField(null=True)
	hotel_on = models.IntegerField(null=True)
	vacation_on = models.IntegerField(null=True)
	flight_off = models.IntegerField(null=True)
	hotel_off = models.IntegerField(null=True)
	vacation_off = models.IntegerField(null=True)
	
	def __unicode__(self):
		return self.date
