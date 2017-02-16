var serversname=pubsources.pub_getlink;
var getSeltOption="commparminfo.getparamlistgroup";//获取select选项的接口  从公共表获取的都不需要改动，从其他表获取的暂无法公共处理
var None="UserLogin";//安全等级
var pgoH = $("#rPane").height() - 175;//带跨界查询的三行高度
var pgoHn = $("#rPane").height() - 140;//普通高度
var pgoW = $("#rPane").width() - 40;//普通宽度
var pgoWTree = $("#rPane").width() - 240;//带树的页面
var dipgoH = 600;//主子表新增高度
var dipgoW = 1000;//主子表新增宽度
var dipgoHo = 500;///普通表新增高度
var dipgoWo = 900;//普通表新增宽度
var companyId=$("#tg_cur_company").val();

/*清空数据 新增、修改页面数据*/
function setaddupDivVlues(id){
     $('#'+id).find('.add_input').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         $("#"+id).val("");
     });
     $('#'+id).find('.add_inputdis').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         $("#"+id).val("");
     });
     $('#'+id).find('.add_texa').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         $("#"+id).val("");
     });
     $('#'+id).find('.add_check').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         $("#"+id).attr('checked')=="";
     });
     $('#'+id).find('.add_select').each(function(){
  	   var obj = $(this);
         var id =obj.attr('id'); 
         $("#"+id).val("0");
     });
}

/*获得select选项*/
function gettableSelectval(e,pkid) {
	var tbgdid=e.data.addgdid;
	var selids=[],selcode=[];
	$('#'+tbgdid).find('.add_select').each(function(){
        var obj = $(this);
        var id =obj.attr('id'); 
        var name =obj.attr('name');
        var k=0;
        for (var i = 0; i < selcode.length; i++) {
            if(selcode[i]==name){
            	k=1;
            }
        };
        selids.push(id);
        if(k==0){
            selcode.push(name);
        }
    });
	if((selids==null || selids=="") && e.data.bntype=="add"){
		return;
	}else if((selids==null || selids=="") && e.data.bntype=="upd"){
		updatePosrSetval(e,pkid);
		return;
	}else{
		var secodejs=JSON.stringify(selcode);
		var clnrequestData = {_mt:getSeltOption,paramtypelist:secodejs};
		var payload = {
			    data: clnrequestData,
			    level: "None",
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
					if(data!=undefined)
					{
						for (var i = 0; i < selids.length; i++) {
							var vname=$("#"+selids[i]).attr("name");
							//清空select
							$("#"+selids[i]).empty();
							$("#"+selids[i]).append("<option value='0'>--请选择--</option>");//为Select追加一个Option(下拉项)
							for(var j=0;j<data.length;j++){
								for (var k = 0; k < data[j].paramList.length; k++) {
									if(vname==data[j].typeCode){
										 $("#"+selids[i]).append("<option value='"+data[j].paramList[k].code+"'>"+data[j].paramList[k].desc+"</option>");
									}
								}
							}
						}
					}
					if(e.data.bntype=="upd"){
						updatePosrSetval(e,pkid);
					}
				},
				error : function() {
					comAlert(pubprompt.network_error);
			}
			});
	}
	
}

