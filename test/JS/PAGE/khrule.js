/**
 * Created by lz on 2019/3/19.
 */
function initObjbyWs()
{
    //初始化其他用户,每个用户都是一个ballman，需要在数据库中存储相应的初始化参数，在用户初次登录时在数据库中保存
    var arr_webplayers=MyGame.arr_webplayers;
    for(key in arr_webplayers)
    {

    }
    //初始化world里的所有单位
    var arr_units=MyGame.arr_units;
    var len=arr_units.length;
    for(var i=0;i<len;i++)
    {

    }
}
var arr_balls={};//考虑到需要选择性的删除其中的元素，使用对象形式比数组形式更好！！！！
var count_balls=0;
function ThrowSomeBall()
{
    //var mesh_ball=new BABYLON.MeshBuilder.CreateSphere("mesh_ball"+count_balls,{size:1},scene);
    var mesh_ball=new BABYLON.MeshBuilder.CreateBox("mesh_ball"+count_balls,{size:1},scene);
    count_balls++;
    mesh_ball.timeRemain=20000;//发射出的小球只保留10s
    var mat_rendom = new BABYLON.StandardMaterial("mat_rendom"+count_balls, this.scene);
    mat_rendom.diffuseColor = new BABYLON.Color3(Math.random(),Math.random(),Math.random());
    mesh_ball.material=mat_rendom;
    //使用Box仿真器时经常发生穿过事件
    mesh_ball.physicsImpostor = new BABYLON.PhysicsImpostor(mesh_ball, BABYLON.PhysicsImpostor.BoxImpostor
        , { mass: 1, restitution: 0.5 ,friction:0.9,move:true}, scene);
    //从ballman的手部发出
    mesh_ball.position=newland.vecToGlobal(MyGame.player.mesh.ballman.handpoint.position.clone(),MyGame.player.mesh);
    mesh_ball.renderingGroupId=2;
    arr_balls[mesh_ball.name]=mesh_ball;
    //使用射线，设定球的初始运动方式，射线是pickinginfo 的更普遍的运用方式
    var forward = new BABYLON.Vector3(0,0,1);
    forward = newland.vecToGlobal(forward, MyGame.player.mesh);
    var direction = forward.subtract(MyGame.player.mesh.position);
    direction = BABYLON.Vector3.Normalize(direction).scale(100);
    var direction2=BABYLON.Vector3.Normalize(forward).scale(100);
    mesh_ball.physicsImpostor.setLinearVelocity(direction);
    console.log(mesh_ball.name+":"+mesh_ball.physicsImpostor.getLinearVelocity().x+","
        +mesh_ball.physicsImpostor.getLinearVelocity().y+","+mesh_ball.physicsImpostor.getLinearVelocity().z);

}
