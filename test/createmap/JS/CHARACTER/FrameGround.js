//在这里存放和改进的地形网格相关的方法，需要MyGame对象
//import * as MyGame from "../LIB/cannon";

FrameGround=function()//非继承，也许会有多个
{

}
FrameGround.CreateGroundMaterial=function(name,url,segs_x,segs_z)
{
    var mat = new BABYLON.StandardMaterial(name, scene);//1
    mat.diffuseTexture = new BABYLON.Texture(url, scene);
    mat.diffuseTexture.uScale = segs_x+1;//纹理重复效果
    mat.diffuseTexture.vScale = segs_z+1;
    mat.backFaceCulling=false;
    //mat.useLogarithmicDepth = true;
    mat.freeze();
    return mat;
}
FrameGround.CreateGroundMaterial0=function(name,url,segs_x,segs_z)
{
    var mat;
    if(MyGame)
    {
        if(MyGame.materials.name)
        {
            mat=MyGame.materials.name;

        }
        else
        {
            mat=FrameGround.CreateGroundMaterial(name,url,segs_x,segs_z);
            MyGame.materials.name=mat;
        }
    }
    else
    {
        mat=FrameGround.CreateGroundMaterial(name,url,segs_x,segs_z);
    }
    return mat;
}
FrameGround.prototype.init=function(param)
{
    param = param || {};
    this.segs_x=param.segs_x||100;//横向格子数量
    this.segs_z=param.segs_z||100;//横向格子数量
    this.size_per_x=param.size_per_x||1;//每个格子的尺寸
    this.size_per_z=param.size_per_z||1;
    this.name=param.name;
    //this.obj_plane={};//用五个动态纹理牌子显示，其所在位置的坐标
    //this.obj_ground={};
    //this.obj_wet={};//用来保存被淋湿的顶点索引
    //this.mesh_DropFrom=null;
    this.obj_mat={};//用来保存基础材质
    var segs_x=this.segs_x;
    var segs_z=this.segs_z;
    var size_per_x=this.size_per_x;
    var size_per_z=this.size_per_z;

    var mat_grass=FrameGround.CreateGroundMaterial0("mat_grass","../../ASSETS/IMAGE/LANDTYPE/grass.jpg",segs_x,segs_z);
    this.obj_mat.mat_grass=mat_grass;
    var mat_tree=FrameGround.CreateGroundMaterial0("mat_tree","../../ASSETS/IMAGE/LANDTYPE/yulin.png",segs_x,segs_z);
    this.obj_mat.mat_tree=mat_tree;
    var mat_shallowwater=FrameGround.CreateGroundMaterial0("mat_shallowwater","../../ASSETS/IMAGE/LANDTYPE/lake.png",segs_x,segs_z);
    this.obj_mat.mat_shallowwater=mat_shallowwater;
    var mat_sand=FrameGround.CreateGroundMaterial0("mat_sand","../../ASSETS/IMAGE/LANDTYPE/sand.jpg",segs_x,segs_z);
    this.obj_mat.mat_sand=mat_sand;

    //水反要涉及到场景中的其他物体，所以最好由外部设置
    /*var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
    water.backFaceCulling = true;
    water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);
    water.windForce = -5;
    water.waveHeight = 0.5;
    water.bumpHeight = 0.1;
    water.waveLength = 0.1;
    water.colorBlendFactor = 0;
    water.addToRenderList(skybox);
    water.addToRenderList(ground);*/

    var mat_frame;
    if(MyGame)
    {
        mat_frame=MyGame.materials.mat_frame;
    }
    else {
        mat_frame = new BABYLON.StandardMaterial("mat_frame", scene);
        mat_frame.wireframe = true;
        //mat_frame.useLogarithmicDepth = true;
        mat_frame.freeze();
    }
    this.obj_mat.mat_frame=mat_frame;




    var arr_path=[];
    for(var i=0;i<=segs_x+1;i++)//对于每条竖线
    {
        var posx=(i-((segs_x+1)/2))*size_per_x;
        var path=[];
        for(var j=0;j<=segs_z+1;j++)
        {
            var posz=(j-((segs_z+1)/2))*size_per_z;
            path.push(new BABYLON.Vector3(posx,0,posz));
        }
        arr_path.push(path);
    }
    var ground_base=BABYLON.MeshBuilder.CreateRibbon(param.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});
    ground_base.metadata={};
    ground_base.metadata.arr_path=arr_path;
    if(param.mat&&this.obj_mat[param.mat])//如果有设定的材质
    {
        ground_base.material=this.obj_mat[param.mat];
    }
    else
    {
        ground_base.material=this.obj_mat.mat_frame;
    }
    ground_base.renderingGroupId=2;
    //ground_base.convertToFlatShadedMesh();//使用顶点颜色计算代替片元颜色计算
    //ground_base.freezeWorldMatrix();//冻结世界坐标系
    this.ground_base=ground_base;//也许FrameGround下还有更多的地形网格
    //直接在这里进行矩阵变换是效率更高的办法，但是为了流程的完整性重建网格
}
//对func返回真的顶点应用matrix变化，顶点范围就是this.ground_base.metadata.arr_path
FrameGround.prototype.TransVertex=function(func_condition,height)
{
    var arr_path=this.ground_base.metadata.arr_path;
    var len=arr_path.length;
    var matrix=new BABYLON.Matrix.Translation(0,height,0);
    for(var i=0;i<len;i++)
    {
        var path=arr_path[i];
        var len2=path.length;
        for(var j=0;j<len2;j++)
        {
            var vec3=path[j];
            if(func_condition(vec3))//如果这个顶点符合要求
            {
                arr_path[i][j]=BABYLON.Vector3.TransformCoordinates(vec3,matrix);//顶点变换
            }
        }
    }
    var mat_temp=this.ground_base.material;
    var metadata=this.ground_base.metadata;
    this.ground_base.dispose();
    var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    //使用实例方法重建网格似乎存在错误？原本的网格没有被清空，新的网格则出现索引混乱的情况。于是使用笨办法完全重建
    ground_base.renderingGroupId=2;
    //ground_base.convertToFlatShadedMesh();//问题出在这里？它修改了顶点排列方式？？！！
    ground_base.material=mat_temp;
    ground_base.metadata=metadata;
    this.ground_base=ground_base;
}

