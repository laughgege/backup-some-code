# -*-coding:UTF-8-*-

from os.path import split, exists, join, isfile
from glob import glob
import Image
import os
import datetime
from thumbList import *


def shrink(p, force):
    assert exists(p), '%s is not exists or has no permission !' % p
    
    th = p.replace(ROOTPATH, PERFIX)
    if not exists(th):
        os.makedirs(th)
    
    li = glob(join(p, '*'))
    
    for pp in li:
        if not isfile(pp):
            continue
        if (not force) and isfile(pp.replace(ROOTPATH, PERFIX)):
            continue
        
        try:
            im = Image.open(pp)
            im.thumbnail((MAX_WIDTH, MAX_HEIGHT))
        except:
            addLog(pp+' '+str(datetime.datetime.now()))
            continue
        
        print join(th, split(pp)[1])
        im.save(join(th, split(pp)[1]))
        
def addLog(s):
    f = open('/var/log/shrinkImage.log', 'a')
    f.write(s+'\n')
    f.close()

if __name__ == "__main__":
    for p in thumbList:
        shrink(join(ROOTPATH,p[0]), p[1])
