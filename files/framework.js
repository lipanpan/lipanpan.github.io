/***************************************js封装继承思想******************************************************/
(function($) {
    /***********************************客户端浏览器本地存储封装工具类**************************************/
	
	/** 参数验证判断 */
	$.paramUtil = {
		// 判断对象是否为null或undefined
		isNull : function(value) {
			if (undefined == value || null == value) {
				return true;
			}
			return false;
		},

		// 判断字符串是否为null,undefined,""," "
		isEmpty : function(value) {
			if ($.paramUtil.isNull(value) || $.trim(value) == "") {
				return true;
			}
			return false;
		},

		// 判断邮箱格式是否合法
		isEmail : function(value) {
			if ($.paramUtil.isEmpty(value)) {
				return false;
			}
			var reg = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
			return reg.test(text);
		},

		// 判断手机号是否合法
		isPhone : function(value) {
			if ($.paramUtil.isEmpty(value)) {
				return false;
			}
			// 共11位
			var reg = /^1[34578]\d{9}$/;
			return reg.test(text);
		},

		// 判断是否包含中文
		isChinese : function(value) {
			if ($.paramUtil.isEmpty(value)) {
				return false;
			}
			var reg = /[^\u0000-\u00FF]/;
			return reg.test(text);
		}
	}

	/** 本地数据存储工具类 */
	$.localStorage = {
		// 获取本地存储
		getItem : function(key) {
			return window.localStorage.getItem(key);
		},

		// 设置本地存储键值对
		setItem : function(key, value) {
			window.localStorage.setItem(key, value);
		},

		// 获取json对象
		getJsonObj : function(key) {
			var valueJson = $.localStorage.getItem(key);
			if ($.paramUtil.isNull(valueJson) || $.trim(valueJson) == "") {
				return null;
			}
			return $.parseJSON(valueJson);
		},

		// 存储json对象
		setJsonObj : function(key, value) {
			if ($.paramUtil.isNull(key) || $.paramUtil.isNull(value)) {
				return;
			}
			var valueJson = JSON.stringify(value);
			$.localStorage.setItem(key, valueJson);
		},

		// 获取json对象中的值
		getJsonObjItem : function(key1, key2) {
			var jsonObj = $.localStorage.getJsonObj(key1);
			if ($.paramUtil.isNull(jsonObj)) {
				return null;
			}
			return jsonObj[key2];
		},

		// 存储json对象中的值
		setJsonObjItem : function(key1, key2, value) {
			if ($.paramUtil.isNull(key1) || $.paramUtil.isNull(key2)
					|| $.paramUtil.isNull(value)) {
				return;
			}
			var jsonObj = $.localStorage.getJsonObj(key1);
			if ($.paramUtil.isNull(jsonObj)) {
				jsonObj = {};
			}
			jsonObj[key2] = value;
			$.localStorage.setJsonObj(key1, jsonObj);
		}

	}

})(jQuery);

/************************************ 扩展js中的String类成员方法：********************************************/
//占位符替换 hello,{0}
String.prototype.format = function() {
	if (!arguments) {
		return this;
	}
	if (arguments.length == 1) { // 只有1个数据
		return this.replace(new RegExp("\\{0\\}", "g"), arguments[0]);
	}
	var tmp = this;
	for (var i = 0; i < arguments.length; i++) {
		tmp = tmp.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	}
	return tmp;
};

//清除字符串两侧的空格
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

// 值输出xss转义处理
String.prototype.escape = function() {
	var tmp = this;
	tmp = tmp.replace(new RegExp("&", "g"), "&amp;");
	tmp = tmp.replace(new RegExp("<", "g"),="" "&lt;");="" tmp="tmp.replace(new" regexp("="">", "g"), "&gt;");
	tmp = tmp.replace(new RegExp("\\\"", "g"), "&quot;");
	tmp = tmp.replace(new RegExp("'", "g"), "&apos;");
	return tmp;
};

/***********************************Date功能扩展器(yyyy-MM-dd HH:mm:ss yyyy/MM/dd HH:mm:ss yyyy-MM-dd等)*********************************************/
// 日期格式化
Date.prototype.format = function (fmt) {  
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/***********************************对象克隆*****************************************************************/
Object.prototype.clone = function() {
	var o;
	switch(typeof this){
		case "undefined":
		  break;
		case "string":
		  o = this.toString();
		  break;
		case "number":
		  o = this - 0;
		  break;
		case "boolean":
		  o = this;
		  break;
		case "object"
		  //分为两种情况：对象Object或数组Array
		  if(Object.prototype.toString.call(this).slice(8,-1) === "Array"){
			  o = [];
			  for(var i=0;i</",>