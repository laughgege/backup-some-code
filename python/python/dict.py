#coding=utf-8

a = {1:"yan", 2:"han"}
v = a.copy()
a.clear()
print a
print v

li = ["yan",'Han']

b = dict.fromkeys(li)
c = b.get("xx","a")
print b, c