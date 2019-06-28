/**
 * Created by Administrator on 2015/4/9.
 */
//页面切换代码
var flag=0;
//左侧边栏伸缩
function Alter()
{
    if(flag==0)
    {//把左侧边栏收起来
        flag=1;
        document.getElementById("div_left").style.width="30px";
        document.getElementById("div_left_header1").style.display="none";
        document.getElementById("div_left_ul").style.display="none";
        document.getElementById("div_left_header").style.width="20px";
        document.getElementById("tabcontainer").style["margin-left"]="35px";
        document.getElementById("btn_alter").style.background="url(../ASSETS/IMAGE/layout_arrows.png) no-repeat 0 -16px";
    }
    else
    {//把左侧边栏展开
        flag=0;
        document.getElementById("div_left").style.width="200px";
        document.getElementById("div_left_header1").style.display="block";
        document.getElementById("div_left_ul").style.display="block";
        document.getElementById("div_left_header").style.width="190px";
        document.getElementById("tabcontainer").style["margin-left"]="205px";
        document.getElementById("btn_alter").style.background="url(../ASSETS/IMAGE/layout_arrows.png) no-repeat 0 0";
    }
}
//树形菜单伸缩
function Alter2(evt)
{
    var evt=evt||window.event;
    var elem=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var arr_li=con_getElementsByClassName("div_cds","div_left_ul");
    for(var i=0;i<arr_li.length;i++)
    {
        arr_li[i].style.display="none";
    }
    if(elem.tagName=="IMG")//在ie11之前的ie会认为div里面的img是elem！！
    {
        elem=elem.parentNode;
    }
    elems=elem.parentNode.childNodes;
    for(var i=0;i<elems.length;i++)
    {
        if(elems[i].className=="div_cds")
        {
            elems[i].style.display="block";
            break;
        }
    }
    //elem.parentNode.childNodes[3].style.display="block";
    //elem.display="block";
}
//窗口大小变化时标签适应窗口
function Alter3()
{
    var size=window_size();
    document.getElementById("div_left_ul").style.height=((size.height-137)+"px");
    document.getElementById("tabcontainer").style.height=((size.height-102)+"px");
    var objs=con_getElementsByClassName("mainiframe");//手动改变每个iframe的高度
    var len=objs.length;
    for(var i=0;i<len;i++)
    {
        objs[i].style.height=(size.height-122)+"px";
    }
}
