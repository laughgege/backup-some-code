# -*- coding:UTF-8 -*- 
import httplib
import MySQLdb
import xml.etree.cElementTree as ET
import datetime
from dfat.models import task,smtasklist
from django.http import HttpResponse
from django.db import connection, transaction

import urllib
import sys
from django.core.exceptions import ObjectDoesNotExist
from string import Template
from cgi import escape

INTERVAL = 30

class UserList(object):
	def __init__(self):
		self.conn = MySQLdb.connect(host="192.168.83.56",user="root",passwd="p@ssw0rd!@#",
								db="svnplusdb",charset="utf8")
		self.cur = self.conn.cursor(cursorclass = MySQLdb.cursors.DictCursor)
		self.cur.execute("select * from user")
		self.content = self.cur.fetchall()
	def __del__(self):
		self.cur.close()
		self.conn.close()
	
	def getLogUsers(self):
		users = []
		for user in self.content:
			if user["alive"]:
				users.append(user)
		return users
	
	def getSMUsers(self):
		users = []
		for user in self.content:
			if user["itsmuser"]:
				users.append(user)
		return users
	
	def getLogUsersNameList(self):
		users = []
		for user in self.content:
			if user["alive"]:
				users.append(user["username"])
		return users
	
	def getSMUsersNameList(self):
		users = []
		for user in self.content:
			if user["itsmuser"]:
				users.append(user["username"])
		return users

# 更新任务列表时，若发现特定用户的任务所有者改变，则邮件通知
class AssignNotify:
	watching = []
	
	# 更新前调用，取得guy的任务列表
	def watch(self, guy):
		self.watching = []
		for t in smtasklist.objects.filter(uid=guy):
			self.watching.append(t)
	
	# 更新后调用，检测watching任务的所有者是否已改变, 如果被改至workers中的某位, 则邮件通知
	def notify(self, mailto, workers):
		r = []
		for o in self.watching:
			try:
				n = smtasklist.objects.get(tid = o.tid)
				if n.uid != o.uid:
					if workers.count(n.uid) > 0:
						x = self._notify(o, n, mailto)
						r.append(str(n.id) + ': ' + str(x))
					else:
						self._log(str(o.tid) + ' changed outbound: ' + n.uid + '\nworkers: ' + ','.join(workers))
			except ObjectDoesNotExist:
				pass
			except:
				self._log("Unexpected error: ", sys.exc_info()[0])
		return r
	
	# 邮件通知, 调用http://doc.ui.sh.ctriptravel.com/mail/MailPost.php之功能
	def _notify(self, o, n, mailto):
		html = '''<table width="800" cellspacing="0" cellpadding="5" style="font:normal 12px/18px verdana;border-collapse:collapse;border-color:#ccc" border="1">
			<tr><td width="80">任务号</td><td>$tid</td></tr>
			<tr><td>开发员</td><td>$uid</td></tr>
			<tr><td>任务主题</td><td>$subject</td></tr>
			<tr><td>任务描述</td><td>$description</td></tr>
		</table>'''
		
		html = html.replace('$tid', str(n.tid))
		html = html.replace('$uid', str(n.uid))
		html = html.replace('$subject', escape(n.subject.encode('utf-8')))
		html = html.replace('$description', escape(n.description.encode('utf-8')).replace('\n', '<br />'))
		
		return self._mail(mailto, '任务' + str(o.tid) + '己分配给' + str(n.uid), html)
	
	# 日志
	def _log(self, msg):
		self._mail('gftian@ctrip.com', 'backgroundSync log', msg)
	
	# 发送邮件
	def _mail(self, to, subject, body):
		flds = {
			'to': to,
			'subject': subject,
			'body': body,
			'from': 'task@uig',
			'bcc': 'gftian@ctrip.com',
		}
		host = 'doc.ui.sh.ctriptravel.com'
		url = '/mail/MailPost.php?' + urllib.urlencode(flds)
		return self._get(host, url) == 'true'
	
	# http请求
	def _get(self, host, url):
		conn = httplib.HTTPConnection(host)
		conn.request("GET", url)
		return conn.getresponse().read()

