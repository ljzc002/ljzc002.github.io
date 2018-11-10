/**
 * Created by Administrator on 2015/3/2.
 */
/**
 * 将指定字符写入指定名称的文本文件中，并可以选择本地保存目录，兼容IE11和谷歌浏览器
 */
function DownloadText(filename,content,filetype)
{
    if(filetype==null)
    {
        filetype=".txt";
    }
    if(document.createElement("a").download!=null)//谷歌和火狐
    {
        var aLink = document.createElement('a');
        var datatype="data:text/plain;charset=UTF-8,";
        if(filetype==".xml")
        {
            datatype="data:text/xml;charset=UTF-8,";
        }
        if(filetype==".babylon")
        {//浏览器还没有支持babylon的mime类型！！
            datatype="data:text/plain;charset=UTF-8,";
        }
        if(filetype==".png"||filetype==".jpeg")
        {
            datatype="";
        }
        if(content.length<1000000)
        {
            aLink.href = datatype+content;//dataurl格式的字符串"
        }
        else
        {//对于过大的文件普通dataURL不支持，所以使用“二进制流大对象”
            aLink.href=URL.createObjectURL(new Blob([content],{type:"text/plain"}));
        }
        aLink.download = filename;
        aLink.innerHTML=filename;
        //aLink.setAttribute("onclick","");
        aLink.onclick=function()
        {
            document.getElementById("div_choose").style.display="none";
            //delete_div('div_choose');
            delete_div('div_mask');
        }
        //aLink.style.display="none";
        //document.body.appendChild(aLink);
        /*var evt = document.createEvent("HTMLEvents");//建立一个事件
         evt.initEvent("click", false, false);//这是一个单击事件
         evt.eventType = 'message';
         aLink.dispatchEvent(evt);//触发事件*/
        //chrome认为点击超链接下载文件是超链接标签的“默认属性”，谷歌认为默认属性不可以用脚本来触发，所以从M53版本开始dispatchEvent无法触发超链接下载
        //window.open(datatype+content, "_blank");
        //document.write(datatype+content);
        delete_div('div_choose');
        delete_div('div_mask');
        //var evt=evt||window.event;
        //cancelPropagation(evt);
        //var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;

        Open_div("", "div_choose", 240, 180, 400, 80, "", "",1,401);//打开一个带遮罩的弹出框
        var div_choose=document.getElementById("div_choose");//$("#div_choose")[0];
        div_choose.style.border="1px solid";
        div_choose.innerHTML="<span>谷歌浏览器专用文件生成完毕，请点击下面的文件名下载文件。</span><br>"
        div_choose.appendChild(aLink);
        drag(div_choose);
        aLink.onmousedown=function()
        {
            var evt=evt||window.event;
            cancelPropagation(evt);
        }
    }
    else//IE
    {
        var Folder=BrowseFolder();
        if(Folder=="false")
        {
            alert("保存失败！");
        }
        else
        {
            var fso, tf;
            fso = new ActiveXObject("Scripting.FileSystemObject");//创建文件系统对象
            tf = fso.CreateTextFile(Folder + filename+filetype, true,true);//创建一个文件
            tf.write(content);
            tf.Close();
            alert("保存完毕！");
        }
    }
}
function BrowseFolder()
{//使用ActiveX控件
    try
    {
        var Message = "请选择保存文件夹";  //选择框提示信息
        var Shell = new ActiveXObject( "Shell.Application" );
        var Folder = Shell.BrowseForFolder(0,Message,0x0040,0x11);//起始目录为：我的电脑
        //var Folder = Shell.BrowseForFolder(0,Message,0); //起始目录为：桌面//选择桌面会报错！！

        if(Folder != null)
        {
            Folder = Folder.items();  // 返回 FolderItems 对象
            Folder = Folder.item();  // 返回 Folderitem 对象
            Folder = Folder.Path;   // 返回路径
            if(Folder.charAt(Folder.length-1) != "\\")
            {
                Folder = Folder + "\\";
            }
            //document.all.savePath.value=Folder;
            return Folder;
        }
    }
    catch(e)
    {
        return "false";
        alert(e.message);
    }
}
function UploadText(filename,evt,recallfunc)//读取一个本地文本文件
{
    if(typeof FileReader=='undefined')
    {
        var fso, f1, ts, s;
        var as=[];
        var ForReading = 1;
        fso = new ActiveXObject("Scripting.FileSystemObject");
        if (fso != null) {
            ts = fso.OpenTextFile(filename, ForReading,false,-1);
            /*OpenTextFile(filename,iomode,create,format)
             创建一个名叫做filename的文件，或打开一个现有的名为filename的文件，并且返回一个与其相关的TextStream对象。
             filename参数可以包含绝对或相对路径。iomode参数指定了所要求的访问类型。
             允许的数值是ForReading(1)（缺省）、ForWriting(2)、ForAppending(8)。
             当写入或追加到一个不存在的文件时，如果create参数设置为true，就将创建一个新文件。
             缺省的create参数是False。format参数说明对文件读或写的数据格式。
             允许数值是：TristatetFalse(0)（缺省），按照ASCII格式打开；TristatetTrue(-1)，
             按照Unicode格式打开；TristateDefault(-2)，用系统缺省格式打开*/
            s = "";
            while (!ts.atEndOfLine) {
                //s += ts.ReadLine();//读入一行
                as.push(ts.ReadLine());

            }
            s=as.join("");
            ts.Close();
            eval(recallfunc);
        }
    }
    else
    {
        var files = evt.target.files;
        var s="";
        for (var i = 0, f; f = files[i]; i++)
        {
            var reader = new FileReader();
            reader.readAsText(f);
            reader.onload = function(e)
            {
                s = [e.target.result].join("");
                eval(recallfunc);
            }
        }
    }
}
function MakeDateStr()//按一定格式读取本机当前时间备用
{
    var dt=new Date();
    var str_date=dt.getFullYear()+""+(dt.getMonth()+1)+""+dt.getDate()+"_"+dt.getHours()+"_"+dt.getMinutes()+"_"+dt.getSeconds();
    return str_date;
}
function MakeDateStr2()//按一定格式读取本机当前时间备用
{
    var dt=new Date();
    var str_date=dt.getFullYear()+"年"+(dt.getMonth()+1)+"月"+dt.getDate()+"日"+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
    return str_date;
}
function MakeDateStr3()
{
    var dt=new Date();
    var str_date=dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
    return str_date;
}
function MakeDateStr4(dt)//按一定格式读取本机当前时间给easyui控件用
{
    var str_date=dt.getFullYear()+"-"+((dt.getMonth()+1+"").length>1?(dt.getMonth()+1):("0"+(dt.getMonth()+1)))+"-"+((dt.getDate()+"").length>1?(dt.getDate()):("0"+dt.getDate()));
    return str_date;
}
function subDate(dt1,dt2)//计算两时间的天数差
{
    var days= (dt2.getTime() - dt1.getTime())/(86400000);//这个是毫秒数的差除掉之后是天数
    return days;
}
/*
 * var s1 = '2012-05-12';

 s1 = new Date(s1.replace(/-/g, "/"));
 s2 = new Date();

 var days = s2.getTime() - s1.getTime();
 var time = parseInt(days / (1000 * 60 * 60 * 24));

 * */