//一个常用变化方法，距离pos在dis以内的顶点按arr_gradient梯度变化高度
FrameGround.prototype.TransVertexGradientlyByDistance=function(pos,dis,arr_gradient)
{
    var arr_path=this.ground_base.metadata.arr_path;
    var len=arr_path.length;
    for(var i=0;i<len;i++) {
        var path = arr_path[i];
        var len2 = path.length;
        for (var j = 0; j < len2; j++) {
            var vec = path[j];
            var vec2=pos.clone().subtract(vec)
            var length=Math.pow(vec2.x*vec2.x+vec2.z*vec2.z,0.5);//取到这个顶点到参数位置的距离
            if(length<=(dis))//如果在参数位置的一定范围内
            {
                var len3=arr_gradient.length;
                if(length<arr_gradient[0][0])
                {
                    length=arr_gradient[0][0];
                }
                else if(length>arr_gradient[len3-1][0])
                {
                    length=arr_gradient[len3-1][0];
                }
                //接下来遍历梯度数组，规定梯度必是从低到高排列的
                var matrix;
                for(var k=1;k<len3;k++)
                {
                    var gradient=arr_gradient[k];
                    if(length<=gradient[0])
                    {//计算这一梯度插值层级
                        //前一个梯度
                        var gradient0=arr_gradient[k-1];
                        //比率
                        var ratio=((length-gradient0[0])/(gradient[0]-gradient0[0]));
                        //小端
                        var a=gradient0[1]+(gradient[1]-gradient0[1])*ratio;
                        //大端
                        var b=gradient0[2]+(gradient[2]-gradient0[2])*ratio;
                        //随机高度
                        var c=b-a;
                        var res=a+c*Math.random();
                        matrix=new BABYLON.Matrix.Translation(0,res,0);
                        break;
                    }
                }
                if(matrix)
                {
                    arr_path[i][j]=BABYLON.Vector3.TransformCoordinates(vec,matrix);
                }
            }

        }

    }
    var mat_temp=this.ground_base.material;
    var metadata=this.ground_base.metadata;
    this.ground_base.dispose();
    var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    //使用实例方法重建网格似乎存在错误？原本的网格没有被清空，新的网格则出现索引混乱的情况。于是使用笨办法完全重建
    ground_base.renderingGroupId=2;
    //round_base.convertToFlatShadedMesh();
    ground_base.material=mat_temp;
    ground_base.metadata=metadata;
    this.ground_base=ground_base;
}

