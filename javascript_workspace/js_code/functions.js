(function(){
	
	YH = function(elem){
		return __func.call(elem);
	};
	
	YH.chk = function(obj){
		return !!(obj || obj === 0);
	};
	
	YH.random = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	
	YH.extend = function(obt){
		for(var s in obt || {}) {
			if(obt.hasOwnProperty(s)) 
				YH[s] = obt[s];
		};
		return YH;
	};
	
	YH.contains = document.compareDocumentPosition ? function(a, b){
			return a === b || !!(a.compareDocumentPosition(b) & 16);
		}: function(a, b){
			return  a.contains ? a.contains(b) : true;
	};
	
	var expando = "YH" + new Date*1, uuid = 0, windowData = {};
	
	YH.extend({
		cache: {},

		data: function( elem, name, data ) {
			elem = elem == window ?
				windowData :
				elem;

			var id = elem[ expando ];

			if ( !id )
				id = elem[ expando ] = ++uuid;

			if ( name && !YH.cache[ id ] )
				YH.cache[ id ] = {};

			if ( data !== undefined )
				YH.cache[ id ][ name ] = data;

			return name ?
				YH.cache[ id ][ name ] :
				id;
		},

		removeData: function( elem, name ) {
			elem = elem == window ?
				windowData :
				elem;

			var id = elem[ expando ];

			if ( name ) {
				if ( YH.cache[ id ] ) {
				
					delete YH.cache[ id ][ name ];

					name = "";

					for ( name in YH.cache[ id ] )
						break;

					if ( !name )
						YH.removeData( elem );
				}

			} else {
				try {
					delete elem[ expando ];
				} catch(e){
					if ( elem.removeAttribute )
						elem.removeAttribute( expando );
				}

				delete YH.cache[ id ];
			}
		}
	});
	
	function __func(){
		this.contains = function(ed){
			return YH.contains(this, ed);
		};
		this.data = function(name, data){
			return YH.data(this, name, data);
		};
		this.removeDate = function(name){
			return YH.removeData(this, name);
		};
	};

	function __extend(subClass, superClass) {
		var F = function() {};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.constructor = subClass;

		subClass.$super = superClass.prototype;
		if(superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass;
		}
	};
	Function.prototype.extend = function(father){
		__extend(this, father);
		return this;
	};
	
})();