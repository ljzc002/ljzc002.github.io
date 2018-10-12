/**
 * Created by lz on 2018/3/12.
 */
/*20180613现在规定主相机在MyGame中对应三种状态：
first_lock表示相机和相机网格绑定在一起并使用Control控制，
first_free表示禁用Control控制相机默认自由浏览，
first_ani表示由动画控制相机相机不可手动控制
first_pick表示相机位置不可以移动，但是可以改变视角进行点击（是在没有锁定指针属性时的替代方法？？）*/
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
    this.mesh=param.mesh;//可以把这个mesh指定为BallMan！！！！
    this.camera.mesh=this.mesh;
    var _this = this;
    //中间光标
    this.centercursor=this.CenterCursor();
    this.centercursor.isVisible=false;
    this._initPointerLock();//先不要锁定光标，等初始化地形完毕后再锁定

    console.log("相机网格初始化完毕");
}
CameraMesh.prototype.handleUserMouse=function(evt, pickInfo)
{
    //this.weapon.fire(pickInfo);
}
//锁定光标
CameraMesh.prototype._initPointerLock =function() {
    var _this = this;
    //这个监听只是用来获取焦点的？从降低耦合的角度来讲，全局事件监听并不应该放在角色类里！！！！
    canvas.addEventListener("click", function(evt) {//这个监听也会在点击GUI按钮时触发！！
        CameraClick(_this,evt);
        /*if(MyGame.init_state==1||MyGame.init_state==2)//点击canvas则锁定光标，在因为某种原因在first_lock状态脱离焦点后用来恢复焦点
        {//不锁定指针时，这个监听什么也不做
            if(MyGame.flag_view!="first_pick")
            {
                canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
                if (canvas.requestPointerLock) {
                    canvas.requestPointerLock();

                        MyGame.flag_view="first_lock";

                    _this.centercursor.isVisible=true;
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
                else if(MyGame.init_state==1&&MyGame.flag_view=="first_lock"//点击棋盘上的一张卡，认为这时不可多选，并且同样可以点击其他人的卡片，但只能控制自己的卡片
                    &&pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="card_")//&&pickInfo.pickedMesh.card.belongto==MyGame.WhoAmI)
                {
                    cancelPropagation(evt);
                    cancelEvent(evt);
                    var mesh=pickInfo.pickedMesh;
                    var card=mesh.card;
                    PickCard2(card);//在棋盘上点击
                }
                else if(MyGame.init_state==1&&MyGame.flag_view=="first_lock"&&pickInfo.hit&&pickInfo.pickedMesh.name.substr(0,5)=="mask_")
                {//如果点击在遮罩层上，如果是第一次点击则计算路径并显示，如果已经计算了路径则表示路径确认，通过动画按路径移动

                }
            }
        }*/

    }, false);
    //一开始直接锁定光标
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
        MyGame.flag_view = "first_lock";
        _this.centercursor.isVisible = true;
        mesh_arr_cards.parent=this.mesh.ballman.backview;
    }

    // Event listener when the pointerlock is updated.
    var pointerlockchange = function (event) {
        //if(MyServer.flag_view=="first_lock")
        //{//不锁定指针时，这个监听什么也不做
        _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
        if (!_this.controlEnabled) {
            //_this.camera.detachControl(canvas);//在first_pick时还是要保持操纵性
        } else {
            _this.camera.attachControl(canvas,true);
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
        _this.camera.attachControl(canvas,true);
        _this.centercursor.isVisible=false;
        var len=mesh_arr_cards._children.length;
        //mesh_arr_cards.parent=null;

        HandCard(0);//用动画方式显示手牌
        //mesh_arr_cards.parent=this.mesh.ballman.handpoint;

    }
    else if(MyGame.flag_view=="first_pick")
    {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();//但是如果这一句是在调试中运行的，就不能起作用了，因为光标在另一个页面中！！
        }
        MyGame.flag_view="first_lock";
        _this.camera.attachControl(canvas,true);
        _this.centercursor.isVisible=true;
        var len=mesh_arr_cards._children.length;
        MyGame.UiPanelr.button1.isVisible=false;
        MyGame.UiPanelr.button2.isVisible=false;
        mesh_arr_cards.position.y=0;
        HandCard(1);
        //mesh_arr_cards.parent=this.mesh.ballman.backview;//把手牌隐藏起来
    }

}
//准心
CameraMesh.prototype.CenterCursor=function()
{
    //在屏幕中心绘制一个光标
    var rect_centor=new BABYLON.GUI.Rectangle();
    rect_centor.width = "60px";
    rect_centor.height = "60px";
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

CardMesh=function()
{
    newland.object.call(this);
}
CardMesh.prototype=new newland.object();
CardMesh.prototype.init=function(param,scene)
{
    //param = param || {};
    if(!param||!param.card)
    {
        alert("卡牌初始化失败");
        return;
    }
    this.name = param.name;//名称
    this.point_x = param.point_x;//x方向有几个点
    this.point_y = param.point_y;//y方向有几个点
    this.imagemain=param.card.imagemain;
    this.background=param.card.background;
    this.attack=param.card.attack;
    this.hp=param.card.hp;
    this.cost=param.card.cost;
    this.str_comment=param.card.str_comment;
    this.str_title=param.card.str_title;
    this.range=param.card.range;
    this.speed=param.card.speed;
    //this.imagef = this.make_imagef();//正面纹理图片使用canvas生成
    this.imageb = param.card.imageb;//背面纹理图片
    this.linecolor = param.linecolor;//未选中时显示边线，选中时用发光边线
    this.scene = param.scene;
    this.belongto=param.belongto;//表名该卡牌现在由哪个玩家掌控
    this.isPicked=false;//这个卡片是否被选中
    this.num_group=999;//这个卡片的编队数字，编队越靠前显示越靠前，999表示最大，意为没有编队，显示在列表的最后面
    this.pickindex=0;//在被选中卡片数组中的索引，需要不断刷新？
    this.workstate="hand";//单位目前的工作状态，hand在手里，wait等待行动，moved已经移动到工作地点，worked已经工作不能再移动和工作

    //正反表面顶点
    this.vertexData = new BABYLON.VertexData();//每一张卡片都要有自己的顶点数组对象，正反两面复用。这个对象要一直保持不变！！
    this.make_vertex(this.point_x, this.point_y);
    //正面纹理
    var materialf = new BABYLON.StandardMaterial(this.name+"cardf", this.scene);//测试用卡片纹理
    //materialf.diffuseTexture = new BABYLON.Texture(this.imagef, this.scene);//地面的纹理贴图
    //materialf.diffuseTexture.hasAlpha = false;
    //materialf.diffuseColor=new BABYLON.Color3(param.card.background[0]
    //    , param.card.background[1], param.card.background[2]);
    if(MyGame.textures[param.card.background])//如果已经初始化过这种纹理，则使用已经初始化完毕的
    {
        materialf.diffuseTexture=MyGame.textures[param.card.background];
    }
    else
    {
        materialf.diffuseTexture = new BABYLON.Texture(arr_fronttypes[param.card.background], this.scene);
        materialf.diffuseTexture.hasAlpha = false;
        MyGame.textures[param.card.background]=materialf.diffuseTexture;
    }
    materialf.backFaceCulling = true;
    materialf.bumpTexture = new BABYLON.Texture("../ASSETS/IMAGE/grained_uv.png", scene);//磨砂表面
    materialf.useLogarithmicDepth=true;
    //背面纹理
    var materialb = new BABYLON.StandardMaterial(this.name+"cardb", this.scene);//测试用卡片纹理
    if(MyGame.textures[param.card.imageb])//如果已经初始化过这种纹理，则使用已经初始化完毕的
    {
        materialb.diffuseTexture=MyGame.textures[param.card.imageb];
    }
    else
    {
        materialb.diffuseTexture = new BABYLON.Texture(arr_backtypes[param.card.imageb], this.scene);
        materialb.diffuseTexture.hasAlpha = false;
        MyGame.textures[param.card.imageb]=materialb.diffuseTexture;
    }
    materialb.backFaceCulling = false;
    //materialb.sideOrientation=BABYLON.Mesh.BACKSIDE;


    var x=this.point_x;
    var y=this.point_y;

    //还是将正反两面作为不同的mesh更直观？
    //背面网格
    var cardb = new BABYLON.Mesh(this.name + "b", this.scene);
    this.vertexData.applyToMesh(cardb, true);
    cardb.material = materialb;
    cardb.renderingGroupId = 2;
    //cardb.position.x+=(x-1);
    //cardb.rotation.y=Math.PI;
    cardb.sideOrientation = BABYLON.Mesh.BACKSIDE;
    cardb.position.y -= (y - 1) / 2;
    cardb.position.x -= (x - 1) / 2;
    cardb.isPickable=false;
    //正面网格
    var cardf = new BABYLON.Mesh(this.name + "f", this.scene);
    this.vertexData.applyToMesh(cardf, true);
    cardf.material = materialf;
    cardf.renderingGroupId = 2;
    cardf.sideOrientation = BABYLON.Mesh.FRONTSIDE;
    cardf.position.y -= (y - 1) / 2;//定义的顶点把左下角设为了零点，而默认的网格则是把中心点设为零点
    cardf.position.x -= (x - 1) / 2;
    cardf.isPickable=false;
    //边线
    var path_line = this.make_line(this.vertexData, x, y);//这里是四个顶点，能否自动封口？改用细线+高亮辉光？？!!用可见性控制
    //this.path_line=path_line;
    //Mesh的Create方法事实上在调用MeshBuilder的对应Create方法，MeshBuilder的Create方法也可以实现对现有Mesh的变形功能
    //var line = new BABYLON.Mesh.CreateLines("line", path_line, this.scene, true);
    //为了能够调整宽度，将线改为圆柱体
    var line =BABYLON.MeshBuilder.CreateTube("line_"+this.name, {path: path_line, radius: 0.05,updatable:false}, scene);
    //边线纹理
    var materialline = new BABYLON.StandardMaterial("mat_line", this.scene);
    materialline.diffuseColor = this.linecolor;
    line.material = materialline;
    //line.color = new BABYLON.Color3(1, 0, 0);//这个颜色表示方式各个分量在0到1之间
    line.renderingGroupId = 2;
    line.position.y -= (y - 1) / 2;
    line.position.x -= (x - 1) / 2;
    line.isVisible=false;
    //除了显示选中效果之外，还需要一种在远处表示归属的边框
    var line2 = new BABYLON.Mesh.CreateLines("line2_"+this.name, path_line, this.scene, true);
    line2.color=this.linecolor;
    line2.renderingGroupId = 2;
    line2.position.y -= (y - 1) / 2;
    line2.position.x -= (x - 1) / 2;

    this.mesh=new BABYLON.MeshBuilder.CreateBox(("card_" +this.name),{width:x-1,height:y-1,depth:0.005},this.scene);
    this.mesh.renderingGroupId = 0;//隐形元素
    this.mesh.position=param.position;
    this.mesh.rotation=param.rotation;
    this.mesh.scaling=param.scaling;
    this.cardf = cardf;
    this.cardb = cardb;
    this.line = line;
    this.line2 = line2;
    this.path_line=path_line;//边界管路径
    this.arr_path_line=line.getVerticesData(BABYLON.VertexBuffer.PositionKind,false);//边界管顶点
    cardf.parent = this.mesh;
    cardb.parent = this.mesh;
    line.parent = this.mesh;
    line2.parent = this.mesh;
    this.mesh.card = this;
    //this.mesh.parent=mesh_arr_cards;//按照高内聚低耦合的规则，这个设定不应该放在角色类内部
    //暂时使用16:9的高宽设计
    var mesh_mainpic=new BABYLON.MeshBuilder.CreateGround(this.name+"mesh_mainpic",{width:8.4,height:9},scene);
    mesh_mainpic.parent=this.mesh;
    mesh_mainpic.position=new BABYLON.Vector3(0,2.8,-0.01);
    var mat_mainpic = new BABYLON.StandardMaterial(this.name+"mat_mainpic", this.scene);//测试用卡片纹理
    mat_mainpic.diffuseTexture = new BABYLON.Texture(this.imagemain, this.scene);//地面的纹理贴图
    mat_mainpic.diffuseTexture.hasAlpha = false;
    mat_mainpic.backFaceCulling = true;
    mat_mainpic.useLogarithmicDepth=true;//虽然还不完全理解为什么，但是这种深度测试方式能够避免“Z-fighting”
    mat_mainpic.freeze();
    mesh_mainpic.material=mat_mainpic;
    mesh_mainpic.renderingGroupId=2;
    mesh_mainpic.rotation.x=-Math.PI/2;
    mesh_mainpic.isPickable=false;

    var mesh_comment=new BABYLON.MeshBuilder.CreateGround(this.name+"mesh_comment",{width:6,height:4.8},scene);
    mesh_comment.parent=this.mesh;
    mesh_comment.position=new BABYLON.Vector3(0,-4.6,-0.01);
    mesh_comment.renderingGroupId=2;
    var mat_comment = new BABYLON.StandardMaterial(this.name+"mat_comment", scene);
    var texture_comment= new BABYLON.DynamicTexture(this.name+"texture_comment", {width:300, height:240}, scene);
    mat_comment.diffuseTexture =texture_comment;
    mat_comment.useLogarithmicDepth=true;
    mesh_comment.material = mat_comment;
    mesh_comment.rotation.x=-Math.PI/2;
    mesh_comment.isPickable=false;
    var context_comment = texture_comment.getContext();
    context_comment.fillStyle="#0000ff";
    context_comment.fillRect(1,1,150,120);
    context_comment.fillStyle="#ffffff";
    context_comment.font="bold 32px monospace";
    newland.canvasTextAutoLine(this.str_comment,context_comment,1,30,35,34);
    texture_comment.update();
    //    var font = "bold 32px monospace";
    //texture_comment.drawText(this.str_comment, 75, 135, font, "green", "white", true, true);//第一个是文字颜色，第二个则是完全填充的背景色


}
//生成通用的顶点数组和纹理映射数组
CardMesh.prototype.make_vertex=function(x,y)
{
    var positions=[];
    var uvs=[];
    var normals=[];
    var indices=[];
    for(var i=0;i<y;i++)//对于每一行顶点
    {
        for(var j=0;j<x;j++)//对于这一行里的每一个顶点
        {
            positions.push(j);
            positions.push(i);
            positions.push(0);//顶点位置

            uvs.push((j/(x-1)));
            uvs.push((i/(y-1)));//纹理映射位置

        }
    }
    for(var i=0;i<y-1;i++)
    {
        for(var j=0;j<x-1;j++)
        {
            var int_point=j+x*i;//第一个点的数字索引
            indices.push(int_point);
            indices.push(int_point+1);
            indices.push(int_point+x);
            indices.push(int_point+1);
            indices.push(int_point+x+1);
            indices.push(int_point+x);//画出两个三角形组成一个矩形
        }
    }
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);//计算法线
    BABYLON.VertexData._ComputeSides(0, positions, indices, normals, uvs);
    this.vertexData.indices = indices.concat();//索引
    this.vertexData.positions = positions.concat();
    this.vertexData.normals = normals.concat();//position改变法线也要改变！！！！
    this.vertexData.uvs = uvs.concat();
}
//边线轨迹
CardMesh.prototype.make_line=function(vertexData,x,y)
{
    var path_line=[];
    //找边线上的所有点
    for(var i=0;i<x-1;i++)
    {
        path_line.push(new BABYLON.Vector3(vertexData.positions[i*3],vertexData.positions[i*3+1],vertexData.positions[i*3+2]));
    }
    for(var i=0;i<y-1;i++)
    {
        path_line.push(new BABYLON.Vector3(vertexData.positions[3*(x-1)+i*x*3],vertexData.positions[3*(x-1)+i*x*3+1],vertexData.positions[3*(x-1)+i*x*3+2]));
    }
    for(var i=x-1;i>0;i--)
    {
        path_line.push(new BABYLON.Vector3(vertexData.positions[(y-1)*x*3+i*3],vertexData.positions[(y-1)*x*3+i*3+1],vertexData.positions[(y-1)*x*3+i*3+2]));
    }
    for(var i=y-1;i>=0;i--)
    {
        path_line.push(new BABYLON.Vector3(vertexData.positions[i*x*3],vertexData.positions[i*x*3+1],vertexData.positions[i*x*3+2]));
    }
    return path_line;
}
//根据各项数据生成卡片
CardMesh.prototype.make_imagef=function()
{

}


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
    var headview=new BABYLON.Mesh(this.name+"headview",scene);
    headview.parent=this.head;
    headview.position=new BABYLON.Vector3(0,0,2.0);
    this.headview=headview;
    //定位第三人称视角的位置
    var backview=new BABYLON.Mesh(this.name+"backview",scene);
    backview.parent=this.head;
    backview.position=new BABYLON.Vector3(0,2,-6);
    this.backview=backview;
    var backview_right=new BABYLON.Mesh(this.name+"backview_right",scene);
    backview_right.parent=this.head;
    backview_right.position=new BABYLON.Vector3(2.6,2,-6);
    this.backview_right=backview_right;
    //定位手持物体的位置，或者是正前方光标的位置？
    var handpoint=new BABYLON.Mesh(this.name+"handpoint",scene);
    handpoint.parent=this.head;
    handpoint.position=new BABYLON.Vector3(0,0,10);
    this.handpoint=handpoint;
    //左手和右手
    var lefthand=new BABYLON.Mesh(this.name+"lefthand",scene);
    lefthand.parent=this.head;
    lefthand.position=new BABYLON.Vector3(-1,0.2,3.0);
    lefthand.lookAt(lefthand.position.negate().add(headview.position));
    this.lefthand=lefthand;
    var righthand=new BABYLON.Mesh(this.name+"righthand",scene);
    righthand.parent=this.head;
    righthand.position=new BABYLON.Vector3(1,0.2,3.0);
    righthand.lookAt(righthand.position.negate().add(headview.position));
    this.righthand=righthand;

    //暂时不使用抬头显示器
    console.log("Player初始化完毕");

}
