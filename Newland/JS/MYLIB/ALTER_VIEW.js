/**
 * Created by Administrator on 2017/4/11.
 */
var btn_selected=null;//当前被选中的button
function Open_second(type,evt)
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    delete_div("div_btn_second");
    delete_div("div_btn_third");
    var div_hidden=obj.parentNode.getElementsByTagName("div")[0];//使用class的话将不兼容IE8！！
    if(type<6)//偏左
    {
        Open_div2("div_btn_second",{left:obj.getBoundingClientRect().left,top:obj.getBoundingClientRect().bottom}
            ,240,div_hidden.getElementsByTagName("button").length*25+2,obj.parentNode,0,350,1,"transparent");
        var div_btn_second=$("#div_btn_second")[0];
        div_btn_second.innerHTML = div_hidden.innerHTML;
        var btns=div_btn_second.getElementsByTagName("button");
        var len =btns.length;
        for(var i=0;i<len;i++)
        {
            btns[i].style.left="0px";
            btns[i].style.top=2+25*i+"px";
            //btns[i].onclick=Function("Open_third(type,i)");//加载第type列里的第i+1个三阶菜单，这种方法执行时type和i已经被释放了！！！！
            //btns[i].onclick=function(){Open_third(type,i);};//这种方法最后取到的i是len！！
            //listenEvent(btns[i],'click',Open_third,type,i);
            //btns[i].onclick=Function("Open_third("+(type+0)+","+(i+0)+")");//这种可以传参！！！！
            //但是最后决定一个一个的设置二阶菜单，不使用这个监听了。。。
        }
    }
    else//偏右
    {
        Open_div2("div_btn_second",{left:obj.getBoundingClientRect().right-240,top:obj.getBoundingClientRect().bottom}
            ,240,div_hidden.getElementsByTagName("button").length*25+2,obj.parentNode,0,350,1,"transparent");
        var div_btn_second=$("#div_btn_second")[0];
        //div_btn_second.style.float="right";
        div_btn_second.innerHTML = div_hidden.innerHTML;
        var btns=div_btn_second.getElementsByTagName("button");
        var len =btns.length;
        for(var i=0;i<len;i++)
        {
            btns[i].style.right="0px";
            btns[i].style.top=2+25*i+"px";
            //btns[i].onclick=function(){Open_third(type,i);};//加载第type列里的第i+1个三阶菜单
            //btns[i].onclick=Function("Open_third("+(type+0)+","+(i+0)+")");//这种可以传参！！！！
        }
    }
}

function Open_third(type,i)
{
    var evt=evt||window.event;
    //cancelPropagation(type,evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    delete_div("div_btn_third");
    if(btn_selected)
    {
        btn_selected.style.borderWidth="2px";
        btn_selected=null;
    }

    //var div_hidden=document.getElementById("div_control").getElementsByTagName("div")[type].getElementsByTagName("div")[i+1];
    var div_hidden=$("#div_control .div_col:eq("+type+") .hidden")[i+1];
    if(div_hidden)
    {
        if(type<6)//偏左
        {
            Open_div2("div_btn_third",{left:obj.getBoundingClientRect().right+2,top:obj.getBoundingClientRect().top}
                ,240,div_hidden.getElementsByTagName("button").length*25+2,$("#div_control .div_col:eq("+type+")")[0]//[type]
                ,0,351,1,"transparent");
            var div_btn_third=$("#div_btn_third")[0];
            div_btn_third.innerHTML = div_hidden.innerHTML;
            var btns=div_btn_third.getElementsByTagName("button");
            var len =btns.length;
            for(var i=0;i<len;i++)
            {
                btns[i].style.left="0px";
                btns[i].style.top=2+25*i+"px";
            }
        }
        else
        {
            Open_div2("div_btn_third",{left:obj.getBoundingClientRect().left-2-240,top:obj.getBoundingClientRect().top}
                ,240,div_hidden.getElementsByTagName("button").length*25+2,$("#div_control .div_col")[type]
                ,0,351,1,"transparent");
            var div_btn_third=$("#div_btn_third")[0];
            div_btn_third.innerHTML = div_hidden.innerHTML;
            var btns=div_btn_third.getElementsByTagName("button");
            var len =btns.length;
            for(var i=0;i<len;i++)
            {
                btns[i].style.right="0px";
                btns[i].style.top=2+25*i+"px";
            }
        }
    }
}