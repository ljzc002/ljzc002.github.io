function MakeFullUI(camera0)
{
    var node_z=new BABYLON.TransformNode("node_z",scene);
    node_z.position.z=32;
    node_z.parent=camera0;
    var node_y=new BABYLON.TransformNode("node_y",scene);
    node_y.position.z=32;
    node_y.position.y=13;
    node_y.parent=camera0;
    var node_x=new BABYLON.TransformNode("node_x",scene);
    node_x.position.z=32;
    node_x.position.x=28;
    node_x.parent=camera0;

    //绘制罗盘
    var compassz = Campass.MakeRingZ(12,36,0,0.5,node_z);
    var compassy = Campass.MakeRingY(28,36,0,1,node_y);
    var compassx = Campass.MakeRingX(12,36,0,1,node_x);

    camera0.node_z=node_z;
    camera0.node_y=node_y;
    camera0.node_x=node_x;
    camera0.compassz=compassz;
    camera0.compassy=compassy;
    camera0.compassx=compassx;

    camera0.arr_myship=[];
    camera0.arr_friendship=[];
    camera0.arr_enemyship=[];
}
/*function AddShip(camera0,type,ship)
{//渲染组3,只有z有用？？y和x都有一半显示不了
    var vec_ship=ship.position.clone().subtract(camera0.position).normalize();

    var pointerz= new BABYLON.MeshBuilder.CreateSphere("pointerz_"+ship.name,{diameter:1},scene);
    pointerz.parent=camera0.compassz.parent;
    pointerz.position=new BABYLON.Vector3(vec_ship.x,vec_ship.y,0).scale(camera0.compassz.radius);
    pointerz.renderingGroupId=3;
    ship.pointerz=pointerz;
    if(type=="my")
    {
        camera0.arr_myship.push(ship);
        pointerz.material=MyGame.materials.mat_green;
    }
    else if(type=="friend")
    {
        camera0.arr_friendship.push(ship);
        pointerz.material=MyGame.materials.mat_blue;
    }
    else if(type=="enemy")
    {
        camera0.arr_enemyship.push(ship);
        pointerz.material=MyGame.materials.mat_red;
    }
}*/