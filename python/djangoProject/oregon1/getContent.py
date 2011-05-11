# -*- coding:UTF-8 -*- 
from django.http import HttpResponseRedirect
from django.conf import settings
from oregon1.models import Feedback
import time

def main(request):
	project = request.POST.get("project","")
	user = request.POST.get("user","")
	point = request.POST.get("point","")
	suggest = request.POST.get("suggest","")
	patterns = request.POST.get("patterns","")
	diagnose = request.POST.get("diagnose","")
	scale = request.POST.get("scale","")
	
	
	arr = []
	enclosure = ""
	if request.FILES:
		for img in request.FILES:
			data = request.FILES[img]
			path = settings.ROOT_PATH+"/static/Oregon/img/"+str(int(time.time()))+data.name
			im = file(path.encode("utf-8"), "wb")
			im.write(data.read())
			im.close()
			arr.append(path)
		enclosure = ";".join(arr)
		
	log = Feedback(project=project, user=user, point=point, suggest=suggest, 
				patterns=patterns,diagnose=diagnose, scale=scale, enclosure=enclosure)
	log.save()
	
	return HttpResponseRedirect("/oregon/success/")
