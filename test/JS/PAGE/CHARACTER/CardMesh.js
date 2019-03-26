/**
 * Created by lz on 2018/10/19.
 */
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
    this.imagedust=param.card.imagedust;
    this.background=param.card.background;
    this.attack=param.card.attack;
    this.hp=param.card.hp;
    this.chp=this.hp;
    this.mp=param.card.mp;
    this.cmp=this.mp;
    this.cost=param.card.cost;
    this.str_comment=param.card.str_comment;
    this.str_title=param.card.str_title;
    this.range=param.card.range;
    this.range2=param.card.range2;
    this.speed=param.card.speed;
    //this.imagef = this.make_imagef();//正面纹理图片使用canvas生成
    this.imageb = param.card.imageb;//背面纹理图片
    this.linecolor = param.linecolor;//未选中时显示边线，选中时用发光边线
    this.scene = param.scene;
    this.belongto=param.belongto;//表名该卡牌现在由哪个玩家掌控
    this.isPicked=false;//这个卡片是否被选中
    this.num_group=999;//这个卡片的编队数字，编队越靠前显示越靠前，999表示最大，意为没有编队，显示在列表的最后面
    this.pickindex=0;//在被选中卡片数组中的索引，需要不断刷新？
    this.workstate="hand";//单位目前的工作状态，hand在手里,dust残骸，wait等待行动，moved已经移动到工作地点，worked已经工作不能再移动和工作，下一回合时恢复到wait

    if(true) {
        //正反表面顶点
        this.vertexData = new BABYLON.VertexData();//每一张卡片都要有自己的顶点数组对象，正反两面复用。这个对象要一直保持不变！！
        this.make_vertex(this.point_x, this.point_y);
        //正面纹理
        var materialf = new BABYLON.StandardMaterial(this.name + "cardf", this.scene);//测试用卡片纹理
        //materialf.diffuseTexture = new BABYLON.Texture(this.imagef, this.scene);//地面的纹理贴图
        //materialf.diffuseTexture.hasAlpha = false;
        //materialf.diffuseColor=new BABYLON.Color3(param.card.background[0]
        //    , param.card.background[1], param.card.background[2]);
        if (MyGame.textures[param.card.background])//如果已经初始化过这种纹理，则使用已经初始化完毕的
        {
            materialf.diffuseTexture = MyGame.textures[param.card.background];
        }
        else {
            materialf.diffuseTexture = new BABYLON.Texture(arr_fronttypes[param.card.background], this.scene);
            materialf.diffuseTexture.hasAlpha = false;
            MyGame.textures[param.card.background] = materialf.diffuseTexture;
        }
        materialf.backFaceCulling = true;
        materialf.bumpTexture = new BABYLON.Texture("../ASSETS/IMAGE/grained_uv.png", scene);//磨砂表面
        materialf.useLogarithmicDepth = true;
        materialf.freeze();
        //背面纹理
        var materialb = new BABYLON.StandardMaterial(this.name + "cardb", this.scene);//测试用卡片纹理
        if (MyGame.textures[param.card.imageb])//如果已经初始化过这种纹理，则使用已经初始化完毕的
        {
            materialb.diffuseTexture = MyGame.textures[param.card.imageb];
        }
        else {
            materialb.diffuseTexture = new BABYLON.Texture(arr_backtypes[param.card.imageb], this.scene);
            materialb.diffuseTexture.hasAlpha = false;
            MyGame.textures[param.card.imageb] = materialb.diffuseTexture;
        }
        materialb.backFaceCulling = false;
        materialb.freeze();
        //materialb.sideOrientation=BABYLON.Mesh.BACKSIDE;


        var x = this.point_x;
        var y = this.point_y;

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
        cardb.isPickable = false;
        //正面网格
        var cardf = new BABYLON.Mesh(this.name + "f", this.scene);
        this.vertexData.applyToMesh(cardf, true);
        cardf.material = materialf;
        cardf.renderingGroupId = 2;
        cardf.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        cardf.position.y -= (y - 1) / 2;//定义的顶点把左下角设为了零点，而默认的网格则是把中心点设为零点
        cardf.position.x -= (x - 1) / 2;
        cardf.isPickable = false;
        //边线用来显示选中的
        var path_line = this.make_line(this.vertexData, x, y);//这里是四个顶点，能否自动封口？改用细线+高亮辉光？？!!用可见性控制
        //this.path_line=path_line;
        //Mesh的Create方法事实上在调用MeshBuilder的对应Create方法，MeshBuilder的Create方法也可以实现对现有Mesh的变形功能
        //var line = new BABYLON.Mesh.CreateLines("line", path_line, this.scene, true);
        //为了能够调整宽度，将线改为圆柱体
        var line = BABYLON.MeshBuilder.CreateTube("line_" + this.name, {
            path: path_line,
            radius: 0.05,
            updatable: false
        }, scene);
        //边线纹理
        var materialline = new BABYLON.StandardMaterial("mat_line", this.scene);
        materialline.diffuseColor = this.linecolor;
        materialline.useLogarithmicDepth = true;
        materialline.freeze();
        line.material = materialline;
        //line.color = new BABYLON.Color3(1, 0, 0);//这个颜色表示方式各个分量在0到1之间
        line.renderingGroupId = 2;
        line.position.y -= (y - 1) / 2;
        line.position.x -= (x - 1) / 2;
        line.isVisible = false;
        //除了显示选中效果之外，还需要一种在远处表示归属的边框
        var line2 = new BABYLON.Mesh.CreateLines("line2_" + this.name, path_line, this.scene, true);
        line2.color = this.linecolor;
        line2.renderingGroupId = 2;
        line2.position.y -= (y - 1) / 2;
        line2.position.x -= (x - 1) / 2;

        this.mesh = new BABYLON.MeshBuilder.CreateBox(("card_" + this.name), {
            width: x - 1,
            height: y - 1,
            depth: 0.005
        }, this.scene);
        this.mesh.renderingGroupId = 0;//隐形元素
        this.mesh.position = param.position;
        this.mesh.rotation = param.rotation;
        this.mesh.scaling = param.scaling;
        //this.mesh.convertToUnIndexedMesh();
        //this.mesh.isVisible=false;//否则会不可点击？
        this.cardf = cardf;
        this.cardb = cardb;
        this.line = line;
        this.line2 = line2;
        this.path_line = path_line;//边界管路径
        this.arr_path_line = line.getVerticesData(BABYLON.VertexBuffer.PositionKind, false);//边界管顶点
        cardf.parent = this.mesh;
        cardb.parent = this.mesh;
        line.parent = this.mesh;
        line2.parent = this.mesh;
        this.mesh.card = this;
        //this.mesh.parent=mesh_arr_cards;//按照高内聚低耦合的规则，这个设定不应该放在角色类内部
        //暂时使用16:9的高宽设计
        var mesh_mainpic = new BABYLON.MeshBuilder.CreateGround(this.name + "mesh_mainpic", {
            width: 8.4,
            height: 9
        }, scene);
        //mesh_mainpic.convertToUnIndexedMesh();
        mesh_mainpic.parent = this.mesh;
        mesh_mainpic.position = new BABYLON.Vector3(0, 2.8, -0.01);
        var mat_mainpic = new BABYLON.StandardMaterial(this.name + "mat_mainpic", this.scene);//测试用卡片纹理
        mat_mainpic.diffuseTexture = new BABYLON.Texture(this.imagemain, this.scene);//地面的纹理贴图
        mat_mainpic.diffuseTexture.hasAlpha = false;
        mat_mainpic.backFaceCulling = true;
        mat_mainpic.useLogarithmicDepth = true;//虽然还不完全理解为什么，但是这种深度测试方式能够避免“Z-fighting”
        mat_mainpic.freeze();
        mesh_mainpic.material = mat_mainpic;
        mesh_mainpic.renderingGroupId = 2;
        mesh_mainpic.rotation.x = -Math.PI / 2;
        mesh_mainpic.isPickable = false;
        this.mesh_mainpic=mesh_mainpic;

        var mesh_comment = new BABYLON.MeshBuilder.CreateGround(this.name + "mesh_comment", {
            width: 6,
            height: 4.8
        }, scene);
        //mesh_comment.convertToUnIndexedMesh();
        mesh_comment.parent = this.mesh;
        mesh_comment.position = new BABYLON.Vector3(0, -4.6, -0.01);
        mesh_comment.renderingGroupId = 2;
        var mat_comment = new BABYLON.StandardMaterial(this.name + "mat_comment", scene);
        var texture_comment = new BABYLON.DynamicTexture(this.name + "texture_comment", {
            width: 300,
            height: 240
        }, scene);
        mat_comment.diffuseTexture = texture_comment;
        mat_comment.useLogarithmicDepth = true;
        mesh_comment.material = mat_comment;
        mesh_comment.rotation.x = -Math.PI / 2;
        mesh_comment.isPickable = false;
        var context_comment = texture_comment.getContext();
        context_comment.fillStyle = "#0000ff";
        context_comment.fillRect(1, 1, 150, 120);
        context_comment.fillStyle = "#ffffff";
        context_comment.font = "bold 32px monospace";
        newland.canvasTextAutoLine(this.str_comment, context_comment, 1, 30, 35, 34);
        texture_comment.update();
        mat_comment.freeze();
        this.mesh_comment=mesh_comment;
        //    var font = "bold 32px monospace";
        //texture_comment.drawText(this.str_comment, 75, 135, font, "green", "white", true, true);//第一个是文字颜色，第二个则是完全填充的背景色
    }//卡片外形构造
    //卡片逻辑构造
    this.skills=param.card.skills;//skill和buff都放在一起
    for(key in this.skills)
    {//想了一下，还是直接把技能字典里的信息直接赋给每个单位，这样省的以后频繁查字典
        var skill=this.skills[key];
        var skill2=arr_skilldata[key];
        for(key2 in skill2)
        {
            skill[key2]=skill2[key2];//都是直接量
        }
        if(key=="nattack")//规定不同单位的普通攻击范围不同
        {
            //skill.range=this.range;
            //skill.range2=this.range2;
        }
    }
    //卡片发生各种效果时的动画
    this.count_ani=0;

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
CardMesh.prototype.display=function()//显示所有默认可显示的部分
{
    this.mesh.isVisible=true;
    this.cardb.isVisible=true;
    this.cardf.isVisible=true;
    this.line2.isVisible=true;
    this.mesh_mainpic.isVisible=true;
    this.mesh_comment.isVisible=true;
}
CardMesh.prototype.dispose=function()//隐藏所有默认可显示的部分
{
    this.mesh.isVisible=false;
    this.cardb.isVisible=false;
    this.cardf.isVisible=false;
    this.line2.isVisible=false;
    this.mesh_mainpic.isVisible=false;
    this.mesh_comment.isVisible=false;
}
//下面计划要添加震动方法和被破坏方法
CardMesh.prototype.ani_beat=function(target,callback)//
{
    var mesh=this.mesh;
    mesh.animations=[];
    var animation=new BABYLON.Animation("animation","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var pos1=mesh.position.clone();
    var pos2=target.mesh.position.clone();
    var keys=[{frame:0,value:pos1},{frame:15,value:pos2},{frame:30,value:pos1}];
    animation.setKeys(keys);
    mesh.animations.push(animation);
    scene.beginAnimation(mesh, 0, 30, false,1,function(){
        callback();
    });
}
CardMesh.prototype.ani_fire=function(target,cursor,callback)
{//建立一个精灵对象（或者是粒子对象？），让它飞向目标
    var mesh=this.mesh;
    var sprite_bullet=new BABYLON.Sprite("sprite_bullet", cursor);//cursor是MyGame.SpriteManager
    sprite_bullet.parent=mesh.parent;
    sprite_bullet.position =mesh.position.clone();
    sprite_bullet.position.y+=2

    var animation=new BABYLON.Animation("animation","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var pos1=sprite_bullet.position.clone();
    var pos2=target.mesh.position.clone();
    var keys=[{frame:0,value:pos1},{frame:30,value:pos2}];
    animation.setKeys(keys);
    sprite_bullet.animations.push(animation);
    scene.beginAnimation(sprite_bullet, 0, 30, false,1,function(){
        sprite_bullet.dispose();
        callback();
    });
}
CardMesh.prototype.ani_floatstr=function(str,styles,callback)
{//建立一个基于canvas纹理的对象，让它飘起来然后消失
    var mesh=this.mesh;
    str+="";//前面如果传来的是数字，则取不到length！！
    var size_x=str.length*30;
    var mesh_str = new BABYLON.MeshBuilder.CreateGround(this.name + "mesh_str", {
        width: size_x/2.5,
        height: 16
    }, scene);
    //mesh_str.convertToUnIndexedMesh();
    mesh_str.parent=mesh;
    //mesh_str.position =new BABYLON.Vector3(0,0,0);
    mesh_str.renderingGroupId = 3;//这些文字是特别强调内容
    var mat_str = new BABYLON.StandardMaterial(this.name + "mat_str", scene);
    var texture_str = new BABYLON.DynamicTexture(this.name + "texture_str", {
        width: size_x,
        height: 40
    }, scene);
    mat_str.diffuseTexture = texture_str;
    mesh_str.material = mat_str;
    mesh_str.rotation.x = -Math.PI / 2;
    mesh_str.isPickable = false;
    texture_str.hasAlpha=true;
    mat_str.useAlphaFromDiffuseTexture=true;

    //经过测试发现，在Chrome中canvas的绘图是以图像的左上角定位的，而文字绘制则是以文字的左下角定位的！！！！
    var context_comment = texture_str.getContext();
    context_comment.fillStyle = "rgba(255,255,255,0)";//"transparent";
    context_comment.fillRect(0, 0, size_x, 40);
    //context_comment.fillStyle = "#ffffff";
    context_comment.fillStyle = "#ff0000";
    context_comment.font = "bold 30px monospace";
    var len=styles.length;
    for(var i=0;i<len;i++)
    {
        context_comment[styles[i][0]]=styles[i][1];
    }
    //newland.canvasTextAutoLine(str, context_comment, 1, 30, 35, 34);
    context_comment.fillText(str,0,30);
    texture_str.update();
    mat_str.freeze();
    var animation=new BABYLON.Animation("animation","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    //var pos1=mesh_str.position.clone();
    //var pos2=mesh_str.position.clone();
    //pos2.y+=2;
    var keys=[{frame:0,value:new BABYLON.Vector3(0,0,0)},{frame:30,value:new BABYLON.Vector3(0,20,0)}];
    animation.setKeys(keys);
    mesh_str.animations.push(animation);
    scene.beginAnimation(mesh_str, 0, 30, false,1,function(){
        mesh_str.dispose();
        mat_str.dispose();
        texture_str.dispose();
        callback();
    });

}
CardMesh.prototype.ani_destory=function(callback)
{//先换成灰白色图片，然后上浮
    var mesh=this.mesh;
    this.workstate="dust"

    var mat_dust = new BABYLON.StandardMaterial(this.name + "mat_dust", this.scene);//测试用卡片纹理
    mat_dust.diffuseTexture = new BABYLON.Texture(this.imagedust, this.scene);//地面的纹理贴图
    mat_dust.diffuseTexture.hasAlpha = false;
    mat_dust.backFaceCulling = true;
    mat_dust.useLogarithmicDepth = true;//虽然还不完全理解为什么，但是这种深度测试方式能够避免“Z-fighting”
    mat_dust.freeze();

    this.mesh_mainpic.material = mat_dust;

    var animation=new BABYLON.Animation("animation","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var pos1=this.mesh.position.clone();
    var pos2=this.mesh.position.clone();
    pos2.y+=2;
    var keys=[{frame:0,value:pos1},{frame:30,value:pos2}];
    animation.setKeys(keys);
    mesh.animations=[];
    mesh.animations.push(animation);
    scene.beginAnimation(mesh, 0, 30, false,1,function(){
        //把dust的card收回手牌
        noPicked(mesh.card);
        mesh.parent=null;
        mesh.parent=mesh_arr_cards;
        mesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
        mesh.rotation.y=0;
        mesh.card.num_group==999;
        mesh.card.dispose();
        callback();
    });
}
CardMesh.prototype.ani_shake=function(callback)//上下晃动一下
{
    var mesh=this.mesh;
    mesh.animations=[];
    var animation=new BABYLON.Animation("animation","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var pos1=mesh.position.clone();
    var pos2=mesh.position.clone();
    pos2.y+=0.5;
    var keys=[{frame:0,value:pos1},{frame:15,value:pos2},{frame:30,value:pos1}];
    animation.setKeys(keys);
    mesh.animations.push(animation);
    scene.beginAnimation(mesh, 0, 30, false,1,function(){
        callback();
    });
}