import getopt
args = '-a -b -cfoo -d bar a1 a2'.split()
print args
#['-a', '-b', '-cfoo', '-d', 'bar', 'a1', 'a2']
optlist, args = getopt.getopt(args, 'abc:d:') 
print optlist
#[('-a', ''), ('-b', ''), ('-c', 'foo'), ('-d', 'bar')]
print args
#['a1', 'a2']

print "*"*30

s = '--condition=foo --testing --output-file abc.def -x a1 a2'
args = s.split()
print args
#['--condition=foo', '--testing', '--output-file', 'abc.def', '-x', 'a1', 'a2']
optlist, args = getopt.getopt(args, 'x', ['condition=', 'output-file=', 'testing'])
print optlist
#[('--condition', 'foo'), ('--testing', ''), ('--output-file', 'abc.def'), ('-x', '')]
print args
#['a1', 'a2']


import getopt, sys

def usage():
	print "fail"

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "ho:v", ["help", "output="])
    except getopt.GetoptError, err:
        # print help information and exit:
        print str(err) # will print something like "option -a not recognized"
        usage()
        sys.exit(2)
    output = None
    verbose = False
    for o, a in opts:
        if o == "-v":
            verbose = True
        elif o in ("-h", "--help"):
            usage()
            sys.exit()
        elif o in ("-o", "--output"):
            output = a
        else:
            assert False, "unhandled option"
    # ...

if __name__ == "__main__":
    main()