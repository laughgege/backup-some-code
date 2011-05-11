
window.UIMonitor2 = { bi: {
	visitor_id: '20047',
	session_id: '300047',
	pageview_id: 'IT-014-0023#12392763229297',
	script_init: window.__uidc_init || 0,
	script_load: new Date * 1,
	script_request: 1239276322922,
	script_ready: 1239276322930
}};
function $(id){
	return document.getElementById(id);
}

(function(U){

//if(!/^(www|hotels|vacations)\.(ctrip|\w+\.sh\.ctriptravel)\.com$/i.test(location.hostname)) return;

U.commonInfo = function(){
	var w = window,
		l = w.location,
		d = w.document,
		n = w.navigator,
		s = w.screen,
		b = U.browserInfo(),
		c = U.cookieInfo(),
		o = U.bi,
		t = U.timeInfo,
		i = U.identityInfo;
	return [
		//@host varchar(50),			--站点
		//@path varchar(100),			--路径
		//@query varchar(100),			--查询字符串
		//@referrer varchar(200),		--来源页(document.referrer)
		//@page_id varchar(50),			--页面标志(for Transfer)
		//@page_state varchar(50),		--页面状态(for ProcessNode)
		l.hostname,  //0
		l.pathname,  //1
		l.search,  //2
		d.referrer,  //3
		i('page_id'),  //4
		i('page_state'),  //5
		
		//@visitor_id bigint,			--访问者ID, 同一浏览器 && 同一操作系统帐户 && Cookie未删除
		//@visitor_sessions int,		--访问者累计session, 有效性同visitor_id
		//@visitor_pageviews int,		--访问者累计pageview, 有效性同visitor_id
		//@visitor_pageviews_old int,	--访问者在老测算系统中的累计pageview
		//@visitor_last_pageview varchar(50),	--访问者上一次pageview的id
		//@session_id bigint,			--会话ID, 30分钟无请求视为会话终结
		//@session_id_browser bigint,	--浏览器会话ID, 浏览器关闭视为过期会话终结
		//@pageview_id varchar(50),		--此次pageview的ID, server_id + '#' + (ms_since_1970_1_1 * 10)
		//@pageview_id_foreign varchar(50),	--后台给出的pageview的ID
		c.v_id, //6
		c.v_sessions, //7
		c.v_pageviews, //8
		c.v_old_pageviews, //9
		c.v_last_pageview, //10
		c.s_id, //11
		c.b_id, //12
		o.pageview_id, //13
		i('pv_foreign_id'), //14
		
		//@ct_script_request bigint,	--客户端Script开始请求
		//@ct_script_load bigint,		--客户端Script加载完成
		//@ct_dom_ready bigint,			--客户端domready
		//@ct_load bigint,				--客户端window.onload
		//@ct_unload bigint,			--客户端beforeunload
		//@st_script_request datetime,	--服务器接到Script请求
		//@st_script_load datetime,		--服务器准备好Script
		o.script_init, //15
		o.script_load, //16
		t('dom_ready'), //17
		t('load'), //18
		t('unload'), //19
		o.script_request, //20
		o.script_ready, //21
		
		//@br_platform varchar(20),		--navigator.platform
		//@br_engine varchar(20),		--[name]/[version]
		//@br_screen_size varchar(20),	--[screen.width]x[screen.height]
		//@br_history_length int,		--history.length
		//@br_flash varchar(20),		--[version]/[build]
		//@br_cookie_enabled bit,		--navigator.cookieEnabled
		//@br_java_enabled bit,			--navigator.javaEnabled()
		//@br_language varchar(20),		--navigator.langeuage || [navigator.browserLanguage, navigator.userLanguage, navigator.systemLanguage].join('/')
		//@br_online bit,				--navigator.onLine
		//@br_vendor varchar(50),		--navigator.vendor
		//@br_product varchar(50)		--[navigator.product]/[navigator.productSub]
		n.platform, //22
		b.engine, //23
		s.width + 'x' + s.height, //24
		w.history.length, //25
		b.flash, //26
		n.cookieEnabled ? 1 : 0, //27
		n.javaEnabled() ? 1 : 0, //28
		n.language || [n.browserLanguage, n.userLanguage, n.systemLanguage].join('/'), //39
		n.onLine ? 1 : 0, //29
		n.vendor || '', //30
		(n.product || '') + '/' + (n.productSub || '') //31
	];
};

U.browserInfo = function(){
	var Engine = {'name': 'unknown', 'version': 0};
	var Engines = {
		presto: function(){
			return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925));
		},
		trident: function(){
			return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? 5 : 4);
		},
		webkit: function(){
			return (navigator.taintEnabled) ? false : (document.evaluate ? (document.querySelector ? 525 : 420) : 419);
		},
		gecko: function(){
			return (document.getBoxObjectFor == undefined) ? false : ((document.getElementsByClassName) ? 19 : 18);
		}
	};
	for(var engine in Engines){
		var version = Engines[engine]();
		if(version){
			Engine = {'name': engine, 'version': version};
			break;
		}
	}
	
	var s = '0 r0';
	try{
		s = navigator.plugins['Shockwave Flash'].description;
	}catch(e){
		try{
			s = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
		}catch(e){}
	}
	var version = s.match(/\d+/g);
	var Flash = {'version': parseInt(version[0] || 0 + '.' + version[1] || 0), 'build': parseInt(version[2] || 0)};

	return {
		'engine': Engine.name + '/' + Engine.version,
		'flash': Flash.version + '/' + Flash.build
	};
};

