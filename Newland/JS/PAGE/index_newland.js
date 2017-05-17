/**
 * Created by Administrator on 2017/4/12.
 */
//和这个场景相关的全局变量
//基本全局变量
var canvas,engine,scene,gl;
canvas = document.getElementById("renderCanvas");
engine = new BABYLON.Engine(canvas, true);
BABYLON.SceneLoader.ShowLoadingScreen = false;
engine.displayLoadingUI();
var divFps = document.getElementById("fps");
//全局对象
var light0//全局球形光源
    ,freeCamera//主自由相机
    ,mat_frame//网格材质
    ,mat_outlook//注目材质
    ,mesh_allbase//全局网格根基
    ,mesh_hold//当前焦点网格
    ,tryangle_hold//当前焦点三角形
    ,current_player//当前驾驶载具
    ,mesh_cross//三维坐标轴
    ,mesh_hidden//不可见对象停靠点
    ,mesh_outlook//注目标记
    ,count_uvpart//设置图元颜色的正方形canvas分成多少行列
    ,count_surface//覆盖图元的表面片的命名
    ,can_tryangle//尝试在全局层面保存要导出的贴图
    ,context_tryangle
    ,PngName;
    ;
//导出模型文件时需要考虑的网格
var arr_mesh=[];
//全局状态标志
var flag=
{
    inputMode:false//是否是输入文本的模式
    ,online:false//是否是联机模式
    ,sceneCharger:false//场景是否加载完毕
    ,freeControl:false//是否使用自由浏览视角
    ,viewMode:"first"//控制视角人称
    ,adminClent:false//是否是主持人客户端
    ,pickType:"default"//鼠标点选类型：default、point、tryangle、mesh
    ,conbineType:0//网格融合模式，新建、融合、切削
    ,mouseOff:false//是否保持鼠标长按
    ,holdMode:null//如何调整焦点物体
};
//和二维窗口沟通的变量
var clientX=0,clientY=0;
//场景历史状态，用于回退操作和局域网数据传输
var arr_history=[];
//我是谁
var WhoAmI=randomString(8);
//悬浮在图元上的颜色层，用来生成贴图效果
var arr_surface=[];

window.onload=webGLStart;
function webGLStart()
{
    gl=engine._gl;
    createScene();
}

