/**
 * Created by lz on 2018/2/12.
 */
var arr_fonts=["serif","sans-serif","monospace","fantasy","cuisive","Helvetica","Arial","\'Lucida Grande\'"
    ,"Verdana","Tahoma","\'Trebuchet MS\'","Georgia","Times","宋体","微软雅黑","华文细黑","黑体"];
function RefreshFu()
{
    try
    {
        var int_minFu=parseInt(document.getElementById("str_minFu").value);
        var int_maxFu=parseInt(document.getElementById("str_maxFu").value);
        if(int_minFu>0&&int_maxFu>=int_minFu)
        {//开始生成福字div
            //随机数量
            var int_len=parseInt(RandomBetweenNum(int_minFu,int_maxFu))+1;
            if(int_len==int_maxFu+1)
            {
                int_len=int_maxFu;
            }
            console.log("福字的个数是："+int_len);
            var div_Fus=document.getElementById("div_Fus");
            div_Fus.innerHTML="";
            div_Fus.style.backgroundColor=RandomColor();
            console.log("背景颜色："+div_Fus.style.color);
            for(var i=0;i<int_len;i++)
            {
                var div_Fu=document.createElement("div");
                div_Fu.className="div_Fu";
                div_Fu.style.fontFamily=arr_fonts[RandomPickArr(arr_fonts)]; //随机字体
                console.log("选择字体："+div_Fu.style.fontFamily);
                div_Fu.style.fontWeight=RandomBetweenNumInt(100,900);
                div_Fu.style.color=RandomColor();
                console.log("颜色："+div_Fu.style.color);
                div_Fu.innerHTML="<span>福</span>";
                div_Fu.style.backgroundColor="transparent";
                div_Fu.style.fontSize=RandomBetweenNumInt(20,200)+"px";
                //div的大小由福字大小决定，再进一步的用css拉伸变换
                div_Fu.style.transform="scale("+RandomBetweenNum(0.1,2)+","+RandomBetweenNum(0.1,2)+")";
                div_Fu.style.transform="rotate("+RandomBetweenNumInt(-10,10)+"deg)";
                div_Fus.appendChild(div_Fu);
                div_Fu.style.top=RandomBetweenNumInt(50,350)+"px";
                div_Fu.style.left=RandomBetweenNumInt(50,350)+"px";
                console.log("位置："+div_Fu.style.top+":"+div_Fu.style.left);
                div_Fu.style.position="absolute";
            }

        }
        else
        {
            alert("福字的数量必须大于零，并且最大数量不能小于最小数量。");
        }
    }catch(e)
    {
        alert("出错了！具体错误内容请查看控制台。");
        console.error(e);
    }

}