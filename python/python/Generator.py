def counter(start_at=0): 
	count = start_at 
	while True:
		val = (yield count)
		if val is not None: 
			count = val 
		else: 
			count += 1
			
c = counter(100)
print c.next()
print c.next()
print c.next()
print c.next()
print c.next()

c.close()