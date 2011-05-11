# -*-coding:UTF-8-*-
def foo(a, *args, **kwargs):
    print "Positional arguments are:"
    print args
    print "Keyword arguments are:"
    print kwargs
    print "%06d-- %s\s"% (1,[1,2])
    
foo(1,2,3,name=4,han=5)
