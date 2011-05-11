//by gftian
//2008-5-6
function array(obj,f,t){
	var r=[];
	f=f||0;
	t=Math.min(t||obj.length,obj.length);
	for(var i=f;i<t;i++)
		r.push(obj[i]);
	return r;
}
function extend(a,b){
	for(var s in b)
		a[s]=b[s];
	return a;
}
function addEvent(el,evt,fn){
	if(!el)
		return;
	if('attachEvent' in el)
		el.attachEvent('on'+evt,fn);
	else
		el.addEventListener(evt,fn,false);
}

function stopEvent(evt){
	evt=evt||window.event;
	if(evt.preventDefault)
		evt.preventDefault();
	else
		evt.returnValue=false;
}
function srcElement(evt){
	evt=evt||window.event;
	return evt.srcElement||evt.target;
}
function ownerTable(el){
	while(el&&el.tagName!='TABLE')
		el=el.parentNode;
	return el;
}
function srcTable(evt){
	return ownerTable(srcElement(evt));
}
function dateParse(str){
	var hash=dateParse.hash||(dateParse.hash={});
	if(str in hash)
		return hash[str];
	var ret=null;
	var m=str.match(/^(\d{4})-([01]?\d)-([0123]?\d)$/);
	if(m){
		var d=new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10));
		if([d.getFullYear(),d.getMonth()+1,d.getDate()].join('-')==str.replace(/-0/g,'-'))
			ret=d;
	}
	return hash[str]=ret;
}
function formatCurrency(num){
	var s=num.toFixed(0)+',';
	var r=/(\d)(\d{3},)/;
	while(r.test(s))
		s=s.replace(r,'$1,$2');
	return s.slice(0,-1);
}

//s2t
String.prototype.s2t = function(){
	return $s2t(this);
};
window.$alertEx = function(el, msg){
	$alert(el, msg.s2t());
	return false;
};
String.birth = function(){
	if(String._birth)
		return String._birth;
	else{
		var f = document.forms[0].DDatePeriod1 || document.forms[1] && document.forms[1].DDatePeriod1;
		var t = g_config.pkgDepartDate ? new Date(Date.parse(g_config.pkgDepartDate)) : f ? dateParse(f.value) : new Date();
		var y = t.getFullYear();
		var m = t.getMonth();
		var d = t.getDate();
		return String._birth ={
			ref: t,
			baby: new Date(y - 2, m, d+1),
			child: new Date(y - 12, m, d+1),
			sixteen: new Date(y - 16, m, d),
			eldor:new Date(y - 70, m , d)
		};
	}
};
String.prototype.isChild = function(){
	return dateParse(this) > String.birth().child;
};
String.prototype.isBaby = function(){
	return dateParse(this) > String.birth().baby;
};
String.prototype.underSixteen = function(){
	return dateParse(this) > String.birth().sixteen;
};
String.prototype.isEldor = function(){
	return dateParse(this) < String.birth().eldor;
}
String.prototype.laterThenDepart = function(){
	return dateParse(this) > String.birth().ref;
};
String.prototype.laterThenToday = function(){
	return dateParse(this) > new Date();
};
String.prototype.isEmailAdd = function(){
	return /[^@]@/.test(this)
};


var g_config=null;

var c_basic_fields=["userId","passengerName","passengerIDCardType","passengerCardID","passengerNationalityName","passengerSex","passengerBirth"];
var c_extra_fields={
	'FD':["mobilePhone","card1Number","card2Number","businessCardNumber"],
	'FDI':["mobilePhone","card1Number","card2Number","passportType","IDcardTimeLimit","IDcardTimeBegin","postCode","destnationAddress","livingAddress","businessCardNumber"],
	'PKG':["telNumber","businessCardNumber"]
};
var c_hidden_fields=['passengerNationality','passengerIDCardTypeId'];

var c_def_fields={};

var c_msg={
	passenger:'登机人：',
	newPassenger:'新登机人',
	updateName:'更新该常用姓名',
	saveName:'保存到常用姓名',
	birthFormat: '格式：yyyy-mm-dd',
	babyTicket:'建议购买婴儿票',
	childTicket:'建议购买儿童票',
	sixteenMsg: '请确认有成人陪伴',
	englishName:'英文姓名',
	needTelNum:'请至少输入一位出行旅客的联系电话'   //for PKG
};
var c_msg_pkg={
	passenger:'旅客：',
	newPassenger:'新旅客'
};

var c_id_cards={
	1: {name:"身份证",allow:"chs"},
	2: {name:"护照",allow:"all"},
	3: {name:"学生证",allow:"chs"},
	4: {name:"军人证",allow:"chs"},
	7: {name:"回乡证",allow:"all"},
	8: {name:"台胞证",allow:"all"},
	10:{name:"港澳通行证",allow:"chs"},
	11:{name:"国际海员证",allow:"all"},
	20:{name:"外国人永久居留证",allow:"eng"},
	21:{name:"旅行证",allow:"chs"},
	99:{name:"其他",allow:"chs"}
};

var c_id_cards_new={
	1: {name:"身份证",allow:"chs"},
	2: {name:"护照",allow:"all"},
	3: {name:"学生证",allow:"chs"},
	4: {name:"军人证",allow:"chs"},
	10:{name:"港澳通行证",allow:"chs"},
	22:{name:"台湾通行证",allow:"all"},
	8: {name:"台胞证",allow:"all"},
	7: {name:"回乡证",allow:"all"},
	11:{name:"国际海员证",allow:"all"},
	20:{name:"外国人永久居留证",allow:"eng"},
	21:{name:"旅行证",allow:"chs"},
	99:{name:"其他",allow:"chs"}
};

var c_user_splitter=String.fromCharCode(12);
var c_field_splitter='|';
var c_max_cards=10;
var c_max_boards=9;
var c_ini_boards=1;
var c_cardbox_id='userList';
var c_template_id='boardingTemplate';
var c_boardbox_id='boardingList';
var c_newuser_prefix='@';
var c_business_prefix='-';
var c_cardid_prefix='uc_';
var c_filter_id='userFilter';
var c_addnew_id='addNew';
var c_showall_id='showAll';
var c_nationid_src='http://webresource.ctrip.com/code/js/resource/address_tuna/nationality_{$charset}.js';

var c_idsuggest_cls='prifltpassenger_paperleft';
var c_board_clx_reg=/\d$/;
var c_active_board_clx='1';
var c_normal_board_clx='2';
var c_user_checked_cls='selected';
var c_user_nocheck_cls='';
var c_chinese_id='1';
var c_chinese_text='中国大陆'.s2t();
var c_chinese_short='CN';
var c_passport_id='2';
var c_api_reg=new RegExp('^[^/]+/[^/]+/[^/]+$');

var c_passport_text = '护照'.s2t();
var c_china_text = '中国'.s2t();
var c_china_mainland = '中国大陆'.s2t();
var c_china_tw = '中国台湾'.s2t();

var c_country_del = ["China HongKong","China Macau","China Taiwan"];
var c_country_add = ["Australia|澳大利亚|AU@" , "Singapore|新加坡|SG@" , "Malaysia|马来西亚|MY@"];

var c_name_notice = {
	all: '所选证件上的姓名',
	chs: '中文或拼音',
	eng: 'last/first middle'
};

var c_name_label = {
	all: '姓名',
	chs: '中文姓名',
	eng: '英文姓名'
};

var c_modifygo_id = "modify_go";  //modify go flight
var c_modifyback_id = "modify_back"; //modify back flight

//s2t

[c_msg, c_msg_pkg, c_id_cards, c_id_cards_new, c_name_notice, c_name_label].each(function(ob){
	if(ob != c_id_cards && ob != c_id_cards_new)
		for(var s in ob) ob[s] = ob[s].s2t();
	else
		for(var s in ob) ob[s].name = ob[s].name.s2t();
});

var User=function(dat,checked){
	this.checked=!!checked;
	this.business=dat.charAt(0)==c_business_prefix;  //是否为商旅
	this.data=User.readData(dat,this.business);
	var n=this.data.passengerName.split(c_field_splitter);
	this.chsName=n[0];
	this.engName=n[1];
	this.allName=(g_config.FDI ? n.reverse() : n).join(' ').trim();
	this.idCards=User.extractIdCards(this.data);
	this.firstIdType=this.idCards._first;
	if(this.data.userId == 'X'){
		this.zltFlag = true; //暂缓改立即
		this.data.userId = c_newuser_prefix+Math.random().toString().substr(2,5);
	}
	UserList.add(this);
};
User.prototype={
	toSource:function(){  //登机人信息转换为字符串，以ASCII 12分割各种信息
		var i=0;
		var a=[];
		for(var s in this.data)
			a.push(this.data[s]);
		a.push(this.checked);
		return a.join(c_user_splitter);
	},
	getProper:function(){
		var ret=extend({},this.data); 
		var fit=this.firstIdType;
		ret.passengerIDCardType=c_id_cards[fit].name;
		ret.passengerCardID=this.idCards[fit];
		ret.passengerIDCardTypeId=fit;
		if(fit==c_chinese_id&&ret.passengerCardID.isChinaIDCard())
			extend(ret,User.parseChineseId(ret.passengerCardID));
		if(g_config.needName=='both'){
			ret.passengerName=this.engName;
			ret.passengerChsName=this.chsName;
		}else if(g_config.FDI||g_config.needName=='eng')
			ret.passengerName=this.engName||this.chsName;
		else
			ret.passengerName=this.chooseName(fit);
		if(g_config.FDI){
			ret.IDcardTimeLimit=ret.passengerCardID.limit;
			ret.passportType=ret.passengerCardID.type;
		}
		return ret;
	},
	chooseName:function(idtype){
		var n=c_id_cards[idtype].allow;
		if(n=='all')
			n='chs';
		return this[n+'Name']||this.allName;
	},
	toHtml:function(){
		if(!g_config.FDI){
			var s=this.data.passengerName.replace(/^\|/,'');
			var c=this.checked?' class="selected"':'';
			return '<a href="#" id="'+c_cardid_prefix+this.data.userId+'"'+c+'>'+s.split('|',2).join('<br>')+'</a>';
		}else{
			var s=this.data.passengerName.replace(/^\|/,'').split('|');
			var c=this.checked?' class="selected"':'';
			var t;
			if(!s[1]) t=s[0];
			else if(!g_config.FDI) t = s[0]+'<br>'+s[1];
			else t = s[1]+'<br>'+s[0];
			return '<a href="#" id="'+c_cardid_prefix+this.data.userId+'"'+c+'>'+t+'</a>';
		}
	},
	toggleCheck:function(){
		this.checked=!this.checked;
		if(this.checked){
			if(!BoardList.insert(0,this.data.userId))
				this.checked=false;
		}else{
			BoardList.remove(this.data.userId);
		}
		this.updateCard();
	},
	updateCard:function(){
		var el=document.getElementById(c_cardid_prefix+this.data.userId);
		if(el)
			Board.setClass(el,this.checked?c_user_checked_cls:c_user_nocheck_cls);
	}
};
User.parseChineseId=function(s){
	var x,b;
	if (s.length==15){
		x=parseInt(s.charAt(14),10)%2?'M':'F';
		b=s.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/,"19$1-$2-$3");
	}else{
		x=parseInt(s.charAt(16),10)%2?'M':'F';
		b=s.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/,"$1-$2-$3");
	}
	return {
		passengerSex:x,
		passengerBirth:b,
		passengerNationalityName:c_chinese_text,
		passengerNationality:c_chinese_short
	};
};
User.readData=function(dat,busi){
	var ret={};
	var arr=dat.split(c_user_splitter);
	var tag=c_basic_fields.concat(c_extra_fields[g_config.type]);
	//for(var i=0,n=busi?tag.length:tag.length-1;i<n;i++)
	for(var i=0,n=tag.length;i<n;i++)
		ret[tag[i]]=arr[i]||'';
	for(var i=0;i<c_hidden_fields.length;i++)
		ret[c_hidden_fields[i]]='';
	if(busi)
		ret.userId+='$'+ret.businessCardNumber;
	return ret;
};
User.extractIdCards=function(dat){
	var ret={};
	for(var typ in c_id_cards)
		ret[typ]='';
	var t=dat.passengerIDCardType.split(c_field_splitter);
	var n=dat.passengerCardID.split(c_field_splitter);
	var l=(dat.IDcardTimeLimit||'').split(c_field_splitter);
	var p=(dat.passportType||'').split(c_field_splitter);
	for(var i=0;i<t.length;i++)
		if(n[i]&&c_id_cards[t[i]]&&c_id_cards[t[i]].usable){
			var x=t[i];
			ret[x]=new String(n[i]);
			ret[x].limit=l[i]||'';
			ret[x].type=p[i]||'';
			if(!ret._first) ret._first=x;
		}
	if(!ret._first)
		ret._first=c_def_fields.passengerIDCardTypeId;
	return ret;
};
User.loadDefault=function(template){
	var fld=template.fld;
	for(var s in fld){
		var el=fld[s];
		if(el.type=='checkbox')
			c_def_fields[s]=el.checked?'true':'false';
		else
			c_def_fields[s]=el.value;
	}

	var it=c_def_fields.passengerIDCardType;
	for(var s in c_id_cards){
		var t=c_id_cards[s];
		if(s==it||t.name==it){
			c_def_fields.passengerIDCardType=t.name;
			c_def_fields.passengerIDCardTypeId=s;
			break;
		}
	}
	if(!c_def_fields.passengerIDCardTypeId){
		c_def_fields.passengerIDCardTypeId=c_chinese_id;
		c_def_fields.passengerIDCardType=c_id_cards[c_chinese_id].name;
	}
};
User.init = function(){
	this.possibleName = g_config.FD ? 'all' : g_config.FDI ? 'eng' :
	g_config.needName == 'chs' ? 'chs' : 'eng';
};

