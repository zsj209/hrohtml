var serversname = pubsources.pub_getlink;
var getSeltOption = "payrollTax.getTableSelectvl";// 获取select选项的接口
// 从公共表获取的都不需要改动，从其他表获取的暂无法公共处理
var None = "UserLogin";// 安全等级
/* 清空数据 新增、修改页面数据 */

function setaddupDivVlues(id) {
	$('#' + id).find('.add_input').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#" + id).val("");
	});
	$('#' + id).find('.add_texa').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#" + id).val("");
	});
	$('#' + id).find('.add_check').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#" + id).attr('checked') == "";
	});
	$('#' + id).find('.add_select').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#" + id).val("0");
	});
}

/* 获得select选项 */
function gettableSelectval(e, pkid) {
	var tbgdid = e.data.addgdid;
	var selids = [], selcode = [];
	$('#' + tbgdid).find('.add_select').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		var name = obj.attr('name');
		selids.push(id);
		selcode.push("'" + name + "'");
	});
	if ((selids == null || selids == "") && e.data.bntype == "add") {
		return;
	} else if ((selids == null || selids == "") && e.data.bntype == "upd") {
		updatePosrSetval(e, pkid);
		return;
	} else {
		updatePosrSetval(e, pkid);
	}

}

// 新增、修改数据的方法
function addupPubInfo(requestData, level, gdid, gddiv) {

	var payload = {
		data : requestData,
		level : level,
	};
	data = encryptNew(payload.level, payload.data);
	console.log("ddd" + data);

	$.ajax({
		type : "GET",
		url : serversname,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			$("#" + gdid).trigger("reloadGrid", [ {
				page : 1
			} ]);
		},
		error : function() {
			alert("操作失败请稍后重试。");
		}
	});

}

