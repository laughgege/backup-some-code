/**
* @fileoverview 度假旅客信息页面
* @author yanh
* @version 20090901
*/

/**
* @description 旅客信息模板
* @constant
*/
var infoList = ["uid", "names", "certificateType", "certificateNo", "nationality", "sex", "birth", "phone"];

/**
* @description 联系人信息模板
* @constant
*/
var contactorInfo_list = ['contactor', 'mobile', 'unknown', 'phone', 'fax', 'email'];

/**
* @description 保存联系人信息模板
* @constant
*/
var savedContactorTemplate = ["contactor", "mobile", "phone1", "phone2", "phone3", "fax1", "fax2", "fax3", "email"];

/**
* @description 提示信息
* @constant
*/
var greyTips = _s2t({
    ChineseName: "所选证件姓名",
    EnglishName: "last/first middle",
    Nationality: "中文/拼音",
    UserName: "中文/拼音",
    ContactPhone: "请至少输入一位出行旅客的联系电话",
    Birthday: "yyyy-mm-dd",
    CardValidUntil: "yyyy-mm-dd",
    SignDate: "yyyy-mm-dd",
    Location: "州/省市/地址",
    Destination: "州/省市/地址",
    BirthPlace: "",
    BussinessCard: "",
    TWNotice: "请选择台胞证、回乡证或旅行证"
});

/**
* @description 全局配置数据，数据配置在HTML页面页脚，由后台提供
*/
var g_config = $$.module.pkgInterface;

/**
* @description 全局配置DOM id
*/
var Options = {
/**
* 点选按钮id
*/
    CustomerList: {
        boxId: "customerList",
        filterId: "nameFilter"
    },
/**
* 旅客信息id
*/
    BoardingList: {
        boxId: "boardingList"
    },
/**
* 联系人信息id
*/
    contactInfo: {
        boxId: "contactInfo"
    },
/**
* 接受条款id
*/
    accepter: {
        id: "checkAccepted"
    }
}

/**
* @class 旅客信息类
* @constructor
* @param {string} data 字符串格式的旅客信息
* @param {boolen} checked 信息是否已经点选并填入
* @returns {object} 一个旅客信息实例
*/
var Customer = function(data, checked){
    this.checked = !!checked;
    this.data = data;
	/** 旅客信息字符串的拼接符*/
    this.splitter = String.fromCharCode(12);
    this.initialize();
}
Customer.prototype = {
	/** 构造旅客信息类调用的初始化函数*/
    initialize: function(){
        this.transfor(this.data, this);
        CustomerList.add(this);
    },
	/** 把旅客信息实例转化为HTML格式
	 * @returns {string}
	 */
    toHtml: function(){
        this.cls = this.checked ? "select" : "";
        return '<a class="{$cls}" href="javascript:void(0);" title="{$cnName} {$enName}" uid="{$uid}">{$brName}</a>'.replaceWith(this);
    },
	/** 转化字符串信息，并绑定到一个对象上
	 * @param {string} dat
	 * @param {object} bind
	 */
    transfor: function(dat, bind){
        var arr = dat.split(this.splitter), key = infoList;
        for (var i = 0, l = key.length; i < l; i++) {
            if (key[i] == "names") {
                var n = arr[i].split("|");
                bind["names"] = arr[i];
                bind["cnName"] = n[0];
                bind["enName"] = n[1] ? n[1] : "";
                bind["brName"] = n[0] ? n[0] + "<br />" + n[1] : n[1];
            }
            else {
                bind[key[i]] = arr[i] || '';
            }
        }
    },
	/** 转化旅客信息对象key，用于与每个独立页面元素类通信
	 * @returns {object} 
	 */
    convert: function(){
        var o = {};
        var types = this.certificateType.split("|");
        var typeNums = this.certificateNo.split("|");
        var first = this.getFirstExsitType(types);
        o.uid = this.uid;
        o.UserName = this.cnName ? this.cnName : this.enName;
        o.EnglishName = this.enName;
        o.ChineseName = this.cnName;
        
        o.IDType = first >= 0 ? types[first] : "";
        o.IDNumber = first >= 0 ? typeNums[first] : "";
        o.Birthday = this.birth;
        o.ContactPhone = this.phone;
        o.Nationality = this.nationality;
        o.Sex = this.sex;
        return o;
    },
	/** 获取当前旅客信息第一个在证件类型模板中出现的类型
	 * @param {array} a 后台提供的当前旅客证件类型字符串split("|")
	 * @returns {number} 如果存在返回证件类型id，否则返回-1
	 */
    getFirstExsitType: function(a){
        for (var i = 0, l = a.length; i < l; i++) {
            if (a[i] in cardType) 
                return i;
        }
        return -1;
    }
};

/**
* @description 旅客信息点选按钮框对象
* @param {object} Options.CustomerList
*/
var CustomerList = (function(options){
	/** 旅客信息实例虚拟容器*/
    var hash = {};
	/** Dom容器*/
	var	 box;
	/** 过滤旅客信息输入框中的数据备份*/
	var	 last;
	/** 过滤旅客信息输入框*/
	var	 filter;
	/** 定时器*/
	var	 timer;
	/** 初始化旅客字符串信息容器*/
	var userInfo = [];
	/** 旅客信息输入容器和hash相似*/
	var	 arr = [];
	/** 
	 * <p>点击box的回调函数</p>
	 * <p>如果被点击的元素没有uid返回</p>
	 * <p>如果被点击的元素有uid，并且这个uid对应的旅客信息被选中，则清除选中状态，清空对应的旅客信息模板数据</p>
	 * <p>如果被点击的元素有uid，并且这个uid对应的旅客信息未被选中，则选中，并填充第一个空旅客信息模板</p>
	 * <p>如果没有空旅客信息模板只是返回</p>
	 * @param {event} e
	 */
    function boxMousedown(e){
        var tar = $fixE(e).$target;
        var uid = tar.getAttribute("uid");
        if (!(tar && uid)) 
            return;
        
        if (hash[uid].checked) {
            var board = BoardingList.getUidBoarder(uid);
            board.clearBoarder();
        }
        else {
            var board = BoardingList.getEmptyBoarder();
            if (board) {
                board.fillValue(hash[uid]);
            }
            else 
                return;
        }
        hash[uid].checked = !hash[uid].checked;
        CustomerList.checkClass(tar, hash[uid].checked);
    }
    /** 把旅客信息实例数据输出到box
     * @param {array} arr 旅客信息输入容器
     */
    function output(arr){
        var b = [];
        for (var i = 0; i < arr.length; i++) {
            b.push(arr[i].toHtml());
        }
        box.innerHTML = b.join("");
    }
    /** 定时过滤旅客信息*/
    function filterName(){
        timer = setInterval(function(){
            if (last == filter.value.trim()) 
                return;
            var txt = filter.value.trim(), re = new RegExp(txt, 'i');
            arr.length = 0;
            for (var uid in hash) {
                if (re.test(hash[uid].brName.replace(/<br \/>/g, ""))) 
                    arr.push(hash[uid]);
            }
            output(arr);
        }, 100);
    }
    /** 转化保存信息为旅客信息实例集合
     * @param {string} txt
     * @returns {array}
     */
    function transCustomers(txt){
        var noname = txt.split("&"), arr = [], joiner = String.fromCharCode(12);
        for (var i = 0, l = noname.length; i < l; i++) {
            var s = unescape(noname[i]).split(joiner), str = {};
            str.checked = s[s.length - 1] == "true" ? true : false;
            s.pop();
            str.string = s.join(joiner);
            arr.push(str);
        }
        return arr;
    }
    
    return {
		/**
		* <p>1.初始化元素，注册事件</p>
		* <p>2.如果有保存数据，初始化保存数据</p>
		* <p>3.如果没有保存数据，初始化旅客已有前14条，延时3秒初始化全部</p>
		* <p>4.如果没有已有数据，隐藏掉box</p>
		*/
        initialize: function(){
            var customers = $pageValue.get("customers");
            box = $(options.boxId);
            filter = $(options.filterId);
            box.$r("mousedown", boxMousedown);
            last = filter.value.trim(); 
            filter.$r('focus', filterName);
            filter.$r('blur', function(){
                clearInterval(timer);
            });
            if (customers) {
                userInfo = transCustomers(customers);
                for (var i = 0, l = userInfo.length; i < l; i++) {
                    new Customer(userInfo[i].string, userInfo[i].checked);
                }
                output(arr);
            }
            else {
                userInfo = g_config.userInfo;
                for (var i = 0, l = userInfo.length; i < l; i++) {
                    new Customer(userInfo[i]);
                }
                output(arr);
                setTimeout(function(){
                    $ajax(g_config.userUrl, null, function(txt){
                        var d = txt.trim().match(/[^\r\n]+/g);
                        if (!d) 
                            return;
                        for (var i = 0, l = d.length; i < l; i++) 
                            new Customer(d[i]);
                        output(arr);
                    });
                }, 3000);
            };
            if (userInfo.length == 0) {
                box.parentNode.parentNode.style.display = "none";
                return;
            };
        },
	   /** 增加一个实例 
	    * @param {object} obj
	    */
        add: function(obj){
            var uid = obj.uid;
            if (uid in hash) 
                return;
            hash[uid] = obj;
            arr.push(obj);
        },
		/** 改变class
		 * @param {element} el
		 * @param {boolen} bool
		 */
        checkClass: function(el, bool){
            if (bool) {
                el.className = "select";
            }
            else {
                el.className = "";
            }
        },
		/** 通过uid获取旅客信息实例
		 * @param {number} uid
		 * @returns {object}
		 */
        getUid: function(uid){
            return hash[uid];
        },
		/** 通过uid获取旅客信息按钮元素
		 * @param {number} uid
		 * @returns {element}
		 */
        getUidElement: function(uid){
            var as = box.$("a");
            for (var i = 0; i < as.length; i++) {
                if (as[i].getAttribute("uid") == uid) 
                    return as[i];
            }
        },
		/** 更改选中状态
		 * @param {number} uid
		 */
        changeChecked: function(uid){
            hash[uid].checked = !hash[uid].checked;
            this.checkClass(this.getUidElement(uid), hash[uid].checked);
        },
		/** 拼接保存数据
		 * @returns {string}
		 */
        getAll: function(){
            var arr = [], joiner = String.fromCharCode(12);
            for (var uid in hash) {
                var a = [];
                for (var i = 0, l = infoList.length; i < l; i++) {
                    a.push(hash[uid][infoList[i]]);
                }
                a.push(hash[uid].checked);
                arr.push(escape(a.join(joiner)));
            }
            return arr.join("&");
        }
    }
})(Options.CustomerList);

