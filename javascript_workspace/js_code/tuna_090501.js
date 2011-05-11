/**
* @projectDescription Ctrip UIG Javascript Framework.
* @author Chu Chengdong, Tian Guofa, UI group, IT department.
* @copyright Copyright(C) Ctrip.COM 2008.All Rights Reserved. Not to be reused without permission.
* @version 20090612
*/


var _=window;
var __=_.document;
var ___=__.documentElement;

//模块命名空间
var Ctrip={module:{}};

//全局变量
var $$={};

//浏览器判断
with (navigator){with(userAgent){
	$$.browser={
		IE:!!match(/MSIE/),
		IE6:!!appVersion.match(/MSIE 6\.0/i),	//是否为ie6
		Moz:match(/Mozilla/i)&&!match(/compatible|WebKit/i),
		Opera:!!match(/Opera/i),
		Safari:!!match(/Mac|Safari/i)
	};
}}

//检测顶层窗口
var $topWin=window;
(function(){
	try{
		while (true){
			var tmpWin=$topWin.parent;
			if (tmpWin&&tmpWin!=$topWin&&tmpWin.$Ctrip)
				$topWin=tmpWin;
			else
				return;
		}
		
	}catch(e){
 		$trackEvent('tuna-error', 'topWin',$error(e), $tunaVersion()); 
	};
})();

window.onerror = function(mes,url,line){
	$trackEvent('normal-error','normal',$error(mes,url,line), $tunaVersion());
	return false;
};

//数组扩展
$extend(Array.prototype,new function(){
	this.each=function(func){
		for (var i=0;i<this.length;i++)
			if ((func?func(this[i],i):this[i]())===false) return false;
		return true;
	};
	this.random = function(){
		if(!this.length) return null;
		return this[Math.floor(Math.random() * this.length)];
	};
	this.randomize = function(){
		for(var i = 0, n = this.length; i < n; ++i){
			var j = Math.floor(Math.random() * n);
			var t = this[i];
			this[i] = this[j];
			this[j] = t;
		}
		return this;
	};
	if ($$.browser.IE)
		this.map=function(func){
			var arr=[];
			for (var i=0;i<this.length;i++)
				arr.push(func(this[i]));
			return arr;
		};
});

//数值扩展
$extend(Number.prototype,new function(){
	this.parseCur=function(decimalDigits){
		var num=this.toFixed(decimalDigits||2),re=/(\d)(\d{3}[,\.])/;
		while(re.test(num))
			num=num.replace(re,"$1,$2");
		num=num.replace(/^(-?)\./,"$10.");
		return decimalDigits===0?num.replace(/\..*$/,""):num;
	};
});

//字符串扩展
$extend(String.prototype,new function(){
	this.replaceWith=function(obj){
		return this.replace(/\{\$(\w+)\}/g,function(s,k){
			if(k in obj)
				return obj[k];
			else
				return s;
		});
	};
	this.trim=function(){
		return this.replace(/^\s+|\s+$/g,'');
	};
	this.isEmail=function(){
		var re=/^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/;
		return re.test(this);
	};
	this.isDateTime=function(defVal){
		var date=defVal===false?this:this.parseStdDate(false);
		if (!date) return false;
		var arr=date.match(/^((19|20)\d{2})-(\d{1,2})-(\d{1,2})$/);
		if (!arr) return false;
		for (var i=1;i<5;i++)
			arr[i]=parseInt(arr[i],10);
		if(arr[3]<1||arr[3]>12||arr[4]<1||arr[4]>31) return false;
		var _t_date=new Date(arr[1],arr[3]-1,arr[4]);
		return _t_date.getDate()==arr[4]?_t_date:null;
	};
	this.toReString=function(){
		return this.replace(/([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g,"\\$1");
	};
	//判断身份证号码是否有效
	this.isChinaIDCard=function(){
		var num=this.toLowerCase().match(/./g);
		if (this.match(/^\d{17}[\dx]$/i)){
			var sum=0,times=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
			for (var i=0;i<17;i++)
				sum+=parseInt(num[i],10)*times[i];
			if ("10x98765432".charAt(sum%11)!=num[17])
				return false;
			return !!this.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/,"$1-$2-$3").isDateTime();
		}
		if (this.match(/^\d{15}$/))
			return !!this.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/,"19$1-$2-$3").isDateTime();
		return false;
	};
	this.parseStdDate=function(defVal){
		var month="January|1@February|2@March|3@April|4@May|5@June|6@July|7@August|8@September|9@October|10@November|11@December|12";
		var re=this.replace(/[ \-,\.\/]+/g,"-").replace(/(^|-)0+(?=\d+)/g,"$1");
		if ($$.status.version=="en")
			re=re.replace(/[a-z]{3,}/i,function(re){
				return (_t_re=month.match(new RegExp("(^|@)"+re+"[^\\|]*\\|(\\d+)","i")))?_t_re[2]:re;
			});
		re=re.replace(/^([^-]{1,2}-[^-]{1,2})-([^-]{4})$/,"$2-$1");
		return defVal===false||re.isDateTime(false)?re:null;
	};
	this.parseEngDate=function(){
		var std=this.parseStdDate();
		if (!std) return null;
		var re=std.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
		return "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split("|")[parseInt(re[2])-1] +"-"+re[3]+"-"+re[1];
	};
});

//日期扩展
$extend(Date.prototype,new function(){
	this.dateValue=function(){
		return new Date(this.getFullYear(),this.getMonth(),this.getDate());
	};
	this.addDate=function(day){
		return new Date(this.getFullYear(),this.getMonth(),this.getDate()+day);
	};
	this.toStdString=function(){
		return this.getFullYear()+"-"+(this.getMonth()+1)+"-"+this.getDate();
	};
	this.toEngString=function(){
		return "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec".split("|")[this.getMonth()] +"-"+this.getDate()+"-"+this.getFullYear();
	};
});

//函数扩展
$extend(Function.prototype,new function(){
	this.bind = function(obj){
		var fn = this;
		var ar = [].slice.call(arguments, 1);
		return function(){
			return fn.apply(obj, ar.concat([].slice.call(arguments, 0)));
		};
	};
	this.pass = function(){
		var ar = [].slice.call(arguments, 0);
		ar.unshift(null);
		return this.bind.apply(this, ar);
	};
	this.delay = function(n){
		return setTimeout(this, n);
	};
});

//页面cookie
$$.cookie={
	domain:null,
	path:null,
	expires:null
};

//页面history临时函数
$$.history={
	load:function(){
		setTimeout($$.history.load,200);
	}
};

//输出js控件容器
_.__.write("<div id=\"jsContainer\"><div id=\"jsHistoryDiv\" style=\"display:none;\">"+($$.browser.IE?"":"<iframe id=\"jsHistoryFrame\" name=\"jsHistoryFrame\" onload=\"$$.history.load();\" src=\"about:blank\"><\/iframe>")+"<\/div><textarea id=\"jsSaveStatus\" style=\"display:none;\"><\/textarea><div id=\"tuna_jmpinfo\" style=\"visibility:hidden;position:absolute;z-index:120;overflow:hidden;\"><\/div><div id=\"tuna_alert\" style=\"display:none;position:absolute;z-Index:999;overflow:hidden;\"><\/div><\/div>");

//全局状态
$$.status=new function(){
	this.domReady=false;	//页面是否已加载
	this.load=false;
	this.busy=0;
	this.dealt={};
	this.regEventCount=0;
	this.regEventHash={};
	this.charset=(((_.__.charset?_.__.charset:_.__.characterSet)||"")
		.match(/^(gb2312|big5|utf-8)$/gi)||"gb2312").toString().toLowerCase();
	this.version={
		"gb2312":"zh-cn",
		"big5":"zh-tw",
		"utf-8":"en"
	}[this.charset];
	//this.chs=!this.charset.toString().match(/^utf-8$/g);
	var script=$topWin.__.getElementsByTagName("script");
	this.debug=false;
	this.debugEvent=false;
	this.alertDiv=_.__.getElementById("tuna_alert");
	this.container=_.__.getElementById("jsContainer");
	this.saveStatus=_.__.getElementById("jsSaveStatus");
	this.back=false;
	this.pageValue={data:{}};
	this.globalValue={};
	this.today=new Date().toStdString();
};

