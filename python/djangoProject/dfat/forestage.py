# -*- coding:UTF-8 -*- 
from django.http import HttpResponse
from dfat.models import task,unittest,log
from common.models2xml import transfor, transforDict
from backgroundSync import UserList
import datetime

def getalltask(request):
	list = task.objects.exclude(tid="")
	return HttpResponse(transfor(list))

def getonetask(request):
	id = request.GET.get("uid","")
	if id:
		list = task.objects.filter(uid=id).exclude(tid="")
		return HttpResponse(transfor(list))
	return HttpResponse("who's task do you want !")

def updatetask(request):
	gId = request.POST.get("id","")
	#gTid = request.POST.get("tid","")
	gUid = request.POST.get("uid","")
	gSubject = request.POST.get("subject","")
	gDescription = request.POST.get("description","")
	gRemark = request.POST.get("remark","")
	gPrincipal = request.POST.get("principal","")
	gProposer = request.POST.get("proposer","")
	gManager = request.POST.get("manager","")
	gExpect_hours = request.POST.get("expect_hours","")
	gStatus = request.POST.get("status","")
	gType = request.POST.get("type","")
	
	
	if gId:
		p = task.objects.get(id=gId)
	else:
		p = task()

	p.uid=gUid
	p.subject=gSubject
	p.description=gDescription
	p.remark=gRemark
	p.principal=gPrincipal
	p.proposer=gProposer
	p.manager=gManager
	p.expect_hours=gExpect_hours
	p.status=gStatus
	p.type=gType
	
	if not gId:
		time=str(datetime.datetime.now())
		p.create_time = time
	
	p.save()
	return HttpResponse("success")
	
def smuserlist(request):
	list = UserList().getSMUsers()
	return HttpResponse(transforDict(list))

def getonetaskunittest(request):
	id = request.GET.get("tid","")
	
	try:
		taskNO = task.objects.get(tid=id)
	except:
		taskNO = None
	if taskNO:
		list = unittest.objects.filter(task_id=taskNO)
		return HttpResponse(transfor(list))
	return HttpResponse("Give me a valid task id !")

def updateunittest(request):
	gTid = request.POST.get("tid","")
	taskNO = task.objects.get(tid=gTid)
	if not taskNO:
		return HttpResponse("Your tast no is invalid !")
	#gUid = request.POST.get("uid","")
	gTest_hours = request.POST.get("test_hours","")
	gSubject = request.POST.get("subject","")
	gEnvirnment = request.POST.get("envirnment","")
	gProcedure = request.POST.get("procedure","")
	gRemark = request.POST.get("remark","")
	gAction_plan = request.POST.get("action_plan","")
	gMemos = request.POST.get("memos","")
	
	try:
		p = unittest.objects.get(task_id=taskNO)
	except:
		p = unittest(task_id=taskNO)
	
	if p:
		p.test_hours = gTest_hours
		p.subject = gSubject
		p.envirnment = gEnvirnment
		p.procedure = gProcedure
		p.remark = gRemark
		p.action_plan = gAction_plan
		p.memos = gMemos
	else:
		p = unittest(task_id=taskNO,test_hours=gTest_hours,subject=gSubject,
				envirnment=gEnvirnment,remark=gRemark,procedure=gProcedure,
				action_plan=gAction_plan,memos=gMemos)
	p.save()
	return HttpResponse("success")

def _updatelog(request):
	gId = request.POST.get("id","")
	gTid = request.POST.get("tid","")
	
	try:
		gObject = task.objects.get(id=gTid)
	except:
		gObject = None
	gContent = request.POST.get("content","")
	gReal_hours = request.POST.get("real_hours","")
	
	lg = log.objects.get(id=gId)
	if lg:
		lg.task_id = gObject
		lg.content = gContent
		lg.real_hours = gReal_hours
	
	lg.save()

def _addnewlog(request):
	time=str(datetime.datetime.now())
	gTid = request.POST.get("tid","")
	
	try:
		gObject = task.objects.get(id=gTid)
	except:
		gObject = -1
	gContent = request.POST.get("content","")
	gReal_hours = request.POST.get("real_hours","")
	
	lg = log(task_id=gObject,content=gContent,real_hours=gReal_hours,create_time=time)
	lg.save()

def updatelog(request):
	gId = request.POST.get("id","")
	if gId:
		_updatelog(request)
	else:
		_addnewlog(request)
		
	return HttpResponse("")

def gettasklog(request):
	gTid = request.GET.get("tid","")
	li = log.objects.filter(id=gTid)
	
	return HttpResponse(transfor(li))
	
