/**
 * Created by hyj on 2016/8/19.
 */




import React,  {
    Component,
    PropTypes
    }from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import Sport from "./../sport/Sport";
import './custom3.css';

var debug = true;
var basic_address = getRelativeURL()+"/";
var request_head= basic_address+"request.php";
var device_id = getWechatScope();
var warning_level;
var alarm_level;
var current_cycle = 5000;
var history_cycle = 60000;
var history_list =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var chart_height = 100;
var chart_width = 200;
var last_data=0;
var count_times=0;
var average=0;
var chart_series;
var app_handle;

var wechat_appid="wxf2150c4d2941b2ab";
var wechat_secretid = "ab95997f454e04b77911c18d09807831"
var wechat_auth_url= "https://api.weixin.qq.com/sns/oauth2/access_token?appid="+wechat_appid+"&secret="+wechat_secretid+"&code=";
var wechat_auth_url_tail = "&grant_type=authorization_code";
var wechat_openid = "test";
//var Icon = require('react-font-awesome').Icon;
class App extends Component{


    updatecurrent(data){
        this.refs.sportHandle.updatecurrent(data);
    }
    updatealarm(warning,alarm){
        this.refs.sportHandle.updatealarm(warning,alarm);
    }
    updateheight(height){
        this.refs.sportHandle.updateheight(height);
    }
    updatefoottxt(txt){
        this.refs.sportHandle.updatefoottxt(txt);
    }
    render() {
        return(
            <div>
                <Sport ref="sportHandle"/>
            </div>
        );
    }

}
/*
ReactDOM.render(
<Hello />,
    document.querySelector('#app')
);*/


//var App_new = new App;
//ReactDom.render(<App/>,document.getElementById('app'));


function log(str){
    if(debug){
        app_handle.updatefoottxt(str);
    }else{console.log(str);
    }

}
function current_value() {


    var map = {
        action: "personal_bracelet_radiation_current",
        id : device_id
    };
    jQuery.get(request_head, map, function (data) {
        //log(data);
        var result=JSON.parse(data);
        var ret = result.status;
        if(ret == "true"){
            var value = result.ret;
            //test_log("["+get_localtime()+"]: Get current value:"+value);
            //update_current(value);
            count_times++;
            last_data = parseInt(value);
            app_handle.updatecurrent(last_data);
            chart_series.addPoint([count_times,last_data],true,true);

        }else{
            device_error();
        }
    });


}


function get_wechat_appid(code){
    wechat_auth_url = wechat_auth_url+code+wechat_auth_url_tail;
    var map={};
    jQuery.get(wechart_auth_url, map, function (data) {
        //log(data);
        var result=JSON.parse(data);
        wechat_appid = result.openid;
        if(result.hasOwnProperty("openid") ){
            wechat_appid = result.openid;
        }else{
            wechat_error();
        }

    });
}

function alarm_value() {
    var map = {
        action: "personal_bracelet_radiation_alarm"
    };
    jQuery.get(request_head, map, function (data) {
        log(data);
        var result=JSON.parse(data);
        var ret = result.status;
        if(ret == "true"){
            warning_level = parseInt(result.warning);
            alarm_level = parseInt(result.alarm);
            test_log("["+get_localtime()+"]: alarm value:"+alarm_level+"; warning value:"+warning_level);
            init_charts();
            current_value();
            history_value();
        }else{
            device_error();
        }
    });

}
function device_error(){
    //log("device_error on device in database");
}
function wechat_error(){
    //log("can not get the right open id");
}
function test_log(str){
    //log(str);
}

function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("//");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);
    return reUrl;

}
function getURLafterpound(){
    var url = document.location.toString();
    if(url.indexOf("#")!=-1){
        var arrUrl= url.split("#");
        if(arrUrl[1].length>0) return arrUrl[1];
    }
    return "test";
}

function getWechatScope(){
    var url = document.location.toString();
    if(url.indexOf("code=")!=-1){
        var arrUrl= url.split("code=");
        var scope_value = arrUrl[1].split("&")[0];
        if(scope_value.length>0 ){
            get_wechat_appid(scope_value);
            return scope_value;
        }
    }
    return "test";
}

