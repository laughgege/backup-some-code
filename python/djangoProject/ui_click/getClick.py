# -*- coding:UTF-8 -*-
from ui_click.models import clickData
from django.http import HttpResponse
def main(request):
	channel = request.GET.get("channel","")
	page = request.GET.get("page","")
	click = request.GET.get("click","")
	
	p = clickData(channel=channel, page=page, content=click)
	p.save()
	return HttpResponse("ok");
	
	