U.timeInfo = function(k){
	var obj = arguments.callee._val;
	if(!obj){
		var obj = {
			'script_load': U.bi.script_load, 
			'dom_ready': -1,
			'load': -1,
			'unload': -1
		};
		U.register('domready', function(){obj.dom_ready = new Date * 1});
		U.register('load', function(){obj.load = new Date * 1});
		U.register('beforeunload', function(){obj.unload = new Date * 1});
		arguments.callee._val = obj;
	}
	return [obj, k];
};

U.identityInfo = function(k){
	var obj = arguments.callee._val;
	if(!obj){
		var obj = {
			'page_id': '',
			'page_state': '',
			'pv_foreign_id': ''
		};
		U.register('domready', function(){
			obj.page_id = U.getVal('pkgPageName');
			obj.page_state = U.getVal('htlPageState');
			obj.pv_foreign_id = U.getVal('htlPageView');
		});
		arguments.callee._val = obj;
	}
	return [obj, k];
};

U.cookieInfo = function(){
	/*
	 * cookie异常: A请求返回之前发出了B请求, A在B前返回
	 * 若B设cookie, 则A的sessionId/visitorId被孤立
	 * 若B不设cookie, 则B的sessionId/visitorId被废弃
	 *
	 * cookie总由客户端设置, 以保证纪录序列与uiscript载入顺序一致
	 */
	var o = U.bi;

	var v = U.getCookie('i_v');
	/*	v.i: visitorId
		v.p: 累计pageview
		v.o: 旧版累计pageview
		v.s: 累计session
		v.l: 上次pvid	*/
	
	var s = U.getCookie('i_s');
	/*	s.i: sessionId */
	
	var b = U.getCookie('i_b');
	/*	b.i: 浏览器sessionId */
	
	//清除原有uig, 继承其vi属性(累计pv)
	var x = U.getCookie('uig');
	if(x.vi){
		v.o = x.vi;
		U.setCookie(x, new Date(0));
	}else{
		v.o = 0;
	}
	
	if(!v.i){
		v.i = o.visitor_id;
		v.p = 1;
		v.l = '';
		v.s = 1;
		s.i = o.session_id;
		b.i = (new Date * 1).toString(36);
	}else{
		++ v.p;
		if(s.i != o.session_id){
			++ v.s;
			if(!s.i) s.i = o.session_id; //else: cookie异常, 丢下一个, 不孤立
		}
		if(!b.i) b.i = (new Date * 1).toString(36);
	}
	
	var r = {
		'v_id': parseInt(v.i, 36), 
		'v_sessions': v.s,
		'v_pageviews': v.p, 
		'v_old_pageviews': v.o,
		'v_last_pageview': v.l, 
		's_id': parseInt(s.i, 36),
		'b_id': parseInt(b.i, 36)
	};

	v.l = o.pageview_id;
	U.setCookie(v, new Date(2037, 6, 10)); //永不过期
	U.setCookie(s, new Date(new Date * 1 + 30 * 60 * 1000)); //三十分钟过期
	U.setCookie(b); //浏览器关闭过期

	return r;
};

