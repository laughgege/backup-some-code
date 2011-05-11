(function($w){

var 
	nv = $w.navigator,
	ua = nv.userAgent,
	pf = nv.platform,
	vd = nv.vendor,
	av = nv.appVersion,
	versionMarker
;

var platform = {
	"Win32": [pf],
	"Mac": [pf],
	"iPhone": [ua],
	"iPad": [ua],
	"Android":[ua],
	"Linux": [pf]
};

var browser = {
	"Chrome": [ua],
	"Safari": [vd, "Apple", "Version"],
	"Opera": [$w.opera, null, "Version"],
	"Firefox": [ua],
	"IE": [ua, "MSIE", "MSIE"],
	"WebKit": [ua],
	"Gecko": [ua, null, "rv"]
};

function ck(data, flag){
	var str, sStr, k;
	
	for (k in data){
		if(data.hasOwnProperty(k)){
			str = String(data[k][0]);
			sStr = data[k][1] || k;
			if(str.indexOf(sStr) >= 0){
				if(flag){
					versionMarker = data[k][2] || k;
				}
				return k;
			}
		}
	}
	return "";
}

function ckVersion( dataString ){
	var index = dataString.indexOf(versionMarker);
	if (index < 0){
		return "";
	}
	return parseFloat(dataString.substring(index + versionMarker.length + 1));
}



$w.OS = {
	name: ck(platform)
};

$w.BS = (function(){
	var name = ck(browser, true),
		version = ckVersion(ua) || ckVersion(av),

		v = {
			name: name,
			version: version || "",
			isIE: name === "IE",
			isOpera: name === "Opera",
			isChrome: name === "Chrome",
			isSafari: name === "Safari"
		};
			
		v.isWebkit = v.isChrome || v.isSafari || name === "WebKit",
		v.isFirefox = name === "Firefox",
		v.isGecko = v.isFirefox || name === "Gecko",
		v.isIE6 = v.isIE && version === 6.0
		
	return v;
})();


})(this);


(function($w){

var 
	$d = $w.document,
	head = $d.getElementsByTagName( "head" )[0] || $d.documentElement,
	empty = function(){},
	globalTimer = 0,
	scriptList = [],
	waiting = 30,
	bodyWaiting = 1
;



function L(src, callback, o){
	if(!o){ o = {} }
	this.callback = callback || empty;
	this.async = o.async || true;
	this.src = src;
	this.charset = o.charset;
	this.cached = false;
	this.loaded = false;
	this.execed = false;
}
L.prototype = {
	constructor: L,
	send: function(){
		var script = $d.createElement("script"),
			self = this;
		
		self._script = script;
		script.async = self.async;
		self.execed = true;
		
		if(self._charset){
			script.charset = self.charset;
		}
		
		script.src = self.src;
		
		script.onload = script.onreadystatechange = function(isAbort) {
			if (!script.readyState || (/loaded|complete/).test(script.readyState)) {
			
				if (script.parentNode) {
					script.parentNode.removeChild(script);
				}

				script.onload = script.onreadystatechange = null;
				self._script = script = null;

				if ( !isAbort ) {
					self.callback();
				}
				self.loaded = true;
			}
		};

		head.insertBefore( script, head.firstChild );
		console.log("exec -----"+self.src);
	},
	abort: function(){
		if(this._script){
			this._script.onload(1);
		}
	},
	cache: function(){
		if(BS.isIE || BS.isOpera){
			this._cacheByImage();
		}
		else{
			this._cacheByObject();
		}
	},
	_cacheByImage: function(){
		var img = new Image(),
			self = this;
		
		img.onload = img.onerror = function(){
			self.cached = true;
			img.onload = img.onerror = null;
		}
		img.src = self.src;
		console.log("cache -----"+self.src);
	},
	_cacheByObject: function(){
		var self = this,
			fn = arguments.callee;
		
		if(!$d.body){
			setTimeout(function(){
				fn.call(self);
			}, bodyWaiting);
			return;
		}
		
		var obj = $d.createElement('object');
		
		obj.data = self.src;
		obj.width = obj.height = 0;
		obj.onload = obj.onerror = function() {
			if(obj.parentNode){
				obj.parentNode.removeChild(obj);
			}
			
			obj.onload = obj.onerror = null;
			self.cached = true;
		};
		
		$d.body.appendChild(obj);
		console.log("cache -----"+self.src);
	}
}

function indexOfScriptList(src){
	for(var i = 0, len = scriptList.length; i < len; i++){
		if(scriptList[i].src === src){
			return i;
		}
	}
	return -1;
}

function initTimer(){
	globalTimer = setInterval(checkExec, waiting);
}

function checkExec(){
	var scr, pre, allExeced = true;
	
	for(var i = 0, len = scriptList.length; i < len; i++){
		scr = scriptList[i];
		pre = i === 0 ? null : scriptList[i - 1];
			
		if(!scr.execed){
			allExeced = false;
			
			if(scr.cached){
				if(Loader.queue && pre && !pre.loaded){
					break;
				}
				scr.send();
				break;
			}
		}
	}
	if(allExeced){
		console.log("cancel");//alert(new Date - time);
		clearInterval(globalTimer);
		globalTimer = 0;
	}
}

$w.Loader = {
	queue: true,
	scriptList: scriptList,
	load: function(src, callback, o, force){
		var self = this,
			index = indexOfScriptList(src); 
		
		if(index >= 0){
			if(!force){
				return self;
			} else {
				scriptList.splice(index, 1);
			}
		}
		
		var script = new L(src, callback, o);
			script.cache();
		
		scriptList[scriptList.length] = script;
		
		if(!globalTimer){
			initTimer();
		}
		return self;
	}
};




if (BS.isIE6){
	try{
		$d.execCommand("BackgroundImageCache", false, true);
	}catch(e){};
}


if ($d.readyState == null && $d.addEventListener){
	$d.readyState = "loading";
	$d.addEventListener("DOMContentLoaded", function(){
		$d.removeEventListener("DOMContentLoaded", arguments.callee, false);
		$d.readyState = "complete";
	},false);
}

})(this);


