$(function() {
	$("#policyStarttime").datepicker();
	$("#policyEndtime").datepicker();

	// 加载下拉框
	getSelectDataTypeList({
		"policyAdday" : "seldays",
		"policyMinusday" : "seldays"
	});

	// 省市区获取树结构
	var treeparams = {
		_mt : "commoncity.queryTreeCityList"
	};
	getInfo_comm_treeCity(treeparams, "UserLogin");
	var serversname = pubsources.pub_getlink;// 网关接口
	var clmrequestData = {
		_mt : "hosfPolicy.getPolicyByPage"
	};// 获取数据的接口
	var gdid = "jq_hosf_policy";// 显示数据的div
	var addgdid = "form_jq_hosf_policy";// 新增 修改 显示数据的div
	// var addtb_div="pays_tax_addinfoarea";//新增 修改 显示字段的div
	var seldiv = "hosf_policy";// 根据id查询的divid
	var updinterface = "hosfPolicy.selectById";// 修改时根据id获取数据的接口
	var upinfointerface = "hosfPolicy.addorupdate";// 修改数据的接口
	var ininfointerface = "hosfPolicy.addorupdate";// 新增数据的接口
	var dlinfointerface = "hosfPolicy.deleteBatchByIds";// 批量删除接口
	var bn_div = "bn_hosf_policy";// 按钮div的id
	var None = "UserLogin";// 安全等级
	var bnsuffix = "_hosfpolicy";// 按钮后缀
	var pageid = "#page_hosf_policy";// 分页div

	/*--------加载表格------*/
	// 获取按钮
	gettablebninfo_hosfpolicy(bn_div, None);
	function gettablebninfo_hosfpolicy(bndivid, level) {
		var bnnames = eval("([{code:'bn_add',name:'新增'},{code:'bn_upd',name:'修改'},{code:'bn_del',name:'删除'}])");
		// 获取按钮信息
		getButtonInfo_policy(bndivid, bnnames);
	}
	/* 拼接按钮模块div */
	function getButtonInfo_policy(bndivid, bnnames) {
		var _arr = [];
		for (var i = 0; i < bnnames.length; i++) {
			// 此处需要修改 为了区分，按钮后缀改为自己的
			_arr.push('<input type="button" id="' + bnnames[i].code + bnsuffix
					+ '" value="&nbsp;' + bnnames[i].name + '&nbsp;">&nbsp;');
		}
		$("#" + bndivid).html(_arr.join(""));
		// 获取jqgrid数据
		gettableHead_hosfpolicy();
	}
	/* 获得jqgrid表头 */
	function gettableHead_hosfpolicy() {
		var data = [];
		data.push("编号, 所属公司, 政策名称, 地区名称, 开始时间,结束时间, 公积金报增日, 公积金报减日, 是否有效, 备注");
		data.push("[{name:'id'}" + ",{name:'companyName',width:'100'}"
				+ ",{name:'policyName',width:'100'}"
				+ ",{name:'policyProName',width:'100'}"
				+ ",{name:'policyStarttime',width:'100'}"
				+ ",{name:'policyEndtime',width:'100'}"
				+ ",{name:'policyAddayDesc',width:'100'}"
				+ ",{name:'policyMinusdayDesc',width:'100'}"
				+ ",{name:'policyValidDesc',width:'100'}"
				+ ",{name:'policyNote',width:'100'}]");

		disjQgridTable_hosfpolicy(data[0], data[1]);
	}

	/* 获取jqgrid数据 */
	function disjQgridTable_hosfpolicy(colNames, colModel) {
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
		}, addinfo_Generatedivts_hosfpolicy);// 新增方法名请改成自己的
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
		}, addinfo_Generatedivts_hosfpolicy);// 新增方法名请改成自己的

		// 此处需要修改 删除按钮 参数说明：jqgrid的id，删除数据接口
		$("#bn_del" + bnsuffix).bind("click", {
			gdid : gdid,
			delinterface : dlinfointerface
		}, bn_del_pub_policy);

		$("#hosf_policy_bseach").bind("click", {}, hosf_policy_bseach);// 快捷查询

		$("#jq_lf_policy_base").bind("click", {
			type : 1,
			addgdid : addgdid
		}, mainchildDisplay);

		// 新增页面 主信息点击事件
		$("#jq_lf_policy_one").bind("click", {
			type : 2,
			addgdid : addgdid
		}, mainchildDisplay);

		// 新增页面 子信息点击事件
		$("#se_hosf_policy_name").focus(function() {
			var cval = Trim($("#se_hosf_policy_name").val());
			if (cval == "请输入政策名称") {
				$("#se_hosf_policy_name").val("");
			}
		}).blur(function() {
			var cval = Trim($("#se_hosf_policy_name").val());
			if (cval == "") {
				$("#se_hosf_policy_name").val("请输入政策名称");
			}
		});

		// 快捷查询 获取 失去焦点事件
		$("#jq_hosf_policy_basave").bind("click", {
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
		bn_addupSave_main(gdid + "_addinfoarea", e, "jq_lf_policy_pid");
	}
	/*
	 * 主子表点击事件
	 */
	function mainchildDisplay(e) {
		if (e.data.type == "1") {
			// 主节点单击事件
			var grdis = $('#' + e.data.addgdid + "_base").css('display');
			$("#jq_lf_policy_base").css("background", "#b7ddff");
			$("#jq_lf_policy_one").css("background", "#fff");
			if (grdis == "block") {
				return;
			} else {
				$("#" + e.data.addgdid + "_base").show();
				$("#" + e.data.addgdid + "_one").remove();
				$("#form_jq_pays_fmatpro").remove();

			}
		} else if (e.data.type == "2") {
			var pkid = $("#jq_lf_policy_pid").val();
			if (pkid == "" || pkid == "0") {
				alert("请先保存主表信息");
				return;
			}
			$("#jq_lf_policy_one").css("background", "#b7ddff");
			$("#jq_lf_policy_base").css("background", "#fff");
			// 子节点单击事件
			var grdis = $('#' + e.data.addgdid + "_one").css('display');
			if (grdis == "block") {
				return;
			} else {
				$("#" + e.data.addgdid + "_base").hide();
				$("#" + e.data.addgdid + "_one").remove();
				$("#form_jq_pays_fmatpro").remove();
				var fone = '<DIV CLASS="jqForm div_center"  id="'
						+ e.data.addgdid + '_one" style=""></div>';
				$("#" + e.data.addgdid + "_base").after(fone);
				// $("#"+e.data.addgdid+"_one").show();
				$("#" + e.data.addgdid + "_one").load(
						'../hosf/policy/insurance.html');
			}
		}
	}

	/* ===============新增或修改 begin================== */
	function addinfo_Generatedivts_hosfpolicy(e) {
		var pkid = "0";
		$("#jq_lf_policy_base").css("background", "#b7ddff");
		$("#jq_lf_policy_one").css("background", "#fff");
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
		$("#jq_lf_policy_pid").val(pkid);
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
				bn_addupSave_main(gdid + "_addinfoarea", e, "jq_lf_policy_pid");
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
	function bn_del_pub_policy(e) {
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
	function hosf_policy_bseach() {
		var policyName = Trim($("#se_hosf_policy_name").val());
		if (policyName == "请输入政策名称") {
			policyName = "";
		}
		// 清空jqgrid中的数据
		$("#" + gdid).jqGrid('clearGridData');
		var colmRequestDatas = {
			_mt : "hosfPolicy.getPolicyByColumPage",
			policyName : policyName,
			policyStarttime : "2015-08-08",
			policyEndtime : "2015-08-08",
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

	// 获取左边树的结构
	/***************************************************************************
	 * 获取左边城市类别
	 */
	function getInfo_comm_treeCity(requestData, level) {
		var payload = {
			data : requestData,
			level : level,
		};
		data = encrypt(payload.level, payload.data);
		console.log(data);
		$
				.ajax({
					type : "GET",
					url : pubsources.pub_getlink,
					crossDomain : true,
					dataType : "json",
					xhrFields : {
						withCredentials : true
					},
					data : serialize(data),
					success : function(result) {
						// 给修改页面的input框赋值
						data = result.content["0"].value;
						// alert(data[0].id)
						var _arr = [];
						_arr.push('<ul class="">');/**/
						for ( var o in data) {
							_arr.push('<li class="pnode jqTreepnode">');/**/
							_arr
									.push('<a style="width:200px;" href="javascript:void(0)" onclick="showCity(this)" gdid="1" fun="1603" value="'
											+ data[0].id
											+ '" gid="1" class="">'
											+ data[0].cityName + '</a>');
							_arr.push('<ul class="jqTree child" >');
							var data2 = data[o].list;
							for ( var i in data2) {
								_arr.push('<li class="">');/*
															 * pnode visited
															 * expanded
															 */
								_arr
										.push('<a  href="javascript:void(0)" fun="1395" value="'
												+ data2[i].id
												+ '" gid="1" gdid="1" class="click" onclick="showCity(this)">'
												+ data2[i].cityName
												+ '</a>');
								_arr.push('<ul class="jqTree child" >');
								var data3 = data2[i].list;
								if (data3 != "") {
									for ( var j in data3) {
										_arr.push('<li class=""  >');/*
																		 * pnode
																		 * visited
																		 * collapsed
																		 */
										_arr
												.push('<a  href="javascript:void(0)" fun="1429" value="'
														+ data3[j].id
														+ '" gid="1" gid="1603" onclick="showCity(this)"  class="">'
														+ data3[j].cityName
														+ '</a>');
										_arr.push('<ul class="jqTree child" >');
										var data4 = data3[j].list;
										if (data3 != "") {
											for ( var k in data4) {
												_arr.push('<li class="">');/*
																			 * pnodestate
																			 * visited
																			 */
												_arr
														.push('<a  href="javascript:void(0)" fun="1765" onclick="showCity(this)" gid="1" value="'
																+ data4[k].id
																+ '" gid="1395" class="">'
																+ data4[k].cityName
																+ '</a>');
												_arr.push('</li>');
											}
										}
										_arr.push('</ul>');
										_arr.push('</li>');
									}
								}

								_arr.push('</ul>');
								_arr.push('</li>');
							}
							_arr.push('</ul>');
							_arr.push('</li>');

						}
						_arr.push('</ul>');

						// alert(_arr.join(""))

						$("#tree_hosfpolicy_list").html(_arr.join(""));
						treeList();

					},
					error : function() {
						alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
					}
				});
	}

	function treeList() {
		$("#tree_hosfpolicy_list ul li").children("ul").hide();
		$("#tree_hosfpolicy_list").find("li").not(":has(ul)").children("a")
				.css({
					textDecoration : "none",
					color : "#333",
					background : "none"
				}).click(
						function() {
							$(this).get(0).location.href = "'"
									+ $(this).attr("href") + "'";
						});
		$("#tree_hosfpolicy_list")
				.find("li:has(ul)")
				.children("a")
				.css(
						{
							background : "url(../../css/images/tree/pnode.png) no-repeat left top;"
						})
				.click(
						function() {

							if ($(this).next("ul").is(":hidden")) {
								$(this).next("ul").slideDown("slow");
								if ($(this).parent("li").siblings("li")
										.children("ul").is(":visible")) {
									$(this).parent("li").siblings("li").find(
											"ul").slideUp("1000");
									$(this)
											.parent("li")
											.siblings("li:has(ul)")
											.children("a")
											.css(
													{
														background : "url(../css/images/tree/pnode.png) no-repeat left top;"
													})
											.end()
											.find("li:has(ul)")
											.children("a")
											.css(
													{
														background : "url(../css/images/tree/pnode.png) no-repeat left top;"
													});
								}
								$(this)
										.css(
												{
													background : "url(css/images/pnode_open.png) no-repeat left top;"
												});
								return false;
							} else {
								$(this).next("ul").slideUp("normal");
								// 不用toggle()的原因是为了在收缩菜单的时候同时也将该菜单的下级菜单以后的所有元素都隐藏
								$(this)
										.css(
												{
													background : "url(../css/images/tree/pnode.png) no-repeat left top;"
												});
								$(this).next("ul").children("li").find("ul")
										.fadeOut("normal");
								$(this)
										.next("ul")
										.find("li:has(ul)")
										.children("a")
										.css(
												{
													background : "url(../css/images/tree/pnode.png) no-repeat left top;"
												});
								return false;
							}
						});
	}

});

$("#company_Name").click(function() {
	comsel("selcompany", "所属公司", "companyId", "companyName", 0);
})

$("#policyPro_Name").click(function() {
	comsel("selcity", "城市", "policyPro", "policyProName", 0);
})

function showCity(e) {
	var cityId = $(e).attr("value");
	// alert(cityId);
	/*
	 * $("#cityPidShow").val($(e).text()); $("#cityPid").val(cityId); cityPid =
	 * cityId; cityPidShow = $(e).text();
	 */
	var colmRequestDatass = {
		_mt : "hosfPolicy.getPolicyByTree",
		cityid : cityId
	};
	var payload = {
		data : colmRequestDatass,
		level : "UserLogin",
	};
	var data = encrypt(payload.level, payload.data);
	$("#jq_hosf_policy").setGridParam({
		postData : data
	}).trigger("reloadGrid", [ {
		page : 1
	} ]);
}