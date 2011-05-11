from django.shortcuts import render_to_response
from django.http import HttpResponse

def form(response):
	return render_to_response('form.html',{"name":"yannnnnn"})

def postFormTest(response):
	return HttpResponse("yan")