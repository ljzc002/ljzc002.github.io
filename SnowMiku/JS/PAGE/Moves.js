/**
 * Created by lz on 2018/3/15.
 */
//这里是直接控制运动效果的代码
function host20171018(obj)
{
    MyGame.player.flag_objfast=Math.max(1,Math.abs(MyGame.Cameras.camera0.position.y/5));
    var arr_state=MyGame.arr_keystate;
    var rad_y=parseFloat(obj.mesh.rotation.y);
    var v_obj={x:0,z:0,y:0};//物理模型在自身坐标系中的线速度
    //var num_tempx= 0,num_tempz= 0,num_tempy=0;//认为这个是各个方向的分量
    if((arr_state[68]-arr_state[65])==0)//同时按下了左右键，或者什么也没按
    {

    }
    else if(arr_state[65]==1)
    {
        v_obj.x=-obj.vd.left;
    }
    else if(arr_state[68]==1)
    {
        v_obj.x=obj.vd.right;
    }
    if((arr_state[87]-arr_state[83])==0)//同时按下了前后键，或者什么也没按
    {

    }
    else if(arr_state[87]==1)
    {
        v_obj.z=obj.vd.forward;
    }
    else if(arr_state[83]==1)
    {
        v_obj.z=-obj.vd.backwards;
    }
    if((arr_state[32]-arr_state[16])==0)//同时按下了上下键，或者什么也没按
    {

    }
    else if(arr_state[32]==1)//空格
    {
        v_obj.y=obj.vd.up;
    }
    else if(arr_state[16]==1)//shift
    {
        v_obj.y=-obj.vd.down;
    }
    //var v_obj0=v_obj.clone();
    var v_x=Math.sin(rad_y)*v_obj.z+Math.cos(rad_y)*v_obj.x;
    var v_z=Math.cos(rad_y)*v_obj.z-Math.sin(rad_y)*v_obj.x;
    var num_temp=MyGame.DeltaTime*obj.flag_objfast;//时间量乘以速度系数
    var v_add=new BABYLON.Vector3(v_x*num_temp,v_obj.y*num_temp,v_z*num_temp);
    //console.log(v_add);
    obj.mesh.position.addInPlace(v_add);

    //最后还要限制一下相机运动边界
    /*var p_camera0=obj.mesh.position;
    var num_width=MyGame.Arena.num_width;
    var num_height=MyGame.Arena.num_height;
    var num_size=MyGame.Arena.num_size;
    var max_y=MyGame.Arena.max_y;
    if(p_camera0.x>num_width*num_size/2)
    {
        p_camera0.x=num_width*num_size/2
    }
    else if(p_camera0.x<-num_width*num_size/2)
    {
        p_camera0.x=-num_width*num_size/2
    }
    if(p_camera0.z>num_height*num_size/2)
    {
        p_camera0.z=num_height*num_size/2
    }
    else if(p_camera0.z<-num_height*num_size/2)
    {
        p_camera0.z=-num_height*num_size/2
    }
    if(p_camera0.y<0.1)
    {
        p_camera0.y=0.1;
    }
    else if(p_camera0.y>max_y)
    {
        p_camera0.y=max_y;
    }*/
    //var len=ground_parent._children.length;
    /*if(p_camera0.y<10)//视野半径随时变化
    {
        MyGame.Arena.dis_current=10;
    }
    else
    {
        MyGame.Arena.dis_current=Math.min(Math.round(p_camera0.y),40);
    }*/
}

function CamerasFollowActor(object)
{
    if(object.prototype=CameraMesh)
    {
        var camera0=MyGame.Cameras.camera0;
        if(MyGame.flag_view=="first_lock"||MyGame.flag_view=="first_ani")//动画时相机也要跟随
        {
            object.mesh.rotation.y = 0+camera0.rotation.y;
            object.mesh.rotation.x=0+camera0.rotation.x;
            //相机就位于相机网格的原点
            //var v_temp=new BABYLON.Vector3(0,0,0);
            //BABYLON.Vector3.TransformNormalToRef(object.mesh.position, object.mesh.worldMatrixFromCache, v_temp);
            camera0.position=object.mesh.position.clone()//.add(v_temp);//_absolutePosition是一个滞后的数值，不是立即刷新的！！！！
            //相机的位置变化也会导致选定的地区块变化？？
            if(MyGame.init_state==2&&MyGame.flag_view=="first_lock")//突出显示约7个地区块
            {
                var width = engine.getRenderWidth();
                var height = engine.getRenderHeight();
                var pickInfo = scene.pick(width/2, height/2, null, false, MyGame.Cameras.camera0);
                LookingForDQK(pickInfo);
            }
        }
        else if(MyGame.flag_view=="third")
        {

        }
        else if(MyGame.flag_view=="free")
        {
            //object.head.position=object.mesh.position.clone();

        }
    }

}