/**
* @class 旅客信息模板子元素抽象类
* @param {object} O 子元素信息
* @constructor
* @returns {object} 一个子元素实例
*/
var Base = function(O){
	/** 实例name*/
    this.name = O.name;
	/** 实例文字描述*/
    this.tHead = $s2t(O.tHead);
	/** 绑定到得旅客信息模板*/
    this.bind = O.bind;
	/** 是否必填项*/
    this.must = O.must;
	/** 相关实例*/
    this.refer = O.refer;
    this.initialize();
};
Base.prototype = {
	/** 绘制描述文字
	 * @param {string} txt
	 * @param {boolen} bol 是否必填
	 * @returns {element}
	 */
    makeTHead: function(txt, bol){
        var th = document.createElement("th");
        if (txt) 
            th.innerHTML = bol ? ("<dfn>*</dfn>" + txt) : txt;
        return th;
    },
	/** 绘制input元素
	 * @param {string} mod tuna配置属性分隔符任意
	 * @param {string} css input设置的样式属性
	 * @returns {element} input 
	 */
    createInput: function(mod, css){
        var ipt = $c("input");
        ipt.type = "text";
        ipt.style.cssText = css;
        if (mod) 
            ipt.setAttribute("mod", mod);
        if (/notice/.test(mod)) {
            ipt.setAttribute("mod_notice_tip", greyTips[this.name]);
        }
        if (/floatntc/.test(mod)) {
            ipt.setAttribute("mod_floatntc_tip", greyTips[this.name]);
        }
        if (/address/.test(mod)) {
            ipt.setAttribute("mod_address_suggest", $s2t("@China|中国大陆|CN@China HongKong|中国香港|HK@China Macau|中国澳门|MO@China Taiwan|中国台湾|TW@United States|美国|US@United Kingdom|英国|GB@Japan|日本|JP@Canada|加拿大|CA@France|法国|FR@Korea,Republic of|韩国|KR@Germany|德国|DE@"));
            ipt.setAttribute("mod_address_source", "nationality");
        }
        
        ipt.setAttribute("autocomplete", "off");
        return ipt;
    },
	/** 绘制黄色浮出提示框
	 * @returns {element} div
	 * @param {string} txt
	 */
    createYellowTip: function(txt){
        var pa = $c("div");
        pa.className = "person_yellowtips";
        var ch = document.createElement("div");
        ch.className = "person_yellowtips_content";
        ch.appendChild(document.createTextNode(txt));
        pa.appendChild(ch);
        pa.style.display = "none";
        this.td.appendChild(pa);
        return pa;
    },
	/** 绘制浮出层
	 * returns {element} 带有浮出层的元素
	 * @param {Object} obj 浮出层配置数据
	 */
    createFloat: function(obj){
        var el = document.createElement(obj.tag);
        el.className = obj.cls;
        el.appendChild(document.createTextNode(obj.text));
        el.setAttribute("mod", "jmpInfo");
        el.setAttribute("mod_jmpinfo_page", obj.sty);
        el.setAttribute("mod_jmpinfo_content", obj.content);
        return el;
    },
	/** 绘制空td元素
	 * @returns {element} td
	 */
    makeTBody: function(){
        return document.createElement("td");
    },
	/** 初始化描述文字，初始化子元素，绑定模板*/
    initialize: function(){
        this.th = this.makeTHead(this.tHead, this.must);
        this.td = this.makeTBody();
        this.bind[this.name] = this;
    },
	/** 赋值
	 * @param {string|number} v
	 */
    set: function(v){
        return true;
    },
	/** 清空*/
    clear: function(){
        return true;
    },
	/** 获取值
	 * @returns {string}
	 */
    get: function(){
        if (!this.input || this.input.isNull()) 
            return "";
        return this.input.value;
    },
    /** 保存值*/
    save: function(){
        var key = this.name + this.bind.index;
        $pageValue.set(key, this.get());
    },
	/** 读取保存值*/
    load: function(){
        var key = this.name + this.bind.index;
        var value = $pageValue.get(key);
        this.set(value);
    },
	/** 
	 * <p>不显示不做校验</p>
	 * <p>空值时做提示</p>
	 * @returns {boolen}
	 */
    validate: function(){
        if (this.input && this.input.$isDisplay() && this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        return true;
    },
	/** 设置name*/
    initName: function(){
        if (!this.input) 
            return;
        this.input.name = this.name + this.bind.index;
    }
}

/**
* @class 旅客姓名类
* @param {object} O 姓名信息
* @constructor
* @extends Base
* @returns {object} 一个子元素实例
*/
var UserName = function(O){
    Base.call(this, O);
}
__extend(UserName, Base);
$extend(UserName.prototype,
	/** @lends UserName.prototype*/
	{
	/** 
	 * 绘制姓名元素体
	 * @returns {element}
	 */
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice", "width:165px");
        this.input = input;
        $(input).$r("focus", this.showNameNotice.bind(this));
        $(input).$r("blur", this.hiddenNameNotice.bind(this));
        td.appendChild(input);
        td.appendChild(this.createFloat(_s2t({
            tag: "span",
            cls: "base_txtdiv",
            text: "填写说明",
            sty: "fltdomestic_nametip",
            content: "1.乘客姓名必须与登机时所使用证件上的名字一致，如“王小明”。|2.如持护照登机，使用中文姓名，必须确认护照上有中文姓名。|3.持护照登机的外宾，必须按照护照顺序区分姓与名，例如“Smith/Black”，不区分大小写。|4.乘客姓名如需手写，必须注明正确的拼音，例如李玥ｙｕｅ，可输入“李 /yue”。"
        })));
        $d(input);
        return td;
    },
    showNameNotice: function(){//show name selector
        if (!this.nameNotice) {//if not exist create it
            this.nameNotice = this.createNameNotice();
            this.td.insertBefore(this.nameNotice, this.td.firstChild);
        }
        this.nameNotice.style.display = "block";
    },
    createNameNotice: function(inner){
        var notice = document.createElement("div");
        notice.className = "person_passenger";
        notice.style.display = "none";
        notice.innerHTML = inner ? inner : '<div class="base_txtgray hand"><span>中文或拼音</span>中文姓名</div><div class="base_txtgray hand"><span>last/first middle</span>英文姓名</div>';
        var _this = this;
        $(notice).$r("mousedown", function(e){
            var tar = $fixE(e).$target;
            $stopEvent(e, 2);
            if (tar.tagName == "A" || tar.parentNode.nodeType == 1 && tar.parentNode.tagName == "A") {
                var value = tar.getAttribute("val") || tar.parentNode.getAttribute("val");
                _this.set(value);
                _this.nameNotice.style.display = "none";
                _this.input.blur();
            }
            this.innerHTML += "";
        });
        return notice;
    },
    hiddenNameNotice: function(){//hidden name selector
        if (!this.nameNotice) 
            return;
        this.nameNotice.style.display = "none";
    },
    updateNotice: function(cn, en){ // update name selector when click customer and fill value @cnName String @enName String
        var html = "", cnTemp = '<div class="base_txtgray"><span>中文或拼音</span>中文姓名</div>', enTemp = '<div class="base_txtgray"><span>last/first middle</span>英文姓名</div>'
        
        if (cn) 
            html = '<a val="' + cn + '" href="javascript:void(0);"><span>' + cn + '</span>中文姓名</a>';
        else 
            html = cnTemp;
        if (en) 
            html += '<a val="' + en + '" href="javascript:void(0);"><span>' + en + '</span>英文姓名</a>';
        else 
            html += enTemp;
        if (!this.nameNotice) {//if not exsit create it
            this.nameNotice = this.createNameNotice();
            this.td.insertBefore(this.nameNotice, this.td.firstChild);
        }
        this.nameNotice.innerHTML = html;
    },
    set: function(value){//@value String
        this.input.value = value || "";
        checkNotice(this.input);
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input); //check notice mod
    },
    save: function(){
        var key = this.name + this.bind.index;
        $pageValue.set(key, this.get());
        if (this.nameNotice) 
            $pageValue.set("name_notice" + this.bind.index, this.nameNotice.innerHTML); //save name selector if exist
    },
    load: function(){
        var key = this.name + this.bind.index;
        var value = $pageValue.get(key);
        this.set(value);
        var _notice = $pageValue.get("name_notice" + this.bind.index);
        if (_notice) {
            this.nameNotice = this.createNameNotice(_notice);
            this.td.insertBefore(this.nameNotice, this.td.firstChild);
        }
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        else {
            var type = this.bind["IDType"];
            if (!type) 
                return true;
            if (type.get() == 1 && !hasChsChar(this.get())) 
                return $$alert(this.input, "请填写中文姓名，中文姓名只能包含汉字、字母和连字符，请检查");
            return checkName(this.input);
        }
        return true;
    }
});

