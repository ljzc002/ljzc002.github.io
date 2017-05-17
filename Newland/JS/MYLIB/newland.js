/**
 * Created by Administrator on 2017/4/12.
 */
//通用的引擎类内容放在这里
var arr_myplayers=[];
var arr_webplayers=[];
var arr_tempobj=[];//暂存对象初始化信息
var ms0=0;//上一时刻毫秒数
var mst=0;//下一时刻毫秒数
var schange=0;//秒差
var arr_addnewplayer=[];

newland={};
newland.object=function()
{

}
newland.object.prototype.init = function(param)
{//把left改成right
    this.keys={w:0,s:0,a:0,d:0,space:0,ctrl:0,shift:0};//按键是否保持按下
    this.witha0={forward:0,right:0,up:-9.82};//非键盘控制产生的加速度
    this.witha1={forward:0,right:0,up:-9.82};//环境加速度，包括地面阻力和重力，现在还没有风力
    this.witha={forward:0,right:0,up:0};//键盘控制加速度与物体本身加速度和非键盘控制产生的加速度合并后的最终加速度
    this.v0={forward:0,right:0,up:0};//上一时刻的速度
    this.vt={forward:0,right:0,up:0};//下一时刻的速度
    this.vm={forward:15,backwards:5,left:5,right:5,up:100,down:100};//各个方向的最大速度
    //this.flag_runfast=1;//速度系数
    this.ry0=0;//上一时刻的y轴转角
    this.ryt=0;//下一时刻的y轴转角
    this.rychange=0;//y轴转角差
    this.mchange={forward:0,right:0,up:0};//物体自身坐标系上的位移
    this.vmove=new BABYLON.Vector3(0,0,0);//世界坐标系中每一时刻的位移和量
    this.py0=0;//记录上一时刻的y轴位置，和下一时刻比较确定物体有没有继续向下运动！！

    param = param || {};
    this.mesh=param.mesh;
    this.meshname=this.mesh.name;
    this.skeletonsPlayer=param.skeletonsPlayer||[];
    this.submeshs=param.submeshs;
    this.ry0=param.mesh.rotation.y;
    this.py0=param.mesh.position.y;
    this.flag_runfast=param.flag_runfast ||1;
    //this.flag_objfast=param.flag_objfast ||1;
    this.countstop=0;//记录物体静止了几次，如果物体一直静止就停止发送运动信息

    this.PlayAnnimation = false;
    this.methodofmove=param.methodofmove||"";
    /*switch(this.methodofmove)
    {
        case "CrossControl":
        {
            window.addEventListener("keydown", onKeyDown, false);//按键按下
            window.addEventListener("keyup", onKeyUp, false);//按键抬起
            break;
        }
        case "OneDOFControl":
        {
            window.addEventListener("keydown", onKeyDown, false);//按键按下
            window.addEventListener("keyup", onKeyUp, false);//按键抬起
            break;
        }
        case "TwoDOFsControl":
        {
            window.addEventListener("keydown", onKeyDown, false);//按键按下
            window.addEventListener("keyup", onKeyUp, false);//按键抬起
            break;
        }
        default :
        {
            break;
        }
    }*/
    window.addEventListener("keydown", onKeyDown, false);//按键按下
    window.addEventListener("keyup", onKeyUp, false);//按键抬起
}
//骨骼动画
newland.object.prototype.beginSP=function(num_type)
{
    if(this.skeletonsPlayer.length>0)
    {
        this.sp = this.skeletonsPlayer[num_type];

        this.totalFrame = this.skeletonsPlayer[0]._scene._activeSkeletons.data.length;//总帧数
        this.start = 0;
        this.end = 100;
        this.VitesseAnim = parseFloat(100 / 100);//动画的速度比
        scene.beginAnimation(this.sp, (100 * this.start) / this.totalFrame, (100 * this.end) / this.totalFrame, true, this.VitesseAnim);//启动动画，skeletonsPlayer是一个骨骼动画对象
        this.PlayAnnimation = true;
    }
    else
    {//本体不能启动骨骼动画，则直接启动其子元素的骨骼动画
        var len=this.submeshs.length;
        for(var i=0;i<len;i++)
        {
            var skeleton=this.submeshs[i].skeleton;
            var totalFrame = skeleton._scene._activeSkeletons.data.length;//总帧数
            var start = 0;
            var end = 100;
            var VitesseAnim = parseFloat(100 / 100);//动画的速度比
            scene.beginAnimation(skeleton, (100 * start) / totalFrame, (100 * end) / totalFrame, true, VitesseAnim);
        }
        this.PlayAnnimation = true;
    }
}
newland.object.prototype.stopSP=function(num_type)
{
    this.PlayAnnimation = false;
    if(this.skeletonsPlayer.length>0)
    {
        scene.stopAnimation(this.skeletonsPlayer[0]);
    }
    else
    {
        var len=this.submeshs.length;
        for(var i=0;i<len;i++)
        {
            var skeleton=this.submeshs[i].skeleton;
            scene.stopAnimation(skeleton);
        }
    }
}
//建立并返回一个三角形图元
newland.make_tryangle=function(p1,p2,p3,name)
{
    var vertexData= new BABYLON.VertexData();
    var positions=[p1.position[0],p1.position[1],p1.position[2],p2.position[0],p2.position[1],p2.position[2]
        ,p3.position[0],p3.position[1],p3.position[2]];
    var uvs=[p1.uv[0],p1.uv[1],p2.uv[0],p2.uv[1],p3.uv[0],p3.uv[1]];
    var normals=[p1.normal[0],p1.normal[1],p1.normal[2],p2.normal[0],p2.normal[1],p2.normal[2]
        ,p3.normal[0],p3.normal[1],p3.normal[2]];
    var indices=[0,1,2];
    //BABYLON.VertexData.ComputeNormals(positions, indices, normals);//计算法线
    BABYLON.VertexData._ComputeSides(0, positions, indices, normals, uvs);
    vertexData.indices = indices.concat();//索引
    vertexData.positions = positions.concat();
    vertexData.normals = normals.concat();//position改变法线也要改变！！！！
    vertexData.uvs = uvs.concat();

    var mesh=new BABYLON.Mesh(name,scene);
    vertexData.applyToMesh(mesh, true);
    mesh.vertexData=vertexData;
    return mesh;
}
//一些通用的方法也放在这里
//obj_key是克隆对象
//arr是一些初始化参数
function MyCloneplayer(obj_key,arr)//根据mesh的具体情况决定使用何种克隆方式，这里mesh的具体情况由Player类决定
{
    var Tom = new Player;
    var obj_p = {};
    if(obj_key.mesh.skeleton)//简单骨骼模型
    {
        obj_p.mesh = obj_key.mesh.clone(arr[14]+"@"+arr[0]);
        obj_p.mesh.skeleton=obj_key.mesh.skeleton.clone(arr[14]+"@"+arr[0] + "0");
        obj_p.skeletonsPlayer = [obj_p.mesh.skeleton];
        obj_p.submeshs=[];
    }
    else if(obj_key.submeshs)//复杂模型
    {
        //obj_p.mesh=obj_key.mesh.clone(arr[14]+"@"+arr[0]);
        obj_p.mesh=new BABYLON.Mesh("meshPlayer2",scene);
        obj_p.mesh.position=obj_key.mesh.position;
        obj_p.mesh.rotation=obj_key.mesh.rotation;
        obj_p.mesh.scaling=obj_key.mesh.scaling;

        var len=obj_key.submeshs.length;
        var arr_meshs=[];
        for(var i=0;i<len;i++)
        {
            var mesh=obj_key.submeshs[i].clone(arr[14]+"@"+arr[0] + i);
            mesh.skeleton=obj_key.submeshs[i].skeleton.clone();
            mesh.parent=obj_p.mesh;
            arr_meshs.push(mesh);
        }
        obj_p.submeshs=arr_meshs;

        if(obj_key.mesh.skeleton!=undefined) {//如果父元素本身拥有启动骨骼动画的能力，则直接克隆父元素的骨骼动画
            obj_p.skeletonsPlayer = [obj_key.skeletonsPlayer[0].clone("clonedSkeleton" + arr[0])];
        }
    }
    else //不是模型
    {
        obj_p.mesh = new BABYLON.Mesh(arr[0],scene);
        obj_p.mesh.renderingGroupId=2;
    }

    obj_p.mesh.scaling = new BABYLON.Vector3(parseFloat(arr[2]), parseFloat(arr[3]), parseFloat(arr[4]));//缩放
    obj_p.mesh.position = new BABYLON.Vector3(parseFloat(arr[5]), parseFloat(arr[6]), parseFloat(arr[7]));//位置
    obj_p.mesh.rotation = new BABYLON.Vector3(parseFloat(arr[8]), parseFloat(arr[9]), parseFloat(arr[10]));// 旋转
    //obj_p.checkCollisions = false;//使用默认的碰撞检测
    //obj_p.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);//碰撞检测椭球
    //obj_p.ellipsoidOffset = new BABYLON.Vector3(0, 2, 0);//碰撞检测椭球位移

    obj_p.methodofmove = "controlwitha";
    obj_p.id = arr[0];
    obj_p.name = arr[15];
    obj_p.p1 = arr[11];
    obj_p.p2 = arr[12];
    obj_p.p3 = arr[13];
    Tom.init(
        obj_p,scene
    );
    return Tom;
}

