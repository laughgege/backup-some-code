(function(){
    var __cache=null;
    if(window.ActiveXObject && !window.XMLHttpRequest){
      window.XMLHttpRequest = function(){
        if(__cache)return new ActiveXObject(__cache);
        var msxmls = [
          'Msxml2.XMLHTTP.5.0',
          'Msxml2.XMLHTTP.4.0',
          'Msxml2.XMLHTTP.3.0',
          'Msxml2.XMLHTTP',
          'Microsoft.XMLHTTP'
        ];
        for(var i = msxmls.length; i--; ){
          try{
            return new ActiveXObject((__cache = msxmls[i]));
          }catch(e){}
        }
        return null;
      };
    }
    yan = window.yan || {};
    yan.ajaxstatus = 0;
    yan.ajax = function(options){
      if(yan.ajaxstatus == 1 && options.callback)return !!alert('��ȴ���һ�����̴������!');
      if(!options.url)return !!alert('�����URL��ַ����Ϊ��!');
      var xmlhttp = new XMLHttpRequest();
      if(xmlhttp == null)return !!alert('�Բ���,�����������֧��ajax!');
      options.method = (options.method || 'GET').toLowerCase();
      if(typeof options.async == 'undefined')options.async = true;
      xmlhttp.open(options.method, options.url, options.async);
      if(options.method == 'POST')xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.setRequestHeader('If-Modified-Since', '0');//��ֹ����
      if(options.callback){//�첽���󲻴��ص��Ĳ�������������
        yan.ajaxstatus = 1;
        xmlhttp.onreadystatechange = function(){
          if(xmlhttp.readyState != 4)return;
          yan.ajaxstatus = 0;
          options.callback(xmlhttp.responseText, xmlhttp.responseXML);
        };
      }
      xmlhttp.send((options.data||null));
      if(!options.async){//���첽�����,��������ɺ󷵻� xmlhttp ������
        yan.ajaxstatus = 0;
        return xmlhttp;
      }
    };
  })();