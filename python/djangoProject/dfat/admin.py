# -*- coding:UTF-8 -*- 
from django.contrib import admin
from dfat.models import LogInput
from dfat.models import task
from dfat.models import unittest
from dfat.models import log, smtasklist, smnodevtasklist

class configLog(admin.ModelAdmin):
	list_display = ('id', 'date', 'user', 'subject', 'content')
	
class configTask(admin.ModelAdmin):
	list_display = ('id', "tid", "uid", "subject", "status", "last_sync", "last_modify")
	
class configsmtasklist(admin.ModelAdmin):
	list_display = ('id', "tid", "uid", "subject", "status", "last_sync", "last_modify")

admin.site.register(LogInput, configLog)
admin.site.register(task, configTask)
admin.site.register(smtasklist, configsmtasklist)
admin.site.register(smnodevtasklist)
admin.site.register(unittest)
admin.site.register(log)