//生成随机字符串
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
//将点路径转化为闭合凸多边形，可以和babylonjs的条带网格配合使用
function pathtoplate(path,name,scene,flag_back)
{
    var len=path.length;
    var num_sumx=0,num_sumy=0,num_sumz=0;
    var num_minx=0,num_miny=0,num_minz=0;
    var num_maxx=0,num_maxy=0,num_maxz=0;
    for(var i=0;i<len;i++)
    {
        var point=path[i];
        if(i==0)
        {
            num_minx=point.x;
            num_miny=point.y;
            num_minz=point.z;
            num_maxx=point.x;
            num_maxy=point.y;
            num_maxz=point.z;
        }
        else
        {
            if(point.x>num_maxx)
            {
                num_maxx=point.x;
            }
            else if(point.x<num_minx)
            {
                num_minx=point.x;
            }
            if(point.y>num_maxy)
            {
                num_maxy=point.y;
            }
            else if(point.y<num_miny)
            {
                num_miny=point.y;
            }
            if(point.z>num_maxz)
            {
                num_maxz=point.z;
            }
            else if(point.z<num_minz)
            {
                num_minz=point.z;
            }
        }
        num_sumx+=point.x;
        num_sumy+=point.y;
        num_sumz+=point.z;
    }
    var point_centre=new BABYLON.Vector3(num_sumx/len,num_sumy/len,num_sumz/len);
    var adx=num_maxx-num_minx;
    var ady=num_maxy-num_miny;
    var adz=num_maxz-num_minz;

    var vertexData= new BABYLON.VertexData();
    var positions=[];
    var uvs=[];
    var normals=[];
    var indices=[];
    for(var i=0;i<len;i++)
    {
        var point=path[i];
        positions.push(point.x);//定义位置时一般以坐标原点为零点
        positions.push(point.y);
        positions.push(point.z);
        //定义纹理坐标时则以纹理左下角为零点，假设这个平面是与地面平行的！！
        uvs.push((point.x-num_minx)/adx);
        uvs.push((point.z-num_minz)/adz);
    }
    positions.push(point_centre.x);
    positions.push(point_centre.y);
    positions.push(point_centre.z);
    uvs.push((point_centre.x-num_minx)/adx);
    uvs.push((point_centre.z-num_minz)/adz);

    for(var i=0;i<len;i++)
    {
        if(flag_back!=1)
        {
            indices.push(i);
            indices.push(len);
            indices.push((i+1)==len?0:(i+1));
        }
        else
        {
            indices.push(i);
            indices.push((i+1)==len?0:(i+1));
            indices.push(len);
        }

    }
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);//计算法线
    /*if(flag_back==1)//只显示背面，所以把法线倒转一下
     {
     var len=normals.length;
     for(var i=0;i<len;i++)
     {
     normals[i]=-normals[i];
     }
     }*/
    BABYLON.VertexData._ComputeSides(0, positions, indices, normals, uvs);//根据法线分配纹理朝向
    vertexData.indices = indices.concat();//索引
    vertexData.positions = positions.concat();
    vertexData.normals = normals.concat();//position改变法线也要改变！！！！
    vertexData.uvs = uvs.concat();

    var mesh=new BABYLON.Mesh(name,scene);
    vertexData.applyToMesh(mesh, true);
    mesh.vertexData=vertexData;
    return mesh;
}

