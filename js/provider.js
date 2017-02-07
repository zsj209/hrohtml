$(function() {

	// 加载下拉框
	getSelectDataTypeList({
		"compType" : "comptype",
		"compState" : "pubstatus"
	});

	$("#compStarttime").datepicker();
	$("#compEndtime").datepicker();
	var serversname = pubsources.pub_getlink;// 网关接口
	var clmrequestData = {
		_mt : "company.selectByColuPage",// *分页的方法
		compType : "06insu"
	};// 获取数据的接口
	var gdid = "jq_comp_company";// 显示数据的div//*company.html里面的
	var addgdid = "form_jq_comp_company";// 新增 修改 显示数据的div
	// var addtb_div="pays_tax_addinfoarea";//新增 修改 显示字段的div
	var seldiv = "comp_company";// 根据id查询的divid
	var updinterface = "company.selectById";// 修改时根据id获取数据的接口
	var upinfointerface = "company.addorupdate";// 修改数据的接口
	var ininfointerface = "company.addorupdate";// 新增数据的接口
	var dlinfointerface = "company.deleteBatchById";// 批量删除接口
	var bn_div = "bn_comp_company";// 按钮div的id
	var None = "UserLogin";// 安全等级
	var bnsuffix = "_compcompany";// 按钮后缀
	var pageid = "#page_comp_company";// 分页div

	/*--------加载表格------*/
	// 获取按钮
	gettablebninfo_compcompany(bn_div, None);
	function gettablebninfo_compcompany(bndivid, level) {
		var bnnames = eval("([{code:'bn_add',name:'新增'},{code:'bn_upd',name:'修改'},{code:'bn_del',name:'删除'}])");
		// 获取按钮信息
		getButtonInfo_company(bndivid, bnnames);
	}
	/* 拼接按钮模块div */
	function getButtonInfo_company(bndivid, bnnames) {
		var _arr = [];
		for (var i = 0; i < bnnames.length; i++) {
			// 此处需要修改 为了区分，按钮后缀改为自己的
			_arr.push('<input type="button" id="' + bnnames[i].code + bnsuffix
					+ '" value="&nbsp;' + bnnames[i].name + '&nbsp;">&nbsp;');
		}
		$("#" + bndivid).html(_arr.join(""));
		// 获取jqgrid数据
		gettableHead_compcompany();
	}
	/* 获得jqgrid表头 */
	function gettableHead_compcompany() {
		var data = [];
		data.push("编号, 公司名称, 公司类型, 地区名称,详细地址,创建日期, 终止日期, 管理员,公司状态, 备注");
		data.push("[{name:'id'}" + ",{name:'compName',width:'100'}"
				+ ",{name:'compTypeDesc',width:'100'}"
				+ ",{name:'compDistrictName',width:'100'}"
				+ ",{name:'compAddr',width:'100'}"
				+ ",{name:'compStarttime',width:'100'}"
				+ ",{name:'compEndtime',width:'100'}"
				+ ",{name:'compControllerName',width:'100'}"
				+ ",{name:'compStateDesc',width:'100'}"
				+ ",{name:'compNote',width:'100'}]");

		disjQgridTable_compcompany(data[0], data[1]);
	}

	/* 获取jqgrid数据 */
	function disjQgridTable_compcompany(colNames, colModel) {
		var colnms = colNames.split(",");
		var colmdsJson = eval('(' + colModel + ')');

		// 清空jqgrid中的数据
		$('#' + gdid).jqGrid('clearGridData');
		var payload = {
			data : clmrequestData,
			level : None
		};
		// var data = encrypt(payload.level, payload.data);

		$("#" + gdid).jqGrid({
			url : serversname,
			datatype : "json",
			mtype : "POST",
			postData : payload.data,
			mylevel : None,
			prmNames : {
				page : "page",
				rows : "rows",
				sort : null,
				order : null,
				search : null,
				nd : null,
				npage : null
			},
			jsonReader : {
				/* content中的响应 */
				root : "rows",// 表格中的数据
				page : "page",// 当前页码
				total : "total",// 总页数
				records : "records"// 总行数
			},
			colNames : colnms,
			colModel : colmdsJson,
			rowNum : 20,
			forceFit : true,
			rownumbers : true,
			autowidth : false,
			shrinkToFit : false,
			rowList : [ 20, 50, 100 ],
			pager : pageid,
			sortname : 'id',
			viewrecords : true,
			rownumbers : true,
			rownumWidth : "30",
			gridview : true,
			multiselect : true,
			sortorder : "desc",
			height : 400,
			width : 1600,
			ondblClickRow : function(id) {

			}
		}).navGrid("#pg_", {
			refresh : false,
			edit : false,
			add : false,
			del : false,
			search : false
		}).navButtonAdd("#pg_", {
			title : "refresh",
			caption : "",
			buttonicon : "ui-icon-refresh",
			onClickButton : function() {

			},
			position : "last"
		});
		jQuery("#" + gdid).setGridParam().hideCol("id").trigger("reloadGrid");
		// 此处需要修改 此处注意 因为无法动态拼接方法，所以只能这样绑定
		$("#bn_add" + bnsuffix).bind("click", {
			bntype : "add",
			addgdid : addgdid,
			seldiv : seldiv,
			gdid : gdid,
			ininfointerface : ininfointerface,
			upinfointerface : upinfointerface,
			bn_div : bn_div
		}, addinfo_Generatedivts_compcompany);// 新增方法名请改成自己的
		// 此处需要修改 修改按钮
		// 参数说明：jqgrid的id，修改标识，获取修改数据的接口，修改的div拼接页面的div，修改的div的外层id（用于显示隐藏界面）
		$("#bn_upd" + bnsuffix).bind("click", {
			bntype : "upd",
			addgdid : addgdid,
			seldiv : seldiv,
			gdid : gdid,
			upinfointerface : upinfointerface,
			updinterface : updinterface,
			bn_div : bn_div
		}, addinfo_Generatedivts_compcompany);// 新增方法名请改成自己的

		// 此处需要修改 删除按钮 参数说明：jqgrid的id，删除数据接口
		$("#bn_del" + bnsuffix).bind("click", {
			gdid : gdid,
			delinterface : dlinfointerface
		}, bn_del_pub_company);

		$("#comp_company_bseach").bind("click", {}, comp_company_bseach);// 快捷查询

		$("#jq_lf_company_base").bind("click", {
			type : 1,
			addgdid : addgdid
		}, mainchildDisplay);

		// 新增页面 主信息点击事件
		$("#jq_lf_company_one").bind("click", {
			type : 2,
			addgdid : addgdid
		}, mainchildDisplay);

		// 新增页面 主信息点击事件
		$("#jq_lf_company_two").bind("click", {
			type : 3,
			addgdid : addgdid
		}, mainchildDisplay);

		// 新增页面 子信息点击事件
		$("#se_comp_company_name").focus(function() {
			var cval = Trim($("#se_comp_company_name").val());
			if (cval == "请输入公司名称") {
				$("#se_comp_company_name").val("");
			}
		}).blur(function() {
			var cval = Trim($("#se_comp_company_name").val());
			if (cval == "") {
				$("#se_comp_company_name").val("请输入公司名称");
			}
		});

		// 快捷查询 获取 失去焦点事件
		$("#jq_comp_company_basave").bind("click", {
			addgdid : addgdid,
			seldiv : seldiv,
			gdid : gdid,
			ininfointerface : ininfointerface,
			upinfointerface : upinfointerface,
			bn_div : bn_div
		}, addupSave_paysformatmain);
		// 新增页面 子单据新增按钮保存事件

	}
	/*--------加载表格 end------*/

	function addupSave_paysformatmain(e) {
		bn_addupSave_main(gdid + "_addinfoarea", e, "jq_lf_company_pid");
	}
	/*
	 * 主子表点击事件
	 */
	function mainchildDisplay(e) {
		if (e.data.type == "1") {
			// 主节点单击事件
			var grdis = $('#' + e.data.addgdid + "_base").css('display');
			// 主表样式改变
			$("#jq_lf_company_base").css("background", "#b7ddff");
			$("#jq_lf_company_one").css("background", "#fff");
			$("#jq_lf_company_two").css("background", "#fff");
			// 如果主表展开
			if (grdis == "block") {
				return;
			} else {// 如果主表是隐藏 就要显示
				$("#" + e.data.addgdid + "_base").show();
				// 其余两个子表移除
				$("#" + e.data.addgdid + "_one").remove();
				$("#" + e.data.addgdid + "_two").remove();
				$("#form_jq_comp_contacts").remove();
				$("#form_jq_comp_attachment").remove();
			}
		} else if (e.data.type == "2") {// 第二个子表点击
			var pkid = $("#jq_lf_company_pid").val(); // 获取主表id的值
			if (pkid == "" || pkid == "0") {
				alert("请先保存主表信息");
				return;
			}
			// 第二个子表样式改变 其余两个变灰色
			$("#jq_lf_company_one").css("background", "#b7ddff");
			$("#jq_lf_company_base").css("background", "#fff");
			$("#jq_lf_company_two").css("background", "#fff");

			// 子节点单击事件
			var grdis = $('#' + e.data.addgdid + "_one").css('display');
			if (grdis == "block") {
				return;
			} else {// 如果第二个子表是隐藏的，点击一下显示
				$("#" + e.data.addgdid + "_base").hide();// 主页面隐藏
				$("#" + e.data.addgdid + "_one").remove();// 两个子页面移除
				$("#" + e.data.addgdid + "_two").remove();// 两个子页面移除
				$("#form_jq_comp_contacts").remove();// 两个子页面移除
				$("#form_jq_comp_attachment").remove();// 两个子页面移除

				var fone = '<DIV CLASS="jqForm div_center"  id="'
						+ e.data.addgdid + '_one" style=""></div>';
				$("#" + e.data.addgdid + "_base").after(fone);
				// $("#"+e.data.addgdid+"_one").show();
				$("#" + e.data.addgdid + "_one").load(
						'../company/companys/contacts.html');
			}
		} else if (e.data.type == "3") {
			var pkid = $("#jq_lf_company_pid").val();
			if (pkid == "" || pkid == "0") {
				alert("请先保存主表信息");
				return;
			}
			$("#jq_lf_company_one").css("background", "#fff");
			$("#jq_lf_company_two").css("background", "#b7ddff");
			$("#jq_lf_company_base").css("background", "#fff");
			// 子节点单击事件
			var grdis = $('#' + e.data.addgdid + "_two").css('display');
			if (grdis == "block") {
				return;
			} else {
				$("#" + e.data.addgdid + "_base").hide();
				$("#" + e.data.addgdid + "_one").remove();
				$("#" + e.data.addgdid + "_two").remove();
				$("#form_jq_comp_attachment").remove();
				var fone = '<DIV CLASS="jqForm div_center"  id="'
						+ e.data.addgdid + '_two" style=""></div>';
				$("#" + e.data.addgdid + "_base").after(fone);
				// $("#"+e.data.addgdid+"_one").show();
				$("#" + e.data.addgdid + "_two").load(
						'../company/companys/attachment.html');
			}
		}
	}

	/* ===============新增或修改 begin================== */
	function addinfo_Generatedivts_compcompany(e) {
		var pkid = "0";
		$("#jq_lf_company_base").css("background", "#b7ddff");
		$("#jq_lf_company_one").css("background", "#fff");
		$("#jq_lf_company_two").css("background", "#fff");
		$("#" + e.data.addgdid + "_base").hide();
		$("#" + e.data.addgdid + "_one").remove();
		$("#form_jq_pays_fmatpro").remove();
		if (e.data.bntype == "upd") {
			var r = $("#" + e.data.gdid).getGridParam('selrow');
			pkid = $("#" + e.data.gdid).getCell(r, 2);
			if (pkid == null) {
				alert("请选择行操作");
				return;
			}
		}
		$("#jq_lf_company_pid").val(pkid);
		setaddupDivVlues(addgdid);
		// var s=$("<DIV ID=\"form_jq_pays_tax\"
		// STYLE=\"overflow:auto;position:relative;left:0px;top:0px;\"
		// CLASS=\"jqForm\" TITLE=\"新增信息\"><div
		// id=\"jq_pays_tax_addinfoarea\"></div></DIV>");
		// $("#"+e.data.bn_div).after(s);
		var btns = {
			'取消' : function() {
				$(this).dialog('close');
				$("#touming").hide();
			},
			'保存' : function() {
				bn_addupSave_main(gdid + "_addinfoarea", e, "jq_lf_company_pid");
			}
		};
		$("#" + e.data.addgdid).dialog({
			autoOpen : true,
			bgiframe : true,
			height : 500,
			width : 800,
			modal : true,
			resizable : false,
			buttons : [],
			close : function(event, ui) {
				$("#" + e.data.addgdid).hide();
				$("#touming").hide();
			}
		});
		gettableSelectval(e, pkid);
		$("#" + e.data.addgdid).show();
		$("#" + e.data.addgdid + "_base").show();
		// 显示透明层
		$("#touming").show();
	}
	/* ===============新增或修改 end================== */

	/* ==============删除接口 begin============= */
	function bn_del_pub_company(e) {
		var gdid = e.data.gdid, delinterface = e.data.delinterface;
		var rows = $("#" + gdid).getGridParam('selarrrow'), rl = "";
		var dsum = 0;
		$.each(rows, function(i, n) {
			rl += $("#" + gdid).getCell(n, 2) + ",";
			dsum = dsum + 1;
		});
		if (rows.length >= 1) {
			rl = rl.substring(0, rl.length - 1);
		}
		if (rl == "") {
			alert("请选中数据后删除");
			return;
		}
		if (confirm("您确定删除选中的 " + dsum + " 条记录吗？")) {
			delDataInfo(gdid, delinterface, "UserLogin", rl);
		}
	}
	/* ==============删除接口 end============= */

	/* ==========快速查询按钮事件 begin ========= */
	function comp_company_bseach() {
		var companyName = Trim($("#se_comp_company_name").val());
		if (companyName == "请输入公司名称") {
			companyName = "";
		}
		// 清空jqgrid中的数据
		$("#" + gdid).jqGrid('clearGridData');
		var colmRequestDatas = {
			_mt : "company.selectByColuPage",
			compName : companyName
		};
		var payload = {
			data : colmRequestDatas,
			level : None,
		};

		$("#" + gdid).jqGrid('setGridParam', {
			datatype : 'json',
			postData : payload.data,
			mylevel : None,
			prmNames : {
				page : "page",
				rows : "rows",
				sort : null,
				order : null,
				search : null,
				nd : null,
				npage : null
			},
			jsonReader : {
				/* content中的响应 */
				root : "rows",// 表格中的数据
				page : "page",// 当前页码
				total : "total",// 总页数
				records : "records"// 总行数
			},
			pager : pageid,
		}).trigger("reloadGrid");
	}

	/* ==========快速查询按钮事件 end ========= */

});

