var serversname="http://server5.hrocloud.com:8099/api/v6";
var getSeltOption="payrollTax.getTableSelectvl";//获取select选项的接口  从公共表获取的都不需要改动，从其他表获取的暂无法公共处理
var None="None";//安全等级

//新增 保存按钮事件
function bn_addupSave(addtb_div,e){
	var pkid=$("#id").val();
	//根据id判断是新增方法还是修改方法
	if(pkid==""){
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.ininfointerface,addtb_div);
		//此处需要修改 调用新增方法
		addupPubInfo(requestData,None,e.data.gdid,addtb_div);
	}else{
		//此处需要修改 获取参数
		requestData=addupGetvlues(e.data.upinfointerface,addtb_div);
		//此处需要修改 调用修改方法
		addupPubInfo(requestData,None,e.data.gdid,addtb_div);
	}
   
};
function addinfo_Generatediv(e){
	if(e.data.bntype=="upd"){
		var r = $("#"+e.data.gdid).getGridParam('selrow');
		var pkid=$("#"+e.data.gdid).getCell(r,2);
		if(pkid==null){
			alert("请选择行操作");
			return;
		}
	}
	var gdid = e.data.seldiv;
	s=$("<DIV ID=\"form_"+gdid+"\" STYLE=\"overflow:auto;position:relative;left:0px;top:0px;\" CLASS=\"jqForm\" TITLE=\"新增信息\"><div id='"+gdid+"_addinfoarea'></div></DIV>");
	$("#"+e.data.bn_div).after(s);
	var btns = {
			'取消':function() {$(this).dialog('close');$("#touming").hide();},
			'保存':function() {bn_addupSave(gdid+"_addinfoarea",e);$(this).dialog('close');$("#touming").hide();}
		};
	$("#form_"+gdid).dialog({
		autoOpen: true,
		bgiframe: true,
		height: 600,
		width: 800,
		modal: true,
		resizable : false,
		buttons: btns,
		close: function(event, ui) {
			$("#form_"+gdid).remove();
			$("#touming").hide();
		}
	});
	
	
	var fieldquestData=e.data.fieldquestData;
	var addtb_div=e.data.addtb_div;
	var _mtnm=e.data._mtnm;
	var seldiv=e.data.seldiv;
	var payload = {
	    data: fieldquestData,
	    level: None,
	};
	var data = encrypt(payload.level, payload.data);
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
			var colnms = data[0].split(",");
			var colmdsJson= eval('('+  data[1]+ ')');
			getaddDivarea(addtb_div,colnms,colmdsJson,_mtnm,seldiv,e.data.bn_div);
			$("#touming").show();
			 
			gettableSelectval(e,pkid);
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
	}
	});
}

 
/*通用新增div内容拼接*/
/**
 * 
 * 注意 因为现在字段那块还没有提供接口所以这块后期需要修改：
 * type: 1文本框 2根据id选择 3下拉框 4checkbox框 5文本区域
 * 验证方式：0无需验证 1不能为空 2必须为数字
 */
