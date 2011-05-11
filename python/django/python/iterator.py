# -*-coding:UTF-8-*-
''''''''''''''''''''''''''''''''''''''''''''
i = iter("abc")
print i.next(),i.next(), i.next()


''''''''''''''''''''''''''''''''''''''''''''
class MyIter(object):
	def __init__(self, step):
		self.step = step
	def __iter__(self):
		return self
	def next(self):
		''''
			for自动调用next()， 接到StopIteration 退出 
		'''
		if self.step == 0:
			raise StopIteration
		self.step -= 1
		return self.step
	
for i in MyIter(4):
	print i
	
''''''''''''''''''''''''''''''''''''''''''''