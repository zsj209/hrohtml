$(function() {
	$.datepicker.regional['zh-CN'] = {
		closeText : '关闭',
		prevText : '<上月',
		nextText : '下月>',
		currentText : '今天',
		monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
				'十月', '十一月', '十二月' ],
		monthNamesShort : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月',
				'九月', '十月', '十一月', '十二月' ],
		dayNames : [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
		dayNamesShort : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
		dayNamesMin : [ '日', '一', '二', '三', '四', '五', '六' ],
		weekHeader : '周',
		dateFormat : 'yy-mm-dd',
		firstDay : 0,
		isRTL : false,
		showMonthAfterYear : true,
		yearSuffix : '年',
		changeYear : true,
		changeMonth : true,
		yearRange : parseInt((new Date()).getFullYear() - 70) + ":"
				+ parseInt((new Date()).getFullYear() + 20)
	};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	// 页面整体布局 Layout布局
	var myLayout = $("body").layout({
		applyDefaultStyles : false,
		spacing_open : 0,
		north__resizable : true
	});

	// 点击侧边栏缩小 小图栏出现
	var set_leftpane_cnt = 0;
	$("#set_leftpane").click(function() {
		if (set_leftpane_cnt % 2 == 0) {
			$("#lPaneA").animate({
				"width" : "50px"
			}, 200);
			$("#lPane").animate({
				"left" : "-200px"
			}, 200);
			$("#lPane_1").animate({
				"left" : "0"
			}, 200);
			$("#rPane").animate({
				"left" : "50px",
				"width" : "1920px"
			}, 200)
		} else {
			$("#lPaneA").animate({
				"width" : "200px"
			}, 200);
			$("#lPane_1").animate({
				"left" : "-50px"
			}, 200);
			$("#lPane").animate({
				"left" : "0"
			}, 200);
			$("#rPane").animate({
				"left" : "200px"
			}, 200);
		}
		set_leftpane_cnt++;
	});

	$("#lPane_1 li").click(function() {
		$("#set_leftpane").trigger("click");
	});

	// table切换
	var maintab = jQuery('#tabs', '#rPane')
			.tabs(
					{
						add : function(e, ui) {
							$(ui.tab)
									.parents('li:first')
									.append(
											'<span class="ui-tabs-close ui-icon ui-icon-close" title="关闭"></span>')
									.find('span.ui-tabs-close')
									.click(
											function() {
												maintab
														.tabs(
																'remove',
																$('li', maintab)
																		.index(
																				$(
																						this)
																						.parents(
																								'li:first')[0]));
											});
							maintab.tabs('select', '#' + ui.panel.id);
							maintab.tabs({
								select : function(event, ui) {
									if (ui.panel.id == "tabs_1") {
										$("#lab_db").css("color", "white");
										$("#lab_gz").css("color", "white");
									}
								}
							});
						}
					});

	$("#tg_switch_roletype").change(
			function() {
				$("#tg_cur_roletype").val($(this).attr("value"));
				$("#tg_cur_company").val(
						$(this).find("option:selected").attr("company"));
				$("#tg_cur_roleId").val(
						$(this).find("option:selected").attr("roleId"));
				$("#tg_cur_companyName").val(
						$(this).find("option:selected").attr("companyName"));
				$("#tg_cur_roletype").trigger("click", [ "nonfirst" ]);
			});
	$("#tg_cur_roletype").click(function(e, isfirst) {
		// alert(isfirst);
		// alert("roletype: "+$("#tg_cur_roletype").val()+" company:
		// "+$("#tg_cur_company").val());
		getmenu({
			"_mt" : "usrmgmt.getusermenu",
			"roletype" : $("#tg_cur_roletype").val()
		}, "UserLogin");
		if (isfirst == "nonfirst") {
			swithcrole_cleartab();
			updateuserfinalrole($("#tg_cur_roletype").val());
		}
	});
	/*-------获取当前用户的用户名-----*/
	getName_user_info({
		_mt : "usrmgmt.getloginuser",
		purpose : 0
	}, "UsreLogin");
	getuserperm();

	function getmenu(requestData, level) {
		var payload = {
			data : requestData,
			level : level,
		};
		data = encrypt(payload.level, payload.data);
		$.ajax({
			type : "POST",
			async : true,
			url : pubsources.pub_getlink,
			crossDomain : true,
			dataType : "json",
			xhrFields : {
				withCredentials : true
			},
			data : serialize(data),
			success : function(result) {
				// alert(result.content);
				if (com_error(result)) {
					var treeData = result.content["0"].value;
					Tree(treeData);
				} else {
					alertMsg(result, "usermgmt_code_desc");
				}
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
		});
	}

	// 侧边栏的树结构
	function Tree(data) {
		// 根（root）
		var rootDiv = $("#lPane")[0];
		// alert($(rootDiv).html());
		$(rootDiv).empty();
		for (var i = 0; i < data.length; i++) {
			var node = data[i]; // object
			var nodeJson = JSON.stringify(node);
			var obj = eval('(' + nodeJson + ')'); // Json

			nodeDiv = document.createElement("div");
			nodeDiv.setAttribute("id", "node" + i);
			nodeDiv.setAttribute("class", "pnode collapsed");
			nodeDiv.setAttribute("sizcache", "1");
			nodeDiv.setAttribute("sizset", "0");

			nodeSpan = document.createElement("span");
			nodeImg = document.createElement("img");
			nodeImg.setAttribute("src", "../css/images/01.png");
			nodeImg.setAttribute("alt", "");
			nodeSpan.appendChild(nodeImg);

			nodeA = document.createElement("a");
			nodeA.setAttribute("href", "javascript:;");
			nodeText = document.createTextNode(obj.nodeName);
			nodeA.appendChild(nodeText);
			nodeEm = document.createElement("em");
			nodeDiv.appendChild(nodeSpan);
			nodeDiv.appendChild(nodeA);
			nodeDiv.appendChild(nodeEm);
			// console.log(nodeDiv);
			rootDiv.appendChild(nodeDiv);
			// console.log(rootDiv);
			// 二级
			var firstChild = obj.firstChild;
			childDiv = document.createElement("div");
			childDiv.setAttribute("id", "childnode" + i);
			childDiv.setAttribute("class", "childdiv");
			for (var ii = 0; ii < firstChild.length; ii++) {
				var child = firstChild[ii]; // object
				var childJson = JSON.stringify(child);
				var childObj = eval('(' + childJson + ')'); // Json
				childNode = document.createElement("div");
				childNode.setAttribute("class", "node childchg");
				childNode.setAttribute("sizcache", "1");
				childNode.setAttribute("sizset", "0");
				childNode.setAttribute("method", childObj.methodName);
				childNode.setAttribute("nodecode", childObj.nodeCode);
				childNode.setAttribute("nodeid", childObj.id);

				childText = document.createTextNode(childObj.nodeName);
				childNode.appendChild(childText);
				childDiv.appendChild(childNode);
				// console.log(childDiv);
			}
			rootDiv.appendChild(childDiv);
		}
		// console.log(rootDiv);
		$("#lPaneA").append($(rootDiv));
		// 点击事件出现二级菜单 放在真实DOM后
		$('.pnode').click(function() {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
			} else {
				$('.pnode').removeClass('active');
				$(this).addClass('active');
			}
			$(".node").removeClass("nodecolor");
			$(this).next().slideToggle();
			$('.childdiv').not($(this).next()).slideUp();
		})
		// 二级菜单绑定事件
		$(".childchg").click(function() {
			url = $(this).attr("method");
			name = $(this).html();
			nodeid = $(this).attr("nodeid");
			nodecode = $(this).attr("nodecode");
			if (url != "") {
				// alert("nodecode:"+nodecode+" url:"+url);
				loadnode(nodeid, nodecode, name, url);
			}
		});
	}

	// 菜单点击加载tab
	function loadnode(nodeid, nodecode, name, url) {
		var n = $('li', '#tag').length;
		var st = "#tabs_" + nodecode;
		if ($(st).html() != null) {
			maintab.tabs('select', st);
		} else {
			if (n == 8) {
				maintab.tabs('remove', 1);
			}
			maintab.tabs('add', st, name);
			$("#tg_cur_funid_temp").val(nodeid);
			$("#tg_cur_funcode_temp").val(nodecode);
			// alert("cur_comid: " + $("#tg_cur_company").val() + " cur_funid: "
			// + $("#tg_cur_funid_temp").val() + " cur_funcode: "+
			// $("#tg_cur_funcode_temp").val());
			$(st, "#tabs").load(url + "?" + new Date().getTime());
		}
	}

	// 切换角色，清除tab
	function swithcrole_cleartab() {
		var n = $('li', '#tag').length;
		// alert(n);
		for (var i = 1; i < n; i++) {
			// alert(i);
			maintab.tabs('remove', 1);
		}
	}

	// 点击出现修改密码层
	$("#headrighttwo").click(function() {
		$("#modifypassword").dialog({
			autoOpen : true,
			closeOnEscape : true,
			bgiframe : true,
			height : 225,
			width : 308,
			resizable : false,
			modal : true,
			buttons : {
				"取消" : function() {
					$(this).dialog("close");
				},
				"保存" : function() {
					$(this).dialog("close");
				},
			}
		});
	});
	// 点击出现注销层
	$("#headrightthree")
			.click(
					function() {
						var ct = "您确定要退出吗？"
						var ctn = ct.replace(/</g, "&lt;")
								.replace(/>/g, "&gt;").replace(/'/g, "&#39;")
								.replace(/"/g, "&#34;");
						var s = $("<DIV ID=\"sys_notes\"></DIV>");
						s
								.append("<table style='height:100%;width:100%;'><tr><td style='text-align:center;'><span>"
										+ ctn + "</span></td></tr></table>");
						$(s).dialog({
							autoOpen : true,
							closeOnEscape : true,
							bgiframe : true,
							title : "提示信息",
							height : 166,
							width : 320,
							zindex : 100,
							resizable : false,
							modal : true,
							buttons : {
								"退出" : function() {
									var logoutpar = {
										_mt : "usrmgmt.logout"
									};
									logout(logoutpar, "UsreLogin");
								},
								"取消" : function() {
									$(this).dialog("close");
								}
							},
							close : function(event, ui) {
								$(s).remove();
							}
						});

					});
	// 点击跳转到base-none页面
	$("#user_info").bind('click', function() {
		window.location.href = "base-none.html";
	})
});

function logout(requestData, level) {
	var payload = {
		data : requestData,
		level : level,
	};
	data = encrypt(payload.level, payload.data);
	// console.log(data);
	$.ajax({
		type : "POST",
		url : pubsources.pub_getlink,
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			setCookie("wtk", "");
			$(this).dialog("close");
			window.location.href = "../index.html";
		},
		error : function() {
			// alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			setCookie("wtk", "");
			$(this).dialog("close");
			window.location.href = "../index.html";
		}
	});
};

