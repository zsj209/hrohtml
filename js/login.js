$(function() {
	// 刷新获取图形验证码
	$("#validImg").bind("click", function() {
		getCaptchaCode();
	});
	$("#loginCode").val(getCookie("tgnewlguser"));
	// 默认初始化图形验证码
	getCaptchaCode();
	
})

function getCaptchaCode() {
    var params = {
        "_mt": "verifycode.requestCaptcha",
        clientId: pubsources.clientId,
        clientPass: pubsources.clientPass,
        clientIp: "127.0.0.1"
    };

    var requestData = {
        data: params,
        level: "None"
    };

    data = encrypt(requestData.level, requestData.data);

    console.log(data);
    $.ajax({
        type: "POST",
        url: pubsources.pub_getCaptcha,
        crossDomain: true,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: serialize(data),
        success: function (result) {
            // 给修改页面的input框赋值
            if (com_error(result)) {
                // captchaCodeValue = result.content["0"].value;
                captid = result.content["0"].key;
                imgUrl = result.content["0"].imgUrl;
                $("#validImg").prop({
                    src: imgUrl,
                    cursor: 'hand',
                    title: "点击刷新"
                });
                $("#validImg").css({
                    cursor: 'pointer'
                });
                $("#captid").val(captid);
                // $("#captchaCodeValue").val(captchaCodeValue);

            } else {
                alertMsg(result, "usermgmt_code_desc");
            }
        },
        error: function () {
            alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。" + "png");
        }
    });
};

/*function getCaptchaCode() {
	var payload = {
		data : serach("usrmgmt.getcaptcha"),
		level : "None"
	};
	data = encrypt(payload.level, payload.data);
	console.log(data);
	$.ajax({
		type : "POST",
		url : pubsources.pub_getlink,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			// 给修改页面的input框赋值
			if (com_error(result)) {
				captchaCodeValue = result.content["0"].value;
				captid = result.content["0"].deliveryId;
				imgUrl = result.content["0"].imgUrl;
				$("#validImg").prop({
					src : imgUrl,
					cursor : 'hand',
					title : "点击刷新"
				});
				$("#validImg").css({
					cursor : 'pointer'
				});
				$("#captid").val(captid);
				$("#captchaCodeValue").val(captchaCodeValue);

			} else {
				alertMsg(result, "usermgmt_code_desc");
			}
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。" + "png");
		}
	});
};*/

// 登录点击事件
function loginIn() {
	if(!keyLogin()){
		return;
	}
	var loginCode = $("#loginCode").val();
	var captid = $("#captid").val();
	var captchaCode = $("#captchaCode").val();
	//alert(captid+"-----"+captchaCode);
	var pwd = md5($('#password').val());
	var params = {
		loginCode : loginCode,
		captid : captid,
		captchaCode : captchaCode,
		password : pwd,
		_mt : "usrmgmt.login",
		applicationId : "0"
	};

	var payload = {
		data : params,
		level : "None"
	};
	var data = encrypt(payload.level, payload.data);
	console.log(data._sig + "--data");
	$.ajax({
		type : "POST",
		url : pubsources.pub_getlink,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			if (com_error(result)) {
				if (result.content["0"].webToken) {
					setCookie("wtk", result.content["0"].webToken);
					setCookie("tgnewlguser", loginCode);
					//window.location.href = "html/base-none.html";
					//window.location.href = "html/base.html";
					checkuserandgotomainpage();
				}
			} else {
				// TODO 获得错误码的含义并显示
				// 获得错误码
				var code = result.stat.stateList["0"].code;
				// alert(usermgmt_code_desc[code]);
				// error = result.stat.stateList["0"].msg;
				$("#error").html(usermgmt_code_desc[code]);
				// 刷新验证码,清空验证码输入框
				getCaptchaCode();
				$("#captchaCode").val("");

			}
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}

document.onkeydown = function mykeyDown(e) {
	// compatible IE and firefox because there is not event in firefox
	e = e || event;
	if (e.keyCode == 13) {
		if(keyLogin()){
			loginIn();
		}
	}
	return;
}

// 回车登录
function keyLogin() {
	if ($.trim($("#loginCode").val()) == "") {
		$("#loginCode").focus();
		return false;
	}
	if ($.trim($("#password").val()) == "") {
		$("#password").focus();
		return false;
	}
	if ($.trim($("#captchaCode").val()) == "") {
		$("#captchaCode").focus();
		return false;
	}
	return true;
}
// 跳转至注册页面
function register() {
	window.location.href = "register.html";
}
// 跳转至找回密码页面
function forgotPwd() {
	window.location.href = "retrievepwd.html";
}

//检查用户权限并跳转页面
function checkuserandgotomainpage() {
	var params = {
		_mt : "usrmgmt.getuserperm",
		roletype : ""
	};
	var payload = {
		data : params,
		level : "UserLogin"
	};
	var data = encrypt(payload.level, payload.data);
	console.log(data._sig + "--data");
	$.ajax({
		type : "POST",
		url : pubsources.pub_getlink,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			if (com_error(result)) {
				if (jQuery.isEmptyObject(result.content["0"])) {
					//alert("null object");
					//window.location.href = "html/base-none.html";
				} else {
					//alert(result.content["0"]);
					window.location.href = "html/base.html";
				}
			} else {
				// TODO 获得错误码的含义并显示
				// 获得错误码
				var code = result.stat.stateList["0"].code;
				//alert(code);
				if (code == 1044) {
					window.location.href = "html/base-none.html";
					//window.location.href = "html/base.html";
				} else{
					// alert(usermgmt_code_desc[code]);
					// error = result.stat.stateList["0"].msg;
					$("#error").html(usermgmt_code_desc[code]);
					// 刷新验证码,清空验证码输入框
					getCaptchaCode();
					$("#captchaCode").val("");
				}
			}
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}
