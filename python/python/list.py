#-*-coding:utf-8-*-

s = "abcde"
for i in [None] + range(-1, -len(s), -1):
	print s[:i]

print [0]+range(-1, -len(s), -1)

print dir(enumerate(s))
print len(s)

print "ya" in "yanhan"

import string

print string.ascii_uppercase

print string.ascii_lowercase
print string.ascii_letters
print string.digits
print string.letters

print "yan"+"han"
print '%s%s' % ("yan","han")
print "".join(["yan", "han"])

print "%x" % 108
print "%X" % 108
print "%#X" % 108

print '%f' % 1234.567890
print '%.2f' % 1234.567890
print '%E' % 1234.567890
print '%g' % 1234.567890
print "%+d" % 4
print "%+d" % -4
print "we are at %d%%" % 100
print 'Your host is: %s' % 'earth'
print 'Host: %s\tPort: %d' % ('mars', 80)
print "MM/DD/YY = %02d/%02d/%4d" % (2, 15, 67)
print 'There are %(howmany)d %(lang)s Quotation Symbols' % \
	{'lang': 'Python', 'howmany': 3}
	
from string import Template
s = Template('There are ${howmany} ${lang} Quotation Symbols')
print s.substitute(lang='Python', howmany=3)
print '\n'
print r'\n'

#f = open(r'C:\windows\temp\readme.txt', 'r')

print isinstance(u'\0xAB', str)
print not isinstance('foo', unicode)

print unichr(12345)
print ord(u'\u2345')

y = "yanhan"
print string.capitalize(y)
print string.center(y,20)
print string.count(y, "a")
print y.count("a")
print y.center(20)

print y.endswith("n")
print y.find("a")
print id(y)

li = [1,2,3]
del li[1]
print li
li.remove(1)
print li