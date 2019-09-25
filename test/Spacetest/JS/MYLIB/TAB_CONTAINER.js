/**
 * Created by Administrator on 2015/4/13.
 */
//向容器中加入一个选项卡(li)和一个标签页(div)
var tab_no=0;//表示当前一共有多少个标签页,用来命名！
var tab_no_now=-1;//表示当前选中了哪一个标签页
//已知为了兼容IE8，在evt.currentTarget处进行了兼容性判断、使用了封装的getElementsByClassName
function PushContainer(title,tabno)
{
    var li=document.createElement("li");
    var ul_tabnavigation=document.getElementById("ul_tabnavigation");
    li.tabno=tabno;
    li.setAttribute("onclick","TabChoose(event);");
    li.innerHTML=title+"<button style='position:static; width: 14px;height: 14px; margin: 0;margin-left:1px;padding: 0;background: url(../ASSETS/IMAGE/close.png) no-repeat;border: 0px;vertical-align:top' onclick='PopContainer()'></button>";
    //相对路径仍然是相对于html页面来说的，而与js文件的位置无关！！！！
    ul_tabnavigation.appendChild(li);
    con_getElementsByClassName("tabnavigation")[0].style.display="block";

    var div=document.createElement("div");
    div.tabno=tabno;
    div.setAttribute("class","tabpage");
    con_getElementsByClassName("tabpages")[0].appendChild(div);
    con_getElementsByClassName("tabpages")[0].style.display="block";

    //显式标识当前li
    for(var i=0;i<ul_tabnavigation.childNodes.length;i++)
    {
        if(ul_tabnavigation.childNodes[i].tabno!=null) //不知道为什么ul的下面总是有个\n\n节点？？
        {
            if (ul_tabnavigation.childNodes[i].tabno != tabno)//其他的标签都使用白色背景
            {
                ul_tabnavigation.childNodes[i].style.backgroundColor = "#e0ecff";
            }
            else if (ul_tabnavigation.childNodes[i].tabno == tabno)
            {
                ul_tabnavigation.childNodes[i].style.backgroundColor = "#498de0";
            }
        }
    }
    //显示对应的div
    var nodes_div=con_getElementsByClassName("tabpage");
    for(var i=0;i<nodes_div.length;i++)
    {
        if(nodes_div[i].tabno!=null)
        {
            if (nodes_div[i].tabno != tabno)//其他的div都不显示
            {
                nodes_div[i].style.display = "none";
            }
            else if (nodes_div[i].tabno == tabno)
            {
                nodes_div[i].style.display = "block";
            }
        }
    }
    tab_no_now=tab_no;
}
//在容器中选中一个标签页,这里只涉及了样式的改变
function TabChoose(evt)
{
    var evt=evt||window.event||arguments[0];
    var tabno=evt.currentTarget?evt.currentTarget.tabno:evt.srcElement.tabno;
    var nodes_li=document.getElementById("ul_tabnavigation").childNodes;
    for(var i=0;i<nodes_li.length;i++)
    {
        if(nodes_li[i].tabno!=null)
        {
            if (nodes_li[i].tabno != tabno)
            {
                nodes_li[i].style.backgroundColor = "#e0ecff";
            }
            else if (nodes_li[i].tabno == tabno)
            {
                nodes_li[i].style.backgroundColor = "#498de0";
            }
        }
    }
    var nodes_div=con_getElementsByClassName("tabpage");
    for(var i=0;i<nodes_div.length;i++)
    {
        if(nodes_div[i].tabno!=null)
        {
            if (nodes_div[i].tabno != tabno)
            {
                nodes_div[i].style.display = "none";
            }
            else if (nodes_div[i].tabno == tabno)
            {
                nodes_div[i].style.display = "block";
            }
        }
    }
    tab_no_now=tabno;
}
//从容器中删除标签页
function PopContainer(evt)
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);//阻止事件向上冒泡传递！！
    var tabno=evt.currentTarget?evt.currentTarget.parentNode.tabno:evt.srcElement.parentNode.tabno;//srcElement是在尝试兼容ie8
    var nodes=con_getElementsByClassName("tabpage");
    for(var i=0;i<nodes.length;i++)//删掉div
    {
        if(nodes[i].tabno==tabno)
        {
            nodes[i].parentNode.removeChild(nodes[i]);
            break;
        }
    }
    var li_top=evt.currentTarget?evt.currentTarget.parentNode:evt.srcElement.parentNode;
    var name=li_top.innerText;
    document.getElementById("ul_tabnavigation").removeChild(li_top);//删掉li
    if(tabno==tab_no_now)
    {
        //tab_no_now=-1;//表示当前没有选中的项目
        //尝试自动跳转到邻近的那一个
        var nodes2=con_getElementsByClassName("tabpage");
        var nodes_li=document.getElementById("ul_tabnavigation").childNodes;
        if((nodes2.length-1)>=0) {
            tab_no_now = nodes2[nodes2.length - 1].tabno;
            nodes2[nodes2.length - 1].style.display = "block";
            nodes_li[nodes_li.length - 1].style.backgroundColor = "#498de0";
        }
    }
    var lis_lefts=con_getElementsByClassName("div_cd","div_left_ul");
    var len=lis_lefts.length;
    for(var i=0;i<len;i++)//关闭了唯一性的窗口之后，修改菜单的属性
    {
        var li_left2=lis_lefts[i];
        if(li_left2.innerHTML==name)
        {
            var flag_open;//用来限定一些窗口只能打开一个
            if(li_left2.flag_open==null)
            {
                flag_open=li_left2.getAttribute("flag_open");
            }
            else {
                flag_open = li_left2.flag_open;
            }
            if(flag_open==2)
            {
                li_left2.flag_open=1;//允许该唯一性菜单再次打开
            }
            break;
        }
    }
}

