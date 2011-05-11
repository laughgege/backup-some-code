# -*-coding:UTF-8-*-
from lxml import etree
from django.http import HttpResponse
import os
import sys
import re

def recursion(x,js,nameList):
	list = x.findall('block')
	for item in list:
		subBlocks = item.find("blocks")
		subBlockList = subBlocks.findall("block")
		if len(subBlockList):
			recursion(subBlocks,js,nameList)
		name = item.find("name")
		nameList.append(name.text)
		position = item.find("position")
		contents = item.findall("content")
		
		for part in contents:
			s = ""
			main = part.find("main")
			exception = part.findall("exception")
			if main is not None:
				fl = '"'
				if main.find("attr") is not None:
					fl += main.find("attr/key").text or ""
					fl += '":"'
					fl += main.find("attr/value").text or ""
					fl += '"'
				s += '''
		{
			name:"%s",
			position:"%s",
			positive:1,
			mark:{
				id:"%s",
				name:"%s",
				className:"%s",
				text:"%s",
				attr:{%s}
			}
		},
				''' % (name.text, position.text, 
					main.find("id").text or "" if main.find("id") is not None else "",
					main.find("name").text or "" if main.find("name") is not None else "",
					main.find("class").text or "" if main.find("class") is not None else "",
					main.find("text").text or "" if main.find("text") is not None else "",
					fl,
					)
			if len(exception):
				for exc in exception:
					fl = '"'
					if exc.find("attr") is not None:
						fl += exc.find("attr/key").text or ""
						fl += '":"'
						fl += exc.find("attr/value").text or ""
						fl += '"'				
					s += '''
		{
			name:"%s",
			position:"%s",
			positive:0,
			mark:{
				id:"%s",
				name:"%s",
				className:"%s",
				text:"%s",
				attr:{%s}
			}
		},
					''' % (name.text, position.text, 
						exc.find("id").text or "" if exc.find("id") is not None else "",
						exc.find("name").text or "" if exc.find("name") is not None else "",
						exc.find("class").text or "" if exc.find("class") is not None else "",
						exc.find("text").text or "" if exc.find("text") is not None else "",
						fl,
						)
		
			js.append(s)	
		
	

def main(request):
	channel = request.GET.get("channel","")
	page = request.GET.get("page","")
	
	if not (channel and page):
		return HttpResponse("no this page")
	
	js = []
	nameList = []
	js.append('var UI_CLICK_maping={')
	js.append('	RT:1,')
	js.append('	channel:"'+channel+'",')
	js.append('	page:"'+page+'",')
	js.append('	index:[')
	
	_xml = etree.parse(os.path.dirname(__file__)+"/click.xml")
	blocks = _xml.getroot().xpath("channel[@name='"+channel+"']/"+"pages/page[@name='"+page+"']/blocks")[0]
	recursion(blocks,js,nameList)
	
	last = js[len(js)-1]
	js[len(js)-1]=re.sub(',[^,]*$',"",last)
	
	js.append(
	'''
	],
	clickHash:{
	''')
	i = 0
	for v in nameList:
		h = v + ":0"
		if (i+1) != len(nameList):
			h+="," 
		i+=1
		js.append(h)
	
	js.append('''
	}
};
	''')
	sd = sys.stdout
	sys.stdout = file(os.path.dirname(__file__)+"/xxx.js","w")
	y = '\n'.join(js)
	
	y += '''
UI_CLICK_maping.isMatch = function(mark,elem){
	var result = [];
	var hasT = false;
	
	if(mark.id && elem.id){
		if(mark.id == elem.id)
			result.push(1);
		else
			result.push(-1);
	}
	else{
		result.push(0);
	}
	
	if(mark.name && elem.name){
		if(mark.name == elem.name)
			result.push(1);
		else
			result.push(-1);
	}
	else{
		result.push(0);
	}
	
	if(mark.className && elem.className){
		if(UI_CLICK_maping.isClass(mark.className,elem.className))
			result.push(1);
		else
			result.push(-1);
	}
	else{
		result.push(0);
	}
	
	if(mark.text){
		if(UI_CLICK_maping.innerText(elem) == mark.text)
			result.push(1);
		else
			result.push(-1);
	}
	else{
		result.push(0);
	}
	
	
	for (key in mark.attr){
		if(key != ""){
			var val = elem.getAttribute(key);
			if(val && val == mark.attr[key]){
				result.push(1);
			}
			else{
				result.push(-1);
			}
		}
		else{
			result.push(0);
		}
	}
	for (key in result){
		if(result[key] == -1)
			return false;
		if(result[key] == 1)
			hasT = true;
	}
	if(hasT)
		return true;
	return false;
}
UI_CLICK_maping.innerText = function(el){
	if(!el)
		return "";
	return el.innerText || el.textContent;
}
UI_CLICK_maping.isClass = function(cls, str){
	var arr = str.split(" ");
	for(var i = 0, l = arr.length; i<l; i++){
		if(arr[i] == cls)
			return true;
	}
	return false;
}
UI_CLICK_maping.trans = function(){
	var h = UI_CLICK_maping.clickHash;
	var arr = [];
	for (key in h){
		arr.push(key+":"+h[key]);
	}
	return arr.join("|");
}
UI_CLICK_maping.show = function(){
	document.title = UI_CLICK_maping.trans();
}
UI_CLICK_maping.send = function(mes){
	var url = "http://192.168.83.56:1000/click/get/?r="+new Date*1+"channel="+UI_CLICK_maping.channel+"&page="+UI_CLICK_maping.page+"&click="+mes;
	var img = document.createElement("img");
	img.onerror = function(){img = null;};
	img.src=url;
}
UI_CLICK_maping.bind = function(elem, ev, fn){
	if(elem.addEventListener){
		elem.addEventListener(ev, fn, false);
	}
	else if(elem.attachEvent){
		elem.attachEvent("on"+ev, fn);
	}
}
UI_CLICK_maping.unbind = function(elem, ev, fn){
	if(elem.removeEventListener){
		elem.removeEventListener(ev, fn, false);
	}
	else if(elem.detachEvent){
		elem.detachEvent("on"+ev, fn);
	}
}
UI_CLICK_maping.handleMousedown = function(e){
	if((Math.random()*UI_CLICK_maping.RT)|0 !== 0)
		return;
	e = window.event || e;
	var target = e.srcElement || e.target,
		quene = UI_CLICK_maping.index,
		matched = false,
		except = "";
	while (target && target != document.documentElement){
		for(var i=0,l=quene.length;i<l;i++){
			mark = quene[i].mark;
			if(UI_CLICK_maping.isMatch(mark, target)){
				if(quene[i].positive == 0)
					except = quene[i].name;
				if(quene[i].positive == 1){
					if(except != quene[i].name){
						UI_CLICK_maping.clickHash[quene[i].name]++;
						UI_CLICK_maping.send(quene[i].name);
						matched = true;
						break;
					}
					except = "";
				}
			}
		}
		if(matched)
			break;
		target = target.parentNode;
	}
	e = target = quene = matched = except = null;
}
UI_CLICK_maping.bind(document.documentElement, "mousedown", UI_CLICK_maping.handleMousedown);
window.onunload = function(){
	UI_CLICK_maping.unbind(document.documentElement, "mousedown", UI_CLICK_maping.handleMousedown);
	window.onunload = null;
};
	'''
	print y.encode("utf-8")
	sys.stdout.close()
	sys.stdout = sd
	return HttpResponse(y)