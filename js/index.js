$(function() {
	// 判断浏览器是否支持 placeholder
	if (!placeholderSupport()) {
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	};

	function placeholderSupport() {
		return 'placeholder' in document.createElement('input');
	}
})

// 登录点击事件
function loginIn() {
	var com = $("#bianma").val();
	var name = $('#username').val();
	var pwd = md5($('#password').val());
	var params = {
		companyCode : com,
		username : name,
		password : pwd,
		_mt : "usermgmt.login",
		applicationId : "0"
	};

	var payload = {
		data : params,
		level : "None"
	};
	var data = encrypt(payload.level, payload.data);
	console.log(data);
	console.log(params._mt);
	console.log(params);
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
			/*console.log(result);
			console.log(result.content["0"].webToken);
			console.log(result.content);*/
			if(com_error(data)){
				setCookie("wtk", result.content["0"].webToken);
				window.location.href = "html/base.html";
			}else{
				//TODO 判断自己的服务错误码
			}
			
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}
