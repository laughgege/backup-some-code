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
				txt = getattr(nth, key)
				text = doc.createTextNode(unicode(txt))
				nu.appendChild(text)
	
	return doc.toprettyxml(encoding="utf-8")

def transforDict(obt):
	doc = minidom.Document()
	root = doc.createElement("root")
	doc.appendChild(root)
	if len(obt):
		ls = obt[0].keys()
		for nth in obt:
			data = doc.createElement("data")
			root.appendChild(data)
			for key in ls:
				nu = doc.createElement(key)
				data.appendChild(nu)
				txt = nth[key]
				text = doc.createTextNode(unicode(txt))
				nu.appendChild(text)
	
	return doc.toprettyxml(encoding="utf-8")