/**
 * Created by Administrator on 2016/8/4.
 */
sdyq={};//3D引擎
sdyq.object=function()
{//在地面上加速度运动的物体

}
sdyq.object.prototype.init = function(param)
{
    this.keys={w:0,s:0,a:0,d:0,space:0,ctrl:0,shift:0};//按键是否保持按下
    this.witha={forward:0,left:0,up:-9.82};//环境加速度，包括地面阻力和重力，现在还没有风力
    this.witha2={forward:0,left:0,up:0};//与物体本身加速度合并后的最终加速度
    this.v0={forward:0,left:0,up:0};//上一时刻的速度
    this.vt={forward:0,left:0,up:0};//下一时刻的速度
    this.vm={forward:15,backwards:5,left:5,right:5,up:100,down:100};//各个方向的最大速度
    this.flag_song=0;//是否接触地面
    this.flag_runfast=1;//加快速度
    this.ms0=0;//上一时刻毫秒数
    this.mst=0;//下一时刻毫秒数
    this.ry0=0;//上一时刻的y轴转角
    this.ryt=0;//下一时刻的y轴转角
    this.rychange=0;//y轴转角差
    this.schange=0;//秒差
    this.mchange={forward:0,left:0,up:0};//物体自身坐标系上的位移
    this.vmove=new BABYLON.Vector3(0,0,0);//世界坐标系中每一时刻的位移和量
    this.py0=0;//记录上一时刻的y轴位置，和下一时刻比较确定物体有没有继续向下运动！！

    param = param || {};
    this.mesh=param.mesh;
    this.mesh.scaling=param.scaling;
    this.mesh.position=param.position;
    this.mesh.rotation=param.rotation;
    this.mesh.checkCollisions=param.checkCollisions;
    this.mesh.ellipsoid=param.ellipsoid;
    this.mesh.ellipsoidOffset=param.ellipsoidOffset;
    this.skeletonsPlayer=param.skeletonsPlayer;

    this.PlayAnnimation = false;
}
sdyq.object.prototype.beginSP=function(num_type)
{
    this.sp=skeletonsPlayer[num_type];
    this.totalFrame = skeletonsPlayer[0]._scene._activeSkeletons.data.length;//总帧数
    this.start = 0;
    this.end = 100;
    this.VitesseAnim = parseFloat(100 / 100);//动画的速度比
    scene.beginAnimation(sp, (100 * start) / totalFrame, (100 * end) / totalFrame, true, VitesseAnim);//启动动画，skeletonsPlayer是一个骨骼动画对象
    this.PlayAnnimation = true;;
}