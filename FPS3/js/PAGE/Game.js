var VERSION = 3.0,
    AUTHOR = "temechon@pixelcodr.com",
    MyGame={},
    canvas,scene,engine,gl,FreeCamera,divFps;
var count={};
count.targets=0;//靶子物体的个数
var flag={};
var finder = new PF.AStarFinder({
    diagonalMovement: 3
});
/*Always: 1,
 Never: 2,
 IfAtMostOneObstacle: 3,
 OnlyWhenNoObstacles: 4*/

//var divFps = document.getElementById("fps");
// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    divFps= document.getElementById("fps");
    MyGame=new Game('renderCanvas');
}, false);



Game = function(canvasId) {

    canvas = document.getElementById(canvasId);
    engine = new BABYLON.Engine(canvas, true);
    gl=engine._gl;
    this.scene = this._initScene(engine);
    scene=this.scene;
    var _this = this;
    this.loader =  new BABYLON.AssetsManager(this.scene);//资源管理器

    // 资源数组
    this.assets = {};
    //控制者数组
    this.arr_myplayers={};
    //我是谁
    this.WhoAmI=newland.randomString(8);

    var meshTask = this.loader.addMeshTask("gun", "", "./assets/", "gun.babylon");
    meshTask.onSuccess = function(task) {
        _this._initMesh(task);
    };
    var meshTask2 = this.loader.addMeshTask("mesh_ground", "", "./assets/arena/", "2017810_14_12_59testscene.babylon");
    meshTask2.onSuccess = function(task) {
        _this._initMesh(task);
    };

    this.loader.onFinish = function (tasks)
    {

        // Player and arena creation when the loading is finished
        scene.enablePhysics();//链接物理引擎，cannon物理引擎的仿真器默认不支持顶点那么多的网格！！！！
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        //我认为自由相机是一个属于game的全局对象！！
        FreeCamera= new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), scene);
        //_this.FreeCamera.attachControl(canvas, true);
        FreeCamera.layerMask = 2;
        FreeCamera.position=new BABYLON.Vector3(-90,20,0);
        scene.activeCameras.push(FreeCamera);


        //初始化玩家使用GUI代替自己编的文本纹理
        _this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");//高级动态材质，全屏ui
        var player = new BallMan();
        var obj_p={};//初始化参数
        var mat_ghost=new BABYLON.StandardMaterial("mat_ghost", scene);
        mat_ghost.diffuseTexture =new BABYLON.Texture("assets/image/grid1.png",scene);
        mat_ghost.diffuseTexture.hasAlpha = true;
        mat_ghost.freeze();
        obj_p.mesh=BABYLON.Mesh.CreateSphere(_this.WhoAmI+"ghost", 32,  2.4, scene);
        //obj_p.mesh.isVisible=false;
        obj_p.mesh.position=new BABYLON.Vector3(-90,20,40);
        obj_p.mesh.material=mat_ghost;
        obj_p.mesh.renderingGroupId=2;
        obj_p.mesh.physicsImpostor=new BABYLON.PhysicsImpostor(obj_p.mesh
            , BABYLON.PhysicsImpostor.SphereImpostor, { mass: 70, restitution: 0.1 ,friction:1.5}, scene);
        //obj_p.mesh.physicsImpostor.physicsBody.fixedRotation=true;
        obj_p.methodofmove="pathgoto20170808";
        obj_p.name="农民";//显示的名字
        obj_p.id="农民";//WebSocket Sessionid
        obj_p.image="assets/image/play.png";
        obj_p.flag_runfast=0.5;
        player.init(
            obj_p,scene
        );
        _this.arr_myplayers[obj_p.name]=player;
        _this.player=player;
        //初始化地形
        var arena = new Arena(_this);
        _this.arena=arena;
        // Event listener on click on the canvas
        canvas.addEventListener("click", function(evt) {
            var width = engine.getRenderWidth();
            var height = engine.getRenderHeight();
            var pickInfo = scene.pick(width/2, height/2, null, false, _this.camera);//点击信息
            if(evt.button==2)//右键单击
            {
                cancelEvent(evt);
                if(pickInfo.hit&&pickInfo.pickedMesh.name=="mesh_ground")//点击到了地面上
                {
                    MyGame.player.mesh.physicsImpostor.setMass(70);
                    FindWaytogo(pickInfo);//在玩家到点击目的地之间找到一条路径
                    var mesh_togo=BABYLON.Mesh.CreateBox("box", 1, scene);
                    mesh_togo.position = pickInfo.pickedPoint.clone();//pickResult.pickedPoint
                    mesh_togo.renderingGroupId=2;
                    MyGame.player.mesh_togo=mesh_togo;
                }
            }



        }, false);
        /*scene.onPointerDown = function (evt, pickResult)
        {
            if(MyGame.flag_view=="free"&&(evt.pointerType=="mouse"||evt.type=="mousedown"))//如果当前是自由视角控制，分为左键和右键两种情况讨论，但是对触屏怎么办？？
            {
                if(evt.button==2)//右键单击
                {
                    cancelEvent(evt);
                    if(pickResult.hit&&pickResult.pickedMesh.name=="mesh_ground")//点击到了地面上
                    {
                        MyGame.player.mesh.physicsImpostor.setMass(70);
                        FindWaytogo(pickResult);//在玩家到点击目的地之间找到一条路径
                        var mesh_togo=BABYLON.Mesh.CreateBox("box", 1, scene);
                        mesh_togo.position = pickResult.pickedPoint.clone();//pickResult.pickedPoint
                        mesh_togo.renderingGroupId=2;
                        MyGame.player.mesh_togo=mesh_togo;
                    }
                }
            }
        }*/

        scene.registerBeforeRender(function() {
            if(MyGame.flag_startr==1)//如果开始渲染了
            {
                if(MyGame.flag_view=="first"||MyGame.flag_view=="third")
                {
                    physics20170725(MyGame.player);
                }
                if(MyGame.flag_view=="free")
                {
                    pathgoto20170808(MyGame.player);
                }
            }
        });

        window.addEventListener("keydown", onKeyDown, false);//按键按下
        window.addEventListener("keyup", onKeyUp, false);//按键抬起

        engine.runRenderLoop(function ()
        {
            if (divFps) {
                // Fps
                divFps.innerHTML = engine.getFps().toFixed() + " fps";
            }
            if( _this.flag_startr==0)
            {
                engine.hideLoadingUI();
                _this.flag_startr=1;
                _this.lastframet=new Date().getTime();
            }
            else
            {
                _this.currentframet=new Date().getTime();
                _this.DeltaTime=_this.currentframet-_this.lastframet;//取得两帧之间的时间
                _this.lastframet=_this.currentframet;
                _this.nohurry+=_this.DeltaTime;
                if(MyGame&&_this.nohurry>1000)//每一秒进行一次导航修正
                {
                    _this.nohurry=0;
                    if(_this.player.path_goto=="lose")//发现迷失了路途
                    {
                        console.log("发现迷路，重新规划路径");
                        var len_x=MyGame.arena.len_x;
                        var len_y=MyGame.arena.len_y;
                        var len_s=MyGame.arena.len_s;
                        //场景坐标转化为方格坐标
                        var count_x0=parseInt(_this.player.mesh.position.x/len_s+len_x/2);
                        var count_y0=parseInt(-_this.player.mesh.position.z/len_s+len_y/2);
                        var count_x=parseInt(_this.player.positiontogo[0]/len_s+len_x/2);
                        var count_y=parseInt(-_this.player.positiontogo[1]/len_s+len_y/2);
                        var path = finder.findPath(count_x0,count_y0 , count_x,count_y, MyGame.arena.grid.clone());//这些是寻路网格坐标
                        var len=path.length;
                        for(var i=0;i<len;i++)
                        {//把方格坐标转化为场景坐标
                            var obj=path[i];
                            obj[0]=(obj[0]-len_x/2)*len_s;
                            obj[1]=(-obj[1]+len_y/2)*len_s;
                        }
                        //path.push([pickResult.pickedPoint.x,pickResult.pickedPoint.z]);//最后推进去的是一个场景坐标！！
                        path[0]=[_this.player.mesh.position.x,_this.player.mesh.position.z];
                        path[len-1]=MyGame.player.positiontogo;
                        MyGame.player.path_goto=path;//在使用时在生成高度
                    }
                }
            }
            if(_this.arena.mm)//如果有小地图，就让小地图随玩家移动
            {
                var player_x=_this.player.mesh.position.x;
                var player_z=_this.player.mesh.position.z;
                _this.arena.mm.position.x = player_x;//globalPosition,_absolutePosition
                _this.arena.mm.position.z = player_z;
            }

            //主相机和小地图相机都随着玩家的位置变化
            CamerasFollowActor(MyGame.player);
            _this.scene.render();

        });
    };

    this.flag_startr=0;
    this.lastframet=0;//上一帧时刻
    this.currentframet=0;//当前帧时刻
    this.DeltaTime=0;//上一帧耗时
    this.nohurry=0;//一个计时器，让一些计算不要太频繁
    //this.flag_input=false;
    this.flag_online=false;
    this.flag_view="free";//first/third/input/free
    this.flag_admin=false;
    this.flag_controlEnabled = false;//在锁定指针之前不让控制！！
    this.arr_state=[];//状态数组，主要用来存按键状态
    this.loader.load();


    // Resize the babylon engine when the window is resized
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);

};

