//Prototype
String.prototype.toInt = function(n){
	return parseInt(this, n || (n = 10));
};
Array.prototype.contains = function(el){
	for (var i = 0, l = this.length; i < l; i++) {
		if (this[i] == el) return true;
	}
	return false;
};
Array.prototype.associate = function(keys, obj){
	var r = obj || {};
	for(var i = 0, n = Math.min(keys.length, this.length); i < n; i ++) r[keys[i]] = this[i];
	return r;
};

//Legacy
window.parseRawData = function(){
	c_data_raw = $s2t(c_data_raw);
	var d = window.c_data = {packageCity:{}, specialCity:{}, capitalCity:{}, city:{}, zone:{}, location:{}, cityName:{}, zoneName:{}, locationName:{}};
	for (var i = 0, a = c_package_city.match(/\d+/g); i < a.length; i++) {
		d.packageCity[adjustCityId(a[i])] = 1;
	}
	for (var i = 0, a = c_special_city.match(/\d+/g); i < a.length; i++) {
		d.specialCity[a[i]] = 1;
	}
	for (var i = 0, a = c_capital_city.match(/\d+/g); i < a.length; i++) {
		d.capitalCity[a[i]] = 1;
	}
	c_data_raw = c_data_raw.replace(/@(\d+)\|0\|([^@]+)/g, function (_, id, name) {d.city[id] = [];d.cityName[id] = name;return "";});
	c_data_raw = c_data_raw.replace(/@(\d+)\|([1-9]\d*)\|([^@]+)/g, function (_, id, pid, name) {var p = d.city[pid];if (p) {p.push(id);d.cityName[id] = name;}return "";});
	c_data_raw = c_data_raw.replace(/@z(\d+)\|([1-9]\d*)\|\s*([^@]+)/g, function (_, id, pid, name) {pid = adjustCityId(pid);var p = d.zone[pid] || (d.zone[pid] = []);p.push(id);d.zoneName[id] = name;return "";});
	c_data_raw = c_data_raw.replace(/@l(\d+)\|([1-9]\d*)\|\s*([^@]+)/g, function (_, id, pid, name) {pid = adjustCityId(pid);var p = d.location[pid] || (d.location[pid] = []);p.push(id);d.locationName[id] = name;return "";});
	for (var s in d.city) {
		var a = d.city[s];
		for (var i = 0; i < a.length; i++) {
			if (a[i] in d.capitalCity) {
				a.unshift(a[i]);
				a.splice(i + 1, 1);
				break;
			}
		}
	}
};
window.adjustCityId = function(id){
	id=parseInt(id,10);
	if (id<20000)
		return id-100;
	if (id<80000)
		return id-20000;
	return id-80000;
};

//Util
var $extend = function(a){
	for(var i = 1; i < arguments.length; i ++){
		var b = arguments[i];
		for(var s in b) if(b.hasOwnProperty(s)) a[s] = b[s];
	}
	return a;
};
var $each = function(obj, fn){
	if(!obj) return;
	if(obj.constructor == Array){
		obj.each(fn);
	}else{
		for(var s in obj) if(obj.hasOwnProperty(s)) fn(s, obj[s]);
	}
};
/*
*	if the domobject is on display
*/
var ishidden = function(obj){
	var tmpobj = obj;
	do{
		if(tmpobj.style.display=="none") return true;
		else tmpobj = tmpobj.parentNode;
	}while(tmpobj!=document.documentElement);
	return false;
}
var $event = {
	listen: function(obj, evt, func){
		if(obj.attachEvent) obj.attachEvent('on' + evt, func);
		else obj.addEventListener(evt, func, false);
	},
	unlisten: function(obj, evt, func){
		if(obj.attachEvent) obj.detachEvent('on' + evt, func);
		else obj.removeEventListener(evt, func, false);
	},
	fix: function(e){
		if(!e || !e.target){
			e = window.event;
			e.target = e.srcElement;
			e.stopPropagation = function(){this.cancelBubble = true};
			e.preventDefault = function(){this.returnValue = false};
		}
		e.leftButton = (e.which || e.button) == 1;
		return e;
	}
};
var $box = (function(){
	var fn = function(nm, fm){
		if(!this.set) {}
		var ele = fm.elements[nm];
		if(!ele) return;
		if(ele.tagName){
			this.ele = [ele];
		}else{
			this.ele = [];
			for(var i = 0; i < ele.length; i ++) this.ele.push(ele[i]);
		}
		this.type = this.ele[0].type;
		this.item = [];
		var item = this.item;
		this.reg = this.ele.map(function(el){
			item[el.value] = el;
			return el.value ? new RegExp('\\b' + el.value + '\\b') : /\x00/;
		});
	};
	$extend(fn.prototype, {
		set: function(v){
			var reg = this.reg;
			this.ele.each(function(el, i){
				el.checked = reg[i].test(v);
			});	
		},
		get: function(){
			var r = [];
			this.ele.each(function(el, i){
				if(el.checked&&el.value) r.push(el.value);
			});
			return r.join(',');
		},
		listen: function(evt, func){
			this.ele.each(function(el){
				$event.listen(el, evt, func);
			});
		}
	});
	return fn;
})();

