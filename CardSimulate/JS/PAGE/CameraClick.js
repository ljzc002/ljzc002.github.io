/**
 * Created by lz on 2018/9/27.
 */
//专门处理相机的点击事件
function CameraClick(_this,evt)
{
    if(MyGame.init_state==1||MyGame.init_state==2)//点击canvas则锁定光标，在因为某种原因在first_lock状态脱离焦点后用来恢复焦点
    {//不锁定指针时，这个监听什么也不做
        if(MyGame.flag_view!="first_pick")
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
            if(MyGame.init_state==1&&MyGame.flag_view=="first_pick"
                &&pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="card_"&&pickInfo.pickedMesh.card.belongto==MyGame.WhoAmI)//在一个卡片上按下鼠标，按下即被选中
            {
                cancelPropagation(evt);
                cancelEvent(evt);
                //releaseKeyState();
                var mesh=pickInfo.pickedMesh;
                var card=mesh.card;
                PickCard(card);
            }

        }
    }
}