function FindWaytogo(pickResult)
{
    var faceId=pickResult.faceId;
    var pickedMesh=pickResult.pickedMesh;
    var px=MyGame.player.mesh.position.x;
    var py=MyGame.player.mesh.position.z;

    var len_x=MyGame.arena.len_x;
    var len_y=MyGame.arena.len_y;
    var len_s=MyGame.arena.len_s;
    if(px>-len_x*len_s/2&&px<len_x*len_s/2&&py>-len_y*len_s/2&&py<len_y*len_s/2&&MyGame.arena.grid)//如果使用了pathfinder的障碍矩阵
    {
        var arr_matrix=MyGame.arena.walkabilityMatrix;
        //var len_y=arr_matrix.length;//寻路方格的块数
        //var len_x=arr_matrix[0].length;
        var count=parseInt(faceId/2);
        //接下来要把网格的面转换为寻路方格的坐标，后面还要把寻路方格的坐标转换为scene中的位置
        //面数转换为方格坐标
        var count_y=parseInt(count/len_x);
        var count_x=count%len_x;
        //场景坐标转化为方格坐标
        var count_x0=parseInt(px/len_s+len_x/2);
        var count_y0=parseInt(-py/len_s+len_y/2);


        var path = finder.findPath(count_x0,count_y0 , count_x,count_y, MyGame.arena.grid.clone());//这些是寻路网格坐标
        var len=path.length;
        for(var i=0;i<len;i++)
        {//把方格坐标转化为场景坐标
            var obj=path[i];
            obj[0]=(obj[0]-len_x/2)*len_s;
            obj[1]=(-obj[1]+len_y/2)*len_s;
        }
        //path.push([pickResult.pickedPoint.x,pickResult.pickedPoint.z]);//最后推进去的是一个场景坐标！！
        //path[0]=[px,py];

        path.push([pickResult.pickedPoint.x,pickResult.pickedPoint.z]);
        MyGame.player.path_goto=path;//在使用时在生成高度
        MyGame.player.positiontogo=[pickResult.pickedPoint.x,pickResult.pickedPoint.z];
        path.shift();//把第一个出发节点去掉
        console.log("生成路径，起点：["+px+","+py+"]，终点：["+pickResult.pickedPoint.x+","+pickResult.pickedPoint.z+"]");
    }
}