U.register = function(evt, fn){
	var ar = U['f_' + evt];
	if(!ar){
		ar = U['f_' + evt] = [];
		U.listen(window, evt, function(ev){for(var i = 0; i < ar.length; i ++) try{ar[i](ev)}catch(e){}});
	}
	ar.push(fn);
};

U.listen = function(el, evt, fn){
	if(evt == 'domready'){
		if(window.$$ && window.$r) window.$r(evt, fn, 10);
		else U.listen(window, 'load', fn);
		return;
	}
	if(el.attachEvent) el.attachEvent('on' + evt, fn);
	else el.addEventListener(evt, fn, false);	
};

U.getVal = function(id){
	var el = document.getElementById(id);
	return (el && el.value) || '';
};

U.getCookie = function(key){
	var ret = {'__k': key};
	var r = new RegExp('(^|; )' + key + '=([^;]*)');
	var m = document.cookie.match(r);
	var a = m ? m[2].split('&') : [];
	for(var i = 0; i < a.length; i++){
		var p = a[i].split('=');
		if(p.length > 1) ret[p[0]] = unescape(p[1]);
	}
	return ret;
};

U.setCookie = function(obj, exp){
	var k = obj.__k;
	delete obj.__k;
	var a = [];
	for(var s in obj) if(obj.hasOwnProperty(s)) a.push(s + '=' + escape(obj[s]));
	var c = [
		k + '=' + a.join('&'),
		'domain=' + location.hostname.split('.').slice(-2).join('.'),
		'path=/'
	];
	if(exp) c.push('expires=' + exp.toGMTString());
	document.cookie = c.join('; ');
};

U.serverUrl = function(){
	var h = location.hostname;
	//debug
	//return 'http://www.dev.sh.ctriptravel.com/rp/uiServer2.asp';
	//if(!h || /\b(local|localhost)\b/i.test(h)) return 'http://localhost/madcat/uidc_server.asp';
	if(/\bctriptravel\b/i.test(h)) return 'http://www.dev.sh.ctriptravel.com/rp/uiServer2.asp';
	return 'ui_click.htm';
};

U.trackEvent = function(category, action, label, value){
	U.get({
		'action': 'event',
		'p': U.bi.pageview_id,
		'u': document.URL,
		'c': category,
		'l': label,
		'a': action,
		'v': value,
		't': new Date * 1
	});
};

U.append = function(key, val){
	if(val !== null) U.data.x.push(String.fromCharCode(1) + key + String.fromCharCode(2) + val);
};

U.get = function(dat){
	var ar = [];
	for(var s in dat) if(dat.hasOwnProperty(s)) ar.push(s + '=' + encodeURIComponent(escape(dat[s])));
	var d = U.proxyDoc;
	d.body.appendChild(d.createElement('script')).src = U.serverUrl() + '?' + ar.join('&');
};