$("#compController_Name").click(function() {
	comsel("seluser", "管理员", "compController", "compControllerName", 0);
})

$("#compDistrict_Name").click(function() {
	comsel("selcity", "城市", "compDistrict", "compDistrictName", 0);
})

function getSelectDataTypeList(arr) {
	idArr = new Array();
	typeArr = new Array();
	for ( var a in arr) {
		idArr.push(a);
		typeArr.push(arr[a]);

	}
	/*
	 * var datas = { _mt : "commparminfo.getparamlist", typecode: type };
	 */
	var paramtypelist = typeArr;
	// var paramtypelist=["bustype","yesno"];
	paramtypelist = JSON.stringify(paramtypelist);
	var datas = {
		_mt : "commparminfo.getparamlistgroup",
		paramtypelist : paramtypelist
	};
	data = encrypt("None", datas);
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
			dataResult = result.content["0"].value;
			console.log(dataResult);
			var _arr = [];
			// _arr.push("<option value='0'>请选择</option>")
			for ( var o in dataResult) {
				_arr = [];
				_arr.push("<option value=''>--请选择--</option>");
				var obj = dataResult[o].paramList
				for ( var i in obj) {
					if (obj[i].code == "05hrovend") {
						_arr.push("<option  selected =selected value='"
								+ obj[i].code + "'>" + obj[i].desc
								+ "</option>")
					} else {
						_arr.push("<option value='" + obj[i].code + "'>"
								+ obj[i].desc + "</option>")
					}

				}
				$("#" + idArr[o]).html(_arr.join(""));
			}

		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
	});
}
