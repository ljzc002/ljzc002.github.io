/**
 * Created by Administrator on 2017/7/25.
 */
function onKeyDown(event)
{
    if(MyGame.flag_view=="first"||MyGame.flag_view=="third")
    {
        cancelEvent(event);//覆盖默认按键响应
        var keyCode = event.keyCode;
        var ch = String.fromCharCode(keyCode);//键码转字符
        MyGame.arr_state[keyCode]=1;
        if(keyCode==32)//空格是跳
        {
            if(MyGame.player.standonTheGround==1)
            {
                var v_temp=MyGame.player.mesh.physicsImpostor.getLinearVelocity();
                //if(v_temp.y)
                v_temp.y+=10;
                MyGame.player.mesh.physicsImpostor.setLinearVelocity(v_temp);
                MyGame.player.standonTheGround=0;
            }

        }
        else if(keyCode==88)//切枪
        {

        }
    }

}
function onKeyUp()
{
    if(MyGame.flag_view=="first"||MyGame.flag_view=="third")
    {
        cancelEvent(event);//覆盖默认按键响应
        var keyCode = event.keyCode;
        var ch = String.fromCharCode(keyCode);//键码转字符
        MyGame.arr_state[keyCode]=0;
    }
}

function physics20170725(obj)
{
    var arr_state=MyGame.arr_state;
    var num_tempx= 0,num_tempz=0;
    var v_obj0=obj.mesh.physicsImpostor.getLinearVelocity();//物理模型在世界坐标系中的线速度
    if(obj.standonTheGround==1)//站在地面上时才可以前后左右发力
    {
        var rad_y=parseFloat(obj.head.rotation.y);//绕y轴逆时针转过的弧度
        var v_obj={x:0,z:0};//物理模型在自身坐标系中的线速度
        v_obj.x=Math.sin(rad_y)*v_obj0.z+Math.cos(rad_y)*v_obj0.x;
        v_obj.z=Math.cos(rad_y)*v_obj0.z-Math.sin(rad_y)*v_obj0.x;
        if((arr_state[68]-arr_state[65])==0)//同时按下了左右键，或者什么也没按
        {
            if(v_obj.x>0.005)//正在向右运动
            {
                //num_tempx=-obj.ff;
                v_obj.x=0;
            }
            else if(v_obj.x<-0.005)
            {
                //num_tempx=obj.ff;
                v_obj.x=0;
            }
            else
            {
                v_obj.x=0;//取消过于微小的速度
            }
        }
        else if(arr_state[65]==1)
        {
            num_tempx=-obj.fm.left;
        }
        else if(arr_state[68]==1)
        {
            num_tempx=obj.fm.right;
        }
        if((arr_state[87]-arr_state[83])==0)
        {
            if(v_obj.z>0.005)//正在向右运动
            {
                //num_tempz=-obj.ff;
                v_obj.z=0;
            }
            else if(v_obj.z<-0.005)
            {
                //num_tempz=obj.ff;
                v_obj.z=0;
            }
            else
            {
                v_obj.z=0;//取消过于微小的速度
            }
        }
        else if(arr_state[87]==1)
        {
            num_tempz=obj.fm.forward;
        }
        else if(arr_state[83]==1)
        {
            num_tempz=-obj.fm.backwards;
        }
        //这里要结合head方向对运动进行转换，用世界矩阵？
        //向球心施加作用力的结果仍然是滚动！！直接使用线速度？？
        //obj.mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(num_tempx, 0  , num_tempz), obj.mesh.getAbsolutePosition());
        //var v_objd={x:0,z:0};
        v_obj.x+=num_tempx*MyGame.DeltaTime;//线速度还是会变成滚动！！！！
        v_obj.z+=num_tempz*MyGame.DeltaTime;
        //限制速度不能太快
        if(v_obj.x>obj.vm.right)
        {
            v_obj.x=obj.vm.right
        }
        else if(v_obj.x<-obj.vm.left)
        {
            v_obj.x=-obj.vm.left;
        }
        if(v_obj.z>obj.vm.forward)
        {
            v_obj.z=obj.vm.forward;
        }
        else if(v_obj.z<-obj.vm.backwards)
        {
            v_obj.z=-obj.vm.backwards;
        }
        //套用一自由度运动方法
        //var vectir1=(new BABYLON.Vector3(parseFloat(Math.sin(rad_y)) * v_obj.z,
         //   0, parseFloat(Math.cos(rad_y)) * v_obj.z));//.negate();
        //var vectir2=new BABYLON.Vector3(parseFloat(Math.cos(rad_y)) * v_obj.x,
         //   0, -parseFloat(Math.sin(rad_y)) * v_obj.x);//.negate();
        v_obj0.x=Math.sin(rad_y)*v_obj.z+Math.cos(rad_y)*v_obj.x;
        v_obj0.z=Math.cos(rad_y)*v_obj.z-Math.sin(rad_y)*v_obj.x;
    }

    obj.mesh.physicsImpostor.setLinearVelocity(v_obj0);
    obj.mesh.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0,0,0));//玩家的姿态交给相机控制，不归物理引擎负责
}
function CamerasFollowActor(object)
{
    if(MyGame.flag_view=="first")
    {
        object.head.rotation.y = 0+FreeCamera.rotation.y;
        object.head.rotation.x=0+FreeCamera.rotation.x;
        //为了调整相机和玩家之间的距离，把相机和玩家用滑块接头连起来？？！！
        //object.head.rotation.z=-object.mesh.rotation.z;
        //object.mesh.rotation.x = 0+MyGame.FreeCamera.rotation.x;
        object.head.position=object.mesh.position.clone();
        var v_temp=new BABYLON.Vector3(0,0,0);
        BABYLON.Vector3.TransformNormalToRef(object.headview.position, object.head.worldMatrixFromCache, v_temp);
        FreeCamera.position=object.mesh.position.add(v_temp);//_absolutePosition是一个滞后的数值，不是立即刷新的！！！！
    }
    else if(MyGame.flag_view=="third")
    {
        /*if(object.head.rotation.y != FreeCamera.rotation.y)
        {
            object.head.rotation.y = FreeCamera.rotation.y;//这里修改了姿态后下面的矩阵并没有及时更新！！所以旋转时发生了抖动！！
        }
        if(object.head.rotation.x!=FreeCamera.rotation.x)
        {
            object.head.rotation.x=FreeCamera.rotation.x;
        }*/

        //object.head.rotation.z=-object.mesh.rotation.z;
        //object.mesh.rotation.x = 0+MyGame.FreeCamera.rotation.x;
        object.head.position=object.mesh.position.clone();
        var v_temp=new BABYLON.Vector3(0,0,0);
        BABYLON.Vector3.TransformNormalToRef(object.backview_right.position, object.head.worldMatrixFromCache, v_temp);
        FreeCamera.position=object.mesh.position.add(v_temp);
    }
}