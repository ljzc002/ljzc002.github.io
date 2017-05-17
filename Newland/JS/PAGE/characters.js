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
    this.flag_objfast=param.flag_objfast ||1;;//使用这种机体移动物体的默认速度

    if(this.lab)
    {//克隆过来的对象可能已经有一个名字！！
        this.lab.dispose();
        this.lab=null;
    }

    //在玩家头上显示名字，clone时这个也会被clone过去，要处理一下！！！！
    var lab_texture=new BABYLON.Texture.CreateFromBase64String(texttoimg(this.name,"normal 32px sans-serif",32,"rgb(255,255,255)","png")
        ,"datatexture"+this.name,scene);//使用canvas纹理，但这个纹理只能是不透明的！！
    var materialSphere1 = new BABYLON.StandardMaterial("texture1"+this.id, scene);
    materialSphere1.diffuseTexture = lab_texture;
    var plane = BABYLON.Mesh.CreatePlane("plane"+this.id, 2.0, scene, false, BABYLON.Mesh.DOUBLESIDE);
    //You can also set the mesh side orientation with the values : BABYLON.Mesh.FRONTSIDE (default), BABYLON.Mesh.BACKSIDE or BABYLON.Mesh.DOUBLESIDE
    materialSphere1.diffuseTexture.hasAlpha = true;
    plane.position=new BABYLON.Vector3(0,2.0,0);//其父元素应用过0.05之缩放
    //plane.rotation.y = Math.PI;
    plane.scaling.x=2;
    plane.scaling.y=0.4;
    plane.parent=this.mesh;
    plane.material=materialSphere1;
    plane.renderingGroupId=2;
    this.lab=plane;
    //球体
    if(this.head)
    {
        this.head.dispose();
        this.head=null;
    }
    var mat_head=new BABYLON.StandardMaterial("mat_head", scene);
    mat_head.diffuseTexture =new BABYLON.Texture(param.image,scene);
    mat_head.freeze();
    var head = BABYLON.Mesh.CreateSphere(this.name+"head", 10,  2.0, scene);//球体没有立方体的faceuv选项！！
    head.material=mat_head;
    head.renderingGroupId=2;
    head.rotation.y=Math.PI*0.5;
    head.parent=this.mesh;
    this.head=head;

    //定位第一人称视角的位置
    var headview=new BABYLON.Mesh(this.name+"headview",scene);
    headview.parent=this.mesh;
    headview.position=new BABYLON.Vector3(0,0,2.0);
    this.headview=headview;
    //定位第三人称视角的位置
    var backview=new BABYLON.Mesh(this.name+"backview",scene);
    backview.parent=this.mesh;
    backview.position=new BABYLON.Vector3(0,2,-3);
    this.backview=backview;
    //定位手持物体的位置，或者是正前方光标的位置？
    var handpoint=new BABYLON.Mesh(this.name+"handpoint",scene);
    handpoint.parent=this.mesh;
    handpoint.position=new BABYLON.Vector3(0,0,10);
    this.handpoint=handpoint;
    //左手和右手
    var lefthand=new BABYLON.Mesh(this.name+"lefthand",scene);
    lefthand.parent=this.mesh;
    lefthand.position=new BABYLON.Vector3(-0.5,0.2,3.0);
    lefthand.lookAt(lefthand.position.negate().add(headview.position));
    this.lefthand=lefthand;
    var righthand=new BABYLON.Mesh(this.name+"righthand",scene);
    righthand.parent=this.mesh;
    righthand.position=new BABYLON.Vector3(0.5,0.2,3.0);
    righthand.lookAt(righthand.position.negate().add(headview.position));
    this.righthand=righthand;
    //暂时不使用抬头显示器
    console.log("Player初始化完毕");

}