/**
 * Created by Administrator on 2015/3/2.
 */
/**
 * 将指定字符写入指定名称的文本文件中，并可以选择本地保存目录，兼容IE11和谷歌浏览器
 */
function DownloadText(filename,content)
{
    if(document.createElement("a").download!=null)//谷歌和火狐
    {
        var aLink = document.createElement('a');
        aLink.href = "data:text/plain;charset=UTF-8,"+content;//dataurl格式的字符串"
        aLink.download = filename;
        var evt = document.createEvent("HTMLEvents");//建立一个事件
        evt.initEvent("click", false, false);//这是一个单击事件
        aLink.dispatchEvent(evt);//触发事件
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
            tf = fso.CreateTextFile(Folder + filename+".txt", true,true);//创建一个文件
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
    var arr_thl=arr_th.length;//表头列数
    var arr_tdl=arr_td.length;//表体行数
    try {
        var xls    = new ActiveXObject ( "Excel.Application" );
    }
    catch(e) {
        alert( "要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件”，您的浏览器须允许执行控件。");
        return "";
    }
    xls.visible =true;  //设置excel为可见
    var xlBook = xls.Workbooks.Add;//添加一个Excel表
    var xlsheet = xlBook.Worksheets(1);//取Excel表中的一个sheet，Excel中“1”代表第一个！

    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl-th_start)).mergecells=true;//将第一行单元格合并//行列
    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl-th_start)).value=str_title; //写表名

    xlsheet.Rows(1).RowHeight = 25;
    xlsheet.Rows(1).Font.Size=14;
    xlsheet.Rows(1).Font.Name="黑体";
    //xlsheet.NumberFormatLocal="@";
    //xlsheet.WrapText=true;
    for(var i=0;i<arr_thl;i++)//写表头
    {
        xlsheet.Columns(i+1).NumberFormatLocal="@";
        xlsheet.Cells(2,i+1).Value=arr_th[i+th_start];
    }
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
                j--;//再次考虑这一列
                k++;
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
 * 根据固定区域的表格元素生成Excel，，文件的另存为由Excel软件负责！编写方法库时尽量不使用JQuery！！未完待续
 * 考虑colspan属性，暂时不考虑rowspan属性 ,不支持多重表头
 * @param str_title Excel的标题
 * @param id_tab 要展示的普通表格的id
 * @param arr_thl最宽的一行有多少列
 * @param arr_tdl最高的一列有多少行
 * @constructor
 */
function HtmlTOExcel(str_title,id_tab,arr_thl,arr_tdl)
{
    try {
        var xls    = new ActiveXObject ( "Excel.Application" );
    }
    catch(e) {
        alert( "要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件”，您的浏览器须允许执行控件。");
        return "";
    }
    xls.visible =true;  //设置excel为可见
    var xlBook = xls.Workbooks.Add;//添加一个Excel表
    var xlsheet = xlBook.Worksheets(1);//取Excel表中的一个sheet，Excel中“1”代表第一个！

    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl)).mergecells=true;//将第一行单元格合并行列
    xlsheet.Range(xlsheet.Cells(1,1),xlsheet.Cells(1,arr_thl)).value=str_title; //写表名
    xlsheet.Rows(1).RowHeight = 25;
    xlsheet.Rows(1).Font.Size=14;
    xlsheet.Rows(1).Font.Name="黑体";

    //先遍历行，再遍历列
    var datatab=document.getElementById("id_tab");

    for(var i=0;i<arr_tdl;i++)
    {
        var tds=datatab.childNodes[0].childNodes[i].childNodes;
        for(var j=0;j<tds.length;j++)
        {
            if(parseInt(tds[j].colSpan)>1)
            {
                xlsheet.Range(xlsheet.Cells(i+2,j+1),xlsheet.Cells(i+2,j+parseInt(tds[j].colSpan))).mergecells=true;
                if(tds[j][0])//考虑到td里面是简单字符还是另有input标签
                xlsheet.Range(xlsheet.Cells(i+2,j+1),xlsheet.Cells(i+2,j+parseInt(tds[j].colSpan))).value=
                j+=parseInt(tds[j].colSpan)-1;
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

/*
* 将标准格式的excel导入为数组，将其中的空单元格改为“null”字符，返回值为二维数组。
* 目前测试能兼容2010,2003
* */
function ImportXLSX(fileName)
{
    var arr_xlsx=[];
    var arr_temp=[];
    var objCon = new ActiveXObject("ADODB.Connection");
    objCon.Provider = "Microsoft.ACE.OLEDB.12.0";
    objCon.ConnectionString = "Data Source=" + fileName + ";Extended Properties=Excel 12.0;";
    objCon.CursorLocation = 1;
    //2003-:Microsoft.Jet.OLEDB.4.0，Excel 8.0
    //2007:Microsoft.ACE.OLEDB.12.0，Excel 8.0
    //2010:Microsoft.ACE.OLEDB.12.0，Excel 12.0可以向下兼容
    objCon.Open;
    var strQuery;
    var strSheetName = "Sheet1$";
    var rsTemp =   new ActiveXObject("ADODB.Recordset");
    rsTemp = objCon.OpenSchema(20);
    if(!rsTemp.EOF)
        strSheetName = rsTemp.Fields("Table_Name").Value;
    rsTemp = null;
    rsExcel =   new ActiveXObject("ADODB.Recordset");
    strQuery = "SELECT * FROM [" + strSheetName + "]";
    rsExcel.ActiveConnection = objCon;
    rsExcel.Open(strQuery);
    while(!rsExcel.EOF)
    {
        arr_temp=[];
        for(i = 0;i<rsExcel.Fields.Count;++i)
        {
            var str_val=rsExcel.Fields(i).value!=null?rsExcel.Fields(i).value:"null";
            arr_temp.push(str_val);
        }
        arr_xlsx.push(arr_temp);
        rsExcel.MoveNext;
    }
    objCon.Close;
    objCon =null;
    rsExcel = null;
    return arr_xlsx;
}
/*
* 将汉字转换为unicode形式
* */
var GB2312UnicodeConverter = {
    ToUnicode: function (str) {
        return escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
    }
    , ToGB2312: function (str) {
        return unescape(str.replace(/\\u/gi, '%u'));
    }
};