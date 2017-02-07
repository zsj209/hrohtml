/*---------------------------------------------------------
Coding:         darren
Create Date:    2017-01-12
Desc:           公共的js函数
update History:
  date:  
  coding:
  desc:  
---------------------------------------------------------*/

//js去除前后空格
function jsTrim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

// js format, 可以将中间的%s替换为提供的参数
String.format = function() {
	if (arguments.length == 0)
		return null;

	var str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		var re = new RegExp('%s', 'i');
		str = str.replace(re, arguments[i]);
	}
	return str;
}

// 替换单引号，双引号，用于页面显示
function pub_fmt_str(s) {
	var rs = s.replace(/'/g, "&#39;");
	rs = rs.replace(/"/g, "&#34;");
	return rs;
}

// 获取jqgrid Row ID
function getRowids(gridid) {
	var rows = $("#" + gridid).getGridParam('selarrrow'), rl = "";
	$.each(rows, function(i, n) {
		rl += $("#" + gridid).getCell(n, 2) + ",";
	});
	if (rows.length >= 1) {
		rl = rl.substring(0, rl.length - 1);
	}
	return rl;
}

// 日期格式化，将系统日期格式为yyyy-mm-dd
function dateFormat(p_date) {
	var y = p_date.getFullYear(), m = p_date.getMonth() + 1, d = p_date
			.getDate();
	if (m <= 9)
		m = "0" + m;
	if (d <= 9)
		d = "0" + d;
	return y + "-" + m + "-" + d;
}

// 日期格式化为中文日期，例： 2012年12月21日
function dateFormatCn(p_date) {
	var tdate = p_date + " 00:00:00";
	tdate = new Date(tdate.replace(/-/g, "/"));
	var y = tdate.getFullYear(), m = tdate.getMonth() + 1, d = tdate.getDate();
	if (m <= 9)
		m = "0" + m;
	if (d <= 9)
		d = "0" + d;
	return y + "年" + m + "月" + d + "日";
}

// 日期格式化为英文日期
// style :0 日期月为全称 1:日期月为简称
function dateFormatEn(p_date, style) {
	var tdate = p_date + " 00:00:00";
	tdate = new Date(tdate.replace(/-/g, "/"));
	var y = tdate.getFullYear(), m = tdate.getMonth(), d = tdate.getDate(), tm0 = [
			"January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December" ], tm1 = [
			"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
			"Oct", "Nov", "Dec" ], nm;
	if (style == 0)
		nm = tm0[m];
	else
		nm = tm1[m];

	return nm + " " + d + ", " + y;
}

// 判断瑞年
function isRuinian(year) {
	if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
		return true;
	} else
		return false;
}

// 日期加天，p_date: yyyy-mm-dd
function dateAddDays(p_date, p_days) {
	var tdate = p_date + " 00:00:00";
	tdate = new Date(tdate.replace(/-/g, "/"));
	tdate = new Date(tdate.setDate(tdate.getDate() + parseInt(p_days)));
	return dateFormat(tdate);
}

// 日期加月，p_date: yyyy-mm-dd
function dateAddMonths(p_date, p_mths) {
	var tdate = p_date + " 00:00:00";
	tdate = new Date(tdate.replace(/-/g, "/"));
	tdate = new Date(tdate.setMonth(tdate.getMonth() + parseInt(p_mths)));
	return dateFormat(tdate);
}

// 日期加年，p_date: yyyy-mm-dd
function dateAddYears(p_date, p_years) {
	var tdate = p_date + " 00:00:00";
	tdate = new Date(tdate.replace(/-/g, "/"));
	tdate = new Date(tdate.setFullYear(tdate.getFullYear() + parseInt(p_years)));
	return dateFormat(tdate);
}

// 通过new Date()获取日期中的周
// style: 0 中文 1英文全称 2 英文简称
function getWeek(p_date, style) {
	var dd = p_date.getDay();
	// style 1
	var wk_cn = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
	// style 2
	var wk_en1 = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
			"Friday", "Saturday" ];
	// style 3
	var wk_en2 = [ "Sun.", "Mon.", "Tues.", "Wed.", "Thur.", "Fri.", "Sat." ];

	if (style == 1)
		return wk_cn[dd];
	else if (style == 2)
		return wk_en1[dd];
	else if (style == 3)
		return wk_en2[dd];
	else
		return "";
}

