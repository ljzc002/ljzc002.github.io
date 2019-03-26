/**
 * Created by Administrator on 2016/2/23.
 */
//进入导航后去取Session中保持的登录信息，后台的session有保持时间限制，需要验证一下是否还存在
//其实这里验证的并不是session
function CheckSession()
{
    Url=UrlHead+"/Login.ashx";
    Argv="method=post&func=check_session&czyid="+userid+"&token="+token;
    Request(xmlHttp,"POST",Url,true,Argv,"application/x-www-form-urlencoded",CheckSessionBack,0);
}
function CheckSessionBack()//还要根据不同的用户ID获取不同的menu
{
    if(xmlHttp.readyState==4)
    {
        if(xmlHttp.status==200)
        {
            clearTimeout(timer);//停止定时器
            var obj_res =JSON.parse(xmlHttp.responseText);
            if(obj_res.state=="NotOnline")
            {//没有找到session跳转到登陆页面
                alert('您已经不处于登录状态！\n返回到登录页面。');
                //window.navigate("login.html");
                xmlHttp.abort();
                window.open("login.html","_self");
            }
            else if(obj_res.state=="Exception")
            {
                xmlHttp.abort();
                console.log(obj_res.content);
            }
            else
            {//找到了session根据session给全局变量赋值
                gzrq=obj_res.content.dlrq;
                document.getElementById("title_bar").getElementsByTagName("b")[0].innerHTML=gzrq;
                document.getElementById("title_bar").getElementsByTagName("b")[1].innerHTML=userid;
                xmlHttp.abort();//要关闭掉旧的连接
                InitMenu();//手动设置几个菜单
            }
        }
    }
}