# 测试
def testAssignNotify():
	an = AssignNotify()
	an.watch('cdchu')
	t = smtasklist.objects.get(id=17)
	t.uid = 'gftian'
	t.save()
	r = an.notify('gftian@ctrip.com', ['gftian'])
	t.uid = 'cdchu'
	t.save()
	r.insert(0, '{')
	r.append('}')
	return '<br />'.join(r)
		
def xml2Python(xml):
	root = xml.find("BusinessObjectList")
	list = root.findall("BusinessObject")
	nList = []
	for k in list:
		adict = {}
		two = k.find("FieldList")
		three = two.findall("Field")
		for field in three:
			name = field.get("Name", "")
			adict[name] = field.text
		nList.append(adict)
	return nList

def addNew(key, cls):
	time=str(datetime.datetime.now())
	type="DevTask"
	ctime = key["CreatedDateTime"].replace("T", " ")
	hs = cls(tid=key["TaskNumber"],uid=key["Owner"],subject=key["Subject"],changeid=key["ChangeNumber"],
			description=key["Description"],remark=key["Notes"],principal=key["ChangeOwner"],
			proposer=key["ChangeRequestor"],manager=key["ProgramManager"],expect_hours=key["DevPlanManHour"],
			status=key["Status"],type=type,last_sync=time,create_time=ctime)
	hs.save()
	
def syncSM(contentList, oldList):
	'''
		如果是新加数据，直接插入。。
		如果是老数据，因为之前提交过，所以不做处理。。
		这里存在一个问题就是如果在非dfat中修改了内容，就会在提交时被覆盖掉。。
	'''
	for i in contentList:
		new = True
		for j in oldList:
			if i["TaskNumber"] == j.tid:
				new = False
				break
		if new == True:
			addNew(i,task)
		else:
			pass
			
def setTaskInfo(obt):
	pass

def submitModified(old):
	for key in old:
		if key.last_sync < key.last_modify:
			setTaskInfo(key)

def handleXML(xml):
	'''
		同步逻辑：
		1.先提交掉所有修改再做同步
	'''
	contentList = xml2Python(xml)
	oldList = task.objects.filter(type="DevTask")
	submitModified(oldList)
	syncSM(contentList, oldList)

def main(request):
	host = "172.16.144.11"
	smList = "|".join(UserList().getSMUsersNameList())
	url = "/itsm/Service1.asmx/GetTaskList?users="+smList
	
	conn = httplib.HTTPConnection(host)
	conn.request("GET", url)
	res = conn.getresponse()
	xl = ET.fromstring(res.read())
	con = ET.fromstring(xl.text.encode("utf-8"))
	handleXML(con)
	conn.close()
	return HttpResponse("")

def syncAllTask(request):
	# 记录ccd的任务
	an = AssignNotify()
	an.watch('cdchu')
	
	usrlist = UserList().getLogUsersNameList()
	
	host = "172.16.144.11"
	url = "/itsm/Service1.asmx/GetTaskList?users=" + "|".join(usrlist)
	
	conn = httplib.HTTPConnection(host)
	conn.request("GET", url)
	res = conn.getresponse()
	
	xl = ET.fromstring(res.read())
	con = ET.fromstring(xl.text.encode("utf-8"))
	
	contentList = xml2Python(con)
	
	cursor = connection.cursor()
	transaction.commit_unless_managed()
	
	cursor.execute("truncate table dfat_smtasklist")
	for key in contentList:
		addNew(key,smtasklist)
	conn.close()
	
	# 检查并通知
	an.notify('ljzhu@ctrip.com;cdchu@ctrip.com', usrlist)
	
	return HttpResponse("ok")

if __name__ == "__main__":
	main(None)
