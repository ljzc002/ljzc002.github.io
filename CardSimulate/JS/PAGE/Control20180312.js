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
        /*if(MyGame.flag_view=="first_ani")//由程序控制视角的动画时间
        {
            cancelPropagation(evt);
            cancelEvent(evt);
            return;
        }*/
        if(MyGame.init_state==1&&MyGame.flag_view=="first_lock")//在用host方法移动相机时，部分禁用了原本的相机控制
        {
            cancelPropagation(evt);
            cancelEvent(evt);
        }
        /*if(MyGame.init_state==1&&MyGame.flag_view=="first_pick"
            &&pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="card_"&&pickInfo.pickedMesh.card.belongto==MyGame.WhoAmI)//在一个卡片上按下鼠标，按下即被选中
        {
            cancelPropagation(evt);
            cancelEvent(evt);
            var mesh=pickInfo.pickedMesh;
            var card=mesh.card;
            PickCard(card);
        }*/
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
        if(MyGame.init_state==2&&MyGame.flag_view=="first_lock")//突出显示约7个地区块
        {//更合理的写法是把下面这些都写到testpick.js里，降低耦合度
            /*if(pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,7)=="sphere1")//点击到了物体上，关键点是把鼠标指向点和内存中的arr_floorroom关联起来
            {
                var sphere1=pickInfo.pickedMesh;
                var pos_pick=pickInfo.pickedPoint.clone();
                var pos_pickSubSphere1=pos_pick.subtract(sphere1.position);
                LookingForDQK(pos);
            }*/
            //LookingForDQK(pickInfo);
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
        else if(keyCode==18||keyCode==27)//alt切换释放锁定->改为切换view
        {
            MyGame.player._changePointerLock();
            arr_pickedCards=[];
            card_firstpick=null;
            //HideAllMask();
            /*if(MyGame.flag_view=="first_lock")
            {
                MyGame.flag_view="first_pick";
                mesh_arr_cards.isVisible=true;//这时显示可以操作的卡牌
            }
            else if(MyGame.flag_view=="first_pick")
            {
                MyGame.flag_view="first_lock";
                mesh_arr_cards.isVisible=false;
            }*/
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
