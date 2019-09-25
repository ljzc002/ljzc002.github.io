function initScene()
{
    console.log("初始化宇宙场景");
    var light1 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 100), scene);
    light1.diffuseColor = new BABYLON.Color3(0, 10, 10);

    var camera0= new BABYLON.UniversalCamera("FreeCamera", new BABYLON.Vector3(0, 0, -10), scene);//FreeCamera
    camera0.minZ=0.001;
    camera0.attachControl(canvas,true);
    //camera0.speed=50;
    scene.activeCameras.push(camera0);

    MyGame.player={
        name:MyGame.userid,//显示的名字
        id:MyGame.userid,//WebSocket Sessionid
        camera:camera0,
        methodofmove:"free",
        mesh:new BABYLON.Mesh("mesh_"+MyGame.userid,scene),
        cardinhand:[],
        arr_units:[],
        handpoint:new BABYLON.Mesh("mesh_handpoint_"+MyGame.userid,scene),
        scal:5,
    };
    MyGame.player.handpoint.position=new BABYLON.Vector3(0,-14,31);
    MyGame.player.handpoint.parent=MyGame.player.mesh;
    MyGame.Cameras.camera0=camera0;
    //罗盘放在gui里面
    var physicsPlugin =new BABYLON.CannonJSPlugin(false);
    //var physicsPlugin = new BABYLON.OimoJSPlugin(false);
    //var physicsPlugin = new BABYLON.AmmoJSPlugin();
    physicsPlugin.setTimeStep(1/120);
    var physicsEngine = scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), physicsPlugin);//new BABYLON.Vector3(0, 0.1, 0.2)0, 0.1, 0.2
}
function initArena()
{
    console.log("初始化地形");
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1500.0, scene);//尺寸存在极限，设为15000后显示异常
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../ASSETS/IMAGE/SKYBOX/nebula", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.renderingGroupId = 1;
    skybox.isPickable=false;
    skybox.infiniteDistance = true;

    //三个参照物
    var mesh_base=new BABYLON.MeshBuilder.CreateSphere("mesh_base",{diameter:10},scene);
    mesh_base.material=MyGame.materials.mat_frame;
    mesh_base.position.x=0;
    mesh_base.renderingGroupId=2;
    //mesh_base.layerMask=2;
    var mesh_base1=new BABYLON.MeshBuilder.CreateSphere("mesh_base1",{diameter:10},scene);
    mesh_base1.position.y=100;
    mesh_base1.position.x=0;
    mesh_base1.material=MyGame.materials.mat_frame;
    mesh_base1.renderingGroupId=2;
    //mesh_base1.layerMask=2;
    var mesh_base2=new BABYLON.MeshBuilder.CreateSphere("mesh_base2",{diameter:10},scene);
    mesh_base2.position.y=-100;
    mesh_base2.position.x=0;
    mesh_base2.material=MyGame.materials.mat_frame;
    mesh_base2.renderingGroupId=2;
}
function initEvent()
{
    console.log("初始化控制事件");
    InitMouse();
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);
    window.addEventListener("keydown", onKeyDown, false);//按键按下
    window.addEventListener("keyup", onKeyUp, false);//按键抬起
}
function initUI()
{
    console.log("初始化全局UI");
    MakeFullUI(MyGame.Cameras.camera0);
}
function initObj()
{//假设一单位长度对应100m
    console.log("初始化单位");
    var ship=new BABYLON.MeshBuilder.CreateBox("ship_target",{size:5},scene);
    ship.position=new BABYLON.Vector3(-5,0,0);
    ship.material=MyGame.materials.mat_green;
    ship.renderingGroupId=2;
    //ship.v={x:0,y:0,z:0}
    ship.physicsImpostor = new BABYLON.PhysicsImpostor(ship, BABYLON.PhysicsImpostor.BoxImpostor//SphereImpostor//
        , { mass: 1, restitution: 0.0005 ,friction:1}, scene);//Oimo里悬空的物体不受摩擦力影响，Ammo和Cannon里悬空的物体也受阻力作用
    ship.mass=1000000000;
    MyGame.player.ship=ship;
    //在罗盘里为这个ship添加一个标志
    var camera0=MyGame.Cameras.camera0;
    Campass.AddShip(camera0,"my",ship);

    var mesh_rocket=new BABYLON.MeshBuilder.CreateCylinder("mesh_rocket"
        ,{height:2,diameterTop:0.1,diameterBottom :1},scene);
    mesh_rocket.renderingGroupId = 2;
    mesh_rocket.material=MyGame.materials.mat_gray;
    mesh_rocket.rotation=new BABYLON.Vector3(Math.PI,0,0);
    mesh_rocket.position=new BABYLON.Vector3(0,-1,0);
    var rocket=new Rocket();
    ship.rocket=rocket;
    var obj_p={ship:ship,mesh:mesh_rocket,name:"testrocket1"
    ,mass:1000,cost2power:function(cost){return cost*1;}
    ,pos:new BABYLON.Vector3(0,0,-3.5),rot:new BABYLON.Vector3(-Math.PI/2,0,0)};
    rocket.init(obj_p);
    rocket.fire({firebasewidth:0.5,cost:1,firescaling:1});

    var shipb=new BABYLON.MeshBuilder.CreateBox("ship_targetb",{size:5},scene);
    shipb.position=new BABYLON.Vector3(5,0,0);
    shipb.material=MyGame.materials.mat_green;
    shipb.renderingGroupId=2;
    //ship.v={x:0,y:0,z:0}
    shipb.physicsImpostor = new BABYLON.PhysicsImpostor(shipb, BABYLON.PhysicsImpostor.BoxImpostor//SphereImpostor//
        , { mass: 1, restitution: 0.0005 ,friction:0}, scene);//Oimo里悬空的物体不受摩擦力影响，Ammo和Cannon里悬空的物体也受阻力作用
    shipb.mass=1000000000;
    MyGame.player.shipb=shipb;
    //在罗盘里为这个ship添加一个标志
    var camera0=MyGame.Cameras.camera0;
    Campass.AddShip(camera0,"my",shipb);

    var mesh_rocketb=new BABYLON.MeshBuilder.CreateCylinder("mesh_rocketb"
        ,{height:2,diameterTop:0.1,diameterBottom :1},scene);
    mesh_rocketb.renderingGroupId = 2;
    mesh_rocketb.material=MyGame.materials.mat_gray;
    mesh_rocketb.rotation=new BABYLON.Vector3(Math.PI,0,0);
    mesh_rocketb.position=new BABYLON.Vector3(0,-1,0);
    var rocketb=new Rocket();
    shipb.rocket=rocketb;
    var obj_pb={ship:shipb,mesh:mesh_rocketb,name:"testrocket1b"
        ,mass:1000,cost2power:function(cost){return cost*1;}
        ,pos:new BABYLON.Vector3(0,0,-3.5),rot:new BABYLON.Vector3(-Math.PI/2,0,0)};
    rocketb.init(obj_pb);
    rocketb.fire({firebasewidth:0.5,cost:1,firescaling:1});
}
var posz_temp1=0;//上一次的位置
var posz_temp2=0;//上一次的速度
var posz_temp1b=0;//上一次的位置
var posz_temp2b=0;//上一次的速度
function initLoop()
{
    console.log("初始化主循环");
    var _this=MyGame;
    MyGame.AddNohurry("task_logpos",1000,0,function(){
        var posz=MyGame.player.ship.position.z;
        var poszb=MyGame.player.shipb.position.z;
        //console.log("---"+(new Date().getTime())+"\n"+posz+"_"+(posz-posz_temp1)+"_"+(posz-posz_temp1-posz_temp2)+"@"+MyGame.player.ship.physicsImpostor.getLinearVelocity()
        //    +"\n"+poszb+"_"+(poszb-posz_temp1b)+"_"+(poszb-posz_temp1b-posz_temp2b)+"@"+MyGame.player.shipb.physicsImpostor.getLinearVelocity());
        console.log(MyGame.player.ship.physicsImpostor.getLinearVelocity());
        posz_temp2=posz-posz_temp1;
        posz_temp1=posz;
        posz_temp2b=poszb-posz_temp1b;
        posz_temp1b=poszb;
    },0)//name,delay,lastt,todo,count
    scene.registerBeforeRender(
        function(){

            var camera0=MyGame.Cameras.camera0;
            var node_z=camera0.node_z;
            var node_y=camera0.node_y;
            var node_x=camera0.node_x;

            node_z.rotation.z=-camera0.rotation.z;
            var len=node_z.arr_node.length;
            for(var i=0;i<len;i++)
            {
                var label=node_z.arr_node[i].label;
                label.rotation=label.startrot+camera0.rotation.z;
            }
            node_y.rotation.y=-camera0.rotation.y;
            node_x.rotation.x=-camera0.rotation.x;
            //舰船标志更新放在每一帧里还是每秒执行一次？
            var len1=camera0.arr_myship.length;
            for(var i=0;i<len1;i++)
            {
                var ship=camera0.arr_myship[i];
                Campass.ComputePointerPos(ship);
            }
            var len1=camera0.arr_friendship.length;
            for(var i=0;i<len1;i++)
            {
                var ship=camera0.arr_friendship[i];
                Campass.ComputePointerPos(ship);
            }
            var len1=camera0.arr_enemyship.length;
            for(var i=0;i<len1;i++)
            {
                var ship=camera0.arr_enemyship[i];
                Campass.ComputePointerPos(ship);
            }
        }
    )
    scene.registerAfterRender(
        function() {
            MyGame.HandleNoHurry();//为了和物理引擎相合把它放在这里？
            var camera0=MyGame.Cameras.camera0;
            if(MyGame.obj_keystate.q==1)
            {
                camera0.rotation.z+=0.01;
            }
            if(MyGame.obj_keystate.e==1)
            {
                camera0.rotation.z-=0.01;//同时按就相互抵消了
            }
        }
    )
    engine.runRenderLoop(function () {
        engine.hideLoadingUI();
        if (divFps) {
            // Fps
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
        }
        //MyGame.HandleNoHurry();
        //lastframe=new Date().getTime();
        scene.render();
    });

}
function initAI()//接下来添加懒惰雷达和工质喷射控制-》雷达耗时较少，且对主线程有变量要求，所以放在nohurry里面
{
    MyGame.worker=new Worker("AIThread.js");
    MyGame.worker.postMessage("start");
}