/**
 * 按照传过来的数据生成一个Excel，文件的另存为由Excel软件负责！
 * @param str_title Excel的标题
 * @param arr_th 表格的表头
 * @param arr_td 表格的内容数组
 * @param th_start 从表头数组的哪个元素开始
 * @param td_start从表体的第几列开始显示
 * @param row_start 从整个数据的第几行开始
 * @constructor
 */
function MakeExcel2(str_title,arr_th,th_start,td_start,arr_td,row_start)
{
    var arr_thl=arr_th.length-th_start;//表头列数
    var arr_tdl=arr_td.length;//表体行数
    var flag_b="ie";
    try {
        var xls    = new ActiveXObject ( "Excel.Application" );
    }
    catch(e) {
        //alert( "要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件”，您的浏览器须允许执行控件。");
        //alert("检测到你的浏览器无法使用“ActiveX 控件”，尝试使用降级的XML方式保存数据，您可以像操作Excel文件一样操作该XML文件，也可以把这个XML文件再另存为Excel文件");
        //if(1)
        //{
        flag_b="ch";
        MakeXML(str_title,arr_th,th_start,td_start,arr_td,row_start);
        /*}
         else
         {
         alert("很遗憾，要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件”，您的浏览器须允许执行控件。");
         }
         return "";*/
    }
    if(flag_b=="ch")
    {
        return;
    }
    xls.visible =true;  //设置excel为可见
    var xlBook = xls.Workbooks.Add;//添加一个Excel表
    var xlsheet = xlBook.Worksheets(1);//取Excel表中的一个sheet，Excel中“1”代表第一个！



    xlsheet.Rows(1).RowHeight = 25;
    xlsheet.Rows(1).Font.Size=14;
    xlsheet.Rows(1).Font.Name="黑体";
    //xlsheet.NumberFormatLocal="@";
    //xlsheet.WrapText=true;
    var num_min=0;
    for(var i=0;i<arr_thl;i++)//写表头
    {
        if (arr_th[i + th_start] == "操作")
        {//这样的操作表头不显示
            num_min++;
        }
        else
        {
            xlsheet.Columns(i + 1).NumberFormatLocal = "@";
            xlsheet.Cells(2, i + 1).Value = arr_th[i + th_start];
        }
    }
    arr_thl-=num_min;
    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl-th_start)).mergecells=true;//将第一行单元格合并//行列
    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl-th_start)).value=str_title; //写表名

    for(var i=row_start;i<arr_tdl;i++)//写表体，认为Excel的数据行比arr_td少一行
    {
        var k=0;//表示td比th多多少列
        for(var j=0;j<arr_thl;j++)//aar_td里的一些数据是不能绘制在excel里的
        {
            if(arr_td[2][j + td_start + k] == "str")//首先考虑最常见的情况
            {
                xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
            }
            else if (arr_td[2][j + td_start + k] == "none") {
                j--;//再次考虑这一列Excel
                k++;
            }
            else if (arr_td[2][j + td_start + k] == "mod"||arr_td[2][j + td_start + k] == "butoon") {//这些显示类型不绑定数据列
                j--;//再次考虑这一列
                k--;
            }
            else if (arr_td[2][j + td_start + k][0] == "switch") {//switch给自己添了很多麻烦，要不以后直接在数据库中写，不用switch了？
                for (var a = 1; a < arr_td[2][j + td_start + k].length; a++)
                {
                    if (arr_td[2][j + td_start + k][a][0] == arr_td[i][j + td_start + k])
                    {
                        xlsheet.Cells(i - 1, j + 1).Value = arr_td[2][j + td_start+k][a][1];
                        break;
                    }
                    else if (a == arr_td[2][j + td_start + k].length - 1) //如果没有显示值则显示原值
                    {
                        xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
                    }
                }
            }
            else if(arr_td[2][j + td_start + k] == "num")
            {
                var str_num=arr_td[i][j + td_start+k];
                if(str_num==null||str_num==undefined||str_num=="")
                {
                    str_num="";
                }
                else
                {
                    if (str_num.substr(0, 1) == ".") {
                        str_num = "0" + str_num;
                    }
                }
                xlsheet.Cells(i - 1, j + 1).Value = str_num;
            }
            else if(arr_td[2][j + td_start + k] == "cash")
            {
                var str_num=arr_td[i][j + td_start+k];
                if(str_num==null||str_num==undefined||str_num=="")
                {
                    str_num="";
                }
                else
                {
                    if (str_num.substr(0, 1) == ".") {
                        str_num = "0" + str_num;
                    }
                    if (str_num.indexOf(".") < 0) {
                        str_num = str_num + ".00";
                    }
                    else if (str_num.split(".")[1].length == 1) {
                        str_num = str_num + "0";
                    }
                }
                xlsheet.Cells(i - 1, j + 1).Value = str_num;
            }
            else
            {
                xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
            }
        }
    }

    xlsheet.Columns.AutoFit;
    xlsheet.Range( xlsheet.Cells(1,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).HorizontalAlignment =-4108;//居中
    xlsheet.Range( xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl-th_start)).VerticalAlignment =-4108;
    xlsheet.Range( xlsheet.Cells(2,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).Font.Size=10;

    xlsheet.Range( xlsheet.Cells(2,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).Borders(3).Weight = 2; //设置左边距//其实是设置边框！
    xlsheet.Range( xlsheet.Cells(2,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).Borders(4).Weight = 2;//设置右边距
    xlsheet.Range( xlsheet.Cells(2,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).Borders(1).Weight = 2;//设置顶边距
    xlsheet.Range( xlsheet.Cells(2,1),xlsheet.Cells(arr_tdl-row_start+2,arr_thl-th_start)).Borders(2).Weight = 2;//设置底边距

    xls.UserControl = true;  //很重要,不能省略,不然会出问题 意思是excel交由用户控制
    xls=null;//释放对象，意味着不想再用js来操作这个Excel了
    xlBook=null;
    xlsheet=null;
}
/**
 * 按照传过来的数据生成一个Excel，文件的另存为由Excel软件负责！
 * @param str_title Excel的标题
 * @param arr_th 表格的表头
 * @param arr_td 表格的内容数组
 * @param th_start 从表头数组的哪个元素开始
 * @param td_start从表体的第几列开始显示
 * @param row_start 从整个数据的第几行开始
 * @constructor
 */
function MakeXML(str_title,arr_th,th_start,td_start,arr_td,row_start)
{
    var arr_str=[];//字符串构造器
    //arr_str.push("<?xml version=\"1.0\"?> <?mso-application progid=\"Excel.Sheet\"?> <Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"  xmlns:o=\"urn:schemas-microsoft-com:office:office\"  xmlns:x=\"urn:schemas-microsoft-com:office:excel\"  xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"  xmlns:html=\"http://www.w3.org/TR/REC-html40\">  <DocumentProperties xmlns=\"urn:schemas-microsoft-com:office:office\">   <Author>lz</Author>   <LastAuthor>lz</LastAuthor>   <Created>2016-05-23T00:37:35Z</Created>   <LastSaved>2016-05-23T00:44:21Z</LastSaved>   <Version>14.00</Version>  </DocumentProperties>  <OfficeDocumentSettings xmlns=\"urn:schemas-microsoft-com:office:office\">   <AllowPNG/>  </OfficeDocumentSettings>  <ExcelWorkbook xmlns=\"urn:schemas-microsoft-com:office:excel\">   <WindowHeight>11430</WindowHeight>   <WindowWidth>16155</WindowWidth>   <WindowTopX>120</WindowTopX>   <WindowTopY>75</WindowTopY>   <ProtectStructure>False</ProtectStructure>   <ProtectWindows>False</ProtectWindows>  </ExcelWorkbook>  <Styles>   <Style ss:ID=\"Default\" ss:Name=\"Normal\">    <Alignment ss:Vertical=\"Center\"/>    <Borders/>    <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"11\" ss:Color=\"#000000\"/>    <Interior/>    <NumberFormat/>    <Protection/>   </Style>   <Style ss:ID=\"s16\">    <Font ss:FontName=\"黑体\" x:CharSet=\"134\" x:Family=\"Modern\" ss:Size=\"14\"     ss:Color=\"#000000\"/>   </Style>   <Style ss:ID=\"s17\">    <NumberFormat ss:Format=\"@\"/>   </Style>   <Style ss:ID=\"s19\">    <Alignment ss:Horizontal=\"Center\" ss:Vertical=\"Center\"/>    <Borders>     <Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>     <Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>     <Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>     <Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>    </Borders>    <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Color=\"#000000\"/>    <NumberFormat ss:Format=\"@\"/>   </Style>   <Style ss:ID=\"s20\">    <Alignment ss:Horizontal=\"Center\" ss:Vertical=\"Center\"/>    <Font ss:FontName=\"黑体\" x:CharSet=\"134\" x:Family=\"Modern\" ss:Size=\"14\"     ss:Color=\"#000000\"/>   </Style>  </Styles>  <Worksheet ss:Name=\"Sheet1\">");
    arr_str.push("<?xml version=\"1.0\"?>\r\n<?mso-application progid=\"Excel.Sheet\"?>\r\n<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\r\n xmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\n xmlns:x=\"urn:schemas-microsoft-com:office:excel\"\r\n xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"\r\n xmlns:html=\"http://www.w3.org/TR/REC-html40\">\r\n <DocumentProperties xmlns=\"urn:schemas-microsoft-com:office:office\">\r\n  <Author>lz</Author>\r\n  <LastAuthor>lz</LastAuthor>\r\n  <Created>2016-05-23T00:37:35Z</Created>\r\n  <LastSaved>2016-05-23T00:44:21Z</LastSaved>\r\n  <Version>14.00</Version>\r\n </DocumentProperties>\r\n <OfficeDocumentSettings xmlns=\"urn:schemas-microsoft-com:office:office\">\r\n  <AllowPNG/>\r\n </OfficeDocumentSettings>\r\n <ExcelWorkbook xmlns=\"urn:schemas-microsoft-com:office:excel\">\r\n  <WindowHeight>11430</WindowHeight>\r\n  <WindowWidth>16155</WindowWidth>\r\n  <WindowTopX>120</WindowTopX>\r\n  <WindowTopY>75</WindowTopY>\r\n  <ProtectStructure>False</ProtectStructure>\r\n  <ProtectWindows>False</ProtectWindows>\r\n </ExcelWorkbook>\r\n <Styles>\r\n  <Style ss:ID=\"Default\" ss:Name=\"Normal\">\r\n   <Alignment ss:Vertical=\"Center\"/>\r\n   <Borders/>\r\n   <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"11\" ss:Color=\"#000000\"/>\r\n   <Interior/>\r\n   <NumberFormat/>\r\n   <Protection/>\r\n  </Style>\r\n  <Style ss:ID=\"s16\">\r\n   <Font ss:FontName=\"黑体\" x:CharSet=\"134\" x:Family=\"Modern\" ss:Size=\"14\"\r\n    ss:Color=\"#000000\"/>\r\n  </Style>\r\n  <Style ss:ID=\"s17\">\r\n   <NumberFormat ss:Format=\"@\"/>\r\n  </Style>\r\n  <Style ss:ID=\"s19\">\r\n   <Alignment ss:Horizontal=\"Center\" ss:Vertical=\"Center\"/>\r\n   <Borders>\r\n    <Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n    <Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n    <Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n    <Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n   </Borders>\r\n   <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Color=\"#000000\"/>\r\n   <NumberFormat ss:Format=\"@\"/>\r\n  </Style>\r\n  <Style ss:ID=\"s20\">\r\n   <Alignment ss:Horizontal=\"Center\" ss:Vertical=\"Center\"/>\r\n   <Font ss:FontName=\"黑体\" x:CharSet=\"134\" x:Family=\"Modern\" ss:Size=\"14\"\r\n    ss:Color=\"#000000\"/>\r\n  </Style>\r\n </Styles>\r\n <Worksheet ss:Name=\"Sheet1\">");

    var arr_thl=arr_th.length-th_start;//表头列数
    var arr_tdl=arr_td.length;//数据行数，可能包含一些说明列
    arr_str.push("<Table ss:ExpandedColumnCount=\""+arr_thl+"\" ss:ExpandedRowCount=\""+(arr_tdl+2-row_start)+"\" x:FullColumns=\"1\"    x:FullRows=\"1\" ss:DefaultColumnWidth=\"54\" ss:DefaultRowHeight=\"13.5\">");
    //写列宽度信息
    for(var i=0;i<arr_thl;i++ )
    {
        //arr_str.push("<Column ss:StyleID=\"s17\" ss:AutoFitWidth=\"0\"/>");
        var str_temp="<Column ss:StyleID=\"s17\" ss:Width=\""+(arr_td[3][i+ td_start]*0.8)+"\"/>";
        arr_str.push(str_temp);
    }
    //写表名改在后面确定列数之后
    //arr_str.push("<Row ss:AutoFitHeight=\"0\" ss:Height=\"24.9375\" ss:StyleID=\"s16\">     <Cell ss:MergeAcross=\""+(arr_thl-1)+"\" ss:StyleID=\"s20\"><Data ss:Type=\"String\">"+str_title+"</Data></Cell>    </Row>");

    //写表头
    var num_min=0;
    arr_str.push("<Row>");
    for(var i=0;i<arr_thl;i++)
    {
        if (arr_th[i + th_start] == "操作")
        {//这样的操作表头不显示
            num_min++;
        }
        else
        {
            arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">" + arr_th[i + th_start] + "</Data></Cell>");
        }
    }
    arr_str.push("</Row>");

    arr_thl-=num_min;
    //写表名
    //arr_str.push("<Row ss:AutoFitHeight=\"0\" ss:Height=\"24.9375\" ss:StyleID=\"s16\">     <Cell ss:MergeAcross=\""+(arr_thl-1)+"\" ss:StyleID=\"s20\"><Data ss:Type=\"String\">"+str_title+"</Data></Cell>    </Row>");
    arr_str.splice(2+arr_thl+num_min,0,("<Row ss:AutoFitHeight=\"0\" ss:Height=\"24.9375\" ss:StyleID=\"s16\">     <Cell ss:MergeAcross=\""+(arr_thl-1)+"\" ss:StyleID=\"s20\"><Data ss:Type=\"String\">"+str_title+"</Data></Cell>    </Row>"));

    //写每一行数据
    for(var i=row_start;i<arr_tdl;i++)
    {
        arr_str.push("<Row>");
        var k=0;//表示td比th多多少列
        for(var j=0;j<arr_thl;j++)//aar_td里的一些数据是不能绘制在excel里的
        {
            var str_temp=arr_td[i][j + td_start+k];
            if(!str_temp)
            {
                str_temp="";
            }
            if(arr_td[2][j + td_start + k] == "str")//首先考虑最常见的情况
            {
                arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+str_temp+"</Data></Cell>");
                //xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
            }
            else if (arr_td[2][j + td_start + k] == "none") {
                j--;//再次考虑这一列
                k++;
            }
            else if (arr_td[2][j + td_start + k] == "mod"||arr_td[2][j + td_start + k] == "butoon") {//这些显示类型不绑定数据列
                j--;//再次考虑这一列
                k--;
            }
            else if (arr_td[2][j + td_start + k][0] == "switch") {//switch给自己添了很多麻烦，要不以后直接在数据库中写，不用switch了？
                for (var a = 1; a < arr_td[2][j + td_start + k].length; a++)
                {
                    if (arr_td[2][j + td_start + k][a][0] == str_temp)
                    {
                        arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+arr_td[2][j + td_start+k][a][1]+"</Data></Cell>");
                        //xlsheet.Cells(i - 1, j + 1).Value = arr_td[2][j + td_start+k][a][1];
                        break;
                    }
                    else if (a == arr_td[2][j + td_start + k].length - 1) //如果没有显示值则显示原值
                    {
                        arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+str_temp+"</Data></Cell>");
                        //xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
                    }
                }
            }
            else if(arr_td[2][j + td_start + k] == "num")
            {
                if(str_temp==null||str_temp==undefined||str_temp=="")
                {
                    str_temp="";
                }
                else
                {
                    if (str_temp.substr(0, 1) == ".") {
                        str_temp = "0" + str_temp;
                    }
                }
                arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+str_temp+"</Data></Cell>");
            }
            else if(arr_td[2][j + td_start + k] == "cash")
            {
                if(str_temp==null||str_temp==undefined||str_temp=="")
                {
                    str_temp="";
                }
                else
                {
                    if (str_temp.substr(0, 1) == ".") {
                        str_temp = "0" + str_temp;
                    }
                    if (str_temp.indexOf(".") < 0) {
                        str_temp = str_temp + ".00";
                    }
                    else if (str_temp.split(".")[1].length == 1) {
                        str_temp = str_temp + "0";
                    }
                }
                arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+str_temp+"</Data></Cell>");
            }
            else
            {
                arr_str.push("<Cell ss:StyleID=\"s19\"><Data ss:Type=\"String\">"+str_temp+"</Data></Cell>");
                //xlsheet.Cells(i - 1, j + 1).Value = arr_td[i][j + td_start+k];
            }
        }
        arr_str.push("</Row>");
    }
    //写尾部
    arr_str.push("</Table>   <WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">    <PageSetup>     <Header x:Margin=\"0.3\"/>     <Footer x:Margin=\"0.3\"/>     <PageMargins x:Bottom=\"0.75\" x:Left=\"0.7\" x:Right=\"0.7\" x:Top=\"0.75\"/>    </PageSetup>    <Print>     <ValidPrinterInfo/>     <PaperSizeIndex>9</PaperSizeIndex>     <HorizontalResolution>600</HorizontalResolution>     <VerticalResolution>600</VerticalResolution>    </Print>    <Selected/>    <Panes>     <Pane>      <Number>3</Number>      <RangeSelection>R1C1:R1C11</RangeSelection>     </Pane>    </Panes>    <ProtectObjects>False</ProtectObjects>    <ProtectScenarios>False</ProtectScenarios>   </WorksheetOptions>  </Worksheet>  <Worksheet ss:Name=\"Sheet2\">   <Table ss:ExpandedColumnCount=\"1\" ss:ExpandedRowCount=\"1\" x:FullColumns=\"1\"    x:FullRows=\"1\" ss:DefaultColumnWidth=\"54\" ss:DefaultRowHeight=\"13.5\">   </Table>   <WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">    <PageSetup>     <Header x:Margin=\"0.3\"/>     <Footer x:Margin=\"0.3\"/>     <PageMargins x:Bottom=\"0.75\" x:Left=\"0.7\" x:Right=\"0.7\" x:Top=\"0.75\"/>    </PageSetup>    <ProtectObjects>False</ProtectObjects>    <ProtectScenarios>False</ProtectScenarios>   </WorksheetOptions>  </Worksheet>  <Worksheet ss:Name=\"Sheet3\">   <Table ss:ExpandedColumnCount=\"1\" ss:ExpandedRowCount=\"1\" x:FullColumns=\"1\"    x:FullRows=\"1\" ss:DefaultColumnWidth=\"54\" ss:DefaultRowHeight=\"13.5\">   </Table>   <WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">    <PageSetup>     <Header x:Margin=\"0.3\"/>     <Footer x:Margin=\"0.3\"/>     <PageMargins x:Bottom=\"0.75\" x:Left=\"0.7\" x:Right=\"0.7\" x:Top=\"0.75\"/>    </PageSetup>    <ProtectObjects>False</ProtectObjects>    <ProtectScenarios>False</ProtectScenarios>   </WorksheetOptions>  </Worksheet> </Workbook>");
    //arr_str.push("</Table>\r\n  <WorksheetOptions xmlns=\"urn:schemas-microsoft-com:office:excel\">\r\n   <PageSetup>\r\n    <Header x:Margin=\"0.3\"/>\r\n    <Footer x:Margin=\"0.3\"/>\r\n    <PageMargins x:Bottom=\"0.75\" x:Left=\"0.7\" x:Right=\"0.7\" x:Top=\"0.75\"/>\r\n   </PageSetup>\r\n   <Print>\r\n    <ValidPrinterInfo/>\r\n    <PaperSizeIndex>9</PaperSizeIndex>\r\n    <HorizontalResolution>600</HorizontalResolution>\r\n    <VerticalResolution>600</VerticalResolution>\r\n   </Print>\r\n   <Selected/>\r\n   <Panes>\r\n    <Pane>\r\n     <Number>3</Number>\r\n     <ActiveRow>6</ActiveRow>\r\n   <ActiveCol>3</ActiveCol>\r\n   </Pane>\r\n   </Panes>\r\n   <ProtectObjects>False</ProtectObjects>\r\n   <ProtectScenarios>False</ProtectScenarios>\r\n  </WorksheetOptions>\r\n </Worksheet>\r\n  </Workbook>");
    var str_all=arr_str.join("");

    DownloadText(str_title,str_all,".xml");
}