//新增、修改数据的方法
function addupPubInfo(requestData, level,gdid,gddiv) {
    var payload = {
      data: requestData,
      level: level,
  };
  data = encryptNew(payload.level, payload.data);
  console.log(data);
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
			$("#"+gdid).trigger("reloadGrid", [{page:1}]);
			//var data = result.content["0"].value;
			//lineJson = JSON.stringify(data[0]);
			//updateJson = eval('(' + lineJson + ')'); //Json
			/**var disVar="";
            for (var o in updateJson){
            	disVar=disVar+o+":'"+updateJson[o]+"',";
            };
            if(disVar.length>0){disVar=disVar.substring(0, disVar.length-1);}
            disVar="["+disVar+"]";
            var ids=getSledRowsId(gdid);
            dsJson = JSON.stringify(disVar);
           **/
			//alert(lineJson);
			//var idssss=getSledRowsId(gdid);
			//var rtre=$("#"+gdid).setRowData(7,{taxSpuplimit:"11"});
			//var id = $("#"+gdid).jqGrid('getGridParam','selrow');//根据点击行获得点击行的id（id为jsonReader: {id: "id" },）
	       // var rowData = $("#"+gdid).jqGrid("getRowData",id);//根据上面的id获得本行的所有数据
	       // var val= rowData.taxSpuplimit;
	        //alert(val);
			//jQuery("#jq_pays_tax").setCell(7, 'taxLowerlimit', '205');
			//$("#"+gdid).jqGrid('setRowData',idssss,{taxSpuplimit:11}); 
            
			//var row = eval('('+ rdata +')');
			//if(r) {
				//$("#"+gdid).setRowData(r,row);
			//}
			//else{
				//$("#"+gdid).addRowData(parseInt($("#"+gdid).getGridParam('records'))+1,row,'first');
			//}
			
         },
         error : function() {
        	 comAlert(pubprompt.todeal_failure);
         }
     });
}

/*去除前后空格*/
function Trim(str)
{ 
    return str.replace(/(^\s*)|(\s*$)/g, ""); 
}

//获取新增、修改页面数据
function addupGetvlues(_mt,id,pkid){
	var ckvl=0;
    params = {};
    params['_mt']= _mt;
    if(pkid!=null && pkid!=""){
    	 params['id']=pkid;
    }
    var comid=$("#tg_cur_company").val();
    params['companyId']=comid;
       $('#'+id).find('.add_input').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           var isck =obj.attr('isck');
           var tsvl=$("#"+id).val();
           if(isck && ckvl==0){
        	   var istl =obj.attr('titl');
        	   var ckAry = isck.split(',');
        	   
        	   for (var i = 0; i < ckAry.length; i++) {
        		   var cksub=ckAry[i];
        		   if(cksub==1 && ckvl==0){
        			   if(Trim(tsvl)==""){
        				   comAlert(istl+"不能为空");
        				   ckvl=1;
        			   }
        		   }
        		   if(cksub==2 && ckvl==0){
        			   if(isNaN(tsvl)){
        				   comAlert(istl+"必须输入数字类型的值");
        				   ckvl=1;
        			   }
        		   }
        		   if(cksub==3 && ckvl==0){
        			   var ckname =obj.attr('ckvl');
        			   if(!IsDate(tsvl)){
        				   comAlert(istl+"请输入正确日期格式");
        				   ckvl=1;
        			   }
        			   if(isNaN(tsvl)){
        				   if(ckname!=undefined && ckname!="" && ckvl==0){
            				   var cktl =$("#"+ckname).attr('titl');
            				   var cvls=$("#"+ckname).val();
            				   if(cvls>tsvl){
            					   comAlert(istl+"必须大于"+cktl);
            					   ckvl=1;   
            				   }
            			   }   
        			   }
        		   }
        		   
        	   }
           }
           if(id){
        	   if(tsvl!=""){params[id]=obj.val();}
           }
       });
       if(ckvl==1){return null;}
       $('#'+id).find('.add_texa').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           if(id){
        	   params[id]=obj.val();
           }
       });
       $('#'+id).find('.add_check').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           if(id){
        	  if($(obj).attr('checked')=="checked"){
        		  params[id]=1;
        	  }else{
        		  params[id]=0;
        	  }
           }
       });
       if(ckvl==1){return null;}
       $('#'+id).find('.add_select').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           var isck =obj.attr('isck');
           var tsvl=$("#"+id).val();
           if(isck && ckvl==0){
        	   var istl =obj.attr('titl');
        	   var ckAry = isck.split(',');
        	   
        	   for (var i = 0; i < ckAry.length; i++) {
        		   var cksub=ckAry[i];
        		   if(cksub==1 && ckvl==0){
        			   if(Trim(tsvl)=="" || Trim(tsvl)=="0"){
        				   comAlert(istl+"不能为空");
        				   ckvl=1;
        			   }
        		   }
        	   }
           }
           if(id){
        	   if(tsvl!="" && tsvl!="0"){params[id]=obj.val();}
           }
       });
       $('#'+id).find('.add_radio').each(function(){
    	   var obj = $(this);
           var id =obj.attr('name');
           var ravl=$("input[name='"+id+"']:checked").val();
           params[id]=ravl;
       });   
           
       if(ckvl==1){return null;}
       return params;
};
//日期格式判断
/**  

判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期  

*/  