(function($w){
var 
	AP = Array.prototype,
	DP = Date.prototype,
	SP = String.prototype,
	FP = Function.prototype,
	toString = Object.prototype.toString,
	defaultDateFormat = "yyyy-mm-dd"
;

function getSeparator(format){
	var ary = (/[\/\-]/).exec(format);
	
	return ary ? ary[0] : null;
}

function getDaysOfMonth(year, month){
	return new Date(year, month, 0).getDate();
}

function isInteger(n){
	return parseInt(n, 10) === n;
}

function compareReturn(a, b){
	if(a === b){
		return 0;
	} else if (a > b){
		return 1;
	} else if (a < b){
		return -1;
	} else {
		return null;
	}
}

function checkDateHash(year, month, date){
	if(!isInteger(year) || !isInteger(month) || !isInteger(date) 
		|| year < 1001 || year > 2999
		|| month > 12 || month < 0
		|| date < 0 || date > getDaysOfMonth(year, month)){
		return false;
	}
	return true;
}

function walkStringInTemplate(str, container, debug){
	var ary = str.split("."),
		temp = container, key,
		i = 0, len = ary.length;
	
	for(; i < len; i++){
		key = ary[i];
		if(temp[key] == null){
			if(debug && ( i + 1 ) !== len){
				throw ary.slice(0, i + 1).join(".") + " is undefined !";
			} else {
				return null;
			}
		} else {
			temp = temp[key];
		}
	}
	
	return temp;
}

$w.DateHash = function(year, month, date, check){
	if(!check && !checkDateHash(year, month, date)){
		throw new Error("Arguments error when instantiate DateHash !");
	}
	this._y = year;
	this._m = month;
	this._d = date;
}
DateHash.getDaysOfMonth = getDaysOfMonth;

DateHash.prototype = {
	defaultFormat: "yyyy-mm-dd",
	constructor: DateHash,
	getYear: function(){
		return this._y;
	},
	getMonth: function(){
		return this._m;
	},
	getDate: function(){
		return this._d;
	},
	getDay: function(){
		return this.toDate().getDay();
	},
	setDate: function(n){
		this._d = n;
		this.autoFix();
	},
	toString: function(){
		return this.toDateString();
	},
	toDateString: function(format){
		var f = format || this.defaultFormat;
		return f.replace("yyyy", this._y)
				.replace("mm", this._m)
				.replace("dd", this._d);
	},
	toDate: function(){
		return new Date(this._y, this._m - 1, this._d);
	},
	compare: function(dateHash){
		var self = this;
		
		if(self._y === dateHash._y){
			if(self._m === dateHash._m){
				return compareReturn(self._d, dateHash._d);
			} else {
				return compareReturn(self._m, dateHash._m);
			}
		} else {
			return compareReturn(self._y, dateHash._y);
		}
	},
	addDates: function(n){
		n = parseInt(n);
		if(!n){return;}
		this._d += n;
		this.autoFix();
	},
	autoFix: function(){
		for(;;){
			
			if(this._d <= 0){
				this._m--;
				this._d += getDaysOfMonth(this._y, this._m);
			} else {
				var days = getDaysOfMonth(this._y, this._m);
				if(this._d > days){
					this._d -= days;
					this._m++;
				} else {
					break;
				}
			}
		}
		
		for(;;){
			var ms = 12;
			if(this._m <= 0){
				this._m += ms;
				this._y--;
			} else if(this._m > ms){
				this._m -= ms;
				this._y++;
			} else {
				break;
			}
		}
	}
}


DP.toDateHash = function(){
	var d = this;
	return new DateHash(d.getFullYear(), d.getMonth(), d.getDate());
}

SP.trim = function(){
	var str = this,
		whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0,len = str.length; i < len; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
SP.toRawString = function(){
	var r = ".\/+*?[]{}()^$|";
		r = r.split("").join("\\");
	
	return this.replace(new RegExp("([\\" + r + "])", "g"), "\\$1");
}
SP.toDateHash = function(format){
	format = format ? format.toLowerCase() 
			: defaultDateFormat;
	var 
		self = this,
		separator = getSeparator(format),
		fArr =  format.split(separator),
		sArr = self.split(separator),
		defaultLen = 3,
		hash = {}
	;

	if(fArr.length !== defaultLen || sArr.length !== defaultLen){
		return null;
	}
	
	for(var i = 0; i < defaultLen; i++){
		var k = fArr[i].trim(),
			v = parseInt(sArr[i]);
		if( k === "" || isNaN(v) ){
			return null;
		}
		
		hash[k] = v;
	}
	
	var 
		year = hash["yyyy"],
		month = hash["mm"],
		date = hash["dd"]
	;
	hash = null;
	
	if(!checkDateHash(year, month, date)){
		return null;
	}
	
	
	return new DateHash(year, month, date, true);
}
SP.isDateString = function(format){
	return !!this.toDateHash(format);
}
SP.sprintf = function(obj, debug){
	var temp = this == null ? "" : String(this),
		o = obj || {};
	
	return temp.replace(/\{\$([\w.]+)\}/g, function(s, k){
		var v = walkStringInTemplate(k, o, debug);
		return v == null ? s : v;
	});
}


AP.forEach = function(func, binder){
	var self = this, 
		len = self.length;
	
	for (var i = 0; i < len; i++) {
		if(!self.hasOwnProperty(i)){ continue; } 
		func.call( binder, self[i], i, self );
	}
}
AP.indexOf = function(item, from){
	var self = this,
		len = self.length,
		i = from || 0;
		
	for (; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(item === self[i]){ return i; }
	}
	
	return -1;
}
AP.lastIndexOf = function(item, from){
	var self = this,
		i = self.length;
	
	for (; i-- && (from ? i >= from : true);){
		if(!self.hasOwnProperty(i)){ continue; }
		if(item === self[i]){ return i; }
	}
	
	return -1;
}
AP.every = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length;
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!func.call(binder, self[i], i, self) === true){ 
			return false; 
		}
	}
	
	return true;
}
AP.some = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length;
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!!func.call(binder, self[i], i, self) === true){ 
			return true; 
		}
	}
	
	return false;
}
AP.map = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length,
		returnValue = [];
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		returnValue[returnValue.length] = func.call(binder, self[i], i, self)
	}
	
	return returnValue;
}
AP.filter = function(func, binder){
	//func(item, i, self);
	var self = this,
		len = self.length,
		returnValue = [];
		
	for (var i = 0; i < len; i++){
		if(!self.hasOwnProperty(i)){ continue; }
		if(!!func.call(binder, self[i], i, self) === true){
			returnValue[returnValue.length] = self[i];
		}
	}
	
	return returnValue;
}


