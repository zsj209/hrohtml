
var cityPid=1000;
var cityPidShow="全国省市";
$(function(){ 
	//省市区获取树结构
	var treeparams = {_mt:"commoncity.queryTreeCityList",companyId:$("#tg_cur_company").val()};
	getInfo_comm_treeCity(treeparams, "UserLogin");
	$("#tp_city_refresh").bind("click",tp_city_refresh);

});

function tp_city_refresh(){
	//省市区获取树结构
	var treeparams = {_mt:"commoncity.queryTreeCityList",companyId:$("#tg_cur_company").val()};
	getInfo_comm_treeCity(treeparams, "UserLogin");
}
//获取左边树的结构
/***
 * 获取左边城市类别
 */
function getInfo_comm_treeCity(requestData, level){
	var payload = {
	          data: requestData,
	          level: level,
	      };
	      data = encrypt(payload.level, payload.data);
	      console.log(data);
	         $.ajax({
	             type : "GET",
	             url : pubsources.pub_getlink,
	             crossDomain : true,
	             dataType : "json",
	             xhrFields : {
	                     withCredentials:true
	             },
	             data : serialize(data),
	             success : function(result) {
	               //给修改页面的input框赋值
	                data = result.content["0"].value;
	              //  alert(data[0].id)
	                var _arr=[];
	    			_arr.push('<ul>');/**/
	    			for(var o in data){
	    				var data2=data[o].list;
	    				if(data2!=""){
	    					_arr.push('<li class="pnodes jqTreepnode sshows" style="background:none;border:0;padding:0;">');/**/
			    			_arr.push('<a class="cityTrees" snames="'+data[0].cityName+'" href="javascript:void(0)" onclick="showCity(this)" sid="'+data[0].id+'" gdid="1" fun="1603" value="'+data[0].id+'" gid="1" ><div class="treeLevel"><div class="treebackground" style="padding-left:0;">'+data[0].cityName+'</div></div></a>');
			    			
	    				}else{
	    					_arr.push('<li class=" sshows">');
    						_arr.push('<a class="cityTrees" snames="'+data[0].cityName+'" href="javascript:void(0)" onclick="showCity(this)" sid="'+data[0].id+'" gdid="1" fun="1603" value="'+data[0].id+'" gid="1" ><div class="pnodestates"><div class="treebackground" style="">'+data[0].cityName+'</div></div></a>');
	    				}
		    			_arr.push('<ul class="jqTree child" >');
		    			for(var i in data2){
		    				var data3=data2[i].list;
		    				if(data3!=""){
		    					_arr.push('<li class="sshows">');
			    				_arr.push('<a  href="javascript:void(0)" class="cityTrees"   snames="'+data2[i].cityName+'" fun="1395" value="'+data2[i].id+'" sid="'+data2[i].id+'" gid="1" gdid="1" onclick="showCity(this)"><div class="treeLevel"><div class="treebackground">'+data2[i].cityName+'</div></div></a>');
		    				}else{
		    					_arr.push('<li class=" sshows">');
	    						_arr.push('<a  href="javascript:void(0)" class="" fun="1765" snames="'+data2[i].cityName+'" onclick="showCity(this)" gid="1" sid="'+data2[i].id+'" value="'+data2[i].id+'" gid="1395"><div class="pnodestates"><div class="treebackground" style="">'+data2[i].cityName+'</div></div></a>');
		    				}
		    			
		    				_arr.push('<ul class="jqTree child" >');
		    				
		    				if(data3!=""){
		    					for(var j in data3){
		    						var data4=data3[j].list;
		    						if(data4!=""){
		    							_arr.push('<li class="sshows"  >');
				    					_arr.push('<a  href="javascript:void(0)" class="cityTrees"  snames="'+data3[j].cityName+'"  fun="1429" value="'+data3[j].id+'" sid="'+data3[j].id+'" gid="1" gid="1603" onclick="showCity(this)"  ><div class="treeLevel"><div class="treebackground" style="">'+data3[j].cityName+'</div></div></a>');
				    					
		    						}else{
		    							_arr.push('<li class=" sshows">');
			    						_arr.push('<a  href="javascript:void(0)" class="" fun="1765" snames="'+data3[j].cityName+'" onclick="showCity(this)" gid="1" sid="'+data3[j].id+'" value="'+data3[j].id+'" gid="1395"><div class="pnodestates"><div class="treebackground" style="">'+data3[j].cityName+'</div></div></a>');
		    						}
			    					_arr.push('<ul class="jqTree child" >');
			    					
			    					if(data3!=""){
			    						for(var k in data4){
				    						_arr.push('<li class=" sshows">');
				    						_arr.push('<a  href="javascript:void(0)" class="" fun="1765" snames="'+data4[k].cityName+'" onclick="showCity(this)" gid="1" sid="'+data4[k].id+'" value="'+data4[k].id+'" gid="1395"><div class="pnodestates"><div class="treebackground" style="">'+data4[k].cityName+'</div></div></a>');
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
	              
	                $("#tree_city_list").html(_arr.join(""));
	                treeList();
	             },
	             error : function() {
	                     alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
	             }
	     });
}


function showCity(e){
	var cityId=$(e).attr("sid");
	$('.treebackground').each(function() {
		$(this).removeClass("sclick");
	});
	cityPid=$(e).attr("value");
	$(e).children("div").children("div").addClass("sclick");
	cityPidShow=$(e).attr("snames");
		var colmRequestDatass = {_mt:"commoncity.selectAllCityListByColumn",id:cityId,types:1,cityPid:"",cityName:""};
	    var payload = {
	       data: colmRequestDatass,
	       level: "UserLogin",
	    };
	    var data = encrypt(payload.level, payload.data);
	    $("#jq_comm_city").setGridParam({postData:data}).trigger("reloadGrid", [{page:1}]);
}
function treeList(){
	$("#tree_city_list ul li").children("ul").hide();
	$("#tree_city_list").find("li").not(":has(ul)").children("a").css(
		{
			textDecoration : "none",
			color : "#333",
			background : "none"
		}).click(
		function() {
			$(this).get(0).location.href = "'"
					+ $(this).attr("href") + "'";
			});
	$("#tree_city_list")
		.find("li:has(ul)")
		.children("a")
		.addClass("pnode_closes").removeClass("pnode_opens")
		.click(
				function() {
					//alert($(this).css("background"))
					if ($(this).next("ul")
							.is(":hidden")) {
						$(this).next("ul").show();//slideDown("fast");
						if ($(this).parent("li")
								.siblings("li")
								.children("ul").is(
										":visible")) {
							$(this).parent("li")
									.siblings("li")
									.find("ul")
									.hide();//slideUp("fast");
							$(this)
									.parent("li")
									.siblings(
											"li:has(ul)")
									.children("a")
									.addClass("pnode_closes")
									.removeClass("pnode_opens")
									.end()
									.find("li:has(ul)")
									.children("a")
									.addClass("pnode_closes")
									.removeClass("pnode_opens");
									
						}
						$(this).addClass("pnode_opens").removeClass("pnode_closes");
						return false;
					} else {
						$(this).next("ul").hide();//slideUp("fast");
						//不用toggle()的原因是为了在收缩菜单的时候同时也将该菜单的下级菜单以后的所有元素都隐藏
						$(this).addClass("pnode_closes").removeClass("pnode_opens");
						$(this).next("ul").children(
								"li").find("ul")
								.hide();//fadeOut("10");
						$(this)
								.next("ul")
								.find("li:has(ul)")
								.children("a").addClass("pnode_closes").removeClass("pnode_opens");
						return false;
					}
				});
}