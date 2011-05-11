#coding=utf-8
import sys
# ==
sys = __import__("sys", globals=globals(), locals=locals(), fromlist=[])


def foo(): 
	print '\ncalling foo()...'
	aString = 'bar' 
	anInt = 42 
	print "foo()'s globals:", globals().keys() 
	print "foo()'s locals:", locals().keys()
print "__main__'s globals:", globals().keys() 
print "__main__'s locals:", locals().keys() 
foo()


print vars(sys)
print vars()
