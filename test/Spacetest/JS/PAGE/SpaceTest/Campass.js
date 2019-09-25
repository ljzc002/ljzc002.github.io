//建立非通用性的罗盘，因为这不是一个可以大量实例化的类，所以不能放在CHARACTER里！！
var Campass={};
Campass.MakeRingX=function(radius,sumpoint,posx,sizec,parent){
    var lines_x=[];
    var arr_point=[];
    var radp=Math.PI*2/sumpoint;
    for(var i=0.0;i<sumpoint;i++)
    {
        var x=posx||0;
        var rad=radp*i;
        var y=radius*Math.sin(rad);
        var z=radius*Math.cos(rad);
        var pos=new BABYLON.Vector3(x,y,z)
        arr_point.push(pos);
        var pos2=pos.clone();
        pos2.x-=sizec;
        lines_x.push([pos,pos2]);
        var node=new BABYLON.Mesh("node_X"+rad,scene);
        node.parent=parent;
        node.position=pos2;
        var label = new BABYLON.GUI.Rectangle("label_X"+rad);
        label.background = "black";
        label.height = "14px";
        label.alpha = 0.5;
        label.width = "36px";
        //label.cornerRadius = 20;
        label.thickness = 0;
        //label.linkOffsetX = 30;//位置偏移量？？
        MyGame.fsUI.addControl(label);
        label.linkWithMesh(node);
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = Math.round((rad/Math.PI)*180)+"";
        text1.color = "white";
        label.addControl(text1);
        label.isVisible=true;
        label.text=text1;

    }
    arr_point.push(arr_point[0].clone());//首尾相连，不能这样相连，否则变形时会多出一个顶点！！，看来这个多出的顶点无法去掉，只能在选取时额外处理它
    lines_x.push(arr_point);
    var compassx = new BABYLON.MeshBuilder.CreateLineSystem("compassx",{lines:lines_x,updatable:false},scene);
    compassx.renderingGroupId=2;
    compassx.color=new BABYLON.Color3(0, 1, 0);
    compassx.useLogarithmicDepth = true;
    //compassx.position=node_x.position.clone();
    compassx.parent=parent;
    compassx.mainpath=arr_point;
    compassx.sumpoint=sumpoint;
    compassx.radius=radius;
    return compassx;
}

Campass.MakeRingY=function(radius,sumpoint,posy,sizec,parent){
    var lines_y=[];
    var arr_point=[];
    var radp=Math.PI*2/sumpoint;
    for(var i=0.0;i<sumpoint;i++)
    {
        var y=posy||0;
        var rad=radp*i;
        var z=radius*Math.sin(rad);
        var x=radius*Math.cos(rad);
        var pos=new BABYLON.Vector3(x,y,z)
        arr_point.push(pos);
        var pos2=pos.clone();
        pos2.y-=sizec;
        lines_y.push([pos,pos2]);
        var node=new BABYLON.Mesh("node_Y"+rad,scene);
        node.parent=parent;
        node.position=pos2;
        var label = new BABYLON.GUI.Rectangle("label_Y"+rad);
        label.background = "black";
        label.height = "14px";
        label.alpha = 0.5;
        label.width = "36px";
        //label.cornerRadius = 20;
        label.thickness = 0;
        //label.linkOffsetX = 30;//位置偏移量？？
        MyGame.fsUI.addControl(label);
        label.linkWithMesh(node);//对TransformNode使用会造成定位异常
        var text1 = new BABYLON.GUI.TextBlock();
        var num=Math.round((rad/Math.PI)*180);
        if(num>=90)
        {
            num-=90;
        }
        else
        {
            num+=270;
        }
        text1.text = num+"";
        text1.color = "white";
        label.addControl(text1);
        label.isVisible=true;
        label.text=text1;
    }
    arr_point.push(arr_point[0].clone());//首尾相连，不能这样相连，否则变形时会多出一个顶点！！，看来这个多出的顶点无法去掉，只能在选取时额外处理它
    lines_y.push(arr_point);
    var compassy = new BABYLON.MeshBuilder.CreateLineSystem("compassy",{lines:lines_y,updatable:false},scene);
    compassy.renderingGroupId=2;
    compassy.color=new BABYLON.Color3(0, 1, 0);
    compassy.useLogarithmicDepth = true;
    //compassy.position=node_y.position.clone();
    compassy.parent=parent;
    compassy.mainpath=arr_point;
    compassy.sumpoint=sumpoint;
    compassy.radius=radius;
    return compassy;
}

Campass.MakeRingZ=function(radius,sumpoint,posz,sizec,parent){
    var lines_z=[];
    var arr_point=[];
    var radp=Math.PI*2/sumpoint;
    parent.arr_node=[];
    for(var i=0.0;i<sumpoint;i++)
    {
        var z=posz||0;
        var rad=radp*i;
        var x=radius*Math.sin(rad);
        var y=radius*Math.cos(rad);
        var pos=new BABYLON.Vector3(x,y,z);
        arr_point.push(pos);
        var pos2=pos.clone();
        pos2.normalizeFromLength(radius/(radius-sizec));//里面的数字表示坐标值除以几
        lines_z.push([pos,pos2]);
        var node=new BABYLON.Mesh("node_Z"+rad,scene);
        node.parent=parent;
        node.position=pos2;
        parent.arr_node.push(node);
        var label = new BABYLON.GUI.Rectangle("label_Z"+rad);
        label.background = "black";
        label.height = "14px";
        label.alpha = 0.5;
        label.width = "36px";
        //label.cornerRadius = 20;
        label.thickness = 0;
        label.rotation=rad;
        label.startrot=rad;
        //label.linkOffsetX = 30;//位置偏移量？？
        MyGame.fsUI.addControl(label);
        label.linkWithMesh(node);
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = Math.round((rad/Math.PI)*180)+"";//不显式转换会报错
        text1.color = "white";
        label.addControl(text1);
        label.isVisible=true;
        label.text=text1;
        node.label=label;
    }
    arr_point.push(arr_point[0].clone());//首尾相连，不能这样相连，否则变形时会多出一个顶点！！，看来这个多出的顶点无法去掉，只能在选取时额外处理它
    lines_z.push(arr_point);
    var compassz = new BABYLON.MeshBuilder.CreateLineSystem("compassz",{lines:lines_z,updatable:false},scene);
    compassz.renderingGroupId=2;
    compassz.color=new BABYLON.Color3(0, 1, 0);
    compassz.useLogarithmicDepth = true;
    compassz.parent=parent;
    compassz.mainpath=arr_point;
    compassz.sumpoint=sumpoint;
    compassz.radius=radius;
    return compassz;
}
Campass.AddShip=function(camera0,type,ship)
{
    //渲染组3,只有z有用？？y和x都有一半显示不了
    var vec_ship=ship.position.clone().subtract(camera0.position);
    vec_ship=newland.VecTo2Local(vec_ship,camera0);
    var pointerz= new BABYLON.MeshBuilder.CreateSphere("pointerz_"+ship.name,{diameter:1},scene);
    pointerz.parent=camera0.compassz.parent;
    pointerz.position=new BABYLON.Vector3(vec_ship.x,vec_ship.y,0).normalize().scale(camera0.compassz.radius);
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
}
Campass.ComputePointerPos=function(ship)
{
    var camera0=MyGame.Cameras.camera0;
    var pointerz=ship.pointerz;
    var vec_ship=ship.position.clone().subtract(camera0.position);
    vec_ship=newland.VecTo2Local(vec_ship,camera0);
    pointerz.position=(new BABYLON.Vector3(vec_ship.x,vec_ship.y,0)).normalize().scale(camera0.compassz.radius);

}