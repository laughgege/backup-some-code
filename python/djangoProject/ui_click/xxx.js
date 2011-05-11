var UI_CLICK_maping={
	RT:1,
	channel:"others",
	page:"index",
	index:[

		{
			name:"header",
			position:"29,10,950,128",
			positive:1,
			mark:{
				id:"hd",
				name:"",
				className:"",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"searchBoxTitle",
			position:"41,179,278,36",
			positive:1,
			mark:{
				id:"searchBoxUl",
				name:"",
				className:"searchbox_t",
				text:"",
				attr:{"mod":"tab"}
			}
		},
				

		{
			name:"searchBox",
			position:"41,146,278,339",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"column_lt",
				text:"开始您的旅程",
				attr:{"":""}
			}
		},
				

		{
			name:"searchBox",
			position:"41,146,278,339",
			positive:1,
			mark:{
				id:"searchBox",
				name:"",
				className:"searchbox",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"expo",
			position:"41,489,278,71",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"expo",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"expo_text",
			position:"41,560,278,24",
			positive:1,
			mark:{
				id:"expo_text",
				name:"",
				className:"expo_text",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"credit_card",
			position:"41,588,278,39",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"credit_card",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"server",
			position:"41,631,278,90",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"server",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"travels",
			position:"41,725,278,135",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"travels",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"hotels",
			position:"331,300,408,187",
			positive:1,
			mark:{
				id:"hotelRecommend",
				name:"",
				className:"hotels_position",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"flights_choice",
			position:"331,487,408,234",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"flights_choice",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"vh_content",
			position:"326,725,418,140",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"vh_content",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"new_special",
			position:"749,145,225,153",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"new_special",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"package_choice",
			position:"749,302,225,419",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"package_choice",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"info",
			position:"749,725,225,140",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"info",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"reason_choice",
			position:"34,870,940,101",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"reason_choice",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"goodlink",
			position:"29,1067,950,29",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"goodlink",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"ft",
			position:"29,1096,950,141",
			positive:1,
			mark:{
				id:"ft",
				name:"",
				className:"",
				text:"",
				attr:{"":""}
			}
		},
				

		{
			name:"cityname",
			position:"29,1257,950,78",
			positive:1,
			mark:{
				id:"",
				name:"",
				className:"cityname",
				text:"",
				attr:{"":""}
			}
		}

	],
	clickHash:{
	
header:0,
searchBoxTitle:0,
searchBox:0,
expo:0,
expo_text:0,
credit_card:0,
server:0,
travels:0,
hotels:0,
flights_choice:0,
vh_content:0,
new_special:0,
package_choice:0,
info:0,
reason_choice:0,
goodlink:0,
ft:0,
cityname:0

	}
};
	
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

	
