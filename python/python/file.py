#coding=utf-8

print "yanhan", #no \n
print "yanhan"
'''
import os
filename = raw_input('Enter file name: ') 
fobj = open(filename, 'w') 
while True:
	aLine = raw_input("Enter a line ('.' to quit): ") 
	if aLine != ".":
		fobj.write('%s%s' % (aLine, os.linesep))
	else:
		break
fobj.close()
'''



f = open("unicode.txt", "w+")
print f.tell()
f.write('test line 2\n')
print f.tell()

f.write('test line 1\n')
print f.tell()


f.seek(-12,1) # 0 start 1 now 2 end
n = f.read(2)
print n
print f.tell()
print f.fileno()

print f.closed
print f.encoding
print f.mode
print f.name
print f.newlines

f.close()