//把缓存数组变成顶点数组
function BuffertoArray(arr,count)
{
    var len=arr.length;
    var m=len%count;
    if(m>0)//arr不能整除count
    {
        for(var i=0;i<m;i++)
        {
            arr.push(0);
        }
    }
    len=arr.length;
    var arr2=[];
    for(var i=0;i<len;i+=3)
    {
        arr2.push([arr[i],arr[i+1],arr[i+2]]);
    }
    return arr2;
}
//顶点数组转换成缓存数组
function ArraytoBuffer(arr)
{
    var len=arr.length;
    var arr2=[];
    for(var i=0;i<len;i++)
    {
        for(var j=0;j<arr[i].length;j++)
        {
            arr2.push(arr[i][j]);
        }
    }
    return arr2;
}
//推入历史数组，也要考虑向远端传输的问题，所以最好把每一次改变都抽象为增量
function PushHistory(obj)
{
    arr_history.push(obj);
    /*var arr_temp=[];
    var len=arr_mesh.length;
    if(len>1)
    {
        for(var i=0;i<len;i++)
        {
            arr_temp.push(arr_mesh[i].clone());
        }
    }*/
}
//回退历史操作
function PopHistory()
{
    if(arr_history.length>0)
    {
        var obj=arr_history.pop();
        //对每一种可以回退的操作进行遍历
        switch(obj[1])
        {
            case "AddMesh":
            {
                DeleteMesh(obj[2]);
                break;
            }
            case "AdjustPos":
            {
                inAdjustPos(obj[2],obj[3]);
                break;
            }
            case "AdjustRoa":
            {
                inAdjustRoa(obj[2],obj[3]);
                break;
            }
            case "AdjustSca":
            {
                inAdjustSca(obj[2],obj[3]);
                break;
            }
            default :
            {
                console.log(MakeDateStr2()+"没有找到这种回退类型："+obj.toString());
                break;
            }

        }
    }
}
