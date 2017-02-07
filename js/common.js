$(function(){ 
	/*当input框聚焦的时候改变文本框的颜色*/
	$("input").focus(function() {

	    $(this).css('border-color', '#0089dd');

	  }).focusout(function() {

	    $(this).css('border-color', '#ccc');

	  })
})

//判断两个code是否同时等于零
function getStatus(data) {
    return data.stat.code == "0" && data.stat.stateList["0"].code == "0" ? true
        : false;
}

/**
 * 公共部分错误码判断
 * @param data
 * @param errorDesc
 * @returns {Boolean}
 */
function commonStatus(data, errorDesc) {
	 var code = data.stat.stateList["0"].code;
    if (data.stat.code == "0" && code!="-100") {
        if (code != 0) {
            //判断dubbo访问问题
            eval("comAlert(" + errorDesc + "[" + code + "])");
            return false;
        } else {
            return true;
        }
    } else {
        //判断网关问题
        com_error(data);
    }
}
/*-------------下面三个是API请求需要的函数    华丽的分割线-----------------*/

/*
 * 
 * 返回的数据格式 _mt:网关服务的名字 _sig:签名 .......n多参数
 * 
 */
function encrypt(level, params) {
    /* 删除jqgrid中下一页的时候默认参数中包含上一次的_sig参数 */
    delete params._sig;
    // TODO 这里_vc 和 _aid 还有用么?!
    var s = "", keys = [];
    for (var k in params) {
        keys.push(k);
    }
    keys.sort();
    console.log(keys);
    for (var i = 0; i < keys.length; i++) {
        s = s + keys[i] + "=" + params[keys[i]];
    }
    s += getHash(level);
    console.log("显示加密的盐--" + s);
    params._sig = md5(s);
    return params;
}
/*
 * 
 * 返回的数据格式只有一下3个key
 * 
 * _mt:网关服务的名字 _sig:签名
 * data:参数组成的Json格式的字符串(例如：{"username":"admin","idCard":"34032119921001****","gender":"1","birthday":"1992-10-01"})
 * 
 * 
 */
function encryptNew(level, params) {

    /* 删除jqgrid中下一页的时候默认参数中包含上一次的_sig参数 */
    delete params._sig;
    delete params.data;

    param = {};
    param._mt = params._mt;
    delete params._mt;
    // 分页使用的条件数据
    param.rows = params.rows;
    delete params.rows;
    param.page = params.page;
    delete params.page;

    param.data = JSON.stringify(params);
    var s = "", keys = [];
    for (var k in param) {
        keys.push(k);
    }
    keys.sort();
    console.log(keys);
    for (var i = 0; i < keys.length; i++) {
        s = s + keys[i] + "=" + param[keys[i]];
    }
    s += getHash(level);
    console.log("显示加密的盐--" + s);
    param._sig = md5(s);
    return param;
}

// 获取key
function getHash(level) {
    var ut = this.getCookie("wtk");
    console.log("盐—" + ut);
    if (level === "None") {
        return "www.hrocloud.com";
    } else if (ut) {
        return ut;
    } else {
        return window.localStorage.getItem('CF_TOKEN');
    }
}

function serialize(obj, prefix) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(
                // typeof v === "object" ?
                // serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

// 获取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    } else {
        return null;
    }
}

// 存储cookie
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires="
        + exp.toGMTString() + '; path=/';
    // alert("serCookie is ok")
}

/*
 * 获取指定标签内的所有的表单参数 _mt:调用的服务名 id:所有的input，select标签的父节点的id
 */
function serach(_mt, id) {
    params = {};
    params["_mt"] = _mt;
    $('#' + id).find('input').each(
        function () {
            var obj = $(this);
            var id = obj.attr('id');
            var name = obj.attr('name');
            var type = obj.attr('type');
            var chec = obj.attr("checked")
            if (id) {
                if ("password" == $.trim(type)) {
                    params[id + ""] = md5(obj.val());

                    $("input[name='rd']:checked").val();
                } else if ("radio" == $.trim(type)
                    || "checkbox" == $.trim(type)) {
                    params[name + ""] = $(
                        "input[name=" + name + "]:checked").val();

                } else {
                    params[id + ""] = obj.val();
                }

            }
        });
    $('#' + id).find('select').each(function () {
        var obj = $(this);
        var id = obj.attr('id');
        if (id) {
            params[id + ""] = obj.val();
        }
    });

    $('#' + id).find('textarea').each(function () {
        var obj = $(this);
        var id = obj.attr('id');
        if (id) {
            params[id + ""] = obj.val();
        }
    });

    return params;
};

/*
 * 给修改页面的input框赋值 updateData: 获得的数据 id: 父节点的id 名字
 */