var UserList=(function(){
	var hash={};
	var busiHash={};
	var arr=[];
	var key=false;
	var cardBox=null;
	var nationHash=null;
	function output(a){
		var b=[];
		for(var i=0;i<a.length&&i<c_max_cards;i++)
			b.push(a[i].toHtml());
		cardBox.innerHTML=b.join('');
	}
	function boxClick(e){
		stopEvent(e);
	}
	function boxMousedown(e){
		var el=srcElement(e);
		if(el.tagName=='A')
			UserList.get(el.id.slice(3)).toggleCheck();
	}
	function filterKeyup(e){
		var el=srcElement(e);
		UserList.filter(el.isNull()?'':el.value);
	}
	function addNew(e){
		stopEvent(e);
		BoardList.insert();
	}
	function showAll(e){
		stopEvent(e);
		//magic
		c_max_cards=window.Infinity;
		cardBox.style.height="152px";
		cardBox.style.overflowY="auto";
		key=false;
		UserList.filter('');
	}
	function checkNation(user){
		if(!nationHash)
			return;
		var d=user.data;
		var n=nationHash[d.passengerNationalityName];
		if(!n)
			return;
		d.passengerNationalityName=n.name;
		d.passengerNationality=n.id;
		if(user.checked){
			var bod=BoardList.get(d.userId);
			if(!bod.getValue('passengerNationality')){
				bod.setValue('passengerNationalityName',n.name);
				bod.setValue('passengerNationality',n.id);
			}
		}
	}
	function getMore(str){
		//magic
		if(str==null){
			document.getElementById(c_showall_id).style.display = "none";
			//$('showAll').$ur('click', showAll);
			return;
		}
		var d=str.trim().match(/[^\r\n]+/g);
		if(!d||d.length==0){
			document.getElementById(c_showall_id).style.display = "none";
			return;
		}
		for(var i=0;i<d.length;i++) new User(d[i]);
		UserList.filter(key);
	}
	
	return {
		init:function(){
			cardBox=document.getElementById(c_cardbox_id);
			if(g_config.ticketTag){
				cardBox.style.display='none';
				var ar=g_config.userInfo;
				for(var i=0;i<ar.length;i++)
					new User(ar[i]);
				return;
			}
			addEvent(cardBox,'click',boxClick);
			addEvent(cardBox,'mousedown',boxMousedown);
			addEvent(document.getElementById(c_filter_id),'keyup',filterKeyup);
			addEvent(document.getElementById(c_addnew_id),'click',addNew);
			addEvent(document.getElementById(c_showall_id),'click',showAll);
			var obj=Status.get('userlist');
			if(obj){
				for(var s in obj)
					new User(obj[s],/true$/.test(obj[s]));
			}else{
				var ar=g_config.userInfo;
				for(var i=0;i<ar.length;i++)
					new User(ar[i]);
				setTimeout(function(){
					$ajax(g_config.userInfoAjax,null,getMore);
				},3000);
			}
			var k=Status.get('userfilter');
			UserList.filter(k?k.key:'');
		},
		add:function(user){
			var uid=user.data.userId;
			if(!user.business){
				if(uid in hash)
					return;
				if(nationHash)
					checkNation(user);
				arr.push(user);
				hash[uid]=user;
			}else{
				if(uid in busiHash)
					return;
				user.data.userId=uid;
				if(nationHash)
					checkNation(user);	
				busiHash[uid]=user;
			}
		},
		get:function(uid){
			//uid = uid.replace(/\$\d+$/,'');
			return hash[uid]||busiHash[uid]||null;
		},
		filter:function(k){
			if(k===key)
				return;
			key=k;
			if(!/[^\s　]/.test(k))
				output(arr);
			var a=[];
			for(var i=0,j=0;i<arr.length&&j<c_max_cards;i++)
				if(arr[i].data.passengerName.indexOf(k)>-1){
					a.push(arr[i]);
					j++;
				}
			output(a);
		},
		loadnation:function(){
			var a=$$.module.address.source.nationality.slice(1,-1).split('@');
			var h=nationHash={};
			for(var i=0;i<a.length;i++){
				var t=a[i].split('|');
				h[t[1]]=h[t[2]]={name:t[1],id:t[2]};
			}
			for(var i=0;i<arr.length;i++)
				checkNation(arr[i]);
		},
		save:function(){
			var obj={};
			for(var s in hash){
				var u=hash[s];
				obj[u.data.userId]=u.toSource();
			}
			for(var s in busiHash){
				var u=busiHash[s];
				if(!u.checked)
					break;
				obj[u.data.userId]=u.toSource();
			}
			Status.set('userlist',obj);
			Status.set('userfilter',{key:key});
		},
		arr:arr
	};
})();

