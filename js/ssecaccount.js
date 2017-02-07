$(function(){ 
var serversname="http://server5.hrocloud.com:8099/api/v6";//网关接口
var clnrequestData = {_mt:"payrollTax.getTableHead",userid:"5",stype:"1"};//获取表头接口
var bnrequestData = {_mt:"payrollTax.getTableHead",userid:"5",stype:"2"};//获取按钮列表的接口 
var fieldquestData = {_mt:"payrollTax.getTableHead",userid:"5",stype:"3"};//获取新增页面字段接口
var clmrequestData={_mt:"ssecaccount.BySsecAccountResp"};//获取数据的接口
var gdid="jq_ssec_account";//显示数据的div
var addtb_div="ssec_account_addinfoarea";//新增 修改 显示字段的div
var seldiv="ssec_account";//根据id查询的divid
var updinterface="ssecaccount.batchSelectInfoByid";//修改时根据id获取数据的接口
var upinfointerface="ssecaccount.updateInfoByid";//修改数据的接口
var ininfointerface="ssecaccount.insertInfo";//新增数据的接口
var dlinfointerface="ssecaccount.batchDeleteByid";//删除数据的接口
var _mtnm="ssecaccount";//根据id选择 框  获取jqGrid表头的街头前缀 后缀必须为 .getForIdsel
var bn_div="bn_ssec_account";//按钮div的id
var None="None";//安全等级
var bnsuffix="_ssecaccount";//按钮后缀
// 


/*--------加载表格------*/
//获取按钮
gettablebninfo(bnrequestData,bn_div, None);
function gettablebninfo(clnrequestData,bndivid, level) {
	var payload = {
		    data: clnrequestData,
		    level: level,
		};
		data = encrypt(payload.level, payload.data);
		$.ajax({
			type : "GET",
			url : serversname,
			crossDomain : true,
			dataType : "json",
			xhrFields : {
				withCredentials:true
			},
			data : serialize(data),
			success : function(result) {
				var data = result.content["0"].value;
				var bnnames = eval('('+  data[0]+ ')');
				//获取按钮信息
				getButtonInfo(bndivid,bnnames);
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
		});
}
/*拼接按钮模块div*/
function getButtonInfo(bndivid,bnnames){
	var _arr = [];
	for(var i=0;i<bnnames.length;i++){
		//此处需要修改  为了区分，按钮后缀改为自己的
		_arr.push('<input type="button" id="'+bnnames[i].code+bnsuffix+'" value="&nbsp;'+bnnames[i].name+'&nbsp;">&nbsp;');
	}
	$("#"+bndivid).html(_arr.join(""));
	//获取jqgrid数据
	gettableHead(clnrequestData);
} 
/*获得jqgrid表头*/
function gettableHead(clnrequestData) {
	var payload = {
	    data: clnrequestData,
	    level: None,
	};
	data = encrypt(payload.level, payload.data);
	$.ajax({
		type : "GET",
		url : serversname,
		crossDomain : true,
		dataType : "json",
		xhrFields : {
			withCredentials:true
		},
		data : serialize(data),
		success : function(result) {
			var data = result.content["0"].value;
			disjQgridTable(data[0],data[1]);
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
	}
	});
}

/*获取jqgrid数据*/
function disjQgridTable(colNames,colModel) {
	var colnms = colNames.split(",");
	var colmdsJson= eval('('+  colModel+ ')');
	  
	//清空jqgrid中的数据
	$('#'+gdid).jqGrid('clearGridData');
    var payload = {data: clmrequestData,level: None};
    var data = encrypt(payload.level, payload.data);
    
    $("#"+gdid).jqGrid({
  		url:serversname,
		datatype: "json",
		mtype: "POST",
		postData: serialize(data),
		colNames: colnms,
	   	colModel: colmdsJson,
	   	rowNum: 90,
	   	autowidth: false,
	   	shrinkToFit:false,
	   	rowList: [20,60,100],
	   	pager: "1",
	   	sortname: 'id',
	    viewrecords: true,
	    rownumbers: true,
	    rownumWidth: "30",
	    gridview: true, 
	    multiselect: true, 
	    sortorder: "desc",
	    height: 400,
	    width: 1000,
   	 	ondblClickRow: function(id) {
			 
		}
	}).navGrid("#pg_",{refresh: false, edit: false, add: false, del: false, search: false})
	.navButtonAdd("#pg_",{title:"refresh",caption:"",buttonicon:"ui-icon-refresh",
		onClickButton:function(){
			
		},position:"last"});
    jQuery("#"+gdid).setGridParam().hideCol("id").trigger("reloadGrid");
	//此处需要修改 此处注意 因为无法动态拼接方法，所以只能这样绑定 
	$("#bn_add"+bnsuffix).bind("click",{bntype:"add",fieldquestData:fieldquestData,addtb_div:addtb_div,_mtnm:_mtnm,seldiv:seldiv,gdid:gdid,ininfointerface:ininfointerface,bn_div:bn_div},addinfo_Generatediv);//新增方法名请改成自己的
	//此处需要修改 修改按钮 参数说明：jqgrid的id，修改标识，获取修改数据的接口，修改的div拼接页面的div，修改的div的外层id（用于显示隐藏界面）
	$("#bn_upd"+bnsuffix).bind("click",{bntype:"upd",fieldquestData:fieldquestData,addtb_div:addtb_div,_mtnm:_mtnm,seldiv:seldiv,gdid:gdid,upinfointerface:upinfointerface,updinterface:updinterface,bn_div:bn_div},addinfo_Generatediv);//新增方法名请改成自己的
	
	//此处需要修改 删除按钮  参数说明：jqgrid的id，删除数据接口
	$("#bn_del"+bnsuffix).bind("click",{gdid:gdid,delinterface:dlinfointerface},bn_del_pub);
 }
/*--------加载表格 end------*/

});