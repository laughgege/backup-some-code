# -*- coding:utf-8 -*-
import os, sys
  
#添加当前工程文件夹及其上层文件夹到sys.path中
p1 = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
p2 = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))
sys.path.append(p1)
sys.path.append(p2)

#重定向输出，如果有错误信息打印，或者调用print打印信息，将输出到apache的error.log日志文件中。
sys.stdout = sys.stderr
os.environ['DJANGO_SETTINGS_MODULE'] = 'myweb.settings' 
import django.core.handlers.wsgi 
application = django.core.handlers.wsgi.WSGIHandler()
