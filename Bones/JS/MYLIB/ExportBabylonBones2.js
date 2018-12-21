/**
 * Created by lz on 2018/4/18.
 */
var obj_scene;
var skeleton;
var mesh_test;
function InitMesh()
{
    obj_scene=
    {
        'autoClear': true,
        'clearColor': [0,0,0],
        'ambientColor': [0,0,0],
        'gravity': [0,-9.81,0],
        'cameras':[],
        'activeCamera': null,
        'lights':[],
        'materials':[/*{
            'name': 'mat_frame',
            'id': 'mat_frame',
            'ambient': [1,1,1],
            'diffuse': [1,1,1],
            'specular': [1,1,1],
            'specularPower': 50,
            'emissive': [0,0,0],
            'alpha': 1,
            'backFaceCulling': true,
            'diffuseTexture': { },
            'wireframe':true
        }*/],
        'geometries': {},
        'meshes': [],
        'multiMaterials': [],
        'shadowGenerators': [],
        'skeletons': [{id:0,name:"mixamorig:Skin",bones:[{
            'animation':{
                dataType:3,
                framePerSecond:30,
                keys:[{
                    frame:0,
                    values:BABYLON.Matrix.Identity().toArray()
                },{
                    frame:120,
                    values:BABYLON.Matrix.Identity().toArray()
                },{
                    frame:240,
                    values:BABYLON.Matrix.Identity().toArray()
                }],
                loopBehavior:1,
                name:'_bone'+0+'Animation',
                property:'_matrix'
            },
            'index':0,
            'matrix':BABYLON.Matrix.Identity().toArray(),
            'name':'_bone'+0,
            'parentBoneIndex':-1
        }],ranges:[],needInitialSkinMatrix:false}],
        'sounds': [],
        'metadata':{'walkabilityMatrix':[]}

    };

}
function ExportMesh(arr_mesh,flag)
{

    var len=arr_mesh.length;
    obj_scene.meshes=[];
    //推入每一个网格
    for(var i=0;i<len;i++)
    {
        var obj_mesh={};
        var mesh=arr_mesh[i];

        obj_mesh.name=mesh.name;
        obj_mesh.id=mesh.id;
        //obj_mesh.materialId='mat_frame';
        obj_mesh.position=[mesh.position.x,mesh.position.y,mesh.position.z];
        obj_mesh.rotation=[mesh.rotation.x,mesh.rotation.y,mesh.rotation.z];
        obj_mesh.scaling=[mesh.scaling.x,mesh.scaling.y,mesh.scaling.z];
        obj_mesh.isVisible=true;
        obj_mesh.isEnabled=true;
        obj_mesh.checkCollisions=false;
        obj_mesh.billboardMode=0;
        obj_mesh.receiveShadows=true;
        if(mesh.geometry)//是有实体的网格
        {
            var vb=mesh.geometry._vertexBuffers;
            obj_mesh.positions=vb.position._buffer._data;
            obj_mesh.normals=vb.normal._buffer._data;
            obj_mesh.uvs= vb.uv._buffer._data;
            obj_mesh.indices=mesh.geometry._indices;
            obj_mesh.subMeshes=[{
                'materialIndex': 0,
                'verticesStart': 0,
                'verticesCount': vb.position._buffer._data.length,
                'indexStart': 0,
                'indexCount': mesh.geometry._indices.length
            }];
            obj_mesh.matricesIndices=mesh.matricesIndices;
            obj_mesh.matricesWeights=mesh.matricesWeights;
            obj_mesh.metadata={'rate_depart':0.5};
            obj_mesh.parentId=mesh.parent?mesh.parent.id:null;
            obj_mesh.skeletonId=0;

        }
        else
        {
            obj_mesh.positions=[];
            obj_mesh.normals=[];
            obj_mesh.uvs=[];
            obj_mesh.indices=[];
            obj_mesh.subMeshes=[{
                'materialIndex': 0,
                'verticesStart': 0,
                'verticesCount': 0,
                'indexStart': 0,
                'indexCount': 0
            }];
            obj_mesh.matricesIndices=[];
            obj_mesh.matricesWeights=[];
            obj_mesh.metadata={'rate_depart':0};
            obj_mesh.parentId=null;
            obj_mesh.skeletonId=-1;
        }
        obj_scene.meshes.push(obj_mesh);
        //只考虑勾选了复选框的flex对应的bone-》因为骨骼涉及到严格的父子继承，不能贸然的删除节点！！！！
        /*var len=arr_bone.length;
        var arr_flex=document.querySelectorAll("#div_flexcontainer .checkbone");
        for(var j=1;j<len;j++)
        {
            if(arr_flex[j-1].checked==true)
            {
                obj_scene.skeletons[0].bones.push(arr_bone[j]);
            }
        }*/
        //=obj_scene.skeletons[0].bones.concat(mesh.bones);
    }
    var str_data=JSON.stringify(obj_scene);
    if(flag==1)//点击导出按钮
    {
        DownloadText(MakeDateStr()+"testscene",str_data,".babylon");
    }
    else if(flag==0)//点击现场演示按钮
    {
        BABYLON.SceneLoader.ImportMesh("", "", "data:"+str_data, scene
            , function (newMeshes, particleSystems, skeletons) {//载入完成的回调函数
                if(mesh_test)
                {
                    mesh_test.dispose();
                }
                mesh_test=newMeshes[0];
                mesh_test.position.x=20;
                //var totalFrame=skeletons[0]._scene._activeSkeletons.data.length;
                skeleton=skeletons[0];
                scene.beginAnimation(skeleton, 0, 240, true, 0.5);//缺失了中间的部分！！没有自动插值！！！！

            });
    }
}
//重复一个小数组若干次，用来形成巨型数组
function repeatArr(arr,times)
{
    var arr_result=[];
    for(var i=0;i<times;i++)
    {
        arr_result=arr_result.concat(arr.concat());
    }
    return arr_result;
}

