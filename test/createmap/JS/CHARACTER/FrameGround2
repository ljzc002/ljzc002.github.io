//在这里存放和改进的地形网格相关的方法，需要MyGame对象
//import * as MyGame from "../LIB/cannon";
//建立myGround方法，uv分配
FrameGround=function()//非继承，也许会有多个
{

}
FrameGround.CreateGroundMaterial=function(name,url,segs_x,segs_z)
{
    var mat = new BABYLON.StandardMaterial(name, scene);//1
    mat.diffuseTexture = new BABYLON.Texture(url, scene);
    //mat.diffuseTexture.uScale = segs_x+1;//纹理重复效果《-不重复uv？！
    //mat.diffuseTexture.vScale = segs_z+1;
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
    var mat_terre=FrameGround.CreateGroundMaterial0("mat_terre","../../ASSETS/IMAGE/LANDTYPE/terre.png",segs_x,segs_z);
    this.obj_mat.mat_terre=mat_terre;

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
    var ground_base=FrameGround.myCreateRibbon2(param.name
        ,{pathArray:arr_path,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE})
    /*var ground_base=BABYLON.MeshBuilder.CreateRibbon(param.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});*/
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
FrameGround.myCreateRibbon=function(name,obj_p)
{
    var arr_path=obj_p.pathArray;
    var updatable=obj_p.updatable;//反正要重建，不update也可以
    var sideOrientation=obj_p.sideOrientation;
    var normals=[];

    var len=arr_path.length;
    var data_pos2=[];
    var data_index2=[];
    var normals=[];
    var data_uv2=[];
    var size=arr_path[0].length;
    for(var i=0;i<len;i++)
    {
        var path =arr_path[i];
        var len2=path.length;
        for(var j=0;j<len2;j++)
        {
            var vec3=path[j];
            data_pos2.push(vec3.x);
            data_pos2.push(vec3.y);
            data_pos2.push(vec3.z);
            if(i<(len-1)&&j<(len2-1))
            {
                var index=i*size+j;
                data_index2.push(index)
                data_index2.push((i+1)*size+j)
                data_index2.push(i*size+j+1)
                data_index2.push((i+1)*size+j+1)
                data_index2.push(i*size+j+1)
                data_index2.push((i+1)*size+j)
            }
            if(i%2==0&&j%2==0)//这样排列要求纹理对称？！
            {
                data_uv2.push(0);
                data_uv2.push(0);
            }
            else if(i%2==1&&j%2==0)
            {
                data_uv2.push(2);
                data_uv2.push(0);
            }
            else if(i%2==0&&j%2==1)
            {
                data_uv2.push(0);
                data_uv2.push(2);
            }
            else if(i%2==1&&j%2==1)
            {
                data_uv2.push(2);
                data_uv2.push(2);
            }
        }

    }

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
    return mesh;
    //mesh.renderingGroupId=2;
   // mesh.material=mat;
    //mesh.sideOrientation=sideOrientation
    //obj_ground[name]={ground_base:mesh};
}
//每个方块6顶点
FrameGround.myCreateRibbon2=function(name,obj_p)
{
    var arr_path=obj_p.pathArray;


    var updatable=obj_p.updatable;//反正要重建，不update也可以
    var sideOrientation=obj_p.sideOrientation;
    var normals=[];

    var len=arr_path.length;
    var data_pos2=[];
    var data_index2=[];
    var normals=[];
    var data_uv2=[];
    var size=arr_path[0].length;
    var sum=size*size;
    for(var i=0;i<sum;i++)
    {
        data_uv2.push(0);
        data_uv2.push(0);
    }
    data_uv2=data_uv2.concat(data_uv2).concat(data_uv2).concat(data_uv2).concat(data_uv2).concat(data_uv2);
    for(var i=0;i<len;i++)
    {
        var path =arr_path[i];
        var len2=path.length;
        for(var j=0;j<len2;j++)
        {
            var vec3=path[j];
            data_pos2.push(vec3.x);
            data_pos2.push(vec3.y);
            data_pos2.push(vec3.z);
            if(i<(len-1)&&j<(len2-1))
            {
                //使用点乘可以避免图片像素的拉伸扭曲，但又如何处理图片整体的偏斜呢？《-让图片朝向坐标系正方向？
                //一个方块中的两个三角形未必对称！！！！
                var vec3b=arr_path[i+1][j];
                var vab=vec3b.subtract(vec3)
                var lab=vab.length();

                var vec3c=arr_path[i][j+1];
                var vac=vec3c.subtract(vec3)
                var lac=vac.length();

                var vec3d=arr_path[i+1][j+1];
                var vad=vec3d.subtract(vec3)
                var lad=vad.length();
                //点乘性质vab.x*vac.x+vab.y*vac.y+vab.z*vac.z=vab.vac=lab*lac*cosCAB

                //var wid=(lab)/size_per_x;
                //var hig=(lac)/size_per_z;
                //决定保持不拉伸，这样就很难保持不倾斜，——》用弱方向特征的纹理图减轻倾斜
                var CAB=Math.acos((vab.x*vac.x+vab.y*vac.y+vab.z*vac.z)/(lab*lac));
                var DAB=Math.acos((vab.x*vad.x+vab.y*vad.y+vab.z*vad.z)/(lab*lad));

                var index=4*sum+i*size+j;//1
                data_index2.push(index);
                data_uv2[(index)*2]=0;
                data_uv2[(index)*2+1]=0;

                index=0*sum+(i+1)*size+j;//2
                data_index2.push(index);
                data_uv2[(index)*2]=(lab)/size_per_x;
                data_uv2[(index)*2+1]=0;

                index=2*sum+i*size+j+1;//3
                data_index2.push(index);
                data_uv2[(index)*2]=lac*Math.cos(CAB);
                data_uv2[(index)*2+1]=lac*Math.sin(CAB);

                index=1*sum+(i+1)*size+j+1;//4
                data_index2.push(index);
                data_uv2[(index)*2]=lad*Math.cos(DAB);
                data_uv2[(index)*2+1]=lad*Math.sin(DAB);

                index=3*sum+i*size+j+1;//5
                data_index2.push(index);
                data_uv2[(index)*2]=lac*Math.cos(CAB);
                data_uv2[(index)*2+1]=lac*Math.sin(CAB);

                index=5*sum+(i+1)*size+j;//6
                data_index2.push(index);
                data_uv2[(index)*2]=(lab)/size_per_x;
                data_uv2[(index)*2+1]=0;

                /*data_index2.push(0*sum+(i+1)*size+j)
                data_index2.push(2*sum+i*size+j+1)
                data_index2.push(1*sum+(i+1)*size+j+1)
                data_index2.push(3*sum+i*size+j+1)
                data_index2.push(5*sum+(i+1)*size+j)

                data_uv2[(4*sum+i*size+j)*2]=0*/
            }

        }

    }
    //在完全模式下data_pos2中的顶点最多会被用到六次
    var data_pos2=data_pos2.concat(data_pos2).concat(data_pos2).concat(data_pos2).concat(data_pos2).concat(data_pos2);
    /*for(var i=0;i<6;i++)
    {
        for(var j=0;j<sum;j++)
        {
            if(i==4)
            {
                data_uv2.push(0);
                data_uv2.push(0);
            }
            else if(i==2||i==3)
            {
                data_uv2.push(0);
                data_uv2.push(1);
            }
            else if(i==0||i==5)
            {
                data_uv2.push(1);
                data_uv2.push(0);
            }
            else if(i==1)
            {
                data_uv2.push(1);
                data_uv2.push(1);
            }
        }
    }*/
    //要在这里加上方块变形！

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
    return mesh;
    //mesh.renderingGroupId=2;
    // mesh.material=mat;
    //mesh.sideOrientation=sideOrientation
    //obj_ground[name]={ground_base:mesh};
}
//对func返回真的顶点应用matrix变化，顶点范围就是this.ground_base.metadata.arr_path
//较为陡峭的地方要切换为第二种纹理！！！！
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
    var ground_base=FrameGround.myCreateRibbon2(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE})
    /*var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    */
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
    var ground_base=FrameGround.myCreateRibbon2(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE})
    /*var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    //使用实例方法重建网格似乎存在错误？原本的网格没有被清空，新的网格则出现索引混乱的情况。于是使用笨办法完全重建*/
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
    var ground_base=FrameGround.myCreateRibbon2(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE})
    /*var ground_base=BABYLON.MeshBuilder.CreateRibbon(this.ground_base.name
        ,{pathArray:arr_path,updatable:true,closePath:false,closeArray:false,sideOrientation:BABYLON.Mesh.DOUBLESIDE});//instance:this.ground_base,
    //使用实例方法重建网格似乎存在错误？原本的网格没有被清空，新的网格则出现索引混乱的情况。于是使用笨办法完全重建*/
    ground_base.renderingGroupId=2;
    //ground_base.convertToFlatShadedMesh();
    ground_base.material=mat_temp;
    ground_base.metadata=metadata;
    this.ground_base=ground_base;
}

