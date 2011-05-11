# -*-coding:UTF-8-*-

def fib():
	a, b = 0, 1
	print 0
	while True:
		yield (a, b)
		a, b = b, a + b
		'''
		a = b
		b = a + b 这和上面的不一样的哦
		'''

f = fib()
#print f
#print f.next(), f.next(), f.next(), f.next()

''' PEP Python Enhancement Proposal '''	

'''
reader = open("list.py", "r")
print reader.next(), reader.next(), reader.next()
'''

import tokenize

reader = open("list.py", "r").next
tokens = tokenize.generate_tokens(reader)
''' param : callable
	call next() returns : (1, 2, 3, 4, 5)
	1. token type
	2. token string
	3. begin position
	4. end position
	5. this line full string
'''
#print tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n', tokens.next(),'\n'

'''
	yield 嵌套
'''
def power(values):
	for value in values:
		print 'powering %s' % value
		yield value
		
def adder(values):
	for value in values:
		print 'adding to %s' % value
		if value % 2 == 0:
			yield value + 3
		else:
			yield value + 2
			
elements = [1, 4, 7, 9, 12, 19]
res = adder(power(elements))
#print res.next(), res.next(), res.next()

''' yield 表达式'''

def psychologist():
	print 'Please tell me your problems'
	while True:
		answer = (yield)
		if answer is not None:
			if answer.endswith("?"):
				print ("Don't ask yourself "
											"to much questions")
			elif 'good' in answer:
				print "A that is good, go on"
			elif 'bad' in answer:
				print "Don't be so negative"
'''				
free = psychologist()
free.next()

free.send("free ?")
free.send("good job")
free.send("bad day")
'''

''' 引入    throw  close 完全搞不懂

def my_generator():
	while True:
		try:
			yield 'something'
		except ValueError:
			yield 'dealing with the exception'
		finally:
			print "ok let's clean"

gen = my_generator()
print gen.next()

print gen.next()
print gen.throw(ValueError("not good")) #传入异常类型

print gen.next()
print gen.close() #抛出GeneratorExit 或 StopIteration
#print gen.next()


def single_generator():
	try:
		yield 'something'
	except ValueError:
		yield 'dealing with the exception'
	finally:
		print "ok let's clean"
		
gen = single_generator()
#print gen.next()
print gen.throw(ValueError("not good"))
'''


























