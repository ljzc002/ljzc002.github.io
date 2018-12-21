/**
 * Created by Administrator on 2015/5/11.
 */
//动态画表类，尝试使用自包含结构
//2016/8/31在表格中加入更多的格式选择
//2018/10/31重构att6框架为att7版本
Att7=function()
{

}
Att7.prototype.init=function(param)//只初始化对象的属性，不实际绘制
{
    try
    {
        this.base=param.base;//表格的容器对象
        this.id=param.id;//表格的id
        //this.left=param.left?param.left:0;//在容器对象内的左侧距离->认为tab_data和div_table完全重合
        //this.top=param.top?param.top:0;//上部距离
        this.rowsp=param.rowsp!=null?param.rowsp:50;//默认每页显示50条数据，输入负值表示无限制
        //this.page_current=param.page_current?param.page_current:0;//默认显示数据集的第一页，初始索引为0
        this.isStripe=param.isStripe!=null?param.isStripe:1;//这种三目运算不适用于布尔值！！！！默认奇偶行使用不同颜色
        this.isThlocked=param.isThlocked!=null?param.isThlocked:0;//默认不锁定表头
        this.isCollocked=param.isCollocked!=null?param.isCollocked:0;//默认不锁定表列
        this.showIndex=param.showIndex!=null?param.showIndex:1;//默认在左侧显示行号
        this.baseColor=param.baseColor!=null?param.baseColor:"#ffffff";//默认背景色为白色，间隔色为背景色亮度降低十六分之一
        this.stripeColor=param.stripeColor!=null?param.stripeColor:"#eeeeee";
        this.pickColor=param.pickColor!=null?param.pickColor:"#97ceef";
        this.div_temp1=document.createElement("div");
        this.div_temp1.style.backgroundColor=this.baseColor;
        this.div_temp2=document.createElement("div");
        this.div_temp2.style.backgroundColor=this.stripeColor;
        this.div_temp3=document.createElement("div");
        this.div_temp3.style.backgroundColor=this.pickColor;
        this.str_indexwid=param.str_indexwid!=null?param.str_indexwid:"100px";
        this.num_toolhei=param.num_toolhei!=null?param.num_toolhei:80;
       //固有属性
        this.html_onclick="<div class=\"div_inmod_lim\" style=\"width: 100%;height: 100%;margin: 0px;border: 1px solid;padding: 0px;" +
            "float: left;line-height: 20px\">    " +
            "<div class=\"div_inmod_head\" style=\"width: 100%;height: 20px;background-color: #E0ECFF;margin:0;border: 0;padding:0;border-bottom: 1px solid\">" +
            " <span style=\"float: left;margin-left: 2px\">详情</span>" +
            "<BUTTON style=\'float:right;aposition:static; width: 14px;height: 14px; margin: 0;margin-top: 2px;margin-right:2px;padding: 0;" +
            "background: url(../../ASSETS/IMAGE/close.png) no-repeat;border: 0px;vertical-align:top\' onclick=\"delete_div(\'div_bz\');\" type=submit></BUTTON> " +
            "</div> " +
            "<textarea class=\"div_inmod_lim_content\" style=\"width: 100%;height: 98px;overflow-x: hidden;margin:0;border: 0;padding:0\" contenteditable=\"false\"></textarea> </div>";
        this.html_onmouseover=//鼠标移入时弹出的小文本提示框
            "<div class=\"div_inmod_lim\" " +
            "style=\"width: 100%;height: 100%;margin: 0px;border: 1px solid;padding: 0px;float: left;line-height: 20px\">    " +
                "<textarea class=\"div_inmod_lim_content\" style=\"width: 100%;height: 100%;overflow-x: hidden;margin:0;border: 0;padding:0\" contenteditable=\"false\">" +
                "</textarea> " +
            "</div>";
    }
    catch(e)
    {
        console.log("表格初始化异常！"+e);
        return false;
    }
    return "ok";
}
Att7.prototype.draw=function(data,page_current)//实际绘制dom元素
{
    this.totalpages=0;//记录下一共有多少页
    if(this.rowsp>0)
    {
        this.totalpages=Math.ceil((data.length-4)/this.rowsp);
    }
    if(this.totalpages==0)
    {
        this.totalpages=1;
    }
    //计算当前页数
    if(page_current<0)
    {
        alert("到达数据首页！");
        this.page_current=0;
    }
    else if(page_current>=this.totalpages)
    {
        alert("到达数据末尾");
        this.page_current=this.totalpages-1;
    }
    else
    {
        this.page_current=page_current;
    }
    this.data=data;
    var tab_data;
    var tab_colmask;
    if (document.getElementById(this.id))//如果已有该表
    {//清理已有的dom
        tab_data= document.getElementById(this.id);
        var parent = tab_data.parentNode;
        parent.removeChild(tab_data);
        if(document.getElementById("div_thmask"))//删除锁定表头的遮罩层
        {
            var div =document.getElementById("div_thmask");
            div.parentNode.removeChild(div);
        }
        if(document.getElementById("tab_mask2"))//删除锁定表列的遮罩层
        {
            var tab =document.getElementById("tab_mask2");
            tab.parentNode.removeChild(tab);
        }
        if(document.getElementById("div_thmask3"))//
        {
            var tab =document.getElementById("div_thmask3");
            tab.parentNode.removeChild(tab);
        }
    }
    tab_data = document.createElement("table");
    tab_data.id = this.id;
    tab_data.cellPadding = "0";
    tab_data.cellSpacing = "0";
    tab_data.style.position = "absolute";
    //tab_data.style.top = this.top + "px";
    //tab_data.style.left = this.left + "px";
    var div_table;//包含表格的容器元素

    var obj=this.base;
    if((typeof obj)=="string"||(typeof obj)=="String")
    {
        div_table = document.getElementById(obj);
    }
    else
    {
        div_table=obj;
    }
    div_table.innerHTML="";
    div_table.appendChild(tab_data);
    this.div_table=div_table;
    tab_data = document.getElementById(this.id);

    var tr1 = document.createElement("tr");//填写表头
    if(this.showIndex==1)//如果显示索引列
    {
        this.InsertaTHStr(tr1, "第"+(this.page_current+1) + "页",this.str_indexwid);//IE8中缺少参数会报错
    }
    for (var k = 0; k < data[1].length; k++)
    {
        this.InsertaTHStr(tr1, data[1][k],(data[3][k]+"px"));
    }
    tab_data.appendChild(tr1);
    tr1.style.backgroundColor=this.baseColor;
    this.arr_lock=[];
    this.arr_locky=[];
    if(this.isThlocked==1)//绘制锁定表头的遮罩层
    {
        var div_thmask=document.createElement("div");
        div_thmask.className="div_mask2";
        div_thmask.id="div_thmask";
        div_thmask.style.zIndex="200";
        var div_parent=div_table.parentNode;
        this.div_parent=div_parent;
        div_thmask.style.top=(compPos2(div_table).top-parseInt(div_table.style.height.split("p")[0]))+this.top+"px";//定位添加的遮罩层
        div_thmask.style.left=compPos2(div_table).left+this.left+"px";
        div_thmask.style.width="6000px";//遮罩的最大宽度
        div_thmask.style.height="42px";
        div_thmask.style.top=this.num_toolhei+"px";
        //div_thmask.getElementsByTagName("table")[0].style.backgroundColor=this.baseColor;

        var tab_thmask= document.createElement("table");
        var tr_thmask=document.createElement("tr");
        if(this.showIndex==1)//如果不禁止索引列
        {
            this.InsertaTHStr(tr_thmask, "第" + (this.page_current + 1) + "页", this.str_indexwid);//IE8中缺少参数会报错
        }
        for (var k = 0; k < data[1].length; k++)
        {
            this.InsertaTHStr(tr_thmask, data[1][k],(data[3][k]+"px"));
        }
        tab_thmask.appendChild(tr_thmask);
        tab_thmask.style.backgroundColor=this.baseColor;
        div_thmask.appendChild(tab_thmask);
        div_parent.appendChild(div_thmask);
    }
    if(this.isCollocked>0)//绘制锁定表列的遮罩层，估计不需要外包装的div，可以和data_table共享div_table（考虑到层数决定这样做）
    {
        this.arr_lock.push(["tab_mask2",1,0]);//第一个参数是要锁定的标签的id，第二个是是否锁定，第三个是标签的初始水平偏移量
        this.arr_lock.push(["div_bz",0,0]);
        tab_colmask= document.createElement("table");
        tab_colmask.cellPadding = "0";
        tab_colmask.cellSpacing = "0";
        tab_colmask.style.position = "absolute";
        tab_colmask.className="div_mask2";
        tab_colmask.id="tab_mask2";
        tab_colmask.style.zIndex="150";
        tab_colmask.style.top="0px";
        tab_colmask.style.backgroundColor=this.baseColor
        var tr_mask= document.createElement("tr");//创造一个占位用的表头行
        if(this.showIndex==1)//如果不禁止索引列
        {
            this.InsertaTHStr(tr_mask, "第" + (this.page_current + 1) + "页", this.str_indexwid);
        }
        for (var k = 0; k < this.isCollocked-1; k++)
        {
            this.InsertaTHStr(tr_mask, data[1][k],(data[3][k]+"px"));
        }
        tab_colmask.appendChild(tr_mask);
    }
    //如果同时锁定了表头和左侧的表列
    if((this.isThlocked==1)&&(this.isCollocked>0))
    {
        this.arr_lock.push(["div_thmask3",1,0]);
        var div_thmask=document.createElement("div");
        div_thmask.className="div_mask2";
        div_thmask.id="div_thmask3";
        div_thmask.style.zIndex="250";
        var div_parent=div_table.parentNode;
        div_thmask.style.top=(compPos2(div_table).top-parseInt(div_table.style.height.split("p")))+"px";//定位添加的遮罩层
        div_thmask.style.left=compPos2(div_table).left+"px";
        div_thmask.style.width="4000px";
        div_thmask.style.height="42px";
        div_thmask.style.top=this.num_toolhei+"px";

        var tab_thmask= document.createElement("table");
        tab_thmask.style.backgroundColor=this.baseColor;
        var tr_thmask=document.createElement("tr");
        if(this.showIndex==1)//如果不禁止索引列
        {
            this.InsertaTHStr(tr_thmask, "第" + (this.page_current + 1) + "页", this.str_indexwid);//IE8中缺少参数会报错
        }
        for (var k = 0; k < this.isCollocked-1; k++)
        {
            this.InsertaTHStr(tr_thmask, data[1][k],(data[3][k]+"px"));
        }
        tab_thmask.appendChild(tr_thmask);
        div_thmask.appendChild(tab_thmask);
        div_parent.appendChild(div_thmask);
    }
    if (this.rowsp > 0)//默认必须要分页，数据的第一行是表名、第二行是列名、第三行是列设定、第四行是列宽、第五行开始是数据
    {
        var rows=this.rowsp;
        var pages=this.page_current;
        var collock=this.isCollocked;
        var count=0;//标记经过了几个没有数据源的列，存在按钮等不填写源数据的列时，data[2]会比data[l]长，为了让后面的类型和数据对应上，应该用m减去count！
        var count_none=0;//标记经过了几个使用数据源但不显示的列，
        for (var l = 4 + pages * rows; l < data.length && (l - pages * rows) < rows + 4; l++)
        {
            //dataObj2.push(data[l]);
            count=0;//绘制每一行时都把标记数设为0，其后每检测到一个标记就+1，data[l][m+count]从数据源取数
            count_none=0;
            var tr2 = document.createElement("tr");//填写一个表行
            var tr_mask = document.createElement("tr");//准备给遮罩层用
            if (l % 2 == 0&&this.isStripe==1)//偶数的数据行显示为浅灰色
            {
                tr2.style.backgroundColor = this.stripeColor;
                tr_mask.style.backgroundColor = this.stripeColor;
            }
            else
            {
                tr2.style.backgroundColor = this.baseColor;
                tr_mask.style.backgroundColor = this.baseColor;
            }
            if(this.showIndex==1)//如果不禁止索引列
            {
                this.InsertaTDPick(tr2, l - 3 + "");//这个是序号
                this.InsertaTDPick2(tr_mask, l - 3 + "", this.id);//遮罩层的序号
            }

            for (var m = 0; m < data[2].length; m++)//一行中的一个单元格，这里可能有多种变化，在length范围外的数据列不会被考虑
            {//根据数据源的第三个元素中存储的DOM信息，为数据的每一列设置不同的控件类型！！！！
                try
                {
                    if (data[2][m] == "str") //简单的字符类型，要限制下宽度！
                    {
                        this.InsertaTDStr(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                        if(this.isCollocked>0&&(m+1)<this.isCollocked)
                        {
                            this.InsertaTDStr(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
                        }
                    }
                    else if(data[2][m] == "num")//数字字符串类型，在前台规范化数字格式，暂时不加入自动四舍五入到某一位的功能
                    {
                        var str_num=data[l][m - count];
                        if(str_num==null||str_num==undefined)
                        {
                            str_num="";
                        }
                        else
                        {
                            if (str_num.substr(0, 1) == ".") {
                                str_num = "0" + str_num;
                            }
                            else if(str_num.substr(0, 2) == "-.")//考虑到负数
                            {
                                str_num="-0"+str_num.substring(1);
                            }
                        }
                        this.InsertaTDStr(tr2, str_num,(data[3][m-count_none]+"px"));
                        if(collock>0&&(m+1)<collock)
                        {
                            this.InsertaTDStr(tr_mask, str_num,(data[3][m-count_none]+"px"));
                        }
                        data[l][m - count]=str_num;//能省则省
                    }
                    else if(data[2][m] == "cash")//人民币字符串类型，小数点之后要有两位数字
                    {
                        var str_num=data[l][m - count];
                        if(str_num==null||str_num==undefined)
                        {
                            str_num="";
                        }
                        else
                        {
                            if (str_num.substr(0, 1) == ".") {
                                str_num = "0" + str_num;
                            }
                            else if(str_num.substr(0, 2) == "-.")//考虑到负数
                            {
                                str_num="-0"+str_num.substring(1);
                            }
                            if (str_num.indexOf(".") < 0) {
                                str_num = str_num + ".00";
                            }
                            else if (str_num.split(".")[1].length == 1) {
                                str_num = str_num + "0";
                            }
                        }
                        this.InsertaTDStr(tr2, str_num,(data[3][m-count_none]+"px"));
                        if(collock>0&&(m+1)<collock)
                        {
                            this.InsertaTDStr(tr_mask, str_num,(data[3][m-count_none]+"px"));
                        }
                        data[l][m - count]=str_num;//能省则省
                    }
                    else if(data[2][m] == "limit")//限制字符长度不能过长
                    {
                        this.InsertaTDStr_lim(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                        if(collock>0&&(m+1)<collock)
                        {
                            this.InsertaTDStr_lim(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
                        }
                    }
                    else if (data[2][m] == "none")//不显示的字符类型
                    {
                        var td = document.createElement("td");
                        td.appendChild(document.createTextNode(data[l][m - count]));
                        td.style.display = "none";
                        tr2.appendChild(td);
                        count_none++;
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td.cloneNode(true));
                        }
                    }
                    else if(data[2][m][0] == "switch")//不同的数据对应不同的显示值，如“1”对应“生效”
                    {
                        for (var i = 1; i < data[2][m].length; i++)
                        {
                            if (data[2][m][i][0] == data[l][m - count])
                            {
                                this.InsertaTDStr(tr2, data[2][m][i][1],(data[3][m-count_none]+"px"));
                                if(collock>0&&(m+1)<collock)
                                {
                                    this.InsertaTDStr(tr_mask, data[2][m][i][1],(data[3][m-count_none]+"px"));
                                }
                                break;
                            }
                            else if (i == data[2][m].length - 1) //如果没有显示值则显示原值
                            {
                                this.InsertaTDStr(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                                if(collock>0&&(m+1)<collock)
                                {
                                    this.InsertaTDStr(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
                                }
                            }
                        }
                    }
                    else if (data[2][m][0] == "input")//这个单元格可以被编辑
                    {
                        var td1 = document.createElement("td");
                        //td1.style.width = data[2][m][2];
                        td1.style.width =(data[3][m-count_none]+"px");
                        var input1 = document.createElement("input");
                        input1.type="text";
                        input1.className = data[2][m][1];//类名
                        input1.style.border = 0;
                        input1.style.width = data[2][m][2];//控件宽度
                        input1.style.textAlign = "center";
                        input1.style.backgroundColor="transparent";
                        input1.value = data[l][m - count];//显示原来未修改之前的值
                        /*input1.onchange = function ()//1.把修改写入暂存数组，2.把修改写入日志数组，3.单元格的样式变化
                         {
                         var evt = evt || window.event;
                         cancelPropagation(evt);//发现如果不阻断事件，会引发button1的click相应！！？？
                         var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;//被点击的obj
                         PushLog(obj,"update");//将这一个obj的变化存入log
                         //dataObj2[parseInt(this.parentNode.parentNode.firstChild.innerHTML)%150-1][parseInt(this.className.split("*")[1])]=this.value;
                         //this.style.color = "#ff0000";//被修改的单元格设为红色
                         };*/
                        for (var i = 3; i < data[2][m].length; i++) {
                            input1.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        td1.appendChild(input1);
                        tr2.appendChild(td1);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td1.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "select")//单元格是一个下拉框
                    {
                        var td2 = document.createElement("td");
                        //td2.style.width = "100px";
                        td2.style.width=(data[3][m-count_none]+"px");
                        var select = document.createElement("select");
                        select.className = data[2][m][1];
                        select.style.width = "100px";
                        select.selectedIndex=0;
                        var temp_i=0;//用来暂存下面的i
                        for (var i = 0; i < data[2][m][2].length; i++)
                        {
                            var option = document.createElement("option");
                            option.innerHTML = data[2][m][2][i][0];
                            if(data[2][m][2][i][1]) {//如果有的话也不介意设置一个value
                                option.value = data[2][m][2][i][1];
                            }
                            select.appendChild(option);
                            if(data[2][m][2][i][1]==data[l][m - count]||data[2][m][2][i][0]==data[l][m - count])//后台传过来的可能是value也可能是text！！
                            {
                                option.selected="selected";
                                select.selectedIndex=i;
                                temp_i=i;
                            }
                        }
                        listenEvent(select,"change",select_onchange);
                        select.datachange=data[2][m][3];
                        function select_onchange()
                        {
                            var evt = evt || window.event||arguments[0];
                            cancelPropagation(evt);//发现如果不阻断事件，会引发button1的click相应！！？？
                            var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
                            //dataObj2[parseInt(this.parentNode.parentNode.firstChild.innerHTML)%150-1][parseInt(this.className.split("*")[1])]=this.value;
                            eval((obj.getAttribute("datachange")?obj.getAttribute("datachange"):obj.datachange));
                        }
                        /*select.onchange=function()
                         {
                         var evt = evt || window.event;
                         cancelPropagation(evt);//发现如果不阻断事件，会引发button1的click相应！！？？
                         //dataObj2[parseInt(this.parentNode.parentNode.firstChild.innerHTML)%150-1][parseInt(this.className.split("*")[1])]=this.value;
                         eval(data[2][m][3]);
                         }*/
                        td2.appendChild(select);
                        tr2.appendChild(td2);
                        if(collock>0&&(m+1)<collock)//对于遮罩层
                        {
                            /*var td2a = document.createElement("td");
                             td2a.style.width=(data[3][m-count_none]+"px");
                             var selecta=select.cloneNode(true);
                             selecta.datachange=data[2][m][3];
                             td2a.appendChild(selecta);*/
                            var td2a=td2.cloneNode(true);
                            var selecta=td2a.childNodes[0];
                            selecta.datachange=data[2][m][3];
                            selecta.selectedIndex=temp_i;
                            tr_mask.appendChild(td2a);
                            listenEvent(selecta,"change",select_onchange);
                        }
                    }
                    else if (data[2][m][0] == "check")//单元格是一个单选框
                    {
                        var td3 = document.createElement("td");
                        td3.style.width=(data[3][m-count_none]+"px");
                        var check = document.createElement("input");
                        check.setAttribute("type", "checkbox");
                        check.className = data[2][m][1];
                        check.style.height="15px";
                        check.style.width="15px";
                        if (data[2][m][2] == "0")//这里设置了两种默认情况
                        {
                            check.checked = false;
                        }
                        else {
                            check.checked = true;
                        }
                        if (data[l][m - count] == "1")//实际情况
                        {
                            check.checked = true;
                        }
                        td3.appendChild(check);
                        tr2.appendChild(td3);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td3.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "button")//单元格是一个按钮
                    {
                        var td4 = document.createElement("td");
                        td4.style.width = (data[3][m-count_none]+"px");
                        var button = document.createElement("button");
                        button.className = data[2][m][1];
                        button.innerHTML = data[2][m][2];
                        button.style.width = data[2][m][3];
                        button.style.position = "static";//这里如果是absolute反而会坏事！
                        //button.style.top="0px";
                        //button.style.left="0px";
                        for (var i = 4; i < data[2][m].length; i++) {
                            button.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        td4.appendChild(button);
                        tr2.appendChild(td4);
                        count++;
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td4.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "a")//单元格是一个超链接
                    {
                        var td5 = document.createElement("td");
                        td5.style.width = (data[3][m-count_none]+"px");
                        var a = document.createElement("a");
                        a.innerHTML = data[l][m - count]?data[l][m - count]:"";
                        a.className = data[2][m][1];//超链接的类名
                        a.style.position = "static";//这里如果是absolute反而会坏事！
                        for (var i = 2; i < data[2][m].length; i++) {//通过循环可以给这个链接添加不定个数的属性，包括href和事件属性
                            a.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        td5.appendChild(a);
                        tr2.appendChild(td5);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "open")//单元格是一个锚点链接，点击之后在DOM中打开一个mod，单元格内的内容由自定义的函数返回值决定！！！！
                    {
                        var td5 = document.createElement("td");
                        td5.style.width = (data[3][m-count_none]+"px");
                        var a = document.createElement("a");
                        a.innerHTML = eval((data[2][m][2]+"('"+(data[l][m - count]?data[l][m - count].replace("\n",""):"")+"')"));//data[l][m - count];eval处理\n有歧义！！
                        a.data=data[l][m - count];//把原始信息也保留下来
                        a.title=data[l][m - count];
                        a.className = data[2][m][1];//超链接的类名
                        a.style.position = "static";//这里如果是absolute反而会坏事！
                        for (var i = 3; i < data[2][m].length; i++) {//通过循环可以给这个链接添加不定个数的属性，包括href和事件属性
                            a.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        td5.appendChild(a);
                        tr2.appendChild(td5);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "mod")//单元格是一个小模块（不占用数据列）
                    {
                        var td5 = document.createElement("td");
                        td5.innerHTML=document.getElementById(data[2][m][1]).innerHTML;
                        //td5.innerHTML=$("#"+data[2][m][1])[0].innerHTML;//这个库尽量保持原生
                        tr2.appendChild(td5);
                        count++;
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "mod_data")//单元格是一个小模块（占用一个数据列）
                    {
                        var td5 = document.createElement("td");
                        td5.innerHTML=document.getElementById(data[2][m][1]).innerHTML;
                        //td5.innerHTML=$("#"+data[2][m][1])[0].innerHTML;//这个库尽量保持原生
                        tr2.appendChild(td5);
                        //count++;
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "strp")//单元格是一个可以推入属性的字符串，并且在单元格中记录数据所在的行数和列数
                    {
                        var td5 = document.createElement("td");
                        td5.style.width = (data[3][m-count_none]+"px");
                        td5.innerHTML=data[l][m - count];
                        td5.index_col=m-count_none;//列索引
                        td5.index_row=l-3;//行索引
                        for (var i = 1; i < data[2][m].length; i++) {//通过循环可以给这个链接添加不定个数的属性，包括href和事件属性
                            td5.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        tr2.appendChild(td5);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }
                    else if (data[2][m][0] == "img")//单元格是一个以数据作为src属性的图片
                    {
                        var td5 = document.createElement("td");
                        td5.style.width = (data[3][m-count_none]+"px");
                        var img=document.createElement("img");
                        img.style.border=0;
                        img.style.padding=0;
                        img.style.margin=0;
                        img.style.height=data[2][m][1];//使用push的参数？
                        img.style.width=data[2][m][2];
                        img.src=UrlHead+"Cook.ashx?method=post&func=downloadfile&filename="+data[l][m - count];
                        img.alt="没有图片";

                        for (var i = 3; i < data[2][m].length; i++) {//通过循环可以给这个链接添加不定个数的属性，包括href和事件属性
                            img.setAttribute(data[2][m][i][0], data[2][m][i][1]);
                        }
                        td5.appendChild(img);
                        tr2.appendChild(td5);
                        if(collock>0&&(m+1)<collock)
                        {
                            tr_mask.appendChild(td5.cloneNode(true));
                        }
                    }

                }
                catch(e)
                {
                    this.InsertaTDStr(tr2,"ERROR!",(data[3][m-count_none]+"px"));
                    if(collock!=null&&collock>0&&(m+1)<collock)
                    {
                        this.InsertaTDStr(tr_mask,"ERROR!",(data[3][m-count_none]+"px"));
                    }
                    continue;//如果这个单元格出了问题
                }
            }
            tab_data.appendChild(tr2);
            if(collock!=null&&collock>0)
            {
                tab_colmask.appendChild(tr_mask);
            }
        }
        if(collock!=null&&collock>0) {
            div_table.appendChild(tab_colmask);
        }
    }
}
//一些工具方法
/**
 * 向一个表行中添加字符型表头元素
 * @param tr 表行ID
 * @param str 添加字符
 * @param wid 列宽（字符型px）
 * @constructor
 */
Att7.prototype.InsertaTHStr=function(tr,str,wid)
{
    var th=document.createElement("th");
    th.style.width=wid?wid:"200px";
    if(str==null)
    {
        str="";
    }
    th.appendChild(document.createTextNode(str));
    tr.appendChild(th);
}
/**
 * 向一个表行中添加字符型单元格元素
 * @param tr 表行ID
 * @param str 添加字符
 * @param wid 列宽
 * @constructor
 */
Att7.prototype.InsertaTDStr=function(tr,str,wid)
{
    var td=document.createElement("td");
    td.style.width=wid?wid:"200px";
    if(str==null)
    {
        str="";
    }
    td.appendChild(document.createTextNode(str));
    tr.appendChild(td);
}
//限制宽度
Att7.prototype.InsertaTDStr_lim= function(tr,str,wid,charwid)
{
    var td=document.createElement("td");
    td.style.width=wid?wid:"200px";
    td.style.position="relative";
    if(str==null)
    {
        str="";
    }
    var num_wid=parseInt(wid.split("px")[0]);
    var input1 = document.createElement("input");
    input1.type="text";
    input1.style.border = 0;
    input1.style.width =num_wid+"px" ;//控件宽度
    input1.style.textAlign = "center";
    input1.style.backgroundColor="transparent";
    input1.style.float="left";
    input1.value=str;
    input1.readOnly=true;
    /*input1.onfocus=function(evt){
     this.blur();这样就不能复制粘贴了！
     }*/

    if(!charwid)//如果没有设置字宽
    {
        charwid=10;
    }
    if((str.length*charwid)>(num_wid*2))//如果文字的长度超过了单元格宽度的两倍
    {
        //td.title=str;
        //td.overflow="hidden";
        //str=(str.substr(0,(num_wid*2/10).toFixed()) +"...");
        //尝试在右侧加一个弹出小按钮？
        //str=(str.substr(0,(num_wid*2/10).toFixed()) );
        input1.style.width =(num_wid-30)+"px" ;
        td.appendChild(input1);
        var btn =document.createElement("button");
        btn.className="btn_limlen";
        btn.title=str;
        var _this=this;
        btn.onclick=function()//通过点击打开的弹出框需要一个关闭按钮，通过鼠标移入打开的弹出框则随移出自动关闭
        {
            /*if(clipboardData) {
             clipboardData.clearData();
             clipboardData.setData("text", str);
             }
             else */
            /*
             if(event.clipboardData)

             {//火狐？
             event.clipboardData.clearData();
             event.clipboardData.setData("text/plain", str);
             alert("内容已复制到剪贴板");
             }
             else if(window.clipboardData)
             {//IE
             window.clipboardData.clearData();
             window.clipboardData.setData("text", str);
             alert("内容已复制到剪贴板");
             }
             */
            //clipboardData.getData("text");
            var evt=evt||window.event||arguments[0];
            cancelPropagation(evt);
            var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
            if(delete_div("div_bz")>0)
            {
                //return;
            }
            Open_div("", "div_bz", 240, 120, 0, 0, obj, "div_tab");
            //var target={top:,left:}//lim保持不变，尝试添加lim2
            //Open_div2("div_bz", "div_bz", 240, 120, 0, 0, obj, "div_tab");
            document.querySelectorAll("#div_bz")[0].innerHTML = _this.html_onclick;//向弹出项里写入结构
            document.querySelectorAll("#div_bz .div_inmod_lim_content")[0].innerHTML = str;
        }
        td.appendChild(btn);
    }
    else
    {
        td.appendChild(input1);
    }

    tr.appendChild(td);
}
//一个可以被选中的单元格，选中后改变单元格所在表行的颜色以突出显示
Att7.prototype.InsertaTDPick=function (tr,str)
{
    var td=document.createElement("td");
    td.appendChild(document.createTextNode(str));
    td.style.cursor="crosshair";
    var _this=this;
    td.onclick=function()
    {//考虑到浏览器可能扇子更改背景颜色样式的字符串表示，使用一个不显示的div进行比对
        if(td.parentNode.style.backgroundColor!=_this.div_temp3.style.backgroundColor)
        {//如果还没变色
            td.parentNode.style.backgroundColor=_this.pickColor;
        }
        else
        {
            if(_this.isStripe==1)
            {
                //如果已经变色
                if(parseInt(td.innerHTML)%2==0)
                {
                    td.parentNode.style.backgroundColor = _this.baseColor;
                }
                else
                {
                    td.parentNode.style.backgroundColor = _this.stripeColor;
                }
            }
            else
            {
                td.parentNode.style.backgroundColor = _this.baseColor;
            }
        }
    };
    tr.appendChild(td);
}
//这个给遮罩层用,id是表实体的id
Att7.prototype.InsertaTDPick2=function (tr,str,id)
{
    var td=document.createElement("td");
    td.appendChild(document.createTextNode(str));
    td.style.cursor="crosshair";
    td.style.width="50px";
    var _this=this;
    td.onclick=function()
    {//526DA5
        if(td.parentNode.style.backgroundColor!=_this.div_temp3.style.backgroundColor)
        {
            td.parentNode.style.backgroundColor=_this.pickColor;//修改遮罩层
            ChangeTable(td,_this.pickColor);
        }
        else
        {
            if(_this.isStripe==1)
            {
                if(parseInt(td.innerHTML)%2==0)
                {
                    td.parentNode.style.backgroundColor = _this.baseColor;
                    ChangeTable(td,_this.baseColor);
                }
                else
                {
                    td.parentNode.style.backgroundColor = _this.stripeColor;
                    ChangeTable(td,_this.stripeColor);
                }
            }
            else
            {

            }
        }
    };
    function ChangeTable(obj,color)
    {
        var trs=document.getElementById(id).getElementsByTagName("tr")//找实体表然后去修改
        var leng=trs.length;
        for(var i=1;i<leng;i++)
        {
            if(obj.innerHTML==trs[i].getElementsByTagName("td")[0].innerHTML)
            {
                trs[i].getElementsByTagName("td")[0].parentNode.style.backgroundColor=color;
            }
        }
    }
    tr.appendChild(td);
}
//不断修正让遮罩层的宽高和底层一致
Att7.prototype.AdjustWidth=function()
{
    if(document.getElementById("div_thmask"))
    {
        var ths_mask = document.getElementById("div_thmask").getElementsByTagName("th");
        var ths = document.getElementById(this.id).getElementsByTagName("th");
        if (ths[0].offsetWidth) {
            this.div_table.style.height=this.div_parent.offsetHeight-this.num_toolhei-12+"px";
            var leng = ths.length;
            for (var i = 0; i < leng; i++) {
                try {
                    ths_mask[i].style.width = (ths[i].offsetWidth - 3) + "px";
                }
                catch (e) {
                    //i--;
                    continue;
                }
            }
            if (document.getElementById("div_thmask3")) {
                var div_thmask3 = document.getElementById("div_thmask3").getElementsByTagName("th");
                var leng2 = div_thmask3.length;
                for (var i = 0; i < leng2; i++) {
                    div_thmask3[i].style.width = (ths[i].offsetWidth - 3) + "px";
                }
            }
            if (document.getElementById("tab_mask2"))
            {
                var trs_mask = document.getElementById("tab_mask2").getElementsByTagName("tr");
                var trs = document.getElementById(this.id).getElementsByTagName("tr");
                var leng3 = trs.length;
                for (var i = 1; i < leng3; i++)
                {
                    trs_mask[i].style.height =(trs[i].offsetHeight)+"px";
                }
            }
        }
        else {
            var _this=this;
            requestAnimFrame(function () {
                _this.AdjustWidth()
            });
        }
    }
}
//翻页处理
Att7.prototype.ChangePage=function(flag)
{
    document.body.style.cursor='wait';
    switch(flag)//不同的翻页动作对应不同的页号处理
    {
        case "0":
        {
            this.page_current=0;
            break;
        }
        case "+":
        {
            this.page_current++;
            break;
        }
        case "-":
        {
            this.page_current--;
            break;
        }
        case "9999":
        {
            this.page_current=9999;
            break;
        }
    }
    this.draw(this.data,this.page_current);
    document.getElementById('t_page_span').innerHTML=this.totalpages;
    try {//万一没有定义
        AdjustColor();
    }
    catch(e)
    {

    }
    document.getElementById('c_page_span').innerHTML=this.page_current+1;
    document.body.style.cursor='default';
    var _this=this;
    try
    {
        requestAnimFrame(function () {
            _this.AdjustWidth()
        });
    }
    catch(e)
    {

    }
}
Att7.prototype.ScrollLock=function()//拖动滑动条时，弹出层随拖动一同移动
{
    var mask2left=0;
    var mask2top=0;
    var scrollleft=document.getElementById("all_base").scrollLeft;//scrollLeft指滑动条向右滑动的距离
    var scrolltop=document.getElementById("all_base").scrollTop;
    var arr_lock=this.arr_lock;
    var arr_locky=this.arr_locky;
    var leng=arr_lock.length;
    for(var i=0;i<leng;i++)
    {
        if(arr_lock[i][1]==1)
        {
            //$("#"+arr_lock[i][0]).css("left",mask2left+scrollleft+arr_lock[i][2]+"px");
            document.getElementById(arr_lock[i][0]).style.left=mask2left+scrollleft+arr_lock[i][2]+"px";
        }
    }
    var leng2=arr_locky.length;
    for(var i=0;i<leng2;i++)
    {
        if(arr_locky[i][1]==1)
        {
            //$("#"+arr_locky[i][0]).css("top",mask2top+scrolltop+arr_locky[i][2]+"px");
            document.getElementById(arr_locky[i][0]).style.top=mask2top+scrolltop+arr_locky[i][2]+"px";
        }
    }
}
// Copyright 2010, Google Inc.
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000/60);
        };
})();