//使用ADODB.Stream控件时要注意ISO-8859-1和Windows-1252字符集之间的转换，把它们放在html里会被360报毒！！
function BinaryFile(name)
{
    var adTypeBinary = 1;
    var adTypeText   = 2;
    var adSaveCreateOverWrite = 2;
    // The trick - this is the 'old fassioned' not translation page
    // It lest javascript use strings to act like raw octets
    var codePage='437';

    this.path=name;

    var forward  = new Array();
    var backward = new Array();

    // Note - for better performance I should preconvert these hex
    // definitions to decimal - at some point :-) - AJT
    forward['80'] = '00C7';
    forward['81'] = '00FC';
    forward['82'] = '00E9';
    forward['83'] = '00E2';
    forward['84'] = '00E4';
    forward['85'] = '00E0';
    forward['86'] = '00E5';
    forward['87'] = '00E7';
    forward['88'] = '00EA';
    forward['89'] = '00EB';
    forward['8A'] = '00E8';
    forward['8B'] = '00EF';
    forward['8C'] = '00EE';
    forward['8D'] = '00EC';
    forward['8E'] = '00C4';
    forward['8F'] = '00C5';
    forward['90'] = '00C9';
    forward['91'] = '00E6';
    forward['92'] = '00C6';
    forward['93'] = '00F4';
    forward['94'] = '00F6';
    forward['95'] = '00F2';
    forward['96'] = '00FB';
    forward['97'] = '00F9';
    forward['98'] = '00FF';
    forward['99'] = '00D6';
    forward['9A'] = '00DC';
    forward['9B'] = '00A2';
    forward['9C'] = '00A3';
    forward['9D'] = '00A5';
    forward['9E'] = '20A7';
    forward['9F'] = '0192';
    forward['A0'] = '00E1';
    forward['A1'] = '00ED';
    forward['A2'] = '00F3';
    forward['A3'] = '00FA';
    forward['A4'] = '00F1';
    forward['A5'] = '00D1';
    forward['A6'] = '00AA';
    forward['A7'] = '00BA';
    forward['A8'] = '00BF';
    forward['A9'] = '2310';
    forward['AA'] = '00AC';
    forward['AB'] = '00BD';
    forward['AC'] = '00BC';
    forward['AD'] = '00A1';
    forward['AE'] = '00AB';
    forward['AF'] = '00BB';
    forward['B0'] = '2591';
    forward['B1'] = '2592';
    forward['B2'] = '2593';
    forward['B3'] = '2502';
    forward['B4'] = '2524';
    forward['B5'] = '2561';
    forward['B6'] = '2562';
    forward['B7'] = '2556';
    forward['B8'] = '2555';
    forward['B9'] = '2563';
    forward['BA'] = '2551';
    forward['BB'] = '2557';
    forward['BC'] = '255D';
    forward['BD'] = '255C';
    forward['BE'] = '255B';
    forward['BF'] = '2510';
    forward['C0'] = '2514';
    forward['C1'] = '2534';
    forward['C2'] = '252C';
    forward['C3'] = '251C';
    forward['C4'] = '2500';
    forward['C5'] = '253C';
    forward['C6'] = '255E';
    forward['C7'] = '255F';
    forward['C8'] = '255A';
    forward['C9'] = '2554';
    forward['CA'] = '2569';
    forward['CB'] = '2566';
    forward['CC'] = '2560';
    forward['CD'] = '2550';
    forward['CE'] = '256C';
    forward['CF'] = '2567';
    forward['D0'] = '2568';
    forward['D1'] = '2564';
    forward['D2'] = '2565';
    forward['D3'] = '2559';
    forward['D4'] = '2558';
    forward['D5'] = '2552';
    forward['D6'] = '2553';
    forward['D7'] = '256B';
    forward['D8'] = '256A';
    forward['D9'] = '2518';
    forward['DA'] = '250C';
    forward['DB'] = '2588';
    forward['DC'] = '2584';
    forward['DD'] = '258C';
    forward['DE'] = '2590';
    forward['DF'] = '2580';
    forward['E0'] = '03B1';
    forward['E1'] = '00DF';
    forward['E2'] = '0393';
    forward['E3'] = '03C0';
    forward['E4'] = '03A3';
    forward['E5'] = '03C3';
    forward['E6'] = '00B5';
    forward['E7'] = '03C4';
    forward['E8'] = '03A6';
    forward['E9'] = '0398';
    forward['EA'] = '03A9';
    forward['EB'] = '03B4';
    forward['EC'] = '221E';
    forward['ED'] = '03C6';
    forward['EE'] = '03B5';
    forward['EF'] = '2229';
    forward['F0'] = '2261';
    forward['F1'] = '00B1';
    forward['F2'] = '2265';
    forward['F3'] = '2264';
    forward['F4'] = '2320';
    forward['F5'] = '2321';
    forward['F6'] = '00F7';
    forward['F7'] = '2248';
    forward['F8'] = '00B0';
    forward['F9'] = '2219';
    forward['FA'] = '00B7';
    forward['FB'] = '221A';
    forward['FC'] = '207F';
    forward['FD'] = '00B2';
    forward['FE'] = '25A0';
    forward['FF'] = '00A0';
    backward['C7']   = '80';
    backward['FC']   = '81';
    backward['E9']   = '82';
    backward['E2']   = '83';
    backward['E4']   = '84';
    backward['E0']   = '85';
    backward['E5']   = '86';
    backward['E7']   = '87';
    backward['EA']   = '88';
    backward['EB']   = '89';
    backward['E8']   = '8A';
    backward['EF']   = '8B';
    backward['EE']   = '8C';
    backward['EC']   = '8D';
    backward['C4']   = '8E';
    backward['C5']   = '8F';
    backward['C9']   = '90';
    backward['E6']   = '91';
    backward['C6']   = '92';
    backward['F4']   = '93';
    backward['F6']   = '94';
    backward['F2']   = '95';
    backward['FB']   = '96';
    backward['F9']   = '97';
    backward['FF']   = '98';
    backward['D6']   = '99';
    backward['DC']   = '9A';
    backward['A2']   = '9B';
    backward['A3']   = '9C';
    backward['A5']   = '9D';
    backward['20A7'] = '9E';
    backward['192']  = '9F';
    backward['E1']   = 'A0';
    backward['ED']   = 'A1';
    backward['F3']   = 'A2';
    backward['FA']   = 'A3';
    backward['F1']   = 'A4';
    backward['D1']   = 'A5';
    backward['AA']   = 'A6';
    backward['BA']   = 'A7';
    backward['BF']   = 'A8';
    backward['2310'] = 'A9';
    backward['AC']   = 'AA';
    backward['BD']   = 'AB';
    backward['BC']   = 'AC';
    backward['A1']   = 'AD';
    backward['AB']   = 'AE';
    backward['BB']   = 'AF';
    backward['2591'] = 'B0';
    backward['2592'] = 'B1';
    backward['2593'] = 'B2';
    backward['2502'] = 'B3';
    backward['2524'] = 'B4';
    backward['2561'] = 'B5';
    backward['2562'] = 'B6';
    backward['2556'] = 'B7';
    backward['2555'] = 'B8';
    backward['2563'] = 'B9';
    backward['2551'] = 'BA';
    backward['2557'] = 'BB';
    backward['255D'] = 'BC';
    backward['255C'] = 'BD';
    backward['255B'] = 'BE';
    backward['2510'] = 'BF';
    backward['2514'] = 'C0';
    backward['2534'] = 'C1';
    backward['252C'] = 'C2';
    backward['251C'] = 'C3';
    backward['2500'] = 'C4';
    backward['253C'] = 'C5';
    backward['255E'] = 'C6';
    backward['255F'] = 'C7';
    backward['255A'] = 'C8';
    backward['2554'] = 'C9';
    backward['2569'] = 'CA';
    backward['2566'] = 'CB';
    backward['2560'] = 'CC';
    backward['2550'] = 'CD';
    backward['256C'] = 'CE';
    backward['2567'] = 'CF';
    backward['2568'] = 'D0';
    backward['2564'] = 'D1';
    backward['2565'] = 'D2';
    backward['2559'] = 'D3';
    backward['2558'] = 'D4';
    backward['2552'] = 'D5';
    backward['2553'] = 'D6';
    backward['256B'] = 'D7';
    backward['256A'] = 'D8';
    backward['2518'] = 'D9';
    backward['250C'] = 'DA';
    backward['2588'] = 'DB';
    backward['2584'] = 'DC';
    backward['258C'] = 'DD';
    backward['2590'] = 'DE';
    backward['2580'] = 'DF';
    backward['3B1']  = 'E0';
    backward['DF']   = 'E1';
    backward['393']  = 'E2';
    backward['3C0']  = 'E3';
    backward['3A3']  = 'E4';
    backward['3C3']  = 'E5';
    backward['B5']   = 'E6';
    backward['3C4']  = 'E7';
    backward['3A6']  = 'E8';
    backward['398']  = 'E9';
    backward['3A9']  = 'EA';
    backward['3B4']  = 'EB';
    backward['221E'] = 'EC';
    backward['3C6']  = 'ED';
    backward['3B5']  = 'EE';
    backward['2229'] = 'EF';
    backward['2261'] = 'F0';
    backward['B1']   = 'F1';
    backward['2265'] = 'F2';
    backward['2264'] = 'F3';
    backward['2320'] = 'F4';
    backward['2321'] = 'F5';
    backward['F7']   = 'F6';
    backward['2248'] = 'F7';
    backward['B0']   = 'F8';
    backward['2219'] = 'F9';
    backward['B7']   = 'FA';
    backward['221A'] = 'FB';
    backward['207F'] = 'FC';
    backward['B2']   = 'FD';
    backward['25A0'] = 'FE';
    backward['A0']   = 'FF';

    var hD="0123456789ABCDEF";
    this.d2h = function(d)
    {
        var h = hD.substr(d&15,1);
        while(d>15) {d>>=4;h=hD.substr(d&15,1)+h;}
        return h;
    }

    this.h2d = function(h)
    {
        return parseInt(h,16);
    }

    this.WriteAll = function(what)
    {
        //Create Stream object
        //var BinaryStream = WScript.CreateObject("ADODB.Stream");
        var BinaryStream = new ActiveXObject("ADODB.Stream");
        //Specify stream type - we cheat and get string but 'like' binary
        BinaryStream.Type = adTypeText;
        BinaryStream.CharSet = '437';
        //Open the stream
        BinaryStream.Open();
        // Write to the stream
        BinaryStream.WriteText(this.Forward437(what));
        // Write the string to the disk
        BinaryStream.SaveToFile(this.path, adSaveCreateOverWrite);

        // Clearn up
        BinaryStream.Close();
    }

    this.ReadAll  = function()
    {
        //Create Stream object - needs ADO 2.5 or heigher
        //var BinaryStream = WScript.CreateObject("ADODB.Stream")
        var BinaryStream = new ActiveXObject("ADODB.Stream");
        //Specify stream type - we cheat and get string but 'like' binary
        BinaryStream.Type = adTypeText;
        BinaryStream.CharSet = codePage;
        //Open the stream
        BinaryStream.Open();
        //Load the file data from disk To stream object
        BinaryStream.LoadFromFile(this.path);
        //Open the stream And get binary 'string' from the object
        var what = BinaryStream.ReadText;
        // Clean up
        BinaryStream.Close();
        return this.Backward437(what);
    }

    /* Convert a octet number to a code page 437 char code */
    this.Forward437 = function(inString)
    {
        var encArray = new Array();
        var tmp='';
        var i=0;
        var c=0;
        var l=inString.length;
        var cc;
        var h;
        for(;i<l;++i)
        {
            c++;
            if(c==128)
            {
                encArray.push(tmp);
                tmp='';
                c=0;
            }
            cc=inString.charCodeAt(i);
            if(cc<128)
            {
                tmp+=String.fromCharCode(cc);
            }
            else
            {
                h=this.d2h(cc);
                h=forward[''+h];
                tmp+=String.fromCharCode(this.h2d(h));
            }
        }
        if(tmp!='')
        {
            encArray.push(tmp);
        }

        // this loop progressive concatonates the
        // array elements entil there is only one
        var ar2=new Array();
        for(;encArray.length>1;)
        {
            var l=encArray.length;
            for(var c=0;c<l;c+=2)
            {
                if(c+1==l)
                {
                    ar2.push(encArray[c]);
                }
                else
                {
                    ar2.push(''+encArray[c]+encArray[c+1]);
                }
            }
            encArray=ar2;
            ar2=new Array();
        }
        return encArray[0];
    }
    /* Convert a code page 437 char code to a octet number*/
    this.Backward437 = function(inString)
    {
        var encArray = new Array();
        var tmp='';
        var i=0;
        var c=0;
        var l=inString.length;
        var cc;
        var h;
        for(;i<l;++i)
        {
            c++;
            if(c==128)
            {
                encArray.push(tmp);
                tmp='';
                c=0;
            }
            cc=inString.charCodeAt(i);
            if(cc<128)
            {
                tmp+=String.fromCharCode(cc);
            }
            else
            {
                h=this.d2h(cc);
                h=backward[''+h];
                tmp+=String.fromCharCode(this.h2d(h));
            }
        }
        if(tmp!='')
        {
            encArray.push(tmp);
        }

        // this loop progressive concatonates the
        // array elements entil there is only one
        var ar2=new Array();
        for(;encArray.length>1;)
        {
            var l=encArray.length;
            for(var c=0;c<l;c+=2)
            {
                if(c+1==l)
                {
                    ar2.push(encArray[c]);
                }
                else
                {
                    ar2.push(''+encArray[c]+encArray[c+1]);
                }
            }
            encArray=ar2;
            ar2=new Array();
        }
        return encArray[0];
    }
}
// Example Code
/*
 var bf0=new BinaryFile();
 var crFolder = 'C:/Temp/cr'
 var bf1=new BinaryFile(crFolder+"/PCDV0026.JPG");
 var bf2=new BinaryFile(crFolder+"/PCDV0026_.JPG");
 bf2.WriteAll(bf1.ReadAll());
 */
//把文字转变为图片
function texttoimg(str,font,lineheight,color,type)
{
    var c=document.createElement("canvas");
    c.height=lineheight+2;
    c.width=lineheight*str.length;
    c.style.height=lineheight+2+"px";
    c.style.width=lineheight*str.length+"px";
    var context = c.getContext('2d');
    context.font=font;
    context.clearRect(0, 0, c.width, c.height);
    if(type=="jpeg")
    {
        context.fillStyle="rgb(255,255,255)";
        context.fillRect(0,0,c.width,c.height);
        context.fillStyle = color;
        context.textBaseline = 'top';
        context.fillText(str,(c.width-str.length*lineheight)/2,0);
        var str_src=c.toDataURL("image/jpeg");
        c=null;//要求回收？？
        return str_src;
    }
    else if(type=="png")
    {
        context.fillStyle = color;
        context.textBaseline = 'top';//
        context.fillText(str,(c.width-str.length*lineheight)/2,0);
        var str_src=c.toDataURL("image/png");
        c=null;//要求回收？？
        return str_src;
    }
    c=null;//要求回收？？
    return false;
}