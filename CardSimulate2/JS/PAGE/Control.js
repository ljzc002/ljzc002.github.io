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
    canvas.addEventListener("mousedown", function(evt) {//发现只有在光标锁定的状态下，这个鼠标按下才会触发，解除光标锁定后被相机阻断了事件传播？
        var width = engine.getRenderWidth();//这种pick专用于first_lock锁定光标模式！！！！
        var height = engine.getRenderHeight();
        var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);//点击信息，取屏幕中心信息而不是鼠标信息！！
        if(MyGame.init_state==1&&MyGame.flag_view=="first_lock")//在用host方法移动相机时，部分禁用了原本的相机控制
        {
            cancelPropagation(evt);
            cancelEvent(evt);
        }
    }, false);
    canvas.addEventListener("mousemove", function(evt){
        var width = engine.getRenderWidth();
        var height = engine.getRenderHeight();
        var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);//点击信息
        if(MyGame.flag_view=="first_ani")
        {
            cancelPropagation(evt);
            cancelEvent(evt);
            return;
        }
    },false);
    canvas.addEventListener("blur",function(evt){//监听失去焦点
        releaseKeyState();
    })
    canvas.addEventListener("focus",function(evt){//改为监听获得焦点，因为调试失去焦点时事件的先后顺序不好说
        releaseKeyState();
    })

}
function onKeyDown(event)
{//在播放动画时禁用所有的按键、鼠标效果
    if(MyGame.flag_view=="first_ani")
    {
        cancelPropagation(event);
        cancelEvent(event);
        return;
    }
    if(MyGame.flag_view=="first_lock"||MyGame.flag_view=="first_pick")//||MyGame.flag_view=="first_free")
    {
        cancelEvent(event);//覆盖默认按键响应
        var keyCode = event.keyCode;
        var ch = String.fromCharCode(keyCode);//键码转字符
        MyGame.arr_keystate[keyCode]=1;
        /*按键响应有两种，一种是按下之后立即生效的，一种是保持按下随时间积累的，第一种放在这里调度，第二种放在响应的控制类里*/
        if(keyCode==88)//切枪
        {

        }
        else if(keyCode==18||keyCode==27)//alt切换释放锁定->改为切换view
        {

            //MyGame.player._changePointerLock();
            arr_pickedCards=[];
            card_firstpick=null;
            MyGame.player.centercursor.color="blue";
            if(MyGame.flag_view=="first_lock")//在first_lock时按下alt，则清空所有遮罩(在first_lock时没有遮罩？ )显示显示手牌
            {

                HandCard(0);

            }
            else if(MyGame.flag_view=="first_pick")
            {

                if(flag_showhandcard==true)//这时是在显示手牌
                {
                    HandCard(1);
                }
                else{//这时是在选定棋子
                    HideAllMask();
                    MyGame.player.changePointerLock2("first_lock");//光标锁定是比较迟生效的？
                }

            }

        }
        else if(keyCode>=49&&keyCode<=53)
        {
            if(MyGame.flag_view=="first_pick"&&arr_pickedCards.length>0)//如果这时选择了一些手牌
            {
                HandleGroup(keyCode);

            }
        }
    }
}
function onKeyUp(event)
{
    if(MyGame.flag_view=="first_ani")
    {
        cancelPropagation(event);
        cancelEvent(event);
        return;
    }
    if(MyGame.flag_view=="first_lock"||MyGame.flag_view=="first_pick")//||MyGame.flag_view=="first_free")//光标锁定情况下的第一人称移动
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
function releaseKeyState()//将所有激活的按键状态置为0
{
    for(key in MyGame.arr_keystate)
    {
        MyGame.arr_keystate[key]=0;
    }
}
/**
 * Created by lz on 2018/9/27.
 */
//专门处理相机的点击事件
function CameraClick(_this,evt)
{
    if(MyGame.init_state==1||MyGame.init_state==2)//点击canvas则锁定光标，在因为某种原因在first_lock状态脱离焦点后用来恢复焦点
    {//不锁定指针时，这个监听什么也不做
        if(MyGame.flag_view=="first_lock")
        {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();

                MyGame.flag_view="first_lock";

                _this.centercursor.isVisible=true;
            }
            if(MyGame.init_state==1)
            {
                var width = engine.getRenderWidth();
                var height = engine.getRenderHeight();
                var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);
                if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="card_")
                {//点击棋盘上的一张卡，认为这时不可多选，并且同样可以点击其他人的卡片，但只能控制自己的卡片
                    cancelPropagation(evt);
                    cancelEvent(evt);
                    var mesh=pickInfo.pickedMesh;
                    var card=mesh.card;
                    PickCard2(card);//在棋盘上点击卡片
                }
                else if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,6)=="mesh_t")
                {//如果点击在地块上，如果是第一次点击则显示路径，用粒子效果？如果已经计算了路径则表示路径确认，通过动画按路径移动
                    PickTiled(pickInfo);
                }
            }
        }
        else//在非锁定光标时，click监听似乎不会被相机阻断
        {
            if(MyGame.flag_view=="first_ani")//由程序控制视角的动画时间
            {
                cancelPropagation(evt);
                cancelEvent(evt);
                return;
            }
            //var width = engine.getRenderWidth();
            //var height = engine.getRenderHeight();
            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, null, false, MyGame.Cameras.camera0);//点击信息，取屏幕中心信息而不是鼠标信息！！
            if(MyGame.init_state==1&&MyGame.flag_view=="first_pick")
            {//锁定视角有可能是在操作手牌，也有可能是正在棋盘上显示各种遮罩
                if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="card_")
                {
                    cancelPropagation(evt);
                    cancelEvent(evt);
                    var mesh=pickInfo.pickedMesh;
                    var card=mesh.card;
                    if(card.workstate=="hand"||card.workstate=="dust")
                    {
                        PickCard(card);//选择一张手牌
                    }
                    else if(card.workstate=="wait"||card.workstate=="moved"||card.workstate=="worked")
                    {
                        PickCard2(card);//在棋盘上点击卡片
                    }
                }
                else if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,6)=="mesh_t")
                {//如果点击在地块上，如果是第一次点击则显示路径，用粒子效果？如果已经计算了路径则表示路径确认，通过动画按路径移动
                    PickTiled(pickInfo);
                }
            }
        }
    }
}