var Board=function(tbl,uid){
	tbl.bod=this;
	tbl.uid=uid;
	this.tbl=tbl;
	this.uid=uid;
	this.fld=tbl.fld;
	this.fill();
	Board.show(true,tbl);
};
Board.prototype={
	fill:function(obj){
		if(!obj){
			var u=UserList.get(this.uid);
			obj=u?u.getProper():c_def_fields;
			var lbl=this.tbl.lbl;
			Board.setHtml(lbl.passenger_name,(u&&!u.business?c_msg.passenger+u.allName:c_msg.newPassenger)+
				(g_config.pkgOffline?' <a href="#;" onclick="BoardList.smith(\''+this.uid+'\');return false">['+(g_config.pkgOfflineCopy||'复制到所有人')+']</a>':''));
			Board.setHtml(lbl.save_label,u?c_msg.updateName:c_msg.saveName);
			if(g_config.FDI)
				lbl.save_label.parentNode.style.visibility=u?'hidden':'visible';
			Board.setClass(lbl.id_suggest,lbl.id_suggest.className.replace(/( \w+)?$/,u?'':' '+c_idsuggest_cls));
		}
		for(var s in obj)
			this.setValue(s,obj[s]);
		this.checkIdType();
	},
	fillId:function(typeid){
		var u=UserList.get(this.uid);
		var d={
			passengerIDCardType:c_id_cards[typeid].name,
			passengerIDCardTypeId:typeid,
			passengerCardID:u?u.idCards[typeid]:''
		};
		if(g_config.FDI){
			d.IDcardTimeLimit=u?u.idCards[typeid].limit:'';
			d.passportType=(u?u.idCards[typeid].type:'')||'P';
		}
		this.fill(d);
	},
	fillName:function(text){
		if(text == c_name_notice.chs || text == c_name_notice.eng){
			this.fld.passengerName.value = '';
		}else{
			this.setValue('passengerName',text);
		}
	},
	dispose:function(){
		var user=UserList.get(this.uid);
		if(user){
			user.checked=false;
			user.updateCard();
		}
		var tbl=this.tbl;
		tbl.bod=null;
		tbl.uid=null;
		this.tbl=null;
		this.fld=null;
		
		//magic
		if($alert.element)
			$alert.element.clearAlert();
		Board.show(false,Board.tuna_address||(Board.tuna_address=$('tuna_address')));
		
		return tbl;
	},
	getValue:function(name){
		var el=this.fld[name];
		if(!el)
			return '';
		else if(el.type=='checkbox')
			return el.checked;
		else if(el.isNull&&el.isNull())
			return '';
		else
			return el.value;
	},
	setValue:function(name,value){
		var f = this.fld[name];
		if(!f) return;
		if(!value) value='';
		if(f.type == 'checkbox'){
			var c = value === true|| /^t/i.test(value);
			if(f.checked!=c) f.checked = c;
		}else if(name=='passengerSex'){
			if(!value){
				f.value = value
			}else{
				var female = /1|f/i.test(value);
				if(/0|1/.test(f.options[1].value)) f.value = female ? '1' : '0';
				else f.value = female ? 'F' : 'M';
			}
		}else{
			var st=f.style;
			var mo=f.module;
			var co='';
			if(!mo||!mo.notice)
				f.value=value;
			else{
				if(!value){
					co='gray';
					value=mo.notice.tip;
				}
				if(st.color!=co)
					st.color=co;
				if(f.value!=value)
					f.value=value;
			}
		}
	},
	isEmpty:function(){
		var u=UserList.get(this.uid);
		if(u&&!u.business)
			return false;
		else
			return this.getValue('passengerName')=='';
	},
	checkIdType:function(){
		var tbl=this.tbl;
		var lbl=tbl.lbl;
		var ct=tbl.fld.passengerIDCardTypeId.value;
		Board.show(ct!=c_chinese_id,lbl.birth_row);
		if(!g_config&&g_config.needAPI)
			Board.show(true,lbl.api_explain_row, lbl.api_address_row, lbl.api_target_row, lbl.api_card_begin1, lbl.api_card_begin2 , lbl.api_card_begin3);
		if(g_config.FDI){
			if(g_config.FDINEW)
				Board.show(true, lbl.passport_row);
			else
				Board.show(ct==c_passport_id,lbl.passport_row);
		}
		if(g_config.FD){
				this.hideCountry(ct==c_passport_id);
		}
	},
	hideCountry : function(flag){
		var pn = this.tbl.fld.passengerNationalityName;
		var pnr;
		if(pn.module.address){
			pnr = pn.module.address.suggest;
			if(flag){
				for(var i=0,l=pnr.length;i<l;i++){
					for(var m=0,n=c_country_del.length;m<n;m++){
						var re = new RegExp(c_country_del[m]);
						if(re.test(pnr[i])) pnr.splice(i,1);
					}
				}
				for(var j=0,l=c_country_add.length;j<l;j++){
					pnr.push(c_country_add[j]);
				}
			}
			else{
				pn.module.address.suggest = BoardList.templateCC.slice(0);
			}
		}
	},
	nameSuggest: function(){
		var s = this.tbl.lbl.name_suggest;
		var l = s.getElementsByTagName('span');
		var u = UserList.get(this.uid) || {chsName: '', engName: ''};
		l[0].innerHTML = u.chsName || c_name_notice.chs;
		l[1].innerHTML = u.engName || c_name_notice.eng;
		Board.setClass(l[0].parentNode, u.chsName ? '' : 'nohover');
		Board.setClass(l[1].parentNode, u.engName ? '' : 'nohover');
		Board.suggest(s, this.fld.passengerName);
	},
	idSuggest:function(){
		var lbl=this.tbl.lbl;
		var u=UserList.get(this.uid);
		var a=lbl.id_suggest_span;
		var i=0;
		if(u){
			var c=u.idCards;
			for(var s in c_id_cards)
				a[i++].innerHTML=c[s];
		}else{
			for(;i<a.length;i++)
				a[i].innerHTML='';
		}
		Board.suggest(lbl.id_suggest,this.fld.passengerIDCardType);
	},
	periodicalCheck:function(){
		this.checkBirth();
		this.checkAPI();
	},
	checkBirth:function(){
		if(this.fld.passengerIDCardTypeId.value==c_chinese_id)
			return;
		var birthDate=this.getValue('passengerBirth');
		var tipDis = false;
		var tipText = '';
		if(birthDate != ''){
			if(dateParse(birthDate) == null){
				tipDis = true;
				tipText = c_msg.birthFormat;
			}else if(!g_config.PKG){
				if(birthDate.isBaby()){
					if(g_config.passengerType != 'BAB'){
						tipDis = true;
						tipText = c_msg.babyTicket;
					}
				}else if(birthDate.isChild()){
					if(g_config.passengerType != 'CHI'){
						tipDis = true;
						tipText = c_msg.childTicket;
					}
				}else if(birthDate.underSixteen() && g_config.type == 'FDI'){
					tipDis = true;
					tipText = c_msg.sixteenMsg;
				}
			}
		}
		var lbl = this.tbl.lbl;
		if(tipDis) Board.setHtml(lbl.age_tip, tipText);
		Board.show(tipDis, lbl.age_tip);
	},
	checkAPI:function(){
		var lbl=this.tbl.lbl;
		if(!lbl.api_address_row||lbl.api_address_row.style.display=='none')
			return;
		var v1=this.getValue('livingAddress');
		var v2=this.getValue('destnationAddress');
		Board.show(v1&&!c_api_reg.test(v1),lbl.api_address_tip);
		Board.show(v2&&!c_api_reg.test(v2),lbl.api_target_tip);
	},
	showPrice:function(obj){
		var lbl=this.tbl.lbl;
		if(!obj)
			Board.show(false,lbl.price_bar_person.parentNode);
		else{
			Board.setHtml(lbl.price_bar_person,obj.person);
			Board.setHtml(lbl.price_bar_amount,obj.amount);
			Board.show(true,lbl.price_bar_person.parentNode);
		}
	},
	setActive:function(b){
		var tbl=this.tbl;
		var cx=b?c_active_board_clx:c_normal_board_clx;
		Board.setClass(tbl,tbl.className.replace(c_board_clx_reg,cx));
		Board.show(b,tbl.lbl.price_bar);
	},
	toSource:function(){
		var ret=[];
		for(var s in this.tbl.fld)
			ret.push(this.getValue(s));
		return ret.join(c_user_splitter);
	},
	fromSource:function(dat){
		var arr=dat.split(c_user_splitter);
		var i=0;
		for(var s in this.tbl.fld)
			this.setValue(s,arr[i++]);
		this.checkIdType();
		this.checkBirth();
		this.checkAPI();
	},
	fillChineseIdInfo:function(){
		if(this.getValue('passengerIDCardTypeId')==c_chinese_id){
			var info=User.parseChineseId(this.getValue('passengerCardID'));
			this.fill(info);
		}
	}
};
Board.suggest=(function(){
	var suggestDiv=null;
	var suggestSrc=null;
	function hideSuggest(){
		Board.show(false,suggestDiv);
		suggestDiv.$clearIframe();
		suggestDiv=null;
	}
	function showSuggest(div,src){
		Board.show(true,div);
		if(!div.module)
			Ctrip.Object.apply(div);
		div.$setIframe();
		suggestDiv=div;
		suggestSrc=src;
	}
	return function(div,src){
		if(!div){
			/*
			if(src.className=='prifltpassenger_papertop'||src.parentNode.className=='prifltpassenger_papertop')
				return;
			*/
			if(suggestDiv&&src!=suggestSrc){
				hideSuggest();
			}
		}else{
			if(suggestDiv&&suggestDiv!=div)
				hideSuggest();
			showSuggest(div,src);
		}
	};
})();
Board.show=function(b){
	var dis=b?'':'none';
	var t=null;
	for(var i=1,a=arguments;i<a.length;i++)
		if((t=a[i])&&(t=t.style)&&t.display!=dis)
			t.display=dis;
};
Board.setHtml=function(el,html){
	if(!el) return;
	if(el.nodeType==3){
		if(el.nodeValue!=html)
			el.nodeValue=html;
	}else if(el._html!=html){
		el.innerHTML=el._html=html;
	}
};
Board.setClass=function(el,cls){
	if(el.className!=cls)
		el.className=cls;
};

