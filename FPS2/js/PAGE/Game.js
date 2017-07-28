var VERSION = 3.0,
    AUTHOR = "temechon@pixelcodr.com",
    MyGame={},
    canvas,scene,engine,gl,FreeCamera,divFps;
var count={};
count.targets=0;//靶子物体的个数
var flag={};

//var divFps = document.getElementById("fps");
// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    divFps= document.getElementById("fps");
    MyGame=new Game('renderCanvas');//链接FPS翻译
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
    var meshTask2 = this.loader.addMeshTask("arena2", "", "./assets/arena/", "arena2.babylon");
    meshTask2.onSuccess = function(task) {
        _this._initMesh(task);
    };

    this.loader.onFinish = function (tasks)
    {

        // Player and arena creation when the loading is finished
        scene.enablePhysics();//链接物理引擎
        //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        //我认为自由相机是一个属于game的全局对象！！
        FreeCamera= new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 0, 0), scene);
        //_this.FreeCamera.attachControl(canvas, true);
        FreeCamera.layerMask = 2;
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
        obj_p.mesh.position=new BABYLON.Vector3(0,20,-10);
        obj_p.mesh.material=mat_ghost;
        obj_p.mesh.renderingGroupId=2;
        obj_p.mesh.physicsImpostor=new BABYLON.PhysicsImpostor(obj_p.mesh
            , BABYLON.PhysicsImpostor.SphereImpostor, { mass: 70, restitution: 0.1 ,friction:1.5}, scene);
        obj_p.mesh.physicsImpostor.physicsBody.fixedRotation=true;
        obj_p.methodofmove="physics20170725";
        obj_p.name=_this.WhoAmI;//显示的名字
        obj_p.id=_this.WhoAmI;//WebSocket Sessionid
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

        scene.registerBeforeRender(function() {
            if(MyGame.flag_startr==1)//如果开始渲染了
            {
                if(MyGame.flag_view=="first"||MyGame.flag_view=="third")
                {
                    physics20170725(MyGame.player);
                    if(MyGame.player.head.rotation.y != FreeCamera.rotation.y)
                    {
                        MyGame.player.head.rotation.y = FreeCamera.rotation.y;//放在这里修改能够及时更新player的世界矩阵缓存！！
                    }
                    if(MyGame.player.head.rotation.x!=FreeCamera.rotation.x)
                    {
                        MyGame.player.head.rotation.x=FreeCamera.rotation.x;
                    }
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
            }
            var player_x=_this.player.mesh.position.x;
            var player_z=_this.player.mesh.position.z;
            _this.arena.mm.position.x = player_x;//globalPosition,_absolutePosition
            _this.arena.mm.position.z = player_z;
            //主相机和小地图相机都随着玩家的位置变化
            CamerasFollowActor(MyGame.player);
            _this.scene.render();

        });
    };

    this.flag_startr=0;
    this.lastframet=0;
    this.currentframet=0;
    this.DeltaTime=0;
    this.flag_input=false;
    this.flag_online=false;
    this.flag_view="third";//first/third/input/free
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