Game.prototype = {
    /**
     * Init the environment of the game / skybox, camera, ...
     */
    _initScene : function(engine) {

        var scene = new BABYLON.Scene(engine);
        scene.mydata={};
        scene.mydata.mat_red=new BABYLON.StandardMaterial("mat_red", scene);
        scene.mydata.mat_red.diffuseColor = new BABYLON.Color3(1, 0, 0);
        scene.mydata.mat_green=new BABYLON.StandardMaterial("mat_green", scene);
        scene.mydata.mat_green.diffuseColor = new BABYLON.Color3(0, 1, 0);
        scene.mydata.mat_blue=new BABYLON.StandardMaterial("mat_blue", scene);
        scene.mydata.mat_blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

        newland.make_axis(scene, 5);
        // Update the scene background color
        scene.clearColor=new BABYLON.Color3(0.8,0.8,0.8);

        // Hemispheric light to light the scene
        MyGame.hlight=new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 2, 1), scene);

        // Skydome
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 200.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.ambientColor=new BABYLON.Color3(1, 0, 0);
        //“skybox_nx.png”, “skybox_ny.png”, “skybox_nz.png”, “skybox_px.png”, “skybox_py.png”, “skybox_pz.png”.
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);//这里的目录不能更深否则babyljs找不到！！
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 1;//这个参数使得天空盒处于所有其他元素之外！？数值越大越优先显示//链接render翻译
        skybox.isPickable=false;
        skybox.layerMask=2;
        MyGame.skybox=skybox;
        return scene;
    },

    /**
     * Initialize a mesh once it has been loaded. Store it in the asset array and set it not visible.
     * @param task
     * @private
     */
    _initMesh : function(task)
    {
        this.assets[task.name] = task.loadedMeshes;
        for (var i=0; i<task.loadedMeshes.length; i++ ){
            var mesh = task.loadedMeshes[i];
            mesh.isVisible = false;
        }
    }
};