FP.bind = function( binder ){
	var ar = AP.slice.call(arguments, 1);
	
	return function(){
		return this.apply(binder, ar.concat(AP.slice.call(arguments, 0)));
	};
}
FP.extend = function(supClass){
	var self = this;
	F.prototype = supClass.prototype;
	self.prototype = new F();
	self.prototype.constructor = self;

	self.superClass = supClass.prototype;
	if(supClass.prototype.constructor === Object.prototype.constructor){
		supClass.prototype.constructor = supClass;
	}
	return self;
}


})(this);


var JSON;JSON||(JSON={});
(function(){function l(b){return b<10?"0"+b:b}function o(b){p.lastIndex=0;return p.test(b)?'"'+b.replace(p,function(f){var c=r[f];return typeof c==="string"?c:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+b+'"'}function m(b,f){var c,d,g,k,i=h,e,a=f[b];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(b);if(typeof j==="function")a=j.call(f,b,a);switch(typeof a){case "string":return o(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);case "object":if(!a)return"null";
h+=n;e=[];if(Object.prototype.toString.apply(a)==="[object Array]"){k=a.length;for(c=0;c<k;c+=1)e[c]=m(c,a)||"null";g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]";h=i;return g}if(j&&typeof j==="object"){k=j.length;for(c=0;c<k;c+=1)if(typeof j[c]==="string"){d=j[c];if(g=m(d,a))e.push(o(d)+(h?": ":":")+g)}}else for(d in a)if(Object.prototype.hasOwnProperty.call(a,d))if(g=m(d,a))e.push(o(d)+(h?": ":":")+g);g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+"\n"+i+"}":"{"+e.join(",")+
"}";h=i;return g}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},j;if(typeof JSON.stringify!=="function")JSON.stringify=function(b,f,c){var d;n=h="";if(typeof c==="number")for(d=0;d<c;d+=1)n+=" ";else if(typeof c==="string")n=c;if((j=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number"))throw Error("JSON.stringify");return m("",
{"":b})};if(typeof JSON.parse!=="function")JSON.parse=function(b,f){function c(g,k){var i,e,a=g[k];if(a&&typeof a==="object")for(i in a)if(Object.prototype.hasOwnProperty.call(a,i)){e=c(a,i);if(e!==undefined)a[i]=e;else delete a[i]}return f.call(g,k,a)}var d;b=String(b);q.lastIndex=0;if(q.test(b))b=b.replace(q,function(g){return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+b+")");return typeof f==="function"?c({"":d},""):d}throw new SyntaxError("JSON.parse");}})();






