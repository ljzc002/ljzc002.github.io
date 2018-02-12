/**
 * Created by lz on 2018/2/12.
 */
//检查一个数组的长度，从中随机选择一个
function RandomPickArr(arr)
{
    var num_r=Math.random();
    var len=arr.length;
    var index=parseInt(num_r*(len+1));
    if(index==len+1)
    {
        index=len;
    }
    return index;
}
//在两个数之间找一个随机数
function RandomBetweenNum(num_min,num_max)
{
    var num_r=Math.random();
    num_r=num_r*(num_max-num_min)+num_min;
    return num_r;
}
//在两个数之间找一个随机数并取整，从1开始
function RandomBetweenNumInt(num_min,num_max)
{
    var num_r=Math.random();
    num_r=num_r*(num_max-num_min)+num_min;
    int_r=parseInt(num_r+1);
    if(int_r==num_r+1)
    {
        int_r=num_r;
    }
    return int_r;
}
//返回一个随机颜色对象
function RandomColor()
{
    var hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
    while (hex.length < 6) { //while循环判断hex位数，少于6位前面加0凑够6位
        hex = '0' + hex;
    }
    return '#' + hex; //返回‘#'开头16进制颜色
}