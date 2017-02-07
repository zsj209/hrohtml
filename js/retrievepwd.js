$(function(){
	
	
	//文本框绑定改变颜色的事件
	$("input").focus(function() {

	    $(this).css('border-color', '#0089dd');

	  }).focusout(function() {

	    $(this).css('border-color', '#ccc');

	  })
	//返回
	$("#back").bind('click',function(){
		window.history.go(-1);
	})
	
	//默认初始化图形验证码
	getCaptchaCode();

  	//刷新获取图形验证码
$("#validImg").bind("click",function(){      
	getCaptchaCode();
});
	  
	//验证手机号
	$("#loginCode").focusout(function(){
		
		loginCode($(this));
	});
	//密码
	$("#newpwd1").focusout(function(){
		newpwd1($(this))
	});
	//确认密码
	$("#newpwd2").focusout(function(){
		newpwd2($(this));
	});
	
	//判断图形验证码是否为空
	$("#captchaCode").focusout(function(){
		captchaCode($(this))
	});

	//判断手机验证码是否为空
	$("#verifyCode").focusout(function(){
		verifyCode($(this));
	});
	
	
	//获得手机验证码
	$("#veriCode").bind("click",function(){  
		if(!loginCode($("#loginCode")) && !captchaCode($("#captchaCode"))){
			return;
		}
		getveriCode();
		//验证验证码和手机号都不能为空
		
	});
	
	
})

/*-----function end----*/

function getCaptchaCode() {
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
				//给修改页面的input框赋值
				if(com_error(result)){
					captchaCodeValue = result.content["0"].value;
					captid = result.content["0"].deliveryId;
					imgUrl = result.content["0"].imgUrl;
					$("#validImg").attr({ src: imgUrl,cursor: 'hand',title: "点击刷新"});
					$("#validImg").css({cursor: 'pointer'});
					$("#captid").val(captid);
					$("#captchaCodeValue").val(captchaCodeValue);
					
				}else{
					alertMsg(result,"usermgmt_code_desc");
				}
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	};
	


function getBackPwd() {
	
	if(!loginCode($("#loginCode"))
			|| !captchaCode($("#captchaCode")) 
			|| !verifyCode($("#verifyCode")) 
			|| !newpwd1($("#newpwd1")) 
			|| !newpwd2($("#newpwd2"))){
		return;
	}
		var payload = {
			data : serach("usrmgmt.getbackpwd","ui-register"),
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
				if(com_error(result)){
					alert("重置密码成功,请重新登录");
					window.location.href = "index.html";
				}else{
					//TODO
					alertMsg(result,"usermgmt_code_desc");
				}
				
				
				
				console.log(result);
				//TODO 判断修改是否成功，成功跳转至登录页重新登录，错误提示错误信息
				
			
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	}



function getveriCode() {
	serach("usrmgmt.getvericode")
	params = {_mt:"usrmgmt.getvericode",channelId:$("#loginCode").val()};
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
			//给修改页面的input框赋值
			if(com_error(result)){
				alert("获取手机验证码发送成功");
				value = result.content["0"].value;
				deliveryId = result.content["0"].deliveryId;
				$("#verifyid").val(deliveryId);
				$("#verifyCode").val(value);
				
			}else{
				alertMsg(result,"usermgmt_code_desc");
			}
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}


/*--验证--*/
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
		$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>两次密码不一致<p>");
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



function loginCode(data){
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