var BoardList=(function(){
	var tables=[];
	var hash={};
	var container=null;
	var current=null;
	var template=null;

	var tunaIndex=0;
	var timer=null;
	
	var statusObj=null;
	
	function tag(el,tagname){
		return el.getElementsByTagName(tagname);
	}
	
	//events
	function nameSuggest(e){
		srcTable(e).bod.nameSuggest();
	}
	function idSuggest(e){
		srcTable(e).bod.idSuggest();
	}
	function boardMouseDown(e){
		var el=srcElement(e);
		var me=srcTable(e);
		if(el.tagName!='A')
			el=el.parentNode;
		if(el.tagName!='A'){
			BoardList.activate(me);
			return;
		}
		if(el.parentNode==me.lbl.name_suggest)
			me.bod.fillName(tag(el,'span')[0].innerHTML.trim());
		else if(el.parentNode==me.lbl.id_suggest)
			me.bod.fillId(el.getAttribute('type_id'));
		else{
			stopEvent(e);
			return;
		}
		if('outerHTML' in el){
			el.outerHTML=el.outerHTML;
			el=null;
		}
		stopEvent(e);
	}
	function rootMouseDown(e){
		var el=srcElement(e);
		if(!(g_config.ticketTag && el.name == 'passengerName')) Board.suggest(null,el);
	}
	function buttonAddClick(e){
		stopEvent(e);
		BoardList.insert(srcTable(e).index+1);
	}
	function buttonRemoveClick(e){
		stopEvent(e);
		BoardList.remove(srcTable(e).uid);
	}
	var updatePrice = (function(){
		var spanPerson=null;
		var spanAmount=null;
		var spanUnit=null;
		var unitTic=0;
		var unitIns=0;
		return {
			init:init,
			execute:execute
		};
		function init(){
			spanPerson=$('person');
			spanAmount=$('amount');
			spanUnit=$('unit');
			unitTic=g_config.unitPrice[0];
			unitIns=g_config.unitPrice[1]||0;
			Board.setHtml(spanUnit, formatCurrency(unitTic));
		}
		function execute(){
			var a=0;
			var c=container.childNodes;
			var n=c.length;
			if(n&&c[0].fld.insuranceNumber)
				for(var i=0;i<c.length;i++)
					a+=parseInt(c[i].fld.insuranceNumber.value,10);
			var x=formatCurrency(n*unitTic+a*unitIns);
			Board.setHtml(spanPerson,n);
			Board.setHtml(spanAmount,x);
			if(current&&current.bod) current.bod.showPrice({'person':n,'amount':x});
		}
	})();
	//update fltdomestic 081119
	var updatePriceFD_N =(function(){
		var spanPerson=null;
		var spanAmount=null;
		var spanUnit=null;
		var spanCommon = null;
		var unitTic=0;
		var unitIns=0;
		var old_x = 0;
		return {
			init:init,
			execute:execute
		};
		function init(){
			spanPerson=$('person');
			spanAmount=$('amount');
			spanUnit=$('unit');
			spanCommon = $('commonLabel');
			unitTic=g_config.unitPrice[0]+g_config.unitPrice[1]+g_config.unitPrice[2];
			unitIns=g_config.unitPrice[3]||0;
			spanCommon.style.display = "";
			Board.setHtml(spanUnit, formatCurrency(unitTic));
		}
		function execute(){
			var a=0;
			var c=container.childNodes;
			var n=c.length;
			if(n&&c[0].fld.insuranceNumber)
				for(var i=0;i<c.length;i++)
					a+=parseInt(c[i].fld.insuranceNumber.value,10);
			var ox = n*unitTic+a*unitIns;
			var x=formatCurrency(ox);
			Board.setHtml(spanPerson,n);
			Board.setHtml(spanAmount,x);
			if(current&&current.bod) current.bod.showPrice({'person':n,'amount':x});	
			if(ox==old_x) return;
			old_x = ox;
			$$.module.boarding.prchangePrice && $$.module.boarding.prchangePrice(ox);
		}
	})();

	var updatePriceFD_B = (function(){
		var spanCom = null;
		var spanPerson=null;
		var spanAmount=null;
		var spanBusiness = null;
		var old_x = 0;
	//	var spanUnit=null;
		var unitHtml = [
			{name:"unitTic" , price:0}, //机票费
			{name:"unitCon" , price:0}, //机建费
			{name:"unitOil" , price:0}, //燃油费
			{name:"unitIns" , price:0}, //保险费
			{name:"unitSev" , price:0} //服务费
		];
		var unitPer = 0; //单人总价格

		return {
			init:init,
			execute:execute
		};

		function init(){
			spanPerson=$('person');
			spanAmount=$('amount');
			spanunitTic = $('unitTic');
			servSpan = $('servspan');
			spanBusiness = $('businessLabel');
			for(var i=0;i<unitHtml.length;i++){
				unitHtml[i].price = g_config.unitPrice[i]||0;
				unitPer += unitHtml[i].price;
				if(i==3)	Board.setHtml($(unitHtml[i].name), formatCurrency(0));
				else if(i==4 && unitHtml[i].price==0)	 servSpan.style.display = "none";
				else	Board.setHtml($(unitHtml[i].name), formatCurrency(unitHtml[i].price));
			}
			unitPer = unitPer-unitHtml[3].price;
			spanBusiness.style.display = "";
		}
		function execute(){
			var a=0;
			var c=container.childNodes;
			var n=c.length;
			if(n&&c[0].fld.insuranceNumber)
				for(var i=0;i<c.length;i++)
					a+=parseInt(c[i].fld.insuranceNumber.value,10);
			var ox = n*unitPer+a*unitHtml[3].price;
			var x=formatCurrency(ox);
			Board.setHtml(spanPerson,n);
			Board.setHtml(spanAmount,x);
			for(var i=0;i<unitHtml.length;i++){
				t = (i==3)?a:n;
				Board.setHtml($(unitHtml[i].name), formatCurrency((unitHtml[i].price)*t));
			}
			if(current&&current.bod) current.bod.showPrice({'person':n,'amount':x});
			if(ox==old_x) return;
			old_x = ox;
			$$.module.boarding.prchangePrice && $$.module.boarding.prchangePrice(ox);
		}		
	})();
	//future fltInternational
	var updatePriceFDI = (function(){
		var person,
			amount,
			unit,
			exp_ticket,
			exp_person,
			exp_amount,
			exp_oil,
			exp_tax,
			exp_serlabel,
			exp_service,
			unitTic,
			unitOil,
			unitTax,
			unitIns,
			unitTic,
			unitIns,
			unitService;
		return {
			init: init,
			execute: doUpdate
		};
		function init(){
			person = $('person'); //人数
			amount = $('amount'); //总价
			unit = $('unit'); //单人总价
	
			exp_ticket = $('exp_ticket'); //"n套机票"
			exp_person = $('exp_person'); //套数
			exp_amount = $('exp_amount'); //机票费
			exp_oil = $('exp_oil');	//燃油费
			exp_tax = $('exp_tax');	//机票税
			exp_serlabel = $('exp_serlabel'); //服务费
			exp_service = $('exp_service');//服务费
			
			var p = g_config.unitPrice;
			if(exp_ticket){
				unitTic = p[0];
				unitOil = p[1];
				unitTax = p[2];
				unitIns = p[3];
				unitService=p[4]||0;
				Board.show(g_config.isRoundTrip, exp_ticket);
			}else{
				unitTic = p[0];
				unitIns = p[1];
			}
		}
		function doUpdate(){
			var chd = container.childNodes;
			var cPerson = chd.length;  //人数
			var cIns = 0; //保险数
			if(cPerson && chd[0].fld.insuranceNumber)
				for(var i = 0; i < cPerson; i++)
					cIns += parseInt(chd[i].fld.insuranceNumber.value, 10);
			
			var cSingle = unitTic + unitOil + unitTax + unitService; //单人总价 = 机票 + 燃油 + 税 + 服务费
			var cTotal = cSingle * cPerson + cIns * unitIns; //总价 = 单人总价 * 人数 + 保险份数 * 保险价 
			
			Board.setHtml(unit, formatCurrency(cSingle));
			Board.setHtml(amount, formatCurrency(cTotal));
			Board.setHtml(person, cPerson);
			Board.setHtml(exp_person, cPerson);
			/*
			Board.setHtml(exp_amount, formatCurrency(unitTic * cPerson));
			Board.setHtml(exp_oil, formatCurrency(unitOil * cPerson));
			Board.setHtml(exp_tax, formatCurrency(unitTax * cPerson));
			*/
			Board.setHtml(exp_amount, formatCurrency(unitTic));
			Board.setHtml(exp_oil, formatCurrency(unitOil));
			Board.setHtml(exp_tax, formatCurrency(unitTax));
			//Board.setHtml(exp_tax, formatCurrency(unitTax));
			if(exp_serlabel){
				if(unitService!=0)	Board.setHtml(exp_service, formatCurrency(unitService));
				else exp_serlabel.style.display="none";
			}

			if(current && current.bod)
				current.bod.showPrice({'person': cPerson,	'amount': formatCurrency(cTotal)});
		}
	})();
	
	//init
	function preInit(){
		User.init();
		template=document.getElementById(c_template_id);
		templateInit();
		User.loadDefault(template);
		UserList.init();
		if(g_config.FDI && g_config.unitPrice.length > 2) updatePrice = updatePriceFDI;
		if(g_config.FD && g_config.unitPrice.length >3) updatePrice = g_config.isBusiness? updatePriceFD_B : updatePriceFD_N;
		updatePrice.init();
		updatePrice = updatePrice.execute;
		container=document.getElementById(c_boardbox_id);
		container.innerHTML='';
		addEvent(document.documentElement,'mousedown',rootMouseDown);
		statusObj=Status.get('boardlist');
		if(statusObj){
			var c=container.childNodes;
			var i=0;
			var p=null;
			for(var uid in statusObj){
				var dat=statusObj[uid];
				if(!insertUser(i,uid,true))
					break;
				var tbl=container.lastChild;
				tbl.bod.fromSource(dat);
				i++;
			}
			setCurrent(c[Status.get('currentboard').index]);
			updatePrice();
		}else if(g_config.ticketTag){
			for(var a = UserList.arr, i = a.length - 1; i >= 0; i--)
				insertUser(0, a[i].data.userId);
			setTimeout(function(){
				for(var i = 0, c = container.childNodes; i < c.length; i ++)
					c[i].fld.passengerNationalityName.module.address.check();
			}, 100);
		}else if(!g_config.PKG){
			while(tables.length<c_ini_boards)
				insertUser();
			while(true) if(!addTable()) break;
		}else{
			while(tables.length<c_max_boards)
				insertUser();
		}
		setInterval(periodicalCheck,200);
	}
	function periodicalCheck(){
		if(current&&current.bod)
			current.bod.periodicalCheck();
	}
	function tableInit(tbl){
		var fld={};
		for(var i=0,input=tag(tbl,'input');i<input.length;i++)
			fld[input[i].name]=input[i];
		for(var i=0,select=tag(tbl,'select');i<select.length;i++)
			fld[select[i].name]=select[i];
		
		var div=tag(tbl,'div');
		var tr=tag(tbl,'tr');
		var dfn=tag(tbl,'dfn');
		var strong=tag(tbl,'strong');
		var a=tag(tbl,'a');
		var label=tag(tbl,'label');
		var span=tag(tbl,'span');

		var lbl={
			price_bar:			strong[0],
			price_bar_person:	dfn[0],
			price_bar_amount:	dfn[1],
			button_add:			a[0],
			button_remove:		a[1],
			save_label:			label[0].lastChild,
			passenger_name:		div[0],
			name_type:			tr[1].cells[0],		
			name_suggest:		div[1],
			name_suggest_cn:	span[1],
			name_suggest_en:	span[2],
			id_suggest:			div[2],
			id_suggest_span:	array(tag(div[2],'span'),1),
			format_tip:			div[4],
			age_tip:			div[5]
		};
		var ext={};
			
		if(g_config.FD)
			ext={
				birth_row:		tr[2],
				mobile_row:		tr[4],
				insurance_label:tag(tr[3],'span')[0]
			};
		else if(g_config.FDI) ext={
			passport_row:		tr[2],
			birth_row:			tr[3],
			mobile_row:			tr[5],
			api_explain_row:	tr[6],
			api_address_row:	tr[7],
			api_target_row:		tr[8],
			api_address_tip:	div[7],
			api_target_tip:		div[6],
			api_card_begin1:	tr[2].cells[4],
			api_card_begin2:	tr[2].cells[5],
			api_card_begin3:	tr[2].cells[6],
			insurance_label:	tag(tr[4],'span')[0]
		};
		else if(g_config.PKG) ext={
			passport_row:		tr[2],
			birth_row:			tr[3],
			api_explain_row:	tr[4],
			api_address_row:	tr[5],
			api_target_row:		tr[6],
			cn_name_text:		tr[7].cells[2],
			cn_name_input:		tr[7].cells[3],
			api_address_tip:	div[5],
			api_target_tip:		div[6]
		};
		tbl.fld=fld;
		tbl.lbl=extend(lbl,ext);
		
		//super magic
		if(g_config.PKG)
			tbl.inputList={
				1:fld.passengerName,
				14:fld.passengerChsName
			};
		
		//magic for postcode
		if(fld.postcode)
			fld.postCode=fld.postcode;
		
		return tbl;
	}
	function templateInit(){
		template.parentNode.removeChild(template);
		template.removeAttribute('id');
//		Board.show(true,template);
		var lb=tableInit(template).lbl;
		var fd=template.fld;
		fd.passengerNationality.id='';
		fd.passengerIDCardTypeId.id='';
		fd.userId='';
		
		
		//BoardList.template = fd;
	//	debugger;
		var ma = fd.passengerNationalityName.getAttribute('mod_address_suggest');
		ma = ma.substring(1,ma.length);
		var arr = ma.match(/[^@]+@/ig);
		BoardList.templateCC = arr;

		lb.name_type.innerHTML = c_name_label[User.possibleName];
		if(g_config.needName == 'both')
			Board.show(g_config.needName=='both', lb.cn_name_text, lb.cn_name_input);
		if(g_config.needAPI)
			Board.show(true, lb.api_explain_row, lb.api_address_row, lb.api_target_row , lb.api_card_begin1, lb.api_card_begin2 , lb.api_card_begin3);

		var i=0,a=template.lbl.id_suggest_span,c=c_id_cards;
		for(var s in c){
			var op=a[i++].parentNode;
			op.setAttribute('type_id',s);
			c[s].usable=op.style.display!='none';
		}
		//magic: fix style
		if(fd.livingAddress)
			fd.livingAddress.style.width = fd.destnationAddress.style.width = $$.browser.IE ? '97%' : '97.5%';
		
		//保险数限制
		if('maxInsurance'in g_config){
			if(g_config.maxInsurance == 0){
				Board.show(false, lb.insurance_label.parentNode, fd.insuranceNumber.parentNode)
			}else if(fd.insuranceNumber){
				var opt = fd.insuranceNumber.options;
				for(var i = opt.length-1; i >= 0; i--)
					if(parseInt(opt[i].value, 10) > g_config.maxInsurance)
						opt[i].parentNode.removeChild(opt[i]);
			}
		}
		
		//name suggest update
		Board.show(User.possibleName != 'chs', lb.name_suggest_en.parentNode);
		Board.show(User.possibleName != 'eng', lb.name_suggest_cn.parentNode);
		fd.passengerName.setAttribute('mod_notice_tip', c_name_notice[User.possibleName]);
		lb.name_suggest_cn.style.width = lb.name_suggest_en.style.width = '88px';

		//fdi, all idtype need limit
		if(g_config.FDI && fd.passportType)
			g_config.FDINEW = fd.passportType.innerHTML.indexOf(c_passport_text) == -1;

		if(g_config.ticketTag){
			lb.button_add.style.visibility = 'hidden';
			lb.button_remove.style.visibility = 'hidden';
			fd.passengerName.readOnly = true;
		}
	}
	function tunaInit(tbl){
		var lbl=tbl.lbl;
		var fld=tbl.fld;
		//notice
		var ar=[
			'passengerName',
			'passengerNationalityName',
			'passengerBirth',
			'card1Number',
			'card2Number',
			'livingAddress',
			'destnationAddress',
			'IDcardTimeLimit',
			'IDcardTimeBegin',
			'postCode',
			'destnationAddress',
			'livingAddress'
		];
		var el=null;
		for(var i=0;i<ar.length;i++){
			if(!(el=fld[ar[i]]))
				continue;
			if(ar[i]=='IDcardTimeLimit'||ar[i]=='IDcardTimeBegin')
				el.setAttribute('mod_notice_tip','yyyy-mm-dd');
			Ctrip.Object.apply(el);
			new Ctrip.module.notice(el);
		}
		if(el=lbl.insurance_label){
			el.id='ins_'+tunaIndex;
			el.setAttribute('mod','jmpInfo');
//			Ctrip.module.jmpInfo(el);
		}
		//address
		if(el=fld.passengerNationalityName){
			el.id='pnn_'+tunaIndex;
			fld.passengerNationality.id='pni_'+tunaIndex;
			el.setAttribute('mod','address');
			$d(el);
		}
		//fix
		fld.isSaveTo.id='ist_'+tunaIndex;
		$fixElement(tbl);
		//events
		addEvent(tbl,'mousedown',boardMouseDown);
		addEvent(lbl.button_add,'click',buttonAddClick);
		addEvent(lbl.button_remove,'click',buttonRemoveClick);
		if(!g_config.ticketTag) addEvent(fld.passengerName,'mousedown',nameSuggest);
		addEvent(fld.passengerIDCardType,'mousedown',idSuggest);
		if(fld.insuranceNumber)
			addEvent(fld.insuranceNumber,'change',updatePrice);	
		tunaIndex++;
	}
	
	function addTable(){
		if(tables.length>=c_max_boards)
			return null;
		var tbl=template.cloneNode(true);
		tableInit(tbl);
		tunaInit(tbl);
		tables.push(tbl);
		return tbl;
	}
	function getTable(force){
		for(var i=0;i<tables.length;i++)
			if(tables[i].parentNode == container && (!tables[i].bod||!force&&tables[i].bod.isEmpty()))
				return tables[i];
		for(var i=0;i<tables.length;i++)
			if(!tables[i].bod||!force&&tables[i].bod.isEmpty())
				return tables[i];
		return addTable();
	}
	function makeId(){
		return c_newuser_prefix+Math.random().toString().substr(2,5);
	}
	function insertUser(pos,uid,force){
		var tbl=getTable(!uid||force);
		if(!tbl) return false;
		if(tbl.bod) delete hash[tbl.bod.uid];
		pos=pos||0;
		uid=uid||makeId();
		var bod=new Board(tbl,uid);
		hash[bod.uid]=bod;
		container.insertBefore(tbl,container.childNodes[pos]||null);
		checkRef(tbl.fld.passengerNationalityName,tbl.fld.passengerNationality);
		setCurrent(tbl);
		adjustIndex();
		return true;
	}
	function checkRef(el,ref){
		var addr=el.module.address;
		if(!addr)
			setTimeout(function(){checkRef(el,ref);},100);
		else
			addr.reference=ref;
	}
	function removeUser(uid){
		//debugger;
		if(!(uid in hash)) return;
		var tbl=hash[uid].dispose();
		delete hash[uid];
		if(tbl==current)
			setCurrent(tbl.previousSibling||tbl.nextSibling);
		container.removeChild(tbl);
		if(g_config.PKG) insertUser(tbl.index);
		else if(!container.firstChild) insertUser();
		else if(tbl==current) setCurrent(tbl.previousSibling||tbl.nextSibling);
		adjustIndex();
	}
	function adjustIndex(){
		for(var i=0,c=container.childNodes;i<c.length;i++)
			c[i].index=i;
		updatePrice();
	}
	function setCurrent(tbl){
		if(!tbl)
			return;
		if(current&&current!=tbl&&current.bod)
			current.bod.setActive(false);
		tbl.bod.setActive(true);
		current=tbl;
		updatePrice();
	}
	function getBoard(uid){
		return hash[uid]||null;
	}
	function getCount(){
		var r;
		for(var i=0,c=container.childNodes,r=c.length;i<c.length;i++)
			if(c[i].bod.isEmpty())
				 r--;
		return r;
	}
	function saveStatus(){
		var obj={};
		var j=0;
		for(var i=0,c=container.childNodes;i<c.length;i++){
			var bod=c[i].bod;
			obj[bod.uid]=bod.toSource();
			if(c[i]==current)
				j=i;
		}
		Status.set('boardlist',obj);
		Status.set('currentboard',{index:j});
	}
	function cloneUser(uid){
		if(!(uid in hash)) return;
		var a=[];
		for(var s in hash) if(s != uid) a.push(s);
		for(var i = 0; i < a.length; i++) removeUser(a[i]);
		var dat = hash[uid].toSource();
		var tbl = hash[uid].tbl;
		if(tbl.previousSibling)
			container.insertBefore(tbl, container.firstChild);
		for(var i = 1; i < c_max_boards; i++){
			insertUser(i, uid.indexOf('$') > 0 ? uid + i : uid + '$' + i);
			container.childNodes[i].bod.fromSource(dat);
			container.childNodes[i].bod.setValue('isSaveTo', false);
		}
	}
	
	return {
		init:preInit,
		insert:insertUser,
		remove:removeUser,
		activate:setCurrent,
		get:getBoard,
		count:getCount,
		save:saveStatus,
		smith:cloneUser
	};
})();

