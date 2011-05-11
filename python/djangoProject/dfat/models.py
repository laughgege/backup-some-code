# -*- coding:UTF-8 -*- 
from django.db import models

class LogInput(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(null=True)
    lastModify = models.DateTimeField(auto_now=True)
    user = models.CharField(max_length=30,null=True)
    subject = models.CharField(max_length=100,null=True)
    content = models.TextField(null=True)
    finished = models.NullBooleanField(null=True)
    
    def __unicode__(self):
        return self.subject
    
    
class task(models.Model):
    id = models.AutoField(primary_key=True)
    tid = models.CharField(max_length=10)
    uid = models.CharField(null=True,max_length=30)
    subject = models.TextField(null=True)
    changeid = models.CharField(max_length=10)
    description = models.TextField(null=True)
    remark = models.TextField(null=True)
    principal = models.CharField(null=True,max_length=30)
    proposer = models.CharField(null=True,max_length=30)
    manager = models.CharField(null=True,max_length=30)
    expect_hours = models.CharField(null=True,max_length=10)
    status = models.CharField(null=True, max_length=10)
    type = models.CharField(null=True,max_length=10)
    last_sync = models.DateTimeField(null=True)
    last_modify = models.DateTimeField(auto_now=True)
    create_time = models.DateTimeField(null=True)
    
    def __unicode__(self):
        return self.subject

class unittest(models.Model):
    task_id = models.ForeignKey(task)
    uid = models.CharField(null=True,max_length=30)
    test_hours = models.CharField(null=True, max_length=10)
    subject = models.TextField(null=True)
    envirnment = models.TextField(null=True)
    procedure = models.TextField(null=True)
    remark = models.TextField(null=True)
    action_plan = models.TextField(null=True)
    memos = models.TextField(null=True)
    last_sync = models.DateTimeField(null=True)
    last_modify = models.DateTimeField(auto_now=True)
    create_time = models.DateTimeField(null=True)
    
    def __unicode__(self):
        return self.subject

class log(models.Model):
    id = models.AutoField(primary_key=True)
    task_id = models.ForeignKey(task)
    content = models.TextField(null=True)
    real_hours = models.CharField(null=True, max_length=10)
    last_sync = models.DateTimeField(null=True)
    last_modify = models.DateTimeField(auto_now=True)
    create_time = models.DateTimeField(null=True)
    
    def __unicode__(self):
        return self.content

class smtasklist(models.Model):
    id = models.AutoField(primary_key=True)
    tid = models.CharField(max_length=10)
    uid = models.CharField(null=True,max_length=30)
    subject = models.TextField(null=True)
    changeid = models.CharField(max_length=10)
    description = models.TextField(null=True)
    remark = models.TextField(null=True)
    principal = models.CharField(null=True,max_length=30)
    proposer = models.CharField(null=True,max_length=30)
    manager = models.CharField(null=True,max_length=30)
    expect_hours = models.CharField(null=True,max_length=10)
    status = models.CharField(null=True, max_length=10)
    type = models.CharField(null=True,max_length=10)
    last_sync = models.DateTimeField(null=True)
    last_modify = models.DateTimeField(auto_now=True)
    create_time = models.DateTimeField(null=True)
    
    def __unicode__(self):
        return self.subject

class smnodevtasklist(models.Model):
    id = models.AutoField(primary_key=True)
    tid = models.CharField(null=True,max_length=10,blank=True)
    uid = models.CharField(null=True,max_length=1024,blank=True)
    subject = models.TextField(null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    expect_hours = models.CharField(null=True,max_length=10,blank=True)
    status = models.BooleanField(default=False)
    last_modify = models.DateTimeField(auto_now=True)
    create_time = models.DateTimeField(null=True,blank=True)
    start_time = models.DateTimeField(null=True,blank=True)
    finish_time = models.DateTimeField(null=True,blank=True)
    finished = models.BooleanField(default=False)
    wholeday = models.BooleanField(default=False)
    
    def __unicode__(self):
        return self.subject