var ContactPhone = function(O){
    Base.call(this, O);
}
__extend(ContactPhone, Base);
$extend(ContactPhone.prototype, {
    makeTBody: function(){
        var td = document.createElement("td"), text = document.createTextNode(greyTips[this.name]);
        input = this.createInput("", "width:165px");
        this.input = input;
        td.className = "base_txtgray";
        td.appendChild(input);
        td.appendChild(text);
        return td;
    },
    set: function(value){
        this.input.value = value || "";
    },
    clear: function(){
        this.input.value = "";
    },
    validate: function(){
        return true;
    } //because not must fill ,override Base class method
});

var EnglishName = function(O){
    Base.call(this, O);
}
__extend(EnglishName, Base);
$extend(EnglishName.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice|floatntc", "width:165px");
        td.appendChild(input);
        this.input = input;
        td.appendChild(this.createFloat(_s2t({
            tag: "span",
            cls: "base_txtdiv",
            text: "填写说明",
            sty: "default_normal",
            content: "填写说明|请在“英文姓名”栏目按照“姓/名”的格式填写英文姓名或中文姓名拼音，如：Jim/Green，Li/Jun。请确保所填姓名与证件上完全一致。"
        })));
        $d(input);
        return td;
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        else {
            return checkEngName(this.get(), this.input);
        }
        return true;
    }
});

var ChineseName = function(O){
    Base.call(this, O);
}
__extend(ChineseName, Base);
$extend(ChineseName.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice|floatntc", "width:165px");
        td.appendChild(input);
        this.input = input;
        td.appendChild(this.createFloat({
            tag: "span",
            cls: "base_txtdiv",
            text: "填写说明",
            sty: "fltdomestic_nametip",
            content: "1.乘客姓名必须与登机时所使用证件上的名字一致，如“王小明”。|2.如持护照登机，使用中文姓名，必须确认护照上有中文姓名。|3.持护照登机的外宾，必须按照护照顺序区分姓与名，例如“Smith/Black”，不区分大小写。|4.乘客姓名如需手写，必须注明正确的拼音，例如李玥ｙｕｅ，可输入“李 /yue”。"
        }));
        $d(input);
        return td;
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        if (this.bind.Nationality && this.bind.Nationality.getHidden() == "CN") {//如果国籍为中国大陆，必须含有中文字符，符合中文逻辑
            if (!hasChsChar(this.get()) || !(checkChsName(this.get(), this.input))) 
                return $$alert(this.input, "中文姓名只能包含汉字、字母和连字符，请检查");
        }
        else 
            return checkName(this.input); //虽然是中文姓名，但为了让客人通过，只要满足一种逻辑就放通过
        return true;
    }
});

var Nationality = function(O){
    Base.call(this, O);
}
__extend(Nationality, Base);
$extend(Nationality.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var ipt = this.createInput("notice|address", "width:165px");
        var input = document.createElement("input");
        this.input = ipt;
        input.type = "hidden";
        td.appendChild(ipt);
        td.appendChild(input);
        $d(ipt);
        ipt.module.address.reference = input;
        ipt.module.address.hook.change = this.showTWNotice.bind(this);
        return td;
    },
    showTWNotice: function(){// Tai Wan ren need notice but not use now
        if (this.bind["IDType"]) 
            this.bind["IDType"].showYellowNotice(greyTips.TWNotice);
    },
    set: function(value){
        this.input.value = value || "";
        var el = this.input;
        (function(){
            if (!checkAddress(el)) 
                setTimeout(arguments.callee, 50); //may be source or  reference not ready
        })();
    },
    clear: function(){
        this.input.value = "";
        this.input.module.address.reference.value = "";
        checkAddress(this.input);
    },
    getHidden: function(){
        return this.input.module.address.reference.value;
    },
    validate: function(){
        if (!this.input.$isDisplay()) 
            return true;
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        if (this.bind["UserName"]) {
            var nation = this.getHidden();
            if (nation == "CN" && !hasChsChar(this.bind["UserName"].get()))//国籍为中国大陆，必须填写中文姓名
                return $$alert(this.bind["UserName"].input, "请填写旅客的中文姓名");
        }
        return true;
    },
    initName: function(){
        this.input.module.address.reference.name = this.name + this.bind.index;
    }
});

