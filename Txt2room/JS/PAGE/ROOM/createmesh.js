var size_per_u=3;
var size_per_v=3;
var positions=[];
var uvs=[];
var normals=[];
var indices=[];
function initMeshClass()
{//plan的基础状态是一个位于原点，面向z轴负方向的平面
    add_plan2({x:-4.5,y:4.5,z:0},{x:1.5,y:4.5,z:0},{x:1.5,y:1.5,z:0},{x:-4.5,y:1.5,z:0},0);
    add_plan2({x:1.5,y:4.5,z:0},{x:4.5,y:4.5,z:0},{x:4.5,y:-1.5,z:0},{x:1.5,y:-1.5,z:0},4,6/size_per_u);
    add_plan2({x:-1.5,y:-1.5,z:0},{x:4.5,y:-1.5,z:0},{x:4.5,y:-4.5,z:0},{x:-1.5,y:-4.5,z:0},8,3/size_per_u,6/size_per_v);
    add_plan2({x:-4.5,y:1.5,z:0},{x:-1.5,y:1.5,z:0},{x:-1.5,y:-4.5,z:0},{x:-4.5,y:-4.5,z:0},12,0,3/size_per_v);
    var mesh=vertexData2Mesh(positions, indices, normals, uvs,"class_hole",mat_grass);
    mesh.setEnabled(false);//令源网格不显示
    // 很奇怪如果不对长通道设置mesh.setEnabled(false);则实例无法正常显示，但其他类的实例则没有这种问题。
    //mesh.setEnabled(true);//默认就是这个
    obj_meshclass["hole"]=mesh;

    positions=[];//新建式清空，理论上不影响引用的数据
    uvs=[];
    normals=[];
    indices=[];
    add_plan2({x:-4.5,y:4.5,z:0},{x:4.5,y:4.5,z:0},{x:4.5,y:-4.5,z:0},{x:-4.5,y:-4.5,z:0},0);
    var mesh=vertexData2Mesh(positions, indices, normals, uvs,"class_wall",mat_grass);
    mesh.setEnabled(false);
    obj_meshclass["wall"]=mesh;

    positions=[];
    uvs=[];
    normals=[];
    indices=[];
    add_plan2({x:-1.5,y:1.5,z:0},{x:1.5,y:1.5,z:0},{x:1.5,y:-1.5,z:0},{x:-1.5,y:-1.5,z:0},0);
    var mesh=vertexData2Mesh(positions, indices, normals, uvs,"class_smallwall",mat_grass);
    mesh.setEnabled(false);
    obj_meshclass["smallwall"]=mesh;

    positions=[];
    uvs=[];
    normals=[];
    indices=[];
    add_plan2({x:-1.5,y:1.5,z:-4.5},{x:-1.5,y:1.5,z:4.5},{x:1.5,y:1.5,z:4.5},{x:1.5,y:1.5,z:-4.5},0);
    add_plan2({x:1.5,y:1.5,z:-4.5},{x:1.5,y:1.5,z:4.5},{x:1.5,y:-1.5,z:4.5},{x:1.5,y:-1.5,z:-4.5},4);
    add_plan2({x:1.5,y:-1.5,z:-4.5},{x:1.5,y:-1.5,z:4.5},{x:-1.5,y:-1.5,z:4.5},{x:-1.5,y:-1.5,z:-4.5},8);
    add_plan2({x:-1.5,y:-1.5,z:-4.5},{x:-1.5,y:-1.5,z:4.5},{x:-1.5,y:1.5,z:4.5},{x:-1.5,y:1.5,z:-4.5},12);
    var mesh=vertexData2Mesh(positions, indices, normals, uvs,"class_channel",mat_frame);
    //mesh.setEnabled(false);
    // 很奇怪如果不对长通道设置mesh.setEnabled(false);则实例无法正常显示，但其他类的实例则没有这种问题。
    mesh.setEnabled(false);
    obj_meshclass["channel"]=mesh;

    positions=[];
    uvs=[];
    normals=[];
    indices=[];
    add_plan2({x:-1.5,y:1.5,z:1.5},{x:-1.5,y:1.5,z:4.5},{x:1.5,y:1.5,z:4.5},{x:1.5,y:1.5,z:1.5},0);
    add_plan2({x:1.5,y:1.5,z:1.5},{x:1.5,y:1.5,z:4.5},{x:1.5,y:-1.5,z:4.5},{x:1.5,y:-1.5,z:1.5},4);
    add_plan2({x:1.5,y:-1.5,z:1.5},{x:1.5,y:-1.5,z:4.5},{x:-1.5,y:-1.5,z:4.5},{x:-1.5,y:-1.5,z:1.5},8);
    add_plan2({x:-1.5,y:-1.5,z:1.5},{x:-1.5,y:-1.5,z:4.5},{x:-1.5,y:1.5,z:4.5},{x:-1.5,y:1.5,z:1.5},12);
    var mesh=vertexData2Mesh(positions, indices, normals, uvs,"class_shortchannel",mat_grass);
    mesh.setEnabled(false);
    obj_meshclass["shortchannel"]=mesh;
}
function vertexData2Mesh(positions, indices, normals, uvs,name,material)
{
    var vertexData= new BABYLON.VertexData();
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);//计算法线
    BABYLON.VertexData._ComputeSides(0, positions, indices, normals, uvs);
    vertexData.indices = indices.concat();//索引
    vertexData.positions = positions.concat();
    vertexData.normals = normals.concat();//position改变法线也要改变！！！！
    vertexData.uvs = uvs.concat();
    var mesh=new BABYLON.Mesh(name,scene);
    vertexData.applyToMesh(mesh, true);
    mesh.vertexData=vertexData;
    mesh.material=material;
    mesh.renderingGroupId=2;
    return mesh;
}
//平面四个顶点的坐标（从左上角开始顺时针排列），第一个顶点的插入索引，uv纹理的坐标的偏移量
function add_plan2(v1,v2,v3,v4,index,offsetu,offsetv)
{
    positions.push(v1.x);
    positions.push(v1.y);
    positions.push(v1.z);
    positions.push(v2.x);
    positions.push(v2.y);
    positions.push(v2.z);
    positions.push(v3.x);
    positions.push(v3.y);
    positions.push(v3.z);
    positions.push(v4.x);
    positions.push(v4.y);
    positions.push(v4.z);
    //使用和Babylon.js相同的顶点顺序
    indices.push(index+3);
    indices.push(index+2);
    indices.push(index);
    indices.push(index+1);
    indices.push(index);
    indices.push(index+2);
    //根据顶点位置计算平整纹理坐标
    //1234对应abcd
    var vab=v3subtract(v2,v1);
    var lab=v3length(vab);
    var vac=v3subtract(v3,v1);
    var lac=v3length(vac);
    var vad=v3subtract(v4,v1);
    var lad=v3length(vad);

    var BAC=Math.acos((vab.x*vac.x+vab.y*vac.y+vab.z*vac.z)/(lab*lac));
    var BAD=Math.acos((vab.x*vad.x+vab.y*vad.y+vab.z*vad.z)/(lab*lad));
    if(!offsetu)
    {
        offsetu=0;
    }
    if(!offsetv)
    {
        offsetv=0;
    }
    uvs.push(offsetu);
    uvs.push(offsetv);
    uvs.push(offsetu+lab/size_per_u);
    uvs.push(offsetv);
    uvs.push(offsetu+(lac*Math.cos(BAC)/size_per_u));
    uvs.push(offsetv+(lac*Math.sin(BAC)/size_per_v));
    uvs.push(offsetu+(lad*Math.cos(BAD)/size_per_u));
    uvs.push(offsetv+(lad*Math.sin(BAD)/size_per_v));
}
function v3subtract(v1,v2)
{
    return {x:(v1.x-v2.x),y:(v1.y-v2.y),z:(v1.z-v2.z)}
}
function v3length(v)
{
    return Math.pow(v.x*v.x+v.y*v.y+v.z*v.z,0.5)
}