//页面history
$$.history={
	isFirefox2:/Firefox\/2\.0\.0\.\d+/.test(navigator.userAgent),
	enabled:false,
	callback:{},
	info:{"#":["#","","",""]},
	current:"#",
	blank:"blank.html",
	div:_.__.getElementById("jsHistoryDiv"),
	frame:_.frames["jsHistoryFrame"],
	iframe:null,
	isReady:false,
	count:0,
	init:function(){
		if (_.$$.history.frame)
			return;
		this.div.innerHTML="<iframe id=\"jsHistoryFrame\" name=\"jsHistoryFrame\" src=\""+this.blank+"\" onload=\"$$.history.load();\"><\/iframe>";
		this.frame=_.frames["jsHistoryFrame"];
		this.iframe=$("jsHistoryFrame");
	},
	load:function(){
		this.isReady=true;
		$r("domReady",function(){
			var k=0;
			setInterval(function(){
				var hashName=(_.$$.history.isFirefox2?_:_.$$.history.frame).location.hash.replace(/^#/,"")||"#";
				if (hashName!=_.$$.history.current){
					if (k<1)
						k++;
					else{
						_.$$.history.current=hashName;
						var info=_.$$.history.info[hashName];
						if (info){
							$t("[history]返回标志:"+info[0]+"/"+hashName,"green",info.join("\t"));
							var callback=_.$$.history.callback[info[0]];
							if (typeof callback=="function")
								callback.apply(info[0],info.slice(1));
						}
						if ($$.browser.Opera)
							_.$saveHistory();
					}
				}else
					k=0;
			},100);
		});
		$t("[history]初始化完成","green");
		var hashName=(_.$$.history.isFirefox2?_:_.$$.history.frame).location.hash.replace(/^#/,"")||"#";
		$t("[history]返回标志:"+hashName,"green");
		this.load=function(){};
	}
};

//模块变量
$$.module={
	iframe:[],
	list:{},
	tab:{},
	selectAll:{},
	address:{
		source:{}
	},
	calendar:{},
	init:[]
};

//模块字符串
$$.string={
	"zh-cn":{
		weekday:"日一二三四五六",
		display:"@▲|▼@显示|隐藏@"
	},
	"zh-tw":{
		weekday:"日一二三四五六",
		display:"@▲|▼@顯示|隱藏@"
	},
	"en":{
		weekday:"SMTWTFS",
		display:"@Show|Hidden@"
	}
}[$$.status.version];

//访问器变量
$$.access={};

//扩展
function $extend(a){
	for(var i = 1; i < arguments.length; i ++){
		var b = arguments[i];
		for(var s in b) if(b.hasOwnProperty(s)) a[s] = b[s];
	}
	return a;
}

//合并
function $merge(){
	return $extend.apply(null, [{}].concat([].slice.call(arguments, 0)));
}

//检测变量类型
function $type(obj){
	var typ = typeof obj;
	if(typ != 'object' && typ != 'function') return typ;
	if(obj == null) return 'null';
	var h = {
		'array': Array,
		'boolean': Boolean,
		'date': Date,
		'regexp': RegExp,
		'string': String,
		'number': Number,
		'function': Function
	};
	for(var s in h) if((obj instanceof h[s]) || obj.constructor == h[s]) return s;
	return typ;
}

//获取hash键数组
function $keys(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push(s);
	return ret;
}

//获取hash值数组
function $values(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push(obj[s]);
	return ret;
}

//获取hash键值对数组
function $items(obj, full){
	var ret = [];
	for(var s in obj) if(full || obj.hasOwnProperty(s)) ret.push([s, obj[s]]);
	return ret;
}

//类
function $class(props, f0){
	var me = arguments.callee;
	var f1 = function(){};
	if(f0){
		f1.prototype = new f0();
		f1.prototype.constructor = f0;
	}
	var f2 = function(){
		var caller = arguments.callee.caller;
		if(caller == me || caller == f2.create) return;
		if(this.initialize) this.initialize.apply(this, arguments);
	};
	f2.prototype = new f1();
	$extend(f2.prototype, props || {}, {
		constructor: f2,
		proto: f2.prototype,
		base: f1.prototype
	});
	$extend(f2, {
		create: function(a){
			var o = new f2();
			if(o.initialize) o.initialize.apply(o, a);
			return o;
		},
		subclass: function(props){
			return me(props, f2);
		},
		implement: function(x, y){
			if($type(x) == 'string'){
				f2.prototype[x] = y;
			}else{
				[].slice.call(arguments).each(function(o){
					if($type(o) == 'function') o = new o();
					$items(o, true).each(function(a){f2.prototype[a[0]] = a[1]});
				});
			}
		}
	});
	return f2;
}

//获取页面尺寸
function $pageSize(maskType){
	var ret = {
		docWidth: ___.scrollWidth,
		docHeight: ___.scrollHeight,
		
		winWidth: ___.clientWidth,
		winHeight: ___.clientHeight,
		
		scrollLeft: $$.browser.Safari ? __.body.scrollLeft : ___.scrollLeft,
		scrollTop: $$.browser.Safari ? __.body.scrollTop : ___.scrollTop
	};
	if($$.browser.Safari){
		var st = ___.$getStyle();
		ret.docWidth += parseInt(st.marginLeft) + parseInt(st.marginRight);
		ret.docHeight += parseInt(st.marginTop) + parseInt(st.marginBottom);
	}
	
	ret.docWidth = Math.max(ret.docWidth,ret.winWidth);
	ret.docHeight = Math.max(ret.docHeight,ret.winHeight);
	
	if(maskType){
		var sm = maskType == 'win';
		ret.left = sm ? ret.scrollLeft : 0;
		ret.top = sm ? ret.scrollTop : 0;
		if($$.browser.Mozilla){
			var st = ___.$getStyle();
			ret.left -= parseInt(st.borderLeftWidth) + parseInt(st.marginLeft);
			ret.top -= parseInt(st.borderTopWidth) + parseInt(st.marginTop);
		}
		ret.width = sm ? ret.winWidth : Math.max(ret.docWidth, ret.winWidth);
		ret.height = sm ? ret.winHeight : Math.max(ret.docHeight, ret.winHeight);
	}
	
	return ret;
}

//页面动画
function $animate(target, props, config){
	if(!target || !target.style) return;
	target = target.style;
	
	var config = $extend({
		fps: 40,
		duration: 400,
		callback: function(){},
		reverse: false,
		fn: function(x){return Math.sin(x * Math.PI / 2)}
	}, config || {});
	
	var flds = $keys(props);
	var units = flds.map(function(f){
		return /(width|height|left|top)\b/i.test(f) ? 'px' : '';
	});
	var start = new Date();
	var ani = function(){
		var d = new Date() - start;
		if(d > config.duration) d = config.duration;
		for(var j = 0; j < flds.length; j ++){
			var f = props[flds[j]];
			var x = config.fn(d / config.duration);
			var n = config.reverse ? f[1] + (f[0] - f[1]) * x : f[0] + (f[1] - f[0]) * x;
			if(units[j] == 'px') n = Math.round(n);
			target[flds[j]] = n + units[j];
		}
		if(d == config.duration){
			clearInterval(timer);
			if(config.callback) setTimeout(config.callback, Math.round(1000 / config.fps));
		}
	};
	var timer = setInterval(ani, Math.round(1000 / config.fps));
	
	ani();
	return timer;
}

//多元素动画
/*
$animate2([
[elA.style, {
	width: [10, 200, 'px'],
	height: [20, 200, 'px']
}],[elB, {
	scrollLeft: [0, 10, 0],
	scrollTop: [50, 10, 0]
}]
], {duration: 1000})
*/
function $animate2(x, j) {
	var j = $merge({
		fps:40,
		duration:400,
		callback:function () {},
		reverse:false,
		fn:function (a) {return Math.sin(a * Math.PI / 2);}
	}, j || {});
	var m = new Date;
	var s = function () {
		var a = new Date - m;
		if (a > j.duration) a = j.duration;
		var y = j.fn(a / j.duration);
		for (var c = 0; c < x.length; c++) {
			var o = x[c][0];
			var b = x[c][1];
			for(var f in b){
				var d = b[f];
				var g = j.reverse ? d[1] + (d[0] - d[1]) * y : d[0] + (d[1] - d[0]) * y;
				if(d[2] == 'px' || d[3]) g = Math.round(g);
				o[f] = g + d[2];
			}
		}
		if (a == j.duration) {
			clearInterval(q);
			if (j.callback) setTimeout(j.callback, Math.round(1000 / j.fps));
		}
		return arguments.callee;
	};
	var q = setInterval(s(), Math.round(1000 / j.fps));
	return q;
}

//修正事件对象
function $fixE(e){
	e=_.event||e||arguments.callee.caller.arguments[0];
	$(e.$target=e.target?(e.target.nodeType&&e.target.nodeType==3?e.target.parentNode:e.target):e.srcElement);
	return e;
}

//阻止默认事件，阻止冒泡
function $stopEvent(e,flag){
	e=$fixE(e);
	flag=flag||0;
	if (flag>=0) e.preventDefault?e.stopPropagation():(e.cancelBubble=true);
	if (flag!=0) e.preventDefault?e.preventDefault():(e.returnValue=false);
}

//获得随机id
function $getUid(){
	return "uid_"+(new Date()).getTime()+Math.random().toString().substr(2,5);
}

//创建dom节点
function $c(tag){
	if (tag.constructor==Array) return $(__.createTextNode(tag.join("\n")));
	else return $(__.createElement(tag));
}
var $createElement=$c;

//变量转换为json字符串
function $toJson(variable){
	if(variable === null) return 'null';
	if (typeof variable=='undefined') return 'undefined';
	switch (variable.constructor){
		case Object:
			var arr=[],value;
			for (var name in variable)
				arr.push($toJson(name)+":"+$toJson(variable[name]));
			return "{"+arr.join(",")+"}";
		case Array:
			return "["+variable.map(function(em){
				return $toJson(em);
			}).join(",")+"]";
		case String:
			return "\""+variable.replace(/([\n\r\\\/\'\"])/g,function(a){
				return {"\n":"\\n","\r":"\\r"}[a]||"\\"+a;
			})+"\"";
		case Date:
			return "new Date("+variable.getTime()+")";
		case Number:
		case Boolean:
		case Function:
		case RegExp:
			return variable.toString();
		default:
			return "null";
	}
}

//json字符串转换为变量
function $fromJson(str){
	var undefined;
	var variable=null;
	try {
		variable=eval("("+str+")");
	} catch(e){
		$trackEvent('tuna-error', '$fromJson', $error(e), $tunaVersion());
	};
	return variable;
}

//页面变量
function $pageValue(){
	return $pageValue.get.apply(_,arguments);
}

//保存页面变量
$pageValue.set=function(name,value,historyHash){
	historyHash=historyHash||$$.history.current;
	if (!(historyHash in $$.status.pageValue.data))
		$$.status.pageValue.data[historyHash]={};
	$$.status.pageValue.data[historyHash][name]=value;
	if ($$.browser.Opera)
		$savePageValue();
};

//获取页面变量
this.$pageValue.get=function(name,historyHash){
	var hash=$$.status.pageValue.data[historyHash||$$.history.current];
	return hash&&name in hash?hash[name]:null;
};

//删除页面变量
this.$pageValue.del=function(name,historyHash){
	var hash=$$.status.pageValue.data[historyHash||$$.history.current];
	if (hash){
		delete hash[name];
		if ($$.browser.Opera)
			$savePageValue();
	}
};

//保存pageValue
function $savePageValue(){
	$$.status.saveStatus.value=$toJson($$.status.pageValue);
}

//保存History
function $saveHistory(){
	var arr1=[];
	for (var hashName in $$.history.info){
		var info=$$.history.info[hashName];
		if (info.constructor==Array&&info.length==4){
			var arr2=[hashName];
			for (var i=0;i<info.length;i++)
				arr2.push(escape(info[i]||""));
			arr1.push(escape(arr2.join("|")));
		}
	}
	$$.status.pageValue["historyInfo"]=arr1.join("|");
	$$.status.pageValue["historyCount"]=$$.history.count;
	if ($$.history.frame)
		$$.status.pageValue["lastHistory"]=$$.history.frame.location.href;
	$savePageValue();
}

//跨页面变量
function $globalValue(){
}

//获取get参数
function $getQuery(name){
	var query=(location.search||"").match(new RegExp("[\\?&]"+name+"=([^&]+)","i"));
	return query?unescape(query[1]):null;
}

//动态加载js
function $loadJs(url, charset, callback, timeout) {
	var me = arguments.callee;
	var queue = me.queue || (me.queue = {});
	var timer = null;
	if(!(url in queue)){
		queue[url] = [];
		if(callback){
			timer = setTimer();
			queue[url].push(callback);
		}
	}else{
		if(callback){
			if(queue[url]){
				timer = setTimer();
				queue[url].push(callback);
			}else{
				callback();
			}
		}
		return;
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.charset = charset || $$.status.charset;
	script.onload = script.onreadystatechange = function(){
		if(script.readyState && script.readyState!= 'loaded' && script.readyState != 'complete') return;
		if(timer) clearTimeout(timer);
		script.onreadystatechange = script.onload = null;
		while(queue[url].length) queue[url].shift()();
		queue[url] = null;
	};
	script.src = url;
	__.getElementsByTagName('head')[0].appendChild(script);
	
	function setTimer(){
		var arr = queue[url];
		var pos = arr.length;
		if(callback && timeout){
			return setTimeout(function(){
				if(callback(true) !== true) arr.splice(pos, 1);
			}, timeout);
		}
	}
}

//动态加载css
function $loadCss(file,charset){
	if ($$.browser.IE)
		__.createStyleSheet(file).charset=charset||_.$$.status.charset;
	else{
		var css=_.__.createElement("link");
		with (css){
			type="text\/css";
			rel="stylesheet";
			href=file;
		}
		__.$("head")[0].appendChild(css);
	}
}

//获取cookie
function $getCookie(name,subkey){
	var arr=__.cookie.match(new RegExp("(?:^|;)\\s*"+encodeURIComponent(name)+"=([^;]+)"));
	if (subkey===false)
		return arr?arr[1]:null;
	if (arr&&subkey)
		arr=arr[1].match(new RegExp("(?:^|&)\\s*"+encodeURIComponent(subkey)+"=([^&]+)"));
	return arr?decodeURIComponent(arr[1]):null;
}

//删除cookie
function $delCookie(name,subKey){
	if (subKey){
		var orginalValue=$getCookie(name,false);
		if (orginalValue===null)
			return;
		orginalValue=orginalValue.replace(new RegExp("(^|&)\\s*"+encodeURIComponent(subKey)+"=[^&]+"),"").replace(/^\s*&/,"");
		if (orginalValue){
			__.cookie=encodeURIComponent(name)+"="+orginalValue;
			return;
		}
	}
	var expires=new Date();
	expires.setTime(expires.getTime()-1);
	__.cookie=encodeURIComponent(name)+"=;expires="+expires;
}

//设置cookie
function $setCookie(name,subKey,value){
	if (!value){
		value=subKey;
		subKey=null;
	}
	var extInfo=($$.cookie.domain?"; domain="+$$.cookie.domain:"")+"; path="+($$.cookie.path||"/")+($$.cookie.expires?"; expires="+new Date((new Date()).getTime()+$$.cookie.expires*3600000).toGMTString():"");
	if (subKey){
		var orginalValue=$getCookie(name,false)||"";
		if (orginalValue)
			orginalValue=(orginalValue+"&").replace(new RegExp("(^|&)\\s*"+encodeURIComponent(subKey)+"=[^&]+&"),"$1");
		__.cookie=encodeURIComponent(name)+"="+orginalValue+encodeURIComponent(subKey)+"="+encodeURIComponent(value)+extInfo;
	}else
		__.cookie=encodeURIComponent(name)+"="+encodeURIComponent(value)+extInfo;
}

//模块初始化
function $init(func){
	if (func) $topWin.$$.module.init.push(func);
	else $topWin.$$.module.init.each();
}

//正则加载模块
function $parserRe(obj){
	var objList=[];
	var re_mod=/<[^>]+\smod=[\'\"]?([\w|]+)[^>]+/g;
	var re_id=/\sid=[\'\"]?([^\s>'"]+)/i;
	var pa=null;
	var id=null;
	var el=null;
	(obj&&obj.innerHTML?obj:__.body).innerHTML.replace(re_mod,function(tag,mod){
		try{
			if(mod=="jmpInfo"){
				//todo: loadCss
			}else if((id=tag.match(re_id))&&(el=$(id[1]))){
				if(mod in Ctrip.module)
					new Ctrip.module[mod](el);
				else
					objList.push(el)
			}
		}catch(e){
			$t("parserRe函数错误:"+func.toString().slice(0,50)+"...","red");
			$trackEvent('tuna-error', '$parserRe',$error(e), $tunaVersion());
		};
		return "";
	});
	var clock=setInterval(function(){
		var obj=objList.shift();
		if (obj)
			$topWin.$d(obj);
		else
			clearInterval(clock);
	},50);
}

//加载模块
function $d(obj){
	($(obj).getAttribute("mod")||"").replace(/\w+/ig,function(mod){
		if (Ctrip.module[mod]){
			new Ctrip.module[mod](obj);
		}else{
			$t("错误:元素["+(obj.id||obj.tagName)+"]引用未知模块["+mod+"]","red");
			$trackEvent('tuna-error', '$d', [obj.id || obj.tagName, mod].join('; '), $tunaVersion());
		}
	});
}
var $dealElement=$d;

//变量访问器
function $i(name){
	var access=$$.access[name];
	if (access)
		return access;
	else{
		access=new function(){
			var getFuncList=[],setFuncList=[];
			this.get=function(){
				var value=access.value;
				for (var i=0;i<getFuncList.length;i++){
					var tmpValue=getFuncList[i].call(value);
					if (typeof tmpValue!='undefined')
						value=tmpValue;
				}
				return value;
			};
			this.set=function(value){
				for (var i=0;i<setFuncList.length;i++){
					var tmpValue=setFuncList[i].call(value);
					if (typeof tmpValue!='undefined')
						value=tmpValue;
				}
				return access.value=value;
			};
			this.regGet=function(func){
				if (!func)
					getFuncList=[];
				else
					getFuncList.push(func);
				return;
			};
			this.regSet=function(func){
				if (!func)
					setFuncList=[];
				else
					setFuncList.push(func);
				return;
			};
		};
	}
	return $$.access[name]=access;
}

//修复元素
function $fixElement(obj){
	function addEvent(el,evt,fn){
		if('attachEvent' in el)
			el.attachEvent('on'+evt,fn);
		else
			el.addEventListener(evt,fn);
	}
	function firstInput(el){
		el=el.getElementsByTagName('input');
		for(var i=0;i<el.length;i++)
			if(/checkbox|radio/.test(el[i].type))
				return el[i];
		return null;
	}
	function srcElement(e){
		if(!e)
			e=window.event;
		return e.srcElement||e.target;
	}
	function mover(lbl){
		var box=lbl._for;
		if(box){
			lbl.htmlFor=box.id||(box.id=$getUid());
			lbl._for=null;
		}
		var sty=lbl.style;
		sty.borderBottom='#aaa 1px dashed';
		sty.paddingBottom='0px';
		sty.color='#1E1A75';
	}
	function mout(lbl){
		var sty=lbl.style;
		sty.borderBottom='';
		sty.paddingBottom='';
		sty.color='';
	}
	obj=obj&&obj.nodeType?obj:_.__;
	if ($$.browser.IE6){
		var label=obj.getElementsByTagName("label");
		for (var i=0;i<label.length;i++){
			var el=firstInput(label[i]);
			if(el&&/checkbox|radio/.test(el.type))(function(lbl,box){
				lbl._for=box;
				addEvent(lbl,'mouseover',function(){mover(lbl)});
				addEvent(lbl,'mouseout',function(){mout(lbl)});
			})(label[i],el);
		}
	}
	if ($$.browser.IE){
		var select=obj.getElementsByTagName("select");
		for (var i=0;i<select.length;i++)
			select[i].onmousewheel=function(){
				return false;
			};
	}
}

//移除
function $removeTextNode(parent){
	if (!parent)
		return;
	var obj=parent.firstChild,objTmp;
	while (obj){
		objTmp=obj.nextSibling;
		if (obj.nodeType==3){
			if (!obj.nodeValue.trim())
				parent.removeChild(obj);
		}else
			$removeTextNode(obj);
		obj=objTmp;
	}
	return parent;
}

function $ajax(url,content,callback,historyName){
	var xmlVer=["MSXML2.XMLHTTP","Microsoft.XMLHTTP"],xmlObj;
	try {
		xmlObj=new XMLHttpRequest();
	} catch(e) {
		for (var i=0;i<xmlVer.length;i++)
			try {
				xmlObj=new ActiveXObject(xmlVer[i]);
				break;
			} catch(e) {}
	}
	if (!xmlObj){
		$trackEvent('tuna-error', '$ajax', 'xmlObj creation failure', $tunaVersion());
		return;
	}
	xmlObj.open(content?"POST":"GET",url||location.href,!!callback);
	xmlObj.setRequestHeader("Content-Type","application\/x-www-form-urlencoded");
	xmlObj.setRequestHeader("If-Modified-Since",new Date(0));
	function getReturnValue(){
		if ($$.history.enabled&&historyName){
			$$.history.init();
			var hashName="ajaxHistory_"+$$.history.count++;
			$$.history.current=hashName;
			(function(){
				if ($$.history.isReady){
					var info=$$.history.info[hashName]=[historyName,xmlObj.status==200?xmlObj.responseText:null,url,content];
					if ($$.history.isFirefox2)
						location.hash=hashName;
					else
						$$.history.frame.location.href=$$.history.blank+($$.browser.IE?"?"+!($$.history.count%2):"")+"#"+hashName;
					if ($$.browser.Opera)
						$saveHistory();
					$t("[history]增加历史:"+info[0]+"/"+hashName,"green",info.slice(1).join("\n"));
				}else
					setTimeout(arguments.callee,50);
			})();
		}
		return (xmlObj.status==200?(/xml/i.test(xmlObj.getResponseHeader("content-type"))?xmlObj.responseXML:xmlObj.responseText):null);
	}
	if (callback)
		xmlObj.onreadystatechange=function(){
			if (xmlObj.readyState==4){
				var txt=getReturnValue();
				if (callback(txt)===true){
					setTimeout(function(){
						$ajax(url,content,callback);
					},1000);
				}
			}
		};
	xmlObj.send(content||"");
	return callback?xmlObj:getReturnValue();
}

//显示debug窗口
function $showDebug(e){
	var key=e.keyCode||e.charCode;
	if ($$.status.debug&&key==192){
		var obj=$getDebug();
		if (obj&&(obj=obj.frameElement))
			obj.style.display=obj.style.display==""?"none":"";
	}
}

//获取debug窗口
function $getDebug(){
	var obj=$topWin.frames["Ctrip_debug"];
	if (obj) return obj;
	with(obj=$topWin.$c("iframe")){
		frameBorder=0;
		id=name="Ctrip_debug";
		with (style){
			border="1px solid red";
			width="600px";
			height="300px";
			position=$$.browser.IE6?"absolute":"fixed";
			bottom=right="10px";
			background="white";
		}
	}
	$topWin.$$.status.container.appendChild(obj);
	if ($$.browser.IE6)
		$topWin.$r("scroll",function(){
			with($("Ctrip_debug").style){
				zoom=1;
				zoom=0;
			}
		});
	with((obj=$getDebug()).document){
		open();
		write("<style>body{margin:0;padding:0;font-family:Arial;font-size:12px;overflow:scroll;}div{border-bottom:1px solid #CCC;}<\/style><body><\/body>");
		close();
	}
	$topWin.__.$r("keydown",$showDebug);
	return obj;
}

//输出调试信息
function $t(info,color,title){
	if (!$topWin.$$.status.debug)
		return;
	if (_!=$topWin)
		return $topWin.$t(info,color);
	var obj=$getDebug();
	var time=new Date().getTime()%(1E7);
	var msg="<font id=\"msg_"+time+"\"> "+info+"<\/font>";
	var div=obj.document.createElement("div");
	if (color)
		div.style.color=color||"black";
	if (title)
		div.title=title;
	div.innerHTML="<font style=\"color:blue;\">"+time+"<\/font> "+msg;
	with (obj.document.body){
		if (firstChild)
			insertBefore(div,firstChild);
		else
			appendChild(div);
	}
	return info;
}

//校验提示
function $alert(obj,info,showDisplay,direction1,direction2){
	obj=$(obj);
	var alertInfo=$("alertInfo"),alertTable=$("alertTable"),flag=1;
	alertInfo.innerHTML=info;
	$topWin.$$.status.alertDiv.style.display="";
	$topWin.$$.status.alertDiv.$setPos(obj,direction1||"tl",direction2||"tr");
	$topWin.$$.status.alertDiv.$setIframe();
	obj.className+=" pubGlobal_checkinfo_input01";
	if (showDisplay!==false)
		obj.$setDisplay();
	function clearAlertDiv(){
		obj.className=obj.className.replace("pubGlobal_checkinfo_input01","");
		$topWin.$$.status.alertDiv.style.display="none";
		$topWin.$$.status.alertDiv.$clearIframe();
		obj.$ur("onblur",clearAlertDiv);
		__.body.$ur("onmousedown",clearAlertDiv);
		obj.clearAlert=null;
		$alert.element=null;
	}
	if (obj.disabled)
		flag=0;
	else
		setTimeout(function(){
			try{obj.focus();}
			catch(e){flag=0;};
		},0);
	if (flag)
		obj.$r("onblur",clearAlertDiv);
	else
		__.body.$r("onmousedown",clearAlertDiv);
	$alert.element=obj;
	obj.clearAlert=clearAlertDiv;
}

//从Object生成查询字符串
function $toQuery(obj, fn){
	var ar = [];
	for(var s in obj) if(obj.hasOwnProperty(s)) ar.push([s, fn ? fn(obj[s]) : obj[s]].join('='));
	return ar.join('&');
}

//从查询字符串生成Object
function $fromQuery(str, fn){
	var ar = str.split('&');
	var ret = {};
	for(var i = 0; i < ar.length; i ++){
		var t = ar[i].split('=');
		if(t.length > 1) ret[t[0]] = fn ? fn(t.slice(1).join('=')) : t.slice(1).join('=');
	}
	return ret;
}

//发送事件信息到uiServer2
function $trackEvent(category, action, label, value){
	var cnt = (arguments.callee._cnt || (arguments.callee._cnt = {tuna_total: 0, other_total: 0}));
	if(category == 'tuna-error'){
		if(cnt.tuna_total >= 20) return;
		var key = category + '.' + action;
		if(cnt[key] && cnt[key] >= 5) return;
		cnt[key] = (cnt[key] || 0) + 1;
		++cnt.tuna_total;
	}else{
		if(cnt.other_total >= 80) return;
		++cnt.other_total;
	}
	
	var url = [
		'http://www.',
		/\.ctrip\.com$/.test(document.domain)? 'ctrip': 'dev.sh.ctriptravel',
		'.com/rp/uiServer2.asp'
	].join('');
	
	var query = $toQuery({
		'action': 'event',
		'p': window.UIMonitor2 && window.UIMonitor2.bi && window.UIMonitor2.bi.pageview_id || '',
		'u': document.URL,
		'c': category,
		'l': label,
		'a': action,
		'v': value,
		't': new Date * 1
	}, function(x){return encodeURIComponent(escape(x))});
	
	new Image().src = url + '?' + query;
}

//错误信息处理
function $error(e){
	if(!e)	return "";
	var name,message,line,file;
	if(e.message){
		if($$.browser.Opera){
			var transed = transErrMessage(e.message);
			name = "";
			message = this.transed[2];
			line = this.transed[1];
			file = this.transed[3].match(/.+((?:file:|http:)[^\s]+?)\s+.+/i)[1];
		}
		else{
			name = e.name || '';
			message = e.message || "";
			line = e.lineNumber || e.line || "";
			file = e.fileName || e.sourceURL || "";
		}
	}
	else if (!e.message&&(arguments[2]||arguments[2] == 0)){
		message = e;
		name = "";
		line = arguments[2];
		file = arguments[1];
	}
	return [name,message,line,file].join('|');
}
function transErrMessage(str){
	var  arr = [];
	arr = str.match(/Statement[^\d]+(\d+)\:([\s\S]+)Backtrace\:([\s\S]+)/);
	return arr;
}

[this.name,this.message,this.line,this.file].join("|");

//取tuna版本
function $tunaVersion(){
	var me = arguments.callee;
	if(!me._val){
		me._val = -1;
		for(var st = document.getElementsByTagName('script'), i = st.length - 1; i >= 0; i--){
			var m = st[i].src.match(/\/tuna_(\d+).js$/i);
			if(m){
				me._val = parseInt('20' + m[1]);
				break;
			}
		}
	}
	return me._val;
}

//广告链接列表
var c_linklist={};

//广告配置
var c_allyes_text={};
var c_allyes_delay=1000;

//DOM节点扩展
var DOM=function(){
	if (!this||this.nodeType==3||this.$) return this;
	this.module={};
	this.module.event={};
	//DOM公共函数
	function getFuncName(func){
		return (func.toString().match(/function([^\{]+)/i)||["","anonymous"])[1].replace(/\(\)/,"").trim()||"anonymous";
	}
	function getEventInfo(eventInfo){
		var str="["+eventInfo.event+"] ";
		str+=eventInfo.obj.tagName||{3:eventInfo.obj.nodeValue,9:"document"}[eventInfo.obj.nodeType||""]||"window";
		str+=eventInfo.obj.id?"#"+eventInfo.obj.id:(eventInfo.obj.name?"@"+eventInfo.obj.name:"");
		str+=" "+getFuncName(eventInfo.func);
		return str;
	}
	function execEvent(obj){
		return function(e){
			e=$fixE(e);
			var eventInfoList=obj.module.event[e.type],value;
			for (var i=0;i<eventInfoList.length;i++){
				if (eventInfoList[i].enabled){
					try{
						value=eventInfoList[i].func.call(obj,e);
						if ($topWin.$$.status.debugEvent)
							$t(getEventInfo(eventInfoList[i])+" ("+(typeof value=="undefined"?"无返回值":value.toString().slice(0,100))+")",null,eventInfoList[i].func);
						if (value===false)
							break;
					}catch(ex){
						$t(getEventInfo(eventInfoList[i])+" (执行错误)","red",eventInfoList[i].func);
						$trackEvent(
							'tuna-error', 'DOM.execEvent', $error(ex), $tunaVersion()
						);
					};
				}else{
					eventInfoList.splice(i,1);
					i--;
				}
			}
			return value;
		}
	}
	if (this.__)
		this.$=function(objId,flag){
			if (typeof objId=="object")
				return DOM.apply(objId);
			var obj;
			if (flag){
				var arr=___.innerHTML.match(new RegExp("\\sid=([\\\'\\\"]?)([\\w$]+?[_$]"+objId.toReString()+")\\1"),"g");
				if (arr){
					for (var i=0;i<arr.length;i++){
						obj=$(arr[i]);
						if (obj)
							return obj;
					}
				}
				return $(objId);
			}else
				obj=__.getElementById(objId);
			return obj?$(obj):null;
		};
	else
		this.$=function(objTag){
			var obj=this.getElementsByTagName(objTag);
			obj.$each=function(func){
				var flag;
				if (obj.length!==undefined)
					for (var i=0;i<obj.length&&(flag=func.call(this,obj[i],i))!==false;i++);
				else func.call(this,obj,0);
				return flag===false?0:1;
			};
			for (var i=0;i<obj.length;i++) $(obj[i]);
			return obj;
		};
	if (this.nodeType==1){
		if (this.tagName=="INPUT"&&/^(text|hidden)$/i.test(this.type)||this.tagName=="TEXTAREA")
			this.isNull=function(){
				return !this.value.trim();
			};
		if (/^SELECT$/.test(this.tagName))
			this.$setValue=function(value){
				for (var i=0;i<this.options.length;i++){
					if (this.options[i].value==value){
						this.selectedIndex=i;
						return true;
					}
				}
				return false;
			};
	}
	if (!this.hasAttribute)
		this.hasAttribute=function(str){
			return typeof this.attributes[str]!="undefined";
		};
	this.$parentNode=function(str){
		var obj=$(this.parentNode);
		if (str&&obj&&obj.tagName&&obj.tagName.toLowerCase()!=str.toLowerCase())
			obj=obj.$parentNode(str);
		return obj&&obj.tagName?obj:null;
	};
	this.$firstChild=function(){
		return $(this.firstChild);
	};
	this.$lastChild=function(){
		return $(this.lastChild);
	};
	this.$childNodes=function(){
		var obj=this.childNodes;
		for (var i=0;i<obj.length;i++)
			$(obj[i]);
		return obj;
	};
	this.$nSib=this.$nextSibling=function(){
		return $(this.nextSibling);
	};
	this.$pSib=this.$previousSibling=function(){
		return $(this.previousSibling);
	};
	this.$click=function(){
		if (this.click)
			this.click();
		else{
			var evt=__.createEvent("MouseEvents");
			evt.initMouseEvent("click",true,true,_,0,0,0,0,0,false,false,false,false,0,this);
			this.dispatchEvent(evt);
		}
	};
	this.$getStyle=function(style){
		var css=this.currentStyle||_.getComputedStyle(this,null);
		return style?css[style]:css;
	};
	this.$getPara=function(){
		var _t_para,para=(_t_para=this.getAttribute(arguments[0])||"").split(_t_para.indexOf("")>-1?"":"|");
		for (var i=0;i<Math.max(arguments.length-1,para.length);i++)
			para[i]=para[i]||arguments[i+1]||"";
		return para;
	};
	this.$r=this.$regEvent=function(eventList,funcList,hash,level){
		//eventList,funcList,hash,level
		//eventList,funcList,level
		level=level||50;
		if (arguments.length==3&&typeof hash=="number"){
			level=hash;
			hash=null;
		}
		var obj=this;
		if (eventList.constructor!=Array) eventList=[eventList];
		if (funcList.constructor!=Array) funcList=[funcList];
		eventList.each(function(e){
			funcList.each(function(f){
				e=e.replace(/^(on)?/i,"");
				e=e=="DOMContentLoaded"?"domready":e.toLowerCase();;
				if (e=="domready")
					obj=_;
				var eventInfo={
					enabled:true,
					obj:obj,
					event:e,
					func:f,
					hash:hash,
					level:level,
					id:_.$$.status.regEventCount++
				};
				if (e=="domready"&&$$.status.domReady||e=="load"&&(obj==_||obj==__.body)&&$$.status.load)
					f();
				else{
					if (!(e in obj.module.event)){
						obj.module.event[e]=[];
						if (obj.attachEvent) obj.attachEvent("on"+e,execEvent(obj));
						else obj.addEventListener(e,execEvent(obj),false);
					}
					obj.module.event[e].push(eventInfo);
					obj.module.event[e].sort(function(a,b){
						return (a.level-b.level)||(a.id-b.id);
					});
				}
				if (hash){
					if (!(hash in $$.status.regEventHash))
						$$.status.regEventHash[hash]=[];
					$$.status.regEventHash[hash].push(eventInfo);
				}
			});
		});
	};
	this.$ur=this.$unregEvent=function(eventList,funcList,hash){
		var obj=this;
		if (eventList.constructor!=Array) eventList=[eventList];
		if (funcList.constructor!=Array) funcList=[funcList];
		eventList.each(function(e){
			funcList.each(function(f){
				e=e.replace(/^(on)?/i,"");
				e=e=="DOMContentLoaded"?"domready":e.toLowerCase();
				if (e=="domready")
					obj=_;
				if (e in obj.module.event){
					var eventInfoList=obj.module.event[e];
					for (var i=0;i<eventInfoList.length;i++){
						if (eventInfoList[i].enabled&&eventInfoList[i].func==f&&(!hash||eventInfoList[i].hash==hash)){
							eventInfoList[i].enabled=false;
							break;
						}
					}
					if (!eventInfoList.length){
						delete obj.module.event[e];
						if (obj.detachEvent) obj.detachEvent(e,execEvent);
						else obj.removeEventListener(e,execEvent,false);
					}
				}
			});
		});
	};
	this.$urh=this.$unregEventHash=function(hash){
		var obj=this;
		if (hash in $$.status.regEventHash){
			var eventInfoList=$$.status.regEventHash[hash],eventInfo;
			while (eventInfo=eventInfoList.shift())
				eventInfo.obj.$ur(eventInfo.event,eventInfo.func,hash);
			delete $$.status.regEventHash[hash];
		}
	};
	this.$getWin=function(){
		var doc=this.ownerDocument;
		return doc.parentWindow||doc.defaultView;
	};
	this.$g=this.$selNode=function(sel){
		function _m_query(sel,node){
			var em=[],re=sel.match(/^([\.\#]*)([a-zA-Z0-9\-_*]+)(.*)$/i);
			if (!re) return [];
			if (re[1]=="#"){
				var objTmp=$(re[2]);
				if (objTmp) em.push(objTmp);
			}
			else if(re[1]==".")
				node.each(function(obj){
					obj.$("*").$each(function(obj){
						if (new RegExp("\\b"+re[2]+"\\b").test(obj.className))
							em.push($(obj));
					});
				});
			else
				for (var i=0;i<node.length;i++){
					var objTmp=node[i].$(re[2]);
					if (objTmp) for (var j=0;j<objTmp.length;j++) em.push(objTmp[j]);
				}
			re[3].replace(/\[([^!=]+)(=|!=)([^\]]*)\]/gi,function(a,b,c,d){
				var emTmp=em.slice(0);
				em=[];
				emTmp.each(function(obj){
					b={"class":"className","for":"htmlFor"}[b]||b;
					var attrTmp=obj[b]||obj.getAttribute(b);
					var flag;
					if (b=="className")
						flag=new RegExp("\\b"+d+"\\b").test(attrTmp);
					else
						flag=attrTmp==d;
					if ((c=="=")==flag)
						em.push($(obj));
				});
			});
			return em;
		}
		var selfEm=[this==_?_.__.body:this],arr1=[],arr2=[];
		sel.replace(/[^\[,]([^\[,]*(\[[^\]]*\])*)+/g,function(a){
			var em=selfEm.slice(0);
			a.replace(/(#|\*)/gi," $1").replace(/([^\^ ])\.(\w+)/gi,"$1[className=$2]").trim().split(/\s+/g).each(function(str){
				em=_m_query(str,em);
			});
			arr1=arr1.concat(em);
		});
		arr1.each(function(em){
			if (!em.__selNodeFlag__){
				em.__selNodeFlag__=true;
				arr2.push(em);
			}
		});
		arr2.each(function(em){
			em.__selNodeFlag__=false;
		});
		return arr2.length==0?null:arr2;
	};
	this.$getPos=function(){
		var src=this,obj=this,w,pos=[0,0],flag,border={"thin":2,"medium":4,"thick":6};
		function fixBorder(){
			if (src==obj)
				return;
			function calcBorder(str){
				var value=/^(none|hidden)$/i.test(obj.$getStyle("border"+str+"Style"))?0:obj.$getStyle("border"+str+"Width");
				return border[value]||parseInt(value,10)||0;
			}
			pos[0]+=calcBorder("Left");
			pos[1]+=calcBorder("Top");
		}
		do{
			w=$(obj).$getWin();
			if (obj.tagName.match(/^(iframe|frameset)$/i))
				fixBorder();
			flag=-1;
			do{
				pos[0]+=obj.offsetLeft-obj.scrollLeft;
				pos[1]+=obj.offsetTop-($$.browser.Safari&&obj==w.document.body?0:obj.scrollTop);
				if ($$.browser.IE)
					fixBorder();
				if (!$$.browser.IE6&&obj.$getStyle("position")=="fixed")
					flag=1;
			} while(obj.offsetParent&&obj!=obj.offsetParent&&(obj=$(obj.offsetParent))&&obj!=_.___);
			if ($$.browser.Safari){
				pos[0]+=w.__.body.leftMargin||0;
				pos[1]+=w.__.body.topMargin||0;
			}
			if (flag==1||w!=$topWin){
				pos[0]+=w.___.scrollLeft*flag;
				pos[1]+=w.___.scrollTop*flag;
			}
		} while (obj=w.frameElement);
		return pos;
	};
	this.$setPos=function(obj2,pos1,pos2){
		function _m_query(re,i){
			function _m_cal(pos,obj,px,i){
				return px+{"l":0,"c":obj.offsetWidth/2,"r":obj.offsetWidth,"t":0,"m":obj.offsetHeight/2,"b":obj.offsetHeight}[pos||"l"]*i;
			}
			return _m_cal(pos1.match(re),this,_m_cal(pos2.match(re),obj2,pos[i],1),-1)+"px";
		}
		var pos=obj2.$getPos();
		pos1=pos1||"lt";
		pos2=pos2||"lb";
		this.style.left=_m_query.call(this,/[lcr]/i,0);
		this.style.top=_m_query.call(this,/[tmb]/i,1);
	};
	this.$setIframe=function(flag){
		if (flag!==true&&!$$.browser.IE6) return;
		if (this.module.iframe)
			iframe=this.module.iframe;
		else{
			function getIframe(){
				for (var i=0;i<$topWin.$$.module.iframe.length;i++){
					if ($topWin.$$.module.iframe[i].$getStyle("display")=="none")
						return $topWin.$$.module.iframe[i];
				}
			}
			var iframe=getIframe();
			if (!iframe){
				iframe=$topWin.$c("iframe");
				with(iframe.style){
					width=height="0px";
					background="#FFF";
					position="absolute";
					display="none";
					zIndex=100;
				}
				iframe.frameBorder=0;
				iframe.id=iframe.name=$getUid();
				$topWin.$$.status.container.appendChild(iframe);
				$topWin.$$.module.iframe.push(iframe);
				with($topWin.frames[iframe.id].document){
					open();
					write('<style>html,body{overflow:hidden}</style>');
					close();
				}
			}
			this.module.iframe=iframe;
		}
		iframe.$setPos(this,"tl","tl");
		with (iframe.style){
			width=this.offsetWidth+"px";
			height=this.offsetHeight+"px";
			display="";
		}
		return iframe;
	};
	this.$clearIframe=function(){
		var iframe=this.module.iframe;
		if (iframe){
			iframe.style.display="none";
			this.module.iframe=null;
		}
		return iframe;
	};
	function $abs(obj,flag,func){
		if (!obj) return null;
		flag=flag||"n";
		var re=new RegExp(({1:"n",3:"t",8:"c"}[obj.nodeType])||"o","i");
		return flag.match(re)?obj:func.call(obj,flag);
	}
	this.$nAbs=function(flag){
		var obj=this,objTmp=obj.firstChild||obj.nextSibling;
		if (!objTmp)
			do {
				obj=obj.parentNode;
				if (obj==__.body) return null;
				objTmp=obj.nextSibling;
			} while (!objTmp);
		return $($abs(objTmp,flag,arguments.callee));
	};
	this.$pAbs=function(flag){
		if (this==__.body) return null;
		var objTmp=this.previousSibling;
		if (objTmp){
			while (objTmp.lastChild)
				objTmp=objTmp.lastChild;
		}else
			objTmp=this.parentNode;
		return $($abs(objTmp,flag,arguments.callee));
	};
	this.$focusNext=function(){
		if (!this.form) return;
		try{this.blur();}catch(e){;};
		var obj=this.form.elements,flag;
		for (var i=0;i<obj.length;i++){
			if (flag){
				if (!$(obj[i]).disabled&&obj[i].$isDisplay())
					try{obj[i].focus();return;}catch(e){};
			}
			if (obj[i]==this) flag=true;
		};
	};
	this.$setDisplay=function(){
		var pos=this.$getPos();
		with($topWin.___){
			scrollLeft=pos[0]-80;
			scrollTop=pos[1]-80;
		}
	};
	this.$isDisplay=function(){
		var obj=this;
		do {
			if (obj.tagName=="INPUT"&&obj.type=="hidden"||
				obj.$getStyle("display")=="none"||
				obj.$getStyle("visibility")=="hidden")
					return false;
		} while ((obj=obj.$parentNode())&&obj.nodeType==1);
		return true;
	};
	return this;
};

//初始化DOM节点
DOM.apply(_);
DOM.apply(__);
DOM.apply(___);
DOM.apply($$.status.alertDiv);

//linklist模块
Ctrip.module.linklist=function(obj){
	var cls=obj.getAttribute('mod_linklist_class');
	if(cls===null) cls='pubSidebar_linkmargin01';
	var s='<a class="'+cls+'" href="{$link}" title="{$text}" target="{$target}">{$text}</a>';
	var a=obj.getAttribute('mod_linklist_id');
	if(!a||!(a=window.c_linklist[a])||a.constructor!==Array)
		return;
	for(var i=0;i<a.length;i++){
		var t=a[i].split('|',2);
		a[i]=s.replaceWith({
			text:$s2t(t[0]),
			link:t[1],
			target:a[i].target||'_blank'
		});
	}
	obj.innerHTML=a.join('');
};

//allyes模块
Ctrip.module.allyes=function(obj){
	var user=attr("user")||attr("mod_allyes_user");
	if(!user){
		var buttons=attr('mod_allyes_buttons',window);
		var text=attr('mod_allyes_text',window.c_allyes_text);
		if(!buttons&&!text)
			return;
	}
	var c_div_template='<div class="base_ad140x60" style="height:{$height}px">{$iframe}<\/div>';
	var c_txt_template='<div class="base_adtxt140">{$text}<\/div>';
	var c_frm_template='<iframe marginheight="0" width="100%" height="100%" marginwidth="0" frameborder="0" scrolling="no" src="http:\/\/allyes.ctrip.com\/main\/adfshow?user={$user}&db=ctrip&border=0&local=yes"><\/iframe>';
	setTimeout(function(){
		if(user){
			if(user.indexOf('@')>-1)
				user=choose(user.split('@'));
			obj.innerHTML=c_frm_template.replace('{$user}',user);
		}else{
			var html=[];
			if(buttons)	html=buttons.map(function(b){
				b.button=b.button||';';
				return c_div_template.replace('{$height}',b.height)
					.replace('{$iframe}',c_frm_template.replace('{$user}',b.user));
			});
			if(text)
				html.push(c_txt_template.replace('{$text}',$s2t(text)));
			obj.innerHTML=html.join('');
		}
	},window.c_allyes_delay);
	function attr(name,context){
		var v=obj.getAttribute(name);
		if(!v)
			return null;
		if(context)
			return context[v]||null;
		else
			return v;
	}
	function choose(arr){
		var re=/^(SearchFlights\.aspx|SearchHotels\.aspx|query\.asp)$/i;
		var pn=location.pathname;
		pn=pn.slice(pn.lastIndexOf('/')+1);
		return re.test(pn)?arr[0]:arr[1];
	}
};

//notice模块
Ctrip.module.notice=function(obj){
	var focusFlag;
	obj.module.notice=new function(){
		this.enabled=true;
		this.tip=obj.getAttribute("mod_notice_tip")||"";
		this.check=function(){
			if (obj.module.notice.enabled){
				with(obj){
					if (isNull()){
						style.color="gray";
						value=module.notice.tip;
					}else
						style.color="";
				}
			}
		};
		this.isNull=obj.isNull=function(){
			return obj.value.trim()==""||obj.value==obj.module.notice.tip;
		};
	};
	obj.$r("focus",function(){
		focusFlag=true;
		if (obj.module.notice.enabled){
			obj.style.color="";
			if (obj.value==obj.module.notice.tip)
				obj.value="";
		}
	},10);
	obj.$r("blur",function(){
		focusFlag=false;
		obj.module.notice.check();
	},90);
	if (obj.form){
		var form=$(obj.form);
		form.$r("submit",function(){
			if (obj.isNull())
				obj.value="";
			setTimeout(function(){
				if (!focusFlag)
					obj.module.notice.check();
			},1);
		});
		if (!$$.browser.Opera)
			_.$r("beforeunload",obj.module.notice.check);
	}
	obj.module.notice.check();
};

//tab模块
Ctrip.module.tab=function(obj){
	var obj1=_.$g(obj.getAttribute("mod_tab_button")||"");
	var obj2=_.$g(obj.getAttribute("mod_tab_panel")||"");
	var select=parseInt(obj.getAttribute("mod_tab_select")||1,10);
	var event=((obj.getAttribute("mod_tab_event")||"").match(/^mouseover$/i)||"click").toString();
	if (!obj1||!obj2) return;
	obj.module.tab=new function(){
		this.funcListHash={};
		this.select=function(i){
			if (this.funcListHash[i-1])
				this.funcListHash[i-1]();
		};
		this.index=select;
	};
	obj1.each(function(objTmp1,j){
		obj.module.tab.funcListHash[j]=function(){
			obj1.each(function(objTmp2,k){
				objTmp2.className=objTmp2.className.replace(/_(no)?current/g,"_"+(j==k?"":"no")+"current");
				if (obj2[k]) obj2[k].style.display=(j==k)?"":"none";
			});
			obj.module.tab.index=j+1;
		};
		objTmp1.$r(event,obj.module.tab.funcListHash[j]);
	});
	obj.module.tab.select(select);
};

//display模块
Ctrip.module.display=function(obj){
	var selList=obj.$getPara("mod_display_panel"),list=[];
	selList.each(function(sel){
		sel=_.$(sel)||_.$selNode(sel);
		if (sel){
			if (sel.length)
				sel.each(function(sel){list.push(sel);});
			else
				list.push(sel);
		}
	});
	obj.$r("click",function(){
		(function(obj){
			for (var i=0;i<obj.childNodes.length;i++){
				with(obj.childNodes[i]){
					if (nodeType==3){
						var re=new RegExp($$.string.display.match(/[^@]+/g).join("|"),"gi");
						nodeValue=nodeValue.replace(re,function(str){
							var re=new RegExp("@"+str+"\\|([^@]+)|([^@]+)\\|"+str+"@","i");
							var arr=$$.string.display.match(re);
							return arr[1]||arr[2];
						});
					}else
						arguments.callee(obj.childNodes[i]);
				}
			}
		})(obj);
		list.each(function(obj){
			obj.style.display=obj.$getStyle("display")=="none"?"":"none";
		});
	});
};

//selectAll模块
Ctrip.module.selectAll=function(obj){
	var inputList=$selNode(obj.getAttribute("mod_selectAll_input")||"");
	if (!inputList) return;
	inputList.each(function(input){
		if (input!=obj)
			input.$r("onclick",function(){
				obj.checked=inputList.each(function(input){
					if (input!=obj&&!input.checked)
						return false;
				});
			});
	});
	obj.$r("click",function(){
		inputList.each(function(input){
			input.checked=obj.checked;
		});
	});
};

//validate模块
Ctrip.module.validate=function(obj){
	var msgTrue=_.$(obj.getAttribute("mod_validate_true")||"");
	var msgFalse=_.$(obj.getAttribute("mod_validate_false")||"");
	var func=obj.getAttribute("mod_validate_function")||"";
	if (!func) return;
	var re=func.match(/^\/(.*?[^\\])\/([gmi]*?)$/);
	var clock,flagTrue,flagFalse;
	func=obj[func]||_[func];
	if (re||func){
		obj.module.validate=new function(){
			this.check=function(){
				if (obj.value||!msgTrue&&!msgFalse)
					flagFalse=!(flagTrue=func?
						func(obj.value,obj):
						obj.value.match(new RegExp(re[1],re[2])));
				else
					flagTrue=flagFalse=false;
				if (msgTrue) msgTrue.style.display=flagTrue?"":"none";
				if (msgFalse) msgFalse.style.display=flagFalse?"":"none";
			};
		};
		obj.$r("focus",function(){
			clock=setInterval(obj.module.validate.check,200);
		});
		obj.$r("blur",function(){
			obj.module.validate.check();
			clearInterval(clock);
		});
	}
};

//jmpInfo模块
/*
 * Todo:
 * use tuna: module, add id
 * config: changable, explicit refresh
 * getPosition: scroll, visibility
 * 
 * Notice:
 * don't name inpage template #main, old template doing
 */
$$.module.jmpInfo = (function(){
	var getPosition = function(el){
		var p = $(el).$getPos();
		return {x: p[0], y: p[1]};
	};

	var setPosition = function(el, pos){
		if(!el) return;
		var st = el.style, left, top;
		if (pos){
			left = pos.x + 'px';
			top = pos.y + 'px';
		}else{
			left = '-10000px';
			top = '-10000px';
		}
		if(st.display != 'block') st.display = 'block';
		if(st.left != left) st.left = left;
		if(st.top != top) st.top = top;
	};
	
	var J = {
		logging: false,
		coloring: false,
		animating: false,
		fading: false,
		
		current: null,
		next: null,
		
		popup: null,
		
		ani_box: null,
		log_box: null,
		
		timers: {
			show: 300,
			hide: 100,
			refresh: 200
		},
		
		array: {},
		template: {},

		//css_url: 'http://webresource.ctrip.com/styles/control/tuna_071206/control_jmpinfo_tuna_071206.css',
		css_loaded: false,
		
		load_timeout: 3000,
		
		template_dir: 'http://webresource.ctrip.com/code/js/resource/jmpInfo_tuna/',
		data_dir: 'http://webresource.ctrip.com/code/js/resource/jmpInfo_tuna/',
		
		common_callback: null,

		log: function(){
			if(!J.logging) return;
			var a = [].slice.call(arguments, 0);
			if(window.console){
				console.log(a.join(' '));
			}else{
				if(!J.console_box) J.console_box = J.make_box({
					left: '50%',
					top: '0px',
					font: 'normal 12px/16px verdana',
					color: 'red',
					border: '1px solid gray',
					padding: '4px'
				});
				J.console_box.appendChild(document.createElement('div')).innerHTML = a.join(' ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n?|\n/g, '<br />');
			}
		},
		color: function(el, color){
			if(J.coloring){
				el.style.backgroundColor = color;
				el.style.borderColor = color == 'red' ? '#000' : '';
			}
		},
		
		init: function(){
			J.popup = $("tuna_jmpinfo") || $('z1');
			J.popup.style.visibility = 'visible';
			setPosition(J.popup, null);
			document.documentElement.$r('mouseover', J.mouseover);
		},
		test: function(el){
			return el.getAttribute('mod') && /(\||^)jmpInfo(\||$)/.test(el.getAttribute('mod'));
		},
		mouseover: function(e){
			var evt = e || window.event;
			var el = evt.target || evt.srcElement;
			if(el == J.ani_box) return;
			if(J.current){
				if(J.parent_of(J.current, el) || J.parent_of(J.popup, el)){
					J.clear_timer('hide');
					J.color(J.current, 'red');
					return;
				}
				J.set_hide();
				J.set
			}
			if(J.next){
				if(J.parent_of(J.next, el)) return;
				J.clear_timer('show');
				J.color(J.next, '');
			}
			J.next = null;
			if(J.test(el)) J.set_show(el);
		},
		make_box: function(sty){
			var div = document.createElement('div');
			var arr = [];
			sty = $merge({
				position:'absolute',
				left:'-1000px',
				top:'-1000px'
			}, sty);
			for(var s in sty) arr.push(s + ':' + sty[s]);
			div.style.cssText = arr.join(';');
			return document.body.appendChild(div);
		},
		set_show: function(el){
			J.next = el;
			J.set_timer('show');
			J.color(J.next, 'pink');
			J.getInfo(J.next);
			J.fire_event('before-show', J.next);
		},
		set_hide: function(el){
			J.set_timer('hide');
			J.color(J.current, 'yellow');
			J.fire_event('before-hide', J.current);
		},
		set_timer: function(type, b_interval){
			var t = J.timers;
			if(!t['h_' + type]){
				t['h_' + type] = (!b_interval ? setTimeout : setInterval)(J['fn_' + type], t[type]);
				if(b_interval) J['fn_' + type]();
			}
		},
		clear_timer: function(type, b_interval){
			var t = J.timers;
			t['h_' + type] = (!b_interval ? clearTimeout : clearInterval)(t['h_' + type]) && null;
		},
		change_state: function(bshow){
			if(bshow){
				if(!J.next){
					J.log('fn_show: J.next is null');
					return;
				}
				J.clear_timer('show');
				J.current = J.next;
				J.next = null;
				J.color(J.current, 'red');
				J.set_timer('refresh', true);
				J.fire_event('show', J.current);
				J.popup.$setIframe();
			}else{
				if(!J.current){
					J.log('fn_hide: J.current is null');
					return;
				}
				J.clear_timer('hide');
				J.clear_timer('refresh', true);
				if(J.fading) J.fade(true, J.popup, true);
				else if(J.animating) J.animate(true, getPosition(J.popup), true);
				else setPosition(J.popup, null);
				J.color(J.current, '');
				J.fire_event('hide', J.current);
				J.popup.$clearIframe();
				J.current = null;
			}
		},

		fn_show: function(effect_over){
			J.change_state(true);
		},
		fn_hide: function(flag){
			J.change_state(false);
		},
		fn_refresh: function(){
			if(!J.current){
				J.log('J.current lost');
				return;
			}
			var info = J.getInfo(J.current);
			if(info.ready){
				J.set_html(J.popup, J.makeHtml(info));
				var pos = J.set_pos(J.current, J.popup, info.position);
				if(J.animating) J.animate(true, pos);
				else if(J.fading) J.fade(true, J.popup);
			}
		},
		
		parent_of: function(a, b){
			if(!a || !b) return false;
			while(b && a != b) b = b.parentNode;
			return a == b;
		},
		view_port: function(){
			var r = $pageSize('win');
			r.right = r.left + r.width;
			r.bottom = r.top + r.height;
			return r;
		},
		animate: function(ini, target, hidding){
			if(!J.ani_box) J.ani_box = J.ani_box = J.make_box({border:'1px solid #999'});
			if(ini === true){
				if(!hidding == J.animate__) return;
				J.animate__ = !hidding;
				J.popup.style.visibility = 'hidden';
				var src = getPosition(J.current);
				$animate(J.ani_box, {
					left: [src.x, target.x],
					top: [src.y, target.y],
					width: [J.current.offsetWidth, J.popup.offsetWidth],
					height: [J.current.offsetHeight, J.popup.offsetHeight]
				}, {
					duration: 240,
					callback: J.animate,
					reverse: hidding
				})
			}else{
				J.popup.style.visibility = 'visible';
				setPosition(J.ani_box, null);
			}
		},
		fade: function(ini, target, hidding){
			if(ini === true){
				if(!hidding == J.fade__) return;
				J.fade__ = !hidding;
				$animate(target, {opacity: [0, 1]},{
					duration: 240,
					callback: hidding ? J.fade : function(){},
					reverse: hidding
				});
			}else{
				setPosition(J.popup, null);
			}
		},
		
		set_html: function(el, html){
			if(J.current_html == html) return;
			el.innerHTML = J.current_html = html;
			$parserRe(el);
			var st = el.style;
			st.overflow = 'visible';
			st.width = '';
			st.width = el.scrollWidth + 'px';
			st.height = '';
			st.height = el.scrollHeight + 'px';
		},
		set_pos: function(a, b, ar){
			if(!a || !b){
				return null;
			}
			if(!a.offsetWidth || !a.offsetHeight){
				setPosition(b, null);
				if(b.$clearIframe) b.$clearIframe();
				return null;
			}else{
				var p = J.calc_pos(a, b, ar);
				setPosition(b, p);
				if(b.$setIframe) b.$setIframe();
				return p;
			}
		},
		calc_pos: function(a, b, ar){
			if(ar && ar.length == 4){
				for(var i = 0, br = []; i < ar.length; i ++){
					br[i] = /[lt]/.test(ar[i]) ? 0 : /[rb]/.test(ar[i]) ? 1 : 0.5;
				}
				var offset = [{
					x: b.offsetWidth * br[0],
					y: b.offsetHeight * br[1]
				}, {
					x: a.offsetWidth * br[2],
					y: a.offsetHeight * br[3]
				}];
				var apos = getPosition(a);
				return {x: apos.x + offset[1].x - offset[0].x, y: apos.y + offset[1].y - offset[0].y};
			}else{
				var apos = getPosition(a);
				var view = J.view_port();
				var asize = {x: a.offsetWidth, y: a.offsetHeight};
				var bsize = {x: b.offsetWidth, y: b.offsetHeight};
				var r = ['l', 't', 'l', 'b'];
				if(apos.x + bsize.x > view.right && apos.x + asize.x - bsize.x >= view.left){
					r[0] = 'r';
					r[2] = 'r';
				}
				if(apos.y + asize.y + bsize.y > view.bottom && apos.y - bsize.y >= view.top){
					r[1] = 'b';
					r[3] = 't';
				}
				return arguments.callee(a, b, r);
			}
		},
		
		fire_event: function(type, el){
			if(J.common_callback) J.common_callback(type, el);
			var fn = J.getInfo(el).callback;
			if(fn) fn(type, el);
		},
			
		loadTemplate: function(name){
			/*
			if(!J.css_loaded){
				J.css_loaded = true;
				$loadCss(J.css_url);
			}
			*/
			
			var hash = $$.module.jmpInfo.template;
			if(hash.hasOwnProperty(name)) return !!hash[name];
			hash[name] = false;
			
			if(name.charAt(0) == '#'){
				var el = document.$g(name);
				if(!el){
					J.log('template element ' + name + ' not found');
				}else{
					hash[name] = J.htmlOf(el[0]);
					return true;
				}
			}else{
				var url = J.template_dir + name + '.js';
				$loadJs(url, 'gbk', function(timeout){
					if(timeout){
						J.log('J.loadTemplate timeout for ' + url);
						return true;
					}
				}, J.load_timeout);	
			}
			
			return false;
		},
		loadData: function(query){
			if(!query) return true;
			
			var name = query.name;
			var hash = $$.module.jmpInfo.array;
			if(hash.hasOwnProperty(name)) return !!hash[name];
			hash[name] = false;
			
			var url = J.data_dir + name + '_' + $$.status.charset + '.js';
			$loadJs(url, null, function(timeout){
				if(timeout){
					J.log('J.loadData timeout for ' + url);
					return true;
				}
			}, J.load_timeout);
			
			return false;
		},
		
		getInfo: function(el){
			var ret = {};
			
			var page = (el.getAttribute('mod_jmpInfo_page') || 'default_normal').split('?');
			ret.page = !/^#/.test(page[0]) ? page[0].replace(/\.asp$/i, '').toLowerCase() : page[0];
			ret.query = J.parseQuery(page.slice(1).join(''));
			ret.ready = J.loadTemplate(ret.page) && J.loadData(ret.query);
			
			var content = el.getAttribute('mod_jmpInfo_content') || '';
			ret.content = content.split('|');
			
			var position = el.getAttribute('mod_jmpInfo_position') || 'auto';
			if(position in J.posMap) position = J.posMap[position];
			ret.position = /[ltrbcm]{4}/.test(position) ? position.split('') : null;
			
			var callback = el.getAttribute('mod_jmpInfo_callback');
			if(callback && typeof(window[callback]) == 'function') ret.callback = window[callback];
			
			return ret;
		},
		posMap: {
			'align-center': 'ctcb',
			'align-left': 'ltlb',
			'corner-left': 'ltrb',
			'align-right': 'rtrb',
			'corner-right': 'rtlb',
			'above-align-left': 'lblt',
			'above-align-right': 'rbrt'
		},
		parseQuery: function(s){
			if(!s) return null;
			var a = s.split('=');
			if(a.length < 2) return null;
			return {
				name: a[0],
				value: a.slice(1).join('')
			}
		},
		queryData: function(query){
			var s = $$.module.jmpInfo.array[query.name];
			var v = '@' + query.value + '|';
			var i = s.indexOf(v) + 1;
			if(!i){
				J.log('queryData failure', query.name, query.value);
				return [];
			}
			return s.slice(i, s.indexOf('@', i)).split('|');
		},
		makeHtml: function(info){
			var s = $$.module.jmpInfo.template[info.page];
			var m = s.match(/<body.*?>([\s\S]+)<\/body>/i);
			s = (m ? m[1] : s).replace(/<!--[\s\S]*?-->/g, '');
			var o = {'para': info.content};
			if(info.query) o['array'] = J.queryData(info.query);
			return J.fillContent(s, o);
		},
		fillContent: function(html, arrays){
			var prefix = $keys(arrays).join('|');
			var s = '(<(\\w+)[^>]*)\\bid="(' + prefix + ')(\\d+)"([^>]*>)[\\s\\S]*?(<\\/\\2>)';
			var r = new RegExp(s, 'gi');
			return html.replace(r, function(x1, p1, x2, type, index, p2, p3){
				return p1 + p2 + (arrays[type][index - 1] || '') + p3;
			});
		},
		
		htmlOf: function(el){
			if(!el || el.nodeType != 1) return '';
			el = el.cloneNode(true);
			el.removeAttribute('id');
			el.style.cssText = el.style.cssText.replace(/\bdisplay:\s*none;?/i, '');
			if('outerHTML' in el){
				return el.outerHTML.replace(/(<[^>]+\sid=)(\w+)/g, '$1"$2"');
			}else{
				var r = [];
				var a = el.attributes;
				for(var i = 0; i < a.length; i++){
					if(a[i].name == 'id') continue;
					r.push(a[i].name + '="' + a[i].value + '"');
				}
				var s = r.length ? ' ' + r.join(' ') : '';
				var t = el.tagName.toLowerCase();
				return '<' + t + s + '>' + el.innerHTML + '</' + t + '>';
			}
		}
	};
	$r('domReady', J.init);
	return J;
})();

//地址选择器模块
$$.string.address={
	"zh-cn":{
		b:"输入中文/拼音或↑↓选择.",
		i:"输入",
		j:"或↑↓选择.",
		k:"中文/拼音",
		e:"请输入至少两个字母或一个汉字.",
		h:"",
		o:"按拼音排序",
		s:"对不起, 找不到: ",
		l:"结果共",
		p:"项,←→翻页",
		a:",共"
	},
	"zh-tw":{
		b:"輸入中文/拼音或↑↓選擇.",
		i:"輸入",
		j:"或↑↓選擇.",
		k:"中文/拼音",
		e:"請輸入至少兩個字母或一個漢字.",
		h:"",
		o:"按拼音排序",
		s:"對不起, 找不到: ",
		l:"結果共",
		p:"項,←→翻頁",
		a:",共"
	},
	"en":{
		b:"Type or scroll to select.",
		i:"Input ",
		j:" or use up or down to select.",
		k:"English",
		e:"Please Input at least two character.",
		h:"",
		o:"sort by spelling",
		s:"No match",
		l:"Results ",
		p:",left or right to turn page",
		a:",All"
	}
}[$$.status.version];

$$.module.address.sourceMap={
	"hotel":["http://scriptres.ctrip.com/hoteladdress/HotelCityAddress{$charset}.aspx","utf-8"],
	"hotelAll":["http://scriptres.ctrip.com/hoteladdress/HotelCityAddress{$charset}.aspx","utf-8"]
};

(function(){
	function sortFunc(a,b){
		var c=a.match(/^[^\|]+/),d=b.match(/^[^\|]+/);
		return c>d?1:(c==d?0:-1);
	}
	function addressInit(){
		var divTmp=$c("div");
		with (divTmp.style){
			width="0px";
			height="0px";
		}
		divTmp.innerHTML="<div id=\"tuna_address\" style=\"display:none;position:absolute;z-index:120;overflow:hidden;\"><div id=\"address_warp\"><div id=\"address_message\">&nbsp;<\/div><div id=\"address_list\"><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><a class=\"a1\" href=\"###\"><span>&nbsp;<\/span>&nbsp;<\/a><\/div><div class=\"address_pagebreak\" id=\"address_p\"><a id=\"address_arrowl\" href=\"javascript:;\" name=\"p\">&lt;-<\/a><a id=\"address_p1\" href=\"javascript:;\" name=\"1\" class=\"address_current\">1<\/a><a id=\"address_p2\" href=\"javascript:;\" name=\"2\">2<\/a><a id=\"address_p3\" href=\"javascript:;\" name=\"3\">3<\/a><a id=\"address_p4\" href=\"javascript:;\" name=\"4\">4<\/a><a id=\"address_p5\" href=\"javascript:;\" name=\"5\">5<\/a><a id=\"address_arrowr\" href=\"javascript:;\" name=\"n\">-&gt;<\/a><\/div><\/div><\/div>";
		$("jsContainer").appendChild(divTmp);
		div=$("tuna_address");
		$$.module.address.source["default"]="@@";
		idr=$("address_warp");
		cue=$('address_message');
		u=$('address_list');
		p=[$('address_p'),$('address_p1'),$('address_p2'),$('address_p3'),$('address_p4'),$('address_p5')];
		pp=$('address_arrowl');
		pn=$('address_arrowr');
		li=u.getElementsByTagName("a");
		li_bak=[];
		for (var i=0;i<li.length;i++)
			li_bak[i]=li[i].cloneNode(true);
	}

	var div,idr,cue,u,p,pp,pn,li,li_bak;

	Ctrip.module.address=function(obj){
		if (!div)
			addressInit();
		var show=0,setPosFlag,owin=obj.$getWin();
		var $ref=obj.module.address={};
		var list,clock,lastselect=null,lastvalue,data=[];
		obj.setAttribute("autoComplete","off");
		$r("beforeunload",function(){
			obj.setAttribute("autoComplete","on");
		});
		$ref.focusNext=obj.getAttribute("mod_address_focusNext");
		$ref.focusNext=/^(1|true)$/i.test($ref.focusNext||"");
		$ref.reference=obj.getAttribute("mod_address_reference");
		var cookie=obj.getAttribute("mod_address_cookie");
		if (cookie){
			cookie=owin.$(cookie);
			if (!cookie){
				var _t_cookie=owin.$c("input");
				with (_t_cookie){
					type="hidden";
					id=name=cookie;
				}
				cookie=_t_cookie;
				obj.parentNode.insertBefore(cookie,obj);
			}
		}
		if ($ref.reference)
			$ref.reference=owin.$($ref.reference)||owin.$($ref.reference,true);
		var s_hot=obj.getAttribute("mod_address_suggest");
		var s_cookie=obj.getAttribute("mod_address_cookieSuggest");
		$ref.suggest=[];
		if (s_cookie){
			$ref.suggest=s_cookie.match(/[^@]+@/gi);
			if (s_hot)
				$ref.suggest._push(s_hot.match(/[^@]+@/gi));
		}
		else if (s_hot)
			$ref.suggest=s_hot.match(/[^@]+@/gi);
		if ($ref.suggest.length>12)
			$ref.suggest=$ref.suggest.slice(0,12);
		$ref.source=obj.getAttribute("mod_address_source")||"default";
		if (!$$.module.address.source[$ref.source]){
			$$.module.address.source[$ref.source]="@@";
			if ($$.module.address.sourceMap[$ref.source])
				$loadJs($$.module.address.sourceMap[$ref.source][0].replace(/\{\$charset\}/gi,$$.status.charset),($$.module.address.sourceMap[$ref.source][1]||"").replace(/\{\$charset\}/gi,$$.status.charset)||$$.status.charset);
			else
				$loadJs("http://webresource.ctrip.com/code/js/resource/address_tuna/"+$ref.source+"_"+$$.status.charset+".js",$$.status.charset);
		}
		$ref.auto=obj.getAttribute("mod_address_auto");
		$ref.auto=$ref.auto&&$ref.auto.match(/^(false|0)$/i)?false:true;
		$ref.redraw=function(){
			if (clock)
				_m_change();
		};
		$ref.hook={};
		(obj.getAttribute("mod_address_hook")||"").replace(/(on)?([^;:]+):([^;]+)/gi,function(a,b,c,d){
			$ref.hook[c.toLowerCase()]=owin[d];
		});
		function _m_focus(){
			if (show){
				show=0;
				return;
			}
			setPosFlag=false;
			u.style.display=cue.style.display=p[0].style.display="none";
			function _m_click(i){
				li[i].onmousedown=function(e){
					_m_mousedown(i);
					$stopEvent(e);
					if(li[i].outerHTML) li[i].outerHTML = li[i].outerHTML + ' ';
					obj.blur();
				};
			}
			div.onmousedown=function(){show=1;};
			for (var i=0;i<li.length;i++)
				new _m_click(i);
			pp.onmousedown=pn.onmousedown=_m_p_click;
			for (var i=1;i<p.length;i++)
				p[i].onmousedown=_m_p_click;
			lastvalue=null;
			if (lastselect!==null)
				li[lastselect].className="address_selected";
			if ($ref.hook["focus"])
				$ref.hook["focus"](obj);
			setTimeout(_m_change,0);
			clock=setInterval(_m_change,150);
		}
		function _m_p_click(e){
			show=1;
			if (e) $stopEvent(e);
			switch (this){
				case pp:_m_list.m_get(_m_list.page-1);break;
				case pn:_m_list.m_get(_m_list.page+1);break;
				default:_m_list.m_get(parseInt(this.firstChild.nodeValue));
			}
		}
		var _m_list=new function(){
			var list;
			this.page=1;
			this.pagelist;
			this.maxpage=1;
			this.m_get=function(_t_page){
				if (!list||!_t_page||_t_page<1||_t_page>this.maxpage) return null;
				this.page=_t_page;
				this.pagelist=list.slice((_t_page-1)*12,Math.min(_t_page*12,list.length));
				for (var i=0;i<li.length;i++){
					if (i<this.pagelist.length){
						li[i].style.display="block";
						var _t_data=this.pagelist[i].replace(/@/g,"").split("|");
						li[i].lastChild.nodeValue=_t_data[1];
						li[i].firstChild.firstChild.nodeValue=_t_data[0];
						data[i]=_t_data;
					}
					else{
						li[i].style.display="none";
						data[i]=null;
					}
				}
				if (lastselect!==null){
					if (lastselect>=this.pagelist.length){
						li[lastselect].className="";
						lastselect=this.pagelist.length-1;
						li[lastselect].className="address_selected";
					}
				}
				else{
					lastselect=0;
					li[0].className="address_selected";
				}
				_m_showpage.call(this);
				u.style.display=cue.style.display="";
				if (!setPosFlag){
					div.style.display="";
					var pos=obj.$getPos();
					if (div.offsetWidth+pos[0]>___.offsetWidth)
						div.$setPos(obj,"tr","br");
					else
						div.$setPos(obj);
					div.$setIframe();
					setPosFlag=true;
				}
				_m_resize.call(this);
			};
			this.m_set=function(_t_list){
				list=_t_list;
				this.maxpage=Math.ceil(_t_list.length/12);
				this.page=1;
				this.m_get(1);
			};
			function _m_showpage(){
				var st=this.maxpage<6||this.page<3?1:this.page>this.maxpage-2?this.maxpage-4:this.page-2;
				var ed=Math.min(st+4,this.maxpage);
				var obj;
				pp.style.display=this.page==1?"none":"";
				pn.style.display=this.page==this.maxpage?"none":"";
				for (var i=st;i<st+5;i++){
					obj=p[i-st+1];
					if (i<=ed){
						obj.firstChild.nodeValue=i;
						obj.className=i==this.page?"address_current":"";
						obj.style.display="";
					}
					else
						obj.style.display="none";
				}
				p[0].style.display=this.maxpage>1?"block":"none";
			}
		};
		function _m_resize(){
			with(div.style){
				width=idr.offsetWidth+"px";
				height=idr.offsetHeight+"px";
			}
			div.$setIframe();
		}
		function _m_suggest(){
			if ($ref.suggest.length==0){
				div.style.display="none";
				if (lastselect!==null){
					li[lastselect].className="";
					lastselect=null;
				}
				return;
			}
			_m_list.m_set($ref.suggest);
			cue.lastChild.nodeValue=$$.status.version.match(/^zh-/)?$$.string.address.i+(obj.module.notice?obj.module.notice.tip:$$.string.address.k)+$$.string.address.j:$$.string.address.b;
		}
		function _m_change(){
			var value=obj.value.trim();
			if (value===lastvalue) return;
			lastvalue=value;
			value=value.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi,"\\$1").replace(/@|\|/gi,"");
			if(!value){
				_m_suggest();
				_m_resize();
				return;
			}
			div.style.display="";
			var source=$$.module.address.source[$ref.source];
			var re1=new RegExp("@([^\\|@]*\\|)?"+value+"[^@]*","gi");
			var re2=new RegExp("@([^@]*\\|)?"+value+"[^@]*","gi");
			var re3=new RegExp("@[^@]*"+value+"[^@]*","gi");
			var arr1=[],arr2=[],arr3=[];
			source=source.replace(re1,function(a){
				arr1.push(a);
				return "";
			});
			if (arr1)
				arr1.sort(sortFunc);
			source=source.replace(re2,function(a){
				arr2.push(a);
				return "";
			});
			if (arr2)
				arr2.sort(sortFunc);
			source=source.replace(re3,function(a){
				arr3.push(a);
				return "";
			});
			if (arr3)
				arr3.sort(sortFunc);
			arr=arr1.concat(arr2).concat(arr3);
			if(!arr||!arr.length){
				cue.lastChild.nodeValue=$ref.auto?($$.string.address.s+($$.status.version=="en"?"":obj.value)):($$.string.address.h+obj.value+", "+$$.string.address.o);
				if (!$ref.auto){
					div.style.display="none";
					if (lastselect!==null){
						li[lastselect].className="";
						lastselect=null;
					}
				}
				if (u.style.display=="none")
					_m_suggest();
				_m_resize();
			}else{
				cue.lastChild.nodeValue=$$.string.address.h+obj.value+", "+$$.string.address.o;
				_m_list.m_set(arr);
			}
		}
		function _m_keydown(e){
			var code=e?e.keyCode:event.charCode;
			var _t_code="|"+code+"|";
			if (lastselect==null){
				if ("|13|".indexOf(_t_code)!=-1){
					$stopEvent(e,1);
					if ($ref.focusNext)
						setTimeout(function(){obj.$focusNext();},1);
				}
				return true;
			}
			if ("|13|".indexOf(_t_code)!=-1){
				$stopEvent(e,1);
				_m_mousedown(lastselect);
				obj.blur();
			}
			if ("|33|37|109|188|219|".indexOf(_t_code)!=-1){
				_m_p_click.call(pp);
				$stopEvent(e,1);
			}
			if ("|34|39|61|190|221|".indexOf(_t_code)!=-1){
				_m_p_click.call(pn);
				$stopEvent(e,1);
			}
			if ("|38|40|".indexOf(_t_code)!=-1){
				li[lastselect].className="";
				lastselect+=_m_list.pagelist.length-39+code;
				lastselect%=_m_list.pagelist.length;
				li[lastselect].className="address_selected";
				$stopEvent(e,1);
			}
		}
		function _m_mousedown(i,flag){
			show=2;
			obj.value=data[i][1]||data[i][0];
			if ($ref.reference)
				$ref.reference.value=data[i][2];
			if (cookie)
				cookie.value=data.join("|");
			if ($ref.hook["change"])
				$ref.hook["change"](obj);
			if (flag!==false&&$ref.focusNext)
				setTimeout(function(){obj.$focusNext();},1);
		}
		function _m_blur(){
			if(show==1){
				setTimeout(function(){obj.focus()},1);
				return;
			}
			clearInterval(clock);
			clock=null;
			div.$clearIframe();
			div.style.display="none";
			if (lastselect!==null){
				if (obj.value&&show!=2){
					if ($ref.auto)
						_m_mousedown(lastselect,false);
					else
						$ref.check();
				}
				li[lastselect].className="";
				lastselect=null;
			}
			show=0;
			div.onmousedown=null;
		}
		$ref.check=function(){
			var value=obj.value.trim();
			if (obj.isNull&&obj.isNull())
				value="";
			//if (value===lastvalue) return;
			var arr;
			lastvalue=value;
			value=value.replace(/([\(\)\\\[\]\.\+\?\*\|\^\$])/gi,"\\$1").replace(/@|\|/gi,"");
			if(value){
				var source=$$.module.address.source[$ref.source];
				var re1=$ref.auto?new RegExp("@([^\\|@]*\\|)?"+value+"[^@]*","gi"):new RegExp("@([^\\|@]*\\|)?"+value+"(\\|[^@]*)?(?=@)","gi");
				var re2=$ref.auto?new RegExp("@([^@]*\\|)?"+value+"[^@]*","gi"):new RegExp("@([^@]*\\|)?"+value+"(\\|[^@]*)?(?=@)","gi");
				var re3=new RegExp("@[^@]*"+value+"[^@]*","gi");
				var arr1=[],arr2=[],arr3=[];
				source=source.replace(re1,function(a){
					arr1.push(a);
					return "";
				});
				if (arr1)
					arr1.sort(sortFunc);
				source=source.replace(re2,function(a){
					arr2.push(a);
					return "";
				});
				if (arr2)
					arr2.sort(sortFunc);
				if ($ref.auto){
					source=source.replace(re3,function(a){
						arr3.push(a);
						return "";
					});
					if (arr3)
						arr3.sort(sortFunc);
				}
				arr=arr1.concat(arr2).concat(arr3);
				if (arr&&arr.length){
					setPosFlag=true;
					_m_list.m_set(arr);
					setPosFlag=false;
					_m_mousedown(0,false);
					show=0;
				}
			}
			if (obj.module.notice)
				obj.module.notice.check();
			return !!arr;
		};
		obj.$r("onfocus",_m_focus);
		obj.blur();
		obj.$r("onblur",_m_blur);
		obj.$r("onkeydown",_m_keydown);
		if ($ref.hook["load"])
			$ref.hook["load"](obj);
	}
})();

//日历选择器模块
$$.string.calendar={
	"zh-cn":{
		a:"年",
		b:"月"
	},
	"zh-tw":{
		a:"年",
		b:"月"
	},
	"en":{
		a:"",
		b:"Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec"
	}
}[$$.status.version];

(function(){
	function calendarInit(){
		var divTmp=$c("div");
		with (divTmp.style){
			width="0px";
			height="0px";
		}
		divTmp.innerHTML="<div id=\"tuna_calendar\" style=\"display:none;position:absolute;z-index:120;overflow:hidden;\"><table id=\"calendar_month1\" cellpadding=\"0\" cellspacing=\"0\"><thead><tr><th colspan=\"7\" class=\"calendar_title01\"><span id=\"calendar_lastmonth\">&lt;--<\/span><div id=\"calendar_title1\">2007年8月<\/div><\/th><\/tr><\/thead><tr><th class=\"day0\">日<\/th><th>一<\/th><th>二<\/th><th>三<\/th><th>四<\/th><th>五<\/th><th class=\"day6\">六<\/th><\/tr><tr><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"over_day\">1<\/a><\/td><td><a href=\"###\" class=\"over_day\">2<\/a><\/td><td><a href=\"###\" class=\"over_day\">3<\/a><\/td><td><a href=\"###\" class=\"over_day\">4<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"over_day\">5<\/a><\/td><td><a href=\"###\" class=\"over_day\">6<\/a><\/td><td><a href=\"###\" class=\"over_day\">7<\/a><\/td><td><a href=\"###\" class=\"over_day\">8<\/a><\/td><td><a href=\"###\" class=\"over_day\">9<\/a><\/td><td><a href=\"###\" class=\"over_day\">10<\/a><\/td><td><a href=\"###\" class=\"over_day\">11<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"over_day\">12<\/a><\/td><td><a href=\"###\" class=\"over_day\">13<\/a><\/td><td><a href=\"###\" class=\"over_day\">14<\/a><\/td><td><a href=\"###\" class=\"over_day\">15<\/a><\/td><td><a href=\"###\" class=\"over_day\">16<\/a><\/td><td><a href=\"###\" class=\"over_day\">17<\/a><\/td><td><a href=\"###\" class=\"selected_day\">18<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"cue_day\">19<\/a><\/td><td><a href=\"###\" class=\"cue_day\">20<\/a><\/td><td><a href=\"###\" class=\"current_day\">21<\/a><\/td><td><a href=\"###\" class=\"enable_day\">22<\/a><\/td><td><a href=\"###\" class=\"enable_day\">23<\/a><\/td><td><a href=\"###\" class=\"enable_day\">24<\/a><\/td><td><a href=\"###\" class=\"enable_day\">25<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">26<\/a><\/td><td><a href=\"###\" class=\"limit_day\">27<\/a><\/td><td><a href=\"###\" class=\"enable_day\">28<\/a><\/td><td><a href=\"###\" class=\"enable_day\">29<\/a><\/td><td><a href=\"###\" class=\"enable_day\">30<\/a><\/td><td><a href=\"###\" class=\"enable_day\">31<\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><\/tr><\/table><table id=\"calendar_month2\" cellpadding=\"0\" cellspacing=\"0\"><thead><tr><th colspan=\"7\" class=\"calendar_title02\"><span id=\"calendar_nextmonth\">--&gt;<\/span><div id=\"calendar_title2\">2007年9月<\/div><\/th><\/tr><\/thead><tr><th class=\"day0\">日<\/th><th>一<\/th><th>二<\/th><th>三<\/th><th>四<\/th><th>五<\/th><th class=\"day6\">六<\/th><\/tr><tr><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"enable_day\">1<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">2<\/a><\/td><td><a href=\"###\" class=\"enable_day\">3<\/a><\/td><td><a href=\"###\" class=\"enable_day\">4<\/a><\/td><td><a href=\"###\" class=\"enable_day\">5<\/a><\/td><td><a href=\"###\" class=\"enable_day\">6<\/a><\/td><td><a href=\"###\" class=\"enable_day\">7<\/a><\/td><td><a href=\"###\" class=\"enable_day\">8<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">9<\/a><\/td><td><a href=\"###\" class=\"enable_day\">10<\/a><\/td><td><a href=\"###\" class=\"enable_day\">11<\/a><\/td><td><a href=\"###\" class=\"enable_day\">12<\/a><\/td><td><a href=\"###\" class=\"enable_day\">13<\/a><\/td><td><a href=\"###\" class=\"enable_day\">14<\/a><\/td><td><a href=\"###\" class=\"enable_day\">15<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">16<\/a><\/td><td><a href=\"###\" class=\"enable_day\">17<\/a><\/td><td><a href=\"###\" class=\"enable_day\">18<\/a><\/td><td><a href=\"###\" class=\"enable_day\">19<\/a><\/td><td><a href=\"###\" class=\"enable_day\">20<\/a><\/td><td><a href=\"###\" class=\"enable_day\">21<\/a><\/td><td><a href=\"###\" class=\"enable_day\">22<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">23<\/a><\/td><td><a href=\"###\" class=\"enable_day\">24<\/a><\/td><td><a href=\"###\" class=\"enable_day\">25<\/a><\/td><td><a href=\"###\" class=\"enable_day\">26<\/a><\/td><td><a href=\"###\" class=\"enable_day\">27<\/a><\/td><td><a href=\"###\" class=\"enable_day\">28<\/a><\/td><td><a href=\"###\" class=\"enable_day\">29<\/a><\/td><\/tr><tr><td><a href=\"###\" class=\"enable_day\">30<\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><td><a href=\"###\" class=\"blank_day\"><\/a><\/td><\/tr><\/table><\/div>";
		$("jsContainer").appendChild(divTmp);
		_v_div=$("tuna_calendar");
		_v_select,_v_lastobj;
		_v_today=$$.status.today.isDateTime()||new Date();
		_v_mm1=$("calendar_title1"),_v_mm2=$("calendar_title2");
		_v_mt1=$("calendar_month1"),_v_mt2=$("calendar_month2");
		_v_th=_v_div.getElementsByTagName("th");
		for (var i=0;i<_v_th.length;i++)
			if (i%8>0) _v_th[i].firstChild.nodeValue=$$.string.weekday.charAt(i%8-1);
	}
	var _v_div,_v_select,_v_lastobj,_v_today,_v_mm1,_v_mm2,_v_mt1,_v_mt2,_v_th;

	Ctrip.module.calendar=function(_v_obj){
		if (!_v_div)
			calendarInit();
		var _v_show=0,_v_draw=1;
		var $ref=_v_obj.module.calendar={};
		_v_obj.setAttribute("autoComplete","off");
		$r("beforeunload",function(){
			_v_obj.setAttribute("autoComplete","on");
		});
		_v_obj.value=_v_obj.value||_v_obj.getAttribute("value")||"";
		$ref.focusNext=_v_obj.getAttribute("mod_calendar_focusNext");
		$ref.focusNext=$ref.focusNext&&$ref.focusNext.match(/^(1|true)$/i);
		$ref.rangeStart=_v_obj.getAttribute("mod_calendar_rangeStart");
		if ($ref.rangeStart=="#")
			$ref.rangeStart=$$.status.today;
		$ref.rangeStart=$ref.rangeStart?$ref.rangeStart.isDateTime():null;
		$ref.rangeEnd=_v_obj.getAttribute("mod_calendar_rangeEnd");
		if ($ref.rangeEnd=="#")
			$ref.rangeEnd=$$.status.today;
		$ref.rangeEnd=$ref.rangeEnd?$ref.rangeEnd.isDateTime():null;
		$ref.rangeException=_v_obj.getAttribute("mod_calendar_rangeException");
		$ref.rangeException=$ref.rangeException?$ref.rangeException.replace(/-0?/gi,"-").split("|"):null;
		$ref.permit=_v_obj.getAttribute("mod_calendar_permit");
		$ref.permit=$ref.permit?$ref.permit.replace(/-0?/gi,"-").split("|"):null;
		$ref.weekday=_v_obj.getAttribute("mod_calendar_weekday")||"1234567";
		$ref.prohibit=_v_obj.getAttribute("mod_calendar_prohibit");
		$ref.prohibit=$ref.prohibit?$ref.prohibit.replace(/-0?/gi,"-").split("|"):null;
		$ref.reference=_v_obj.getAttribute("mod_calendar_reference");
		$ref.reference=$ref.reference?_v_obj.$getWin().$($ref.reference):null;
		$ref.redraw=function(){_v_draw=1;};
		$ref.check=function(flag){
			var str=(_v_obj.isNull&&_v_obj.isNull()?"":_v_obj.value).trim();
			if (!str)
				return arguments.length?flag:false;
			var date=(str.parseStdDate()||"").isDateTime();
			if (!date)
				return false;
			var dateStr=date.toStdString();
			if ($ref.rangeStart&&date<$ref.rangeStart||$ref.rangeEnd&&date>$ref.rangeEnd)
				return false;
			return ("|"+($ref.rangeException||[]).join("|")+"|").indexOf("|"+dateStr+"|")==-1
				&&("|"+($ref.prohibit||[]).join("|")+"|").indexOf("|"+dateStr+"|")==-1
				&&$ref.weekday.indexOf(date.getDay()||"7")!=-1
				||("|"+($ref.permit||[]).join("|")+"|").indexOf("|"+dateStr+"|")!=-1;
		};
		$ref.hook={};
		(_v_obj.getAttribute("mod_calendar_hook")||"").replace(/(on)?([^;:]+):([^;]+)/gi,function(a,b,c,d){
			$ref.hook[c.toLowerCase()]=_[d];
		});
		function _m_focus(){
			if (_v_obj==_v_lastobj&&!_v_draw){
				_v_div.style.display="";
				_v_div.$setIframe();
				if (_v_select) _v_select.className=_v_select.className.replace(/selected_day/gi,"");
				var dateTmp=_v_obj.value.isDateTime();
				_v_select=null;
				if (dateTmp) _v_select=$("d_"+dateTmp.toStdString());
				if (_v_select) _v_select.className+=" selected_day";
				return;
			}
			if (_v_obj.module.notice){
				_v_obj.module.notice.enabled=false;
				_v_obj.style.color="";
				if (_v_obj.value==_v_obj.module.notice.tip)
					_v_obj.value="";
			}
			_v_draw=0;
			_v_lastobj=_v_obj;
			_v_div.style.display="";
			$("calendar_lastmonth").onmousedown=$("calendar_nextmonth").onmousedown=function(){
				_v_draw=0;
				$ref.currentDate=new Date($ref.currentDate.getFullYear(),$ref.currentDate.getMonth()+(/last/.test(this.id)?-2:2),1);
				_m_show();
			};
			var pos=_v_obj.$getPos();
			if (_v_div.offsetWidth+pos[0]>___.offsetWidth)
				_v_div.$setPos(_v_obj,"tr","br");
			else
				_v_div.$setPos(_v_obj);
			_v_div.$setIframe();
			///////
			$ref.currentDate=((_v_obj.isNull&&_v_obj.isNull()?"":_v_obj.value).trim().parseStdDate()||"").isDateTime();
			if (!$ref.currentDate){
				$ref.currentDate=$ref.rangeStart||new Date();
				if ($ref.reference){
					var refDate=($ref.reference.isNull()?"":$ref.reference.value).isDateTime();
					if (refDate>$ref.currentDate)
						$ref.currentDate=refDate;
				}
				while (true){
					var dateStr=$ref.currentDate.toStdString();
					if (("|"+($ref.rangeException||[]).join("|")+"|").indexOf("|"+dateStr+"|")==-1
						&&("|"+($ref.prohibit||[]).join("|")+"|").indexOf("|"+dateStr+"|")==-1
						&&$ref.weekday.indexOf($ref.currentDate.getDay()||"7")!=-1
						||("|"+($ref.permit||[]).join("|")+"|").indexOf("|"+dateStr+"|")!=-1){
							break;
					}
					if (!$ref.rangeEnd||$ref.rangeEnd&&$ref.currentDate<$ref.rangeEnd)
						$ref.currentDate=$ref.currentDate.addDate(1);
					else{
						$ref.currentDate=new Date();
						break;
					}
				}
			}
			$ref.currentDate=new Date($ref.currentDate.getFullYear(),$ref.currentDate.getMonth(),1);
			///////
			_m_show();
			_v_div.onmousedown=function(){_v_show=1;};
		}
		function _m_bulid(_v_year,_v_month,_v_table){
			function _m_query(_v_obj,_v_date,_v_class,_v_flag){
				var _v_day=_v_date?_v_date.getDate():"",_v_id=_v_day?"d_"+_v_year+"-"+(_v_month+1)+"-"+_v_day:"",_t_weekday=_v_flag&&_v_date?($ref.weekday.indexOf(_v_date.getDay()||7)!=-1):1;
				_v_obj=_v_obj.firstChild;
				if (_v_obj.lastChild)
					_v_obj.lastChild.nodeValue=_v_day;
				else
					_v_obj.appendChild(__.createTextNode(_v_day));
				_v_obj.date=_v_date;
				_v_obj.id=_v_id;
				_v_obj.className=_t_weekday?_v_class:"limit_day";
				_v_obj.onmousedown=_v_flag&&_t_weekday?_m_mousedown:null;
				if (_v_obj.replaceNode){
					_v_obj.bak=null;
					_v_obj.bak=_v_obj.cloneNode(true);
				}
			}
			var _v_td=_v_table.getElementsByTagName("td");
			_v_table.rows[1].className=_v_year==_v_today.getFullYear()&&_v_month==_v_today.getMonth()?"currentmonth01":"";
			var _v_firstday=new Date(_v_year,_v_month,1),_v_lastday=new Date(_v_year,_v_month+1,0),_v_day=_v_lastday.getDate(),_v_week=_v_firstday.getDay(),_t_date,_t_value,_t_ref,_t_flag;
			for (var i=0;i<_v_week;i++)
				_m_query(_v_td[i],null,"blank_day",0);
			_t_ref=$ref.reference&&$ref.reference.value.isDateTime();
			for (var i=0;i<_v_day;i++){
				_t_date=new Date(_v_year,_v_month,i+1);
				_t_flag=(!$ref.rangeStart||_t_date>=$ref.rangeStart)&&(!$ref.rangeEnd||_t_date<=$ref.rangeEnd);
				_m_query(_v_td[i+_v_week],_t_date,_t_flag?(_t_ref&&_t_date<=_t_ref?"cue_day":"enable_day"):"over_day",_t_flag);
			}
			for (var i=_v_day+_v_week;i<42;i++)
				_m_query(_v_td[i],null,"blank_day",0);
		}
		function _m_show(){
			var _t_date=new Date($ref.currentDate.getFullYear(),$ref.currentDate.getMonth()+1,1),_t_obj;
			var _v_date_y=$ref.currentDate.getFullYear(),_v_date_m=$ref.currentDate.getMonth();
			var _t_date_y=_t_date.getFullYear(),_t_date_m=_t_date.getMonth();
			_v_mm1.innerHTML=$$.status.version.match(/^zh-/)?(_v_date_y+$$.string.calendar.a+(_v_date_m+1)+$$.string.calendar.b):($$.string.calendar.b.split("|")[_v_date_m]+" "+_v_date_y);
			_v_mm2.innerHTML=$$.status.version.match(/^zh-/)?(_t_date_y+$$.string.calendar.a+(_t_date_m+1)+$$.string.calendar.b):($$.string.calendar.b.split("|")[_t_date_m]+" "+_t_date_y);
			_m_bulid(_v_date_y,_v_date_m,_v_mt1);
			_m_bulid(_t_date_y,_t_date_m,_v_mt2);
			if ($ref.rangeException)
				for (var i=0;i<$ref.rangeException.length;i++)
					if (_t_obj=$("d_"+$ref.rangeException[i])){
						_t_obj.className="over_day";
						_t_obj.onmousedown=null;
					}
			if ($ref.permit)
				for (var i=0;i<$ref.permit.length;i++)
					if (_t_obj=$("d_"+$ref.permit[i])){
						_t_obj.className="enable_day";
						_t_obj.onmousedown=_m_mousedown;
					}
			if ($ref.prohibit)
				for (var i=0;i<$ref.prohibit.length;i++)
					if (_t_obj=$("d_"+$ref.prohibit[i])){
						_t_obj.className="limit_day";
						_t_obj.onmousedown=null;
					}
			if (_t_obj=$("d_"+_v_today.getFullYear()+"-"+(_v_today.getMonth()+1)+"-"+_v_today.getDate())) _t_obj.className+=" current_day";
			if (_v_select) _v_select.className=_v_select.className.replace(/selected_day/gi,"");
			if (_t_obj=$("d_"+_v_obj.value.parseStdDate())){
				_t_obj.className+=" selected_day";
				_v_select=_t_obj;
			}
			_v_div.$setIframe();
		}
		function _m_mousedown(e){
			_v_obj.value=$$.status.version.match(/^zh-/)?(this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+this.date.getDate()):($$.string.calendar.b.split("|")[this.date.getMonth()]+"-"+this.date.getDate()+"-"+this.date.getFullYear());
			_v_draw=1;
			if(this.outerHTML) this.outerHTML=this.outerHTML+' ';
			if ($ref.hook["change"])
				$ref.hook["change"](_v_obj);
			_v_obj.blur();
			$stopEvent(e);
			if ($ref.focusNext)
				setTimeout(function(){_v_obj.$focusNext();},10);
		}
		function _m_blur(){
			if(_v_show==1){
				_v_show=0;
				setTimeout(function(){_v_obj.focus()},0);
				return true;
			}
			_v_div.style.display="none";
			_v_div.$clearIframe();
			if (_v_obj.module.notice)
				_v_obj.module.notice.enabled=true;
		}
		_v_obj.$r("focus",_m_focus);
		_v_obj.$r("blur",_m_blur);
	}
})();

//初始化
(function(){
	//测算代码
	var d = __.domain.match(/ctrip(travel)?\.com$/);
	if(d){
		_.__uidc_init = new Date * 1;
		__.write("<script src=\"http:\/\/www." + (d[1] ? 'dev.sh.' + d[0] : d[0]) + "\/rp\/uiScript.asp\"><\/script>");
	}

	//简繁转换函数
	if(_.$$.status.charset=='big5')
		__.write("<script src=\"http:\/\/webresource.ctrip.com\/code\/js\/public\/public_s2t.js\" charset=\"utf-8\"><\/script>");
	else
		_.$s2t=function(s){return s};

	//修正IE6背景图不缓存
	if ($$.browser.IE6)
		try{__.execCommand("BackgroundImageCache",false,true);}catch(e){;};

	//初始化debug
	$$.status.debug=/\$debug\$/i.test($topWin.name)||/^(true|1)$/.test($getQuery("debug"));
	$$.status.debugEvent=/\$debugEvent\$/i.test($topWin.name)||/^(true|1)$/.test($getQuery("debugEvent"));

	//初始化$alert函数
	$$.status.alertDiv.innerHTML=$$.status.version.match(/^zh-/)?"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"base_popwindow01\"><tr><td class=\"base_poptl\"><\/td><td class=\"base_poptc\"><div><\/div><\/td><td class=\"base_poptr\"><\/td><\/tr><tr><td class=\"base_popml\"><\/td><td id=\"alertInfo\" class=\"base_popmc\">内容<\/td><td class=\"base_popmr\"><\/td><\/tr><tr><td class=\"base_popbl\"><\/td><td class=\"base_popbc\"><div><\/div><\/td><td class=\"base_popbr\"><\/td><\/tr><\/table>":"<table id=\"alertTable\" style=\"font-family:Arial;margin:0;\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"margin:0;padding:0px 2px 2px 0px;background:#E7E7E7;\"><div id=\"alertInfo\" style=\"margin:0px;padding:10px;font-size:12px;text-align:left;background:#FFFFE8;border:1px solid #FFDF47;color:#000;white-space:nowrap;\">内容<\/div><\/td><\/tr><\/table>";

	//初始化domReady事件
	function evtDomReady(e){
		function execEvent(){
			if ($$.status.domReady)
				return;
			var eventInfo;
			$$.status.domReady=true;
			if ("domready" in _.module.event){
				while (eventInfo=_.module.event["domready"].shift())
					if (eventInfo.enabled)
						try{eventInfo.func(e);}catch(e){
							$t("domReady函数错误:"+eventInfo.func.toString().slice(0,100)+"...","red",eventInfo.func);
							$trackEvent('tuna-error', 'evtDomReady.execEvent',$error(e), $tunaVersion());
						};
			}
		}
		if ($$.browser.Safari||$$.browser.Opera)
			setTimeout(execEvent,1);
		else
			execEvent();
	}

	//注册domReady事件
	if($$.browser.Moz)
		__.addEventListener("DOMContentLoaded",evtDomReady,false);
	else if($$.browser.IE){
		try{
			if (!_.frameElement)
				(function (){
					try {
						___.doScroll("left");
					}catch (e){
						setTimeout(arguments.callee,50);
						return;
					}
					evtDomReady();
				})();
		}catch(e){;};
	}else if($$.browser.Safari){
		var domReadyTimer=setInterval(function(){
			if(__.readyState=="loaded"||__.readyState=="complete"){
				clearInterval(domReadyTimer);
				evtDomReady();
			}
		},10); 
	}

	//加载页面变量
	function loadPageValue(){
		var str=$$.status.saveStatus.value;
		if (str)
			$$.status.back=true;
		$$.status.pageValue=$fromJson(str||"{}");
		if (!("data" in $$.status.pageValue))
			$$.status.pageValue.data={};
		if (!$$.browser.Opera)
			$r("beforeunload",[$saveHistory,$savePageValue],90);
	}

	//加载History
	function loadHistory(){
		($$.status.pageValue["historyInfo"]||"").split("|").each(function(info){
			var arr=unescape(info).split("|");
			if (arr.length==5){
				for (var i=0;i<arr.length;i++)
					arr[i]=unescape(arr[i]);
				$$.history.info[arr[0]]=arr.slice(1);
				$t("[history]恢复历史:"+arr[1]+"/"+arr[2],"green",arr.slice(2).join("\r"));
			}
		});
		$$.history.count=parseInt($$.status.pageValue["historyCount"]||0,10)||0;
	}

	$r("domReady",function(){
		$(__.body);
		loadPageValue();
		loadHistory();
		var url=$$.status.pageValue["lastHistory"];
		if (url)
			if ($$.browser.IE||$$.browser.Opera){
				$r("load",function(){
					setTimeout(function(){
						$$.history.init();
					},1);
				});
			}else
				$$.history.init();
	},10);
	$r("domready",[$parserRe,$fixElement,function(){
		try{__.body.focus();}catch(e){;};
	}]);
	$r("load",[evtDomReady,function(){
		$$.status.load=true;
	}]);
})();

//蒙板
var maskShow=(function(){
	var mask=null;
	var curr=null;
	var free=false;
	var func={
		onresize:null,
		onscroll:null
	};
	return function(el, fre){
		if(!mask)
			initMask();
		free=!!fre;
		if(!el){
			show(curr,false);
			show(mask,false);
			showSelects(true);//for ie6
			curr=null;
			if(!free) for(var s in func){
				window[s]=func[s];
				func[s]=null;
			}
		}else{
			if(curr)
				show(curr,false);
			curr=el;
			checkVisib(curr);
			rePos();
			mask.style.zIndex = maskShow.zIndexBack || 15;
			curr.style.zIndex = maskShow.zIndexFore || 20;
			show(curr,true);
			show(mask,true);
			showSelects(false, el);//for ie6
			if(!free) for(var s in func){
				func[s]=window[s];
				window[s]=rePos;
			}
		}
	};
	function showSelects(b, box){
		if(!$$.browser.IE6) return;
		var sel=document.getElementsByTagName('select');
		var vis=b?'visible':'hidden';
		for(var i=0;i<sel.length;i++){
			if((b || !childOf(sel[i], box)) && sel[i].currentStyle.visibility != vis) sel[i].style.visibility=vis;
		}
	}
	function childOf(a, b){
		while(a && a != b) a = a.parentNode;
		return a == b;
	}
	function initMask(){
		/*
		mask=document.createElement('iframe');
		mask.src='://0';
		*/
		mask=document.createElement('div');
		mask.style.cssText='background-color:{$c};border:none;position:absolute;visibility:hidden;opacity:{$a};filter:alpha(opacity={$A})'.replaceWith({
			c: maskShow.bgColor || '#fff',
			a: maskShow.bgAlpha || '0.7',
			A: maskShow.bgAlpha ? parseInt(maskShow.bgAlpha * 100) : '70'
		});
		document.body.appendChild(mask);
		maskShow.mask = mask;
	}
	function checkVisib(el){
		var sty=el.style;
		sty.position='absolute';
		sty.left = '-10000px';
		sty.top = '-10000px';
		sty.visibility='visible';
		sty.display='block';
		sty.zIndex=10;
	}
	function rePos(){
		if(!curr) return;
		var ps = $pageSize('doc');
		setRect(mask, ps);
		var rc = centerPos(ps, curr.offsetWidth, curr.offsetHeight);
		if(rc.left < ps.scrollLeft) rc.left = ps.scrollLeft;
		if(rc.top < ps.scrollTop) rc.top = ps.scrollTop;
		setRect(curr, rc);
	}
	function centerPos(ps, cw, ch){
		return {
			left: ((ps.winWidth - cw) >> 1) + ps.scrollLeft + (maskShow.adjustX || 0),
			top: ((ps.winHeight - ch) >> 1) + ps.scrollTop + (maskShow.adjustY || 0)
		};
	}
	function setRect(el,rect){
		var sty=el.style;
		sty.left=(rect.left||0)+'px';
		sty.top=(rect.top||0)+'px';
		if('width' in rect)
			sty.width=rect.width+'px';
		if('height' in rect)
			sty.height=rect.height+'px';
	}
	function show(el,b){
		if(!el) return;
		el.style.visibility = 'visible';
		if(!b){
			el.style.left = -el.offsetWidth - 100 + 'px';
			el.style.top = -el.offsetHeight - 100 + 'px';
		}
	}
})();

//显示切换广告
$$.module.adpic={source:{}};
Ctrip.module.adpic=function(obj){
	var link=$(obj.getAttribute("mod_adpic_link")||"");
	var picContainer=$(obj.getAttribute("mod_adpic_container")||"")||obj;
	var btnContainer=$(obj.getAttribute("mod_adpic_button")||"");
	if (link){
		var source=obj.getAttribute("mod_adpic_source")||"";
		var $ref=$$.module.adpic.source[source];
		if (!$ref||!$ref.length)
			return;
	}
	var interval=parseInt(obj.getAttribute("mod_adpic_interval")||"")||5000;
	var step=$$.browser.IE?25:5;
	//初始化图片
	var linkList=[];
	if (link){
		link.style.display="none";
		for (var i=0;i<$ref.length;i++){
			var tmpLink=link.cloneNode(true);
			tmpLink.style.backgroundImage="url(\'"+$ref[i].src+"\')";
			tmpLink.href=$ref[i].href||"javascript:void(0);";
			tmpLink.style.cursor=/^(|###|javascript:;?|javascript:void\(0\);?)$/i.test($ref[i].href)?"default":"pointer";
			tmpLink.title=$ref[i].title;
			link.parentNode.insertBefore(tmpLink,link);
			linkList.push(tmpLink);
		}
	}else{
		var linkListTmp=picContainer.$("a");
		for (var i=0;i<linkListTmp.length;i++){
			linkListTmp[i].style.display="none";
			linkList.push(linkListTmp[i]);
		}
		link=$c("a");
		link.style.display="none";
		picContainer.appendChild(link);
	}
	if (!linkList.length)
		return;
	function goAdFunc(i){
		return function(){
			goAd(i);
		};
	}
	if (btnContainer){
		btnContainer.innerHTML="";
		var btnList=[];
		for (var i=0;i<linkList.length;i++){
			var btnTmp=$c("li");
			if (!i)
				btnTmp.className="pic_current";
			btnTmp.innerHTML=i+1;
			btnList.push(btnTmp);
			btnContainer.appendChild(btnTmp);
			btnTmp.$r("click",goAdFunc(i));
		}
	}
	var clock,running=false,current=0,next=0,target=null;
	if ($$.browser.IE){
		obj.style.position="relative";
		obj.style.filter="progid:DXImageTransform.Microsoft.Fade(duration=1)";
	}
	linkList[current].style.display="";
	function goAd(i){
		if (i!==null){
			if (i==next)
				return;
			else
				target=i;
		}
		clearTimeout(clock);
		if (running)
			return;
		running=true;
		current=next;
		next=(next+1)%linkList.length;
		if (target!==null)
			next=target;
		target=null;
		link.parentNode.insertBefore(linkList[current],link);
		linkList[current].style.position="relative";
		linkList[next].style.position="absolute";
		linkList[next].style.display="";
		btnList[current].className="";
		btnList[next].className="pic_current";
		function transComplete(){
			linkList[current].style.display="none";
			linkList[current].style.filter="";
			running=false;
			clock=setTimeout(function(){
				goAd(null);
			},target===null?interval:200);
		}
		if ($$.browser.IE){
			obj.filters[0].apply();
			linkList[current].style.display="none";
			obj.filters[0].play();
			transComplete();
		}else{
			var alpha=100;
			var iClock=setInterval(function(){
				alpha=Math.max(alpha-step,0);
				linkList[current].style.opacity=alpha/100;
				linkList[current].style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
				if (!alpha){
					clearInterval(iClock);
					linkList[current].style.opacity=100;
					transComplete();
				}
			},20);
		}
	}
	clock=setTimeout(function(){
		goAd(null);
	},interval);
};

//loading效果
$$.module.loading = {
	source: null, //'http://prototype.ui.sh.ctriptravel.com/code_beta/cn/loading/pic_ad.gif|###|hello world',
	backto: null,
	preload: function(d){
		if(d && $type(d) == 'number') this._preload = d;
		this._init.bind(this).delay(this._preload);
	},
	show: function(){
		if(this._visible) return;
		if(!this._panel) this._init();
		if(!this._panel) return;
		this._tmpcolor = maskShow.bgColor;
		this._button.href = this.backto || 'javascript:$$.module.loading.hide()';
		maskShow.bgColor = this._bgcolor;
		maskShow.bgColor = '#666';
		maskShow(this._panel);
		this._roll();
		this._visible = true;
	},
	hide: function(){
		if (_.ActiveXObject) __.execCommand('Stop'); 
		else if(_.stop) _.stop();
		maskShow(null);
		if(this._tmpcolor) maskShow.bgColor = this._tmpcolor;
		clearInterval(this._timer);
		this._visible = false;
	},
	wireup: function(form){
		if(this._wired || !form) return;
		var time_point = 0;
		_.$(form).$r('submit', function(){
			time_point = new Date();
			alert(0);
		}, 1);
		_.$r('beforeunload', function(){
			var d = new Date() - time_point;
			if(d > 0 && d < 1000) $$.module.loading.show();
		}, 1);
		this._wired = true;
	},
	_flag: false,
	_timer: null,
	_preload: 12000,
	_panel: null,
	_button: null,
	_color: null,
	_bgcolor: '#666',
	_visible: false,
	_wired: false,
	_template: [
		'<div style="background:#FFFFFF none repeat scroll 0%;border:1px solid #CCDCED;height:453px;">',
		'<h1 style="border-bottom:1px solid #CBDCED;height:85px;margin:0 auto;text-align:center;width:99%"><img src="http://pic.ctrip.com/common/pic_loading_logo.gif"></h1>',
		'<div style="width:120px;height:12px;overflow:hidden;margin:80px auto 20px;background-image:url(http://pic.ctrip.com/common/pic_loading_progress.gif)">&nbsp;</div>',
		'<p style="color:#cc6600;font-size:14px;font-weight:bold;text-align:center">我们正在处理您的请求，请稍候....</p>',
		'<p style="margin-top:30px"><a style="display:block;width:104px;height:30px;margin:0 auto;background:url(http://pic.ctrip.com/common/btn_loading_cancel.gif) no-repeat 0 0;text-decoration:none;" onmouseover="this.style.backgroundPosition=\'0 -30px\'" onmouseout="this.style.backgroundPosition=\'0 0\'">&nbsp;</a></p>',
		'<p><a target="_blank" href="{$link}"><img style="display:block;margin:0 auto;margin-top:20px;" title="{$title}" alt="{$title}" width="" height="" src="{$img}"></p></div>'
	].join(''),
	_init: function(){
		if(this._panel || !this.source) return;
		var a = this.source.split('@').random().split('|');
		var p = document.createElement('div');
		p.style.cssText = 'width:556px;background:#d9e6f7;border:1px solid #b1cbe4;height:455px;padding:5px;'
			+ 'position: absolute; left:-1000px; top:-1000px; z-index: 20;';
		p.innerHTML = this._template.replaceWith({img: a[0], link: a[1], title: a[2] || ''});
		$$.status.container.appendChild(p);
		this._panel = p;
		this._button = $(p).$('a')[0];
	},
	_roll: function(){
		var f = 0, t = 120, d = 20, i = 300;
		var s = $(this._panel).$('div')[1].style;
		clearInterval(this._timer);
		var x = new Date(), o = -1;
		this._timer = setInterval(function(){
			var c = (Math.floor((new Date() - x) / i) * d) % (t - f) + f;;
			if(c != o){
				o = c;
				s.backgroundPosition =  c + 'px 0';
			}
		}, 40);
	}
};
Ctrip.module.loading = function(el){
	var l = $$.module.loading;
	if(l._flag || !(l._flag = true)) return;

	var s = el.getAttribute('mod_loading_source');
	if(s) l.source = s;

	var b = el.getAttribute('mod_loading_backto');
	if(b) l.backto = b;

	var p = parseInt(el.getAttribute('mod_loading_preload'));
	if(isNaN(p)) p = null;

	var j = el.getAttribute('mod_loading_sourcescript');
	if(j) $loadJs.pass(j, null, l._init.bind(l)).delay(p || 1);
	else if(p) l.preload(p);

	var w = el.getAttribute('mod_loading_wireup');
	if(w.toLowerCase() == "true") l.wireup(el.tagName == 'FORM' ? el : (el.form || document.aspnetForm));
};