# -*-coding:UTF-8-*-

li = [i * 2 for i in range(10) if i % 2 == 0]

seq = ["one", "two", "three"]
hash = {}
for i, value in enumerate(seq):
	seq[i] = "%d: %s" % (i, value)
	hash[i] = value

print hash, seq, li