/* 去除前后空格 */
function Trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 获取新增、修改页面数据
function addupGetvlues(_mt, id, pkid) {
	var ckvl = 0;
	params = {};
	params['_mt'] = _mt;
	if (pkid != null && pkid != "") {
		params['id'] = pkid;
	}
	$('#' + id).find('.add_input').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		var isck = obj.attr('isck');
		var tsvl = $("#" + id).val();
		if (isck && ckvl == 0) {
			var istl = obj.attr('titl');
			var ckAry = isck.split(',');

			for (var i = 0; i < ckAry.length; i++) {
				var cksub = ckAry[i];
				if (cksub == 1 && ckvl == 0) {
					if (Trim(tsvl) == "") {
						alert(istl + "不能为空");
						ckvl = 1;
					}
				}
				if (cksub == 2 && ckvl == 0) {
					if (isNaN(tsvl)) {
						alert(istl + "必须输入数字类型的值");
						ckvl = 1;
					}
				}
			}
		}
		if (id) {
			if (tsvl != "") {
				params[id] = obj.val();
			}
		}
	});
	if (ckvl == 1) {
		return null;
	}
	$('#' + id).find('.add_texa').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		if (id) {
			params[id] = obj.val();
		}
	});
	$('#' + id).find('.add_check').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		if (id) {
			if ($(obj).attr('checked') == "checked") {
				params[id] = 1;
			} else {
				params[id] = 0;
			}
		}
	});
	$('#' + id).find('.add_select').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		if (id) {
			params[id] = obj.val();
		}
	});
	return params;
};
// 单表新增 保存按钮事件
function bn_addupSave(addtb_div, e, pkid) {
	// 根据id判断是新增方法还是修改方法
	if (pkid == "0") {
		// 此处需要修改 获取参数
		requestData = addupGetvlues(e.data.ininfointerface, addtb_div, pkid);
		// 此处需要修改 调用新增方法
		if (requestData != null) {
			addupPubInfo(requestData, None, e.data.gdid, addtb_div);
			$("#" + e.data.addgdid).dialog('close');
			$("#touming").hide();
		}

	} else {
		// 此处需要修改 获取参数
		requestData = addupGetvlues(e.data.upinfointerface, addtb_div, pkid);
		// 此处需要修改 调用修改方法
		if (requestData != null) {
			addupPubInfo(requestData, None, e.data.gdid, addtb_div);
			$("#" + e.data.addgdid).dialog('close');
			$("#touming").hide();
		}
	}

}
// 主子表新增 保存按钮事件
function bn_addupSave_main(addtb_div, e, pkstr) {
	var pkid = $("#" + pkstr).val();
	// 根据id判断是新增方法还是修改方法
	if (pkid == "0") {
		// 此处需要修改 获取参数
		requestData = addupGetvlues(e.data.ininfointerface, addtb_div, pkid);
		// 此处需要修改 调用新增方法
		if (requestData != null) {
			addupPubInfo_main(requestData, None, e.data.gdid, addtb_div, pkstr,
					1);
			// $("#"+e.data.addgdid).dialog('close');$("#touming").hide();
		}

	} else {
		// 此处需要修改 获取参数
		requestData = addupGetvlues(e.data.upinfointerface, addtb_div, pkid);
		// 此处需要修改 调用修改方法
		if (requestData != null) {
			addupPubInfo_main(requestData, None, e.data.gdid, addtb_div, pkstr,
					2);
			// $("#"+e.data.addgdid).dialog('close');$("#touming").hide();
		}
	}

}
// 主子表新增的方法
function addupPubInfo_main(requestData, level, gdid, gddiv, pkstr, optype) {
	var disInfo = "新增";
	if (optype == 2) {
		disInfo = "修改";
	}
	var payload = {
		data : requestData,
		level : level,
	};
	data = encryptNew(payload.level, payload.data);
	console.log("zzzzzzzzzzzzzzz" + data);
	$.ajax({
		type : "GET",
		url : serversname,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			var data = result.content["0"].value;
			if (data) {
				if (optype == 1) {
					$("#" + pkstr).val(data + "");
				}
				alert(disInfo + "成功");
			}
			$("#" + gdid).trigger("reloadGrid", [ {
				page : 1
			} ]);
		},
		error : function() {
			alert("操作失败请稍后重试。");
		}
	});
}
function updatePosrSetval(e, pkid) {
	var _mt = e.data.updinterface;
	var gdid = e.data.addgdid;
	var getname = e.data._mtnm;
	var clnrequestData = {
		_mt : _mt,
		id : pkid
	};
	var payload = {
		data : clnrequestData,
		level : None,
	};
	data = encrypt(payload.level, payload.data);
	$.ajax({
		type : "GET",
		url : serversname,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			var data = result.content["0"];

			lineJson = JSON.stringify(data);
			updateJson = eval('(' + lineJson + ')'); // Json

			// 获得key
			var updateKey = new Array();
			for ( var o in updateJson) {
				updateKey.push(o);
			}
			;
			$('#' + gdid).find('.add_input').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				for (var i = 0; i < updateKey.length; i++) {
					if (id == updateKey[i]) {
						obj.val(updateJson[updateKey[i]]);
						return;
					}
				}
			});
			$('#' + gdid).find('.add_texa').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				for (var i = 0; i < updateKey.length; i++) {
					if (id == updateKey[i]) {
						obj.val(updateJson[updateKey[i]]);
						return;
					}
				}
			});
			$('#' + gdid).find('.add_check').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				for (var i = 0; i < updateKey.length; i++) {
					if (id == updateKey[i]) {
						if (updateJson[updateKey[i]] == 1) {
							$("#" + id).attr("checked", true);
						} else {
							$("#" + id).attr("checked", false);
						}
						return;
					}
				}
			});
			$('#' + gdid).find('.add_select').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				for (var i = 0; i < updateKey.length; i++) {
					if (id == updateKey[i]) {
						obj.val(updateJson[updateKey[i]]);
						return;
					}
				}
			});

			$('#' + gdid).find('.add_input_name').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				for (var i = 0; i < updateKey.length; i++) {
					if (id == updateKey[i]) {
						obj.val(updateJson[updateKey[i]]);
						return;
					}
				}
			});

			$('#' + gdid).find('.add_input_dis').each(function() {
				var obj = $(this);
				var id = obj.attr('id');
				var idhd = id.substring(4);
				var idvl = $("#" + idhd).val();
				var vname = $("#" + id).attr("name");
				// 根据id查出名称
				var bnrequestData = {
					_mt : getname + ".getForIdselName",
					selId : vname,
					userId : "1",
					selVal : idvl
				};
				var payload = {
					data : bnrequestData,
					level : None,
				};
				data = encrypt(payload.level, payload.data);
				$.ajax({
					type : "GET",
					url : serversname,
					crossDomain : true,
					dataType : "json",
					xhrFields : {
						withCredentials : true
					},
					data : serialize(data),
					success : function(result) {
						var data = result.content["0"].value;
						$("#" + id).val(data);
					},
					error : function() {
						alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
					}
				});
				// alert(vname);
			});
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}
/* 删除数据 */
function delDataInfo(jqname, delrequestData, level, pkids) {
	var requestData = {
		_mt : delrequestData,
		delIds : pkids
	};
	var payload = {
		data : requestData,
		level : level,
	};
	data = encrypt(payload.level, payload.data);
	$.ajax({
		type : "GET",
		url : serversname,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials : true
		},
		data : serialize(data),
		success : function(result) {
			alert("删除成功");
			$("#" + jqname).trigger("reloadGrid", [ {
				page : 1
			} ]);
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}