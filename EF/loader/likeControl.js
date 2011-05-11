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
		
		if(self.charset){
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