document.write('<input type="hidden" id="__status_holder" />');

//status holder
var Status=(function(){
	var el=null;
	var hash=null;
	function getHash(){
		if(hash)
			return hash;
		if(!el)
			el = $('__status_holder');
		hash={};
		var a=el.value.split('; ');
		for(var i=0;i<a.length;i++){
			var j=a[i].indexOf('=');
			if(j>-1)
				hash[a[i].slice(0,j)]=decode(a[i].slice(j+1));
		}
		return hash;
	}
	function setHash(){
		if(!el)
			return;
		var a=[];
		for(var s in hash)
			a.push(s+'='+encode(hash[s]));
		el.value=a.join('; ');
	}
	function encode(obj){
		var a=[];
		for(var s in obj)
			a.push(s+'='+escape(obj[s]));
		return a.join('&');
	}
	function decode(str){
		var r={};
		var a=str.split('&');
		for(var i=0;i<a.length;i++){
			var b=a[i].split('=');
			r[b[0]]=unescape(b[1]);
		}
		return r;
	}
	return {
		get:function(key){
			return getHash()[key];
		},
		set:function(key,obj){
			getHash()[key]=obj;
			setHash();
		}
	};
})();

//to clear
var boardingList;
var contactList;
var contactListDiv;
var contactListBak;
var contactTable;
var contactInput;
var contactSelect;


