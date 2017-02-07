




/* 由身份证号获取性别和出生日期,flag:true 返回性别(1:男 2：女)，false 返回出生日期 */
function GetBirthdayOrGenderByIdNo(iIdNo, flag) {
	var tmpStr = "";
	var sexStr = "";
	var birthday = $("#js_birthday");
	iIdNo = $.trim(iIdNo);
	if (iIdNo.length == 15) {
		tmpStr = iIdNo.substring(6, 12);
		tmpStr = "19" + tmpStr;
		tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-"
				+ tmpStr.substring(6);
		sexStr = parseInt(iIdNo.substring(14, 1), 10) % 2 ? 1 : 0;
	} else {
		tmpStr = iIdNo.substring(6, 14);
		tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-"
				+ tmpStr.substring(6);
		sexStr = parseInt(iIdNo.substring(17, 1), 10) % 2 ? 1 : 0;
	}
	return flag ? sexStr : tmpStr;
}

/* 验证手机号格式是否正确 */
function validateMobile(Obj) {
	/* 手机号码的验证 */
	var REGEX_MOBILE = /^(0|86|17951)?(13[0-9]|15[012356789]|17[6780]|18[0-9]|14[57])[0-9]{8}$/;
	Obj = $.trim(Obj);
	return REGEX_MOBILE.test(Obj);
}
/* 验证邮箱格式是否正确 */
function validateEmail(Obj) {
	/*邮箱格式的验证*/
	var REGEX_EMAIL = /^[a-z0-9]([a-z0-9]*[-_\.]?[a-z0-9]+)*@([a-z0-9]*[-_\.]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i;
	Obj = $.trim(Obj);
	return REGEX_EMAIL.test(Obj);
}
/* 验证身份证格式是否正确 */
function validateIdcard(Obj) {
	/* 验证身份证号格式 */
	var REGEX_ID_CARD = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
	Obj = $.trim(Obj);
	return REGEX_ID_CARD.test(Obj);
}
/* 验证密码格式是否正确 */
function validatePwd(Obj) {
	/* 密码的验证 */
	var REGEX_PWD = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
	Obj = $.trim(Obj);
	return REGEX_PWD.test(Obj);
}

// 验证是否为空
function val_isnull(str) {
	var rtn = false, reg = /^\s*$/g;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_非负整数
function val_number100(str) {
	var rtn = false, reg = /^((\d)|([1-9]\d+))$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_正整数
function val_number101(str) {
	var rtn = false, reg = /^[1-9]\d*$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_整数
function val_number102(str) {
	var rtn = false, reg = /^((-[1-9]\d*)|(\d)|([1-9]\d+))$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_非负浮点数
function val_number103(str) {
	var rtn = false, reg = /^(((\d)|([1-9]\d+))(\.\d+)?)$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_正浮点数
function val_number104(str) {
	var rtn = false, reg = /^((0\.\d*[1-9]\d*)|(([1-9]\d*)(\.\d+)?))$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_浮点数
function val_number105(str) {
	var rtn = false, reg = /^((-0\.\d*[1-9]\d*)|((-[1-9]\d*)(\.\d+)?)|(((\d)|([1-9]\d+))(\.\d+)?))$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 数字格式_数字
function val_number106(str) {
	var rtn = false, reg = /^\d+$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 日期格式 200，格式yyyy-mm-dd
function val_date(str) {
	var rtn = false;
	if (val_isnull(str))
		return rtn;
	if (str.length != 10)
		return rtn;

	var year = str.substring(0, 4);
	if (year > "9999" || year < "1900")
		return rtn;

	var month = str.substring(5, 7);
	if (month > "12" || month < "01")
		return rtn;

	var day = str.substring(8, 10);
	if (day > getMaxDay(year, month) || day < "01")
		return rtn;
	rtn = true;
	return rtn;
};

// 英文字符 201,忽略大小写，可以包括空格
function val_englishchar(str) {
	var rtn = false, reg = /^[a-z0-9\-_!@#$%^&*()+=?\|\/\s\,\.\;\:\']+$/i;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 邮政编码 202 3-12位字符+数字，可以包括空格
function val_postcode(str) {
	var rtn = false, reg = /^[a-z0-9 ]{3,12}$/i;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 固定电话、传真 203 可以+开头，除数字外，可含有-
function val_phone(str) {
	var rtn = false, reg = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
	if (str.match(reg))
		rtn = true;
	return rtn;
}

// 身份证号 207
function val_iden(ob) {
	var rtn = false, str = $(ob).val(), n_iden, i, check, arrVerifyCode = [ 1,
			0, "X", 9, 8, 7, 6, 5, 4, 3, 2 ], Wi = [ 7, 9, 10, 5, 8, 4, 2, 1,
			6, 3, 7, 9, 10, 5, 8, 4, 2 ], aProv = {
		11 : "北京",
		12 : "天津",
		13 : "河北",
		14 : "山西",
		15 : "内蒙古",
		21 : "辽宁",
		22 : "吉林",
		23 : "黑龙江",
		31 : "上海",
		32 : "江苏",
		33 : "浙江",
		34 : "安徽",
		35 : "福建",
		36 : "江西",
		37 : "山东",
		41 : "河南",
		42 : "湖北",
		43 : "湖南",
		44 : "广东",
		45 : "广西",
		46 : "海南",
		50 : "重庆",
		51 : "四川",
		52 : "贵州",
		53 : "云南",
		54 : "西藏",
		61 : "陕西",
		62 : "甘肃",
		63 : "青海",
		64 : "宁夏",
		65 : "新疆",
		71 : "台湾",
		81 : "香港",
		82 : "澳门",
		91 : "国外"
	};

	if (str.length != 15 && str.length != 18) {
		alert(lan_res.idcdnum_shdbe_fiorei_dig);
		return rtn;
	}
	var Ai = (str.length == 18) ? str.slice(0, 17) : str.slice(0, 6) + "19"
			+ str.slice(6, 15);
	if (!val_number101(Ai)) {
		alert(lan_res.idcdnum_err);
		return rtn;
	}
	// 判断省份
	if (aProv[parseInt(Ai.slice(0, 2))] == null) {
		alert(lan_res.idcdnum_arcod_err);
		return rtn;
	}
	// 判断出生年月日
	var birthday = Ai.slice(6, 10) + "-" + Ai.slice(10, 12) + "-"
			+ Ai.slice(12, 14);
	if (!val_date(birthday)) {
		alert(lan_res.idcdnum_brthd_err);
		return rtn;
	}
	var sex = (Ai.slice(14, 17) % 2) ? "female" : "male";
	// 检查验证码，'X'大小写无关；如果是15位，则转化为18位
	for (i = 0, check = 0; i < 17; i++) {
		check += Ai.charAt(i) * Wi[i];
	}
	sData = arrVerifyCode[check %= 11];
	if (str.length == 18) {
		if (sData != str.slice(17, 18).toUpperCase()) {
			alert(lan_res.idcdnum_lastnum_err_ritis + sData + "！");
			return rtn;
		}
	} else {
		n_iden = Ai + sData;
		$(ob).val(n_iden);
	}

	return true;
}
