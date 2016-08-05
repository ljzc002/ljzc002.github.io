/**
 * Created by Administrator on 2016/8/3.
 */
//根据配置实时显示变量值
var arr_valueset=[[["keys"],["w","s","a","d","space","ctrl","shift"]]
    ,[["witha"],["forward","left","up"]]
    ,[["witha2"],["forward","left","up"]]
    ,[["v0"],["forward","left","up"]],[["vt"],["forward","left","up"]],[[""],["schange"]]
    ,[["mchange"],["forward","left","up"]]
    ,[["vmove"],["x","y","z"]]
    ,[["meshPlayer.position"],["x","y","z"]]
    ,[["cameraArcRotative[0].target"],["x","y","z"]]];//第一个参数是对象名，也用来规定一行，第二个参数是对象的属性名
function  WriteLog2()
{
    var div=$("#div_condition2")[0];
    var len =arr_valueset.length;
    var arr_str=[];
    for(var i=0;i<len;i++)
    {
        if(arr_valueset[i][0]!="")//对象属性
        {
            //var span=document.createElement("span");//这种插入法会大幅降低帧数？
            //span.className="span_smallstr";
            arr_str.push(arr_valueset[i][0]+": ");
            var len2=arr_valueset[i][1].length;
            for(var j=0;j<len2;j++)
            {
                var str=arr_valueset[i][1][j]+":"+eval(arr_valueset[i][0]+"."+arr_valueset[i][1][j]);
                if(j==0)
                {
                    str="{"+str;
                }
                if(j>0)
                {
                    str=","+str;
                }
                if(j==(len2-1))
                {
                    str=str+"}\r\n";
                }
                arr_str.push(str);
            }
        }
        else//全局变量
        {
            arr_str.push("global: ");
            var len2=arr_valueset[i][1].length;
            for(var j=0;j<len2;j++)
            {
                var str=arr_valueset[i][1][j]+":"+eval(arr_valueset[i][1][j]);
                if(j>0)
                {
                    str=","+str;
                }
                if(j==(len2-1))
                {
                    str=str+"\r\n";
                }
                arr_str.push(str);
            }
        }
    }
    var str_all=arr_str.join("");
    div.innerHTML=str_all;
}
