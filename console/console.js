var $console = (function(win, doc, undefined){

	var html = doc.documentElement,
		body = doc.body;
	
	var resize,
		inited = false,
		inner_box,
		inner_height;
	
	function $(d){
		return doc.getElementById(d);
	}
	
	function type(a){
		
	}
	
	
	function _initResize(sizer){
		if(!sizer)
			return;
		
		sizer.onmousedown = _handleSizeMousedown;
	}
	
	function fix(e){
		e = e || win.event;
		
		if ( !e.target ) {
			e.target = e.srcElement || doc; 
		}
		
		if( e.pageX == null ){
			e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0)
						- (html && html.clientLeft || body && body.clientLeft || 0);
			e.pageY = e.clientY + (html && html.scrollTop  || body && body.scrollTop  || 0) 
						- (html && html.clientTop  || body && body.clientTop  || 0);
		}
		
		e.prevent = function(){
			if ( e.preventDefault ) {
				e.preventDefault();
			}

			e.returnValue = false;
		}
		
		return e;
	}
	
	function captureWin(evt, fn){
		if(doc.addEventListener){
			doc.addEventListener(evt, fn, true);
		}
		else{
			doc.attachEvent("on"+evt, fn);
		}
	}
	
	function removeCaptureWin(evt, fn){
		if(doc.removeEventListener){
			doc.removeEventListener(evt, fn, true);
		}
		else{
			doc.detachEvent("on"+evt, fn);
		}
	}
	
	function _handleSizeMousedown(e){
			e = fix(e);
			e.prevent();
		
		var y = e.pageY;
		
		inner_height = inner_box.offsetHeight;
		
		doc.onmousemove = function(e){
			e = fix(e);
			
			var dy = e.pageY;
			_handleSizeMousemove(y, dy);
		};
		captureWin("mouseup", _handleSizeMouseup);
	}
	
	function _handleSizeMousemove(y1, y2){
		inner_box.style.height = (inner_height + y2 - y1)+"px";
	}
	
	function _handleSizeMouseup(e){
		doc.onmousemove = null;
		removeCaptureWin("mouseup", arguments.callee);
	}
	
	function main(){
		resize = $("console_resize");
		inner_box = $("console_box_inner");
		
		_initResize(resize);
		inited = true;
	}
	
	function _print(mes, type){
		if(!inited)
			main();
		
		var li = doc.createElement("li");
		
		if(type)
			li.className = type;
		li.innerHTML = mes;
		
		inner_box.appendChild(li);
		return mes;
	}
	
	return {
		log: function(mes){
			return _print(mes);
		},
		info: function(mes){
			return _print(mes, "info");
		},
		warn: function(mes){
			return _print(mes, "warn");
		},
		error: function(mes){
			return _print(mes, "error");
		},
		clear: function(){
			inner_box.innerHMTL = "";
		},
		separate: function(mes){
			return _print(mes, "separate");
		}
	};
})(window, document);