/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

// Sample desktop configuration
MyDesktop = new Ext.app.App({
	init :function(){
		Ext.QuickTips.init();
	},

	getModules : function(){
		return [
			new MyDesktop.GridWindow()
		];
	},

    // config for the start menu
    getStartConfig : function(){
        return {
            title: '',
            iconCls: ''
        };
    }
});



/*
 * Example windows
 */
MyDesktop.GridWindow = Ext.extend(Ext.app.Module, {
    id:'grid-win',
    init : function(){
        this.launcher = {
            text: 'Oregon',
            iconCls:'icon-grid',
            handler : this.createWindow,
            scope: this
        }
    },

    createWindow : function(){
        window.open("http://192.168.83.56:1000/oregonnew/list/");
    }
});