var IDType = function(O){
    Base.call(this, O);
}
__extend(IDType, Base);
$extend(IDType.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var ipt = this.createInput("", "width:165px");
        ipt.readOnly = true;
        ipt.$r("focus", this.showIDNotice.bind(this));
        ipt.$r("blur", this.hiddenIDNotice.bind(this));
        var inHid = document.createElement("input");
        inHid.type = "hidden";
        this.input = ipt;
        this.inputHidden = inHid;
        td.appendChild(ipt);
        td.appendChild(inHid);
        return td;
    },
    initDefault: function(){
        //init default IDType 
        //method : get the first one  in cardType
        var first = this.getFirstType();
        this.set(first);
    },
    showYellowNotice: function(notice){
        //object of Nationality do not show 
        //nationatlity is TW and IDType is not 7 8 21 show tips 
        //and if nationatlity is hidden do not show
        //3 ways to access this function :
        //change nation 
        //change idtype
        //click customer
        // if(!this.bind["Nationality"])	return;
        // var p = this.bind["Nationality"].input.module.address.reference.value;
        // var v = this.inputHidden.value;
        // if(p == "TW" && !(v == 7 || v == 8 || v == 21)&&this.bind["Nationality"].input.$isDisplay()){
        // if(!this.yellowNotice)
        // this.yellowNotice = this.createYellowTip(notice);
        // this.yellowNotice.style.display = "block";
        // this.yellowNotice.$setIframe();
        // }
        // else{
        // this.hidYellowNotice();
        // }
    },
    hidYellowNotice: function(){
        if (this.yellowNotice) {
            this.yellowNotice.style.display = "none";
            this.yellowNotice.$clearIframe();
        }
    },
    getFirstType: function(){
        for (var k in cardType) 
            return k;
    },
    showIDNotice: function(){
        if (!this.IDNotice) {
            this.IDNotice = this.createSelectList();
            this.td.insertBefore(this.IDNotice, this.td.firstChild);
        }
        this.IDNotice.style.display = "block";
    },
    createSelectList: function(inner){
        var notice = document.createElement("div");
        notice.className = "person_floatlist";
        notice.style.display = "none";
        if (!inner) {
            var arr = [];
            arr.push("<p><span>证件号码</span>证件类型</p>");
            for (var key in cardType) {
                arr.push('<a t_id="' + key + '" href="javascript:void(0);"><span></span>' + cardType[key] + '</a>');
            }
            notice.innerHTML = arr.join("");
        }
        else {
            notice.innerHTML = inner;
        }
        var _this = this;
        $(notice).$r("mousedown", function(e){
            var tar = $fixE(e).$target;
            $stopEvent(e, 2);
            if (tar.tagName == "A" || tar.parentNode.nodeType == 1 && tar.parentNode.tagName == "A") {
                var value = tar.getAttribute("t_id") || tar.parentNode.getAttribute("t_id");
                var no = tar.tagName == "SPAN" ? tar.innerHTML : tar.firstChild.innerHTML;
                _this.bind["IDNumber"].set(no);
                _this.set(value);
                _this.IDNotice.style.display = "none";
                _this.input.blur();
            }
            this.innerHTML += "";
        });
        return notice;
    },
    hidRef: function(){
        for (var i = this.refer.length; i--;) {
            if (this.bind[this.refer[i]]) {
                this.bind[this.refer[i]].th.style.visibility = "hidden";
                this.bind[this.refer[i]].td.style.visibility = "hidden";
            }
        }
    },
    showRef: function(){
        for (var i = this.refer.length; i--;) {
            if (this.bind[this.refer[i]]) {
                this.bind[this.refer[i]].th.style.visibility = "";
                this.bind[this.refer[i]].td.style.visibility = "";
            }
        }
    },
    hiddenIDNotice: function(){
        if (!this.IDNotice) 
            return;
        this.IDNotice.style.display = "none";
    },
    updateSelectList: function(keys, nums){
        //update it when click the Customer
        var arr = [];
        arr.push("<p><span>证件号码</span>证件类型</p>");
        for (var key in cardType) {
            var index = this.getIndex(key, keys);
            arr.push('<a t_id="{$key}" t_num="{$num}" href="javascript:void(0);"><span>{$num}</span>{$type}</a>'.replaceWith({
                key: key,
                num: index == -1 ? "" : nums[index],
                type: cardType[key]
            }));
        }
        if (!this.IDNotice) {
            this.IDNotice = this.createSelectList();
            this.td.insertBefore(this.IDNotice, this.td.firstChild);
        }
        this.IDNotice.innerHTML = arr.join("");
    },
    getIndex: function(item, arr){
        if (!arr) 
            return -1;
        for (var i = arr.length; i--;) 
            if (item == arr[i]) 
                return i;
        return -1;
    },
    set: function(value){
        this.inputHidden.value = value || "";
        this.input.value = cardType[value] || "";
        if (value == 1) 
            this.hidRef();
        else 
            this.showRef();
        if (value == 2) 
            this.showPassportType();
        else 
            this.hidPassportType();
        this.showYellowNotice(greyTips.TWNotice);
    },
    hidPassportType: function(){
        if (this.bind["PassportType"]) {
            this.bind["PassportType"].th.style.visibility = "hidden";
            this.bind["PassportType"].td.style.visibility = "hidden";
        }
    },
    showPassportType: function(){
        if (this.bind["PassportType"]) {
            this.bind["PassportType"].th.style.visibility = "";
            this.bind["PassportType"].td.style.visibility = "";
        }
    },
    clear: function(){
        this.inputHidden.value = "";
        this.input.value = "";
        this.showYellowNotice(greyTips.TWNotice);
    },
    get: function(){
        return this.inputHidden.value;
    },
    save: function(){
        var key = this.name + this.bind.index;
        $pageValue.set(key, this.get());
        if (this.IDNotice) 
            $pageValue.set("_notice" + this.bind.index, this.IDNotice.innerHTML);
        if (this.yellowNotice) {
            var txt = this.yellowNotice.innerText || this.yellowNotice.textContent;
            $pageValue.set("_yellow" + this.bind.index, txt);
        }
    },
    load: function(){
        var key = this.name + this.bind.index;
        var value = $pageValue.get(key);
        this.set(value);
        var _notice = $pageValue.get("_notice" + this.bind.index);
        var _yellow = $pageValue.get("_yellow" + this.bind.index);
        if (_notice) {
            this.IDNotice = this.createSelectList(_notice);
            this.td.insertBefore(this.IDNotice, this.td.firstChild);
        }
        if (_yellow) {
            this.yellowNotice = this.createYellowTip(_yellow);
            this.yellowNotice.$setIframe();
        }
    },
    initName: function(){
        this.inputHidden.name = this.name + this.bind.index;
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        var nation = this.bind.Nationality;
        if (!nation) 
            return true;
        if (this.get() == 4 && nation.getHidden() != "CN") {
            return $$alert(this.input, "军人证只限中国大陆居民使用，请选择其他证件");
        }
        return true;
    }
});

var Sex = function(O){
    Base.call(this, O);
}
__extend(Sex, Base);
$extend(Sex.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var select = $c("select");
        select.options.add(new Option("男", "M"));
        select.options.add(new Option("女", "F"));
        select.name = "Sex";
        select.style.width = "169px";
        this.select = select;
        td.appendChild(select);
        return td;
    },
    set: function(value){
        this.select.value = value;
    },
    clear: function(){
        this.select.value = "M";
    },
    get: function(){
        return this.select.value;
    },
    initName: function(){
        this.select.name = this.name + this.bind.index;
    }
});

