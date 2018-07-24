/**
 * Created by Administrator on 2015/2/9.
 */
function listenEvent(eventTarget,eventType,eventHandler)//跨浏览器的添加事件
{
    if(eventTarget.addEventListener)//如果能够使用标准的DOM Level2事件
    {
        eventTarget.addEventListener(eventType,eventHandler,false);//false表示冒泡型监听
    }
    else if(eventTarget.attachEvent)//IE8
    {
        eventType="on"+eventType;
        eventTarget.attachEvent(eventType,eventHandler);//IE8只支持向上冒泡
    }
    else
    {
        eventTarget["on"+eventType]=eventHandler;//旧版本的浏览器支持DOM Level0事件
    }
}
function dispatchMyEvent(eventTarget,eventType)
{
    var event = document.createEvent('HTMLEvents');
    event.initEvent(eventType, true, true);
    event.eventType = 'message';
    eventTarget.dispatchEvent(event);
}
function stopListening(eventTarget,eventType,eventHandler)//跨浏览器的取消监听
{
    if(eventTarget.removeEventListener)//如果能够使用标准的DOM Level2事件
    {
        eventTarget.removeEventListener(eventType,eventHandler,false);//false表示冒泡型监听
    }
    else if(eventTarget.detachEvent)//IE8
    {
        eventType="on"+eventType;
        eventTarget.detachEvent(eventType,eventHandler);//IE8只支持向上冒泡
    }
    else
    {
        eventTarget["on"+eventType]=null;//旧版本的浏览器支持DOM Level0事件
    }
}
function cancelEvent(event)//跨浏览器的阻止事件进行??
{// if(bad) cancelEvent(event)
    if(event.preventDefault)
    {
        event.preventDefault();//阻止默认的行为发生
    }
    else
    {
        event.returnValue=false;
    }
}
function cancelPropagation(event)//跨浏览器阻止事件在嵌套控件中传播
{ // 在内部元素点击事件的事件处理程序中，调用该函数，传入事件对象
    if(event.stopPropagation)
    {
        event.stopPropagation();
    }
    else
    {
        event.cancelBubble=true;
    }
}
function processClick(evt)//处理鼠标单击事件
{
    evt=evt||window.event;//在IE8中通过window.event来访问Event对象，而其他浏览器则将Event作为一个参数
    var x=0;var y=0;
    if(evt.pageX)//非IE浏览器,直接取页面位置
    {
        x=evt.pageX;
        y=evt.pageY;
    }
    else if(evt.clientX)// IE浏览器，用窗口偏移量加上页面位置
    {
        var offsetX=0;var offsetY=0;
        if(document.documentElement.scrollLeft)
        {//IE6以上
            offsetX=document.documentElement.scrollLeft;
            offsetY=document.documentElement.scrollTop;
        }
        else if(document.body)
        {// 旧版本IE
            offsetX=document.body.scrollLeft;
            offsetY=document.body.scrollTop;
        }
        x=evt.clientX+offsetX;
        y=evt.clientY+offsetY;
    }
    var point=new Object();
    point.x=x;
    point.y=y;
    return point;
}
function processKeyStroke(evt)//把它放在事件处理函数里，将键盘事件转换为字符，提供跨浏览器的能力！
{
    evt=evt?evt:window.event;
    var key=evt.charCode?evt.charCode:evt.keyCode;//IE和Opera支持keyCode，Safari、Firefox、Chrome支持charCode
    return key;
}
//尝试兼容IE8,按照类名选择元素
function con_getElementsByClassName(className, root, tagName) {//root：父节点，tagName：该节点的标签类型。 这两个参数均可有可无
    if (root) {
        root = typeof root == "string" ? document.getElementById(root) : root;
    } else {
        root = document.body;
    }
    tagName = tagName || "*";
    if (document.getElementsByClassName) {                    //如果浏览器支持getElementsByClassName，就直接的用
        return root.getElementsByClassName(className);
    } else {
        var tag = root.getElementsByTagName(tagName);    //获取指定元素
        var tagAll = [];                                    //用于存储符合条件的元素
        for (var i = 0; i < tag.length; i++)
        {//遍历获得的元素
            for (var j = 0, n = tag[i].className.split(' ') ; j < n.length; j++)
            {    //遍历此元素中所有class的值，如果包含指定的类名，就赋值给tagnameAll
                if (n[j] == className) {
                    tagAll.push(tag[i]);
                    break;
                }
            }
        }
        return tagAll;
    }
}
String.prototype.Trim = function() //自定义的去除字符串两边空格的方法
{
    return this.replace(/(^\s*)|(\s*$)/g,"");
}
function onlyNum(event)//限制只能输入数字
{
    event=event||window.event;
    if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||(event.keyCode==8)||(event.keyCode==110)||(event.keyCode==190)))
        cancelEvent(event);
        //event.returnValue=false;
}
//.的keyCode是110和190
//onKeyPress = "return regInput(this,/^/d*/.?/d{0,2}$/,String.fromCharCode(event.keyCode))"
function regInput(obj, reg, inputStr)
{
    var docSel = document.selection.createRange()
    if (docSel.parentElement().tagName != "INPUT") return false
    oSel = docSel.duplicate()
    oSel.text = ""
    var srcRange = obj.createTextRange()
    oSel.setEndPoint("StartToStart", srcRange)
    var str = oSel.text + inputStr + srcRange.text.substr(oSel.text.length)
    return reg.test(str)
}
//用来修正JavaScript加减乘除的浮点bug
function add(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {}
    try {
        c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}
//四舍五入，目标浮点数、取整方式，小数点后精度
function sswr(float,type,accuracy)
{
    var float2=float;
    if(type==null||type==0)
    {

    }
    else if(type==1)//向下取整
    {
        float2+=-0.5;
    }
    else if(type==2)//向上取整
    {
        float2+=0.5;
    }
    var acc=Math.pow(10,accuracy?accuracy:0);//用于保留小数点后精度，保留小数点后一位时，acc为10
    var int_res=div(Math.round(float2*acc),acc);
    return int_res;
}
//比较两个数是否很接近
function numnear(a,b,dis)
{
    var c=Math.abs(a-b);
    if(c>dis)
    {
        return false;
    }
    else
    {
        return true;
    }
}
//比较两个一层数组的值是否相等
function equ(a,b)
{
    try
    {
        if(!a.length||!b.length||a.length!= b.length)
        {
            return false;
        }
        else
        {
            var len= a.length;
            for(var i=0;i<len;i++)
            {
                if(a[i]!=b[i])
                {
                    return false;
                }
            }
            return true;
        }
    }
    catch(e)
    {
        return false;
    }

}