function getaddDivarea(divid,colnms,colmdsJson,foridsel,seldivid,bn_div){
	$("#"+divid).html("");
	var _arr = [];
	for(var i=0;i<colmdsJson.length;i++){
		if(colmdsJson[i].name!="id"){
			if(i%2!=0){
				var rtStr=elementLayout(colmdsJson[i].type,colmdsJson[i].name,colnms[i],1,colmdsJson[i].selid,foridsel,colmdsJson[i].check,seldivid,bn_div);
				_arr.push(rtStr);
			}
			else{
				var rtStr=elementLayout(colmdsJson[i].type,colmdsJson[i].name,colnms[i],2,colmdsJson[i].selid,foridsel,colmdsJson[i].check,seldivid,bn_div);
				_arr.push(rtStr);
			}
			 
		}else{
			_arr.push('<input class="add_input"  type="hidden" value="" id="'+colmdsJson[i].name+'">');
		}
	}
	$("#"+divid).html(_arr.join(""));
}
function elementLayout(cltype,clcode,clname,lr,selid,foridsel,cktype,seldivid,bn_div){
	var ckStr="";
	if(cktype=="1"){
		ckStr="<em class='add_fwid_rd'>*</em>";
	}
	if(lr==1){
		if(cltype==1){
			return '<span class="add_lfspan" id="span_'+clcode+'">'+clname+'</span><input class="add_input" type="text" value="" id="'+clcode+'">'+ckStr;
		}else if(cltype==2){
			return '<span class="add_lfspan" id="span_'+clcode+'">'+clname+'</span><input class="add_input" type="hidden" id="'+clcode+'"><input name="'+selid+'" class="add_input_dis" type="text" readonly="true" id="dis_'+clcode+'">&nbsp;<span id="sp_rt_'+clcode+'" class="add_fwid" onclick="forSelId(\''+foridsel+'\','+selid+',\''+seldivid+'\',\''+clname+'\',\''+clcode+'\',\''+bn_div+'\')">...</span>'+ckStr;
		}else if(cltype==3){
			return '<span class="add_lfspan" id="span_'+clcode+'">'+clname+'</span><select class="add_select" id="'+clcode+'" name='+selid+'><option value="0">请选择</option></select>'+ckStr;
		}else if(cltype==4){
			return '<span class="add_lfspan" id="span_'+clcode+'">'+clname+'</span><input class="add_check" type="checkbox" id="'+clcode+'">'+ckStr;
		}else if(cltype==5){
			return '<span class="add_taxa_span" id="span_'+clcode+'">'+clname+'</span><textarea class="add_texa" value="" id="'+clcode+'"></textarea>'+ckStr;
		}
	}else{
		if(cltype==1){
			return '<span class="add_rtspan" id="span_'+clcode+'">'+clname+'</span><input class="add_input" type="text" value="" id="'+clcode+'">'+ckStr;
		}else if(cltype==2){
			return '<span class="add_rtspan" id="span_'+clcode+'">'+clname+'</span><input class="add_input" type="hidden" id="'+clcode+'"><input name="'+selid+'" class="add_input_dis" type="text" readonly="true" id="dis_'+clcode+'">&nbsp;<span id="sp_rt_'+clcode+'" class="add_fwid" onclick="forSelId(\''+foridsel+'\','+selid+',\''+seldivid+'\',\''+clname+'\',\''+clcode+'\',\''+bn_div+'\')">...</span>'+ckStr;
		}else if(cltype==3){
			return '<span class="add_rtspan" id="span_'+clcode+'">'+clname+'</span><select class="add_select" id="'+clcode+'" name='+selid+'><option value="0">请选择</option></select>'+ckStr;
		}else if(cltype==4){
			return '<span class="add_rtspan" id="span_'+clcode+'">'+clname+'</span><input class="add_check" type="checkbox" id="'+clcode+'">'+ckStr;
		}else if(cltype==5){
			return '<span class="add_taxa_span" id="span_'+clcode+'">'+clname+'</span><textarea class="add_texa" value="" id="'+clcode+'"></textarea>'+ckStr;
		}
	}
	
}

function addupGetvlues(_mt,id){
    params = {};
    params['_mt']= _mt;
       $('#'+id).find('.add_input').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           if(id){
        	   params[id]=obj.val();
           }
       });
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
       $('#'+id).find('.add_select').each(function(){
           var obj = $(this);
           var id =obj.attr('id');
           if(id){
        	   params[id]=obj.val();
           }
       });
       return params;
};
 
function  updatePosrSetval(e,pkid){
	var _mt=e.data.updinterface;
	var gdid=e.data.addtb_div;
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
                			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
                	}
                	});
                    //alert(vname);
                });
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
		}); 
}
//删除按钮事件
function bn_del_pub(e){
	var gdid=e.data.gdid,delinterface=e.data.delinterface;
	var rows = $("#"+gdid).getGridParam('selarrrow'),rl="";
	var dsum=0;
	$.each(rows, function(i,n){
		rl += $("#"+gdid).getCell(n,2) + ",";
		dsum=dsum+1;
	});
	if(rows.length >= 1) {rl=rl.substring(0,rl.length-1);}
	if(rl==""){
		alert("请选中数据后删除");
		return;
	}
	if(confirm("您确定删除选中的 "+dsum+" 条记录吗？")) {
		delDataInfo(gdid,delinterface,None,rl);
	}
}
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
				alert("删除成功");
				$("#"+jqname).trigger("reloadGrid", [{page:1}]);
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
		});
} 