//Const
var Const = {
	maxStay: 28 * 24 * 3600 * 1000,
	gmapKeys: {
		local: 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBQsmX-7ytpoiHcrgNTUSfV81Ed8hBTi6Uguc3yrt_GpnhJY5TfpRdqCRQ',
		ui: 'ABQIAAAABwVNWXH35Vvp0j082moUExR6__tAqOJv6uhtO_6inGD0jGZlgBQsmEs9Y1ghi23VbMDQTOnSE6O3Jw',
		dev: 'ABQIAAAABwVNWXH35Vvp0j082moUExQ21NSPy12LSqDzWrZ4wgEhtvzSuRRrXKt06_p19Op2_LxaMrOL2YyD8g',
		hotel: 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBQbT70BoU7i5MkVbZ7HrG2kajJWSRQh3u25zVm4dBmscdKe4-1hcqWSKA',
		localhost: 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxTrpEx6FClITHT18EGKdz3duj5y6w',
		online: 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBRWyQiiRQRW0fqS2Fa5V3ESxHa-qRSbIFPmWnNW15aKxmuVxWtoKq2Fsg',
		'172.16.144.78': 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBSN8kR8PPyL1QMsFOmn5Sht7fONkhQpcLsTvrX3nRk-i2w8AnBof12GLA',
		'hotels.test.sh.ctriptravel.com': 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBSGgdxF58x98HBNKvGbugkwleTkJxS0GTuo2ZsbJDeU0PP5XHmg7-Ey5Q',
		'hotels.uat.sh.ctriptravel.com': 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBRpyRpPSRy-p82yctkJW9qfpB5jiBTErXkZ14-AKUJsvgiBAv9_C004JA',
		'gotone.smcc.hotels.ctrip.com': 'ABQIAAAAPkPJszAdGPlFqNceVFjeiBRatJB4E_ZvPUEVZazvUoWfAZnV1RTaJp_DpeldXMn7kZ9QQBJjM7aNzQ',
		'xinhuanet.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxTKCLkvGrAiG_uLuysilkEXWxWE1RTkBxnEnHbnSf5YbUmHPZfxGgka5A',
		'xinhuanet.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQgRSNfNGstz8iSqs7D51dism-1mRQ3KBDvim_Pm6OdSksu1hvHgLTpyg',
		'cctv.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRFKoYiR5sAs-UlyhIHESm2_dTbcRQBXO4tKU2xOjhX8XB0GYMdgbGFSg',
		'passatvip.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRm_6yb3dJhWkkT0ZZnEP5-MK-kXhRuxB3ElQiyrGN_FQub5X9Aborisw',
		'hotels.ctrip.avl.com.cn': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRvK_IhB6LJtE10zb8gr8TzH-gJABRSL7HFcg3gqdEThzgxpeJHTZJaDA',
		'hotels.ctrip.gznet.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQiy5Tukm4P_Yd8ulzxPazOQggsLxTG0R4IdGTC1mY30AjWc5DVPKnJ8g',
		'116travel.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQ9atPbhMPWrj69WOOv0wQPAv77rhTeGE0EauwV6D1GvhZJGD2ihzn7Kw',
		'tfol.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxTd0fTBMwz_iD6EfMme_oRcFtYAbxSSY3erIUKnYrI3KVX3z82q0ApXqA',
		'alibaba.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQG96meTFArg3Bku6Y5eL0rjpL12hS4dNuzFtjc7uZCm2oWrUKtIzUI9A',
		'alibb.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQo1Uw4NZ-VCXO9dKdxhFvuABJyHhT3Ax94tFmX-HzIZY6Srd9a6c_D2w',
		'sc.xinhuanet.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQTVljzUni_8Hnv-ugB2iIlFidGfxRZYNKmYeNWbxTX1mWglxhZ8S7RCA',
		'spdb.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxTQbQjvdSCf-DbICm2rujBvisji0hTymk8MXzGDSUsMj-CD4CKOGpZWdQ',
		'qdcnc.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxSu-rnPzqpawGEnhkA1m1eOrTWq0hRSXAM5fS9lVwrb0LomPSggCmRi3Q',
		'dgtba.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxTbIUce8PXINkOXf-mR1EeeXKTrRBRq2w-Y6UTv1Pv8sOXAkJCaf3Fkcw',
		'zjcm.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxSuYi8P66_Hz9AOtDDwGi2X0i6jEBSu-oasJCz_w2EnB5GMDXm73aGInw',
		'uaa.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxSfxAWBKkvu7FjqHq3ZM5X4Nl-PQxSpvOcDemFrMVTue3WW42v_slH7mg',
		'fesco.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxSoujUl3mN8n4b2QptYa434yYQwvxQGlDQ57QCQh-IrUSqgihS3fx6-YQ',
		'eplan.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxT20AluZsW9IwhWF_-t72QpB4E8URS0PiXMXODsfPXXsLSO7honGaopew',
		'ebig5.hotels.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRtwdZRT54INhi9WLa7I1YKx5vvdhSLn-9lqhQzLRf6x_VFWF1WzcpptA',
		'hotels.travel.msn.com.cn': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxQWNDtS6vp0Snrbt-FWdIjvMyIIDRRoYuf_Igw84xmThw_wPKIr4zctyQ',
		'hotels.corp.dev.sh.ctriptravel.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxTahphOQk_e95UmkDNrbg68K3TZBRQ5Qs3fGV7MArO22X5RM7RHuMihbg',
		'hotels.corp.test.sh.ctriptravel.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxReLdMHZz73jxU6-r12Xh5pBOaBAxRl0Y6Pe72efk2tn8GxuifcOu2wEw',
		'hotels.corp.uat.sh.ctriptravel.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRmbDJGfVpX7AJ4JaBW4GVIqeEOPxQtJ3sRd0E0Yih_qLwPKMhFJG9_RQ',
		'hotels.corporatetravel.ctrip.com': 'ABQIAAAAnYnfwh2Ez87RBCD0-7h3dxRiEZktN3vTNDtpPrhYkqwXRrk4jRQMsDplV6vROaV745E3TlXfF6tKkg',
		'hotels.big5.ctrip.com': 'ABQIAAAAvpW8TAestYYKVmT7axCZNBTgjclKeBNNhpqarlNJXMlgO1nDWhTo_RDEzgV7Kcq36znt5NJW7THolQ'
	}
};

//Text
var Msg = {
	city: '请选择酒店所在城市',
	zone: '商业区',
	location: '行政区',
	checkIn: '请选择入住日期',
	checkOut: '请选择离店日期',
	dateErr: '日期格式为yyyy-mm-dd',
	too_early_in: '入住日期不能早于今天',
	too_early_out: '您选择的离店日期早于/等于入住日期，请重新选择',
	too_long: '入住时间段不能超过28天',
	low_price: '请输入正确的起始价格',
	high_price: '请输入正确的终止价格',
	no_room: '您选择的日期没有房间可供预订!',
	room_num: '请选择预订房间数'
};

//Hanw
function $alt(o, msg, isScroll, objPos, jmpPos){
	$alert(o, msg, isScroll, objPos, jmpPos);
	return false;
}

/*
*合成数组
*/
function $m(){
	for (
		var i = 0, a = arguments, l = a.length, rlt = [];
		i < l; i++
	) rlt.push($(a[i]));
	return rlt;
}

function $F(fm){//fm:form element
	$X(fm)(function(){
		if (!fm) return;
		var _ = this;
		_.v = function(){
			var a = arguments, l = a.length;
			if (l == 1) {
				if (typeof a[0] == 'string')
					return _[a[0]] ? _[a[0]].value.trim() : null;
				else for (var p in a[0]) if(_[p]) _[p].value = a[0][p];
			} else if (l == 2) if (_[a[0]]) _[a[0]].value = a[1];
			return _;
		};
	});
	return fm;
}
function $X(obj){ return function(fn){ fn.apply(obj) } }
function hasClass(obj, cls){ return obj.className.split(/\s+/).contains(cls) };
function addClass(obj, cls){ hasClass(obj, cls) || (obj.className += (obj.className ? ' ' : '') + cls) };
function removeClass(obj, cls){
	var classes = obj.className.split(/\s+/);
	classes.each(function(el, i){
		if (el == cls) classes.splice(i, 1);
	});
	obj.className = classes.join(' ');
}
function remove(obj){ return obj.parentNode.removeChild(obj) };

//Validation
function validateQuery(){
	return checkDate(['txtCheckIn', 'txtCheckOut']) && checkPrice(['txtPriceLow', 'txtPriceHigh']);
}
function checkDate(date, v0){
	v0 = v0 ? v0.isDateTime() : new Date().dateValue();
	var dt1 = fm[date[0]], dt2 = fm[date[1]],
		v1 = fm.v(date[0]).isDateTime() || 0, v2 = fm.v(date[1]).isDateTime() || 0;
	var	rtn =
			dt1.isNull() ? $alt(dt1, Msg.checkIn) : // checkIn date null
			!v1 ? $alt(dt1, Msg.dateErr) : // checkIn date wrong
			v1 < v0 ? $alt(dt1, Msg.too_early_in) : // checkIn date earlier than today
			dt2.isNull() ? $alt(dt2, Msg.checkOut) : // checkOut date null
			!v2 ? $alt(dt2, Msg.dateErr) : //checkOut date wrong
			v1 >= v2 ? $alt(dt2, Msg.too_early_out) :  // checkOut date earliter than checkIn date
			v2 - v1 > Const.maxStay ? $alt(dt2, Msg.too_long) : 1; // over maxDays
	return rtn;
};
function checkPrice(price){
	var p1 = fm[price[0]], p2 = fm[price[1]],
		v1 = fm.v(price[0]), v2 = fm.v(price[1]);
	function exCh(x1, x2){ p1.value = x2; p2.value = x1; return 1 }
	return  v1 ? /^[0-9]+$/.test(v1) ?
			v2 ? /^[0-9]+$/.test(v2) ?
			v1 - 0 > v2 - 0 ? exCh(v1, v2) : 1 :
			$alt(p2, Msg.high_price) : 1 :
			$alt(p1, Msg.low_price) : 1;
}

//Components
var MadCat = function(fn){
	this.events = {};
	if(fn) fn.apply(this);
};
$extend(MadCat.prototype, {
	set: function(){},
	get: function(){return null},
	evt: function(key, fn){this.events[key] = fn},
	init: function(){}
});