function setData(updateData, id) {
    // data = result.content["0"].value;
    // dataLine = updateData["0"]; //object
    lineJson = JSON.stringify(updateData);
    updateJson = eval('(' + lineJson + ')'); // Json
    // 获得key
    var updateKey = new Array();
    for (var o in updateJson) {
        updateKey.push(o);
    }
    ;
    $('#' + id).find('input').each(function () {
        var obj = $(this);
        var id = obj.attr('id');
        // 循环key,对应的input赋值
        for (var i = 0; i < updateKey.length; i++) {
            if (id == updateKey[i]) {
                obj.val(updateJson[updateKey[i]]);
                return;
            }
        }
    });
    $('#' + id).find('select').each(function () {
        var obj = $(this);
        var id = obj.attr('id');
        // 循环key,对应的input赋值
        for (var i = 0; i < updateKey.length; i++) {
            if (id == updateKey[i]) {
                obj.val(updateJson[updateKey[i]]);
                return;
            }
        }
    });
    $('#' + id).find('textarea').each(function () {
        var obj = $(this);
        var id = obj.attr('id');
        // 循环key,对应的input赋值
        for (var i = 0; i < updateKey.length; i++) {
            if (id == updateKey[i]) {
                obj.val(updateJson[updateKey[i]]);
                return;
            }
        }
    });

};

function getSelectDateType(id, type) {
    alert(1);
    /*
     * var datas = { _mt : "commparminfo.getparamlist", typecode: type };
     */
    var paramtypelist = ["datetype"];
    paramtypelist = JSON.stringify(paramtypelist);
    var datas = {
        _mt: "commparminfo.getparamlistgroup",
        paramtypelist: paramtypelist
    };
    data = encrypt("None", datas);
    console.log(data);
    $.ajax({
        type: "POST",
        url: pubsources.pub_getlink,
        // 取消异步请求
        async: false,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: serialize(data),
        success: function (result) {
            dataResult = result.content["0"].value;
            console.log(dataResult);
            var _arr = [];
            _arr.push("<option value='0'>请选择</option>")
            for (var o in dataResult) {
                _arr.push("<option value='" + dataResult[o].code + "'>"
                    + dataResult[o].desc + "</option>")
            }
            $("#" + id).html(_arr.join(""));
        },
        error: function () {
            alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
        }
    });
}

/**
 * 根据id和下拉框的类型加载下拉框的数据
 *
 * @param arr
 *            {"下拉框1id"："下拉框1的参数类型","下拉框2id"："下拉框2的参数类型"}
 */
function getSelectDataTypeList(arr, synchronize, callback) {
    idArr = new Array();
    typeArr = new Array();
    for (var a in arr) {
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
        _mt: "commparminfo.getparamlistgroup",
        paramtypelist: paramtypelist
    };
    data = encrypt("None", datas);
    console.log(data);
    $.ajax({
        type: "POST",
        url: pubsources.pub_getlink,
        dataType: "json",
        async: synchronize?false:true,
        xhrFields: {
            withCredentials: true
        },
        data: serialize(data),
        success: function (result) {
            dataResult = result.content["0"].value;
            console.log(dataResult);
            var _arr = [];
            // _arr.push("<option value='0'>请选择</option>")
            for (var o in dataResult) {
                _arr = [];
                _arr.push("<option value=''>--请选择--</option>");
                var obj = dataResult[o].paramList
                for (var i in obj) {

                    if (obj[i].code == "01draft") {
                        _arr.push("<option selected =selected value='" + obj[i].code + "'>"
                            + obj[i].desc + "</option>")
                    } else {
                        _arr.push("<option value='" + obj[i].code + "'>"
                            + obj[i].desc + "</option>")
                    }
                }
                $("#" + idArr[o]).html(_arr.join(""));
            }

            if (callback != undefined && callback != "" && callback != null)
                callback.call();

            return true;
        },
        error: function () {
            alert("抱歉，网络故障或服务器繁忙，请检查您的网络环境或稍后重试。");
        }
    });
}

/**
 * 系统通用错误码验证 保证网关没错,
 */
function com_error(rusult) {
    var com_error_code = rusult.stat.code;
    var statList_error_code = rusult.stat.stateList.length > 0 ? rusult.stat.stateList["0"].code
        : null;
    if (com_error_code != "0") {

        switch (com_error_code) {
            case -380:
            case -370:
                comAlert(error_code_desc[com_error_code] + ",请联系管理员");
                return false;
                break;
            case -360:
            case -340:
            case -320:
            case -300:
            case -161:
            case -164:
            case -180:
            case -162:
                comAlert(error_code_desc[com_error_code] + ",2秒后请重新登录");
                setCookie("wtk", "");
                window.setTimeout(reLogin, 2000);
            function reLogin() {
                window.location.href = "../index.html";
                return false;
            }

                break;
            default:
                comAlert(error_code_desc[com_error_code]);
                return false;
        }
    }

    if (statList_error_code == "-100") {
        comAlert(error_code_desc[statList_error_code]);
        return false;
    }
    return com_error_code == "0" && statList_error_code == "0" ? true : false;

}

/**
 * 提示错误信息
 * result : 网关返回的数据
 * magJson : 错误码对应描述的json名
 */
function alertMsg(result, msgJson) {
    var code = result.stat.stateList.length != 0 ? result.stat.stateList["0"].code
        : null;
    if (code == null) {
        return;
    }
    eval("comAlert(" + msgJson + "[" + code + "])");
}
