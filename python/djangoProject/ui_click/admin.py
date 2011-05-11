from django.contrib import admin
from ui_click.models import clickData, allOrders

class conf(admin.ModelAdmin):
	list_display = ('id', 'channel', 'page', 'content')
	
class conf2(admin.ModelAdmin):
	list_display = ('date','flight_on','hotel_on','vacation_on', 'flight_off','hotel_off','vacation_off')
	
admin.site.register(clickData, conf)
admin.site.register(allOrders, conf2)