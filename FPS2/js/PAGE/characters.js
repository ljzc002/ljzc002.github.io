/**
 * Created by Administrator on 2017/4/12.
 */
//这个里面放置场景中使用的各种角色
BallMan=function()
{
    newland.object.call(this);
}
BallMan.prototype=new newland.object();
BallMan.prototype.init=function(param,scene)
{
    param = param || {};
    newland.object.prototype.init.call(this,param);//继承原型的方法
    this.name=param.name;
    this.id=param.id;
    this.vd={forward:10.0,backwards:10.0,left:10.0,right:10.0,up:10.0,down:10.0};//简单运动时各个方向的默认速度
    this.flag_objfast=param.flag_objfast ||1;//使用这种机体移动物体的默认速度

    var mat_head=new BABYLON.StandardMaterial("mat_head", scene);
    mat_head.diffuseTexture =new BABYLON.Texture(param.image,scene);
    mat_head.freeze();
    var mesh_head=BABYLON.Mesh.CreateSphere(this.name+"head", 10,  2.0, scene);
    mesh_head.renderingGroupId=2;
    mesh_head.layerMask=2;
    mesh_head.rotation.y=Math.PI*0.5;
    mesh_head.material=mat_head;
    //mesh_head.parent=this.mesh;//想让head随着ghost一起位移，又不想让它随着ghost滚动！！
    //this.mesh.setPhysicsLinkWith(mesh_head,new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(0,0,0));//枢轴链接
    mesh_head.position=this.mesh.position.clone();//不克隆直接赋值有抖动
    this.head=mesh_head;


    //改用gui？显示名字
    if(this.lab)
    {
        this.lab.dispose();
        this.lab=null;
    }
    var label = new BABYLON.GUI.Rectangle(this.name);
    label.background = "black"
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;//位置偏移量？？
    MyGame.advancedTexture.addControl(label);
    label.linkWithMesh(this.head);
    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = this.name;
    text1.color = "white";
    label.addControl(text1);
    label.isVisible=true;
    label.layerMask=2;
    this.lab=label;

    //定位第一人称视角的位置
    var headview=new BABYLON.Mesh(this.name+"headview",scene);
    headview.parent=this.head;
    headview.position=new BABYLON.Vector3(0,0,2.0);
    this.headview=headview;
    //定位第三人称视角的位置
    var backview=new BABYLON.Mesh(this.name+"backview",scene);
    backview.parent=this.head;
    backview.position=new BABYLON.Vector3(0,2,-6);
    this.backview=backview;
    var backview_right=new BABYLON.Mesh(this.name+"backview_right",scene);
    backview_right.parent=this.head;
    backview_right.position=new BABYLON.Vector3(2.6,2,-6);
    this.backview_right=backview_right;
    //定位手持物体的位置，或者是正前方光标的位置？
    var handpoint=new BABYLON.Mesh(this.name+"handpoint",scene);
    handpoint.parent=this.head;
    handpoint.position=new BABYLON.Vector3(0,0,10);
    this.handpoint=handpoint;
    //左手和右手
    var lefthand=new BABYLON.Mesh(this.name+"lefthand",scene);
    lefthand.parent=this.head;
    lefthand.position=new BABYLON.Vector3(-1,0.2,3.0);
    lefthand.lookAt(lefthand.position.negate().add(headview.position));
    this.lefthand=lefthand;
    var righthand=new BABYLON.Mesh(this.name+"righthand",scene);
    righthand.parent=this.head;
    righthand.position=new BABYLON.Vector3(1,0.2,3.0);
    righthand.lookAt(righthand.position.negate().add(headview.position));
    this.righthand=righthand;


    //针对这个player重设自由相机
    var cam=FreeCamera;
    cam.keysUp = [87]; // W
    cam.keysDown = [83]; // S
    cam.keysLeft = [65]; // A
    cam.keysRight = [68]; // D
    cam.speed = 1;
    cam.inertia = 0.9;
    cam.angularInertia = 0;
    cam.angularSensibility = 1000;
    cam.position=backview_right.position.clone();//这种写法会有延迟？
    //cam.layerMask = 2;
    cam._updatePosition();
    this.camera=cam;

    // The representation of player in the minimap在小地图上表示玩家的圆锥体
    var s = BABYLON.Mesh.CreateCylinder("mesh_player", 6, 0, 4, 16, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
    s.parent=this.head;
    s.rotation.x=Math.PI*0.5;//这个旋转是逆时针的
    s.renderingGroupId=2;
    this.mmmesh=s;
    var green = new BABYLON.StandardMaterial("green", this.scene);
    green.diffuseColor = BABYLON.Color3.Green();
    green.specularColor = BABYLON.Color3.Black();
    s.material = green;
    s.layerMask = 1;
    s.isPickable=false;


    this.weapon = new Weapon(MyGame, this);
    var _this = this;
    // Event listener on click on the canvas
    canvas.addEventListener("click", function(evt) {
        var width = engine.getRenderWidth();
        var height = engine.getRenderHeight();

        if (_this.controlEnabled) {
            if(_this.weapon.canFire)
            {
                if(_this.weapon.type=="ray")
                {
                    _this.weapon.animate();
                    var pickInfo = scene.pick(width/2, height/2, null, false, _this.camera);//点击信息
                    _this.handleUserMouse(evt, pickInfo);//处理点击（射击）
                }
            }


        }
    }, false);

    this._initPointerLock();

    //暂时不使用抬头显示器
    console.log("Player初始化完毕");

}
/**
 * Handle the user input on mouse.
 * click = shoot
 * @param evt
 * @param pickInfo The pick data retrieved when the click has been done
 */
BallMan.prototype.handleUserMouse=function(evt, pickInfo)
{
    this.weapon.fire(pickInfo);
}

BallMan.prototype._initPointerLock =function() {
        var _this = this;
        // Request pointer lock
        //var canvas = this.scene.getEngine().getRenderingCanvas();
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = function (event) {
            _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!_this.controlEnabled) {
                _this.camera.detachControl(canvas);
            } else {
                _this.camera.attachControl(canvas);
            }
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}