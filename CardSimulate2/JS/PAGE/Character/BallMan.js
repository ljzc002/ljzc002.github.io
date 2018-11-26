/**
 * Created by lz on 2018/10/19.
 */
BallMan=function()//只用来显示其他玩家？
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
    //this.vd={forward:10.0,backwards:10.0,left:10.0,right:10.0,up:10.0,down:10.0};//简单运动时各个方向的默认速度
    //this.flag_objfast=param.flag_objfast ||1;//使用这种机体移动物体的默认速度

    var mat_head=new BABYLON.StandardMaterial("mat_head", scene);
    mat_head.diffuseTexture =new BABYLON.Texture(param.image,scene);
    mat_head.freeze();
    mat_head.useLogarithmicDepth=true;
    var mesh_head=BABYLON.Mesh.CreateSphere(this.name+"head", 10,  2.0, scene);
    mesh_head.renderingGroupId=2;
    mesh_head.layerMask=2;
    //mesh_head.rotation.y=Math.PI*0.5;
    mesh_head.material=mat_head;
    //mesh_head.parent=this.mesh;//想让head随着ghost一起位移，又不想让它随着ghost滚动！！
    //this.mesh.setPhysicsLinkWith(mesh_head,new BABYLON.Vector3(0,0,0),new BABYLON.Vector3(0,0,0));//枢轴链接
    mesh_head.position=this.mesh.position.clone();//不克隆直接赋值有抖动
    mesh_head.isPickable=false;
    this.head=mesh_head;
    this.mesh.ballman=this;

    //改用gui？显示名字
    if(this.lab)
    {
        this.lab.dispose();
        this.lab=null;
    }
    var label = new BABYLON.GUI.Rectangle(this.name);
    label.background = "black";
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;//位置偏移量？？
    MyGame.fsUI.addControl(label);
    label.linkWithMesh(this.head);
    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = this.name;
    text1.color = "white";
    label.addControl(text1);
    label.isVisible=true;
    label.layerMask=2;
    this.lab=label;

    //定位第一人称视角的位置
    var headview=new BABYLON.TransformNode(this.name+"headview",scene);
    headview.parent=this.head;
    headview.position=new BABYLON.Vector3(0,0,2.0);
    this.headview=headview;
    //定位第三人称视角的位置
    var backview=new BABYLON.TransformNode(this.name+"backview",scene);
    backview.parent=this.head;
    backview.position=new BABYLON.Vector3(0,2,-6);
    this.backview=backview;
    var backview_right=new BABYLON.TransformNode(this.name+"backview_right",scene);
    backview_right.parent=this.head;
    backview_right.position=new BABYLON.Vector3(2.6,2,-6);
    this.backview_right=backview_right;
    //定位手持物体的位置，或者是正前方光标的位置？
    var handpoint=new BABYLON.TransformNode(this.name+"handpoint",scene);
    handpoint.parent=this.head;
    handpoint.position=new BABYLON.Vector3(0,0,10);
    this.handpoint=handpoint;
    //左手和右手
    var lefthand=new BABYLON.TransformNode(this.name+"lefthand",scene);
    lefthand.parent=this.head;
    lefthand.position=new BABYLON.Vector3(-1,0.2,3.0);
    lefthand.lookAt(lefthand.position.negate().add(headview.position));
    this.lefthand=lefthand;
    var righthand=new BABYLON.TransformNode(this.name+"righthand",scene);
    righthand.parent=this.head;
    righthand.position=new BABYLON.Vector3(1,0.2,3.0);
    righthand.lookAt(righthand.position.negate().add(headview.position));
    this.righthand=righthand;

    //暂时不使用抬头显示器
    console.log("Player初始化完毕");

}