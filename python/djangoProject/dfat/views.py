# -*- coding:UTF-8 -*- 

from dfat.models import smnodevtasklist
from django.http import HttpResponse
from common.models2xml import transfor
import httplib, urllib


host = "172.16.144.11"
url = "/itsm/Service1.asmx/BatchSubmit"
headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

def submitNoDevTask(request):
    p = smnodevtasklist.objects.exclude(status=1) 
    xml = transfor(p)
    params = urllib.urlencode({"taskInfoXml":xml})
    
    conn = httplib.HTTPConnection(host)
    conn.request("POST", url, params, headers)
    res = conn.getresponse()
    conn.close()
    return HttpResponse(res.status)
    
