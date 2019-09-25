//工质发动机
Rocket=function()
{

}
Rocket.prototype.init=function(param)
{
    param = param || {};
    this.name=param.name;
    this.mesh=param.mesh;//也可能只是instance
    this.mass=param.mass;
    //this.specifiedpower=param.specifiedpower;//额定推力
    //this.specifiedcost=param.specifiedcost;//额定能耗
    this.cost2power=param.cost2power;//供能转换为推力的公式
    this.cost2demage=param.cost2demage;//供能对引擎造成损坏的公式，其中包括对故障率的影响
    this.hp=param.hp;
    this.cost=null;//当前供能
    this.power=null;//当前推力
    this.failurerate=param.failurerate;//当前故障率


    this.scaling=param.scaling||1;

    this.rotxl=param.rotxl;//引擎在x轴上的摆动范围
    this.rotyl=param.rotyl;
    this.rotzl=param.rotzl;

    this.firescaling=param.firescaling||(new BABYLON.Vector3(1,1,1));//喷射火焰尺寸
    this.firepos=param.firepos||(new BABYLON.Vector3(0,0,0));
    this.firerot=param.firerot||(new BABYLON.Vector3(0,0,Math.PI))
}
Rocket.prototype.fire=function(param)
{
    /*var light2 = new BABYLON.PointLight("lightrocket_"+this.name, new BABYLON.Vector3(0, 10, 0), scene);
    light2.diffuse = new BABYLON.Color3(1.0, 0.5, 0.0);
    light2.parent = this.mesh;
    light2.position=this.firepos

    var keys = [];
    var previous = null;
    for (var i = 0; i < 20; i++) {
        var rand = BABYLON.Scalar.Clamp(Math.random(), 0.5, 1.0);

        if (previous) {
            if (Math.abs(rand - previous) < 0.1) {
                continue;
            }
        }

        previous = rand;

        keys.push({
            frame: i,
            value: rand
        });
    }

    var anim = new BABYLON.Animation("anim_"+this.name, "intensity", 1, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    anim.setKeys(keys);

    light2.animations.push(anim);
    scene.beginAnimation(light2, 0, keys.length, true, 8);*/
    var fireMaterial=null;
    if(!MyGame||!MyGame.materials.mat_fire)//考虑到单独测试时可能没有MyGame对象
    {
        //火焰材质需要自定义三张纹理图片来生成定制的火焰
        /*fireMaterial = new BABYLON.FireMaterial("fire", scene);
        fireMaterial.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/TEXTURES/fire/diffuse.png", scene);
        fireMaterial.distortionTexture = new BABYLON.Texture("../../ASSETS/IMAGE/TEXTURES/fire/distortion.png", scene);
        fireMaterial.opacityTexture = new BABYLON.Texture("../../ASSETS/IMAGE/TEXTURES/fire/opacity2.png", scene);
        fireMaterial.opacityTexture.level = 0.5;
        fireMaterial.speed = 5.0;
        fireMaterial.needDepthPrePass = true;
        fireMaterial.forceDepthWrite= true;*/
        //火焰纹理使用起来更加简单，但无法实现相对效应和转弯形变
        var fireMaterial = new BABYLON.StandardMaterial("texture4", scene);
        var fireTexture = new BABYLON.FireProceduralTexture("fire", 256, scene);
        fireMaterial.diffuseTexture = fireTexture;
        //->尝试改用粒子系统，

        if(MyGame)
        {
            MyGame.materials.mat_fire=fireMaterial
        }

    }
    else if(MyGame.materials.mat_fire)
    {
        fireMaterial=MyGame.materials.mat_fire
    }

    /*var plane = BABYLON.Mesh.CreatePlane("firePlane_"+this.name, 1.5, scene);
    plane.position = this.firepos;
    plane.scaling= this.firescaling;
    plane.rotation=this.firerot;
    plane.parent=this.mesh;
    //plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;//这会阻碍parent的姿态传递！！！！
    plane.material = fireMaterial;
    plane.renderingGroupId = 2;
    this.fire=plane;*/

    var mesh_fire=new BABYLON.MeshBuilder.CreateCylinder("mesh_fire_"+this.name
        ,{height:1,diameterTop:0.1,diameterBottom :1},scene);
    mesh_fire.renderingGroupId = 2;
    mesh_fire.position = this.firepos;
    mesh_fire.scaling= this.firescaling;
    mesh_fire.rotation=this.firerot;
    mesh_fire.parent=this.mesh;
    mesh_fire.material = fireMaterial;
    this.fire=mesh_fire;
}