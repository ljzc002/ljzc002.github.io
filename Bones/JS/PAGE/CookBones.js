/**
 * Created by lz on 2018/12/3.
 */
//在这里写对关键帧脚本的处理和骨骼模型导出
    //定义一种简单的脚本简化输入
var ms={}//MatrixScript
ms.rx=function(rad)//绕x轴旋转
{
    return BABYLON.Matrix.RotationX(rad);
}
ms.ry=function(rad)//绕y轴旋转
{
    return BABYLON.Matrix.RotationY(rad);
}
ms.rz=function(rad)//绕z轴旋转
{
    return BABYLON.Matrix.RotationZ(rad);
}
ms.m1=function(){//生成一个单位阵
    return BABYLON.Matrix.Identity();
}
ms.sc=function(x,y,z)//缩放,因为做了矩阵标准化，在现在的场景里缩放不会起作用！！
{
    return BABYLON.Matrix.Scaling(x,y,z);
}
ms.tr=function(x,y,z)//位移
{
    return BABYLON.Matrix.Translation(x,y,z);
}
//0@ms.m1()#120@ms.rx(2)#240@ms.m1()
ms.fa=function(arr)//从数组生成矩阵
{
    return BABYLON.Matrix.FromArray(arr);
}

var vs={}//VectorScript
vs.tr=function(vec3,matrix)//对向量进行矩阵变化
{
    return BABYLON.Vector3.TransformCoordinates(vec3.clone(),matrix);
}
var pi=Math.PI;

