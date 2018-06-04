/**
 * Created by lz on 2018/5/15.
 */
var jsessionid="";
var Url="";
var UrlHead="http://127.0.0.1:8082/";
var H2State="offline";
var H2LoginCallback;
function H2Login(func)
{
    H2LoginCallback=func;
    Url=UrlHead+"";
    Argv="";
    Request(xmlHttp,"POST",Url,true,Argv,"application/x-www-form-urlencoded",H2LoginCallBack,0);
}
function H2LoginCallBack()
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
                try
                {
                    var str_id=xmlHttp.responseText;
                    xmlHttp.abort();
                    jsessionid=str_id.substr(str_id.search(/jsessionid/)+11,32) ;
                    console.log(jsessionid);
                    H2Login2();
                }catch(e)
                {
                    alert(e);
                    console.error(e)
                    xmlHttp.abort();
                }
            }
        }
    }
}
function H2Login2()
{
    Url=UrlHead+"login.do?jsessionid="+jsessionid;
    Argv="language=en&setting=Generic H2 (Embedded)&name=Generic H2 (Embedded)" +
        "&driver=org.h2.Driver&url=jdbc:h2:tcp://127.0.0.1/../../datawar" +
        "&user=datawar&password=datawar";
    Request(xmlHttp,"POST",Url,true,Argv,"application/x-www-form-urlencoded",H2Login2CallBack,0);
}
function H2Login2CallBack()
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
                try
                {
                    var str_logres=xmlHttp.responseText;//这时已经在h2服务端建立登录状态
                    xmlHttp.abort();
                    console.log("完成h2数据库登录");
                    H2State="online";
                    //Query();
                    //CreateChess();//测试时将运算启动放在这里，实际使用时，通过渲染循环检测H2State标志来启动运算
                    H2LoginCallback();//这样可以执行函数对象吗？？？？
                }catch(e)
                {
                    alert(e);
                    console.error(e)
                    xmlHttp.abort();
                }
            }
        }
    }
}