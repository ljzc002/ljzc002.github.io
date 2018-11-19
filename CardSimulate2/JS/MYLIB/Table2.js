/**
 * Created by Administrator on 2015/5/11.
 */
//动态画表类，尝试使用自包含结构
    //2016/8/31在表格中加入更多的格式选择
var pages=0;
var html_lim="<div class=\"div_inmod_lim\" style=\"width: 100%;height: 100%;margin: 0px;border: 1px solid;padding: 0px;float: left;line-height: 20px\">    <div class=\"div_inmod_head\" style=\"width: 100%;height: 20px;background-color: #E0ECFF;margin:0;border: 0;padding:0;border-bottom: 1px solid\"> <span style=\"float: left;margin-left: 2px\">详情</span><BUTTON style=\'float:right;aposition:static; width: 14px;height: 14px; margin: 0;margin-top: 2px;margin-right:2px;padding: 0;background: url(../../IMAGE/close.png) no-repeat;border: 0px;vertical-align:top\' onclick=\"delete_div(\'div_bz\');\" type=submit></BUTTON> </div> <textarea class=\"div_inmod_lim_content\" style=\"width: 100%;height: 98px;overflow-x: hidden;margin:0;border: 0;padding:0\" contenteditable=\"false\"></textarea> </div>";
var att6=
{

    /**
     * 向一个表行中添加字符型表头元素
     * @param tr 表行ID
     * @param str 添加字符
     * @param wid 列宽（字符型px）
     * @constructor
     */
    InsertaTHStr:function(tr,str,wid)//这样的是“静态函数”?
    {
        var th=document.createElement("th");
        th.style.width=wid;
        if(str==null)
        {
            str="";
        }
        th.appendChild(document.createTextNode(str));
        tr.appendChild(th);
    },
    /*InsertaTHStr:function(tr,str)
    {
        var th=document.createElement("th");
        if(str==null)
        {
            str="";
        }
        th.appendChild(document.createTextNode(str));
        tr.appendChild(th);
    },*/
    /**
     * 向一个表行中添加字符型单元格元素
     * @param tr 表行ID
     * @param str 添加字符
     * @param wid 列宽
     * @constructor
     */
    InsertaTDStr:function(tr,str,wid)
    {
        var td=document.createElement("td");
        td.style.width=wid;
        if(str==null)
        {
            str="";
        }
        td.appendChild(document.createTextNode(str));
        tr.appendChild(td);
    },
    InsertaTDStr_lim:function(tr,str,wid)//限制宽度
    {
        var td=document.createElement("td");
        td.style.width=wid;
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


        if((str.length*10)>(num_wid*2))//如果过长
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
            btn.onclick=function()
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
                delete_div("div_bz");
                Open_div("", "div_bz", 240, 120, 0, 0, obj, "div_tab");
                $("#div_bz")[0].innerHTML = html_lim;//向弹出项里写入结构
                $("#div_bz .div_inmod_lim_content")[0].innerHTML = str;
            }
            td.appendChild(btn);
        }
        else
        {
            td.appendChild(input1);
        }

        tr.appendChild(td);
    },
    /*InsertaTDStr:function (tr,str)
    {
        var td=document.createElement("td");
        if(str==null)
        {
            str="";
        }
        td.innerHTML=str;
        //td.appendChild(document.createTextNode(str));
        tr.appendChild(td);
    },*/
    InsertaTDPick:function (tr,str)//一个可以被选中的表行
    {
        var td=document.createElement("td");
        td.appendChild(document.createTextNode(str));
        td.style.cursor="crosshair";
        td.onclick=function()
        {//526DA5
            if(td.parentNode.style.backgroundColor!="#97ceef"&&td.parentNode.style.backgroundColor!="#97CEEF"&&td.parentNode.style.backgroundColor!="rgb(151, 206, 239)")
            {
                td.parentNode.style.backgroundColor="#97ceef";
            }
            else
            {
                if(parseInt(td.innerHTML)%2==0)
                {
                    td.parentNode.style.backgroundColor = "#ffffff";
                }
                else
                {
                    td.parentNode.style.backgroundColor = "#eeeeee";
                }
            }
        };
        tr.appendChild(td);
    },
    InsertaTDPick2:function (tr,str,id)//这个给遮罩层用,id是表实体的id
    {
        var td=document.createElement("td");
        td.appendChild(document.createTextNode(str));
        td.style.cursor="crosshair";
        td.style.width="50px";
        td.onclick=function()
        {//526DA5
            if(td.parentNode.style.backgroundColor!="#97ceef"&&td.parentNode.style.backgroundColor!="#97CEEF"&&td.parentNode.style.backgroundColor!="rgb(151, 206, 239)")
            {
                td.parentNode.style.backgroundColor="#97ceef";//修改遮罩层
                ChangeTable(td,"#97ceef");
            }
            else
            {
                if(parseInt(td.innerHTML)%2==0)
                {
                    td.parentNode.style.backgroundColor = "#ffffff";
                    ChangeTable(td,"#ffffff");
                }
                else
                {
                    td.parentNode.style.backgroundColor = "#eeeeee";
                    ChangeTable(td,"#eeeeee");
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
    },
    PickColor:function()//使用很少，考虑去掉
    {
        var evt=evt||window.event||arguments[0];
        cancelPropagation(evt);
        var tr=evt.currentTarget?evt.currentTarget:evt.srcElement;
        if(tr.style.backgroundColor!="#97ceef"&&tr.style.backgroundColor!="#97CEEF"&&tr.style.backgroundColor!="rgb(151, 206, 239)")
        {
            tr.style.backgroundColor="#97ceef";
        }
        else
        {
            if(parseInt(tr.childNodes[0].innerHTML)%2==0)
            {
                tr.style.backgroundColor = "#ffffff";
            }
            else
            {
                tr.style.backgroundColor = "#eeeeee";
            }
        }
    },
    /**
     * 在指定元素内的指定位置建立表格，如果已经存在相同ID的表格，则删除原表重绘新表，规定这样的表具有全局性，不能局部构建！！
     * 这个表是部分动态的，表头行是不能锁定的，表列根据不同的参数决定使用不同的元素
     * 在处理button这种没有数据源的列时，要在数据源中给它一个列或者在循环时做移位处理
     * 下面要在表格中加入控制行，控制行中有翻页类图标，数据控制类图标，调试类图标，后来发现集成度还达不到这么高，故而还是分开做
     * @param obj 在哪个元素之内
     * @param id 表格id
     * @param left
     * @param top
     * @param data 表格元素的数组，规定第一行为表名(在表名行里加上key？)，第二行为列名，第三行为列类型数组，第四行为列宽，第五行开始为数据
     * @param rows 表示每页显示多少行数据，<=0表示在本页显示全部
     * @param pages 表示要显示第几页，配合外部记录页数的变量完成翻页动作,这里要注意到page和pages的区别，参数变量会覆盖掉全局变量！！
     * @param color 是否使用间隔色，1表示使用
     * 20160504修改：
     * thlock表头是否锁定，1表示锁定，默认0
     * collock从左边开始锁定几个表列，默认0表示不锁定也不绘制序号列
     * 20160831修改
     * index是否显示最左侧的索引号，1表示显示，默认为一
     * @constructor
     */
    ArrayToTable6:function(obj,id,left,top,data,rows,page,color,thlock,collock,index)
    {
        pages=page;
        var totalpages=0;//记录下一共有多少页
        totalpages=Math.ceil((data.length-4)/rows);
        if(totalpages==0)
        {
            totalpages=1;
        }
        /*totalpages=((data.length-4)/rows).toFixed(0);
        if(((data.length-4)%rows)<(rows/2))
        {
            totalpages++;
        }*/
        if(pages<0)
        {
            alert("到达数据首页！");
            pages=0;
        }
        else if(pages>=totalpages)//((pages+1)*rows-(data.length-4)>=rows)
        {
            alert("到达数据末尾");
            //page--;
            pages=totalpages-1;
            /*pages=((data.length-4)/rows).toFixed(0)-1;
            if(((data.length-4)%rows)<150)
            {
                pages++;
            }*/
        }
        //else
        //{
        var str_indexwid="100px";
            var data_table;
            var tab_colmask;
            if (document.getElementById(id))//如果已有该表
            {
                data_table = document.getElementById(id);
                var parent = data_table.parentNode;
                parent.removeChild(data_table);
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
            data_table = document.createElement("table");
            data_table.id = id;
            //data_table.style.border="1";
            data_table.cellPadding = "0";
            data_table.cellSpacing = "0";
            data_table.style.position = "absolute";
            data_table.style.top = top + "px";
            data_table.style.left = left + "px";
            //data_table.eval("style.left")="100px";
            var div_table = document.getElementById(obj);
            div_table.innerHTML="";
            div_table.appendChild(data_table);
            data_table = document.getElementById(id);

            var tr1 = document.createElement("tr");//填写表头
            if(index==null||index==1)//如果不禁止索引列
            {
                att6.InsertaTHStr(tr1, "第"+(pages+1) + "页",str_indexwid);//IE8中缺少参数会报错
            }
            for (var k = 0; k < data[1].length; k++)
            {
                att6.InsertaTHStr(tr1, data[1][k],(data[3][k]+"px"));
            }
            data_table.appendChild(tr1);
            if(thlock!=null&&thlock==1)//绘制锁定表头的遮罩层
            {
                var div_thmask=document.createElement("div");
                div_thmask.className="div_mask2";
                div_thmask.id="div_thmask";
                div_thmask.style.zIndex="200";
                var div_parent=document.getElementById(obj).parentNode;
                div_thmask.style.top=(compPos2(div_table).top-parseInt(div_table.style.height.split("p")[0]))+top+"px";//定位添加的遮罩层
                div_thmask.style.left=compPos2(div_table).left+left+"px";
                div_thmask.style.width="6000px";
                div_thmask.style.height="42px";
                div_thmask.style.backgroundColor="#ffffff";

                var tab_thmask= document.createElement("table");
                var tr_thmask=document.createElement("tr");
                if(index==null||index==1)//如果不禁止索引列
                {
                    att6.InsertaTHStr(tr_thmask, "第" + (pages + 1) + "页", str_indexwid);//IE8中缺少参数会报错
                }
                for (var k = 0; k < data[1].length; k++)
                {
                    att6.InsertaTHStr(tr_thmask, data[1][k],(data[3][k]+"px"));
                }
                tab_thmask.appendChild(tr_thmask);
                div_thmask.appendChild(tab_thmask);
                div_parent.appendChild(div_thmask);
            }
            if(collock!=null&&collock>0)//绘制锁定表列的遮罩层，估计不需要外包装的div，可以和data_table共享div_table（考虑到层数决定这样做）
            {
                arr_lock.push(["tab_mask2",1,0]);//第一个参数是要锁定的标签的id，第二个是是否锁定，第三个是标签的初始水平偏移量
                arr_lock.push(["div_bz",0,0]);
                tab_colmask= document.createElement("table");
                tab_colmask.cellPadding = "0";
                tab_colmask.cellSpacing = "0";
                tab_colmask.style.position = "absolute";
                tab_colmask.className="div_mask2";
                tab_colmask.id="tab_mask2";
                tab_colmask.style.zIndex="150";
                tab_colmask.style.top="0px";
                tab_colmask.style.backgroundColor="#ffffff";
                var tr_mask= document.createElement("tr");//创造一个占位用的表头行
                if(index==null||index==1)//如果不禁止索引列
                {
                    att6.InsertaTHStr(tr_mask, "第" + (pages + 1) + "页", str_indexwid);
                }
                for (var k = 0; k < collock-1; k++)
                {
                    att6.InsertaTHStr(tr_mask, data[1][k],(data[3][k]+"px"));
                }
                tab_colmask.appendChild(tr_mask);
            }
            //如果同时锁定了表头和左侧的表列
            if((thlock!=null&&thlock==1)&&(collock!=null&&collock>0))
            {
                arr_lock.push(["div_thmask3",1,0]);
                var div_thmask=document.createElement("div");
                div_thmask.className="div_mask2";
                div_thmask.id="div_thmask3";
                div_thmask.style.zIndex="250";
                var div_parent=document.getElementById(obj).parentNode;
                div_thmask.style.top=(compPos2(div_table).top-parseInt(div_table.style.height.split("p")))+"px";//定位添加的遮罩层
                div_thmask.style.left=compPos2(div_table).left+"px";
                div_thmask.style.width="4000px";
                div_thmask.style.height="42px";


                var tab_thmask= document.createElement("table");
                tab_thmask.style.backgroundColor="#ffffff";
                var tr_thmask=document.createElement("tr");
                if(index==null||index==1)//如果不禁止索引列
                {
                    att6.InsertaTHStr(tr_thmask, "第" + (pages + 1) + "页", str_indexwid);//IE8中缺少参数会报错
                }
                for (var k = 0; k < (collock-1); k++)
                {
                    att6.InsertaTHStr(tr_thmask, data[1][k],(data[3][k]+"px"));
                }
                tab_thmask.appendChild(tr_thmask);
                div_thmask.appendChild(tab_thmask);
                div_parent.appendChild(div_thmask);
            }
            if(color==null)//默认使用间隔色
            {
                color=1;
            }
            //如果这是一个单窗口多页面表格系统则还需要一个全局变量保存每个页面中的翻页情况，如果是单窗口单页面表格则不需要了
            //dataObj3[tab_no_now] = pages;//表示第几个表翻到第几页
            if (rows > 0)//默认必须要分页
            {
                var count=0;//标记经过了几个没有数据源的列，存在按钮等不填写源数据的列时，data[2]会比data[l]长，为了让后面的类型和数据对应上，应该用m减去count！
                var count_none=0;//标记经过了几个使用数据源但不显示的列，
                for (var l = 4 + pages * rows; l < data.length && (l - pages * rows) < rows + 4; l++)
                {
                    //dataObj2.push(data[l]);
                    count=0;//绘制每一行时都把标记数设为0，其后每检测到一个标记就+1，data[l][m+count]从数据源取数
                    count_none=0;
                    var tr2 = document.createElement("tr");//填写一个表行
                    var tr_mask = document.createElement("tr");//准备给遮罩层用
                    if (l % 2 == 0&&color==1)//偶数的数据行显示为浅灰色
                    {
                        tr2.style.backgroundColor = "#eeeeee";
                        tr_mask.style.backgroundColor = "#eeeeee";
                    }
                    if(index==null||index==1)//如果不禁止索引列
                    {
                        att6.InsertaTDPick(tr2, l - 3 + "");//这个是序号
                        att6.InsertaTDPick2(tr_mask, l - 3 + "", id);//遮罩层的序号
                    }

                    for (var m = 0; m < data[2].length; m++)//一行中的一个单元格，这里可能有多种变化，在length范围外的数据列不会被考虑
                    {//根据数据源的第三个元素中存储的DOM信息，为数据的每一列设置不同的控件类型！！！！
                        try
                        {
                            if (data[2][m] == "str") //简单的字符类型，要限制下宽度！
                            {
                                att6.InsertaTDStr(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                                if(collock!=null&&collock>0&&(m+1)<collock)
                                {
                                    att6.InsertaTDStr(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
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
                                att6.InsertaTDStr(tr2, str_num,(data[3][m-count_none]+"px"));
                                if(collock!=null&&collock>0&&(m+1)<collock)
                                {
                                    att6.InsertaTDStr(tr_mask, str_num,(data[3][m-count_none]+"px"));
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
                                att6.InsertaTDStr(tr2, str_num,(data[3][m-count_none]+"px"));
                                if(collock!=null&&collock>0&&(m+1)<collock)
                                {
                                    att6.InsertaTDStr(tr_mask, str_num,(data[3][m-count_none]+"px"));
                                }
                                data[l][m - count]=str_num;//能省则省
                            }
                            else if(data[2][m] == "limit")//限制字符长度不能过长
                            {
                                att6.InsertaTDStr_lim(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                                if(collock!=null&&collock>0&&(m+1)<collock)
                                {
                                    att6.InsertaTDStr_lim(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
                                }
                            }
                            else if (data[2][m] == "none")//不显示的字符类型
                            {
                                var td = document.createElement("td");
                                td.appendChild(document.createTextNode(data[l][m - count]));
                                td.style.display = "none";
                                tr2.appendChild(td);
                                count_none++;
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                        att6.InsertaTDStr(tr2, data[2][m][i][1],(data[3][m-count_none]+"px"));
                                        if(collock!=null&&collock>0&&(m+1)<collock)
                                        {
                                            att6.InsertaTDStr(tr_mask, data[2][m][i][1],(data[3][m-count_none]+"px"));
                                        }
                                        break;
                                    }
                                    else if (i == data[2][m].length - 1) //如果没有显示值则显示原值
                                    {
                                        att6.InsertaTDStr(tr2, data[l][m - count],(data[3][m-count_none]+"px"));
                                        if(collock!=null&&collock>0&&(m+1)<collock)
                                        {
                                            att6.InsertaTDStr(tr_mask, data[l][m - count],(data[3][m-count_none]+"px"));
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)//对于遮罩层
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
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
                                if(collock!=null&&collock>0&&(m+1)<collock)
                                {
                                    tr_mask.appendChild(td5.cloneNode(true));
                                }
                            }

                        }
                        catch(e)
                        {
                            att6.InsertaTDStr(tr2,"ERROR!",(data[3][m-count_none]+"px"));
                            if(collock!=null&&collock>0&&(m+1)<collock)
                            {
                                att6.InsertaTDStr(tr_mask,"ERROR!",(data[3][m-count_none]+"px"));
                            }
                            continue;//如果这个单元格出了问题
                        }
                    }
                    data_table.appendChild(tr2);
                    if(collock!=null&&collock>0)
                    {
                        tab_colmask.appendChild(tr_mask);
                    }
                }
                if(collock!=null&&collock>0) {
                    div_table.appendChild(tab_colmask);
                }
            }
        return totalpages;
    },
    AdjustWidth:function()
    {
        if(document.getElementById("div_thmask"))
        {
            var ths_mask = document.getElementById("div_thmask").getElementsByTagName("th");
            var ths = document.getElementById("tab_data").getElementsByTagName("th");
            if (ths[0].offsetWidth) {
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
                    var trs = document.getElementById("tab_data").getElementsByTagName("tr");
                    var leng3 = trs.length;
                    for (var i = 1; i < leng3; i++)
                    {
                        trs_mask[i].style.height =(trs[i].offsetHeight)+"px";
                    }
                }
            }
            else {
                requestAnimFrame(function () {
                    att6.AdjustWidth()
                });
            }
        }
    },
    ChangePage:function(flag,obj,id,left,top,data,rows,color,thlock,collock,index)
    {
        document.body.style.cursor='wait';
        switch(flag)//不同的翻页动作对应不同的页号处理
        {
            case "0":
            {
                pages=-1;
                break;
            }
            case "+":
            {
                pages++;
                break;
            }
            case "-":
            {
                pages--;
                break;
            }
            case "9999":
            {
                pages=9999;
                break;
            }
        }
        document.getElementById('t_page_span').innerHTML=att6.ArrayToTable6(obj,id,left,top,data,rows,pages,color,thlock,collock,index);
        try {//万一没有定义
            AdjustColor();
        }
        catch(e)
        {

        }
        document.getElementById('c_page_span').innerHTML=pages+1;
        document.body.style.cursor='default';
        try
        {
            requestAnimFrame(function () {
                att6.AdjustWidth()
            });
        }
        catch(e)
        {

        }
    }

};