var IDNumber = function(O){
    Base.call(this, O);
}
__extend(IDNumber, Base);
$extend(IDNumber.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("", "width:165px;");
        this.input = input;
        td.appendChild(input);
        return td;
    },
    set: function(value){
        this.input.value = value || "";
    },
    clear: function(){
        this.input.value = "";
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        var v = this.get();
        var t = this.bind.IDType.get();
        if (t == 1) {
            if (!v.isChinaIDCard()) 
                return $$alert(this.input, "请填写正确的身份证号码");
            else 
                return this.fillHiddenValues();
        }
        else 
            if (t == 8) {
                if (/[^A-Za-z0-9()（）]/.test(v)) 
                    return $$alert(this.input, "请填写正确的台胞证号码：号码中只能包含数字、字母或括号");
            }
            else {
                if (/[^A-Za-z0-9]/.test(v)) 
                    return $$alert(this.input, "请填写正确的" + cardType[t] + "号码，号码中只能包含数字或字母");
            }
        return true;
    },
    fillHiddenValues: function(){//如果是身份证给隐藏掉的3项，并传递年龄供后面校验
        var values = parseChineseId(this.get());
        if (values.passengerBirth.laterThenDepart()) 
            return $$alert(this.input, "请填写正确的身份证号码");
        if (values.passengerBirth.isBaby()) 
            return $$alert(this.input, "请填写正确的身份证号码");
        this.bind["Nationality"] && this.bind["Nationality"].set(values.passengerNationality);
        this.bind["Sex"] && this.bind["Sex"].set(values.passengerSex);
        this.bind["Birthday"] && this.bind["Birthday"].set(values.passengerBirth);
        if (values.passengerBirth.isBaby()) 
            this.bind.age = "BAB";
        else 
            if (values.passengerBirth.isChild()) 
                this.bind.age = "CHI";
            else 
                this.bind.age = "ADU";
        return true;
    }
});

var Birthday = function(O){
    Base.call(this, O);
}
__extend(Birthday, Base);
$extend(Birthday.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice|floatntc", "width:165px");
        td.appendChild(input);
        this.input = input;
        $d(input);
        return td;
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.$isDisplay()) {
            if (this.input.isNull()) 
                return $$alert(this.input, "请填写" + this.tHead);
            if (!dateParse(this.get()) || this.get().laterThenDepart()) 
                return $$alert(this.input, "请正确填写出生日期，格式：yyyy-mm-dd，且不得晚于出发日期");
            if (this.get().isChild() && this.bind.Nationality && this.bind.Nationality.getHidden() == 4) {
                return $$alert(this.input, "儿童或婴儿不能使用军人证购买机票");
            }
            if (this.get().isBaby()) 
                this.bind.age = "BAB";
            else 
                if (this.get().isChild()) 
                    this.bind.age = "CHI";
                else 
                    this.bind.age = "ADU";
        }
        return true;
    }
});

var CardValidUntil = function(O){
    Base.call(this, O);
}
__extend(CardValidUntil, Base);
$extend(CardValidUntil.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice|floatntc", "width:165px");
        td.appendChild(input);
        this.input = input;
        $d(input);
        return td;
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写" + this.tHead);
        if (!dateParse(this.input.value)) 
            return $$alert(this.input, "请正确填写证件有效期，格式：yyyy-mm-dd");
        if (!this.input.value.laterThenDepart()) 
            return $$alert(this.input, "您的证件已经过了有效期，会影响您正常登机。建议重新办理后再预订。");
        return true;
    }
});

var PassportType = function(O){
    Base.call(this, O);
}
__extend(PassportType, Base);
$extend(PassportType.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var select = $c("select");
        select.options.add(new Option("因私护照(P)", "P"));
        select.options.add(new Option("因公护照(I)", "I"));
        select.options.add(new Option("外交护照(D)", "D"));
        select.style.width = "169px";
        this.select = select;
        td.appendChild(select);
        return td;
    },
    clear: function(){
        this.select.selectedIndex = 0;
    },
    set: function(value){
        this.select.selectedIndex = value;
    },
    get: function(){
        return this.select.selectedIndex;
    },
    initName: function(){
        this.select.name = this.name + this.bind.index;
    }
});

var SignPlace = function(O){
    Base.call(this, O);
}
__extend(SignPlace, Base);
$extend(SignPlace.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("", "width:165px");
        td.appendChild(input);
        this.input = input;
        return td;
    },
    clear: function(){
        this.input.value = "";
    },
    set: function(value){
        this.input.value = value || '';
    }
});

var SignDate = function(O){
    Base.call(this, O);
}
__extend(SignDate, Base);
$extend(SignDate.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice|floatntc", "width:165px");
        td.appendChild(input);
        this.input = input;
        $d(input);
        return td;
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    validate: function(){//存在api才校验SignDate
        if (this.bind.API) {
            if (this.input.isNull()) 
                return $$alert(this.input, "请填写" + this.tHead);
            var date = this.get();
            if (!dateParse(date)) 
                return $$alert(this.input, "请正确填写签发日期，格式：yyyy-mm-dd");
            if (date.laterThenToday()) 
                return $$alert(this.input, "请填写正确日期，并且不能晚于今天");
        }
        return true;
    }
});

var Postalcode = function(O){
    Base.call(this, O);
}
__extend(Postalcode, Base);
$extend(Postalcode.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("", "width:165px");
        this.input = input;
        td.appendChild(input);
        return td;
    },
    clear: function(){
        this.input.value = "";
    },
    set: function(value){
        this.input.value = value || "";
    }
});

var Location = function(O){
    Base.call(this, O);
}
__extend(Location, Base);
$extend(Location.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice", "width:265px");
        this.input = input;
        td.appendChild(input);
        $d(input);
        return td;
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写现居住地址");
        if (!this.get().match(/^[^\/\s]+\/[^\/\s]+\/[^\/\s]+$/)) 
            return $$alert(this.input, "请正确填写现居住地址，格式：省/市/地址");
        return true;
    }
});

var API = function(O){
    Base.call(this, O);
}
__extend(API, Base);
$extend(API.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        td.className = "base_txtgray";
        td.innerHTML = "（应目的国家要求，请提供预先旅客信息，以确保你您能够顺利的办理出入境手续）";
        return td;
    },
    validate: function(){
        return true;
    }
});

var Destination = function(O){
    Base.call(this, O);
}
__extend(Destination, Base);
$extend(Destination.prototype, {
    makeTBody: function(){
        var td = document.createElement("td");
        var input = this.createInput("notice", "width:265px");
        this.input = input;
        td.appendChild(input);
        $d(input);
        return td;
    },
    clear: function(){
        this.input.value = "";
        checkNotice(this.input);
    },
    set: function(value){
        this.input.value = value || "";
        checkNotice(this.input);
    },
    validate: function(){
        if (this.input.isNull()) 
            return $$alert(this.input, "请填写目的地地址");
        if (!this.get().match(/^[^\/\s]+\/[^\/\s]+\/[^\/\s]+$/)) 
            return $$alert(this.input, "请正确填写目的地地址，格式：州/城市/地址");
        if (hasChsChar(this.get())) 
            return $$alert(this.input, "目的地地址不能包含汉字, 请检查");
        return true;
    }
});

var Empty = function(O){
    Base.call(this, O);
}
__extend(Empty, Base);
$extend(Empty.prototype, {
    makeTHead: function(){
        return document.createElement("th");
    }
});

var BussinessCard = function(O){
    Base.call(this, O);
}
__extend(BussinessCard, Base);
$extend(BussinessCard.prototype, {
    makeTBody: function(){
        var td = document.createElement("td"), text = document.createTextNode(greyTips[this.name]);
        input = this.createInput("", "width:165px");
        td.className = "base_txtgray";
        this.input = input;
        td.appendChild(input);
        td.appendChild(text);
        return td;
    },
    clear: function(){
        this.input.value = "";
    },
    set: function(value){
        this.input.value = value || "";
    }
});

var BirthPlace = function(O){
    Base.call(this, O);
}
__extend(BirthPlace, Base);
$extend(BirthPlace.prototype, {
    makeTBody: function(){
        var td = document.createElement("td"), text = document.createTextNode(greyTips[this.name]);
        input = this.createInput("", "width:165px");
        this.input = input;
        td.className = "base_txtgray";
        td.appendChild(input);
        td.appendChild(text);
        return td;
    },
    clear: function(){
        this.input.value = "";
    },
    set: function(value){
        this.input.value = value || "";
    }
});