function InitMenu()
{//这种写法并不好，是应该被重构的
            var arr_user = [
                ["测试菜单","./PAGE/chat.html","bg/pic_test","test","unique"]
            ];
            //根据传回的已经排好序的数据生成二阶导航菜单
                var str_cdz="";//保存菜单组名
                var div_cds;
                for(var i=0;i<arr_user.length;i++)//对于每一个菜单
                {
                    if(i==0||str_cdz!=arr_user[i][3])//如果是一个新的菜单组
                    {
                        str_cdz=arr_user[i][3];//第一个菜单组的组ID
                        var div_left_li=document.createElement("div");
                        div_left_li.className="div_left_li";
                        var div_cdz=document.createElement("div");
                        div_cdz.onclick=Alter2;
                        div_cdz.className="div_cdz";
                        cdztpbg="../ASSETS/IMAGE/"+arr_user[i][2]+"-bg.jpg";//菜单组的图片
                        cdztp="../ASSETS/IMAGE/"+arr_user[i][2]+".jpg";
                        div_cdz.innerHTML="<img src='"+cdztpbg+"' onmouseover='this.src=\""+cdztp+"\"' " +
                            "onmouseout='this.src=\""+cdztpbg+"\"' class='img_cdz'>";
                        div_cds=document.createElement("div");
                        div_cds.className="div_cds";
                        div_left_li.appendChild(div_cdz);//菜单组和菜单是同级元素
                        div_left_li.appendChild(div_cds);
                        document.getElementById("div_left_ul").appendChild(div_left_li);

                        var div_cd=document.createElement("div");
                        div_cd.className="div_cd";
                        div_cd.onclick=Opencd;
                        div_cd.burl=arr_user[i][1];//菜单打开的iframe的url
                        div_cd.flag_open=0;//0表示不限制开启窗口数，1表示只能打开一个，2表示已经打开了一个
                        if(arr_user[i][4]=="unique")
                        {
                            div_cd.flag_open=1;
                        }
                        div_cd.innerHTML=arr_user[i][0];//菜单的文字
                        div_cds.appendChild(div_cd);
                    }
                    else
                    {
                            var div_cd=document.createElement("div");
                            div_cd.className="div_cd";
                            div_cd.onclick=Opencd;
                            div_cd.burl=arr_user[i][1];
                            div_cd.flag_open=0;//0表示不限制开启窗口数，1表示只能打开一个，2表示已经打开了一个
                            if(arr_user[i][4]=="unique")
                            {
                                div_cd.flag_open=1;
                            }
                            div_cd.innerHTML=arr_user[i][0];
                            div_cds.appendChild(div_cd);

                    }
                }

}
function QuitSession()
{
    if(confirm("是否要注销当前用户，选择【确定】退出当前用户并重新登录，选择【取消】放弃注销。")) {
        Url = UrlHead + "/Login.ashx";
        Argv = "method=post&func=quit_session&token="+token+"&czyid="+userid;
        Request(xmlHttp, "POST", Url, true, Argv, "application/x-www-form-urlencoded", "", 0);
        window.open("login.html", "_self");
    }//这时直接打开登录窗口，不考虑后端的返回了
}
//打开菜单项对应的窗口
function Opencd()
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var li_left2=evt.currentTarget?evt.currentTarget:evt.srcElement;//被点击的div
    var flag_open;//用来限定一些窗口只能打开一个
    if(li_left2.flag_open==null)
    {
        flag_open=li_left2.getAttribute("flag_open");
    }
    else {
        flag_open = li_left2.flag_open;
    }
    if(flag_open==1)
    {
        li_left2.flag_open=2;
    }
    else if(flag_open==2)
    {
        alert(li_left2.innerHTML+"窗口只能打开一个！");
        return;
    }

    PushContainer(li_left2.innerHTML,tab_no);//在div_tab中加入一个li和一个div
    //在DOM中找到这个标签
    var tab_div;
    var nodes_div=con_getElementsByClassName("tabpage");
    for(var i=0;i<nodes_div.length;i++)
    {
        if(nodes_div[i].tabno!=null)
        {
            if (nodes_div[i].tabno == tab_no)
            {
                tab_div=nodes_div[i];
                break;
            }
        }
    }
    var iframe=document.createElement("iframe");//向这个标签中添加表格链接
    iframe.style.width="100%";
    iframe.className="mainiframe";
    var ViewPort=window_size();
    iframe.style.height=(ViewPort.height-122)+"px";//想办法读屏幕的高度！
    //alert(ViewPort.height+"_"+ViewPort.width+"&"+ViewPort2.height+"_"+ViewPort2.width);
    if(li_left2.burl==null)
    {
        iframe.src=li_left2.getAttribute("burl");//chrome不完全支持自定义属性，尝试兼容方法
    }
    else {
        iframe.src = li_left2.burl;
    }
    iframe.src+=("#"+serverip+"@"+httpport+"@"+wsport+"@"+userid+"@"+gzrq);//把用户信息传给子页面

    tab_div.appendChild(iframe);
    tab_no++;
}
//不使用导航按钮，直接根据输入的burl和title打开新的iframe
function Opencd2(title,burl)
{
    PushContainer(title,tab_no);
    var tab_div;
    var nodes_div=con_getElementsByClassName("tabpage");
    for(var i=0;i<nodes_div.length;i++)
    {
        if(nodes_div[i].tabno!=null)
        {
            if (nodes_div[i].tabno == tab_no)
            {
                tab_div=nodes_div[i];//获取到新建的选项卡
                break;
            }
        }
    }
    var iframe=document.createElement("iframe");//向这个标签中添加表格链接
    iframe.style.width="100%";
    iframe.className="mainiframe";
    var ViewPort=window_size();
    iframe.style.height=(ViewPort.height-122)+"px";//想办法读屏幕的高度！
    iframe.src=burl;
    tab_div.appendChild(iframe);
    tab_no++;
}
//由ifream里的元素调用，定位选项卡位置
function locat_tab()
{

}
//先关闭一个tab，之后再打开一个tab
//在子窗口的body上设置的标记，新打开窗口的两个参数
function close_open(flag1,str1,str2)
{
    /*var tabno=9999;
    var frames=document.frames;
    var len=frames.length;
    for(var i=0;i<len;i++)
    {
        if(frames[i].document.body.id==flag1)//根据标记找到了这个子窗口
        {
            tabno=
        }
    }*/
    //try{//IE直接使用
    Opencd2(str1, str2);


    //frames[0].window.parent.Opencd2(str1,str2);
    //Opencd2(str1,str2);//在父元素中执行这一语句可能导致了某种从未发生过的重绘？？
    var lis=document.getElementById("ul_tabnavigation").getElementsByTagName("li");
    var len=lis.length;

    for(var i=0;i<len;i++)
    {
        if(lis[i].tabno==(tab_no_now-1))
        {
            dispatchMyEvent(lis[i].getElementsByTagName("button")[0],"click");
            break;
        }
    }
}
//在打开一个新窗口后关闭前一个窗口
function close_last()
{
    var lis=document.getElementById("ul_tabnavigation").getElementsByTagName("li");
    var len=lis.length;

    for(var i=0;i<len;i++)
    {
        if(lis[i].tabno==(tab_no_now-1))
        {
            dispatchMyEvent(lis[i].getElementsByTagName("button")[0],"click");//触发关闭按钮的点击事件
            break;
        }
    }
}