function IsDate(mystring)   {  
  var   reg   =   /^(\d{4})-(\d{2})-(\d{2})$/;  
  var   str   =   mystring;  
  if   (str=="")   return   true;  
  if   (!reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31){
    return   false;  
    }  
    return   true;
}
//单表新增 保存按钮事件
function bn_addupSave(addtb_div,e,pkid,s){
	//根据id判断是新增方法还是修改方法
	if(pkid=="0"){
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.ininfointerface,addtb_div,pkid);
		//此处需要修改 调用新增方法
		if(requestData!=null){
			addupPubInfo(requestData,None,e.data.gdid,addtb_div);
			comAlert(pubprompt.ins_succ);
			$(s).remove();
			//$("#"+e.data.addgdid).dialog('close');
			$("#touming").hide();
		}
		
	}else{
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.upinfointerface,addtb_div,pkid);
		//此处需要修改 调用修改方法
		if(requestData!=null){
			addupPubInfo(requestData,None,e.data.gdid,addtb_div);
			comAlert(pubprompt.upd_succ);
			$(s).remove();
			//$("#"+e.data.addgdid).dialog('close');
			$("#touming").hide();
		}
	}
   
}
//主子表保存按钮
function bn_addupSave_mian(addtb_div,e,pkid){
	//根据id判断是新增方法还是修改方法
	if(pkid=="0"){
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.ininfointerface,addtb_div,pkid);
		//此处需要修改 调用新增方法
		if(requestData!=null){
			addupPubInfo(requestData,None,e.data.gdid,addtb_div);
			comAlert(pubprompt.ins_succ);
			//$(s).remove();
			$("#"+e.data.addgdid).dialog('close');
			$("#"+addtb_div).dialog('close');
			$("#touming").hide();
		}
		
	}else{
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.upinfointerface,addtb_div,pkid);
		//此处需要修改 调用修改方法
		if(requestData!=null){
			addupPubInfo(requestData,None,e.data.gdid,addtb_div);
			comAlert(pubprompt.upd_succ);
			$("#"+e.data.addgdid).dialog('close');
			$("#"+addtb_div).dialog('close');
			$("#touming").hide();
		}
	}
   
}
//主子表新增 保存按钮事件
function bn_addupSave_main(addtb_div,e,pkstr){
	var pkid=$("#"+pkstr).val();
	//根据id判断是新增方法还是修改方法
	if(pkid=="0"){
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.ininfointerface,addtb_div,pkid);
		//此处需要修改 调用新增方法
		if(requestData!=null){
			addupPubInfo_main(requestData,None,e.data.gdid,addtb_div,pkstr,1);
			return 1;
			//$("#"+e.data.addgdid).dialog('close');$("#touming").hide();
		}else{return 0;}
		
	}else{
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.upinfointerface,addtb_div,pkid);
		//此处需要修改 调用修改方法
		if(requestData!=null){
			addupPubInfo_main(requestData,None,e.data.gdid,addtb_div,pkstr,2);
			return 1;
			//$("#"+e.data.addgdid).dialog('close');$("#touming").hide();
		}else{return 0;}
	}
   
}
//主子表新增的方法
function addupPubInfo_main(requestData, level,gdid,gddiv,pkstr,optype) {
	var disInfo="新增";
	if(optype==2){
		disInfo="修改";
	}
    var payload = {
      data: requestData,
      level: level,
  };
  data = encryptNew(payload.level, payload.data);
  console.log(data);
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
			if(data){
				if(optype==1){
					$("#"+pkstr).val(data+"");
				}
				comAlert(disInfo+"成功");
			}
			$("#"+gdid).trigger("reloadGrid", [{page:1}]);
         },
         error : function() {
        	 comAlert(pubprompt.todeal_failure);
         }
     });
}
function  updatePosrSetval(e,pkid){
	var _mt=e.data.updinterface;
	var gdid=e.data.addgdid;
	var getname=e.data._mtnm;
	var clnrequestData = {_mt:_mt,selIds:pkid};
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
				lineJson = JSON.stringify(data[0]);
                updateJson = eval('(' + lineJson + ')'); //Json
                //获得key
                var updateKey=new Array();
                for (var o in updateJson){
                        updateKey.push(o);
                };
                $('#'+gdid).find('.add_input').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id');
                    for(var i=0;i<updateKey.length;i++){
                        if(id == updateKey[i]){
                            obj.val(updateJson[updateKey[i]]);
                            return;
                        }
                     }
                });
                $('#'+gdid).find('.add_inputdis').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id');
                    for(var i=0;i<updateKey.length;i++){
                        if(id == updateKey[i]){
                            obj.val(updateJson[updateKey[i]]);
                            return;
                        }
                     }
                });
                $('#'+gdid).find('.add_texa').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id');
                    for(var i=0;i<updateKey.length;i++){
                        if(id == updateKey[i]){
                            obj.val(updateJson[updateKey[i]]);
                            return;
                        }
                     }
                });
                $('#'+gdid).find('.add_check').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id'); 
                    for(var i=0;i<updateKey.length;i++){
                        if(id == updateKey[i]){
                        	if(updateJson[updateKey[i]]==1){
                        		$("#"+id).attr("checked", true);
                        	}else{
                        		$("#"+id).attr("checked", false);
                        	}
                            return;
                        }
                     }
                });
                $('#'+gdid).find('.add_select').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id'); 
                    for(var i=0;i<updateKey.length;i++){
                        if(id == updateKey[i]){
                        	obj.val(updateJson[updateKey[i]]);
                            return;
                        }
                     }
                });
                $('#'+gdid).find('.add_input_dis').each(function(){
                    var obj = $(this);
                    var id =obj.attr('id');
                    var idhd=id.substring(4);
                    var idvl=$("#"+idhd).val();
                    var vname=$("#"+id).attr("name");
                    //根据id查出名称
                    var bnrequestData = {_mt:getname+".getForIdselName",selId:vname,userId:"1",selVal:idvl};
                	var payload = {
                		data: bnrequestData,
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
                			$("#"+id).val(data);
                		},
                		error : function() {
                			comAlert(pubprompt.network_error);
                	}
                	});
                    //alert(vname);
                });
			},
			error : function() {
				comAlert(pubprompt.network_error);
		}
		}); 
}
/*删除数据*/
function delDataInfo(jqname,delrequestData,level,pkids) {
	var requestData={_mt:delrequestData,delIds:pkids};
	var payload = {
		    data: requestData,
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
				comAlert(pubprompt.del_succ);
				$("#"+jqname).trigger("reloadGrid", [{page:1}]);
			},
			error : function() {
				comAlert(pubprompt.network_error);
			}
		});
}
function getSledRows(gdid){
	var rows = $("#"+gdid).getGridParam('selarrrow'),rl="";
	$.each(rows, function(i,n){
		rl += $("#"+gdid).getCell(n,2) + ",";
	});
	if(rows.length >= 1) {rl=rl.substring(0,rl.length-1);}
	return rl;
}
function getSledRowsId(gdid){
	var rows = $("#"+gdid).getGridParam('selarrrow'),rl="";
	$.each(rows, function(i,n){
		rl += $("#"+gdid).getCell(n,0) + ",";
	});
	if(rows.length >= 1) {rl=rl.substring(0,rl.length-1);}
	return rl;
}
function getSledRowsNumber(gdid){
	var rows = $("#"+gdid).getGridParam('selarrrow'),rl=0;
	$.each(rows, function(i,n){
		rl = rl+1;
	});
	if(rl>1){
		comAlert(upd_onedata);
		return true;
	}else{return false;}
}
function getSledRowsNumb(gdid){
	var rows = $("#"+gdid).getGridParam('selarrrow'),rl=0;
	$.each(rows, function(i,n){
		rl = rl+1;
	});
	return rl;
}
function getAddOrUp(pkid,disStr){
	if(pkid=="0"){
		return "新增"+disStr;
	}else{
		return "修改"+disStr;
	}
}
//Tips info.
/*function comAlert(ct){
	s = $("<DIV ID=\"sys_notes\" style=\"text-align:center;padding-top:30px;\">" + ct + "</DIV>");
	$(s).dialog({
		autoOpen: true,
		closeOnEscape: true,
		bgiframe: true,
		title: '系统提示:',
		height: 200,
		width: 300,
		zindex:100,
		resizable : false,
		modal: true,
		buttons:{
			"确定" : function(){ $(this).remove(); }
		},
		close: function() {
			$(this).remove();
		}
	});
}*/
/* 设置元素不可编辑*/
function setElementEeadonly(tbgdid) {
	$('#' + tbgdid).find('.add_input').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#"+id).attr("readonly","readonly");
	});
	$('#' + tbgdid).find('.add_select').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#"+id).attr("disabled","disabled");
	});
	$('#' + tbgdid).find('.add_check').each(function() {
		var obj = $(this);
		var id = obj.attr('id');
		$("#"+id).attr("disabled","disabled");
	});
     $('#'+tbgdid).find('.add_texa').each(function(){
    	 var obj = $(this);
 		var id = obj.attr('id');
 		$("#"+id).attr("readonly","readonly");
     });
     $('#'+tbgdid).find('.add_inputdis').each(function(){
		 var obj = $(this);
		 var id = obj.attr('id');
		 $("#"+id).attr("readonly","readonly");
     });
}
function reloadGridData(colmRequestDatas,tbgdid,pageid){
	$("#"+tbgdid).jqGrid('clearGridData');
    var payload = {
       data: colmRequestDatas,
       level: None,
    };
    var data = encrypt(payload.level, payload.data);
     
    $("#"+tbgdid).jqGrid('setGridParam',{  
        datatype:'json',  
        postData: data,
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
			/*content中的响应*/
			root : "rows",//表格中的数据
			page : "page",//当前页码
			total : "total",//总页数
			records : "records"//总行数
		},
	   	pager : pageid,
    }).trigger("reloadGrid"); 
}
function comselPayssec(selobject) {
	var url = "";
	if (selobject.seltype == "selnode") {
		url = "../comsel/selnode.html";
	} else if (selobject.seltype == "selcompany") {
		url = "../comsel/selcompany.html";
	} else if (selobject.seltype == "selcity") {
		url = "../comsel/selcity.html";
	} else if (selobject.seltype == "seluser") {
		url = "../comsel/selbinduser.html";
	} else if (selobject.seltype == "selperiod") {
		url = "../comsel/selperiod.html";
	} else if (selobject.seltype == "selorg") {
		url = "../comsel/selorg.html";
	} else if (selobject.seltype == "selrole") {
		url = "../comsel/selrole.html";
	} else if (selobject.seltype == "selhroperiod") {
		url = "../comsel/selhroperiod.html";
	} else if (selobject.seltype == "selopencity") {
		url = "../comsel/selopencity.html";
	}else if (selobject.seltype == "selpaytp") {
		url = "../comsel/selfmatinfo.html";
	}else if (selobject.seltype == "seltemle") {
		url = "../comsel/seltemplate.html";
	}
	var s = $("<DIV ID=\"com_sel_" + selobject.seltype + "\" flparams=\""+selobject.flparams+"\" flparamvs=\""+selobject.flparamvs+"\"></DIV>");
	$(s).load(url + "?tsid=" + new Date().getTime()).dialog({
		autoOpen : true,
		closeOnEscape : true,
		bgiframe : true,
		title : selobject.seltitle,
		height : 460,
		width : 680,
		zindex : 100,
		resizable : false,
		modal : true,
		buttons : {
			"确定" : function() {
				var gridobj = $(this).find("table[id^='tb_com_sel']");
				if (gridobj.length > 0) {
					var selrows = $(gridobj).getGridParam("selrow");
					if (selrows) {
						$("#" + selobject.rtnvalobj).val(selrows);
						var rowData = $(gridobj).getRowData(selrows), s = 0;
						$.each(rowData, function(c_name, c_value) {
							// alert(selrows+" "+c_name+" "+c_value);
							if (selobject.rtndisobj != "" && s == selobject.discol) {
								$("#" + selobject.rtndisobj).val(c_value);
							}
							s++;
						});
						if(selobject.vlck){
							$("#"+selobject.vlck).val("");
							$("#"+selobject.vlck+"Dis").val("");
						}
						$(this).dialog("close");
					} else {
						comAlert(pubprompt.pub_sel_plsselrecord);
					}
				}
			},
			"取消" : function() {
				$(this).dialog("close");
			}
		},
		close : function(event, ui) {
			$(this).remove();
		}
	});
};
function customDictionary() {
    this.data = new Array();
    this.put = function (key, value) {
        this.data[key] = value;
    };
    this.get = function (key) {
        return this.data[key];
    };
    this.remove = function (key) {
        this.data[key] = null;
    };
    this.isEmpty = function () {
        return this.data.length == 0;
    };
    this.size = function () {
        return this.data.length;
    };
}
function ckValuesIsup(ary,gdid){
	 var isup=0;
	 $('#'+gdid).find('.add_input').each(function(){
         var obj = $(this);
         var id =obj.attr('id');
         if(ary.get(id)!=obj.val()){
        	 isup=1;
        	 return isup;
         }
     });
     if(isup==1){return isup;}
     $('#'+gdid).find('.add_texa').each(function(){
         var obj = $(this);
         var id =obj.attr('id');
         if(ary.get(id)!=obj.val()){
        	 isup=1;
        	 return isup;
         }
     });
     if(isup==1){return isup;}
     $('#'+gdid).find('.add_check').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         var vl=0;
         if($(obj).attr('checked')=="checked"){
        	 vl=1;
         }
         if(ary.get(id)!=vl){
        	 isup=1;
        	 return isup;
         }
     });
     if(isup==1){return isup;}
     $('#'+gdid).find('.add_select').each(function(){
         var obj = $(this);
         var id =obj.attr('id'); 
         if(ary.get(id)!=obj.val()){
        	 isup=1;
        	 return isup;
         }
     });
     if(isup==1){return isup;}
     $('#'+gdid).find('.add_radio').each(function(){
         var obj = $(this);
         var name =obj.attr('name'); 
         var vl=$("input[name='"+name+"']:checked").val();
         if(ary.get(name)!=vl){
        	 isup=1;
        	 return isup;
         }
     });
     return isup;
}
function ckValuesUpset(gdid){
	ary=new customDictionary();
	 $('#'+gdid).find('.add_input').each(function(){
        var obj = $(this);
        var id =obj.attr('id');
        ary.put(id,obj.val());
    });
    $('#'+gdid).find('.add_texa').each(function(){
        var obj = $(this);
        var id =obj.attr('id');
        ary.put(id,obj.val());
    });
    $('#'+gdid).find('.add_check').each(function(){
        var obj = $(this);
        var id =obj.attr('id'); 
        if($(obj).attr('checked')=="checked"){
        	ary.put(id,1);
        }
        else{
        	ary.put(id,0);
        }
    });
    $('#'+gdid).find('.add_select').each(function(){
        var obj = $(this);
        var id =obj.attr('id'); 
        ary.put(id,obj.val());
    });
    $('#'+gdid).find('.add_radio').each(function(){
        var obj = $(this);
        var name =obj.attr('name'); 
        var vl=$("input[name='"+name+"']:checked").val();
        ary.put(name,vl);
    });
    return ary;
}