function get_localtime(){
    var myDate=new Date();
    return myDate.Format("yyyy-MM-dd hh:mm:ss");
}



Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


function update_history(){
    var color_map = {};
    var key = "0:"+(warning_level-1).toString();
    color_map[key] = '#00CC33';
    key = warning_level.toString()+":"+(alarm_level-1).toString();
    color_map[key] = '#FF9900';
    key = alarm_level.toString()+":99999";
    color_map[key] = '#FF1177';
    $("#sparkline_one").sparkline(history_list, {
        type: 'bar',
        height:parseInt(chart_height/2),
        Width:chart_width,
        barWidth:chart_width/47,
        barSpacing:chart_width/47,
        colorMap:color_map,
        barColor: '#26B99A'
    });
}

function history_value() {
    var map = {
        action: "personal_bracelet_radiation_history",
        id : device_id
    };
    jQuery.get(request_head, map, function (data) {
        //log(data);
        var result=JSON.parse(data);
        var ret = result.status;
        if(ret == "true"){
            var value = result.ret;
            history_list = [];
            for(var i=0;i<value.length;i++){
                history_list.push(parseInt(value[i]));
                /*
                 txt = txt+ " "+value[i];
                 if(i!=value.length-1){
                 txt = txt+" &";
                 } else{
                 txt=txt+";";
                 }*/
            }
            update_history();
            //test_log(txt);
        }else{
            device_error();
        }
    });
}
function get_size(){
    var const_value = 0.618;
    var winWidth;
    var winHeight;
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }



    var font_window_heitht = parseInt(winHeight*const_value);
    if(winWidth<font_window_heitht) font_window_heitht = winWidth;
    var chart_window_height = winHeight - font_window_heitht;
    var font_size = parseInt(winHeight/2-(winHeight*const_value)/2);
    var font_margin = parseInt((font_window_heitht-font_size)/2);

    var convas_width = parseInt((winWidth-30)*0.90);
    if((convas_width +100) < winWidth) convas_width = winWidth-100;
    if((convas_width +70) > winWidth) convas_width = winWidth-70;
    var convas_height = parseInt(convas_width/4);
    chart_width=convas_width;
    chart_height=parseInt(winHeight/4);
    //var convas_margin_top = parseInt(winHeight*const_value+(winHeight-convas_height)/2);
    var convas_margin_top = parseInt(convas_height+(winHeight*(1-const_value)-convas_height)*const_value);
    var convas_margin_left = parseInt((winWidth-convas_width)/2);
    if(winHeight>winWidth){

        app_handle.updateheight(winHeight);
        chart_height=parseInt(winHeight*0.4);
    }else{
        app_handle.updateheight(winWidth);
        chart_height=parseInt(winWidth*0.4);
    }
    log("window width = "+winWidth+";window height = "+ winHeight+"chart_height="+chart_height);

}

function init_charts(){
    Highcharts.setOptions(
        {global:{useUTC:!1}});
    $("#placeholder33x").highcharts(
        {
            chart:{
                type:"spline",
                animation:Highcharts.svg,
                marginRight:10,
                height:parseInt(chart_height),
                events:{
                    load:function(){
                        chart_series=this.series[0];
                        //this.series[0]
                    }
                }
            },
            colors:["#1ABB9C"],
            title:{text:null},
            xAxis:{allowDecimals:!1,tickPixelInterval:100},
            yAxis:{title:{text:null},
                plotLines:[{color:"#F39C12",dashStyle:"solid",value:warning_level,width:2},
                    {color:"#E74C3C",dashStyle:"solid",value:alarm_level,width:2}]},
            legend:{enabled:!1},
            exporting:{enabled:!1},
            credits:{enabled:!1},
            series:[{name:"history",
                data:(function(){
                    var e,t=[];
                    for(e=-9;e<=0;e++)t.push({x:e,y:0});
                    return t;
                })()
            }]
        });
}

//console.log("deviceid:"+device_id);
var react_element = <App/>;
app_handle = ReactDOM.render(react_element,document.getElementById('app'));

get_size();
log(document.location.toString());
alarm_value();
//init_charts();
//current_value();
//history_value();
setInterval(current_value,current_cycle);
setInterval(history_value,history_cycle);