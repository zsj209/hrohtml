$(function() {
	var serversname = pubsources.pub_getlink;// 网关接口
	var clmrequestData = {
		_mt : "attachment.getAttachmentByPage"
	};// 获取数据的接口
	var gdid = "jq_comp_attachment";// 显示数据的div
	var addgdid = "form_jq_comp_attachment";// 新增 修改 显示数据的div
	// var addtb_div="pays_tax_addinfoarea";//新增 修改 显示字段的div
	var seldiv = "comp_attachment";// 根据id查询的divid
	var updinterface = "attachment.selectById";// 修改时根据id获取数据的接口
	var upinfointerface = "attachment.addorupdate";// 修改数据的接口
	var ininfointerface = "attachment.addorupdate";// 新增数据的接口
	var dlinfointerface = "attachment.deleteBatchById";// 批量删除接口
	var bn_div = "bn_comp_attachment";// 按钮div的id
	var None = "UserLogin";// 安全等级
	var bnsuffix = "_compcontacts";// 按钮后缀
	var pageid = "#page_comp_contacts";// 分页div

	/*--------加载表格------*/
	// 获取按钮
	gettablebninfo(bn_div, None);
	function gettablebninfo(bndivid, level) {
		// $("#jq_pays_fmatpro_addinfoarea").html("<input class='add_input'
		// type='text' id='fmatproDataitem' isck='1' titl='数据项' isck='1'>");
		var bnnames = eval("([{code:'bn_add',name:'新增'},{code:'bn_upd',name:'修改'},{code:'bn_del',name:'删除'}])");
		// 获取按钮信息
		getButtonInfo(bndivid, bnnames);
	}

	/* 拼接按钮模块div */
	function getButtonInfo(bndivid, bnnames) {
		var _arr = [];
		for (var i = 0; i < bnnames.length; i++) {
			// 此处需要修改 为了区分，按钮后缀改为自己的
			_arr.push('<input type="button" id="' + bnnames[i].code + bnsuffix
					+ '" value="&nbsp;' + bnnames[i].name + '&nbsp;">&nbsp;');
		}
		$("#" + bndivid).html(_arr.join(""));
		// 获取jqgrid数据
		gettableHead();
	}
	/* 获得jqgrid表头 */
	function gettableHead() {
		var data = [];
		data.push("id,证件编码,证件名称,附件标记");
		data.push("[{name:'id'},{name:'attCoding',width:'100'}"
				+ ",{name:'attName',width:'100'}"
				+ ",{name:'attSignDesc',width:'100'}]");
		disjQgridTable(data[0], data[1]);
	}

	/* 获取jqgrid数据 */
	function disjQgridTable(colNames, colModel) {
		var colnms = colNames.split(",");
		var colmdsJson = eval('(' + colModel + ')');

		// 清空jqgrid中的数据
		$('#' + gdid).jqGrid('clearGridData');
		var pidvl = $("#jq_lf_company_pid").val();
		var payload = {
			data : {
				_mt : "attachment.selectByCompanyId",
				compid : pidvl
			},
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
			rowNum : 10,
			forceFit : true,
			rownumbers : true,
			autowidth : false,
			shrinkToFit : false,
			rowList : [ 10, 60, 100 ],
			pager : pageid,
			sortname : 'id',
			viewrecords : true,
			rownumbers : true,
			rownumWidth : "30",
			gridview : true,
			multiselect : true,
			sortorder : "desc",
			height : 300,
			width : 600,
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
			bn_div : bn_div
		}, addinfo_compattachment);// 新增方法名请改成自己的
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
		}, addinfo_compattachment);// 新增方法名请改成自己的

		// 此处需要修改 删除按钮 参数说明：jqgrid的id，删除数据接口
		$("#bn_del" + bnsuffix).bind("click", {
			gdid : gdid,
			delinterface : dlinfointerface
		}, bn_del_compcontacts);
	}
	/*--------加载表格 end------*/

	/*
	 * 新增方法
	 */
	function addinfo_compattachment(e) {

		var pkid = "0";
		if (e.data.bntype == "upd") {
			var r = $("#" + e.data.gdid).getGridParam('selrow');
			pkid = $("#" + e.data.gdid).getCell(r, 2);
			if (pkid == null) {
				alert("请选择行操作");
				return;
			}
		}

		setaddupDivVlues(addgdid);
		var pidvl = $("#jq_lf_company_pid").val();

		$("#companyId").val(pidvl);
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
				bn_addupSave(gdid + "_addinfoarea", e, pkid);
			}
		};

		$("#" + e.data.addgdid).dialog({
			autoOpen : true,
			bgiframe : true,
			height : 500,
			width : 800,
			modal : true,
			resizable : false,
			buttons : btns,
			close : function(event, ui) {
				$(this).dialog('close');
				$("#touming").hide();
			}
		});

		/**
		 * var s = $("<DIV ID=\"cccccccccccccc\" TITLE=\"修改用户\"></DIV>");
		 * $("#form_jq_pays_fmatpro").append(s);
		 * $("#cccccccccccccc").load("../payroll/payfmatproadd.html").dialog({
		 * autoOpen: true, bgiframe: true, height: 500, width: 800, modal: true,
		 * resizable : false, buttons: btns, close: function(event, ui) {
		 * $("#cccccccccccccc").remove(); $("#touming").hide(); },
		 * open:function(){ } });
		 */
		gettableSelectval(e, pkid);
		// 显示透明层
		$("#touming").show();
	}

	function bn_del_compcontacts(e) {
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

});