function createScene()
{
    scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    //半球光照
    light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1,1,1);//这道“颜色”是从上向下的，底部收到100%，侧方收到50%，顶部没有
    light0.specular = new BABYLON.Color3(0,0,0);
    light0.groundColor = new BABYLON.Color3(1,1,1);//这个与第一道正相反
    //自由相机
    freeCamera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), scene);
    freeCamera.attachControl(canvas, true);
    freeCamera.speed=0.1;
    //网格材质
    mat_frame = new BABYLON.StandardMaterial("mat_frame", scene);
    mat_frame.wireframe = true;
    //注目材质
    //var tex_outlook=new BABYLON.Texture.C(texttoimg("tex_outlook","normal 32px sans-serif",32,"rgb(255,255,255)","png")
      //   ,"datatexture"+this.name,scene);
    mat_outlook=new BABYLON.StandardMaterial("mat_outlook", scene);
    //mat_outlook.emissiveColor=new BABYLON.Color3(1,1,0);
    mat_outlook.diffuseColor=new BABYLON.Color3(1,1,0,0.5);
    mat_outlook.backFaceCulling=false;
    //mat_outlook.diffuseTexture.hasAlpha;

    //天空盒
    skybox = BABYLON.Mesh.CreateBox("skyBox", 50.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.ambientColor=new BABYLON.Color3(1, 0, 0);
    //“skybox_nx.png”, “skybox_ny.png”, “skybox_nz.png”, “skybox_px.png”, “skybox_py.png”, “skybox_pz.png”.
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../IMAGE/skybox/skybox", scene);//这里的目录不能更深否则babyljs找不到！！
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.renderingGroupId = 1;//这个参数使得天空盒处于所有其他元素之外！？
    skybox.isPickable=false;
    //地面
    var mat_grass = new BABYLON.StandardMaterial("mat_grass", scene);//草地材质
    mat_grass.diffuseTexture = new BABYLON.Texture("../IMAGE/grass.jpg", scene);//地面的纹理贴图
    mat_grass.diffuseTexture.uScale = 50.0;//纹理重复效果
    mat_grass.diffuseTexture.vScale = 50.0;
    mat_grass.diffuseTexture.hasAlpha = false;
    mat_grass.backFaceCulling=false;
    mat_grass.diffuseTexture.coordinatesMode=BABYLON.Texture.SPHERICAL_MODE  ;
    var plan1 = BABYLON.Mesh.CreatePlane("plane1", 1000.0, scene);//草地
    plan1.rotation.x=Math.PI/2;
    plan1.position.y=-10.0;
    plan1.renderingGroupId=2;
    plan1.checkCollisions=true;
    plan1.isPickable=false;
    plan1.material=mat_grass;
    //基准物体
    mesh_allbase=new BABYLON.Mesh("allbase0",scene);
    //arr_mesh.push(mesh_allbase);
    //arr_mesh["allbase"]=mesh_allbase;//和其他mesh区别开这个mesh_allbase事实上不是保存在模型文件中的allbase！！！！
    //放在不可见的地方的物体，并且特别小
    mesh_hidden=new BABYLON.Mesh("mesh_hidden",scene);
    mesh_hidden.scaling=new BABYLON.Vector3(0.01,0.01,0.01);
    mesh_cross=new BABYLON.Mesh("mesh_cross",scene);
    mesh_cross.parent=mesh_hidden;
    //三个坐标轴
    var mat_red= new BABYLON.StandardMaterial("mat_red", scene);
    mat_red.diffuseColor=new BABYLON.Color3(1,0,0);
    mat_red.wireframe=true;
    mat_red.freeze();
    var mat_green= new BABYLON.StandardMaterial("mat_green", scene);
    mat_green.diffuseColor=new BABYLON.Color3(0,1,0);
    mat_green.wireframe=true;
    mat_green.freeze();
    var mat_blue= new BABYLON.StandardMaterial("mat_blue", scene);
    mat_blue.diffuseColor=new BABYLON.Color3(0,0,1);
    mat_blue.wireframe=true;
    mat_blue.freeze();
    var num_length=0.5;
    var line_x=BABYLON.MeshBuilder.CreateLines("line_x",{points:[new BABYLON.Vector3(-num_length,0, 0)
        ,new BABYLON.Vector3(num_length,0, 0)]},scene);
    line_x.color=new BABYLON.Color3(1,0,0);
    line_x.renderingGroupId=3;
    line_x.parent=mesh_cross;
    //名称、高度、锥尖直径、锥底直径、边数、细分度（顶点环数）
    var cylinder_x = BABYLON.Mesh.CreateCylinder("cylinder_x", 0.02, 0, 0.02, 16, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    cylinder_x.material=mat_red;
    cylinder_x.position=new BABYLON.Vector3(num_length,0, 0);
    cylinder_x.rotation.z=-Math.PI*0.5;//这个旋转是逆时针的
    cylinder_x.renderingGroupId=3;
    cylinder_x.parent=mesh_cross;
    var line_y=BABYLON.MeshBuilder.CreateLines("line_y",{points:[new BABYLON.Vector3(0,-num_length, 0)
        ,new BABYLON.Vector3(0,num_length, 0)]},scene);
    //line_y.parent=mesh_video;
    line_y.color=new BABYLON.Color3(0,1,0);
    line_y.renderingGroupId=3;
    line_y.parent=mesh_cross;
    var cylinder_y = BABYLON.Mesh.CreateCylinder("cylinder_y", 0.02, 0, 0.02, 16, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    cylinder_y.material=mat_green;
    cylinder_y.position=new BABYLON.Vector3(0,num_length, 0);
    cylinder_y.renderingGroupId=3;
    cylinder_y.parent=mesh_cross;
    var line_z=BABYLON.MeshBuilder.CreateLines("line_z",{points:[new BABYLON.Vector3(0,0, -num_length)
        ,new BABYLON.Vector3(0,0, num_length)]},scene);
    //line_z.parent=mesh_video;
    line_z.color=new BABYLON.Color3(0,0,1);
    line_z.renderingGroupId=3;
    line_z.parent=mesh_cross;
    var cylinder_z = BABYLON.Mesh.CreateCylinder("cylinder_z", 0.02, 0, 0.02, 16, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    cylinder_z.material=mat_blue;
    cylinder_z.position=new BABYLON.Vector3(0,0, num_length);
    cylinder_z.rotation.x=Math.PI*0.5;
    cylinder_z.renderingGroupId=3;
    cylinder_z.parent=mesh_cross;


    //ballman
    var ball_man=new BallMan;
    var obj_p={};//初始化参数对象
    obj_p.mesh=new BABYLON.Mesh("ballman",scene);
    obj_p.mesh.renderingGroupId=2;
    obj_p.mesh.checkCollisions=false;//使用默认的碰撞检测
    obj_p.mesh.ellipsoid=new BABYLON.Vector3(4, 4, 4);//碰撞检测椭球，碰撞检测椭球是不受缩放影响的！！
    obj_p.mesh.ellipsoidOffset=new BABYLON.Vector3(0, 0, 0);//碰撞检测椭球位移
    obj_p.methodofmove="TwoDOFsControl";//CrossControl,OneDOFControl,TwoDOFsControl
    obj_p.name=WhoAmI;//显示的名字
    obj_p.id=WhoAmI;//WebSocket Sessionid
    obj_p.meshname="ballman";
    obj_p.image="../IMAGE/play.png";
    obj_p.flag_runfast=0.5;
    ball_man.init(
        obj_p,scene
    );
    arr_myplayers[obj_p.name]=ball_man;
    current_player=ball_man;

    //场景中鼠标抬起
    scene.onPointerUp = function (evt, pickResult)
    {
        if(!flag.freeControl&&flag.pickType!="default"&&pickResult.hit&&(pickResult.pickedMesh.name in arr_mesh))
        {
            switch (flag.pickType)
            {
                case "point":
                {
                    break;
                }
                case "tryangle":
                {
                    //在选中的三角形的表面悬浮一个突出显示的三角形
                    document.body.style.cursor="auto";
                    flag.pickType="default";
                    flag.holdMode="tryangle";
                    var faceId=pickResult.faceId;
                    var pickedMesh=pickResult.pickedMesh;
                    var indices=[pickedMesh.geometry._indices[faceId*3]
                        ,pickedMesh.geometry._indices[faceId*3+1],pickedMesh.geometry._indices[faceId*3+2]];
                    var vb=pickedMesh.geometry._vertexBuffers;
                    var position=vb.position._buffer._data;
                    var normal=vb.normal._buffer._data;
                    var uv=vb.uv._buffer._data;
                    var p1={index:indices[0],position:[position[indices[0]*3],position[indices[0]*3+1],position[indices[0]*3+2]]
                        ,normal:[normal[indices[0]*3],normal[indices[0]*3+1],normal[indices[0]*3+2]]
                        ,uv:[uv[indices[0]*2],uv[indices[0]*2+1]]};
                    var p2={index:indices[1],position:[position[indices[1]*3],position[indices[1]*3+1],position[indices[1]*3+2]]
                        ,normal:[normal[indices[1]*3],normal[indices[1]*3+1],normal[indices[1]*3+2]]
                        ,uv:[uv[indices[1]*2],uv[indices[1]*2+1]]};
                    var p3={index:indices[2],position:[position[indices[2]*3],position[indices[2]*3+1],position[indices[2]*3+2]]
                        ,normal:[normal[indices[2]*3],normal[indices[2]*3+1],normal[indices[2]*3+2]]
                        ,uv:[uv[indices[2]*2],uv[indices[2]*2+1]]};
                    if(mesh_outlook)
                    {
                        CloneSurface();
                        mesh_outlook.dispose();
                    }
                    tryangle_hold=null;
                    tryangle_hold=[p1,p2,p3];
                    tryangle_hold.mesh=pickedMesh;
                    //mesh_hold=pickedMesh;

                    tryangle_hold.faceId=faceId;

                    mesh_outlook=newland.make_tryangle(p1,p2,p3,"mesh_outlook");
                    mesh_outlook.material=mat_outlook;
                    mesh_outlook.renderingGroupId=2;
                    mesh_outlook.parent=pickedMesh;
                    //mesh_outlook.diffuseTexture.hasAlpha

                    AdjustTry();//弹出图元调整对话框
                    break;
                }
                case "mesh":
                {
                    break;
                }
                default:
                    break;
            }
        }
    }
    //鼠标移动
    canvas.onmousemove=function(evt)
    {
        var evt = evt || window.event;
        clientX=evt.clientX;
        clientY=evt.clientY;
    }
    //场景准备好后执行
    scene.executeWhenReady(function () {
        canvas.style.opacity = 1;
        engine.hideLoadingUI();
        BABYLON.SceneLoader.ShowLoadingScreen = true;
    });
    //
    scene.registerBeforeRender(function() {
        if(scene.isReady())
        {
            if(ms0==0)
            {//最开始，等一帧
                ms0=new Date();//设置初始时间
                schange=0;//初始化时间差
            }
            else
            {
                mst = new Date();//下一时刻
                schange = (mst - ms0) / 1000;
                ms0=mst;//时间越过
                //对于这段时间内的每一个物体
                if(!flag.freeControl)
                {
                    for (var key in arr_myplayers)//该客户端所控制的物体
                    {
                        var obj = arr_myplayers[key];
                        function HandleAnnimation()
                        {
                            if((obj.vmove.x!=0||obj.vmove.y!=0||obj.vmove.z!=0||obj.rychange!=0)&&obj.PlayAnnimation==false)
                            {//如果开始运动，启动骨骼动画
                                obj.PlayAnnimation=true;
                                //obj.beginSP(0);
                            }
                            else if(obj.vmove.x==0&&obj.vmove.y==0&&obj.vmove.z==0&&obj.rychange==0&&obj.PlayAnnimation==true)
                            {//如果运动结束，关闭骨骼动画
                                obj.PlayAnnimation=false;
                                //scene.stopAnimation(obj.skeletonsPlayer[0]);
                            }
                        }
                        switch(obj.methodofmove)
                        {
                            case "TwoDOFsControl":
                            {
                                TwoDOFsMove(obj);//二自由度简单运动
                                HandleAnnimation();
                                break;
                            }
                            default :
                            {
                                break;
                            }
                        }
                    }
                }
            }
            if(current_player&&!flag.freeControl)
            {
                CameraFollowActor(current_player);//根据人物重定位相机
            }
        }
    });
}
//跟随着角色的旋转相机（法语）
function CameraFollowActor(object)
{
    if(flag.viewMode=="first")
    {
        object.mesh.rotation.y = 0+freeCamera.rotation.y;
        object.mesh.rotation.x = 0+freeCamera.rotation.x;
        var v_temp=new BABYLON.Vector3(0,0,0);
        BABYLON.Vector3.TransformNormalToRef(new BABYLON.Vector3(0,0,2.1), object.mesh.worldMatrixFromCache, v_temp);
        freeCamera.position=object.mesh.position.add(v_temp);//_absolutePosition是一个滞后的数值，不是立即刷新的！！！！
        //freeCamera.
    }
    else if(flag.viewMode=="third")
    {
        object.mesh.rotation.y =0+freeCamera.rotation.y;//绕y轴转动还有一些抖动
        object.mesh.rotation.x = 0+freeCamera.rotation.x;
        var v_temp=new BABYLON.Vector3(0,0,0);
        BABYLON.Vector3.TransformNormalToRef(new BABYLON.Vector3(0,2,-3), object.mesh.worldMatrixFromCache, v_temp);
        freeCamera.position=object.mesh.position.add(v_temp);
    }
}
engine.runRenderLoop(function () {
    if (divFps) {
        // Fps
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
    }
    scene.render();
});
window.addEventListener("resize", function () {
    engine.resize();
});