function checkEngName(str,el){
		if (!/^[^\/]+\/[^\/]+$/.test(str))
			return $alertEx(el,"请填写正确的英文姓名，姓名格式为姓/名，姓与名之间用/分隔，如Green/Jim King");
		
		if(g_config.FDI){
			if(/[^a-zA-Z. \/']/.test(str))
				return $alertEx(el,"英文姓名中包含非法字符，请检查");
		}else{
			if(/[^a-zA-Z. \/'-]/.test(str))
				return $alertEx(el,"英文姓名中包含非法字符，请检查");
		}
		
		var name=str.split('/');
		if(g_config.FD) el.value = name[0]+'/'+name[1].replace(/\'/g , ""); //过滤英文姓名中的单引号
		if(/[^a-zA-Z]/.test(name[0])) return $alertEx(el,"英文的姓中只能包含字母");
		if(!/^[a-zA-Z]/.test(name[1])) return $alertEx(el,"英文的名必须以字母开头");
		return true;
	}
function checkChsName(str,el){
	if(!/^[\u4e00-\u9fa5a-zA-Z-]+$/.test(str))
		return $alertEx(el,"中文姓名只能包含汉字、字母和连字符，请检查");
	return true;
}
function hasChsChar(str){
	return /[\u0100-\uffff]/.test(str);
}
	
window.checkName = function(el){
	var v = (el.isNull && el.isNull()) ? '' : el.value;
	if(hasChsChar(v)) return checkChsName(v, el);
	else	return checkEngName(v, el);
}

//to clear
function validateForm(form){
	var nameChkFlag={
		1:{chs:1,eng:0},
		2:{chs:1,eng:1},
		3:{chs:1,eng:0},
		4:{chs:1,eng:0},
		10:{chs:1,eng:1},
		22:{chs:1,eng:1},
		8: {chs:1,eng:1},
		7: {chs:1,eng:1},
		11:{chs:1,eng:1},
		20:{chs:0,eng:1},
		21:{chs:1,eng:1},
		99:{chs:1,eng:1}
	};
	if (g_config.PKG)
		var psgCounter=extend({},g_config.passengerType);
	if (g_config.FDI){
		var openTran=form["opentran"];
		if (openTran){
			if (!openTran[0].checked&&!openTran[1].checked)
				return $alertEx(openTran[0],"请选择回程机票类型");
		}
	}
	//阻止特殊字符
	function checkSpecial(fld){
		var a = [
			'card1Number',
			'card2Number',
			'businessCardNumber',
			'postCode',
			'livingAddress',
			'destnationCountry',
			'destnationAddress'
		];
		var r = /[\\"]/;
		for(var i = 0; i < a.length; i ++){
			var el = fld[a[i]], m;
			if(el && el.offsetWidth && (m = el.value.match(r)))
				return $alertEx(el, '对不起, 您输入的信息含有系统不接受的字符: <span style="color:red;font-weight:bold">' + m[0] + '</span>');
		}
		return true;
	}
	
	
	function isChsAddress(str){ //中文地址
		return /^[0-9\u4e00-\u9fa5\/]+$/.test(str);
	}

	function isValidAddress(str){
		var adds = [];
		adds = str.split('/');
		for(var i = 0;i<adds.length;i++){
			if(!adds[i].match(/\S/)) return false;
		}
		return true;
	}
	
	function checkTicket(){
		var ticket_el = $("ticketType")&&$("ticketType").getElementsByTagName("input");
		if(!ticket_el) return true;
		for(var i = 0 ; i<ticket_el.length;i++){
			if(ticket_el[i].checked) break;
		}
		for(var j = 0 ; j<ticket_el.length;j++){
			if(ticket_el[j].disabled == false) break;
		}
		
		if(j>=ticket_el.length) return true;

		if(i>=ticket_el.length) {
			$alert(ticket_el[j],"请选择机票类型",true,"lt","lb");
			return false;
		}
		return true;
	}
	var userNameListHash={};
	var busiCardHash={};
	if(!checkTicket()) return false;
	
	var hasTel = false;
	for (var i=0;i<boardingList.childNodes.length;i++){
		var tbl=boardingList.childNodes[i];
		var bod=tbl.bod;
		var fld=tbl.fld;
		var lbl=tbl.lbl;
		
		var passengerName=bod.getValue('passengerName').trim();
		var passengerIDCardType=bod.getValue('passengerIDCardTypeId').trim();
		var passengerCardID=bod.getValue('passengerCardID').trim();
		
		//解析身份证号并填写被隐藏的字段
		if(passengerIDCardType==c_chinese_id&&passengerCardID.isChinaIDCard())
			bod.fillChineseIdInfo();
		
		var passengerNationalityName=bod.getValue('passengerNationalityName').trim();
		var passengerBirth=bod.getValue('passengerBirth').trim();
		var chineseFlag = passengerNationalityName.slice(0, 2) == c_china_text;
		
		if (!g_config.PKG)
			var insuranceNumber=parseInt(bod.getValue('insuranceNumber'),10);
		
		//姓名校验
		if(passengerName == c_name_notice.chs || passengerName == c_name_notice.eng)
			return $alertEx(fld.passengerName, "您输入的姓名可能有误，请检查");
		if (!g_config.PKG){
			if (!passengerName)
				return $alertEx(fld.passengerName,"请填写所选证件上的姓名");
			var flag;
			if (g_config.FD)
				flag=nameChkFlag[passengerIDCardType];
			else if (g_config.FDI)
				flag={chs:0,eng:1};
			else
				flag={chs:1,eng:1};
			if (flag.chs&&hasChsChar(passengerName)){
				if(!checkChsName(passengerName,fld.passengerName))
					return false;
			}else if (flag.eng){
				if(!checkEngName(passengerName,fld.passengerName))
					return false;
			}else{
				return $alertEx(fld.passengerName,"请正确填写所选证件上的姓名");
			}
		}else{
			if (g_config.needName=="chs"){
				if (passengerNationalityName==c_china_mainland){
					if (!passengerName||!hasChsChar(passengerName))
						return $alertEx(fld.passengerName,"请填写旅客的中文姓名");
					if(!checkChsName(passengerName,fld.passengerName))
						return false;
				}else{
					if (!passengerName)
						return $alertEx(fld.passengerName,"请填写旅客的中文姓名或英文姓名");
					if (hasChsChar(passengerName)){
						if(!checkChsName(passengerName,fld.passengerName))
							return false;
					}else{
						if (!checkEngName(passengerName,fld.passengerName))
							return false;
					}
				}
			}else{
				if (!passengerName||hasChsChar(passengerName)){
					return $alertEx(fld.passengerName,"请填写旅客的英文姓名");
				}else{
					if (!checkEngName(passengerName,fld.passengerName))
						return false;
				}
			}
		}
		//重复姓名校验
		if (g_config != 'PKG' && !g_config.pkgOffline && userNameListHash[passengerName])
			return $alertEx(fld.passengerName,"请确认姓名是否正确，姓名不能重复");
		userNameListHash[passengerName]=true;
		
		//证件类型校验
		if (g_config.FD&&!/^7|8|21|99$/.test(passengerIDCardType)&&passengerNationalityName==c_china_tw)
			return $alertEx(fld.passengerIDCardType,"请选择台胞证、回乡证或旅行证");
		if (g_config.FDI&&passengerIDCardType==1)
			return $alertEx(fld.passengerIDCardType,"身份证不能购买国际机票");
		

		//证件号码校验
		if (!passengerCardID)
			return $alertEx(fld.passengerCardID,"请填写所选证件号码");
		switch(passengerIDCardType){
			case '1':
				if(!passengerCardID.isChinaIDCard())
					return $alertEx(fld.passengerCardID,"请填写正确的身份证号码");
				break;
			case '8':
				if(/[^A-Za-z0-9()（）]/.test(passengerCardID))
					return $alertEx(fld.passengerCardID,"请填写正确的台胞证号码：号码中只能包含数字、字母或括号");
				break;
			default:
				if(/[^A-Za-z0-9]/.test(passengerCardID))
					return $alertEx(fld.passengerCardID,"请填写正确的"+fld.passengerIDCardType.value.trim()+"号码，号码中只能包含数字或字母");
				break;
		}
		if (passengerIDCardType=='4'&&passengerNationalityName!=c_china_mainland)
			return $alertEx(fld.passengerIDCardType,"军人证只限中国大陆居民使用，请选择其他证件");


		
		//护照有效期校验
		if(fld.IDcardTimeLimit && fld.IDcardTimeLimit.offsetWidth > 0){
			var txt = g_config.FDINEW ? '证件' : '护照';
			if (fld.IDcardTimeLimit.isNull())
				return $alertEx(fld.IDcardTimeLimit, "请填写" + txt + "的有效期");
			var dt = fld.IDcardTimeLimit.value;
			if (!dateParse(dt))
				return $alertEx(fld.IDcardTimeLimit, "请填写正确的" + txt + "有效期，格式：yyyy-mm-dd");
			if(!dt.laterThenDepart())
				//return $alertEx(fld.IDcardTimeLimit, txt + "有效期不能早于出发日期，请检查");
				return $alertEx(fld.IDcardTimeLimit, "您的"+txt + "已经过了有效期，会影响您正常登机。建议重新办理后再预订。");
		}
		//护照签发日 与API联动
		if(g_config.needAPI && fld.IDcardTimeBegin){
			var ct = fld.IDcardTimeBegin.value;
			if(fld.IDcardTimeBegin.isNull()){
				return $alertEx(fld.IDcardTimeBegin,"请填写护照签发期");
			}else if(!dateParse(ct)||ct.laterThenToday()){
				return $alertEx(fld.IDcardTimeBegin,"请填写正确日期，并且不能晚于今天");
			}
		}
		
		//国籍校验
		if (!passengerNationalityName){
			if (passengerIDCardType!=1)
				$alertEx(fld.passengerNationalityName,"请选择旅客的国籍");
			else
				$alertEx(fld.passengerCardID,"请填写正确的身份证号码");
			return false;
		}
		if (g_config.needName!="pkg"&&!chineseFlag&&hasChsChar(passengerName))
			return $alertEx(fld.passengerName,"请正确输入旅客姓名，非中国国籍不能使用中文姓名");
		//性别校验
		var sex = bod.getValue('passengerSex');
		if(g_config.FDI && !sex) return $alertEx(fld.passengerSex , "请选择乘客性别");
		if(g_config.PKG && !sex) return $alertEx(fld.passengerSex, "请选择旅客性别");
		
		//出生日期校验
		var tipTarget=passengerIDCardType==1?fld.passengerCardID:fld.passengerBirth;
				if (g_config.FDI||passengerBirth||
			!(g_config.FD&&g_config.passengerType=="ADU"&&"|2|4|7|11|20|99|".indexOf("|"+passengerIDCardType+"|")!=-1)){
				if (!passengerBirth){
					if (passengerIDCardType!=1)
						$alertEx(fld.passengerBirth,"请填写出生日期");
					else
						$alertEx(fld.passengerCardID,"请填写正确的身份证号码");
					return false;
				}
				if (!dateParse(passengerBirth) || passengerBirth.laterThenDepart()){
					if (passengerIDCardType!=1)
						$alertEx(fld.passengerBirth,"请正确填写出生日期，格式：yyyy-mm-dd，且不得晚于出发日期");
					else
						$alertEx(fld.passengerCardID,"请填写正确的身份证号码");
					return false;
				}
				if(passengerIDCardType==4 && passengerBirth.isBaby())
					return $alertEx(fld.passengerIDCardType,"儿童或婴儿不能使用军人证购买机票");
				if (!g_config.PKG){
					if (g_config.passengerType=="CHI" && !passengerBirth.isChild())
						return $alertEx(tipTarget,passengerIDCardType==1?"登机人身份证号码显示年龄不正确，请重新填写":"您购买的是儿童票，旅客年龄不得大于12岁");
					if (g_config.passengerType=="BAB" && !passengerBirth.isBaby())
						return $alertEx(tipTarget,passengerIDCardType==1?"登机人身份证号码显示年龄不正确，请重新填写":"您购买的是婴儿票，旅客年龄不得大于2岁");
				}else{
					if (!passengerBirth.isChild()){
						psgCounter.ADU-=1;
						if (psgCounter.ADU<0) return $alertEx(tipTarget,"成人人数大于预订数");
					}else if(!passengerBirth.isBaby()){
						psgCounter.CHI-=1;
						if (psgCounter.CHI<0) return $alertEx(tipTarget,"儿童人数大于预订数");
					}else{
						psgCounter.BAB-=1;
						if (psgCounter.BAB<0) return $alertEx(tipTarget,"婴儿人数大于预订数");
					}
				}
		}else{
			if (g_config.PKG){
				psgCounter.ADU-=1;
				if (psgCounter.ADU<0) return $alertEx(tipTarget,"成人人数大于预订数，如果是儿童请填写出生日期");
			}
			//edit by feifei @090219
			if(g_config.FD&&insuranceNumber!=0){
				if(!passengerBirth&&passengerIDCardType!=1){
					return $alertEx(tipTarget,"如需购买保险请您务必填写出生日期");
				}
				if (!dateParse(passengerBirth) || passengerBirth.laterThenDepart()){
					if (passengerIDCardType!=1)
						return $alertEx(fld.passengerBirth,"请正确填写出生日期，格式：yyyy-mm-dd，且不得晚于出发日期");
				}
			}
		}
		
		//保险校验
		if(g_config.FD && insuranceNumber && !passengerBirth && '|1|2|4|'.indexOf("|"+passengerIDCardType+"|") == -1)
			return $alertEx(fld.passengerBirth, '登机人购买了保险，请填写出生日期');
		//edit by yanh
		if(g_config.FD && passengerBirth && passengerBirth.isEldor() && (fld.insuranceNumber.value > 0))
			return $alertEx(fld.insuranceNumber,"抱歉，您不能购买保险。");

		//API校验
		if (g_config.needAPI&&!g_config.FD){
			if (!fld.postCode.value.trim()) return $alertEx(fld.postCode,"请填写邮编");
			if (fld.destnationAddress.isNull()) return $alertEx(fld.destnationAddress,"请填写目的地地址");
			if(!fld.destnationAddress.value.match(/^[^\/]+\/[^\/]+\/[^\/]+$/))
				return $alertEx(fld.destnationAddress,"请正确填写目的地地址，格式：州/城市/地址");
			if(hasChsChar(fld.destnationAddress.value))
				return $alertEx(fld.destnationAddress,"目的地地址不能包含汉字, 请检查");
			if(!isValidAddress(fld.destnationAddress.value))
				return $alertEx(fld.destnationAddress,"目的地址不能为空，请检查");
			if (fld.livingAddress.isNull())
				return $alertEx(fld.livingAddress,"请填写现居住地址");
			if (!fld.livingAddress.value.match(/^[^\/]+\/[^\/]+\/[^\/]+$/))
				return $alertEx(fld.livingAddress,"请正确填写现居住地址，格式：省/市/地址");
			if(!isValidAddress(fld.livingAddress.value))
				return $alertEx(fld.livingAddress,"现居住地址不能为空，请检查");
//			if(!isChsAddress(fld.livingAddress.value)){
//				$alertEx(fld.livingAddress,"现居住地址只能包含汉字、数字和斜线");
//				return false;
//			}

		}
		//中文姓名校验
		if (g_config.PKG&&g_config.needName=="both"){
			var txtChsName=lbl.cn_name_input.getElementsByTagName('input')[0];
			var passengerChsName=txtChsName.value.trim();
			if (passengerNationalityName==c_china_mainland){
				if(!passengerChsName||!hasChsChar(passengerChsName))
					return $alertEx(txtChsName,"请填写旅客的中文姓名");
				if(!checkChsName(passengerChsName,txtChsName))
					return false;
			}else if (passengerChsName){
				if(hasChsChar(passengerChsName)){
					if(!checkChsName(passengerChsName, txtChsName)) return false;
				}else{
					if(!checkEngName(passengerChsName, txtChsName)) return false;
				}
			}else{
				return $alertEx(txtChsName, '请填写旅客的中文姓名或英文姓名');
			}
		}


		//edit by yanh 常卡校验
		if(g_config.FD && fld.card1Number && !fld.card1Number.isNull() && !/^\d+$/.test(fld.card1Number.value))	
			return $alertEx(fld.card1Number,"您输入的常旅客卡号有误，请重新输入。");
		if(g_config.FD && fld.card2Number && fld.card2Number.$isDisplay() && !fld.card2Number.isNull() && !/^\d+$/.test(fld.card2Number.value))
			return $alertEx(fld.card2Number,"您输入的常旅客卡号有误，请重新输入。");

		//商旅卡号检验
		var bc=bod.getValue('businessCardNumber').trim();
		if(bc.length && !g_config.pkgOffline){
			if(busiCardHash[bc]==1)
				return $alertEx(fld.businessCardNumber,'您确认商旅卡号是否正确，商旅卡号不能重复');
			busiCardHash[bc]=1;
		}
		
		//Online度假联系电话校验 080815
		if(g_config.PKG || g_config.pkgOffline){
			if(fld.telNumber.value.trim()!="") hasTel = true;
		}
		
		//特殊字符
		if(!checkSpecial(fld)) return false;
	}

	//Online度假联系电话校验 080815
	if(g_config.PKG || g_config.pkgOffline){
		if(hasTel==false) {
			var fld=boardingList.childNodes[0].fld;
			return $alertEx(fld.telNumber,"请至少输入一位出行旅客的联系电话");
		}
	}

	if(g_config.FDI && g_config.userMin && boardingList.childNodes.length < g_config.userMin)
		return $alertEx($selNode('#buttonGroup input[type=submit]')[0], '对不起, 您预订的航班需要至少' + g_config.userMin + '位乘客才能预订');

	return true;
};

function validateContacts(form){
	//联系人姓名校验
	if (!(contactInput[0].value = contactInput[0].value.trim()))
		return $alertEx(contactInput[0],"请填写联系人姓名");

	if(!checkName(contactInput[0])) return false;
	
	//联系人手机校验
	var contactMobilePhone=contactInput[1].value.trim().replace(/^0/,'');
	contactInput[1].value=contactMobilePhone;
	if (!g_config.PKG&&contactSelect[0].value=="CMS"&&!contactMobilePhone)
		return $alertEx(contactInput[1],"您选择了手机短消息确认，请输入正确的手机号码");
	if (!contactMobilePhone&&contactInput[3].isNull())
		return $alertEx(contactInput[1],"手机号码或联系电话至少选填一项");
	if ($$.status.version=="zh-cn"){
		if (contactMobilePhone&&!contactMobilePhone.match(/^0?1[358]\d{9}$/))
			return $alertEx(contactInput[1],"您填写的手机号码有误，请重新填写。");
		else
			contactInput[1].value=contactInput[1].value.trim().replace(/^0/,"");
	}else{
		if (contactMobilePhone&&!contactMobilePhone.match(/^[0-9-]{7,}$/))
			return $alertEx(contactInput[1],"请填写正确的手机号码,手机号码仅包含数字或\"-\"且长度7位以上");
	}
	//联系人联系电话传真号码校验
	for (var j=2;j<8;j++){
		var contactTelNum=contactInput[j].isNull()?"":contactInput[j].value.trim();
		var contactTelTip=contactInput[j].module.notice.tip;
		if (contactSelect[0].value=="FAX"&&j==6&&!contactTelNum)
			return $alertEx(contactInput[j],"您选择了传真确认，请输入正确的传真号码");
		if (contactTelNum&&!contactTelNum.match(/^\d+$/))
			return $alertEx(contactInput[j],"请填写正确的"+contactTelTip+"，"+contactTelTip+"仅包含数字");
		if (contactTelNum&&(j==3||j==6)&&contactTelNum.length<7)
			return $alertEx(contactInput[j],"请填写正确的"+contactTelTip+"，"+contactTelTip+"长度7位以上");
	}
	//联系人E-mail校验
	var contactEmail=contactInput[8].isNull()?"":contactInput[8].value.trim();
	if(/[\"|\']/.test(contactEmail)){
		return $alertEx(contactInput[8],"请填写正确的E-mail地址，格式：a@b.c");
	}
	if (!g_config.FD){
		if (!contactEmail)
			return $alertEx(contactInput[8],"请填写您的E-mail地址");
		if (!contactEmail.isEmail())
			return $alertEx(contactInput[8],"请填写正确的E-mail地址，格式：a@b.c");
	}else{
		if (contactSelect[0].value=="EML"){
			if (!contactEmail)
				return $alertEx(contactInput[8],"您选择了E-mail确认，请填写您的E-mail地址");
			if (!contactEmail.isEmail())
				return $alertEx(contactInput[8],"请填写正确的E-mail地址，格式：a@b.c");
		}
		else if(contactEmail!=""){  //如果Email已经填写，必须校验
			if (!contactEmail.isEmail())
				return $alertEx(contactInput[8],"请填写正确的E-mail地址，格式：a@b.c");
		}
	}
	return true;
}

//to clear
function contactInfoInit(){
	boardingList=$("boardingList");
	contactList=$("contactList");
	contactListDiv=contactList.$("div");
	contactListBak=null;
	contactTable=$("contactTable");
	contactInput=contactTable.$("input");
	contactSelect=contactTable.$("select");
	for(var i=0;i<g_config.contactInfo.length;i++){
		(function(){
			var link=$c("a");
			link.href="###";
			var contactData=g_config.contactInfo[i].split("|");
			contactData[3]=fixTel(contactData[3]);
			contactData[4]=fixTel(contactData[4]);
			contactData=contactData.slice(0,2).concat(contactData[3]).concat(contactData[4]).concat(contactData.slice(5));
			link.title=contactData[0]+" "+contactData[1];
			link.innerHTML="<span>"+contactData[0]+"<\/span>"+contactData[1];
			contactListDiv[1].appendChild(link);
			link.$r("mousedown",function(){
				for (var j=0;j<9;j++){
					contactInput[j].value=contactData[j]||"";
					if (contactInput[j].module.notice)
						contactInput[j].module.notice.check();
					if (contactInput[j].module.validate)
						contactInput[j].module.validate.check();
				}
				if (!g_config.PKG)
					fillConfirmType(contactData[9]);
				var el = contactListDiv[1];
				if ($$.browser.IE){
					setTimeout(function(){
						el.replaceNode(contactListBak.cloneNode(true));
					}, 10);
				}
			});
		})(i);
	}
	if ($$.browser.IE)
		contactListBak=contactListDiv[1].cloneNode(true);
	contactInput[0].$r("focus",function(){
		contactListDiv[3].innerHTML="";
		if(!boardingList) return;
		for (var i=0;i<boardingList.childNodes.length;i++){
			var fld=boardingList.childNodes[i].fld;
			var bod=boardingList.childNodes[i].bod;
			if (!bod.isEmpty())
				(function(i){
					var name=bod.getValue('passengerName');
					var mobile=bod.getValue('mobilePhone')||'';
					if(!mobile||g_config.PKG){
						var user=UserList.get(bod.uid);
						if(user) mobile=user.data.mobilePhone||'';
					}
					var link=$c("a");
					link.href="###";
					link.title=name+" "+mobile;
					link.innerHTML="<span>"+name+"<\/span>"+mobile;
					contactListDiv[3].appendChild(link);
					link.$r("mousedown",function(){
						contactInput[0].value=name;
						contactInput[1].value=mobile;
					});
				})(i);
		}
		contactList.style.display="";
		contactList.$setIframe();
	});
	contactInput[0].$r("blur",function(){
		contactList.style.display="none";
		contactList.$clearIframe();
	});
	//填写确认方式
	function fillConfirmType(str){
		for (var i=0;i<contactSelect[0].options.length;i++){
			if (contactSelect[0].options[i].value==str)
				return contactSelect[0].selectedIndex=i;
		}
		return contactSelect[0].selectedIndex=0;
	}
}
function fixTel(str){
	var telNum=["","",""],re;
	if (re=str.match(/\*(\d+)$/)){
		telNum[2]=re[1];
		str=str.replace(/\*\d+$/,"");
		if (re=str.match(/((.*)\-)?(\d+)?$/)){
			telNum[0]=re[2];
			telNum[1]=re[3];
		}else
			telNum[1]=str;
	}else if (re=str.match(/\d+/g)){
		if (re.length==3){
			telNum=[re[0],re[1],re[2]];
		}else if (re.length>=2){
			if (re[0].length<=4&&re[1].length>5){
				telNum=[re[0],re[1],""];
			}else if (re[0].length>4){
				telNum=["",re[0],re[1]];
			}else{
				telNum=[re[0],"",re[1]];
			}
		}else if (re.length==1){
			if (re[0].length<=4)
				telNum[0]=re[0];
			else
				telNum[1]=re[0];
		}
	}
	return telNum;
}

//to clear
function bussinessInfoInit(){
	var businessFlag=$("businessFlag");
	var businessDiv=$("businessDiv");
	var businessMessage=$("businessMessage");
	
	//初始化商旅
	if (businessFlag&&g_config.businessUserInfoAjax){
		var businessClose=businessDiv.$("a")[0];
		var businessInput=businessDiv.$("input");
		var businessTable=businessDiv.$("tbody")[0];
		var businessDfn=businessDiv.$("dfn")[0];
		var count=0;
		var xmlObj;
		g_config.businessInfo=[];
		businessFlag.$r("click",function(e){
			document.body.appendChild(businessDiv);
			stopEvent(e);
			businessDiv.style.display="";
			businessDiv.style.top=___.scrollTop+50+"px";
			var iframe=__.body.$setIframe(true);
			iframe.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=50)";
			iframe.style.opacity=0.5;
			count=c_max_boards-BoardList.count();
			businessDfn.innerHTML=count;
			clearTable();
			var row=businessTable.insertRow(-1);
			var cell=row.insertCell(-1);
			cell.colSpan=8;
			cell.innerHTML="请输入搜索条件,并点击搜索按钮".s2t();
			
			businessDiv.style.zIndex=100;
			iframe.style.zIndex=99;
		});
		function hiddenDiv(){
			businessDiv.style.display="none";
			var iframe=__.body.$clearIframe();
			iframe.style.filter="";
			iframe.style.opacity=1;
		}
		businessClose.$r("click",hiddenDiv);
		function clearTable(){
			while (businessTable.rows.length>0)
				businessTable.removeChild(businessTable.rows[0]);
		}
		//商旅Ajax
		businessInput[2].$r("click",function(){
			var value=[businessInput[0].value.trim(),businessInput[1].value.trim()];
			if (value[0].length<3&&!(value[0].match(/[\u4e00-\u9FA5]/g)||"").length)
				return $alertEx(businessInput[0],"请至少输入3个英文字母或1个汉字");
			if (xmlObj){
				xmlObj.onreadystatechange=function(){};
				xmlObj.abort();
			}
			clearTable();
			var row=businessTable.insertRow(-1);
			var cell=row.insertCell(-1);
			cell.colSpan=8;
			cell.innerHTML="正在查询中,请稍候...".s2t();
			xmlObj=$ajax(g_config.businessUserInfoAjax,"name="+escape(value[0])+"&department="+escape(value[1]),function(data){
				if (!data) return;
				if (data.match(/^#$/)){
					cell.innerHTML="未查找到符合条件的用户".s2t();
					return;
				}
				clearTable();
				var businessUserInfo=data.match(/(^|\n)[^\n]+/g);
				if (!businessUserInfo) return;
				//商旅表格初始化
				for (var i=0;i<businessUserInfo.length;i++){
					if (!businessUserInfo[i].trim())
						continue;
					(function(i){
						var s=businessUserInfo[i].trim();
						businessUserInfo[i]=busiDataInit(s);
						var row=businessTable.insertRow(-1);
						row.style.cursor="pointer";
						for (var j=0;j<8;j++)
							row.insertCell(-1);
						var input=$c("input");
						input.style.cursor="pointer";
						input.type="checkbox";
						input.style.width="14px";
						row.cells[0].appendChild(input);
						row.cells[1].innerHTML=businessUserInfo[i][businessUserInfo[i].length-2];
						row.cells[2].innerHTML=businessUserInfo[i][1][0];
						row.cells[3].innerHTML=businessUserInfo[i][1][1];
						row.cells[4].innerHTML=businessUserInfo[i][businessUserInfo[i].length-1];
						for (var j=0;j<businessUserInfo[i][2].length;j++){
							if (businessUserInfo[i][2][j]==1)
								row.cells[5].innerHTML=businessUserInfo[i][3][j]||"";
							if (businessUserInfo[i][2][j]==2)
								row.cells[6].innerHTML=businessUserInfo[i][3][j]||"";
						}
						row.cells[7].innerHTML=businessUserInfo[i][4];
						row.onclick=function(){
							if (input.disabled)
								return;
							if (input.checked){
								input.checked=false;
								row.style.background="";
							}else{
								input.checked=true;
								row.style.background="#EEE";
							}
						};
						input.onclick=function(){
							input.checked=!input.checked;
						};
						input.userId=new User(c_business_prefix+s).data.userId;
						if(BoardList.get(input.userId)){
							input.checked=false;
							input.disabled=true;
							row.style.background="#EEE";
						}
					})(i);
				}
				xmlObj=null;
			});
		});
		//商旅客人添加到登机人
		var buttonAdd=businessInput[businessInput.length-2];
		var buttonCancel=businessInput[businessInput.length-1];
		buttonAdd.$r("click",function(){
			buttonAdd.disabled=true;
			businessMessage.style.display="";
			setTimeout(function(){
				var input=businessTable.$("input");
				for (var i=0;i<input.length;i++){
					if (input[i].checked){
						if(BoardList.insert(0,input[i].userId)){
							input[i].checked=false;
							input[i].disabled=true;
							count--;
						}else{
							$alertEx(input[i],"一次订单可选总人数为"+c_max_boards+"人",false);
							break;
						}
					}
				}
				businessDfn.innerHTML=count;
				businessMessage.style.display="none";
				businessInput[businessInput.length-2].disabled=false;
			},100);
		});
		buttonCancel.$r("click",hiddenDiv);
	}
	function busiDataInit(str,i){
		str=str.split("");
		if (!isNaN(i))
			userInfoHash[str[0]]=i;
		for (var j=1;j<4;j++)
			str[j]=str[j].split("|");
		return str;
	}
}

function modifyGo(){
	history.go(-2);
}

function modifyBack(){
	history.go(-1);
}

//to clear
window.$r('domReady',function(){
	var invoice=$("invoice");
	if (!invoice)
		return;
	var invoiceInput=[invoice.$("input")[0],invoice.$("select")[0],invoice.$("textarea")[0]];
	var invoiceDiv=invoice.$("div")[0];
	var link=invoiceDiv.$("a"),linkBak=[];
	if (!link.length) return;
	for (var i=0;i<link.length;i++){
		(function(i){
			var obj=link[i].$("*");
			var str=[obj[0].innerHTML,obj[1].innerHTML,obj[2].innerHTML];
			link[i].title=str[0]+"\n"+str[1]+"\n"+str[2];
			link[i].$r("mousedown",function(){
				for (var j=0;j<3;j++)
					invoiceInput[j].value=str[j];
				if ($$.browser.IE)
					link[i].replaceNode(linkBak[i].cloneNode(true));
			});
			if ($$.browser.IE)
				linkBak[i]=link[i].cloneNode(true);
		})(i);
	}
	invoiceInput[0].$r("focus",function(){
		invoiceDiv.style.display="";
		invoiceDiv.$setIframe();
	});
	invoiceInput[0].$r("blur",function(){
		invoiceDiv.style.display="none";
		invoiceDiv.$clearIframe();
	});
});

//entry
window.$r("domReady",function(){
	var statusSaved=false;

	$loadJs(
		c_nationid_src.replace('{$charset}',$$.status.charset),
		$$.status.charset,
		UserList.loadnation
	);

	g_config=$$.module.boarding;
	if(!g_config) return;
	g_config.FD=g_config.type=='FD';
	g_config.FDI=g_config.type=='FDI';
	g_config.PKG=g_config.type=='PKG';
	
	if(g_config.FDI && !/FlightReserveI\.asp\b/i.test(location.pathname)){
		c_id_cards = c_id_cards_new;
	}
	if(g_config.PKG) extend(c_msg,c_msg_pkg);
	if('userMax' in g_config) c_max_boards=g_config.userMax;

	c_ini_boards=g_config.userCur;
	
	if(c_max_boards>0) BoardList.init();

	//todo
	contactInfoInit();

	//todo
	if(!g_config.ticketTag) bussinessInfoInit();	
	else $(c_filter_id).parentNode.parentNode.style.display = "none";
	
	//for PKG  : - (
	if(g_config.PKG && !window.formCheck1) window.formCheck1 = function(){
		var a = document.getElementsByTagName('input');
		for(var i = 0; i < a.length; i++) if(a[i].type == 'checkbox') break;
		if(i < a.length && !a[i].checked)
			return $alertEx(a[i], "请您仔细阅读预订须知和重要条款，并在“我接受”一栏打勾，才能接受您的预订请求！");
		return true;
	};
	//for PKG : - (
	if(g_config.PKG && !window.formCheck2) window.formCheck2 = function(){
		//to do
		return true;
	};
	
	//Modify the flights   by feifei
	if($(c_modifygo_id)!=null) addEvent(document.getElementById(c_modifygo_id),'click',modifyGo);
	if($(c_modifyback_id)!=null) addEvent(document.getElementById(c_modifyback_id),'click',modifyBack); 
	//end;
	
	//magic c[0].fld.insuranceNumber
	document.forms[document.forms.length-1].onsubmit=function(){

		if (window.formCheck1&&!formCheck1())
			return false;
		if(c_max_boards>0&&!validateForm(this) || !validateContacts(this))
			return false;
		if (window.formCheck2&&!formCheck2())
			return false;

		trySave(true);
				
		if(c_max_boards>0) for(var i=0,a=document.getElementById(c_boardbox_id).childNodes;i<a.length;i++){
			var fld=a[i].fld;
			var uid = fld.userId.value.replace(/\$.+$/,'');
			var usr = UserList.get(uid);
			if(!usr && uid.charAt(0)!='-')
				fld.userId.value='0';
			else if(usr && usr.zltFlag)
				fld.userId.value = '-1';
			else
				fld.userId.value=uid;
			for(var s in fld){
				var el = fld[s];
				el.name += (i+1);
				if(/^\s|\s$/.test(el.value||'')) el.value = el.value.trim();
				if(el.isNull && el.isNull()) el.value = '';
			}
		}

		for(var i = 0; i < contactInput.length; i ++)
			if(contactInput[i].isNull && contactInput[i].isNull())
				contactInput[i].value = '';
		return true;
	};
	
	window.$r('beforeunload',trySave);
	
	function trySave(setFlag){
		if(trySave.flag)
			return;
		if(c_max_boards>0){
			UserList.save();
			BoardList.save();
		}
		trySave.flag=setFlag===true;
	}
	
	Board.show(false,document.getElementById('loadInfo'));
	Board.show(true,document.getElementById('buttonGroup'));	
});


document.write(
'<style>\
a.nohover{\
color:gray;\
cursor:default;\
}\
a.nohover:hover{\
color:gray;\
border-color:#fff;\
background-color:transparent;\
}\
</style>');
