/**
 * Created by Administrator on 2017/5/11.
 */
function Export_mesh()//用Babylon格式导出模型
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    if(mesh_hold)//必须放下物体之后才能导出！！
    {
        return;
    }
    //场景对象
    var obj_scene=
    {
        'autoClear': true,
        'clearColor': [0,0,0],
        'ambientColor': [0,0,0],
        'gravity': [0,-9.81,0],
        'cameras': [{
            'name': 'Camera',
            'id': 'Camera',
            'position': [7.4811,5.3437,-6.5076],
            'target': [-0.3174,0.8953,0.3125],
            'fov': 0.8576,
            'minZ': 0.1,
            'maxZ': 100,
            'speed': 1,
            'inertia': 0.9,
            'checkCollisions': false,
            'applyGravity': false,
            'ellipsoid': [0.2,0.9,0.2]
        }],
        'activeCamera': 'Camera',
        'lights': [{
            'name': 'Sun',
            'id': 'Sun',
            'type': 1,
            'position': [0.926,7.3608,14.1829],
            'direction': [-0.347,-0.4916,-0.7987],
            'intensity': 1,
            'diffuse': [1,1,1],
            'specular': [1,1,1]
        }],
        'materials':[{
                'name': 'mball',
                'id': 'mball',
                'ambient': [1,1,1],
                'diffuse': [1,1,1],
                'specular': [1,1,1],
                'specularPower': 50,
                'emissive': [0,0,0],
                'alpha': 1,
                'backFaceCulling': true,
                'diffuseTexture': {
                    'name': PngName?PngName:'snow2.jpg',
                    'level': 1,
                    'hasAlpha': 1,
                    'coordinatesMode': 0,
                    'uOffset': 0,
                    'vOffset': 0,
                    'uScale': 1,
                    'vScale': 1,
                    'uAng': 0,
                    'vAng': 0,
                    'wAng': 0,
                    'wrapU': true,
                    'wrapV': true,
                    'coordinatesIndex': 0
                }
            }],
        'geometries': {},
        'meshes': [],
        'multiMaterials': [],
        'shadowGenerators': [],
        'skeletons': [],
        'sounds': []
    };
    //所有模型组件的父物体
    var obj_allbase=
    {
        'name': 'allbase',
        'id': 'allbase',
        'materialId': 'mball',
        'position': [0,0,0],
        'rotation': [0,0,0],
        'scaling': [1,1,1],
        'isVisible': true,
        'isEnabled': true,
        'checkCollisions': false,
        'billboardMode': 0,
        'receiveShadows': true,
        'positions': [],
        'normals': [],
        'uvs': [],
        'indices': [],
        'subMeshes': [{
            'materialIndex': 0,
            'verticesStart': 0,
            'verticesCount': 0,
            'indexStart': 0,
            'indexCount': 0
        }]
    };
    obj_scene.meshes.push(obj_allbase);
    var len=mesh_allbase._children.length;
    var all_x=0;
    var all_y=0;
    var all_z=0;
    for(var i=0;i<len;i++)
    {
        var obj_child={};
        if(mesh_allbase._children[i].geometry._vertexBuffers!=null)
        {
            var child=mesh_allbase._children[i];
            //精简掉重复的顶点数据
            /*var positions=BuffertoArray(child.geometry._vertexBuffers.position._buffer._data,3);
            var normals=BuffertoArray(child.geometry._vertexBuffers.normal._buffer._data,3);
            var uvs=BuffertoArray(child.geometry._vertexBuffers.uv._buffer._data,2);
            var indices=child.geometry._indices;
            var len2=positions.length;//原数据的长度
            var len3=indices.length;//索引的长度
            var positions2=positions.concat();
            var normals2=normals.concat();
            var uvs2=uvs.concat();
            //var indices2=indices.concat();
            var len4=len2;//缩短后的数据的长度
            var count=0;
            //考虑到优先显示后绘制的，要从后向前遍历每一个元素，但是考虑到索引数组又要从前向后遍历！！！！
            console.log("精简前的顶点有"+len2+"个");
            for(var j=0;j<len4-1;j++)
            {
                for(var k=j+1;k<=len4-1;k++)//和前面的每一个元素对比
                {
                    if(equ(positions2[j],positions2[k])&&equ(normals2[j],normals2[k])&&equ(uvs2[j],uvs2[k]))//顶点的相关数据完全相同
                    {
                        positions2.splice(k,1);
                        normals2.splice(k,1);
                        uvs2.splice(k,1);
                        len4--;
                        k--;
                        count++;
                    }
                }
            }
            console.log("精简掉了"+count+"个");
            //变换索引数组
            for(var j=0;j<len3;j++)
            {
                for(var k=0;k<len4;k++)
                {
                    if(equ(positions[indices[j]],positions2[k])&&equ(normals[indices[j]],normals2[k])&&equ(uvs[indices[j]],uvs2[k]))//顶点的相关数据完全相同
                    {
                        indices[j]=k;
                    }
                }
            }
            //精简索引数组
            count=0;
            var indices2=BuffertoArray(indices,3);
            var len5=indices2.length;
            console.log("精简前的三角形有"+len5+"个");
            for(var j=0;j<len5;j++)
            {
                for(var k=j+1;k<len5;k++)
                {
                    if(equ(indices2[j],indices2[k]))
                    {
                        indices2.splice(k,1);
                        k--;
                        len5--;
                        count++;
                    }
                }
            }
            console.log("精简掉了"+count+"个");
            indices=ArraytoBuffer(indices2);
            positions2=ArraytoBuffer(positions2);
            normals2=ArraytoBuffer(normals2);
            uvs2=ArraytoBuffer(uvs2);*/
            var vb=child.geometry._vertexBuffers;
            all_x+=child.position.x;
            all_y+=child.position.y;
            all_z+=child.position.z;
            obj_child=
            {
                'name': child.name,
                'id': child.id,
                'parentID': 'allbase',
                'materialId': 'mball',
                'position': [child.position.x,child.position.y,child.position.z],
                'rotation': [child.rotation.x,child.rotation.y,child.rotation.z],
                'scaling': [child.scaling.x,child.scaling.y,child.scaling.z],
                'isVisible': true,
                'isEnabled': true,
                'checkCollisions': false,
                'billboardMode': 0,
                'receiveShadows': true,
                'positions': vb.position._buffer._data,
                'normals': vb.normal._buffer._data,
                'uvs': vb.uv._buffer._data,
                'indices': child.geometry._indices,
                'subMeshes': [{
                    'materialIndex': 0,
                    'verticesStart': 0,
                    'verticesCount': vb.position._buffer._data.length,
                    'indexStart': 0,
                    'indexCount': child.geometry._indices.length
                }]
            };
            obj_scene.meshes.push(obj_child);
        }
    }
    //obj_scene.meshes[0].position=[all_x/len,all_y/len,all_z/len];
    //不能让模型的主体过于偏离模型的中心
    all_x=all_x/len;
    all_y=all_y/len;
    all_z=all_z/len;
    for(var i=1;i<len+1;i++)
    {
        obj_scene.meshes[i].position[0]-=all_x;
        obj_scene.meshes[i].position[1]-=all_y;
        obj_scene.meshes[i].position[2]-=all_z;
    }
    var str_data=JSON.stringify(obj_scene);
    DownloadText(MakeDateStr()+"testscene",str_data,".babylon");
}
//在场景中放置网格
function AddMesh(conbineType,meshType)
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    flag.conbineType=conbineType;//设置融合模式
    var cmesh=arr_choosemesh[meshType];
    var newmesh={};

    switch(cmesh[0])
    {
        case "code":
        {
            var str="cmesh"+scene.meshes.length;
            newmesh=eval(cmesh[1]+str+cmesh[2]);
            newmesh.parent=mesh_allbase;
            newmesh.position=current_player.handpoint.absolutePosition.clone();
            newmesh.renderingGroupId=2;
            //arr_mesh.push(newmesh);
            arr_mesh[str]=newmesh;
            mesh_hold=newmesh;
            mesh_hold.material=mat_frame;
            mesh_cross.parent=mesh_hold;
            mesh_cross.scaling.x=1/mesh_hold.scaling.x;
            mesh_cross.scaling.y=1/mesh_hold.scaling.y;
            mesh_cross.scaling.z=1/mesh_hold.scaling.z;
            //推入历史数组
            var obj=[WhoAmI,"AddMesh",str,cmesh];
            PushHistory(obj);
            break;
        }
        case "babylon":
        {
            //var str="cmesh"+scene.meshes.length;
            BABYLON.SceneLoader.ImportMesh(cmesh[1], cmesh[2], cmesh[3], scene, function (newMeshes, particleSystems, skeletons)
            {
                //在cmesh[1]处如果特指了某一个mesh加载，那么只有这一个mesh会进入newMeshes[]里面，如果不指定则会默认加载所有的mesh！！！！
                if(newMeshes.length==1)
                {

                }
                newmesh = newMeshes[0];
                //newmesh.parent=mesh_allbase;
                newmesh.position=current_player.handpoint.absolutePosition.clone();
                newmesh.renderingGroupId=2;
                var len=newMeshes.length;
                for(var i=1;i<len;i++)
                {
                    var mesh=newMeshes[i];
                    mesh.parent=newmesh;//约定只有第一个mesh是父网格
                    mesh.renderingGroupId=2;
                    mesh.material=mat_frame;
                }
                //arr_mesh.push(newmesh);
                arr_mesh[newmesh.name]=newmesh;
                mesh_hold=newmesh;
                mesh_hold.material=mat_frame;
                mesh_cross.parent=mesh_hold;
                mesh_cross.scaling.x=1/mesh_hold.scaling.x;
                mesh_cross.scaling.y=1/mesh_hold.scaling.y;
                mesh_cross.scaling.z=1/mesh_hold.scaling.z;
                //推入历史数组
                var obj=[WhoAmI,"AddMesh",newmesh.name,cmesh];
                PushHistory(obj);
                /*if(skeletons[0])
                 {
                 var totalFrame = skeletons[0]._scene._activeSkeletons.data.length;//总帧数
                 var start = 0;
                 var end = 50;
                 var VitesseAnim = parseFloat(1 / 100);//动画的速度比，慢速
                 scene.beginAnimation(newMeshes[1].skeleton, (100 * start) / totalFrame, (100 * end) / totalFrame, true, VitesseAnim);
                 }*/
                console.log("模型载入成功");
            });
            break;
        }
    }
    //接下来要给物体加上自适应大小的坐标轴！！！！或者是第三组渲染的坐标轴？？

}
//可以加载的网格的列表
var arr_choosemesh=
    [
        ["code","BABYLON.MeshBuilder.CreateBox('","',{size:1},scene)"]
        ,["code","BABYLON.MeshBuilder.CreateSphere('","',{segments:10,diameter:1},scene);"]
        ,["babylon","", "../MODEL/allbase/", "2017512_8_13_30testscene.babylon"]
        ,["babylon","Cube", "../MODEL/octocat/", "octocat.babylon"]
        ,["babylon","Cube", "../MODEL/test3/", "test3.babylon"]
    ];
function Export_png()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    if(context_tryangle)
    {
        PngName=MakeDateStr()+"pic";
        DownloadText(PngName,$("#div_choose canvas")[0].toDataURL("image/png"),".png");
        PngName+=".png";
    }

}