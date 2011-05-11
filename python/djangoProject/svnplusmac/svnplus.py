# -*- coding:UTF-8 -*-

import sys
import re
import info


class Svn(object):
    def __init__(self):
        self.root = info.ROOT
        print self.root
    def help(self):
        print HELP
    def init(self):
        #try:
            self.root = raw_input(info.NOTICE["root"])
            self.writeConfig('ROOT', self.root)
            reload(info)
            print info.ROOT
        #except:
         #   print 100
    def writeConfig(self, name, value):
        fie = open("info.py","r")
        li = fie.readlines()
        fie.close()
        for i,key in enumerate(li):
            if re.match('\s*%s.*' % (name,), key):
                li[i] = '%s = "%s"' %(name, value)
                break
                
        fie = open("info.py","w")
        fie.writelines(li)
        fie.close()
                
        
        
if __name__ == "__main__":
    from optparse import OptionParser
    parser = OptionParser()
        