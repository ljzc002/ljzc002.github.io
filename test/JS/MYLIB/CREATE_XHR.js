/**
 * Created by Administrator on 2015/1/28.
 * Update by Administrator on 2015/09/17.
 */
//Ajax通信页面
var xmlHttp=createXMLHttpRequest();
var isTimout="0";//0表示未超时
var timer;//用来存定时器
function createXMLHttpRequest()
{
    var xhr=false;
    if(window.XMLHttpRequest)
    {
        try
        {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
        }
        catch(e)
        {

        }
        xhr=new XMLHttpRequest();
    }
    else if(window.ActiveXObject)
    {
        try
        {
            xhr=new window.ActiveXObject("Msxm12.XMLHTTP");

        }
        catch(e)
        {
            try
            {
                xhr=new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(e)
            {

                alert("您的浏览器不支持ajax!");

            }
        }
    }
    return xhr;
}
//如果跨页面调用方法，就得把调用的源也作为参数传给方法了，没有办法直接调全局变量
//经过试验，其实也可以直接调全局变量，并且不需要全局声明，当然这只限于js的语法了
//往深处想，对象做参数时其实传递的是指针，使用显式的参数和全局变量其实是一样的！
//区别在于如果这个函数计划只给这一个对象用，则用全局变量方式比较方便，如果要由多个对象共同使用，则设为参数比较合适
//要添加一个超时时间限制！！20150917
//目前的版本为单线程的ajax访问，不能支持多个ajax同时访问
Request=function(xhr,method,src,isajax,argv,content_type,recallfunc,timeout)
{//连接对象、连接方式、连接目的地址、是否异步、提交内容、表单的内容类型、回调函数、 超时时间
    xmlHttp.open(method,src,isajax)
    if(method=="POST")
        xmlHttp.setRequestHeader("Content-Type",content_type);
    xmlHttp.setRequestHeader("Access-Control-Allow-Origin","*");
    xmlHttp.onreadystatechange=recallfunc;
    xmlHttp.send(argv);
    isTimout="0";
    if(timeout==1) {//0表示不检测超时，1表示检测超时
        timer = window.setTimeout("dualTimeout();", timeout);
    }
}
Requestws=function(xhr,method,src,isajax,argv,content_type,recallfunc,timeout)
{//连接对象、连接方式、连接目的地址、是否异步、提交内容、表单的内容类型、回调函数、 超时时间
    xmlHttp.open(method,src,isajax)//src过长会失败！！

    xmlHttp.setRequestHeader ("Content-Type","text/xml; charset=utf-8");
    xmlHttp.setRequestHeader ("SOAPAction","http://tempuri.org/GetKYCL");
    xmlHttp.onreadystatechange=recallfunc;
    xmlHttp.send(argv);
}
//给XMLHttpRequest的原型添加二进制发送功能
XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
    function byteValue(x) {
        return x.charCodeAt(0) & 0xff;
    }
    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);
}