# -*- coding:UTF-8 -*- 
from django.http import HttpResponse

def success(request):
	return HttpResponse("success")
