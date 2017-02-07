$(function(){
//刷新获取图形验证码
	$("#validImg").bind("click",function(){      
		getCaptchaCode();
	});
	
	//默认初始化图形验证码
	getCaptchaCode();
	
	
	//验证手机号
	$("#mobileNo").focusout(function(){
		
		mobileNo($(this));
	});
	//密码
	$("#newpwd1").focusout(function(){
		newpwd1($(this))
	});
	$("#newpwd2").focusout(function(){
		newpwd2($(this))
	});
	
	//判断图形验证码是否为空
	$("#captchaCode").focusout(function(){
		captchaCode($(this))
	});
	//判断手机验证码是否为空
	$("#verifyCode").focusout(function(){
		verifyCode($(this));
	});
	//真实姓名
	$("#name").focusout(function(){
		name($(this));
	});
	//邮箱
	$("#email").focusout(function(){
		email($(this));
	});
	
	
	

	//注册用户
	$("#registerbtn").click(function(){
		
		if(!mobileNo($("#mobileNo"))
				|| !captchaCode($("#captchaCode")) 
				|| !verifyCode($("#verifyCode")) 
				|| !newpwd1($("#newpwd1"))
				|| !newpwd2($("#newpwd2"))
				|| !name($("#name"))
				|| !email($("#email"))
				|| !termAgreed($("#termAgreed"))
				
		
		){
			return;
			
		};
		
		
		var re = serach("usrmgmt.register","ui-register")
		if(!re.termAgreed){
			re.termAgreed = 0;
		}
		var payload = {
				data : re,
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
					//TODO 判断修改是否成功，成功跳转至登录页重新登录，错误提示错误信息
					if(com_error(result)){
						alert("注册成功,请登录");
						window.location.href = "index.html";
					}else{
						//TODO 验证码错误，手机验证码错误，用户已经存在
						/*var code = result.stat.stateList["0"].code;
						alert(usermgmt_code_desc[code+""]);*/
						alertMsg(result,"usermgmt_code_desc");
						getCaptchaCode();
						$("#captchaCode").val("");
						$("#verifyCode").val("");
					}
				
				},
				error : function() {
					alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
				}
			});
		
		
	});
	//获取手机验证码
	$("#ver-code").bind("click",function(){
		if(!mobileNo($("#mobileNo")) && !captchaCode($("#captchaCode"))){
			return;
		}
		
		getVerCode();
		});
	
	//返回按钮
	$("#back").bind('click',function(){
		window.history.go(-1);
	})
	
})	

/*-------function end-------*/
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
				if(getStatus(result)){
					captchaCodeValue = result.content["0"].value;
					captid = result.content["0"].deliveryId;
					imgUrl = result.content["0"].imgUrl;
					$("#validImg").attr({ src: imgUrl,cursor: 'hand',title: "点击刷新"});
					$("#validImg").css({cursor: 'pointer'});
					$("#captid").val(captid);
					$("#captchaCodeValue").val(captchaCodeValue);
					
				}else{
					//TODO 获取图形验证码失败
				}
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	};


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


	
	
	function email(data){
		obj = data.attr("id");
		if($.trim(data.val()) == ""){
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>用户邮箱不能为空<p>");
			return false;
		}
		//验证邮箱格式是否正确
		if(!validateEmail(data.val())){
			//提示手机号码格式不正确
			$(".email").html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>用户邮箱格式不正确<p>");
			return false;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
			return true
		}
	}
	function name(data){
		obj = data.attr("id");
		if($.trim(data.val()) == ""){
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>真实姓名不能为空<p>");
			return false;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
			return true
		}
	}
	function termAgreed(data){
		
		obj = data.attr("id");
		if($.trim($("input[name=termAgreed]:checked").val()) != "1"){
			$("."+obj).html("<p class='error tips-p-"+obj+"'><span class='icon_del'></span>请勾选服务条框<p>");
			return false;
		}else{
			//移除文本，去除class
			$(".tips-p-"+obj).remove();
			return true
		}
	}
	
	
	
	function getVerCode(){
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
				if(getStatus(result)){
					value = result.content["0"].value;
					deliveryId = result.content["0"].deliveryId;
					$("#verifyid").val(deliveryId);
					$("#verifyCode").val(value);
					
				}else{
					//TODO 获取手机验证码失败
				}
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
		
	}