//在指定位置绘制指定方向(从z正方向开始顺时针旋转)、指定长度、指定宽度的（平直（过程中不存在凹凸））斜坡，斜坡的高度变化由网格的实际高度决定
//TransSlopeByPosition([15,0,15],-Math.PI/4,6,3)
//prototype.TransSlopeByPosition(-1,)
FrameGround.prototype.TransSlopeByPosition=function(x,z,dir,length,width,h1,h2)
{
    //var s1=1,s2=k,s3=Math.pow(1+k*k,0.5);
    var k1=1/Math.tan(dir);
    var k2=-Math.tan(dir);
    var b1=z+Math.sin(dir)*length/2-k1*(x-Math.cos(dir)*length/2);
    var b2=z-Math.sin(dir)*length/2-k1*(x+Math.cos(dir)*length/2);
    //b1应该小于b2
    if(b2<b1)
    {
        var b=b1;
        b1=b2;
        b2=b;
    }
    var dir2=Math.PI/2+dir;
    var c1=z+Math.sin(dir2)*width/2-k2*(x-Math.cos(dir2)*width/2);
    var c2=z-Math.sin(dir2)*width/2-k2*(x+Math.cos(dir2)*width/2);
    if(c2<c1)
    {
        var c=c1;
        c1=c2;
        c2=c;
    }
    var height=h1-h2;
    var arr_path=this.ground_base.metadata.arr_path;
    var len=arr_path.length;
    //var matrix=new BABYLON.Matrix.Translation(0,height,0);
    for(var i=0;i<len;i++)
    {
        var path=arr_path[i];
        var len2=path.length;
        for(var j=0;j<len2;j++)
        {
            var vec3=path[j];
            var x3=vec3.x+50;
            var z3=vec3.z+50;
            if((z3-k1*x3)>=b1&&(z3-k1*x3)<=b2&&(z3-k2*x3)>=c1&&(z3-k2*x3)<=c2)
            {
                var c3=z3-k2*x3;
                var dis=Math.abs((x3-(b1-c3)/(k2-k1))/Math.cos(dir));
                arr_path[i][j].y=h1-(dis/length)*height;
            }
        }
    }
    var mat_temp=this.ground_base.material;
    var metadata=this.ground_base.metadata;
    this.ground_base.dispose();
    var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    //使用实例方法重建网格似乎存在错误？原本的网格没有被清空，新的网格则出现索引混乱的情况。于是使用笨办法完全重建
    ground_base.renderingGroupId=2;
    //ground_base.convertToFlatShadedMesh();
    ground_base.material=mat_temp;
    ground_base.metadata=metadata;
    this.ground_base=ground_base;
}

