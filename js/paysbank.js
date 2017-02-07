$(function(){ 
/*--------加载表格------*/
//eddy
var clnrequestData = {_mt:"payrollTax.getTableHead",userid:"2",stype:"1"};//获取表头的通用接口，可参照这个方法写一个用着
var clmrequestData={_mt:"payrollBank.selectDataByBank"};//获取表格数据的方法
//参数说明：jqgrid的id，获取表头的接口，获取表数据的接口，新增div的id，按钮的div，根据id查询调用的接口模块名称,根据id查询的div id,安全级别
gettableHead("jq_pays_bank",clnrequestData,clmrequestData,"pays_bank_addinfoarea", "payrollTax","pays_bank","None");
var bnrequestData = {_mt:"payrollTax.getTableHead",userid:"2",stype:"2"};
//参数说明：获取按钮的接口，安全级别
gettablebninfo(bnrequestData,"bn_pays_bank", "None");
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
/*获取按钮模块div*/
function getButtonInfo(bndivid,bnnames){
	var _arr = [];
	for(var i=0;i<bnnames.length;i++){
		_arr.push('<input type="button" id="'+bnnames[i].code+'_paysbank" value="&nbsp;'+bnnames[i].name+'&nbsp;">&nbsp;');
	}
	$("#"+bndivid).html(_arr.join(""));
	//此处注意 因为无法动态拼接方法，所以只能这样绑定
	$("#bn_add_paysbank").bind("click",{},bn_add_paystax);
	$("#bn_upd_paysbank").bind("click",{gdid:"jq_pays_bank",bntype:"upd",updinterface:"payrollBank.selectDataByIds",updiv:"pays_bank_addinfoarea",updisdiv:"pays_bank_alldiv",getname:"payrollTax"},bn_upd_pub);
	$("#bn_del_paysbank").bind("click",{gdid:"jq_pays_bank",delinterface:"payrollBank.batchDeleteByid"},bn_del_pub);
	
}
//新增  按钮事件
function bn_add_paystax(){
	gettableSelectval("pays_bank_addinfoarea","add");
	$("#touming").show();
	removeInfoByadd();
	$("#pays_bank_alldiv").show();
}
function bn_addhide_paystax(){
	$("#touming").hide();
	$("#pays_bank_alldiv").hide();
	removeInfoByadd();
}
//新增、修改 取消按钮事件
$("#add_pays_bank_btncl").click(function(){
	bn_addhide_paystax();
});

//新增 修改 右上角X关闭按钮
$("#pays_bank_alldiv_t em").click(function(){
	bn_addhide_paystax();
});

//新增 保存按钮事件
$("#add_pays_bank_btnsv").click(function(){
	var pkid=$("#id").val();
	//根据id判断是新增方法还是修改方法
	if(pkid==""){
		//获取参数
		requestData=addupGetvlues("payrollBank.insertData","pays_bank_addinfoarea");
	    //调用新增方法
		addupPubInfo(requestData,"None","jq_pays_bank","pays_bank_alldiv");
	}else{
		//获取参数
		requestData=addupGetvlues("payrollBank.updateData","pays_bank_addinfoarea");
	    //调用新增方法
		addupPubInfo(requestData,"None","jq_pays_bank","pays_bank_alldiv");
	}
   
});


/*--------加载表格 end------*/

});