//新增、修改数据的方法
function addupPubInfo(requestData, level,gdid,gddiv) {
    var payload = {
      data: requestData,
      level: level,
  };
  data = encrypt(payload.level, payload.data);
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
         },
         error : function() {
        	 alert("新增失败请稍后重试。");
         }
     });
}
/*获得select选项*/
function gettableSelectval(e,pkid) {
	var tbgdid=e.data.addtb_div;
	var selids=[],selcode=[];
	$('#'+tbgdid).find('.add_select').each(function(){
        var obj = $(this);
        var id =obj.attr('id'); 
        var name =obj.attr('name'); 
        selids.push(id);
        selcode.push(name);
    });
	if(selids==null && e.data.bntype=="add"){
		return;
	}else if(selids==null && e.data.bntype=="upd"){
		up_funcrev(e);
		return;
	}
	var clnrequestData = {_mt:getSeltOption,sidvls:selids};
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
				var selJson= eval('('+  data+ ')');
				for (var i = 0; i < selids.length; i++) {
					var vname=$("#"+selids[i]).attr("name");
					//清空select
					$("#"+selids[i]).empty();
					$("#"+selids[i]).append("<option value='0'>请选择</option>");//为Select追加一个Option(下拉项)
					for(var j=0;j<selJson.length;j++){
						 if(vname==selJson[j].nid){
							 $("#"+selids[i]).append("<option value='"+selJson[j].vid+"'>"+selJson[j].vstr+"</option>");
						 }
					}
				}
				if(e.data.bntype=="upd"){
					updatePosrSetval(e,pkid);
				}
			},
			error : function() {
				alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
		}
		});
}
/*根据id选择*/
function forSelId(_mt,selid,seldivid,clname,clcode,bn_div){
	var gdid = seldivid;
	s=$("<DIV ID=\"form_selid_"+gdid+"\" STYLE=\"overflow:auto;position:relative;left:0px;top:0px;\" CLASS=\"jqForm\" TITLE=\"根据id查询\">" +
	"<div id='"+gdid+"_add_menu_ht' class='add_menu_ht'><span id='"+gdid+"_add_menu_htnm'></span>" +
	"<div class='add_menu_hm'>"+
	"<div id='"+gdid+"_add_menu_hmd' class='add_menu_hmd'></div>"+
	"<table id='"+gdid+"_add_table'></table>"+
	"<div id='"+gdid+"_add_page'></div>"+
	"</div>"+
	"</DIV>");
	$("#"+bn_div).after(s);
	var btns = {
			'取消':function() {$(this).dialog('close');$("#touming2").hide();},
			'保存':function() {pub_add_ok(clcode,seldivid);}
		};
	$("#form_selid_"+gdid).dialog({
		autoOpen: true,
		bgiframe: true,
		height: 500,
		width: 600,
		modal: true,
		resizable : false,
		buttons: btns,
		close: function(event, ui) {
			$("#form_selid_"+gdid).remove();
			$("#touming2").hide();
		}
	});
	
	$("#touming2").show();
	//$("#"+seldivid+"_add_menu_h").show();
	//$("#"+seldivid+"_add_menu_htnm").html(clname);
	var bnrequestData = {_mt:_mt+".getForIdsel",selid:selid,userid:"1",seltype:"1"};
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
			disSelForidDivData(seldivid,_mt,data[0],data[1],selid,clcode);
		},
		error : function() {
			alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
	}
	});
}
/*根据id查询中 快捷查询功能*/
function seachbnonc(e){
	seachbnoncNext(e.data._mt,e.data.seldivid,e.data.selid);
}
function seachbnoncNext(_mt,seldivid,selid){
	var strVla=$("#"+seldivid+"_strVla").val();
	var strVlb=$("#"+seldivid+"_strVlb").val();
	var strVlc=$("#"+seldivid+"_strVlc").val();
	if(strVlb==undefined){strVlb=""};
	if(strVlc==undefined){strVlc=""};
	strVla=$.trim(strVla);
	strVlb=$.trim(strVlb);
	strVlc=$.trim(strVlc);
	
	//清空jqgrid中的数据
	$("#"+seldivid+"_add_table").jqGrid('clearGridData');
	var colmRequestDatas = {_mt:_mt+".getForIdselData",id:selid,strVla:strVla,strVlb:strVlb,strVlc:strVlc};
    var payload = {
       data: colmRequestDatas,
       level: None,
    };
    var data = encrypt(payload.level, payload.data);
    $("#"+seldivid+"_add_table").jqGrid('setGridParam',{  
        datatype:'json',  
        postData:serialize(data),
        page:1  
    }).trigger("reloadGrid"); 
}
function EnterPress(ez,_mt,seldivid,selid){
	var e = ez || window.event; 
	if(e.keyCode == 13){ 
		seachbnoncNext(_mt,seldivid,selid);
	} 
}
function disSelForidDivData(seldivid,_mt,colNames,colModel,selid,clcode){
	
	var colnms = colNames.split(",");
	var colmdsJson= eval('('+  colModel+ ')');
	//根据类型判断 快捷查询需要的类型
	var _arr=[];
	for(var i=1;i<colmdsJson.length;i++){
		var cntype=colmdsJson[i].type;//布局类型  文本域、checkbox 根据id选择不予处理
		var cnselid=colmdsJson[i].selid;//查询id
		var cnname=colmdsJson[i].name;//查询id
		if(cntype==1){
			_arr.push('&nbsp;<span class="search_forid_span">'+colnms[i]+'</span>&nbsp;&nbsp;<input class="search_forid_input" type="text" value="" id="'+seldivid+'_'+cnname+'" onkeypress="EnterPress(event,\''+_mt+'\',\''+seldivid+'\','+selid+')" >');
		}else if(cntype==2){
			//return '<span>'+colnms[i]+'</span><input type="hidden" id="'+cnname+'"><input name="'+cnselid+'" class="add_input_dis" type="text" readonly="true" id="dis_'+cnname+'">&nbsp;<span id="sp_rt_'+clcode+'" class="add_fwid" onclick="forSelId(\''+foridsel+'\','+selid+',\''+seldivid+'\',\''+clname+'\',\''+clcode+'\')">...</span>';
		}else if(cntype==3){
			_arr.push('&nbsp;<span class="search_forid_span">'+colnms[i]+'</span>&nbsp;&nbsp;<select class="search_forid_select" id="'+seldivid+'_'+cnname+'" name='+cnselid+'><option value="">请选择</option></select>');
		}
	}
	_arr.push('&nbsp;&nbsp;<input class="search_forid_btn" type="button" value="查询" id="'+seldivid+'_seachbn">');
	$("#"+seldivid+"_add_menu_hmd").html(_arr.join(""));
	$('#'+seldivid+'_seachbn em').unbind("click");
	$('#'+seldivid+'_seachbn').bind("click",{_mt:_mt,seldivid:seldivid,selid:selid},seachbnonc);
	
	//为根据id查询的快捷查询的下拉框 根据id选择赋值
	//获取select框的选项
	var selids=[],selcode=[];
	$("#"+seldivid+"_add_menu_hmd").find('.search_forid_select').each(function(){
        var obj = $(this);
        var id =obj.attr('id'); 
        var name =obj.attr('name'); 
        selids.push(id);
        selcode.push(name);
    });

	if(selids!=null){
		var clnrequestData = {_mt:getSeltOption,sidvls:selids};
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
					var selJson= eval('('+  data+ ')');
					for (var i = 0; i < selids.length; i++) {
						var vname=$("#"+selids[i]).attr("name");
						//清空select
						$("#"+selids[i]).empty();
						$("#"+selids[i]).append("<option value='0'>请选择</option>");//为Select追加一个Option(下拉项)
						for(var j=0;j<selJson.length;j++){
							 if(vname==selJson[j].nid){
								 $("#"+selids[i]).append("<option value='"+selJson[j].vid+"'>"+selJson[j].vstr+"</option>");
							 }
						}
					}
				},
				error : function() {
					alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
			}
			});
	}
	//清空jqgrid中的数据
	jQuery("#"+seldivid+"_add_table").GridUnload();
	$("#"+seldivid+"_add_table").jqGrid('clearGridData');
	var colmRequestData = {_mt:_mt+".getForIdselData",id:selid,strVla:"",strVlb:"",strVlc:""};
    var payload = {
       data: colmRequestData,
       level: None,
    };
    data = encrypt(payload.level, payload.data);
      $("#"+seldivid+"_add_table").jqGrid({
	  		url:serversname,
			datatype: "json",
			mtype: "POST",
			postData: serialize(data),
			colNames: colnms,
		   	colModel: colmdsJson,
		   	rowNum: 90,
		   	autowidth: false,
		   	shrinkToFit:false,
		   	rowList: [20,50],
		   	pager: "1",
		   	sortname: 'id',
		    viewrecords: true,
		    rownumbers: true,
		    rownumWidth: "30",
		    gridview: true, 
		    multiselect: false, 
		    sortorder: "desc",
		    height: 220,
		    width: 330,
	   	 	ondblClickRow: function() {
		   	 	var r = $("#"+seldivid+"_add_table").getGridParam('selrow');
		   		var pkid=$("#"+seldivid+"_add_table").getCell(r,1);
		   		var pkvl=$("#"+seldivid+"_add_table").getCell(r,2);
		   		if(pkid==null){
		   			alert("请选择一行记录");
		   			return;
		   		}else{
		   			addpub_vlset(pkid,pkvl,clcode,seldivid);
		   		}
			}
		}).navGrid("#pg_",{refresh: false, edit: false, add: false, del: false, search: false})
		.navButtonAdd("#pg_",{title:"refresh",caption:"",buttonicon:"ui-icon-refresh",
		onClickButton:function(){
		},position:"last"});
	    jQuery("#"+seldivid+"_add_table").setGridParam().hideCol("id").trigger("reloadGrid");
}
/*新增 修改  根据id选择确定 取消按钮*/
function pub_add_ok(clcode,seldivid){
	var r = $("#"+seldivid+"_add_table").getGridParam('selrow');
	var pkid=$("#"+seldivid+"_add_table").getCell(r,1);
	var pkvl=$("#"+seldivid+"_add_table").getCell(r,2);
	if(pkid==null){
		alert("请选择一行记录");
		return;
	}else{
		addpub_vlset(pkid,pkvl,clcode,seldivid);
	}
}
function addpub_vlset(pkid,pkvl,clcode,seldivid){
	$("#"+clcode).val(pkid);
	$("#dis_"+clcode).val(pkvl);
	$("#form_selid_"+seldivid).remove();
	$("#touming2").hide(); 
}
 