/**
 * Created by lz on 2018/3/12.
 */
/*20180613现在规定主相机在MyGame中对应三种状态：
first_lock表示相机和相机网格绑定在一起并使用Control控制，
first_lock表示禁用Control控制相机默认自由浏览，
first_ani表示由动画控制相机相机不可手动控制*/
CameraMesh=function()
{
    newland.object.call(this);
}
CameraMesh.prototype=new newland.object();
CameraMesh.prototype.init=function(param,scene)
{
    param = param || {};
    newland.object.prototype.init.call(this,param);//继承原型的方法
    this.name=param.name;
    this.id=param.id;
    var num_v=0.001;
    this.vd={forward:num_v*2,backwards:num_v,left:num_v,right:num_v,up:num_v,down:num_v};//简单运动时各个方向的默认速度，最慢的情况下每一毫秒移动多少
    this.flag_objfast=param.flag_objfast ||1;//使用这种机体移动物体的默认速度
    this.camera=param.camera;
    this.mesh=param.mesh;
    this.camera.mesh=this.mesh;
    var _this = this;
    this._initPointerLock();//先不要锁定光标，等初始化地形完毕后再锁定
    //中间光标
    this.centercursor=this.CenterCursor();
    this.centercursor.isVisible=false;
    console.log("相机网格初始化完毕");
}
CameraMesh.prototype.handleUserMouse=function(evt, pickInfo)
{
    //this.weapon.fire(pickInfo);
}
//锁定光标
CameraMesh.prototype._initPointerLock =function() {
    var _this = this;
    canvas.addEventListener("click", function(evt) {//这个监听也会在点击GUI按钮时触发！！
        if(MyGame.init_state==1||MyGame.init_state==2)//点击canvas则锁定光标？
        {//不锁定指针时，这个监听什么也不做
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
                MyGame.flag_view="first_lock";
                _this.centercursor.isVisible=true;
            }
        }

    }, false);

    // Event listener when the pointerlock is updated.
    var pointerlockchange = function (event) {
        //if(MyServer.flag_view=="first_lock")
        //{//不锁定指针时，这个监听什么也不做
        _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
        if (!_this.controlEnabled) {
            _this.camera.detachControl(canvas);
        } else {
            _this.camera.attachControl(canvas);
        }
        //}
    };
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}
//执行时切换锁定状态和锁定状态的监听
CameraMesh.prototype._changePointerLock =function() {
    var _this = this;
    if(MyGame.flag_view=="first_lock")
    {
        document.exitPointerLock = document.exitPointerLock    ||
            document.mozExitPointerLock ||
            document.webkitExitPointerLock;

        if (document.exitPointerLock) {
            document.exitPointerLock();//重复执行它能改变锁定状态吗？在非调试模式下不行（和焦点的变化有关？）改用专用的退出锁定方法
        }
        //stopListening(canvas,"click",);//这里很难找到eventHandler
        MyGame.flag_view="first_pick";
        _this.centercursor.isVisible=false;
        /*var arr=MyGame.arr_keystate;
        arr[68]=0;
        arr[65]=0;
        arr[87]=0;
        arr[83]=0;
        arr[32]=0;
        arr[16]=0;*/
    }
    else if(MyGame.flag_view=="first_pick")
    {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();//但是如果这一句是在调试中运行的，就不能起作用了，因为光标在另一个页面中！！
        }
        MyGame.flag_view="first_lock";
        _this.centercursor.isVisible=true;
    }

}
//准心
CameraMesh.prototype.CenterCursor=function()
{
    //在屏幕中心绘制一个光标
    var rect_centor=new BABYLON.GUI.Rectangle();
    rect_centor.width = "80px";
    rect_centor.height = "80px";
    rect_centor.alpha=0.5;
    rect_centor.color="blue";
    MyGame.fsUI.addControl(rect_centor);

    var rect_line1=new BABYLON.GUI.Rectangle();
    rect_line1.width = "2px";
    rect_line1.height = "20px";
    rect_line1.color = "black";
    rect_line1.thickness = 4;
    rect_line1.alpha = 0.5;
    rect_line1.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect_centor.addControl(rect_line1);
    var rect_line2=new BABYLON.GUI.Rectangle();
    rect_line2.width = "2px";
    rect_line2.height = "20px";
    rect_line2.color = "black";
    rect_line2.thickness = 4;
    rect_line2.alpha = 0.5;
    rect_line2.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect_centor.addControl(rect_line2);
    var rect_line3=new BABYLON.GUI.Rectangle();
    rect_line3.width = "20px";
    rect_line3.height = "2px";
    rect_line3.color = "black";
    rect_line3.thickness = 4;
    rect_line3.alpha = 0.5;
    rect_line3.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect_centor.addControl(rect_line3);
    var rect_line4=new BABYLON.GUI.Rectangle();
    rect_line4.width = "20px";
    rect_line4.height = "2px";
    rect_line4.color = "black";
    rect_line4.thickness = 4;
    rect_line4.alpha = 0.5;
    rect_line4.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rect_centor.addControl(rect_line4);
    return rect_centor;
}
