#-*-coding:utf-8-*-

print abs(-1)
print coerce(1+2j,2.2)
print divmod(10, 3)
print pow(2, 10)
print round(20.33333, 2)


print hex(255)
print hex(11111111111111)
print oct(255)

print ord("a")

print chr(65)

class C:
	def __nonzero__(self):
		return False

c = C()

print bool(c)

print 5//2
print 2**3