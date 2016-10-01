<?php
header("Content-type:text/html;charset=utf-8");
function _encode($arr)
{
  $na = array();
  foreach ( $arr as $k => $value ) {
    $na[_urlencode($k)] = _urlencode ($value);
  }
  return addcslashes(urldecode(json_encode($na)),"\r\n");
}

function _urlencode($elem)
{
  if(is_array($elem)&&(!(empty($elem)))){
    foreach($elem as $k=>$v){
      $na[_urlencode($k)] = _urlencode($v);
    }
    return $na;
  }
  if(is_array($elem)&&empty($elem)){
	  return $elem;
  }
  return urlencode($elem);
}

$key=$_GET["action"];
//echo $key;
switch ($key){
    case "wechat_login":
        $code = $_GET["code"];
        $weixin =  file_get_contents("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxf2150c4d2941b2ab&secret=ab95997f454e04b77911c18d09807831&code=".$code."&grant_type=authorization_code");//通过code换取网页授权access_token
        $jsondecode = json_decode($weixin); //对JSON格式的字符串进行编码
        $array = get_object_vars($jsondecode);//转换成数组

        $openid = $array['openid'];//输出openid
         if(!isset($openid)&&empty($openid)){ $openid="Not Autherized";}
        $retval=array(
            'status'=>'true',
            'ret'=>$openid
        );

        $file_txt = fopen("./log.txt",'w');
        fwrite($file_txt,"code=".$code."#openid=".$openid."#");
        fclose($file_txt);
        $jsonencode = _encode($retval);
        echo $jsonencode; break;

    case "personal_bracelet_radiation_current":
        /*
            var device = data.id;
            var retval={
                status:"true",
                ret: GetRandomNum(0,255).toString()
            };
            return JSON.stringify(retval);
        */
        $device_id = $_GET["id"];
        $retval=array(
            'status'=>'true',
            'ret'=>(string)rand(0,255)
        );
        $jsonencode = _encode($retval);
        echo $jsonencode; break;
    case "personal_bracelet_radiation_alarm":
        /*
        var retval={
            status:"true",
            warning: "150",
            alarm: "200"
        };
        return JSON.stringify(retval);
        */
        $retval=array(
            'status'=>'true',
            'warning'=> '150',
            'alarm'=>'200'
        );
        $jsonencode = _encode($retval);
        echo $jsonencode; break;
    case "personal_bracelet_radiation_history":
    /*
        var device = data.id;
        var retlist = new Array();
        for(var i=0;i<48;i++){
          retlist.push(GetRandomNum(0,255).toString())
        }
        var retval={
          status:"true",
          ret:retlist
        }
        return JSON.stringify(retval);
    */
        $device_id = $_GET["id"];
        $retlist= array();
        for($i=0;$i<24;$i++){
            array_push($retlist,(string)rand(0,255));
        }
        $retval=array(
            'status'=>'true',
            'ret'=> $retlist
        );
        $jsonencode = _encode($retval);
        echo $jsonencode; break;
    case "personal_bracelet_radiation_track":
    /*
        var device = data.id;
        var retlist = new Array();
        for(var i=0;i<48*6;i++){
            var map = {
                longitude: (121.514168+0.05*i).toString(),
                latitude: "31.240246",
                value:GetRandomNum(0,255).toString(),
            }
            retlist.push(GetRandomNum(0,255).toString())
        }
        var retval={
            status:"true",
            ret:retlist
        }
        return JSON.stringify(retval);
    */
        $device_id = $_GET["id"];
        $retlist= array();
        for($i=0;$i<48;$i++){
            $map = array(
                'longitude'=>(string)(121.514168+0.05*$i),
                'latitude'=>"31.240246",
                'value'=>(string)rand(0,255)
            );
            array_push($retlist,$map);
        }
        $retval=array(
            'status'=>'true',
            'ret'=> $retlist
        );
        $jsonencode = _encode($retval);
        echo $jsonencode; break;
	default:
	break;
}


?>