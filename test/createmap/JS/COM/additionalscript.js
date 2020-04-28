//在运行时通过import不断更新引入的方法，包括范围判断函数等！
function isInArea1(vec3)
{
    var x=vec3.x+50;
    var z=vec3.z+50;
    if(x+z<=30||x+z>=170)
    {
        return true;
    }
}
function isInArea2(vec3)
{
    var x=vec3.x+50;
    var z=vec3.z+50;
    if(x+z>=90&&x+z<=110)
    {
        return true;
    }
}