FrameGround.prototype.MakeLandtype1=function(func_condition,mat,name,sameheight,height)
{
    var arr_res=[];
    var arr_path=this.ground_base.metadata.arr_path;
    var len=arr_path.length;
    for(var i=0;i<len;i++)//对于每一条路径
    {
        var path=arr_path[i];
        var len2=path.length;
        for(var j=0;j<len2;j++)//对于路径上的每一个顶点
        {
            var vec=path[j];
            if(func_condition(vec))//如果在参数位置的一定范围内
            {
                arr_res.push([i,j]);
            }
        }
    }
    var arr=arr_res;
    var mesh=this.ground_base;
    var vb=mesh.geometry._vertexBuffers;//地面网格的顶点数据
    var data_pos=vb.position._buffer._data;//顶点位置数据
    var data_index=mesh.geometry._indices;//网格索引数据
    var data_uv=vb.uv._buffer._data;//地面网格的纹理坐标数据
    var len_index=data_index.length;

    var len=arr.length;
    var arr_path=mesh.metadata.arr_path;

    var arr_index=[];
    var data_pos2=[];
    var data_index2=[];//第二次循环时填充
    var data_uv2=[];
    console.log("开始生成地形附着物");
    for(var i=0;i<len;i++){//对于每一个选中的路径节点

        var int0=arr[i][0];
        var int1=arr[i][1];
        var vec=arr_path[int0][int1];//获取到路径数组中的一个Vector3对象
        //这里有两种思路，一是从顶点数据入手，完全复刻地形的高度；二是从条带的路径索引入手，可以更贴近的生成附着物的多边形轮廓，但在高度方面可能不精确（不贴合），
        //->结合使用二者？《-可以实现但过于复杂
        //假设路径数组和顶点数据是一一对应的？同时假设每一条路径的长度都和第一条相同，如果先剔除三角形就无法这样使用了！
        var index_v=int0*arr_path[0].length+int1//这个顶点的索引
        arr_index.push(index_v);
        data_pos2.push(vec.x);
        if(sameheight)
        {
            data_pos2.push(height);
        }
        else
        {
            data_pos2.push(vec.y);
        }
        data_pos2.push(vec.z);
        data_uv2.push(data_uv[index_v*2]);
        data_uv2.push(data_uv[index_v*2+1]);

    }
    len=arr_index.length;
    console.log("开始设定地形附着物的索引");
    for(var i=0;i<len;i++)//对于每个顶点索引，它可能被用到多次
    {
        console.log(i+"/"+len);
        var index_v=arr_index[i];
        for(var j=0;j<len_index;j+=3)//遍历索引数组
        {
            var num2=-1;
            var num3=-1;
            //var arr_temp=[];
            var flag_type=null;
            if(index_v==data_index[j])//三角形的第一个顶点
            {//在这里要考虑另两个顶点是否在附着物范围内，如果在，则使用附着物纹理，如果不在则使用混合纹理？？
                num2=data_index[j+1];//*3;//实际去顶点数组中取顶点时要乘以3，但作为顶点索引时不用乘以3
                num3=data_index[j+2];
                flag_type=1;
            }
            else if(index_v==data_index[j+1])//三角形的第一个顶点
            {
                num2=data_index[j];
                num3=data_index[j+2];
                flag_type=2;
            }
            else if(index_v==data_index[j+2])//三角形的第一个顶点
            {
                num2=data_index[j];
                num3=data_index[j+1];
                flag_type=3;
            }
            if(num2!=-1&&num3!=-1)
            {//查看num2和num3这两个索引对应的顶点，在不在选定顶点范围内，如果不在则不在附着物里绘制这个三角形
                //(其实更好的方案是，如果不在，则绘制地形网格和附着物的混合纹理)
                var flag2=-1;
                var flag3=-1;
                for(var i2=0;i2<len;i2++)
                {
                    var index2=arr_index[i2];
                    if(index2==num2)
                    {
                        flag2=i2;//在新的顶点数组中找到这个顶点的索引
                    }
                    if(index2==num3)
                    {
                        flag3=i2;
                    }
                    if(flag2!=-1&&flag3!=-1)
                    {
                        break;//都已经找到
                    }
                }
                if(flag2!=-1&&flag3!=-1)
                {
                    if(flag_type==1)
                    {
                        data_index2.push(i);
                        data_index2.push(flag2);
                        data_index2.push(flag3);
                    }
                    else if(flag_type==2)
                    {
                        data_index2.push(flag2);
                        data_index2.push(i);
                        data_index2.push(flag3);
                    }
                    else if(flag_type==3)
                    {
                        data_index2.push(flag2);
                        data_index2.push(flag3);
                        data_index2.push(i);
                    }

                }
            }
        }
    }
    //数据整理完毕，开始生成几何体
    var normals=[];
    BABYLON.VertexData.ComputeNormals(data_pos2, data_index2, normals);//计算法线
    BABYLON.VertexData._ComputeSides(0, data_pos2, data_index2, normals, data_uv2);//根据法线分配纹理朝向
    var vertexData= new BABYLON.VertexData();
    vertexData.indices = data_index2;//索引
    vertexData.positions = data_pos2;
    vertexData.normals = normals;//position改变法线也要改变！！！！
    vertexData.uvs = data_uv2;

    var mesh=new BABYLON.Mesh(name,scene);
    vertexData.applyToMesh(mesh, true);
    mesh.vertexData=vertexData;
    mesh.renderingGroupId=2;
    mesh.material=mat;
    obj_ground[name]={ground_base:mesh};
}