FrameGround.FindIndexinArrres=function(arr,maxi,maxj,i,j,index)
{
    var len=arr.length;
    if(i<0||j<0||i>=maxi||j>=maxj)
    {
        return -1;
    }
    for(var k=0;k<len;k++)
    {
        var obj=arr[k];
        if(obj[0]==i&&obj[1]==j)//在可用范围内找到了这个顶点，并且这个顶点还未被检查过
        {
            if(!obj[2][index])
            {
                return k;
            }
            else
            {
                return -1;
            }
        }
    }
    return -1;
}
FrameGround.prototype.MakeLandtype1=function(func_condition,mat,name,sameheight,height)
{
    var arr_res=[];
    var mesh=this.ground_base;
    var vb=mesh.geometry._vertexBuffers;//地面网格的顶点数据
    var data_pos=vb.position._buffer._data;//顶点位置数据
    var data_index=mesh.geometry._indices;//网格索引数据
    var data_uv=vb.uv._buffer._data;//地面网格的纹理坐标数据
    var len_index=data_index.length;

    var arr_index=[];
    var data_pos2=[];
    var data_index2=[];//第二次循环时填充
    var data_uv2=[];

    var arr_path=mesh.metadata.arr_path;
    var size=arr_path[0].length;
    var sum=size*size;
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
                //var index_temp=int0*size+int1;
                arr_res.push([i,j,[false,false,false,false,false,false]]);
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

            }
        }
    }
    data_pos2=data_pos2.concat(data_pos2).concat(data_pos2).concat(data_pos2).concat(data_pos2).concat(data_pos2);
    var arr=arr_res;
    var len=arr.length;
    var sum2=len;
    for(var i=0;i<len;i++)
    {
        data_uv2.push(0);
        data_uv2.push(0);
    }
    data_uv2=data_uv2.concat(data_uv2).concat(data_uv2).concat(data_uv2).concat(data_uv2).concat(data_uv2);
    for(var k=0;k<len;k++)
    {
        var data=arr[k];
        var i=data[0];
        var j=data[1];
        var arr_checked=data[2];
        //考虑六个方向！！！！
        if(!arr_checked[1])//一号索引的三角形尚未考虑
        {
            arr_checked[1]=true;
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i,j-1,5);
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i-1,j,3);
            if(k2>=0&&k3>=0)
            {
                var index2=1*sum2+k;//1
                data_index2.push(index2);
                var index1=1*sum+i*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=3*sum2+k2;//3
                data_index2.push(index2);
                index1=3*sum+(i-1)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=5*sum2+k3;//5
                data_index2.push(index2);
                index1=5*sum+(i)*size+j-1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][3]=true;
                arr[k3][2][5]=true;
            }
        }
        if(!arr_checked[0])//第一个三角形尚未考虑
        {
            arr_checked[0]=true;
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i-1,j,4);
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i-1,j+1,2);
            if(k2>=0&&k3>=0)
            {
                var index2=4*sum2+k3;//
                data_index2.push(index2);
                var index1=4*sum+(i-1)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*1];

                index2=0*sum2+k;//
                data_index2.push(index2);
                index1=0*sum+(i)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=2*sum2+k2;//
                data_index2.push(index2);
                index1=2*sum+(i-1)*size+j+1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][2]=true;
                arr[k3][2][4]=true;
            }
        }
        if(!arr_checked[2])//第一个三角形尚未考虑
        {
            arr_checked[2]=true;
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i,j-1,4);
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i+1,j-1,0);
            if(k2>=0&&k3>=0)
            {
                var index2=4*sum2+k2;//1
                data_index2.push(index2);
                var index1=4*sum+i*size+j-1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=0*sum2+k3;//2
                data_index2.push(index2);
                index1=0*sum+(i+1)*size+j-1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=2*sum2+k;//3
                data_index2.push(index2);
                index1=2*sum+(i)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][4]=true;
                arr[k3][2][0]=true;
            }
        }
        if(!arr_checked[3])//第一个三角形尚未考虑
        {
            arr_checked[3]=true;
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i+1,j-1,5);
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i+1,j,1);
            if(k2>=0&&k3>=0)
            {
                var index2=1*sum2+k3;//1
                data_index2.push(index2);
                var index1=1*sum+(i+1)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=3*sum2+k;//2
                data_index2.push(index2);
                index1=3*sum+(i)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=5*sum2+k2;//3
                data_index2.push(index2);
                index1=5*sum+(i+1)*size+j-1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][5]=true;
                arr[k3][2][1]=true;
            }
        }
        if(!arr_checked[4])//第一个三角形尚未考虑
        {
            arr_checked[4]=true;
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i+1,j,0);
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i,j+1,2);
            if(k2>=0&&k3>=0)
            {
                var index2=4*sum2+k;//1
                data_index2.push(index2);
                var index1=4*sum+i*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=0*sum2+k2;//2
                data_index2.push(index2);
                index1=0*sum+(i+1)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=2*sum2+k3;//3
                data_index2.push(index2);
                index1=2*sum+(i)*size+j+1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][0]=true;
                arr[k3][2][2]=true;
            }
        }
        if(!arr_checked[5])//第一个三角形尚未考虑
        {
            arr_checked[5]=true;
            var k2=FrameGround.FindIndexinArrres(arr,size,size,i,j+1,1);
            var k3=FrameGround.FindIndexinArrres(arr,size,size,i-1,j+1,3);
            if(k2>=0&&k3>=0)
            {
                var index2=1*sum2+k2;//1
                data_index2.push(index2);
                var index1=1*sum+i*size+j+1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=3*sum2+k3;//2
                data_index2.push(index2);
                index1=3*sum+(i-1)*size+j+1;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];

                index2=5*sum2+k;//3
                data_index2.push(index2);
                index1=5*sum+(i)*size+j;
                data_uv2[(index2)*2]=data_uv[index1*2];
                data_uv2[(index2)*2+1]=data_uv[index1*2+1];
                arr[k2][2][1]=true;
                arr[k3][2][3]=true;
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