U.post = function(dat){
	var d = U.proxyDoc;
	var f = d.forms[0];
	while(f.firstChild) f.removeChild(f.firstChild);
	for(var k in dat){
		if(!dat.hasOwnProperty(k)) continue;
		var v = dat[k] + '';
		if(!v) continue;
		var t = f.appendChild(d.createElement('input'));
		t.name = k;
		t.value = v;
	};
	f.action = U.serverUrl();
	f.submit();
	if(!window.ActiveXObject){
		var l = new Date();
		while(new Date() - l < 200);
	}
};

U.start = function(){
	var t = document.createElement('div');
	var p = window.$$ && $$.status && $$.status.container || document.body;
	t.style.cssText = 'left:-1000px;top:-1000px;width:100px;height:100px;position:absolute';
	p.appendChild(t);
	t.innerHTML = '<iframe></iframe><iframe name="__uidc__"></iframe>';
	var d = t.firstChild.contentWindow.document;
	d.open();
	d.write('<form method="post" target="__uidc__"></form>"');
	d.close();
	U.proxyDoc = d;
};

U.end = function(){
	var c = [];
	for(var i = 0, a = U.data.c; i < a.length; i ++){
		var x = a[i] instanceof Array ? a[i][0][a[i][1]] : a[i];
		c.push(typeof x == 'number' ? x : x = "'" + (x + '').replace(/'/g, "''") + "'");
	}
	U.post({
		'c': c.join(','),
		'x': "'" + (U.data.x.join('').replace(/'/g, "''")) + "'",
		'z': U.end.z ? ++ U.end.z : (U.end.z = 1)
	});
};

U.xpath = function(el, stopOnId){
	if(el == document.documentElement) return '';
	if(stopOnId && el.id) return '#' + el.id;
	var pa = el.parentNode;
	var tg = el.tagName;
	for(var i = 0, x = 0, ch = pa.childNodes; i < ch.length; i ++){
		if(ch[i] == el) break;
		if(ch[i].tagName == tg) ++ x;
	}
	return U.xpath(pa, stopOnId) + '/' + tg.toLowerCase() + (x > 0 ? '[' + x + ']' : '');
};
U.xpath2 = function(el){
	if(el == document.documentElement) return '';
	var pa = el.parentNode;
	var tg = el.tagName;
	for(var i = 0, x = 0, ch = pa.childNodes; i < ch.length; i ++){
		if(ch[i] == el) break;
		if(ch[i].tagName == tg) ++ x;
	}
	return U.xpath2(pa) + '/' + tg.toLowerCase() + (x > 0 ? '[' + x + ']' : '') + (el.id ? '#' + el.id.split('$').pop() : '');
}

U.Extra = function(name, ext){
	for(var s in ext) if(ext.hasOwnProperty(s)) this[s] = ext[s];
	if(!this.init.call(this)) return;
	this.name = name;
	U.extras.push(this);
};
U.Extra.prototype = {
	'init': function(){return false},
	'start': function(){},
	'end': function(){return null},
	'pack': function(ar){
		if(!ar) return '';
		var r = [];
		for(var i = 0; i < ar.length; i ++) r.push('|:' + ar[i].join('|:'));
		return '@' + r.join('@');
	},
	'append': function(ar){
		if(!ar || !ar.length) return;
		var a = [];
		for(var i = 0; i < ar.length; i ++){
			var s = ar[i].toString();
			if(s.indexOf(',') > -1) s = '"' + s.replace(/"/g, '""') + '"';
			a.push(s);
		}
		U.append(this.name, a.join(','));
	},
	'method': function(name){
		var fn = this[name] || new Function();
		var me = this;
		return function(){fn.apply(me, arguments)};
	}
};

U.data = {
	'c': U.commonInfo(), //一般信息, 入i_visit
	'x': [] //特殊信息, 入i_extra
};

U.extras = [];

U.register('domready', function(){
	U.start();
	for(var i = 0, a = U.extras; i < a.length; i ++) try{a[i].start()}catch(e){}
});
U.register('beforeunload', function(e){
	for(var i = 0, a = U.extras; i < a.length; i ++) try{
		var s = a[i].end();
		if(s && /\S/.test(s)) U.append(a[i].name, s);
	}catch(e){}
	U.end();
});

//click
new U.Extra('click', {
	'init': function(){
		var ci = 1000;
		var lc = 0;
		var de = document.documentElement;
		var me = this;
		
		me.data = [];
		U.listen(de, 'mousedown', mousedown); //todo: capture
		return true;
		
		function mousedown(e){
			var ev = e || window.event;
			var el = ev.srcElement || ev.target;
			if(el == de) return;
			var nc = new Date * 1;
			if(nc - lc < ci) return;
			lc = nc;
			var a = [ //time, x, y, xpath, class_name, name_or_href
				nc,
				ev.pageX || (ev.clientX + de.scrollLeft) || 0,
				ev.pageY || ev.clientY + de.scrollTop || 0,
				U.xpath2(el),
				el.className,
				el.name || el.href || ''
			];
			if(me.ax) a[1] -= me.ax.offsetLeft;
			if(me.ay) a[2] -= me.ay.offsetHeight;
			me.data.push(a);
		}
	},
	'start': function(){
		this.ax = $('pubGlobal_main');
		this.ay = $('pubGlobal_topAlert01');
	},
	'end': function(){
		return this.pack(this.data.length ? this.data.slice(0, 200) : null);
	}
});

//bestdeals calendar
new U.Extra('bestdeals-calendar', {
	'init': function(){
		return /^\/bestdeals\/(index\.asp)?$/i.test(location.pathname);
	},
	'start': function(){
		var div = null;
		for(var i = 0, ar = document.getElementsByTagName('div'); i < ar.length; i ++){
			var el = ar[i];
			if(el.className.match(/private_bestDeals_calendar/i)){
				div = el;
				break;
			}
		}
		if(div){
			U.trackEvent(this.name, 'arrive', document.referrer, 0);
			U.listen(div, 'mousedown', this.method('mousedown'));
		}
	},
	'mousedown': function(e){
		var evt = e || window.event;
		var el = (evt.srcElement || evt.target);
		var info = this.info(el);
		if(info) U.trackEvent(this.name, info.action, info.label, info.value);
	},
	'info': function(el){
		var action = null;
		var value = 0;
		var label = [];
		
		if(el.tagName == 'A'){
			if(/private_bestDeals_title09/i.test(el.parentNode.className)){
				action = 'view-more';
			}else if(/^\d+$/.test(el.innerHTML)){
				action = 'change-date';
				value = parseInt(el.innerHTML);
			}else{
				action = 'click-link';
				value = this.index(el);
			}
		}else if(el.id == 'lastMonth'){
			action = 'prev-month';
		}else if(el.id == 'nextMonth'){
			action = 'next-month';
		}
		
		if(!action) return null;
		
		label.push(this.selected());
		label.push(this.displaying());
		if(action == 'click-link'){
			label.push(el.innerText || el.textContent);
			label.push(el.href);
		}
		return {
			'action': action,
			'label': label.join('; '),
			'value': value
		};
	},
	'selected': function(){
		try{
			return $('NewsList').getElementsByTagName('b')[0].innerHTML.match(/\d+/g).join('-');
		}catch(e){
			return '1970-1-1';
		}
	},
	'displaying': function(){
		try{
			return $('cal_container').getElementsByTagName('b')[0].innerHTML.match(/\d+/)[0];
		}catch(e){
			return '0';
		}
	},
	'index': function(el){
		while(el && el.tagName != 'LI') el = el.parentNode;
		if(!el) return -1;
		var ch = el.parentNode.childNodes;
		for(var i = 0, j = 0; i < ch.length; i ++){
			if(ch[i].tagName == 'LI') ++ j;
			if(ch[i] == el) break;
		}
		return j;
	}
});

})(window.UIMonitor2);