//boarders list
var BoardingList = (function(options){
    var box = {}, //dom container
 hash = [], // boarders virtual container begins from 1, 0 is null
 num = 0, //total boarders
 selectedIndex = 1, //selected index
 template = [], //drew Class template
 floor = []; //floored template
    function attachFocusEvent(){//exchange focus backgroud of boarders
        if (selectedIndex == this.index) 
            return;
        if (selectedIndex) 
            hash[selectedIndex].className = "person_pginfo";
        selectedIndex = this.index;
        this.className = "person_pginfo person_pgchick";
    }
    
    function floorArray(a){
        return a.join(",").split(",");
    }
    
    function fillValue(data){
        if (!data) 
            return;
        if (this.uid) 
            CustomerList.changeChecked(this.uid);
        var arr = floor;
        var obj = data.convert();
        this.uid = data.uid; //give addional uid
        this.Uid.value = this.uid;
        for (var i = 0, l = arr.length; i < l; i++) {//update notices when filled value
            if (arr[i] == "IDType") 
                this[arr[i]].updateSelectList(data.certificateType.split("|"), data.certificateNo.split("|"));
            if (arr[i] == "UserName") 
                this[arr[i]].updateNotice(obj.ChineseName, obj.EnglishName);
            this[arr[i]].set(obj[arr[i]]); // call each set method for fill all value
        }
    }
    
    function inArray(arr, item){ //if one Class in floor
        if (!arr) 
            return;
        for (var i = arr.length; i--;) 
            if (arr[i] == item) 
                return i;
        return -1;
    }
    
    function getTotal(obj){//total num
        var n = 0;
        for (var key in obj) {
            n = n + parseInt(obj[key]);
        }
        return n;
    }
    
    function clearBoarder(index){
        var arr = floor;
        
        for (var i = 0, l = arr.length; i < l; i++) {
            this[arr[i]].clear(); //clear boarder by call each Class clear method
        }
        if (index) {
            var id = hash[index].uid;
            if (!id) 
                return;
            CustomerList.changeChecked(id);
        }
        this.Uid.value = "";
        this.uid = "";
    }
    
    return {
        initialize: function(){
            var flag = $pageValue.get("saved");
            box = $(options.boxId);
            num = getTotal(g_config.passengerType);
            template = g_config.boarderTemplate;
            floor = floorArray(template);
            if (template.length == 0) 
                return;
            for (var i = 1; i <= num; i++) {
                hash[i] = this.createBoarder(i);
                hash[i].fillValue = fillValue.bind(hash[i]);
                hash[i].clearBoarder = clearBoarder.bind(hash[i]);
                hash[i].index = i;
                hash[i].$r("mousedown", attachFocusEvent);
                
                //initDefault when boarder is created
                if (hash[i]["IDType"]) 
                    hash[i]["IDType"].initDefault();
                box.appendChild(hash[i]);
            }
            if (flag) {//if saved value exist init it
                this.initSavedInfo();
            }
        },
        getUidBoarder: function(uid){//get boarder by uid
            for (var i = 1, l = hash.length; i < l; i++) {
                if (hash[i].uid == uid) 
                    return hash[i];
            }
        },
        getEmptyBoarder: function(){//get empty boarder
            for (var i = 1, l = hash.length; i < l; i++) {
                var un = hash[i].UserName || hash[i].EnglishName;
                if ($(un.input).isNull()) 
                    return hash[i];
            }
            return;
        },
        getNameList: function(){//get all boarders name for contact init boarder name
            var arr = [];
            var mainName = floor[0];
            for (var i = 1, l = hash.length; i < l; i++) {
                arr.push([hash[i].uid, hash[i][mainName].get(), hash[i]["ContactPhone"] ? hash[i]["ContactPhone"].get() : ""]);
            }
            return arr;
        },
        createBoarder: function(index){//draw boarder
            var boarder = $c("div"), title = $c("div"), check = $c("label"), strong = $c("strong"), del = $c("a"), hidden = $c("input");
            
            hidden.type = "hidden";
            hidden.name = "Uid" + index;
            
            
            check.className = "base_label";
            check.innerHTML = '<input type="checkbox" checked="checked" value="T" name="saveName' + index + '"/>保存到常用姓名';
            
            del.className = "person_delete";
            del.href = "javascript:void(0);";
            del.innerHTML = "删除";
            del.$r("mousedown", clearBoarder.bind(boarder, index));
            
            strong.innerHTML = "第" + (index) + "位旅客";
            
            title.className = "title";
            title.appendChild(check);
            title.appendChild(strong);
            
            title.appendChild(hidden);
            title.appendChild(del);
            
            boarder.Uid = hidden;
            boarder.appendChild(title);
            boarder.appendChild(this.createBody(boarder));
            boarder.className = (index == selectedIndex) ? "person_pginfo person_pgchick" : "person_pginfo";
            
            return boarder;
        },
        createBody: function(b){ // draw body
            var table = document.createElement("table");
            var tbody = document.createElement("tbody");
            table.className = "person_pgcontent";
            table.cellSpacing = "0";
            table.cellPadding = "0";
            table.border = "0";
            table.appendChild(tbody);
            var obj = {};
            for (var i = 0, l = template.length; i < l; i++) {
                var tr = document.createElement("tr");
                for (var j = 0, n = template[i].length; j < n; j++) {
                    obj.name = template[i][j];
                    obj.bind = b;
                    switch (template[i][j]) {
                        case "UserName":
                            obj.tHead = "姓名";
                            obj.must = true;
                            break;
                        case "ContactPhone":
                            obj.tHead = "联系电话";
                            obj.must = false;
                            break;
                        case "Nationality":
                            obj.tHead = "国籍";
                            obj.must = true;
                            break;
                        case "IDType":
                            obj.tHead = "证件类型";
                            obj.must = true;
                            obj.refer = ["Nationality", "Sex", "Birthday"];
                            break;
                        case "Sex":
                            obj.tHead = "性别";
                            obj.must = true;
                            break;
                        case "IDNumber":
                            obj.tHead = "证件号码";
                            obj.must = true;
                            break;
                        case "Birthday":
                            obj.tHead = "出生日期";
                            obj.must = true;
                            break;
                        case "CardValidUntil":
                            obj.tHead = "证件有效期";
                            obj.must = true;
                            break;
                        case "PassportType":
                            obj.tHead = "护照类型";
                            obj.must = true;
                            break;
                        case "SignPlace":
                            obj.tHead = "签发地";
                            obj.must = true;
                            break;
                        case "SignDate":
                            obj.tHead = "签发日期";
                            obj.must = true;
                            break;
                        case "API":
                            obj.tHead = "API预先旅客信息";
                            obj.must = false;
                            break;
                        case "Postalcode":
                            obj.tHead = "邮编";
                            obj.must = true;
                            break;
                        case "Location":
                            obj.tHead = "现居住地址";
                            obj.must = true;
                            break;
                        case "Destination":
                            obj.tHead = "目的地地址";
                            obj.must = true;
                            break;
                        case "ChineseName":
                            obj.tHead = "中文姓名";
                            obj.must = true;
                            break;
                        case "EnglishName":
                            obj.tHead = "英文姓名";
                            obj.must = true;
                            break;
                        case "BirthPlace":
                            obj.tHead = "出生地";
                            obj.must = true;
                            break;
                        case "BussinessCard":
                            obj.tHead = "商旅卡号";
                            obj.must = true;
                            break;
                            
                        default:
                    }
                    var ee = eval("new " + template[i][j] + "(obj)");
                    if (n == 1) 
                        ee.td.colSpan = "3";
                    tr.appendChild(ee.th);
                    tr.appendChild(ee.td);
                }
                tbody.appendChild(tr);
            }
            return table;
        },
        saveAll: function(){ //save when beforeunload
            var tem = floor;
            $pageValue.set("saved", "true");
            for (var i = 1, n = hash.length; i < n; i++) {
                $pageValue.set("Uid" + i, hash[i].Uid.value);
                for (var j = 0, l = tem.length; j < l; j++) {
                    hash[i][tem[j]].save();
                }
            }
        },
        initSavedInfo: function(txt){ //init  when history back
            var tem = floor;
            $pageValue.set("saved", "true");
            for (var i = 1, n = hash.length; i < n; i++) {
                var uid = $pageValue.get("Uid" + i, hash[i].Uid.value);
                hash[i].uid = uid;
                hash[i].Uid.value = uid;
                for (var j = 0, l = tem.length; j < l; j++) {
                    hash[i][tem[j]].load();
                }
            }
        },
        checkBoarders: function(){
            var hasPhone = false;
            var contactorList = {};
            var bussinessList = {};
            var T = g_config.passengerType;
            var adu = T.ADU;
            var chi = T.CHI;
            var bab = T.BAB;
            for (var j = 1, n = hash.length; j < n; j++) {
                for (var i = 0, l = floor.length; i < l; i++) { //debugger;
                    if (!hash[j][floor[i]].validate()) //validate in Class
                        return false;
                }
                if (hash[j].ContactPhone && !hash[j].ContactPhone.input.isNull()) 
                    hasPhone = true;
            }
            
            //validate cross boarders
            for (var j = 1, n = hash.length; j < n; j++) {
                var contactor = hash[j][floor[0]].input.value;
                if (contactor in contactorList) {
                    return $$alert(hash[contactorList[contactor]][floor[0]].input, "请确认姓名是否正确，姓名不能重复");
                }
                else {
                    contactorList[contactor] = j;
                }
            }
            
            if (inArray(floor, "IDNumber") >= 0) {
                for (var j = 1, n = hash.length; j < n; j++) {
                    var tiper = hash[j].Birthday && hash[j].Birthday.input.$isDisplay() ? hash[j].Birthday.input : hash[j].IDNumber.input;
                    if (hash[j].age == "ADU") 
                        if (--adu < 0) 
                            return $$alert(tiper, "成人人数大于预订数");
                    if (hash[j].age == "CHI") 
                        if (--chi < 0) 
                            return $$alert(tiper, "儿童人数大于预订数");
                    if (hash[j].age == "BAB") 
                        if (--bab < 0) 
                            return $$alert(tiper, "婴儿人数大于预订数");
                }
            }
            
            if (inArray(floor, "BussinessCard") >= 0) {
                for (var j = 1, n = hash.length; j < n; j++) {
                    var bussiness = hash[j]["BussinessCard"].input.value;
                    if (bussiness in bussinessList) {
                        return $$alert(hash[bussinessList[bussiness]]["BussinessCard"].input, '您确认商旅卡号是否正确，商旅卡号不能重复');
                    }
                    else {
                        bussinessList[bussiness] = j;
                    }
                }
            }
            if (!hasPhone) {
                return $$alert(hash[1].ContactPhone.input, "请至少输入一位出行旅客的联系电话");
            }
            return true;
        },
        formalName: function(){
            for (var j = 1, n = hash.length; j < n; j++) {
                for (var i = 0, l = floor.length; i < l; i++) {
                    hash[j][floor[i]].initName();
                }
            }
        }
    }
})(Options.BoardingList);

