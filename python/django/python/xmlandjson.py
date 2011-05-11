# -*-coding:UTF-8-*-
from boodebr.ion import ionize

class hello(object):
	def __init__(self):
		self.a = "hello"
		self.b = "world"
	def hi(self):
		pass
	def sayHello(self):
		pass
obj = hello()
arr = [obj]

json = ionize(arr,"xml")
print json