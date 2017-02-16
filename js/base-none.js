$(function() {

	//返回按钮
	$("#back").bind('click',function(){
		window.history.go(-1);
	})
	//将select设置为不能选择
	// $("#gender").prop("disabled", true);
	
	// 更换手机号dialog
	$("#change-mobile").click(function() {
		$("#modify-mobile").dialog("open");
		// 获取验证码
		getCaptchaCode();
	});

	$("#modify-mobile").dialog({
		autoOpen : false,
		closeOnEscape : true,
		bgiframe : true,
		height : 415,
		width : 380,
		resizable : false,
		modal : true
	})
	// 重置密码dialog
	$("#change-pwd").click(function() {
		$("#modify-pwd").dialog("open");
	});

	$("#modify-pwd").dialog({
		autoOpen : false,
		closeOnEscape : true,
		bgiframe : true,
		height : 300,
		width : 380,
		resizable : false,
		modal : true,
	})
	//性别下拉框
	getSelectDataTypeList({"gender":"gender"})
	// TODO 获取并填充个人信息
	getUserInfo();
	function getUserInfo() {
		var payload = {
				data : {_mt:"usrmgmt.getloginuser",purpose:0},
				level : "UserLogin"
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
				
				if(com_error(result)){
					//判断修改是否成功
					console.log(data);
					userInfo = result.content["0"];
					$("#thisname").html(userInfo.name);
					setData(userInfo,"ui-register");
					$("#mobileno").val(userInfo.mobileNo);
					//手动触发事件
					//	$("#idNo").focusout();
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	}
	
	//退出
	$("#headrightthree").bind("click",function(){
		if(confirm("你确定退出吗？")){
			logout();
		}
	})
	
	function logout(){
		var payload = {
				data : {_mt:"usrmgmt.logout"},
				level : "UserLogin"
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
				if(com_error(result)){
					setCookie("wtk", "");
					window.location.href = "../index.html";
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
		
		
	}

	
	
	
	
	// 刷新获取图形验证码
	$("#validImg").bind("click", function() {
		getCaptchaCode();
	});

	// 默认初始化图形验证码

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

/*	function getCaptchaCode() {
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
				if(com_error(result)){
					captchaCodeValue = result.content["0"].value;
					captid = result.content["0"].deliveryId;
					imgUrl = result.content["0"].imgUrl;
					$("#validImg").attr({
						src : imgUrl,
						cursor : 'hand',
						title : "点击刷新"
					});
					$("#validImg").css({
						cursor : 'pointer'
					});
					$("#captid").val(captid);
					$("#captchaCodeValue").val(captchaCodeValue);
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}

				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	};*/

	// 验证身份证号码是否正确，并获得相应的性别和出生日期

	$("#idNo").bind("focusout",function() {
		
		obj = $(this).attr("id");
		//验证格式是否正确
		if(!validateIdcard($(this).val())){
			//提示格式不正确
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>身份证格式不正确<p>");
			$("#birthDate").val("");
			$("#gender").val("");
			return;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
		}
		
		idCard = $(this).val();
		if (validateIdcard(idCard)) {
			// 身份证格式正确，获取性别和出生日期
			gender = GetBirthdayOrGenderByIdNo(idCard, true);
			if (gender == 1) {
				$("#gender").val("01male");
			} else {
				$("#gender").val("02female");
			}
			birth_date = GetBirthdayOrGenderByIdNo(idCard, false);
			$("#birthDate").val(birth_date);

		} else {
			// TODO 提示身份证格式不正确
		}
	});
	
	$("#email").bind("focusout",function() {
		
		obj = $(this).attr("id");
		//验证格式是否正确
		if(!validateEmail($(this).val())){
			//提示格式不正确
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>邮箱格式不正确<p>");
			return;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
		}
		
	});

	// 提交修改的信息
	$("#submit").bind("click", function() {

		var payload = {
			data : serach("usrmgmt.updateuser", "user-data"),
			level : "UserLogin"
		};
		data = encryptNew(payload.level, payload.data);
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
				if(com_error(result)){
					comAlert("修改成功");
					//刷新
					getUserInfo();
					
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});

	})

	// 获取手机验证码
	$("#mobile-ver-code").bind("click", function() {
		
		if(!captchaCode($("#captchaCode"))){
			return;
		}
		
		serach("usrmgmt.getvericode")
		params = {
			_mt : "usrmgmt.getvericode",
			channelId : $("#loginCode").val()
		};
		var payload = {
			data : params,
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
				if(com_error(result)){
					value = result.content["0"].value;
					deliveryId = result.content["0"].deliveryId;
					$("#verifyid").val(deliveryId);
					$("#verifyCode").val(value);
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
			
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	});
	
	
	
	//修改手机号
	$("#mobilebtn").bind("click",function(){
		
		if(!mobileNo($("#newMobileNo"))
				|| !captchaCode($("#captchaCode")) 
				|| !verifyCode($("#verifyCode")) 
				|| !newpwd1($("#password"))){
			return;
		}
	/*	var payload = {
			data : {"_mt":"usrmgmt.getloginuser","purpose":2},
			level : "UserLogin"
		};*/
		var payload = {
			data : serach("usrmgmt.changemobile", "modify-mobile"),
			level : "UserLogin"
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
				if(com_error(result)){
					if(confirm("手机号修改成功")){
						$("#modify-mobile").dialog("close");
						getUserInfo();
					}
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});

		
	})
	
	//重置密码
	$("#pwdbtn").bind("click",function(){
		var payload = {
				data : serach("usrmgmt.changepass", "modify-pwd"),
				level : "UserLogin"
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
				//判断修改是否成功
				console.log(data);
				if(com_error(result)){
					if(confirm("密码修改成功,请重新登录")){
						$("#modify-pwd").dialog("close");
						logout();
					}
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
				
			},
			error : function() {
				comAlert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	})
	/*-----修改手机号的验证-----*/
	$("#newMobileNo").bind("focusout",function() {
		mobileNo($(this));
	})
	
	$("#password").bind("focusout",function() {
		newpwd1($(this));
	})
	//判断图形验证码是否为空
	$("#captchaCode").focusout(function(){
		captchaCode($(this))
	});

	//判断手机验证码是否为空
	$("#verifyCode").focusout(function(){
		verifyCode($(this));
	});
/*-------以上------*/
})




/*--验证--*/

	function mobileNo(data){
		obj = data.attr("id");
		if($.trim(data.val()) == ""){
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>手机号码不能为空<p>");
			return false;
		}
		//验证手机号格式是否正确
		if(!validateMobile(data.val())){
			//提示手机号码格式不正确
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>手机号码格式不正确<p>");
			return false;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
			return true
		}
	}



function verifyCode(data){
	
	obj = data.attr("id");
	if($.trim(data.val()) == ""){
		$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>手机验证码不能为空<p>");
		return false;
	}else{
		$(".tips-p-"+obj).remove();
		return true;
	}
}



function captchaCode(data){
	
	obj = data.attr("id");
	if($.trim(data.val()) == ""){
		$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>验证码不能为空<p>");
		return false;
	}else{
		$(".tips-p-"+obj).remove();
		return true;
	}
}




function newpwd2(data){
	obj = data.attr("id");
	//验证密码格式是否正确
	if(!validatePwd(data.val())){
		//提示密码格式不正确
		$(".newpwd2").html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>两次密码不一致<p>");
		return false;
	}else{
		//移除文本，去除class
		$(".tips-p-"+obj).remove();
		return true;
	}
}



function newpwd1(data){
	obj = data.attr("id");
	if($.trim(data.val()) == ""){
		$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>密码不能为空<p>");
		return false;
	}
	//验证密码格式是否正确
	 if(!validatePwd(data.val())){
		//提示密码格式不正确
		$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>密码格式不正确<p>");
		return false;
	}else{
		//移除文本，去除class
		$(".tips-p-"+obj).remove();
		return true;
	}
}







	
