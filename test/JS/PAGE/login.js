/**
 * Created by Administrator on 2015/10/12.
 */
/*function DrawYzm()
{
    //去后台取验证码图片
    Url=UrlAgent+"Login.ashx";
    Argv="method=post&func=get_verifycode";
    Request(xmlHttp,"POST",Url,true,Argv,"application/x-www-form-urlencoded",CallBack,0);

}*/
/*function CallBack()
{
    if(xmlHttp.readyState==4) {
        if(isTimout=="1")
        {
            alert("验证码请求超时！！");
            clearTimeout(timer);
            xmlHttp.abort();
        }
        else {
            if (xmlHttp.status == 200) {
                clearTimeout(timer);//停止定时器
                var str_img = xmlHttp.responseText;
                var img = document.getElementById("img_yzm");
                img.src = "data:image/Jpeg;base64," + str_img;
                xmlHttp.abort();
            }
        }
    }
}*/
function Get_Login()
{
    serverip = document.getElementById ("input_serverip").value.Trim();
    httpport = document.getElementById ("input_httpport").value.Trim();
    wsport = document.getElementById ("input_wsport").value.Trim();
    userid = document.getElementById ("input_userid").value.Trim();
    userpwd = document.getElementById ("input_password").value.Trim();
    //var  vcode=document.getElementById ("input_checkcood").value.Trim();

    if(serverip==""||httpport==""||wsport=="")
    {
        alert("请填写IP和PORT！");
    }
    if(userid==""||userpwd=="")//||vcode=="")
    {
        alert("请填写用户名和密码！");
    }
    else
    {//登录仍然使用http协议，登录后再启动WS
        //vcode=vcode.toUpperCase();//无论大小写都转换为大写
        Url="http://"+serverip+":"+httpport+"/"+"Login.ashx";
        Argv="method=post&func=get_login&czyid="+userid+"&czymm="+userpwd;
        Request(xmlHttp,"POST",Url,true,Argv,"application/x-www-form-urlencoded",CallBack2,0);
    }
}
function CallBack2()
{
    if(xmlHttp.readyState==4) {
        if(isTimout=="1")
        {
            alert("登陆验证请求超时！！");
            clearTimeout(timer);
            xmlHttp.abort();
        }
        else {
            if (xmlHttp.status == 200) {
                clearTimeout(timer);//停止定时器
                var obj=JSON.parse(xmlHttp.responseText);
                try
                {

                    if (obj.state== "OK") {
                        var str_token=obj.token;
                        localStorage.setItem(userid,str_token);//使用浏览器本地持久化把token传递到index
                        xmlHttp.abort();
                        //window.open("Index.html", "_blank");
                        if(flag==0)//从正常目录访问
                        {
                            window.open("Index.html#"+serverip+"@"+httpport+"@"+wsport+"@"+userid, "_self");
                        }
                        else if(flag==1)//从外部默认页面访问
                        {
                            window.open("HTML/Index.html", "_self");
                        }
                    }
                    else if(obj.state== "Exception")
                    {
                        alert(ojb.content);
                    }
                    else
                    {
                        alert(obj);
                    }
                }catch(e)
                {
                    alert(xmlHttp.responseText);
                    console.error(e)
                    xmlHttp.abort();
                    Relocat();
                }
            }
            else
            {
                alert(xmlHttp.status);
            }
        }
    }
}
function EnterLogin(evt)
{
    var evt=evt||window.event;
    if (processKeyStroke(evt)==13) //如果按下的是Enter键的话，就执行登录语句
    {
        Get_Login();
    }
}
function Relocat()
{
    document.getElementById ("input_serverip").value="localhost";
    document.getElementById ("input_httpport").value="8181";
    document.getElementById ("input_wsport").value="2323";
    document.getElementById ("input_userid").value="";
    document.getElementById ("input_password").value="";
    //document.getElementById ("input_checkcood").value="";
    //DrawYzm();
}
//Ajax连接超时
function dualTimeout()
{
    isTimout="1";
    clearTimeout(timer);
    xmlHttp.abort();
    Relocat();
}
