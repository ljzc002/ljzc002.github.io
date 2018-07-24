/**
 * Created by lz on 2018/3/12.
 */
//加上日期表示它不是通用的工具库
/**
 * Created by lz on 2017/11/28.
 */
//这里是处理键盘鼠标等各种操作，并进行转发的代码
function InitMouse()
{
    canvas.addEventListener("mousedown", function(evt) {
        var width = engine.getRenderWidth();
        var height = engine.getRenderHeight();
        var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);//点击信息，取屏幕中心信息而不是鼠标信息！！
        cancelPropagation(evt);
        cancelEvent(evt);
        if(MyGame.init_state==2&&MyGame.flag_view=="first_lock")//点击地块打开dmk
        {

        }
    }, false);
    canvas.addEventListener("mousemove", function(evt){
        var width = engine.getRenderWidth();
        var height = engine.getRenderHeight();
        var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);//点击信息
        if(MyGame.init_state==2&&MyGame.flag_view=="first_lock")//突出显示约7个地区块
        {//更合理的写法是把下面这些都写到testpick.js里，降低耦合度
            /*if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,7)=="sphere1")//点击到了物体上，关键点是把鼠标指向点和内存中的arr_floorroom关联起来
            {
                var sphere1=pickInfo.pickedMesh;
                var pos_pick=pickInfo.pickedPoint.clone();
                var pos_pickSubSphere1=pos_pick.subtract(sphere1.position);
                LookingForDQK(pos);
            }*/
            LookingForDQK(pickInfo);
        }
    },false);
}
function onKeyDown(event)
{//在播放动画时禁用所有的按键、鼠标效果
    if(MyGame.flag_view=="first_lock"||MyGame.flag_view=="first_pick")
    {
        //if(MyGame.flag_view=="first_lock")
        //{
            cancelEvent(event);//覆盖默认按键响应
        //}
        var keyCode = event.keyCode;
        var ch = String.fromCharCode(keyCode);//键码转字符
        MyGame.arr_keystate[keyCode]=1;
        /*按键响应有两种，一种是按下之后立即生效的，一种是保持按下随时间积累的，第一种放在这里调度，第二种放在响应的控制类里*/
        if(keyCode==88)//切枪
        {

        }
        else if(keyCode==18||keyCode==27)//alt切换释放锁定
        {
            MyGame.player._changePointerLock();
        }
    }
}
function onKeyUp()
{
    if(MyGame.flag_view=="first_lock"||MyGame.flag_view=="first_pick")//光标锁定情况下的第一人称移动
    {
        //if(MyGame.flag_view=="first_lock")
        //{
            cancelEvent(event);//覆盖默认按键响应
        //}
        var keyCode = event.keyCode;
        var ch = String.fromCharCode(keyCode);//键码转字符
        MyGame.arr_keystate[keyCode]=0;
    }
}