var HotelSearch = new MadCat(function(){
	var cityid, ele, div, hlight, changed = false;
	var current = {type: '', id: '', name: ''};
	var me = this;
	var elCheckIn, elCheckOut, elHotelName, elPriceLow, elPriceHigh, elSubmit;
	
	this.init = function(obj){
		elCheckIn = $('txtCheckIn');
		elCheckOut = $('txtCheckOut');
		elHotelName = $('txtHotelName');
		elPriceLow = $('txtPriceLow');
		elPriceHigh = $('txtPriceHigh');
		elSubmit = $('btnQuickSearch');
		
		cityid = obj.cityId || obj.districtId;
		ele = $('txtHotelArea');
		div = $('jmpArea');
		['zone','location'].each(function(typ, i){
			var arr = c_data[typ][cityid], hsh = c_data[typ+'Name'], tmp = $('div_' + typ);
			if (arr && arr.length){
				tmp.innerHTML += arr.map(function(id){
					return '<a href="#;" id="{$1}_{$2}" title="{$3}">{$3}</a>'.replaceWith([0, typ, id, hsh[id]]);
				}).join('');
			}else{
				tmp.style.display = 'none';
			}
		});
		ele.readOnly = true;
		$event.listen(ele, 'click', eleClick);
		$event.listen(ele, 'focus', eleClick);
		$event.listen(div, 'click', divClick);
		$event.listen(elSubmit, 'click', btnClick);
		var elUl = elCheckIn.parentNode;
		while(elUl && elUl.tagName != 'UL') elUl = elUl.parentNode;
		if(elUl) $event.listen(elUl, 'keydown', ulKeydown);
	};
	this.set = function(obj){
		elCheckIn.value = obj.checkIn;
		elCheckIn.module.notice && elCheckIn.module.notice.check();
		elCheckOut.value = obj.checkOut;
		elCheckOut.module.notice && elCheckOut.module.notice.check();
		elHotelName.value = obj.hotelName;
		elHotelName.module.notice && elHotelName.module.notice.check();
		elPriceLow.value = obj.priceLow;
		elPriceHigh.value = obj.priceHigh;
		
		var t = obj.zoneId ? 'zone' : obj.locationId ? 'location' : '';
		if(t){
			current.id = obj[t + 'Id'];
			current.type = t;
			current.name = c_data[t + 'Name'][current.id] || '';
			hlight = $(t + '_' + current.id);
		}else{
			current.id = '';
			current.type = '';
			current.name = '';
			if(hlight) hlight.style.fontWeight = 'normal';
		}
		setEleValue();
	};
	this.events.areachange = function(obj){
		if(MadCat.debug) alert('HotelArea changed: ' + $toJson(obj));
	};
	this.events.submit = function(obj){
		if(MadCat.debug) alert('HotelSearch submited: ' + $toJson(obj));
	};
	function ulKeydown(e){
		var evt = $event.fix(e);
		if(evt.keyCode == 13) btnClick(e);
	}
	function btnClick(e){	
		var evt = $event.fix(e);
		if(validateQuery()){
			var obj = {
				checkIn: elCheckIn.value,
				checkOut: elCheckOut.value,
				hotelName: elHotelName.isNull() ? '' : elHotelName.value,
				priceLow: elPriceLow.value,
				priceHigh: elPriceHigh.value,
				zoneId: current.type == 'zone' ? current.id : '',
				locationId: current.type == 'location' ? current.id : ''
			};
			if(window.UIMonitor){
				try{window.UIMonitor.trigger('hotel_query', $extend(obj, {cityId: HotelQuery.cityId, districtId: HotelQuery.districtId}));}
				catch(e){}
			}
			me.events.submit(obj);
			if(!$('selHotelStar')) evt.preventDefault();
		}else{
			evt.preventDefault();
		}
	}
	function eleClick(e){
		if(div.parentNode != document.body) document.body.appendChild(div);
		$(div.id).$setPos($(ele.id), 'tl', 'tr');
		div.style.display = 'block';
		div.style.visibility = 'visible';
		$event.fix(e).stopPropagation();
		$event.listen(document.documentElement, 'click', docClick);
		if(hlight) hlight.style.fontWeight = 'bold';
	}
	function docClick(){
		div.style.visibility = 'hidden';
		$event.unlisten(document.documentElement, 'click', docClick);
		if(changed){
			setEleValue();
			me.events.areachange({zoneId: current.type == 'zone' ? current.id : '', locationId: current.type == 'location' ? current.id : ''});
			changed = false;
		}
	}
	function divClick(e){
		var evt = $event.fix(e);
		if(evt.target.tagName == 'A'){
			changed = evt.target != hlight;
			if(!changed) return;
			if(hlight) hlight.style.fontWeight='normal';
			hlight = evt.target;
			evt.preventDefault();
			if(!hlight.id){
				current.type = null;
			}else{
				var x = hlight.id.split('_');
				current.type = x[0];
				current.id = x[1];
				current.name = c_data[current.type + 'Name'][current.id];
			}
		}else{
			evt.stopPropagation();
		}
	}
	function setEleValue(){
		ele.value = current.type ? current.name : '';
	}
});
var HotelFilter = new MadCat(function(){
	this.set = function(query, result){
		var hash = {};
		var item = {};
		var config = result.filterInfo || [];
		for(var i = 0; i < config.length; i ++){
			var a = config[i].split('|');
			a[1] = a[1].split(':');
			var t = hash[a[0]];
			if(!t){
				hash[a[0]] = {type: a[2], name: a[0], label:a[1][1], defaultValue: a[1][0], expended: true, options: []};
			}else{
				t.options.push({label: a[1][1], value: a[1][0], count: a[2], checked: false});
			}
		}
		var parentEl = $('htl_filter');
		while(parentEl.firstChild) parentEl.removeChild(parentEl.firstChild);
		
		var hasItem = false;
		for(var s in hash){
			var t = new FilterItem(hash[s]);
			t.setValue(query[s]);
			if(t.valid()){
				t.inject(parentEl);
				item[s] = t;
				hasItem = true;
			}
		}
		
		var rootEl = parentEl.parentNode;
		while(rootEl && !/\bbase_154\b/.test(rootEl.className)) rootEl = rootEl.parentNode;
		if(rootEl) rootEl.style.display = hasItem ? '' : 'none';
		
		if(this.item) for(var s in this.item) this.item[s].dispose();
		this.item = item;
	};
	this.events.click = function(obj){
		if(MadCat.debug) alert('HotelFilter clicked: ' + $toJson({name: obj.name, value: obj.getValue()}));
	};
});
var FilterItem = function(cfg){
	for(var s in cfg) this[s] = cfg[s];
};
$extend(FilterItem.prototype, {
	inject: function(parentEl){
		var me = this;
		var dt = document.createElement('dt');
		dt.innerHTML = '<a href="###" style="outline: none;" hideFocus>' + this.label + '</a>';
		dt.onclick = function(){
			me.folded =  !me.folded;
			var dis = me.folded ? 'none' : 'block';
			var opt = me.options;
			for(var i = 0; i < opt.length; i ++) opt[i].element.style.display = dis;
		};
		parentEl.appendChild(dt);
		me.element = dt;
		for(var i = 0, opt = me.options; i < opt.length; i ++) injectOption(opt[i]);
		
		function injectOption(opt){
			if(!opt.checked && (me.type == 'radio' && !me.empty || opt.count == 0)) return;
			var dd = document.createElement('dd');
			dd.className = opt.checked ? 'public_filter_selected' : '';
			dd.innerHTML = '<a href="###" style="outline: none;" hideFocus>' + opt.label + (opt.checked ? '' : '(' + opt.count + ')') + '</a>';
			dd.onclick = function(e){
				if(srcElement(e) == this) return;
				opt.checked = !opt.checked;
				me.fireEvent();
				return false;
			};
			parentEl.appendChild(dd);
			opt.element = dd;
		}
		function srcElement(e){
			var evt = e || window.event;
			return evt.srcElement || evt.target;
		}
	},
	setValue: function(val){
		this.empty = val == this.defaultValue;
		var v = ',' + val  + ',';
		for(var i = 0, opt = this.options; i < opt.length; i ++) opt[i].checked = !this.empty && v.indexOf(',' + opt[i].value + ',') >= 0;
	},
	getValue: function(){
		var r = [];
		for(var i = 0; i < this.options.length; i ++) if(this.options[i].checked) r.push(this.options[i].value);
		if(!r.length) r.push(this.defaultValue);
		return r.join(',');
	},
	valid: function(){
		for(var i = 0, a = this.options; i < a.length; i ++) if(a[i].count > 0 || a[i].checked) return true;
		return false;
	},
	fireEvent: function(){
		var obj = {};
		obj[this.name] = this.getValue();
		HotelFilter.events.click(obj);
	},
	dispose: function(){
		if(!this.element) return;
		this.element.onclick = null;
		this.element = null;
		for(var i = 0, opt = this.options; i < opt.length; i ++){
			if(opt[i].element){
				opt[i].element.onclick = null;
				opt[i].element = null;
			}
		}
	}
});
var HotelLabel = new MadCat(function(){
	this.set = function(query, result){
		$('lblCheckIn').innerHTML = query.checkIn;
		$('lblCheckOut').innerHTML = query.checkOut;
		$('lblStay').innerHTML = Math.round((new Date(query.checkOut.replace(/-/g, '/')) - new Date(query.checkIn.replace(/-/g, '/'))) / 86400000);
		$('lblHotelCount').innerHTML = result.hotelCount;
	};
});
var HotelView = new MadCat(function(){
	var hash = {};
	var curr = null;
	var me = this;
	
	var tip = {};
	var tipParent = {};
		
	this.init = function(){
		var amap = $("imgAMap");
		var li = $('hotelView').$('li');
		if(!/(jpg|gif)/.test(amap.getAttribute("src"))){
			li[2].style.display = "none";
		}
		for(var i = 1; i < li.length - 1; i ++){
			var el = li[i];
			el.viewType = el.getAttribute('_view_type');
			if(el.viewType){
				hash[el.viewType] = el;
				if(!el.id) el.id = 'htl_view_' + el.viewType;
				el.className = 'tagoff';
				el.onclick = function(){
					me.events.change(this.viewType);
					me.set(this);
				};
				if(el.getAttribute('_panel')){
					el.panel = $(el.getAttribute('_panel'));
					if(el.panel) el.panel.style.display = 'none';
				}
			}
		}
		$('btnReQuery').onclick = QueryEngine.retry;
		$('btnCancelQuery').onclick = HotelView.hideFailure;

	};
	this.set = function(query, result){
		var viewType = query.viewType;
		if(!hash[viewType]) viewType = 'list';
		if(curr){
			curr.className = 'tagoff';
			if(curr.panel) curr.panel.style.display = 'none';
		}
		curr = hash[viewType];
		curr.className = 'tagon';
		if(curr.panel) curr.panel.style.display = '';
		HotelList.holder.className = viewType == 'emap' ? 'searchresult_switchon' : 'searchresult_switchoff';
		if(curr.viewType == 'emap') EMap.set(window.HotelQuery, window.HotelResult);
		else if(curr.viewType == 'area') AMap.set(window.HotelQuery, window.HotelResult);
	};
	this.get = function(){
		return curr && curr.viewType;
	};
	this.events.change = function(viewType){
		if(MadCat.debug) alert('HotelView changed: ' + $toJson(viewType));
	};
	this.hideAMap = function(){
		if(hash['area']) hash['area'].style.display = 'none';
	};
	
	this.showWait = function(){
		maskShow($('divWaiting'));
	};
	this.hideWait = function(){
		maskShow(null);
	};
	this.showFailure = function(){
		maskShow($('divFailure'));
	};
	this.hideFailure = function(){
		maskShow(null);
	};
	
	this.updateTip = function(){
		var vt = HotelView.get();
		if(vt == 'list') return;
		var el = vt == 'area' ? $('spanNoneArea') : $('selectTip');
		var a = AMap.getTipInfo();
		var e = EMap.getTipInfo();
		var info = a.checked ? a : e.checked ? e : vt == 'area' ? a : e;
		el.style.display = '';
		el.className = info.checked ? 'searchresult_searcharea' : '';
		el.innerHTML = $s2t(info.text);
		el.onclick = info.fn;
	};
});
var HotelSort = new MadCat(function(){
	var hash = {};
	var curr = null;
	var me = this;
	
	this.init = function(){
		var li = $('hotelSort').$('li');
		for(var i = 1; i < li.length; i ++){
			var el = li[i];
			el.sortType = el.getAttribute('_sort_type');
			if(el.sortType){
				hash[el.sortType] = el;
				if(!el.id) el.id = 'htl_sort_' + el.sortType;
				el.className = 'tag' + el.sortType + ' tagoff';
				el.sortFixed = el.getAttribute('_sort_fixed')
				el.onclick = function(e){
					if($event.fix(e).target.tagName == 'A') return false;
					var obj = {};
					if(this.sortFixed){
						if(curr == this) return;
						obj.orderBy = this.sortType;
						obj.orderType = this.sortFixed;
					}else{
						obj.orderBy = this.sortType;
						if(/tagoff/.test(this.className)){
							obj.orderType = obj.orderBy == 'price' ? 'asc' : 'desc';
						}else{
							obj.orderType = /asc$/.test(this.className) ? 'desc' : 'asc';
						}
					}
					me.events.change(obj);
				};
			}
		}
	};
	this.set = function(obj){
		if(curr) curr.className = 'tag' + curr.sortType + ' tagoff';
		curr = hash[obj.orderBy];
		curr.sortWay = obj.orderType;
		curr.className = curr.sortFixed ? 'tagon' : 'tagon_' + obj.orderType;
	};
	this.events.change = function(obj){
		if(MadCat.debug) alert('HotelSort changed: ' + $toJson(obj));
	};
});
var HotelPage = new MadCat(function(){
	var me = this;
	this.set = function(query, result){
		$('lblCurrentPage').innerHTML = query.page;
		$('lblTotalPage').innerHTML = result.totalPage;
		if($('lblPageInfo_top')) $('lblPageInfo_top').innerHTML = [query.page, result.totalPage].join('/');
		updateButton($('btnPrevPage'), -1);
		updateButton($('btnPrevPage_top'), -1);
		updateButton($('btnNextPage'), 1);
		updateButton($('btnNextPage_top'), 1);
		function updateButton(el, val){
			if(!el) return;
			el.targetPage = parseInt(query.page) + val;
			el.disabled = el.targetPage < 1 || el.targetPage > result.totalPage;
			el.className = el.disabled ? 'base_btn05' : 'base_btn04';
			el.onclick = el.disabled ? null : function(){me.events.click({page: this.targetPage})};
		}
	};
	this.events.click = function(obj){
		if(MadCat.debug) alert('HotelPage clicked: ' + $toJson(obj));
	};
});
var AMap = new MadCat(function(){
	var curr = '';
	var hash = {};
	var elImg, elMap, elJmp, elTitle, elTxt, elButton;
	var me = this;
	
	var btnCurrent;
	
	this.init = function(){
		if(!(elMap = $('m_hotmap'))){
			HotelView.hideAMap();
			return;
		}
		elImg = $('imgAMap');
		elJmp = $('divAMapJump');
		elJmp.$('dfn')[0].onclick = function(){me.showPop(null)};
		elTitle = elJmp.$('strong')[0];
		elTxt = elJmp.$('p')[0];
		elButton = elJmp.$('a')[0];
		
		btnCurrent = $('spanCurrentArea');
		
		for(var i = 0, a = elMap.$('area'); i < a.length; i ++) hash[a[i].getAttribute('_zone_id')] = a[i];
		elButton.onclick = function(){
			var obj = curr ? {zoneId: curr, locationId: ''} : {};
			me.showPop(null);
			me.events.click(obj);
			return false
		};
		me.showPop(null);
	};
	this.set = function(query, result){
		if(HotelView.get() != 'area') return;
		HotelView.updateTip();
	};
	this.get = function(){
		return curr;
	};
	this.events.click = function(obj){
		if(MadCat.debug) alert('AMap click: ' + $toJson(obj));
	};
	this.showPop = function(el, name, txt){
		if(!elMap) return;
		if(!el){
			if(curr){
				setJmpPos([-1000, -1000]);
				curr = '';
			}
		}else{
			if(HotelView.get() != 'area'){
				window.HotelQuery.viewType = 'area';
				window.HotelView.set(HotelQuery);
			}
			if(document.documentElement.scrollTop > 250) document.documentElement.scrollTop = 170;
			elTitle.innerHTML = name;
			elTxt.innerHTML = txt;
			elButton.innerHTML = $s2t('查询@酒店').replace('@', name);
			setJmpPos(getAreaCenter(el));
			curr = el.getAttribute('_zone_id');
		}
		return false;
	};
	this.clickArea = function(id){
		hash[id].onclick();
	};
	
	this.getTipInfo = function(){
		var query = window.HotelQuery;
		var txt = c_data.zoneName[query.zoneId] || c_data.locationName[query.locationId];
		return txt ? {checked: true, text: txt + '酒店列表', fn: function(){me.events.click({});}} : {checked: false, text: '点击各区域板块显示该区域的商区信息', fn: null};
	};
	function getAreaCenter(el){
		var a = el.getAttribute('coords').match(/\d+/g);
		a.length = a.length >> 1 << 1;
		var x = 0, y = 0;
		for(var i = 0; i < a.length; i += 2){
			x += parseInt(a[i]);
			y += parseInt(a[i + 1]);
		}
		return [(x / a.length) << 1, (y / a.length) << 1];
	}
	function setJmpPos(p){
		var t = elImg.$getPos();
		//edit by cdchu
		var s = $$.browser.IE?[0,0]:[elImg.$parentNode().scrollLeft,elImg.$parentNode().scrollTop];
		elJmp.style.display = 'block';
		elJmp.style.left = p[0] - s[0] + t[0] - (elJmp.offsetWidth >> 1) + 20  + 'px';
		elJmp.style.top = p[1] - s[1] + t[1] - elJmp.offsetHeight - 5  + 'px';
	}
});
var EMap = new MadCat(function(){
	var me = this, map = {},
		markers = this.markers = [],
		mapPreciseSch = null,
		mapSearchBtn = null;
		
	this.Event = {
		X: function(e){
			return (e.clientX + (___.scrollLeft || __.body.scrollLeft)) || pageX;
		},
		Y: function(e){
			return (e.clientY + (___.scrollTop || __.body.scrollTop)) || pageY;
		},
		offsetX: function(e){
			return typeof e.offsetX=='undefined' ? e.layerX : e.offsetX;
		},
		offsetY: function(e){
			return typeof e.offsetY=='undefined' ? e.layerY : e.offsetY;
		},
		add: function(obj, evtType, fn, useCapture){
			var capture = useCapture || false;
			if (obj.attachEvent) {
				obj.attachEvent('on'+evtType, fn);
				if (capture && obj.nodeType != 9) obj.setCapture();
			} else obj.addEventListener(evtType, fn, capture);
		},
		remove: function(obj, evtType, fn, useCapture){
			var capture = useCapture || false;
			if (obj.detachEvent){
				obj.detachEvent('on'+evtType, fn);
				if (capture && obj.nodeType != 9) obj.releaseCapture();
			} else obj.removeEventListener(evtType, fn, capture);
		}
	};
	//create default icon
	this.getIcon = function(){
		var baseIcon = new GIcon();
		baseIcon.shadow = "http://pic.ctrip.com/hotels081118/marker_shadow.png";
		baseIcon.iconSize = new GSize(17, 17);
		baseIcon.shadowSize = new GSize(34, 20);
		baseIcon.iconAnchor = new GPoint(20, 17) //new GPoint(9, 17);
		baseIcon.infoWindowAnchor = new GPoint(9, 9);
		//baseIcon.infoShadowAnchor = new GPoint(18, 25);
		return baseIcon;
	};
	
	//create map control
	this.createControl = function(position, initFn, offsetX, offsetY){
		var pos = {
			'lt': G_ANCHOR_TOP_LEFT,
			'lb': G_ANCHOR_BOTTOM_LEFT,
			'rt': G_ANCHOR_TOP_RIGHT,
			'rb': G_ANCHOR_BOTTOM_RIGHT
		}, control = function(){};
		control.prototype = new GControl();
		control.prototype.initialize = initFn;
		control.prototype.getDefaultPosition = function(){
			return new GControlPosition(pos[position], new GSize(offsetX || 7, offsetY || 7));
		}
		return control;
	};
	//create hotel marker
	this.createMarker = function(latlng, index, hotelIndex){
		if (!latlng) return;
		var hotelIcon = new GIcon(this.getIcon());
		hotelIcon.image = "http://pic.ctrip.com/hotels081118/marker" + index  + ".png";
		var marker = new GMarker(latlng, { icon:hotelIcon });
		marker.id = hotelIndex;
		GEvent.addListener(marker, "click", function() {
			marker.openInfoWindowHtml(HotelList.hotels[marker.id].toString('map'));
			setTimeout(idGmPop, 2000);
		});
		return marker;
	};
	
	this.refresh = function(){
		var localResult = $('localResult'),
			localSearch = $('localSearch'),
			resultTip = $('resultTip'),
			btnBack = $('btnBack');
		var ls = this.localSearch,
			dotX = HotelQuery.dotX,
			dotY = HotelQuery.dotY;
		if ((!dotX || !dotY) && ls && me.dotMkr) {
			me.dotMkr.hide();
			me.dotMkr = null;
			if (mapPreciseSch.status) mapPreciseSch.click();
		}
		map.closeInfoWindow();
		var zoomLevel = HotelQuery.zoomLevel,
			x = HotelQuery.mapCenterX,
			y = HotelQuery.mapCenterY,
			mapIndex = 0,
			lats = [], lngs = [];
		markers.each(function(el){el.hide()});
		for (var i = 0; i < HotelList.hotels.length; i++) {
			var hotel = HotelList.hotels[i];
			if (!hotel.position) continue;
			var mkr = markers[mapIndex],
				pos = hotel.position.split('|'),
				latlng = new GLatLng(pos[0], pos[1]);
			lats.push(pos[0]);
			lngs.push(pos[1]);
			if (mkr && hotel && pos) {
				mkr.setLatLng(latlng);
				mkr.id = i;
				if (mkr.isHidden()) mkr.show();
			} else {
				var newMkr = me.createMarker(latlng, mapIndex, i);
				if (newMkr) {
					markers.push(newMkr);
					// delay add marker wait map setCenter
					(function(map, newMkr){
						setTimeout(function(){
							map.addOverlay(newMkr);
						}, 100);
					})(map, newMkr);
				}
			}
			mapIndex++;
		}
		if (dotX && dotY) {
			var latlng = new GLatLng(dotX, dotY);
			if (me.dotMkr) {
				me.dotMkr.hide();
				me.dotMkr = null;
			}
			me.dotMkr = new GMarker(latlng, { title: HotelQuery.keyword});
			setTimeout(function(){map.addOverlay(me.dotMkr);}, 100);
			lats.push(dotX);
			lngs.push(dotY);
		}
		if (HotelResult.hotelFound) {
			var maxLat = Math.max.apply(null, lats),
				maxLng = Math.max.apply(null, lngs),
				minLat = Math.min.apply(null, lats),
				minLng = Math.min.apply(null, lngs),
				lat = minLat + (maxLat - minLat) / 2,
				lng = minLng + (maxLng - minLng) / 2,
				bounds = new GLatLngBounds(new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng));
			map.setCenter(new GLatLng(lat, lng), map.getBoundsZoomLevel(bounds));
		} else {
			if (HotelQuery.dotX && HotelQuery.dotY)
				map.setCenter(new GLatLng(HotelQuery.dotX, HotelQuery.dotY), 13);
			else map.setCenter(new GLatLng(HotelQuery.mapCenterX, HotelQuery.mapCenterY), HotelQuery.zoomLevel);
		}
		if (this.localSearch) this.localSearch.markers.each(function(el){ el.hide(); });
		
//				localResult = $('localResult'),
//				localSearch = $('localSearch'),
//				btnBack = $('btnBack'),
		localResult.innerHTML = '';
		localResult.style.display = "none";
		btnBack.style.display = "none";
		resultTip.style.display = "none";
		localSearch.style.display = '';

		if(this.toPop == 0 || this.toPop){
			if(HotelView.get() == 'emap'){
				GEvent.trigger(markers[this.toPop], 'click');
			}
			this.toPop = null;
		}
	};
	this.showPop = function(hotelIndex/* or hotel name [, hotel latlng]*/){
		var args = arguments, name, latlng, pos;
		if (args[1]) {
			name = $s2t(args[0]);
			pos = args[1];
		} else {
			var htl = HotelList.hotels[hotelIndex];
			name = $s2t(htl.name);
			latlng = htl.position.split('|');
		}
		this.getMap(function(){
			if (!pos)  pos = new GLatLng(latlng[0], latlng[1]);
			maskShow($('popMapContainer'));
			var mtgt = $('mtgt_unnamed_0');
			if (!me.popMap) {
				me.popMap = new GMap2($('pop_map'));
				me.popMap.setCenter(pos, 13);
				me.popMap.addControl(new GLargeMapControl());
				var icon = me.getIcon();
				icon.shadow = '';
				icon.iconSize = new GSize(19, 27);
				icon.shadowSize = new GSize(37, 34);
				icon.image = 'http://pic.ctrip.com/hotels081118/hotel_pointer.png';
				me.popMap.marker = new GMarker(pos, { icon: icon });
				me.popMap.addOverlay(me.popMap.marker);
				me.popMap.addControl(new (me.createControl('rt', function(){
					var btn = $c('a');
					btn.className = 'searchresult_popclose';
					btn.title = $s2t('关闭弹出地图');
					me.popMap.getContainer().appendChild(btn);
					btn.onmouseover = function(){ this.style.cursor = 'pointer'; };
					btn.onclick = function(){ maskShow() };
					return btn;
				})));
				me.popMap.label = new me.Rect(pos, name);
				me.popMap.addOverlay(me.popMap.label);
				//me..addOverlay(new me.Rect(pos, 'lsdjflksdjf'));
			} else {
				me.popMap.setCenter(pos, 13);
				me.popMap.label.reset(pos, name);
				me.popMap.marker.setLatLng(pos);
			}
		});
	};

	function idGmPop(){
		var img = document.$g('div.searchresult_abbrpic');
		if(!img) return;
		img[0].id = 'gm_pop_img'
		var el = img[0].parentNode;
		while(el && el.tagName != 'DIV') el = el.parentNode;
		if(!el) return;
		el = window.$(el);
		tit = el.$('h3');
		if(!tit) return;
		tit[0].id = 'gm_pop_tit';
		btn = el.$('input');
		if(!btn) return;
		for(var i =0; i < btn.length; i ++) if(!btn[i].id) btn[i].id = 'gm_pop_btn_' + i;
		for(var i = 0; i < 3; i ++) if(el) el = el.parentNode;
		if(!el) return;
		img = window.$(el).$('img');
		if(!img || img.length < 2) return;
		img[0].id = 'gm_pop_close';
	}
	
	// create marker label overlay
	this.createOverlay = function(){
		function Rect(latlng, txt){
			this.latlng = latlng;
			this.name = txt;
		};
		Rect.prototype = new GOverlay();
		Rect.prototype.initialize = function(map){
			var div = $c('div');
			div.className = 'searchresult_popname';
			div.innerHTML = this.name;
			div.style.width = this.name.length * 16 + 'px';
			div.style.marginTop = '-15px';
			div.style.textAlign = 'center';
			map.getPane(G_MAP_MAP_PANE).appendChild(div);
			this.map = map;
			this.div = div;
		};
		Rect.prototype.remove = function(){
			this.div.parentNode.removeChild(this.div);
		};
		Rect.prototype.copy = function(){
			return new Rect(this.latlng, this.name);
		};
		Rect.prototype.redraw = function(force){
			if (!force) return;
			var pos = this.map.fromLatLngToDivPixel(this.latlng);
			this.div.style.top = pos.y + 'px';
			this.div.style.left = pos.x + 'px';
		};
		Rect.prototype.reset = function(pos, txt){
			var pos = this.map.fromLatLngToDivPixel(pos);
			this.div.style.top = pos.y + 'px';
			this.div.style.left = pos.x + 'px';
			this.div.style.width = txt.length * 13 + 'px';
			this.div.innerHTML = txt;
		};
		return Rect;
	};
	
	this.pop = function(hotelIndex){
		EMap.toPop = hotelIndex;
		HotelView.set({viewType:'emap'});
		if(document.documentElement.scrollTop > 250) document.documentElement.scrollTop = 170;
	};
	
	this.getKey = function(){
		var keys = Const.gmapKeys,
			key = document.domain.match(/prototype\.(\w+)\.sh/);
		if (key) key = keys[key[1]];
		if (!key) key = keys[document.domain] || keys.online;
		return key;
	};

	this.set = function(query, result){
		var mapstate = "";
		if(HotelView.get() == 'emap'){
			if(!this.state){
				this.init(query, result);
			}else{
				if(this.state == 'ok'){
					var _this = this;
					setTimeout(function(){
						_this.refresh();
					}, 10);
				}
			}
			if(HotelQuery.dotX){
				mapstate = "dot";
			}else if(HotelQuery.coordinateX1){
				mapstate = "rec";
			}
			
			this.tipChecked = true;
			
			if(!mapstate) this.tipChecked = false;
			else if(mapstate&&mapstate == "rec") this.tipText = "框选搜索结果";
			else if(mapstate&&mapstate == "dot") this.tipText = "所选酒店范围:"+HotelQuery.keyword+"周围"+HotelQuery.radius+"公里";
			
			HotelView.updateTip();
		}
	};
	
	this.getTipInfo = function(){
		if(!HotelQuery.coordinateX1) this.tipChecked = false;
		return {
			checked: this.tipChecked,
			text: this.tipChecked ? this.tipText : '',
			fn: this.tipChecked ? onTipClick: null
		}
	};

	this.getMap = function(callback){
		if (me.isLoaded) return callback();
		this.key = this.getKey();
		$loadJs('http://maps.google.com/maps?file=googleapi&key='+this.key+'&v=2&async=2&hl=zh_cn', 'utf-8', function(){
			var timer = setInterval(function(){
				if (typeof GMap2 == 'undefined') return;
				clearInterval(timer);
				if (GBrowserIsCompatible()) {
					me.Rect = me.createOverlay();
					callback();
					me.isLoaded = true;
				}
				else me.state = 'failure';
			}, 20);
		})
	};
	
	// local search
	this.initLocalSearch = function(){
		if (!this.isInitLocalSearch) {
			var btnBackclickhandler = function(){
				localResult.style.display = "none";
				btnBack.style.display = "none";
				resultTip.style.display = "none";
				localSearch.style.display = "";
			}
			var me = this,
				ls = me.localSearch = new google.search.LocalSearch(), sHtml = [],
				noResult = $('noResult'),
				localResult = $('localResult'),
				localSearch = $('localSearch'),
				resultTip = $('resultTip'),
				btnBack = $('btnBack'),
				distancePerLatitude = 2 * Math.PI * 6378.137 / 360; // unit is kilometer
			ls.markers = [];
			ls.schBtn = $('schBtn');
			ls.words = $('nearbyhotel');
			ls.words.onkeydown = function(e){
				var e = $fixE(e);
				if (e.keyCode == 13) {
					ls.schBtn.click();
					return false;
				}
			};
			ls.words.onfocus = function(){
				noResult.style.display = 'none';
			};
			ls.setCenterPoint(me.map);
			ls.setResultSetSize(GSearch.LARGE_RESULTSET);
			me.post = function(res){
				var lat = res.lat, lng = res.lng,
					distance = $('rSel').value,
					deltaLatitude = distance / distancePerLatitude,
					distancePerLongitude = distancePerLatitude * Math.cos(lat),
					deltaLongitude = distance / distancePerLongitude;
				me.events.localsearch({
					dotX: lat,
					dotY: lng,
					radius: distance,
					keyword: res.titleNoFormatting,
					coordinateX1: lat - deltaLatitude,
					coordinateY1: lng - deltaLongitude,
					coordinateX2: lat - (-deltaLatitude),
					coordinateY2: lng - (-deltaLongitude)
				});
				mapPreciseSch.click();
			}
			ls.setSearchCompleteCallback(null, function(){
				var res = ls.results, resLen = res.length;
				if (resLen) {
					noResult.style.display="none";
					var	title = res[0].titleNoFormatting, keyWord = ls.words.value;
					if (resLen == 1 || title == keyWord || title == HotelQuery.cityName + keyWord || title == HotelQuery.cityName + '市' + keyWord) {
						me.post(res[0]);
						return;
					}
					// 8 markers
					ls.markers.each(function(el){ el.hide(); });
					for (var n = 0; n < resLen; n++) {
						var latlng = new GLatLng(res[n].lat, res[n].lng),
							mkr = ls.markers[n];
						sHtml.push('<a href="javascript:EMap.post(EMap.localSearch.results['+n+'])" title = "' + res[n].titleNoFormatting + '" class="searchresult_pinlink'+(n+1)+'">' + res[n].title + '</a>');
						if (mkr) {
							mkr.setLatLng(latlng);
							if (mkr.isHidden()) mkr.show();
						} else {
							var icon = me.getIcon(),
								letter = String.fromCharCode('A'.charCodeAt(0) + n);
							icon.iconSize = new GSize(20, 20);
							icon.shadowSize = new GSize(37, 25);
							//baseIcon.iconAnchor = new GPoint(20, 17) //new GPoint(9, 17);
							icon.image = 'http://pic.ctrip.com/hotels081118/marker' + letter + '.png';
							var nMkr = new GMarker(latlng, {icon: icon});
							ls.markers.push(nMkr);
							me.map.addOverlay(nMkr);
						}
					}
					localResult.innerHTML = '<li>' + sHtml.join('</li><li>') + '</li>';
					localResult.style.display = '';
					btnBack.style.display = '';
					resultTip.style.display = '';
					resultTip.innerHTML = $s2t('您所搜索的关键字共有'+resLen+'个结果');
					localSearch.style.display = 'none';
					btnBack.onclick = btnBackclickhandler;
					sHtml.length = 0;
				} else {
					noResult.style.display = '';
					localResult.innerHTML = '';
					localResult.style.display = 'none';
				}
			});
			ls.schBtn.onclick = function(){
				if (ls.words.isNull()) {
					$alert(ls.words, $s2t('请输入关键字'), false, 'lb', 'lt');
					return false;
				}
				ls.execute((new RegExp(HotelQuery.cityName)).test(ls.words.value)?ls.words.value:(HotelQuery.cityName+ls.words.value));
			};
			me.isInitLocalSearch = true;
		}
		if(!ishidden(this.localSearch.words)){
			this.localSearch.words.focus();
		}
	};

	this.init = function(query, result){
		mapPreciseSch = $('mapPreciseSch');
		mapSearchBtn = $('mapSearchBtn');
		
		if(HotelView.get() != 'emap') return;
		this.state = 'init';
		this.getMap(function(){
			map = me.map = new GMap2($('htl_map'));
			//map.disableDoubleClickZoom();
			map.addControl(new GLargeMapControl());
			me.refresh();
			var c = map.getCenter();
			HotelQuery.mapCenterX = c.lat();
			HotelQuery.mapCenterY = c.lng();
			HotelQuery.zoomLevel = map.getZoom();
			me.state = 'ok';
			/* get latlng by city name
			new GClientGeocoder().getLatLng(query.cityName, function(c){
				map.setCenter(c, 11);
				me.refresh();
				me.state = 'ok';
			});*/
			
			var rect = $('rect'),
				bottomMask = $('bottomMask'),
				topMask = $('topMask'),
				mapSearchBox = $('mapSearchBox'),
				normalMap = $('normalMap'),
				satelliteMap = $('satelliteMap'),
				closeBtn = $('closeBtn'), rSel = $('rSel'),
				noResult = $('noResult'),
				x0, y0, x1, y1,
				cx0, cy0, cx1, cy1;
			mapSearchBtn.onclick = function(){
				map.closeInfoWindow();
				if (this.status) {
					bottomMask.style.display = topMask.style.display = 'none';
					this.className = 'searchresult_searchbtn';
					this.status = false;
				} else {
					this.className = 'searchresult_searchbtn_on';
					mapPreciseSch.className = 'searchresult_searchbtn3';
					mapPreciseSch.status = false;
					mapSearchBox.style.display = 'none';
					rSel.style.display = 'none';
					noResult.style.display = 'none';
					bottomMask.style.display = topMask.style.display = 'block';
					/*
					if (me.isInitLocalSearch && me.localSearch.markers.length) {
						me.localSearch.markers.each(function(el){el.hide();});
					}*/
					this.status = true;
				}
			};
			// switch map type button
			normalMap.onclick = function(){
				if (!this.status) {
					map.setMapType(G_NORMAL_MAP);
					satelliteMap.className = 'searchresult_searchbtn2';
					satelliteMap.status = false;
					this.className = 'searchresult_searchbtn2_on';
					this.status = true;
				}
			};
			satelliteMap.onclick = function(){
				if (!this.status) {
					map.setMapType(G_HYBRID_MAP);
					normalMap.className = 'searchresult_searchbtn2';
					normalMap.status = false;
					this.className = 'searchresult_searchbtn2_on';
					this.status = true;
				}
			};

			// precise search button
			mapPreciseSch.onclick = function(){
				map.closeInfoWindow();
				if (this.status) {
					this.className = 'searchresult_searchbtn3';
					mapSearchBox.style.display = 'none';
					rSel.style.display = 'none';
					this.status = false;
				} else {
					this.className = 'searchresult_searchbtn3_on';
					bottomMask.style.display = topMask.style.display = 'none';
					mapSearchBox.style.display = '';
					rSel.style.display = '';
					mapSearchBtn.className = 'searchresult_searchbtn';
					mapSearchBtn.status = false;
					this.status = true;
					me.initLocalSearch();
				}
			};
			closeBtn.onclick = function(){
				mapPreciseSch.click();
				rSel.style.display = 'none';
				noResult.style.display = 'none';
			};
			
			setOpacity(bottomMask, 0.3);
			setOpacity(topMask, 0);
			me.Event.add(topMask, 'mousedown', function(e){
				var e = $fixE(e),
					btn = e.button || e.which;
				if (btn != 1) return false;
				topMask.style.cursor = 'crosshair';
				x0 = me.Event.offsetX(e);
				y0 = me.Event.offsetY(e);
				cx0 = me.Event.X(e);
				cy0 = me.Event.Y(e);
				rect.style.left = x0 + 'px';
				rect.style.top = y0 + 'px';
				rect.style.width = 0;
				rect.style.height = 0;
				rect.style.display = 'block';
				if (e.preventDefault) e.preventDefault();
				else e.returnValue = false;
				function move(e){
					var e = $fixE(e),
						el = e.$target;
					x1 = me.Event.offsetX(e);
					y1 = me.Event.offsetY(e);
					cx1 = me.Event.X(e);
					cy1 = me.Event.Y(e);
					if (el == topMask) {
						rect.style.left = Math.min(x0, x1+1) + 'px';
						rect.style.top = Math.min(y0, y1+1) + 'px';
						rect.style.width = Math.abs(Math.abs(x1-x0)-2) + 'px';
						rect.style.height = Math.abs(Math.abs(y1-y0)-2) + 'px';
					}
				}
				me.Event.add(topMask, 'mousemove', move, true);
				function up(e){
					rect.style.display = 'none';
					if (e.stopPropagation) e.stopPropagation();
					else e.cancelBubble = true;
					topMask.style.display = 'none';
					bottomMask.style.display = 'none';
					topMask.style.cursor = 'normal';
					me.Event.remove(topMask, 'mousemove', move, true);
					me.Event.remove(topMask, 'mouseup', up);
					me.Event.remove(__, 'mouseup', up);
					mapSearchBtn.click();
					var e = $fixE(e),
						w = rect.style.width.toInt(),
						h = rect.style.height.toInt(),
						x2 = x0 + (cx1<cx0?-w:w),
						y2 = y0 + (cy1<cy0?-h:h),
						container = map.getContainer(),
						mapWidth = container.offsetWidth,
						mapHeight = container.offsetHeight;
					if (x2 == x0 && y2 == y0) return false;
					var latlng0 = map.fromContainerPixelToLatLng(new GPoint(x0, y0)),
						latlng2 = map.fromContainerPixelToLatLng(new GPoint(x2, y2)),
						zoomRate = Math.floor(((w/h)>(mapWidth/mapHeight)?(mapWidth/w):(mapHeight/h))/2);
					x0 = latlng0.lat();
					y0 = latlng0.lng();
					x2 = latlng2.lat();
					y2 = latlng2.lng();
					var scale = map.getZoom() + zoomRate;
					if (scale>17) scale = 17;
					var center = map.getCenter();
					QueryEngine.record({
						mapCenterX: center.lat(),
						mapCenterY: center.lng(),
						zoomLevel: map.getZoom()
					});
					me.events.mouseup({
						coordinateX1: Math.min(x0, x2),
						coordinateY1: Math.min(y0, y2),
						coordinateX2: Math.max(x0, x2),
						coordinateY2: Math.max(y0, y2),
						mapCenterX: x0+(x2-x0)/2,
						mapCenterY: y0+(y2-y0)/2,
						zoomLevel: scale
					});
				}
				me.Event.add(topMask, 'mouseup', up);
				me.Event.add(__, 'mouseup', up);
			})
		});
		// add title to marker
		___.onmouseover = function(e){
			var e = $fixE(e),
				el = e.$target,
				src = el.src,
				index = src?src.match(/marker(\d+)\.png/):null;
			if (el.tagName == 'IMG' && src && index) {
				el.title = el.alt = HotelList.hotels[EMap.markers[index[1]].id].name;
			}
			index = src ? src.match(/marker([A-H])\.png/) : null;
			if (el.tagName == 'IMG' && src && index) {
				el.title = el.alt = EMap.localSearch.results[index[1].charCodeAt(0) - 65].titleNoFormatting;
			}
		};
	};
	this.events.mouseup = function(obj){
		if(MadCat.debug) alert('EMap mouseup: ' + $toJson(obj));
	};
	function setOpacity(obj, alpha){
		if ($$.browser.IE) obj.style.filter = 'alpha(opacity=' + alpha * 100 + ')';
		else obj.style.opacity = alpha;
	}
	function onTipClick(){
		if (mapPreciseSch.status) mapPreciseSch.click();
		if (mapSearchBtn.status) mapSearchBtn.click();
		me.events.mouseup({});
	}
});
//Chunk
QueryEngine = (function(){
	var query;
	var result;
	var all;
	var last_query;
	
	var amapReset;
	var emapReset;
	
	$$.history.enabled = true;
	if(!/prototype/.test(location.href)) $$.history.blank = '/webresource/ui/blank.html';
//	$$.history.callback['#'] = $$.history.callback.query_engine = function(){
//		loadState();
//		invokeAll('set');
//		updateBack();
//	};

	return {
		load: load,
		retry: function (){makeQuery(last_query)},
		makeQuery: makeQuery,
		query: query,
		result: result,
		record: record
	};
	
	function load(){
		if(!window.HotelQuery) return;
		loadState();
		query.orderBy = query.orderBy ? query.orderBy.toLowerCase() : 'ctrip';
		query.orderType = query.orderType ? query.orderType.toLowerCase() : 'asc';
		saveState();
		all = [HotelSearch, HotelFilter, HotelLabel, HotelList, HotelView, HotelSort, HotelPage, AMap, EMap];
		invokeAll('init');
		invokeAll('set');
		HotelSearch.evt('submit', makeQueryDeep);
		HotelFilter.evt('click', makeQuery);
		HotelView.evt('change', viewChange);
		HotelSort.evt('change', makeQuery);
		HotelPage.evt('click', makeQuery);
		AMap.evt('click', makeQueryMap);
		EMap.evt('mouseup', makeQueryMap);
		EMap.evt('localsearch', makeQueryMap);
	}
	
	function record(obj){
		var q = merge(query, obj);
		saveState(q, result);
	}
	function invokeAll(fn){
		if(fn == 'set') HotelList.changed = true;
		all.each(function(ob){ob[fn](query, result)});
	}	
	function viewChange(viewType){
		AMap.showPop(null);
		query.viewType = viewType;
	}
	function makeQuery(obj){
		last_query = obj;
		if(obj && ('page' in obj == false)) obj.page = '1';
		var q = merge(query, obj);
		q.allHotels = result.allHotels;
		HotelView.showWait();
		if(window.QueryServerNew){
			makeQueryNew(q);
		}else $ajax(window.QueryServer, qstring(q), function(txt){
			if(txt == null){
				HotelView.showFailure();
			}else{
				HotelView.hideWait();
				saveState(q, eval('(' + txt + ')'));
				invokeAll('set');
				document.documentElement.scrollTop = 170;
			}
		});
	}
	function makeQueryDeep(obj){
		makeQuery(merge(obj, {
			hotelType: '',
			hotelStar: '',
			hotelEquipment: '',
			orderBy: 'ctrip',
			orderType: 'desc',
			page: '1',
			coordinateX1: '',
			coordinateY1: '',
			coordinateX2: '',
			coordinateY2: '',
			mapCenterX: '',
			mapCenterY: '',
			zoomLevel: ''
		}));
	}
	function makeQueryNew(obj){
		//to debug
		var form = document.createElement('form');
		form.action = window.QueryServerNew;
		form.method = 'post';
		var arr = [];
		for(var s in obj){
			if(obj.hasOwnProperty(s)){
				arr.push('<input name="{$0}" value="{$1}" type="hidden">'.replaceWith([
					s, (obj[s] + '').replace(/"/g, '$quot;')
				]));
			}
		}
		form.innerHTML = arr.join('');
		document.body.appendChild(form);
		form.submit();
	}
	function makeQueryMap(obj){
		makeQuery(merge({
			zoneId: '',
			locationId: '',
			coordinateX1: '',
			coordinateY1: '',
			coordinateX2: '',
			coordinateY2: '',
			dotX: '',
			dotY: '',
			radius: ''
		}, obj));
	}
	function merge(){
		var ret = {};
		for(var i = 0; i < arguments.length; i ++){
			var ob = arguments[i];
			if(ob) for(var s in ob) ret[s] = ob[s];
		}
		return ret;
	}
	function qstring(obj){
		var ret = [];
		for(var s in obj) ret.push(s + '=' + escape(obj[s]));
		return ret.join('&');
	}
	function saveState(q, r){
		if(q && r){
			window.HotelQuery = query = q;
			if(!r.hotelFound) r.filterInfo = [];
			else if(r.filterInfo == null) r.filterInfo = result.filterInfo;
			window.HotelResult = result = r;
		}
		$pageValue.set('query', query);
		$pageValue.set('result', result);
	}
	function loadState(){
		window.HotelQuery = query = $pageValue.get('query') || window.HotelQuery;
		window.HotelResult = result = $pageValue.get('result') || window.HotelResult;
	}
})();

//Entry
(function(){
	$each(Msg, function(k, v){Msg[k] = $s2t(v)});
	$r('domready', function(){
		$loadJs('http://webresource.ctrip.com/code/js/public/public_maskShow_080229.js', 'gb2312', function(){
			if(window.maskShow){
				maskShow.bgColor = '#666';
				maskShow.bgAlpha = 0.6;
			}
		});
		window.fm = $F(document.forms[0]);
		if(window.HotelResult){
			QueryEngine.load();
		}else if($('selHotelStar')){
			var f = document.forms[0];
			var t = {
				cityId: '',
				districtId: '',
				zoneId: '',
				locationId: '',
				checkIn: '',
				checkOut: '',
				hotelName: '',
				priceLow: '',
				priceHigh: '',
				hotelType: '',
				hasPKGHotel: '',
				hotelStar: ''
			};
			window.HotelQuery = {};
			$each(t, function(k, v){
				t[k] = f[k].value;
				window.HotelQuery[k] = t[k];
			});
			HotelSearch.init(t);
			HotelSearch.set(t);
			[[f.selHotelType, f.hotelType], [f.selHotelStar, f.hotelStar]].each(function(a){
				var sel = a[0], hid = a[1];
				var t = sel.options;
				var s = hid.value || sel.options[0].value;
				for(var i = 0; i < t.length; i ++) if(s.indexOf(t[i].value) == 0) break;
				sel.selectedIndex = i % t.length;
				sel.onchange = function(){hid.value = this.value};
			});
			HotelSearch.evt('submit', function(obj){
				if(f.__action && f.__action.value) f.action = f.__action.value;
				$each(obj, function(k, v){f[k].value = v});
				f.submit();
			});
		}
	}, 55);
})();
