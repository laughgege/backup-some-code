# -*- coding:UTF-8 -*-
from xml.dom import minidom

def transfor(obt):
    doc = minidom.Document()
    root = doc.createElement("root")
    doc.appendChild(root)
    if len(obt):
        ls = obt[0].__class__._meta.fields
        for nth in obt:
            data = doc.createElement("data")
            root.appendChild(data)
            for n in ls:
                key = n.attname
                nu = doc.createElement(key)
                data.appendChild(nu)
                text = doc.createTextNode(str(getattr(nth,key)))
                nu.appendChild(text)
    return doc.toxml()
            