/**
 * Created by Administrator on 2017/4/12.
 */
    //开头小写表示这个库尚存疑不确定
//通用的引擎类内容放在这里
//var arr_myplayers=[];
//var arr_webplayers=[];
//var arr_tempobj=[];//暂存对象初始化信息
//var ms0=0;//上一时刻毫秒数
//var mst=0;//下一时刻毫秒数
//var schange=0;//秒差
//var arr_addnewplayer=[];

newland={};
newland.object=function()
{

}
newland.object.prototype.init = function(param)
{
    //启用物理引擎后这一部分可能用不上，但暂时保留
    //this.keys={w:0,s:0,a:0,d:0,space:0,ctrl:0,shift:0};//按键是否保持按下
    this.witha0={forward:0,right:0,up:-9.82};//非键盘控制产生的加速度
    this.witha={forward:0,right:0,up:-9.82};//环境加速度，包括地面阻力和重力，现在还没有风力
    this.witha2={forward:0,right:0,up:0};//键盘控制加速度与物体本身加速度和非键盘控制产生的加速度合并后的最终加速度
    this.v0={forward:0,right:0,up:0};//上一时刻的速度
    this.vt={forward:0,right:0,up:0};//下一时刻的速度
    this.vm={forward:15,backwards:5,left:5,right:5,up:100,down:100};//各个方向的最大速度
    this.fm={forward:2,backwards:1,left:1,right:1,up:10,down:10};//各个方向的最大发力
    this.ff=0.05;//在地面不做任何发力时的阻力效果
    //this.flag_runfast=1;//速度系数
    this.ry0=0;//上一时刻的y轴转角
    this.ryt=0;//下一时刻的y轴转角
    this.rychange=0;//y轴转角差
    this.mchange={forward:0,right:0,up:0};//物体自身坐标系上的位移
    this.vmove=new BABYLON.Vector3(0,0,0);//世界坐标系中每一时刻的位移和量
    this.py0=0;//记录上一时刻的y轴位置，和下一时刻比较确定物体有没有继续向下运动！！

    param = param || {};
    this.mesh=param.mesh;
    //this.meshname=this.mesh.name;
    this.skeletonsPlayer=param.skeletonsPlayer||[];
    this.submeshs=param.submeshs;
    this.ry0=param.mesh.rotation.y;
    this.py0=param.mesh.position.y;
    this.flag_objfast=param.flag_objfast ||1;
    this.standonTheGround=0;//一开始在空中，落到地上
    //this.flag_objfast=param.flag_objfast ||1;
    this.countstop=0;//记录物体静止了几次，如果物体一直静止就停止发送运动信息

    this.PlayAnnimation = false;
    this.methodofmove=param.methodofmove||"";
    this.path_goto="sleep";//这个物体接到指令要去哪里,是一个向量数组（路径）

    //window.addEventListener("keydown", onKeyDown, false);//按键按下
    //window.addEventListener("keyup", onKeyUp, false);//按键抬起
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
newland.make_tryangle=function(p1,p2,p3,name,scene)//参数是自定义的构造体
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

//用三个圆柱体画一个坐标轴
newland.make_axis=function(scene, size)
{
    //X axis
    var x = BABYLON.Mesh.CreateCylinder("x", size, 0.1, 0.1, 6, scene, false);
    x.material = new BABYLON.StandardMaterial("xColor", scene);
    x.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    x.position = new BABYLON.Vector3(size/2, 0, 0);
    x.rotation.z = Math.PI / 2;
    x.renderingGroupId=2;

    //Y axis
    var y = BABYLON.Mesh.CreateCylinder("y", size, 0.1, 0.1, 6, scene, false);
    y.material = new BABYLON.StandardMaterial("yColor", scene);
    y.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    y.position = new BABYLON.Vector3(0, size / 2, 0);
    y.renderingGroupId=2;

    //Z axis
    var z = BABYLON.Mesh.CreateCylinder("z", size, 0.1, 0.1, 6, scene, false);
    z.material = new BABYLON.StandardMaterial("zColor", scene);
    z.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    z.position = new BABYLON.Vector3(0, 0, size/2);
    z.rotation.x = Math.PI / 2;
    z.renderingGroupId=2;
}
//一些通用的方法也放在这里
//obj_key是克隆对象
//arr是一些初始化参数
newland.MyCloneplayer=function(obj_key,arr,scene)//根据mesh的具体情况决定使用何种克隆方式，这里mesh的具体情况由Player类决定
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
newland.randomString=function(len)
{
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
newland.pathtoplate=function(path,name,scene,flag_back)
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
    var adx=num_maxx-num_minx;//总宽度
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
newland.BuffertoArray=function(arr,count)
{
    var len=arr.length;
    var m=len%count;
    if(m>0)//arr不能整除count，则补齐
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
newland.ArraytoBuffer=function(arr)
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
//将TypedArray转化为普通array
newland.BuffertoArray2=function(arr)
{
    var arr2=[];
    var len=arr.length;
    for(var i=0;i<len;i++)
    {
        arr2.push(arr[i]);
    }
    return arr2;
}
//将缓存数组转化为向量（三维）数组
newland.BuffertoVector=function(arr)
{
    var arr2=[];
    var len=arr.length;
    var m=len%3;
    if(m>0)//arr不能整除count，则补齐
    {
        for(var i=0;i<m;i++)
        {
            arr.push(0);
        }
    }
    len=arr.length;
    for(var i=0;i<len;i+=3)
    {
        arr2.push(new BABYLON.Vector3(arr[i],arr[i+1],arr[i+2]));
    }
    return arr2;
}
//批量添加资源加载任务
newland.addTask=function(arr_assets,game)
{
    var len=arr_assets.length;
    for(var i=0;i<len;i++)
    {
        var str_temp=""
        var str_params="";
        let obj_task=arr_assets[i];
        str_params="'"+obj_task.params.join("','")+"'";
        str_temp="assetsManager."+obj_task.type+"("+str_params+")";
        var task_temp=eval(str_temp);
        task_temp.onSuccess = function(task) {
            obj_task.callback(task,obj_task.name);
        }

    }
    //eval;
    //assetsManager.
}
//根据正方形边长找大于size的最小的2的整数次幂
newland.FindPower=function(size)
{
    var int1=Math.ceil(Math.log2(size));
    return Math.pow(2,int1);
}
//根据数据长度找最小的2的整数次幂
newland.FindPower2=function(len)
{
    var int1=Math.sqrt(len);
    return this.FindPower(int1);
}
//将一个浮点数组转化为DataTexture，这是浮点数小于1的情况，要注意canvas和webgl对颜色属性的自动处理！！！！
newland.TranArrToPng1=function(arr,width,height)
{
    var can_temp=document.createElement("canvas");
    can_temp.width=width;
    can_temp.height=height;
    var context=can_temp.getContext("2d");
    context.fillStyle="rgba(0,0,255,1)";//多余的位都是1？
    context.fillRect(0,0,width,height);
    var imagedata=context.getImageData(0,0,width,height);
    var len=arr.length;//小数部分会自动四舍五入！！！！默认palpha必定小于1
    for(var i=0;i<len;i+=1)//arr的长度必须是4的整数倍！！！！
    {
        var str_num=arr[i]+"";
        //var int_0=str_num.indexOf();
        var len_str=str_num.length;
        var count_0=0;
        for(var j=0;j<len_str;j++)
        {
            if(str_num[j]=="0"||str_num[j]==".")
            {
                continue;
            }
            else
            {
                count_0=j;//找到第一个非零数
                break;
            }
        }
        var num1=parseInt(str_num.substr(count_0,2));
        var num2=parseInt(str_num.substr(count_0+2,2));
        //var num3=parseInt(str_num.substr(count_0+4,2));
        var num4=4+(count_0-2);
        imagedata.data[i*4]=num1;//原样把数据灌进纹理里去,这里的数据可能大于1！！！！glsl纹理采样器是否允许？？？？
        imagedata.data[i*4+1]=num2;
        imagedata.data[i*4+2]=num4;
        //imagedata.data[i*4+3]=num4;
    }
    context.putImageData(imagedata,0,0);
    var strsrc_palpha=can_temp.toDataURL("image/png");
    //can_temp.dispose();
    can_temp=null;
    return strsrc_palpha;
}
//把一个或多个本工程给出的网格对象导出成一个Babylon场景文件
newland.ExportBabylonMesh=function(arr_mesh,filename,mat)
{
    var obj_scene=
    {//最简场景对象
        'autoClear': true,
        'clearColor': [0,0,0],
        'ambientColor': [0,0,0],
        'gravity': [0,-9.81,0],
        'cameras':[],
        'activeCamera': null,
        'lights':[],
        'materials':[{
            'name': mat.name,
            'id': mat.id,
            'ambient': [mat.ambientColor.r,mat.ambientColor.g,mat.ambientColor.b],
            'diffuse': [mat.diffuseColor.r,mat.diffuseColor.g,mat.diffuseColor.b],
            'specular': [mat.specularColor.r,mat.specularColor.g,mat.specularColor.b],
            'specularPower': mat.specularPower,
            'emissive': [mat.emissiveColor.r,mat.emissiveColor.g,mat.emissiveColor.b],
            'alpha': mat.alpha,
            'backFaceCulling': mat.backFaceCulling,
            'diffuseTexture': { },
            'wireframe':mat.wireframe,
            'twoSidedLighting':mat.twoSidedLighting
        }],
        'geometries': {},
        'meshes': [],
        'multiMaterials': [],
        'shadowGenerators': [],
        'skeletons': [],
        'sounds': []//,
        //'metadata':{'walkabilityMatrix':[]}
    };
    var len=arr_mesh.length;
    //推入每一个网格
    for(var i=0;i<len;i++)
    {
        var obj_mesh={};
        var mesh=arr_mesh[i];

        obj_mesh.name=mesh.name;
        obj_mesh.id=mesh.id;
        obj_mesh.materialId=mat.id;
        obj_mesh.position=[mesh.position.x,mesh.position.y,mesh.position.z];
        obj_mesh.rotation=[mesh.rotation.x,mesh.rotation.y,mesh.rotation.z];
        obj_mesh.scaling=[mesh.scaling.x,mesh.scaling.y,mesh.scaling.z];
        obj_mesh.isVisible=true;
        obj_mesh.isEnabled=true;
        obj_mesh.checkCollisions=false;
        obj_mesh.billboardMode=0;
        obj_mesh.receiveShadows=true;
        obj_mesh.metadata=mesh.metadata;
        if(mesh.geometry)//是有实体的网格
        {
            var vb=mesh.geometry._vertexBuffers;
            obj_mesh.positions=newland.BuffertoArray2(vb.position._buffer._data);
            obj_mesh.normals=newland.BuffertoArray2(vb.normal._buffer._data);
            obj_mesh.uvs= newland.BuffertoArray2(vb.uv._buffer._data);
            obj_mesh.indices=newland.BuffertoArray2(mesh.geometry._indices);
            obj_mesh.subMeshes=[{
                'materialIndex': 0,
                'verticesStart': 0,
                'verticesCount': mesh.geometry._totalVertices,
                'indexStart': 0,
                'indexCount': mesh.geometry._indices.length
            }];
            //obj_mesh.matricesIndices=mesh.matricesIndices?mesh.matricesIndices:[];
            //obj_mesh.matricesWeights=mesh.matricesWeights?mesh.matricesWeights:[];
            //obj_mesh.metadata={};
            obj_mesh.parentId=mesh.parent?mesh.parent.id:null;
            //obj_mesh.skeletonId=0;

        }
        else
        {
            obj_mesh.positions=[];
            obj_mesh.normals=[];
            obj_mesh.uvs=[];
            obj_mesh.indices=[];
            obj_mesh.subMeshes=[{
                'materialIndex': 0,
                'verticesStart': 0,
                'verticesCount': 0,
                'indexStart': 0,
                'indexCount': 0
            }];
            //obj_mesh.matricesIndices=[];
            //obj_mesh.matricesWeights=[];
            //obj_mesh.metadata={};
            obj_mesh.parentId=null;
            //obj_mesh.skeletonId=-1;
        }
        obj_scene.meshes.push(obj_mesh);
        //obj_scene.skeletons[0].bones=obj_scene.skeletons[0].bones.concat(mesh.bones);
    }
    var str_data=JSON.stringify(obj_scene);
    DownloadText(filename,str_data,".babylon");
}
//向一个canvas上下文里自动换行的插入文字（来自网上）
newland.canvasTextAutoLine=function(str,ctx,initX,initX2,initY,lineHeight){
    //var ctx = canvas.getContext("2d");
    var lineWidth = 0;
    var canvasWidth = ctx.canvas.width;
    var lastSubStrIndex= 0;
    for(let i=0;i<str.length;i++){
        lineWidth+=ctx.measureText(str[i]).width;
        if(lineWidth>canvasWidth-initX2){//减去initX,防止边界出现的问题
            ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
            initY+=lineHeight;
            lineWidth=0;
            lastSubStrIndex=i;
        }
        if(i==str.length-1){
            ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
        }
    }
}
newland.RandomChooseFromObj=function(obj)//随机从一个对象的所有属性中按照概率选择一个属性
{
    var len=Object.getOwnPropertyNames(obj).length;//所有属性的个数
    var count_rate=0;
    var num=Math.random();
    var result=null;
    for(var key in obj)
    {
        var ratep=1/len;
        var pro=obj[key];
        if(pro.rate)
        {
            ratep=pro.rate;
        }
        count_rate+=ratep;
        if(count_rate>num)
        {
            result=pro;
            return result;//理论上讲总会从这里返回一个
        }
    }
    return "fault";
}
newland.RandomBool=function(rate)//根据概率随机决定是否为真
{
    var num=Math.random();
    if(num<rate)
    {
        return true;
    }
    else
    {
        return false;
    }
}
//用六个平面围成一个立方体，立方体的内部作为竞技场，竞技场可以设置地面和中景观众席（半高的围墙），在竞技场的外层再设置天空盒
//-》在对平面使用cannon物理引擎时，出现时而穿过时而反弹的不确定现象，考虑换成一个boxmesh或者六个boxmesh！
newland.CreateCubeArenaWithPhy=function(obj_p)
{
    //物理引擎能自动收集子网格的形状吗？-》猜测不能
    //这个竞技场主要用来从里向外看。。。
    //要建立一个测试物理效果的方法群
    //设置形状位置和姿态
    if(true)
    {
        var  flag_inout=obj_p.flag_inout?obj_p.flag_inout:1;//1表示所有面的正面向外，人们主要看到这个形状的外侧，-1表示正面向里，相机主要在形状的内部。
        var size_adjust=0.1;
        var size_thick=0.08;
        var flag_seeimp=false;//仿真器边界是否可见
        //CreatePlane
        //改成用CreateGround，但初始状态是完全不同的！先测试向外的情况？ground应该没有双面吧？
        //为了让墙壁能够更宽，将墙壁外移
        var mesh_oz=new BABYLON.MeshBuilder.CreateGround("mesh_oz"
            ,{height:obj_p.sizey,width:obj_p.sizex
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_oz.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z-obj_p.sizez/2);
        mesh_oz.rotation=new BABYLON.Vector3(flag_inout*Math.PI/2,0,0);//旋转是右手坐标？？//从ground的初始位置开始旋转
        var mesh_oz2=new BABYLON.MeshBuilder.CreateBox("mesh_oz2"
            ,{width:obj_p.sizex-size_adjust,height:size_thick,depth:obj_p.sizey-size_adjust},scene);
        //mesh_oz2.parent=mesh_oz;
        mesh_oz2.position=mesh_oz.position.clone();
        mesh_oz2.rotation=mesh_oz.rotation.clone();
        mesh_oz2.isVisble=flag_seeimp;
        mesh_oz2.renderingGroupId=0;

        var mesh_z=new BABYLON.MeshBuilder.CreateGround("mesh_z"
            ,{height:obj_p.sizey,width:obj_p.sizex
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_z.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z+obj_p.sizez/2);
        mesh_z.rotation=new BABYLON.Vector3(-flag_inout*Math.PI/2,0,0);
        var mesh_z2=new BABYLON.MeshBuilder.CreateBox("mesh_z2"
            ,{width:obj_p.sizex-size_adjust,height:size_thick,depth:obj_p.sizey-size_adjust},scene);
        mesh_z2.position=mesh_z.position.clone();
        mesh_z2.rotation=mesh_z.rotation.clone();
        mesh_z2.isVisble=flag_seeimp;
        mesh_z2.renderingGroupId=0;

        var mesh_ox=new BABYLON.MeshBuilder.CreateGround("mesh_ox"
            ,{height:obj_p.sizez,width:obj_p.sizey
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_ox.position=new BABYLON.Vector3(obj_p.x-obj_p.sizex/2,obj_p.y,obj_p.z);
        mesh_ox.rotation=new BABYLON.Vector3(0,0,-flag_inout*Math.PI/2);
        var mesh_ox2=new BABYLON.MeshBuilder.CreateBox("mesh_ox2"
            ,{width:obj_p.sizey-size_adjust,height:size_thick,depth:obj_p.sizez-size_adjust},scene);
        mesh_ox2.position=mesh_ox.position.clone();
        mesh_ox2.rotation=mesh_ox.rotation.clone();
        mesh_ox2.isVisble=flag_seeimp;
        mesh_ox2.renderingGroupId=0;

        var mesh_x=new BABYLON.MeshBuilder.CreateGround("mesh_x"
            ,{height:obj_p.sizez,width:obj_p.sizey
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_x.position=new BABYLON.Vector3(obj_p.x+obj_p.sizex/2,obj_p.y,obj_p.z);
        mesh_x.rotation=new BABYLON.Vector3(0,0,flag_inout*Math.PI/2);
        var mesh_x2=new BABYLON.MeshBuilder.CreateBox("mesh_x2"
            ,{width:obj_p.sizey-size_adjust,height:size_thick,depth:obj_p.sizez-size_adjust},scene);
        mesh_x2.position=mesh_x.position.clone();
        mesh_x2.rotation=mesh_x.rotation.clone();
        mesh_x2.isVisble=flag_seeimp;
        mesh_x2.renderingGroupId=0;

        var mesh_oy=new BABYLON.MeshBuilder.CreateGround("mesh_oy"
            ,{height:obj_p.sizez,width:obj_p.sizex
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_oy.position=new BABYLON.Vector3(obj_p.x,obj_p.y-obj_p.sizey/2,obj_p.z);
        mesh_oy.rotation=new BABYLON.Vector3(-Math.PI/2-flag_inout*Math.PI/2,0,0);
        var mesh_oy2=new BABYLON.MeshBuilder.CreateBox("mesh_oy2"
            ,{width:obj_p.sizex-size_adjust,height:size_thick,depth:obj_p.sizez-size_adjust},scene);
        mesh_oy2.position=mesh_oy.position.clone();
        mesh_oy2.rotation=mesh_oy.rotation.clone();
        mesh_oy2.isVisble=flag_seeimp;
        mesh_oy2.renderingGroupId=0;

        var mesh_y=new BABYLON.MeshBuilder.CreateGround("mesh_y"
            ,{height:obj_p.sizez,width:obj_p.sizex
            ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :2},scene);
        mesh_y.position=new BABYLON.Vector3(obj_p.x,obj_p.y+obj_p.sizey/2,obj_p.z);
        mesh_y.rotation=new BABYLON.Vector3(-Math.PI/2+flag_inout*Math.PI/2,0,0);
        var mesh_y2=new BABYLON.MeshBuilder.CreateBox("mesh_y2"
            ,{width:obj_p.sizex-size_adjust,height:size_thick,depth:obj_p.sizez-size_adjust},scene);
        mesh_y2.position=mesh_y.position.clone();
        mesh_y2.rotation=mesh_y.rotation.clone();
        mesh_y2.isVisble=flag_seeimp;
        mesh_y2.renderingGroupId=0;
    }
    //设置纹理和可见性
    if(obj_p.totalMat)
    {
        mesh_oz.material=obj_p.totalMat;//MyGame.materials.mat_blue;//这种耦合的方法并不可取
        mesh_oz.renderingGroupId=2;
        mesh_z.material=obj_p.totalMat;
        mesh_z.renderingGroupId=2;
        mesh_ox.material=obj_p.totalMat;
        mesh_ox.renderingGroupId=2;
        mesh_x.material=obj_p.totalMat;
        mesh_x.renderingGroupId=2;
        mesh_oy.material=obj_p.totalMat;
        mesh_oy.renderingGroupId=2;
        mesh_y.material=obj_p.totalMat;
        mesh_y.renderingGroupId=2;
    }
    else
    {
        if(obj_p.mat_oz)
        {
            mesh_oz.material=obj_p.mat_oz;
            mesh_oz.renderingGroupId=2;
        }
        else
        {
            mesh_oz.renderingGroupId=0;
        }
        if(obj_p.mat_z)
        {
            mesh_z.material=obj_p.mat_z;
            mesh_z.renderingGroupId=2;
        }
        else
        {
            mesh_z.renderingGroupId=0;
        }
        if(obj_p.mat_ox)
        {
            mesh_ox.material=obj_p.mat_ox;
            mesh_ox.renderingGroupId=2;
        }
        else
        {
            mesh_ox.renderingGroupId=0;
        }
        if(obj_p.mat_x)
        {
            mesh_x.material=obj_p.mat_x;
            mesh_x.renderingGroupId=2;
        }
        else
        {
            mesh_x.renderingGroupId=0;
        }
        if(obj_p.mat_oy)
        {
            mesh_oy.material=obj_p.mat_oy;
            mesh_oy.renderingGroupId=2;
        }
        else
        {
            mesh_oy.renderingGroupId=0;
        }
        if(obj_p.mat_y)
        {
            mesh_y.material=obj_p.mat_y;
            mesh_y.renderingGroupId=2;
        }
        else
        {
            mesh_y.renderingGroupId=0;
        }
    }
    var mesh_arena=new BABYLON.Mesh("mesh_arena",scene);
    mesh_oz.parent=mesh_arena;
    mesh_z.parent=mesh_arena;
    mesh_ox.parent=mesh_arena;
    mesh_x.parent=mesh_arena;
    mesh_oy.parent=mesh_arena;
    mesh_y.parent=mesh_arena;
    mesh_oz.computeWorldMatrix(true);
    mesh_z.computeWorldMatrix(true);
    mesh_ox.computeWorldMatrix(true);
    mesh_x.computeWorldMatrix(true);
    mesh_oy.computeWorldMatrix(true);
    mesh_y.computeWorldMatrix(true);

    var mat_frame = new BABYLON.StandardMaterial("mat_frame", scene);
    mat_frame.wireframe = true;
    mat_frame.freeze();
    //设置物理仿真器，前面的只是一个自定义的属性而已，没有特殊含义（猜测）
    //其实仿真器分为很多种，其中.MeshImpostor只支持和球体的碰撞。。。
    //PlaneImpostor会生成无限大的平面
    //对planemesh使用HeightmapImpostor会造成 死循环
    //改为groundmesh和BoxImpostor？,SphereImpostor
    //mesh_oz2.computeWorldMatrix(true);
    mesh_oz2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_oz2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    //mesh_oz2.physicsImpostor.forceupdate();
    //mesh_oz2.material=mat_frame;
    //mesh_oz2.physicsImpostor.oncollideevent=function(){console.log("colli "+mesh_oz2.name);}
    mesh_z2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_z2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_ox2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_ox2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_x2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_x2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_oy2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_oy2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_y2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_y2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);

    //var mesh_arena=new BABYLON.MeshBuilder.CreateBox("mesh_arena"
    //    ,{width:obj_p.sizex,height:obj_p.sizey,depth:obj_p.sizez},scene);
    //mesh_arena.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z);
    //mesh_arena.renderingGroupId=2;
    //mesh_arena.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_arena, BABYLON.PhysicsImpostor.BoxImpostor
    //    , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);

    mesh_arena.mesh_oz2=mesh_oz2;
    mesh_arena.mesh_z2=mesh_z2;
    mesh_arena.mesh_ox2=mesh_ox2;
    mesh_arena.mesh_x2=mesh_x2;
    mesh_arena.mesh_oy2=mesh_oy2;
    mesh_arena.mesh_y2=mesh_y2;

    return mesh_arena;
}
//尝试使用一个大的盒子型仿真器，需要试验cannon是否支持盒子内部的碰撞！！！！-》不支持
//而且要用官方方法处理六面不同纹理
newland.CreateCubeArenaWithPhy2=function(obj_p)
{
    if(true)
    {
        var mesh_box=new BABYLON.MeshBuilder.CreateBox("mesh_box"
            ,{width:obj_p.sizeX,height:obj_p.sizey,depth:obj_p.sizez
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,},scene);
    }
}
//使用六个薄板，薄板的边缘又怎么办？
newland.CreateCubeArenaWithPhy3=function(obj_p)
{
    //物理引擎能自动收集子网格的形状吗？-》猜测不能
    //这个竞技场主要用来从里向外看。。。
    //要建立一个测试物理效果的方法群
    //设置形状位置和姿态
    if(true)
    {
        var  flag_inout=obj_p.flag_inout?obj_p.flag_inout:1;//1表示所有面的正面向外，人们主要看到这个形状的外侧，-1表示正面向里，相机主要在形状的内部。
        var size_adjust=1.6;
        var size_thick=3;
        var flag_seeimp=false;//仿真器边界是否可见-》其实没有用
        var int_renderingGroupId=0;
        //CreatePlane
        //改成用CreateGround，但初始状态是完全不同的！先测试向外的情况？ground应该没有双面吧？
        //为了让墙壁能够更宽，将墙壁外移
        var mesh_oz=new BABYLON.MeshBuilder.CreateGround("mesh_oz"
            ,{height:obj_p.sizey,width:obj_p.sizex
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_oz.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z-obj_p.sizez/2);
        mesh_oz.rotation=new BABYLON.Vector3(flag_inout*Math.PI/2,0,0);//旋转是右手坐标？？//从ground的初始位置开始旋转
        var mesh_oz2=new BABYLON.MeshBuilder.CreateBox("mesh_oz2"
            ,{width:obj_p.sizex,height:size_thick,depth:obj_p.sizey},scene);
        //mesh_oz2.parent=mesh_oz;//这样设置将导致物理仿真器初始化失败，但球体的物理运动却正常了
        mesh_oz2.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z-obj_p.sizez/2-size_adjust);
        mesh_oz2.rotation=mesh_oz.rotation.clone();
        mesh_oz2.isVisble=flag_seeimp;
        mesh_oz2.renderingGroupId=int_renderingGroupId;

        var mesh_z=new BABYLON.MeshBuilder.CreateGround("mesh_z"
            ,{height:obj_p.sizey,width:obj_p.sizex
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_z.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z+obj_p.sizez/2);
        mesh_z.rotation=new BABYLON.Vector3(-flag_inout*Math.PI/2,0,0);
        var mesh_z2=new BABYLON.MeshBuilder.CreateBox("mesh_z2"
            ,{width:obj_p.sizex,height:size_thick,depth:obj_p.sizey},scene);
        mesh_z2.position=new BABYLON.Vector3(obj_p.x,obj_p.y,obj_p.z+obj_p.sizez/2+size_adjust);
        mesh_z2.rotation=mesh_z.rotation.clone();
        mesh_z2.isVisble=flag_seeimp;
        mesh_z2.renderingGroupId=int_renderingGroupId;

        var mesh_ox=new BABYLON.MeshBuilder.CreateGround("mesh_ox"
            ,{height:obj_p.sizez,width:obj_p.sizey
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_ox.position=new BABYLON.Vector3(obj_p.x-obj_p.sizex/2,obj_p.y,obj_p.z);
        mesh_ox.rotation=new BABYLON.Vector3(0,0,-flag_inout*Math.PI/2);
        var mesh_ox2=new BABYLON.MeshBuilder.CreateBox("mesh_ox2"
            ,{width:obj_p.sizey,height:size_thick,depth:obj_p.sizez},scene);
        mesh_ox2.position=new BABYLON.Vector3(obj_p.x-obj_p.sizex/2-size_adjust,obj_p.y,obj_p.z);
        mesh_ox2.rotation=mesh_ox.rotation.clone();
        mesh_ox2.isVisble=flag_seeimp;
        mesh_ox2.renderingGroupId=int_renderingGroupId;

        var mesh_x=new BABYLON.MeshBuilder.CreateGround("mesh_x"
            ,{height:obj_p.sizez,width:obj_p.sizey
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_x.position=new BABYLON.Vector3(obj_p.x+obj_p.sizex/2,obj_p.y,obj_p.z);
        mesh_x.rotation=new BABYLON.Vector3(0,0,flag_inout*Math.PI/2);
        var mesh_x2=new BABYLON.MeshBuilder.CreateBox("mesh_x2"
            ,{width:obj_p.sizey,height:size_thick,depth:obj_p.sizez},scene);
        mesh_x2.position=new BABYLON.Vector3(obj_p.x+obj_p.sizex/2+size_adjust,obj_p.y,obj_p.z);
        mesh_x2.rotation=mesh_x.rotation.clone();
        mesh_x2.isVisble=flag_seeimp;
        mesh_x2.renderingGroupId=int_renderingGroupId;

        var mesh_oy=new BABYLON.MeshBuilder.CreateGround("mesh_oy"
            ,{height:obj_p.sizez,width:obj_p.sizex
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_oy.position=new BABYLON.Vector3(obj_p.x,obj_p.y-obj_p.sizey/2,obj_p.z);
        mesh_oy.rotation=new BABYLON.Vector3(-Math.PI/2-flag_inout*Math.PI/2,0,0);
        var mesh_oy2=new BABYLON.MeshBuilder.CreateBox("mesh_oy2"
            ,{width:obj_p.sizex,height:size_thick,depth:obj_p.sizez},scene);
        mesh_oy2.position=new BABYLON.Vector3(obj_p.x,obj_p.y-obj_p.sizey/2-size_adjust,obj_p.z);
        mesh_oy2.rotation=mesh_oy.rotation.clone();
        mesh_oy2.isVisble=flag_seeimp;
        mesh_oy2.renderingGroupId=int_renderingGroupId;

        var mesh_y=new BABYLON.MeshBuilder.CreateGround("mesh_y"
            ,{height:obj_p.sizez,width:obj_p.sizex
                ,sideOrientation: BABYLON.Mesh.DOUBLESIDE,subdivisions :1},scene);
        mesh_y.position=new BABYLON.Vector3(obj_p.x,obj_p.y+obj_p.sizey/2,obj_p.z);
        mesh_y.rotation=new BABYLON.Vector3(-Math.PI/2+flag_inout*Math.PI/2,0,0);
        var mesh_y2=new BABYLON.MeshBuilder.CreateBox("mesh_y2"
            ,{width:obj_p.sizex,height:size_thick,depth:obj_p.sizez},scene);
        mesh_y2.position=new BABYLON.Vector3(obj_p.x,obj_p.y+obj_p.sizey/2+size_adjust,obj_p.z);
        mesh_y2.rotation=mesh_y.rotation.clone();
        mesh_y2.isVisble=flag_seeimp;
        mesh_y2.renderingGroupId=int_renderingGroupId;
    }
    //设置纹理和可见性
    if(obj_p.totalMat)
    {
        mesh_oz.material=obj_p.totalMat;//MyGame.materials.mat_blue;//这种耦合的方法并不可取
        mesh_oz.renderingGroupId=2;
        mesh_z.material=obj_p.totalMat;
        mesh_z.renderingGroupId=2;
        mesh_ox.material=obj_p.totalMat;
        mesh_ox.renderingGroupId=2;
        mesh_x.material=obj_p.totalMat;
        mesh_x.renderingGroupId=2;
        mesh_oy.material=obj_p.totalMat;
        mesh_oy.renderingGroupId=2;
        mesh_y.material=obj_p.totalMat;
        mesh_y.renderingGroupId=2;
    }
    else
    {
        if(obj_p.mat_oz)
        {
            mesh_oz.material=obj_p.mat_oz;
            mesh_oz.renderingGroupId=2;
        }
        else
        {
            mesh_oz.renderingGroupId=0;
        }
        if(obj_p.mat_z)
        {
            mesh_z.material=obj_p.mat_z;
            mesh_z.renderingGroupId=2;
        }
        else
        {
            mesh_z.renderingGroupId=0;
        }
        if(obj_p.mat_ox)
        {
            mesh_ox.material=obj_p.mat_ox;
            mesh_ox.renderingGroupId=2;
        }
        else
        {
            mesh_ox.renderingGroupId=0;
        }
        if(obj_p.mat_x)
        {
            mesh_x.material=obj_p.mat_x;
            mesh_x.renderingGroupId=2;
        }
        else
        {
            mesh_x.renderingGroupId=0;
        }
        if(obj_p.mat_oy)
        {
            mesh_oy.material=obj_p.mat_oy;
            mesh_oy.renderingGroupId=2;
        }
        else
        {
            mesh_oy.renderingGroupId=0;
        }
        if(obj_p.mat_y)
        {
            mesh_y.material=obj_p.mat_y;
            mesh_y.renderingGroupId=2;
        }
        else
        {
            mesh_y.renderingGroupId=0;
        }
    }
    var mesh_arena=new BABYLON.Mesh("mesh_arena",scene);
    mesh_oz.parent=mesh_arena;
    mesh_z.parent=mesh_arena;
    mesh_ox.parent=mesh_arena;
    mesh_x.parent=mesh_arena;
    mesh_oy.parent=mesh_arena;
    mesh_y.parent=mesh_arena;

    //设置物理仿真器，前面的只是一个自定义的属性而已，没有特殊含义（猜测）
    mesh_oz2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_oz2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_z2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_z2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_ox2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_ox2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_x2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_x2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_oy2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_oy2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_y2.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_y2, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 0, restitution: 0.9 ,friction:0.5,move:false}, scene);
    mesh_arena.mesh_oz2=mesh_oz2;
    mesh_arena.mesh_z2=mesh_z2;
    mesh_arena.mesh_ox2=mesh_ox2;
    mesh_arena.mesh_x2=mesh_x2;
    mesh_arena.mesh_oy2=mesh_oy2;
    mesh_arena.mesh_y2=mesh_y2;

    return mesh_arena;
}

//将局部坐标中的向量添加物体的变换矩阵，变成世界坐标中的向量，取自官方示例
newland.vecToGlobal=function(vector, mesh){
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;
}