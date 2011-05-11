myTuple = (123, "zyx", 45.67)
i = iter(myTuple)

print i.next()
print i.next()
print i.next()

s = iter(myTuple)

for i in s:
	print i
	
legends = { ('Poe', 'author'): (1809, 1849, 1976), 
	('Gaudi', 'architect'): (1852, 1906, 1987), 
	('Freud', 'psychoanalyst'): (1856, 1939, 1990) }
	
for eachLegend in legends:
	print 'Name: %s\tOccupation: %s' % eachLegend
	print '	Birth: %s\tDeath: %s\tAlbum: %s\n' \
	% legends[eachLegend]
	
def _print():
	print "hello world!"
	
f = reversed(myTuple)

for i in f:
	print i
	
for i, v in enumerate(myTuple):
	print "%d---%s" % (i, v)
	
print map(lambda x: x ** 2, range(6))
print [x ** 2 for x in range(6)]

seq = [11, 10, 9, 9, 10, 10, 9, 8, 23, 9, 7, 18, 12, 11, 12]
print [x for x in seq if x % 2]


print [(x+1,y+1) for x in range(3) for y in range(5)]

data = open('unicode.txt', 'r')
print len([word for line in f for word in line.split()])

import os
print os.stat("unicode.txt").st_size

print sum(len(word) for line in data for word in line.split())


rows = [1, 2, 3, 17]
def cols(): # example of simple generator yield 56
	yield 2 
	yield 1
	
x_product_pairs = ((i, j) for i in rows for j in cols())
print x_product_pairs

for pair in x_product_pairs:
	print pair



f = open('unicode.txt', 'r') 
longest = 0 
while True:
	linelen = len(f.readline().strip())
	if not linelen: break
	if linelen > longest: 
		longest = linelen
f.close() 
print longest


f = open('unicode.txt', "r")
longest = 0
allLines = f.readlines()
f.close()
for line in allLines:
	linelen = len(line.strip())
	if linelen > longest:
		longest = linelen
print longest

f = open('unicode.txt', 'r') 
longest = 0 
allLines = [x.strip() for x in f.readlines()] 
f.close() 
for line in allLines:
	linelen = len(line) 
	if linelen > longest:
		 longest = linelen
print longest

f = open('unicode.txt', 'r') 
allLineLens = [len(x.strip()) for x in f] 
f.close() 
print max(allLineLens)


f = open('unicode.txt', 'r') 
longest = max(len(x.strip()) for x in f) 
f.close()
print longest

print max(len(x.strip()) for x in open('unicode.txt')) #generator expression