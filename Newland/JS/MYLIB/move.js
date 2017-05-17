/**
 * Created by Administrator on 2016/12/21.
 */
//与各种移动和鼠标移动相关的方法
//绝对方向移动
function CrossMove(obj)
{
    //直接根据时间计算水平和竖直速度
    //处理前后
    obj.mchange.forward=0;
    if (obj.keys.w != 0 && obj.keys.s != 0) {//同时按下前后键则什么也不做

    }
    else if (obj.keys.w != 0) {
        obj.mchange.forward=obj.vd.forward * schange;
    }
    else if (obj.keys.s != 0) {
        obj.mchange.forward=-obj.vd.backwards * schange;
    }
    //处理左右
    obj.mchange.right=0;
    if (obj.keys.a != 0 && obj.keys.d != 0) {//同时按下左右键则什么也不做

    }
    else if (obj.keys.a != 0) {
        obj.mchange.right=-obj.vd.left * schange;
    }
    else if (obj.keys.d != 0) {
        obj.mchange.right=obj.vd.right * schange;
    }
    //处理上下
    obj.mchange.up=0;
    if (obj.keys.space != 0 && obj.keys.ctrl != 0) {//同时按下左右键则什么也不做

    }
    else if (obj.keys.space != 0) {
        obj.mchange.up=obj.vd.up * schange;
    }
    else if (obj.keys.ctrl != 0) {
        obj.mchange.up=-obj.vd.down * schange;
    }
    obj.py0=obj.mesh.position.y;
    //我自定义的这个结构和BABYLON的Vector3是不一样的！！
    obj.vmove.z=obj.mchange.forward*obj.flag_runfast;
    obj.vmove.y=obj.mchange.up*obj.flag_runfast;
    obj.vmove.x=obj.mchange.right*obj.flag_runfast;

    if((obj.vmove.x!=0||obj.vmove.y!=0||obj.vmove.z!=0))
    {
        obj.mesh.moveWithCollisions(obj.vmove);//多个对象使用这一方法时，不能使用异步运算！！

    }
}
//一自由度移动
function OneDOFMove(obj)
{
    obj.ryt=obj.mesh.rotation.y;
    obj.rychange=parseFloat(obj.ryt - obj.ry0);
    obj.ry0=obj.ryt;

    //直接根据时间计算水平和竖直速度
    //处理前后
    obj.mchange.forward=0;
    if (obj.keys.w != 0 && obj.keys.s != 0) {//同时按下前后键则什么也不做

    }
    else if (obj.keys.w != 0) {
        obj.mchange.forward=obj.vd.forward * schange;
    }
    else if (obj.keys.s != 0) {
        obj.mchange.forward=-obj.vd.backwards * schange;
    }
    //处理左右
    obj.mchange.right=0;
    if (obj.keys.a != 0 && obj.keys.d != 0) {//同时按下左右键则什么也不做

    }
    else if (obj.keys.a != 0) {
        obj.mchange.right=-obj.vd.left * schange;
    }
    else if (obj.keys.d != 0) {
        obj.mchange.right=obj.vd.right * schange;
    }
    //处理上下
    obj.mchange.up=0;
    if (obj.keys.space != 0 && obj.keys.ctrl != 0) {//同时按下左右键则什么也不做

    }
    else if (obj.keys.space != 0) {
        obj.mchange.up=obj.vd.up * schange;
    }
    else if (obj.keys.ctrl != 0) {
        obj.mchange.up=-obj.vd.down * schange;
    }

    //实施移动，要考虑把这个实施移动传递给远方客户端
    obj.py0=obj.mesh.position.y;
    var vectir1=(new BABYLON.Vector3(parseFloat(Math.sin(parseFloat(obj.mesh.rotation.y))) * obj.mchange.forward * obj.flag_runfast,
        0, parseFloat(Math.cos(parseFloat(obj.mesh.rotation.y))) * obj.mchange.forward * obj.flag_runfast));//.negate();
    var vectir2=new BABYLON.Vector3(parseFloat(Math.cos(parseFloat(obj.mesh.rotation.y))) * obj.mchange.right * obj.flag_runfast,
        0, -parseFloat(Math.sin(parseFloat(obj.mesh.rotation.y))) * obj.mchange.right * obj.flag_runfast);//.negate();
    var vectir3=new BABYLON.Vector3(0, obj.mchange.up * obj.flag_runfast, 0);
    obj.vmove = vectir1.add(vectir2).add(vectir3);

    if((obj.vmove.x!=0||obj.vmove.y!=0||obj.vmove.z!=0))
    {
        obj.mesh.moveWithCollisions(obj.vmove);//多个对象使用这一方法时，不能使用异步运算！！

    }
}
//二自由度移动
function TwoDOFsMove(obj)
{
    obj.ryt=obj.mesh.rotation.y;
    obj.rychange=parseFloat(obj.ryt - obj.ry0);
    obj.ry0=obj.ryt;

    //直接根据时间计算水平和竖直速度
    //处理前后
    obj.mchange.forward=0;
    if (obj.keys.w != 0 && obj.keys.s != 0) {//同时按下前后键则什么也不做

    }
    else if (obj.keys.w != 0) {
        obj.mchange.forward=obj.vd.forward * schange;
    }
    else if (obj.keys.s != 0) {
        obj.mchange.forward=-obj.vd.backwards * schange;
    }
    //处理左右
    obj.mchange.right=0;
    if (obj.keys.a != 0 && obj.keys.d != 0) {//同时按下左右键则什么也不做

    }
    else if (obj.keys.a != 0) {
        obj.mchange.right=-obj.vd.left * schange;
    }
    else if (obj.keys.d != 0) {
        obj.mchange.right=obj.vd.right * schange;
    }
    //处理上下
    obj.mchange.up=0;
    if (obj.keys.space != 0 && obj.keys.ctrl != 0) {//同时按下上下键则什么也不做

    }
    else if (obj.keys.space != 0) {
        obj.mchange.up=obj.vd.up * schange;
    }
    else if (obj.keys.ctrl != 0) {
        obj.mchange.up=-obj.vd.down * schange;
    }

    //实施移动，要考虑把这个实施移动传递给远方客户端
    obj.py0=obj.mesh.position.y;
    BABYLON.Vector3.TransformNormalToRef(new BABYLON.Vector3(obj.mchange.right,obj.mchange.up,obj.mchange.forward), obj.mesh.worldMatrixFromCache, obj.vmove);
    //worldMatrixFromCache是否有延时？？
    obj.vmove.scaleInPlace(obj.flag_runfast);
    if((obj.vmove.x!=0||obj.vmove.y!=0||obj.vmove.z!=0))
    {
        obj.mesh.moveWithCollisions(obj.vmove);//多个对象使用这一方法时，不能使用异步运算！！

    }
}
function SetCursor(type)//选择“选择方式”
{
    if(type=="remove")
    {
        current_cursor=null;
        freeCamera.attachControl(canvas, true);//返还视角控制

        //flag_defaultcontrol=false;
    }
    else if (type=="movey")
    {

        current_cursor="movey";
        flag_defaultcontrol=true;//进入选择模式时禁止所有移动
        arr_myplayers[czyid].keys={w:0,s:0,a:0,d:0,space:0,ctrl:0,shift:0};
        freeCamera.detachControl(canvas);//剥离视角控制
    }
    else
    {
        current_cursor=type;
    }
}
function handle_cursor(evt, pickResult)
{
    if (pickResult.hit)//命中了物体
    {
        //stopListening(canvas,"mousemove",handle_movey_point);
        //stopListening(canvas,"mouseup",handle_up_point);
        PickedMesh = pickResult.pickedMesh;
        var obj=arr_myplayers[czyid];
        if(PickedMesh.name.substr(0,4)=="disc")
        {
            //PickedMesh.picked=true;
            //PickedMesh = pickResult.pickedMesh;
            //pickedPoint=pickResult.pickedPoint;
            obj.mesh.position.x=PickedMesh.position.x;
            obj.mesh.position.z=PickedMesh.position.z;
            obj.mesh.position.y=15;
            //obj.flag_set=PickedMesh;
            //obj.mesh
        }
        //else if(PickedMesh.name.substr(0,4)=="card"&&obj.flag_set!=null)//点击了一张卡牌
        else if(PickedMesh.name.substr(0,4)=="card")//点击了一张卡牌
        {
            var card=PickedMesh.card;
            if(current_cursor=="pick"&&(card.belongto==null||card.belongto==id))
            {
                card.belongto=id;//这张卡片归我了
                //尝试直接对矩阵进行动画变换没有成功
                /*var animation1=new BABYLON.Animation("animation1","_worldMatrix",30,BABYLON.Animation.ANIMATIONTYPE_MATRIX,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                var keys1=[{frame:0,value:card.mesh._worldMatrix.clone()},{frame:60,value:obj.handpoint._worldMatrix.clone()}];
                animation1.setKeys(keys1);
                card.mesh.animations.push(animation1);*/

                var animation1=new BABYLON.Animation("animation1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                var keys1=[{frame:0,value:card.mesh.position.clone()},{frame:60,value:obj.handpoint.absolutePosition.clone()}];
                animation1.setKeys(keys1);
                card.mesh.animations.push(animation1);
                var animation2=new BABYLON.Animation("animation2","rotation",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                var keys2=[{frame:0,value:card.mesh.rotation.clone()},{frame:60,value:obj.mesh.rotation.clone()}];
                animation2.setKeys(keys2);
                card.mesh.animations.push(animation2);

                scene.beginAnimation(card.mesh, 0, 60, true);
                //card.mesh._worldMatrix=obj.handpoint._worldMatrix;//把卡牌抓到手里
                //不等待每帧发送，在操作时直接发送？？
                //使用广播方式发送？-》用admin广播方式发送
                //这里需要的是一个动画过程！！！！
                if(state=="online")
                {
                    var str_data="[pickca]"+JSON.stringify([card.name,obj.handpoint._worldMatrix.clone(),id,obj.handpoint.absolutePosition.x,obj.handpoint.absolutePosition.y
                            ,obj.handpoint.absolutePosition.z,obj.mesh.rotation.x,obj.mesh.rotation.y,obj.mesh.rotation.z]);
                    doSend(str_data);
                }


            }
            else if(current_cursor=="movey"&&card.belongto==id)//只能控制属于自己的卡牌
            {

                pickedPoint=pickResult.pickedPoint;
                var event = evt || window.event;
                //cancelEvent(event);
                //event.
                card_disX = event.clientX;//鼠标按下的点在浏览器中的位置
                card_disY = event.clientY;
                PickedMesh.card.pos=BABYLON.Vector3.TransformCoordinates(pickedPoint.clone(),PickedMesh._worldMatrix.clone().invert());
                //_localWorld是物体变化的增量，反向应用它会产生谐振现象？？尝试使用_worldMatrix（物体变化的状态），而且要使用clone值！！！！
                canvas.onmousemove=handle_movey_point;
                canvas.onmouseup=handle_up_point;
                //{
                    //current_cursor={type:"null"};
                    //stopListening(canvas,"mousedown",handle_move_point);
                    //freeCamera.attachControl(canvas,true);
                    //松手之后卡牌恢复原样？？
                //};
            }

        }
    }
}
function handle_movey_point(event)
{//鼠标移动事件
    if(pickedPoint!=null&&current_cursor=="movey")
    {
        var event = event || window.event;
        cancelEvent(event);
        var iL = event.clientX - card_disX;//event.clientX 是dom的属性，为防止相机移动是鼠标串位，需要禁止移动
        var iT = event.clientY - card_disY;
        //改变点阵的位置
        //向右向上的移动，都认为是相对于最初位置的！！
        PickedMesh.card.move_point(iL,iT);
        return false;
    }

}
function handle_up_point(event)
{
    if(pickedPoint!=null)
    {
        var event = event || window.event;
        cancelEvent(event);
        PickedMesh.card.back_point();
        //PickedMesh=null;
        pickedPoint=null;
        stopListening(canvas,"mousemove",handle_movey_point);
        stopListening(canvas,"mouseup",handle_up_point);
    }
}
//console.log("6");