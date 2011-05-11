#coding=utf-8

s = set('cheeseshop')
print s

t = frozenset('bookshop')
print t

s.add('z')
s.update('pypi')
s.remove('z')
s -= set('pypi')