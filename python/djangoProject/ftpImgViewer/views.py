# -*-coding:UTF-8-*-
from django.http import HttpResponse
from django.shortcuts import render_to_response
from thumbList import *
from glob import glob
import urllib
import base64
import os

httpHash = {
            "uig":"http://doc.ui.sh.ctriptravel.com/uigftp",
            "uig2": "http://doc.ui.sh.ctriptravel.com/uigftp2"
            }

def main(request):
    names = []
    for pa in thumbList:
        n = {}
        #return HttpResponse(os.path.join(PERFIX, pa[0])+'/*')
        ar = glob(os.path.join(PERFIX, pa[0])+'/*')
        p = pa[0].split('/')
        n['name'] = p[-1]
        if not n:
            n['name'] = p[-2]
        n['http'] = httpHash[p[0]] + pa[0].replace(p[0], "")
        n['url'] = '/ftpImgViewer/imglist/?ca=%s' % urllib.quote(base64.b64encode(pa[0]))
        if len(ar):
            n['src'] = 'http://doc.ui.sh.ctriptravel.com/thumbimages'+ ar[0].replace(PERFIX, "")
        else :
            n['src'] = ""
        
        names.append(n)
        
    return render_to_response('index.html', {'data':names})

def imglist(request):
    ca = request.GET.get('ca',"")
    assert ca, 'no ca privided !'
    ca = base64.b64decode(ca)
    way = '/'.join([PERFIX,ca])+'/*'
    ar = glob(way)
    li = []
    for pa in ar:
        n = {}
        p = ca.split('/')
        
        n['name'] = p[-1]
        n['http'] = httpHash[p[0]] + pa.replace(PERFIX, "").replace(p[0]+"/", "")
        n['src'] = 'http://doc.ui.sh.ctriptravel.com/thumbimages'+ pa.replace(PERFIX, "")
        li.append(n)
    
    return render_to_response('detail.html', {'data': li, 'name':ca}) 
