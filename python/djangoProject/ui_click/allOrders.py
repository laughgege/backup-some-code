# -*-coding:UTF-8-*-
import datetime
import httplib,urllib
import re
from ui_click.models import allOrders
from django.http import HttpResponse

Host='asimonitor.sh.ctriptravel.com'
baseUrl='/asimonitor/MonitorDetail.aspx?Subtype=%s&IndicatorID=%s'
headers = {
           'Content-type':"application/x-www-form-urlencoded",
           'Accept':"text/plain"
           }

CONF = {
        'on':{
              'key':'%u8ba2%u5355%u6bd4',
              'list':{
                        'flight_on':2,
                        'hotel_on':12,
                        'vacation_on':20,
                      },
              },
        'off':{
               'key':'%u8ba2%u5355%u7535%u8bdd%u6bd4',
               'list':{
                        'flight_off':5,
                        'hotel_off':14,
                        'vacation_off':21,
                       },
               },
        }

def dotnetParam(html):
    view = re.search(r'id="__VIEWSTATE" value="([^"]*)"',html)
    evt = re.search(r'id="__EVENTVALIDATION" value="([^"]*)"',html)
    return [view.group(1),evt.group(1)]

def handleHtml(html,ti,key):
    r = r'<th>%s</th><th>([^<>]+)</th>' % ti
    o = re.search(r, html)
    p = allOrders.objects.get(date=ti)
    setattr(p, key, o.group(1))
    p.save()

def dailyCollection(to):
    yes = to - datetime.timedelta(days=1)
    
    p = None
    try:
        p = allOrders.objects.get(date=str(yes).decode("utf-8"))
    except:
        pass
    
    if p is None:
        p = allOrders(date=str(yes).decode("utf-8"))
        p.save();
    co = httplib.HTTPConnection(Host)
    for one in CONF:
        key = CONF[one]['key']
        dc = CONF[one]['list']
        for k in dc:
            l = baseUrl % (key, dc[k])
            co.request("GET", l)
            content = co.getresponse()
            ss = content.read()
            view = dotnetParam(ss.decode('gb2312'))
            param = urllib.urlencode({
                                      'combReports':'Bar',
                                      'ddlCondition':'1',
                                      'current':'trend',
                                      '__EVENTTARGET':'ddlCondition',
                                      '__EVENTARGUMENT':'0',
                                      'ddlDays':'1',
                                      '__VIEWSTATE':view[0],
                                      '__EVENTVALIDATION':view[1],
                                      })
            co.request("POST", l, param, headers)
            content = co.getresponse()
            ss = content.read()
            handleHtml(ss,yes,k)
    co.close()
    
def main(request):
    dailyCollection(datetime.date.today())
    return HttpResponse("ok")