// 获取某月的总天数 y : 年份 yyyy 如：1999,2000,9999,1000 m ： 月份 m 如：01,02,09,10,12 days :
// 也即获取年月的最后一天
function getMonthDays(y, m) {
	var days = 30;
	if (m == "01" || m == "03" || m == "05" || m == "07" || m == "08"
			|| m == "10" || m == "12") {
		days = 31;
	} else if (m == "02") {
		if (isRuinian(parseInt(y))) {
			days = 29;
		} else {
			days = 28;
		}
	}
	return days;
}

// 获取当前客户端当前时间的时间戳，从1970.1.1开始的毫秒数
function getJsTimestamp() {
	return new Date().getTime();
}

// 日期转换
function parseDate(str) {
	if (str.match(/^\d{4}[\-\/\s+]\d{1,2}[\-\/\s+]\d{1,2}$/)) {
		return new Date(str.replace(/[\-\/\s+]/i, '/'));
	} else if (str.match(/^\d{8}$/)) {
		return new Date(str.substring(0, 4) + '/' + str.substring(4, 6) + '/'
				+ str.substring(6));
	} else {
		return ('时间转换发生错误！');
	}
}

// 字符串增加子字符串方法：给字符串后增加子字符串，并且以;隔开，如果子字符串在字符串中存在，则不增加
function addsubstr(str, substr) {
	var rtn = jsTrim(str), reg = new RegExp(substr);
	if (rtn.length > 0) {
		if (!reg.test(rtn)) {
			rtn += ";" + substr;
		}
	} else
		rtn = substr;
	return rtn;
}

// 删除子字符串方法：如果新字符串在原字符串中存在，则删除
function delsubstr(str, substr) {
	var rtn = jsTrim(str), reg = new RegExp(substr), reg1 = new RegExp(substr
			+ ";");
	if (rtn.length > 0) {
		if (reg1.test(rtn)) {
			rtn = rtn.replace(reg1, "");
		} else if (reg.test(rtn)) {
			rtn = rtn.replace(reg, "");
		}
		if (rtn.substr(rtn.length - 1) == ";")
			rtn = rtn.substring(0, rtn.length - 1);
	}
	return rtn;
}

// 四舍五入函数，保留预定的位数number,precision 例如：12.001--(四舍五入后)12.00; 12.495 --(四舍五入后)12.50
function numround1(num, pre) {
	var number = num, precision = pre, temp, character, dot, newNum, digit, i = 0;
	temp = Math.round(number * Math.pow(10, precision));// 给数字乘以10的precision次方,然后再四舍五入。
	character = temp.toString();// 转换成字符串
	dot = character.indexOf(".");// 小数点的位置
	// digit 小数后的位数。
	if (dot != -1)
		digit = number.length - (dot + 1);
	else
		digit = 0;
	// 小数点后的位数小于精确位数
	if (digit < precision) {
		if (dot != -1) {
			newNum = number;
			while (digit < precision) {
				newNum += "0";
				digit++;
			}
		} else {
			newNum = number + ".";
			while (digit < precision) {
				newNum += "0";
				digit++;
			}
		}
	} else if (digit == precision) {// 小数点后的位数等于精确位数
		newNum = number;
	} else {// 小数点后的位数大于精确位数
		newNum = character.substr(0, dot) + "."
				+ character.substr(character.length - 2, 2);
	}
	return newNum;
}

// 四舍五入方法2 例如：12.001--(四舍五入后)12; 12.495 --(四舍五入后)12.5
function numround2(num, pre) {
	var number = num, precision = pre;
	var newNum = Math.round(number * Math.pow(10, precision))
			/ Math.pow(10, precision);
	return newNum;
}