function getName_user_info(requestData, level) {
	var payload = {
		data : requestData,
		level : level
	};
	data = encrypt(payload.level, payload.data);
	console.log(data);
	$.ajax({
		type : "POST",
		async : false,
		url : pubsources.pub_getlink,
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			// console.log(result);
			// TODO 判断删除是否成功
			if (com_error(result)) {
				name = result.content["0"].name;
				$("#userName").text(name);
				$("#tg_user_froletype").val(result.content["0"].finalRoleType);
			} else {
				alertMsg(result, "usermgmt_code_desc");
			}

		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
};

// 获取用户权限
function getuserperm() {
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
		async: false,
		url : pubsources.pub_getlink,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
				if (com_error(result)) {
					//alert(result.content["0"]);
					var permlist = result.content["0"].permDlist;
					//alert(permlist.length);
					if (permlist.length==1) {
						$("#litg_switch_roletype").hide();
						$("#tg_cur_roletype").val(permlist[0].roleType);
						$("#tg_cur_roleId").val(permlist[0].roleId);
						$("#tg_cur_company").val(permlist[0].companyId);
						$("#tg_cur_companyName").val(permlist[0].companyName);
						$("#tg_cur_roletype").trigger("click",["first"]);
					} else {
						var tmps = [], tmptoletype = "";
						$(permlist).each(function(i) {
							//alert("i:" + i + " companyId: " + this.companyId + " positionId: " + this.positionId + " roleId: " + this.roleId + " roleType: " + this.roleType);
							if (tmptoletype.indexOf(this.roleType) < 0){
								tmptoletype += (this.roleType + ";");
								if (i==0) {
									$("#tg_cur_roletype").val(this.roleType);
									$("#tg_cur_roletId").val(this.roleId);
									$("#tg_cur_company").val(this.companyId);
									$("#tg_cur_companyName").val(this.companyName);
								}
								//alert($("#tg_user_froletype").val());
								if ($("#tg_user_froletype").val()==this.roleType) {
									tmps.push("<option value=\""+this.roleType+"\" roleId=\""+this.roleId+"\" company=\""+this.companyId+"\"  companyName=\""+this.companyName+"\" selected>"+this.roleTypeDesc);
									$("#tg_cur_roletype").val(this.roleType);
									$("#tg_cur_roleId").val(this.roleId);
									$("#tg_cur_company").val(this.companyId);
									$("#tg_cur_companyName").val(this.companyName);
								} else
									tmps.push("<option value=\""+this.roleType+"\" roleId=\""+this.roleId+"\" company=\""+this.companyId+"\"  companyName=\""+this.companyName+"\">"+this.roleTypeDesc);
							}
						});
						$("#tg_switch_roletype").html(tmps.join(""));
						$("#tg_cur_roletype").trigger("click", [ "first" ]);
					} 
				} else {
					var code = result.stat.stateList["0"].code;
					// alert(code);
				}
			},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
};

// 修改用户最后登录角色类型
function updateuserfinalrole(roletype) {
	var params = {
		_mt : "usrmgmt.updfianlroletpye",
		roletype : roletype
	};
	var payload = {
		data : params,
		level : "UserLogin"
	};
	data = encrypt(payload.level, payload.data);
	console.log(data);
	$.ajax({
		type : "POST",
		async : true,
		url : pubsources.pub_getlink,
		contentType : "application/x-www-form-urlencoded; charset=UTF-8",
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data)
	});
};