//global functions
var contains = document.compareDocumentPosition ? function(a, b){
    return a == b || !!(a.compareDocumentPosition(b) & 16);
}
 : function(a, b){
    return (a.contains ? a.contains(b) : true);
};
function $$alert(el, msg){
    $alert(el, $s2t(msg));
    return false;
};
function _s2t(obt){
    if ($$.status.charset != 'big5') 
        return obt;
    for (var k in obt) {
        if (obt.hasOwnProperty(k)) 
            obt[k] = $s2t(obt[k]);
    }
    return obt;
}

function __extend(b, p){
    var F = function(){};
    F.prototype = p.prototype;
    b.prototype = new F();
    b.prototype.constructor = b;
}

function checkNotice(el){
    try {
        el.module.notice.check && el.module.notice.check();
    } 
    catch (e) {
    };
}

function checkAddress(el){
    try {
        if ($$.module.address.source.nationality == "@@") 
            throw ("no-source");
        el.module.address.check && el.module.address.check();
        return true;
    } 
    catch (e) {
        return false
    };
    }

function parseChineseId(s){
    var x, b;
    if (s.length == 15) {
        x = parseInt(s.charAt(14), 10) % 2 ? 'M' : 'F';
        b = s.replace(/^\d{6}(\d{2})(\d{2})(\d{2}).+$/, "19$1-$2-$3");
    }
    else {
        x = parseInt(s.charAt(16), 10) % 2 ? 'M' : 'F';
        b = s.replace(/^\d{6}(\d{4})(\d{2})(\d{2}).+$/, "$1-$2-$3");
    }
    return {
        passengerSex: x,
        passengerBirth: b,
        passengerNationality: $s2t("中国大陆")
    };
};
function dateParse(str){
    var hash = dateParse.hash || (dateParse.hash = {});
    if (str in hash) 
        return hash[str];
    var ret = null;
    var m = str.match(/^(\d{4})-([01]?\d)-([0123]?\d)$/);
    if (m) {
        var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
        if ([d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-') == str.replace(/-0/g, '-')) 
            ret = d;
    }
    return hash[str] = ret;
}

function saveCustomer(){
    var v = CustomerList.getAll();
    $pageValue.set("customers", v);
}

function saveBoarder(){
    BoardingList.saveAll();
}

function saveContactor(){
    contactInfo.saveContactor();
}

function getValue(el){
    if (!el) 
        return "";
    if (el.tagName == "INPUT") {
        if ($(el).isNull && el.isNull()) 
            return "";
        if (el.type == "checkbox" || el.type == "radiobox") 
            return el.checked.toString();
        else 
            return el.value;
    }
    else 
        if (el.tagName == "SELECT") 
            return el.value;
        else {
            return el.innerHTML;
        }
}

function totalValidation(){//insert validate
    var accept = $(Options.accepter.id);
    if (accept && !accept.checked) 
        return $$alert(accept, "请您仔细阅读预订须知和重要条款，并在“我接受”一栏打勾，才能接受您的预订请求！");
    if (!BoardingList.checkBoarders()) 
        return false;
    if (!contactInfo.checkContactor()) 
        return false;
    return true;
}

function hasChsChar(str){
    return /[\u0100-\uffff]/.test(str);
}

function checkChsName(str, el){//@str String, @element DOM
    if (!/^[\u4e00-\u9fa5a-zA-Z-]+$/.test(str)) 
        return $$alert(el, "中文姓名只能包含汉字、字母和连字符，请检查");
    return true;
}

function checkEngName(str, el){//@str String, @element DOM
    if (!/^[^\/]+\/[^\/]+$/.test(str)) 
        return $$alert(el, "请填写正确的英文姓名，姓名格式为姓/名，姓与名之间用/分隔，如Green/Jim King");
    
    if (/[^a-zA-Z. \/'-]/.test(str)) 
        return $$alert(el, "英文姓名中包含非法字符，请检查");
    
    var name = str.split('/');
    if (/[^a-zA-Z]/.test(name[0])) 
        return $$alert(el, "英文的姓中只能包含字母");
    if (!/^[a-zA-Z]/.test(name[1])) 
        return $$alert(el, "英文的名必须以字母开头");
    return true;
}

function checkName(el){//@element DOM  如果含有中文字符按中文规则校验，如果没有中文字符按英文规则校验
    var v = el.value.trim();
    if (hasChsChar(v)) 
        return checkChsName(v, el);
    else 
        return checkEngName(v, el);
}

//contactor info
var contactInfo = (function(options){
    var box, //dom container
 hash = [], //virtual container
 contactList; //data
    function checkPhone(){
        for (var i = 1; i <= 3; i++) {
            if (box["phone" + i].isNull()) 
                continue;
            if (box["phone" + i].value.trim().match(/[^\d]/)) 
                return $$alert(box["phone" + i], "请填写正确的电话号码，电话号码仅包含数字");
            if (i == 2 && box.phone2.value.trim().length < 7) 
                return $$alert(box["phone" + i], "请填写正确的电话号码，电话号码长度7位以上");
        }
        for (var i = 1; i <= 3; i++) {
            if (box["fax" + i].isNull()) 
                continue;
            if (box["fax" + i].value.trim().match(/[^\d]/)) 
                return $$alert(box["fax" + i], "请填写正确的传真号码，传真号码仅包含数字");
            if (i == 2 && box.fax2.value.trim().length < 7) 
                return $$alert(box["fax" + i], "请填写正确的传真号码，传真号码长度7位以上");
        }
        return true;
    }
    function checkMobile(el){
        var num = el.value.trim().replace(/^0/, '');
        if ($$.status.version == "zh-cn") {
            if (!num.match(/^0?1[358]\d{9}$/)) 
                return $$alert(el, "您填写的手机号码有误，请重新填写。");
            else 
                el.value = el.value.trim().replace(/^0/, "");
        }
        else {
            if (!num.match(/^[0-9-]{7,}$/)) 
                return $$alert(el, "请填写正确的手机号码,手机号码仅包含数字或\"-\"且长度7位以上");
        }
        return true;
    }
    function attachEvent(){
        box.contactor.$r("focus", function(){
            initBoarderTips();
            box.hiddenTips.style.display = "";
            box.hiddenTips.$setIframe();
        });
        box.contactor.$r("blur", function(){
            box.hiddenTips.$clearIframe();
            box.hiddenTips.style.display = "none";
        });
        $(box.hiddenTips.parentNode).$r("mousedown", function(e){
            var tar = $fixE(e).$target;
            if (contains(box.hiddenTips, tar)) {
                if (tar.tagName == "A" || tar.parentNode.tagName == "A") {
                    var uid = tar.getAttribute("uid") || tar.parentNode.getAttribute("uid") || "";
                    if (uid && uid <= 0) {
                        contactInfo.fillValue(hash[-uid]);
                        box.hiddenTips.style.display = "none";
                        box.hiddenTips.$clearIframe();
                        box.contactor.blur();
                    }
                    else {
                        var element = tar.tagName == "A" ? tar : tar.parentNode;
                        contactInfo.clearValue();
                        box.contactor.value = element.getAttribute("name");
                        box.mobile.value = element.getAttribute("phone");
                        box.hiddenTips.style.display = "none";
                        box.hiddenTips.$clearIframe();
                        box.contactor.blur();
                    }
                }
                $stopEvent(e, 1);
                if (box.hiddenTips.outerHTML) {
                    box.hiddenTips.outerHTML += "";
                    box.hiddenTips = $(box.$("table")[0].rows[0].cells[1]).$("div")[0];
                }
                else 
                    box.hiddenTips.innerHTML += "";
            }
        });
    };
    function initBoarderTips(){
        var BoarderDiv = box.hiddenTips.getElementsByTagName('div')[1], html = [], names = BoardingList.getNameList();
        for (var i = 0, l = names.length; i < l; i++) {
            if (!names[i][0]) 
                continue;
            html.push('<a uid="{$uid}" name="{$name}" phone="{$phone}" href="javascrpt:void(0);">{$name}<span>{$phone}</span></a>'.replaceWith({
                uid: names[i][0],
                name: names[i][1],
                phone: names[i][2]
            }));
        }
        BoarderDiv.innerHTML = html.join("");
    };
    
    return {
        initialize: function(){
            box = $(options.boxId);
            contactList = g_config.contactorInfo;
            var inputs = box.$("input");
            var elements = {
                contactor: inputs[0],
                mobile: inputs[1],
                phone1: inputs[2],
                phone2: inputs[3],
                phone3: inputs[4],
                fax1: inputs[5],
                fax2: inputs[6],
                fax3: inputs[7],
                email: inputs[8],
                hiddenTips: $(box.$("table")[0].rows[0].cells[1]).$("div")[0]
            }
            for (var i = 0; i < contactList.length; i++) {
                hash.push(contactInfo.transforInfo(contactList[i]));
            }
            $extend(box, elements);
            contactInfo.initContactor();
            attachEvent();
            var saves = $pageValue.get("contactor");
            if (saves) {
                var o = contactInfo.transforSavedInfo(saves);
                contactInfo.fillSaveValue(o);
            }
        },
        fillSaveValue: function(obj){
            if (!obj) 
                return;
            var inputs = box.$('input');
            for (var k in obj) {
                box[k].value = obj[k];
            }
            for (var i = 0; i < inputs.length; i++) {
                checkNotice(inputs[i]);
            }
        },
        fillValue: function(obj){
            if (!obj) 
                return;
            var phone = obj.phone.split("-"), fax = obj.fax.split("-"), inputs = box.$('input');
            box.contactor.value = obj.contactor;
            box.mobile.value = obj.mobile;
            box.phone1.value = phone[0] || '';
            box.phone2.value = phone[1] || '';
            box.phone3.value = phone[2] || '';
            box.fax1.value = fax[0] || '';
            box.fax2.value = fax[1] || '';
            box.fax3.value = fax[2] || '';
            box.email.value = obj.email;
            for (var i = 0; i < inputs.length; i++) {
                checkNotice(inputs[i]);
            }
        },
        clearValue: function(){
            var inputs = box.$("input");
            for (var i = inputs.length; i--;) {
                inputs[i].value = "";
                checkNotice(inputs[i]);
            }
        },
        initContactor: function(){
            var contactDiv = box.hiddenTips.getElementsByTagName('div')[0];
            var html = [];
            for (var i = 0; i < contactList.length; i++) {
                html.push('<a uid="-{$i}" href="javascript:void(0)">{$name}<span>{$mobile}</span></a>'.replaceWith({
                    i: i,
                    name: hash[i].contactor,
                    mobile: hash[i].mobile
                }));
            }
            contactDiv.innerHTML = html.join("");
        },
        transforInfo: function(data){
            var arr = data.split("|");
            var obj = {};
            for (var i = 0; i < contactorInfo_list.length; i++) {
                obj[contactorInfo_list[i]] = arr[i];
            }
            return obj;
        },
        transforSavedInfo: function(data){
            var arr = data.split("|");
            var obj = {};
            for (var i = 0, l = savedContactorTemplate.length; i < l; i++) {
                obj[savedContactorTemplate[i]] = arr[i];
            }
            return obj;
        },
        saveContactor: function(){
            var arr = [];
            for (var i = 0, len = savedContactorTemplate.length; i < len; i++) {
                arr.push(getValue(box[savedContactorTemplate[i]]));
            }
            $pageValue.set("contactor", arr.join("|"));
        },
        checkContactor: function(){
            //validate name
            if (box.contactor.isNull()) 
                return $$alert(box.contactor, "请填写联系人姓名");
            else 
                if (!checkName(box.contactor)) 
                    return false;
            //mobile & phone
            if (!box.mobile.isNull() && !checkMobile(box.mobile)) 
                return false;
            if (box.mobile.isNull() && box.phone2.isNull()) {
                return $$alert(box.mobile, "手机号码或联系电话至少选填一项");
            }
            if (!checkPhone()) 
                return false;
            //email
            if (box.email.isNull()) 
                return $$alert(box.email, "请填写您的E-mail地址");
            if (!box.email.value.isEmail()) 
                return $$alert(box.email, "请填写正确的E-mail地址，格式：a@b.c");
            return true;
        }
    }
   })(Options.contactInfo);

(function(){
    window.$r("domready", function(){
        window.cardType = g_config.IDTypeList;
        CustomerList.initialize();
        BoardingList.initialize();
        contactInfo.initialize();
        document.forms[0].onsubmit = function(){
            BoardingList.formalName();
            return totalValidation();
        }
    });
    window.$r("beforeunload", function(){
        saveCustomer();
        saveBoarder();
        saveContactor();
    });
})();

String.birth = function(){
    if (String._birth) 
        return String._birth;
    else {
        var t = g_config.departDate ? new Date(g_config.departDate) : new Date();
        var y = t.getFullYear();
        var m = t.getMonth();
        var d = t.getDate();
        return String._birth = {
            ref: t,
            baby: new Date(y - 2, m, d),
            child: new Date(y - 12, m, d),
            sixteen: new Date(y - 16, m, d),
            eldor: new Date(y - 70, m, d)
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