//导出地面网格，包括适配的纹理和材质！(静态方法)
FrameGround.ExportObjGround=function(obj_ground)
{
    var obj_scene=FrameGround.MakeBasicBabylon();
    for(var key in obj_ground)//在Babylon文件中不配置材质，在导入后能否自动对应新场景中的材质id?
    {
        var obj_mesh={};
        var mesh=obj_ground[key].ground_base;
        obj_mesh.name=mesh.name;
        obj_mesh.id=mesh.id;
        obj_mesh.materialId=mesh.material.id;//如果这样设置不可行，则将materialId放到metadata里传递！
        obj_mesh.position=[mesh.position.x,mesh.position.y,mesh.position.z];
        obj_mesh.rotation=[mesh.rotation.x,mesh.rotation.y,mesh.rotation.z];
        obj_mesh.scaling=[mesh.scaling.x,mesh.scaling.y,mesh.scaling.z];
        obj_mesh.isVisible=true;
        obj_mesh.isEnabled=true;
        obj_mesh.checkCollisions=false;
        obj_mesh.billboardMode=0;
        obj_mesh.receiveShadows=true;
        obj_mesh.renderingGroupId=mesh.renderingGroupId;
        obj_mesh.metadata=mesh.metadata;
        if(mesh.geometry)//是有实体的网格
        {
            var vb=mesh.geometry._vertexBuffers;
            obj_mesh.positions=newland.BuffertoArray2(vb.position._buffer._data);
            obj_mesh.normals=newland.BuffertoArray2(vb.normal._buffer._data);
            obj_mesh.uvs= newland.BuffertoArray2(vb.uv._buffer._data);
            obj_mesh.indices=newland.BuffertoArray2(mesh.geometry._indices);
            obj_mesh.subMeshes=[{
                'materialIndex': 0,
                'verticesStart': 0,
                'verticesCount': mesh.geometry._totalVertices,
                'indexStart': 0,
                'indexCount': mesh.geometry._indices.length,
            }];
            obj_mesh.parentId=mesh.parent?mesh.parent.id:null;
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
            obj_mesh.parentId=null;
        }
        obj_scene.meshes.push(obj_mesh);
    }
    var str_data=JSON.stringify(obj_scene);
    //试试看行不行
    var tmpDown = new Blob([FrameGround.s2ab(str_data)]
        ,{
            type: ""
        }
    );
    FrameGround.saveAs(tmpDown,"ObjGround.babylon")//手动选择保存到静态资源目录里
}
//建立一个最基础的Babylon对象结构，这些方法经过验证和优化后再并入newland库
FrameGround.MakeBasicBabylon=function()
{
    var obj_scene=
        {//最简场景对象
            'autoClear': true,
            'clearColor': [0,0,0],
            'ambientColor': [0,0,0],
            'gravity': [0,-9.81,0],
            'cameras':[],
            'activeCamera': null,
            'lights':[],
            'materials':[],
            'geometries': {},
            'meshes': [],
            'multiMaterials': [],
            'shadowGenerators': [],
            'skeletons': [],
            'sounds': []//,
            //'metadata':{'walkabilityMatrix':[]}
        };
    return obj_scene;
}

FrameGround.s2ab=function(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        var buf = new Array(s.length);
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}
FrameGround.saveAs=function(obj, fileName)
{
    var tmpa = document.createElement("a");
    tmpa.download = fileName || "下载";
    tmpa.href = URL.createObjectURL(obj);
    tmpa.click();
    setTimeout(function () {
        URL.revokeObjectURL(obj);
    }, 100);
}

//FrameGround.ImportObjGround("../../ASSETS/SCENE/","ObjGround.babylon");
FrameGround.ImportObjGround=function(filepath,filename,func,obj_ground)
{
    BABYLON.SceneLoader.ImportMesh("", filepath, filename, scene
        , function (newMeshes, particleSystems, skeletons)
        {//载入完成的回调函数
            var len=newMeshes.length;
            for(var i=0;i<len;i++)
            {
                var mesh=newMeshes[i];
                mesh.renderingGroupId=2;
                mesh.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
                if(obj_ground[mesh.name])
                {
                    obj_ground[mesh.name].ground_base.dispose();
                }
                obj_ground[mesh.name].ground_base=mesh;
                if(mesh.name=="ground_base")
                {//声明顶点位置是可变的！！
                    mesh.markVerticesDataAsUpdatable(BABYLON.VertexBuffer.PositionKind//其实就是“position”，除此之外还有“normal”等
                        ,true);
                }
                if(mesh.metadata&&mesh.metadata.arr_path)
                {//要把array重新变成Vector3！！！！
                    var arr_path=mesh.metadata.arr_path;
                    var len1=arr_path.length;
                    for(var j=0;j<len1;j++)
                    {
                        var path=arr_path[j];
                        var len2=path.length;
                        for(var k=0;k<len2;k++)
                        {
                            var vec=path[k];
                            var vec2=new BABYLON.Vector3(vec.x,vec.y,vec.z);
                            path[k]=vec2;
                        }
                    }
                }
                //材质是靠id关联的
            }
            if(func)
            {
                func();
            }

        }
    );
}
