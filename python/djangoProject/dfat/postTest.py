# -*- coding:UTF-8 -*- 
from django.http import HttpResponse
from django.shortcuts import render_to_response

def form(request):
	return render_to_response("form.html")