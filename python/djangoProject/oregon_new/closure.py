from django.http import HttpResponse
from django.conf import settings
import time

def main(request):
	if request.FILES:
		for img in request.FILES:
			data = request.FILES[img]
			path = settings.ROOT_PATH+"/static/Oregon/img/"+str(int(time.time()))+data.name
			im = file(path.encode("utf-8"), "wb")
			im.write(data.read())
			im.close()
	return HttpResponse('ok');