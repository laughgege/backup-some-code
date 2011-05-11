# -*- coding:UTF-8 -*- 
from django.http import HttpResponse
from common.models2xml import transfor
from dfat.models import LogInput

def main(request):
	if 'user' in request.GET and request.GET['user']:
		li = LogInput.objects.filter(date = request.GET["date"], user = request.GET["user"])
		return HttpResponse(transfor(li))
	
	gContent = request.POST.get("content","")
	gSubject = request.POST.get("subject","")
	gUser = request.POST.get("user","")
	gDate = request.POST.get("date","")
	if 'id' in request.POST and request.POST['id']:
		li = LogInput.objects.get(id = request.POST['id'])
		if not (gContent or gSubject or gUser or gDate):
			li.delete()
			return HttpResponse("success")
		else:
			if gContent:
				li.content = gContent
			if gSubject:
				li.subject = gSubject
			if gUser:
				li.user = gUser
			if gDate:
				li.date = gDate
			li.save()
			return HttpResponse("success")
	else:
		log = LogInput(date = gDate, user = gUser, 
					subject = gSubject, content = gContent)
		log.save()
		return HttpResponse("success")
	
	return HttpResponse("What do you want to do men")