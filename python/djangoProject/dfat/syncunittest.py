# -*- coding:UTF-8 -*- 
from dfat.models import unittest,task
from django.http import HttpResponse
from backgroundSync import xml2Python
import xml.etree.cElementTree as ET
import httplib,urllib
import datetime

def getTaskList():
	li = task.objects.all()
	lis = []
	for k in li:
		lis.append(k.tid)
	return lis

def handleXML(con):
	contentList = xml2Python(con)
	for key in contentList:
		time=str(datetime.datetime.now())
		taskNO = task.objects.get(tid=key["DevpTaskNumber"])
		ctime = key["CreatedDateTime"].replace("T", " ")
		hs = unittest(task_id=taskNO,test_hours=key["HoursOfTest"],subject=key["Subject"],
				envirnment=key["TestScenario"],remark=key["Notes"],procedure=key["ProcedureAndResult"],
				action_plan=key["ActionPlan"],memos=key["Memos"],last_sync=time,create_time=ctime)
		hs.save()

def main(request):
	host = "172.16.144.11"
	t = getTaskList()
	smList = "|".join(t)
	url = "/itsm/Service1.asmx/GetUnitTestingList?tasks="+smList
	conn = httplib.HTTPConnection(host)
	conn.request("GET", url)
	res = conn.getresponse()
	xl = ET.fromstring(res.read())
	con = ET.fromstring(xl.text.encode("utf-8"))
	handleXML(con)
	conn.close()
	return HttpResponse("")