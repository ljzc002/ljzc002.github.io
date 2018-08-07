/**
 * Created by lz on 2018/7/26.
 */
//各种生成点、路径、网格的方法

//直接建立瓶子型物体？还是通过条带变形产生？
function MakeBottle()
{
    if(mesh_origin.dispose)
    {
        mesh_origin.dispose();
    }
    arr_path=[];
    var xstartl=-15;
    var arr1=MakeRing(2,128);
    for(var i=0;i<8;i++)//只有起始端是从零开始遍历？？
    {
        var arr_point=CloneArrPoint(arr1);
        arr_path.push(MoveX(arr_point,i*0.25+xstartl));
    }
    var arr2=MakeNF1(2);
    for(var i=0;i<20;i++)//接口部分怎样处理？将上一段的尾元素删除？
    {
        var arr_point=CloneArrPoint(arr2);
        arr_path.push(MoveX(ScaleXYZ(arr_point,1,1+(i*2/20),1+(i*2/20)),2+i*0.25+xstartl));
    }
    var arr3=MakeNF2(6);
    for(var i=0;i<88;i++)
    {
        var arr_point=CloneArrPoint(arr3);//MakeRegularPolygon(4,32,6)
        arr_path.push(MoveX(arr_point,7+i*0.25+xstartl));
    }
    for(var i=0;i<4;i++)//瓶底圆角
    {
        var arr_point=CloneArrPoint(arr3);
        arr_path.push(MoveX(MakeYJ(arr_point,6,1,i*0.25),29+i*0.25+xstartl));
    }
    //发现路径的延展可以分为x向和截向两种，前者可以保持x向的均匀，后者则是保持截向的均匀
    var arr4=MakeNF2(5);
    for(var i=0;i<2;i++)
    {
        var arr_point=CloneArrPoint(arr4);
        arr_path.push(MoveX(ScaleXYZ(arr_point,1,1-(i*0.5/5/2),1-(i*0.5/5/2)),30+xstartl));//被除数是总共移动的长度比总长度，除数是分成的阶段数
    }
    var arr5=MakeNF2(4.5);
    for(var i=0;i<13;i++)//瓶底圆角
    {
        var arr_point=CloneArrPoint(arr5);
        //首先根据水平的需求确定需要几环，在根据环数和x向位移确定每一环的位移
        //arr_path.push(MoveX(MakeYJ2(arr_point,5.5,5,i*0.125+3,4),30-i*0.125+xstartl));
        arr_path.push(MoveX(MakeYJ3(arr_point,4.5,i*0.25),30-(Math.sqrt(25-(3-i*0.25)*(3-i*0.25))-4)+xstartl));
    }
    var arr6=MakeRing(1.5,128);
    for(var i=0;i<6;i++)
    {
        var arr_point=CloneArrPoint(arr6);
        arr_path.push(MoveX(ScaleXYZ(arr_point,1,1-(i*1.5/1.5/6),1-(i/6)),30-1.2+xstartl));
    }

    var arr7=MakePointPath(new BABYLON.Vector3(13.8,0,0),128);//用一个点封口
    arr_path.push(arr7);
    //var arr4=MakeNF2(4);
    //for(var i=0;i<8)

    //接下来是x向圆弧的生成规则和表面的鼓凸与凹陷，还有向的连续凹槽

    mesh_origin=BABYLON.MeshBuilder.CreateRibbon("mesh_origin",{pathArray:arr_path,updatable:true,closePath:false,closeArray:false});
    //mesh_origin=mesh;//用一个全局变量保存最终会被导出的mesh
    mesh_origin.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
    mesh_origin.material=mat_frame;
    mesh_origin.layerMask=2;
    mesh_origin.metadata={};
    mesh_origin.metadata.arr_path=arr_path;

    TransBottle();
}
function CloneArrPoint(arr)
{
    var arr2=[];
    var len=arr.length;
    for(var i=0;i<len;i++)
    {
        arr2.push(arr[i].clone());
    }
    return arr2;
}
//生成一个正多边形路径，边的数量，属于每个边的顶点数（同时属于两条边的顶点当做是半个！！），内切圆半径
function MakeRegularPolygon(countside,countpoint,size)
{
    var arr_point=[];
    //rad_angel=(Math.PI-Math.PI*2/countside)/2;//正多边形每个内角的弧度的一半
    var rad2=Math.PI/countside;
    var len=countpoint*countside;
    for(var i=0;i<len;i++)
    {
        var rad3=i*Math.PI*2/len;//从起点开始，这个顶点转过的角度
        var rad4=rad3%rad2;//用这个角和内切圆半径合作计算这个顶点的半径
        if(Math.floor(rad3/rad2)%2==0)//如果转过的角度包括偶数倍的半中心角
        {
            rad4=rad2-rad4;
        }
        var size2=size/Math.cos(rad4);
        var x=0;
        var y=size2*Math.sin(rad3);
        var z=size2*Math.cos(rad3);
        arr_point.push(new BABYLON.Vector3(x,y,z));
    }
    arr_point.push(arr_point[0].clone());//首尾相连
    return arr_point;
}
//平移x轴
function MoveX(path,dis)
{
    var len=path.length;
    for(var i=0;i<len;i++)
    {
        path[i].x+=dis;
    }
    return path;
}
//生成农夫山泉上部不规则的棱锥
function MakeNF1(size)
{
    var arr_point=[];
    var rad2=Math.PI/4;
    var len=128;
    for(var i=0;i<len;i++)
    {
        var rad3=i*Math.PI*2/len;//从起点开始，这个顶点转过的角度
        var rad4=rad3%rad2;//用这个角和内切圆半径合作计算这个顶点的半径
        if(Math.floor(rad3/rad2)%2==0)//如果转过的角度包括偶数倍的半中心角
        {
            rad4=rad2-rad4;
        }
        if(rad4<=Math.PI/6)
        {
            var size2=size/Math.cos(rad4);
            var x=0;
            var y=size2*Math.sin(rad3);
            var z=size2*Math.cos(rad3);
            arr_point.push(new BABYLON.Vector3(x,y,z));
        }
        else
        {
            var rad5=rad4-Math.PI/6;
            var size2=(size/Math.cos(Math.PI/6))/Math.cos(rad5);//此处的半径小了一些
            var x=0;
            var y=size2*Math.sin(rad3);
            var z=size2*Math.cos(rad3);
            arr_point.push(new BABYLON.Vector3(x,y,z));
        }

    }
    arr_point.push(arr_point[0].clone());//首尾相连
    return arr_point;
}
function ScaleXYZ(arr,x,y,z)
{
    if(!x)
    {
        x=1;
    }
    if(!y)
    {
        y=1;
    }
    if(!z)
    {
        z=1;
    }
    var len=arr.length;
    for(var i=0;i<len;i++)
    {
        var obj=arr[i];
        obj.x=obj.x*x;
        obj.y=obj.y*y;
        obj.z=obj.z*z;
        /*if(obj.size)
        {
            obj.size=obj.size*
        }*/
    }
    return arr;
}
//带有圆角的瓶身
function MakeNF2(size)
{
    var arr_point=[];
    var rad2=Math.PI/4;
    var len=128;
    for(var i=0;i<len;i++)
    {
        var rad3=i*Math.PI*2/len;//从起点开始，这个顶点转过的角度
        var rad4=rad3%rad2;//用这个角和内切圆半径合作计算这个顶点的半径
        if(Math.floor(rad3/rad2)%2==0)//如果转过的角度包括偶数倍的半中心角
        {
            rad4=rad2-rad4;
        }
        if(rad4<=Math.PI/6)
        {
            var size2=size/Math.cos(rad4);
            var x=0;
            var y=size2*Math.sin(rad3);
            var z=size2*Math.cos(rad3);
            var obj=new BABYLON.Vector3(x,y,z);
            obj.size=size;
            arr_point.push(obj);
        }
        else
        {
            var size2=(size/Math.cos(Math.PI/6));//此处的半径小了一些
            var x=0;
            var y=size2*Math.sin(rad3);
            var z=size2*Math.cos(rad3);
            var obj=new BABYLON.Vector3(x,y,z);
            obj.size=size;
            arr_point.push(obj);
        }

    }
    var obj=arr_point[0].clone();
    obj.size=arr_point[0].size;
    arr_point.push(obj);//首尾相连
    return arr_point;
}
//制作沿着X轴方向的圆角
//arr瓶周的圆环路径，r1瓶的截面半径，r2瓶的圆角半径，posx该圆环路径距圆角圆心距离
//当瓶子的横截面并不是圆形时，这相当于取其中一个点进行计算。
function MakeYJ(arr,r1,r2,posx)//这个是恰好九十度圆角的简化情况
{
    var num=(r1-(r2-Math.sqrt(r2*r2-posx*posx)))/r1;
    var arr2=ScaleXYZ(arr,null,num,num);
    return arr2;
}
function MakeYJ2(arr,r1,r2,posx,r3)//r3此处圆角截线的半长
{
    var num=(r1-(r3-Math.sqrt(r2*r2-posx*posx)))/r1;
    var arr2=ScaleXYZ(arr,null,num,num);
    return arr2;
}
//上面的两种算法适合x轴方向延伸，能够保持x轴方向的均匀，下面要考虑截面延伸和收缩
function MakeYJ3(arr,r1,posy)//
{
    var num=(r1-posy)/r1;
    var arr2=ScaleXYZ(arr,null,num,num);
    return arr2;
}
function MakePointPath(vec,size)
{
    var arr_point=[];
    for(var i=0;i<size;i++)
    {
        arr_point.push(vec.clone());
    }
    return arr_point;
}
var arr_sin=[];
var lines_sin={};
//编写一些方法对arr_path进行变形
function TransBottle()
{
    var len=arr_path.length;
    var vec0=new BABYLON.Vector3(0,0,0);
    if(lines_sin.dispose)
    {
        lines_sin.dispose();
    }
    //遍历每个点，用程序判断这个点是否符合某些标准，并进行相应变化
    for(var i=0;i<len;i++)
    {
        var arr_point=arr_path[i];
        var len2=arr_point.length;

        //因为同一个圆环路径可能通过扭转变形脱离同一个平面，所以难以直接以整个圆环路径为整体移动
        for(var j=0;j<len2;j++)
        {
            var obj=arr_point[j];
            //obj.r=Math.sqrt(obj.y*obj.y+obj.z*obj.z);//这个点到轴线的距离
            if(obj.x>-4||obj.x<9)//瓶中段略微收窄
            {
                //obj.y=obj.y*0.967;//使用这种缩放方式会造成深浅不一
                //obj.z=obj.z*0.967;
                TransDitch([obj],0.2,new BABYLON.Vector3(obj.x,0,0));
            }
            var arr=[-6.5,-3.5,-1.5,0.5,2.5,4.5,6.5,9.5,11.5];//平行的横纹，纹深0.4宽0.5            var len3=arr.length;
            var len3=arr.length;
            for(var k=0;k<len3;k++)
            {
                if(Math.abs(obj.x-arr[k])<0.25)
                {
                    TransDitch([obj],0.4,new BABYLON.Vector3(obj.x,0,0));
                    break;
                }
            }
            //波浪形的挤压扭转，如何确定被影响的顶点和被影响变化量？
            var arr2=[9.5,11.5];
            var len4=arr2.length;
            for(var k=0;k<len4;k++)
            {
                if(Math.abs(obj.x-arr2[k])<0.6)
                {//正弦曲线的0轴位置，正弦曲线的影响范围,波峰高度,正弦曲线线宽度,点位置，弧度偏移量
                    TransSin(arr2[k],0.6,0.4,0.01,obj,Math.PI/2);
                }
            }
            //瓶底刻痕，向法线方向刻画
            var arr3=[-4,-3,-2,-1,0,1,2,3,4];
            var len5=arr3.length;
            var vb=mesh_origin.geometry._vertexBuffers;
            var position=vb.position._buffer._data;
            var normal=vb.normal._buffer._data;
            var uv=vb.uv._buffer._data;
            var r=Math.sqrt(obj.z*obj.z+obj.y*obj.y);
            if(obj.x>14)//||(r>1&&r<1.6))//恰巧使用一个x约束就可以定位所有刻痕在x轴向的范围，如果不够时可以用y>=1.5&&z>=1.5来限制
            {
                var rad=Math.atan2(obj.z,obj.y);

                for(var k=0;k<len5;k++)
                {//在yoz平面中判断一个点是否在某一个范围内
                    var rad2=Math.abs(rad-arr3[k]*(Math.PI/4));//圆环路径上的点和每一条辅助线的夹角
                    if(rad2<(Math.PI/8)&&r*(Math.sin(rad2))<(0.1))
                    {
                        var index=i*len2+j;//顶点索引
                        var vec=new BABYLON.Vector3(normal[index*3+0],normal[index*3+1],normal[index*3+2]);
                        TransDitch([obj],0.2,vec);
                        break;
                    }
                }
            }
            var arr4=[-7,-5,-3,-1,1,3,5,7];
            var len6=arr4.length;
            if(obj.x>14&&(Math.abs(obj.y)>5||Math.abs(obj.z)>5)&&obj.x<14.7)
            {
                var rad=Math.atan2(obj.z,obj.y);
                var r=Math.sqrt(obj.z*obj.z+obj.y*obj.y);
                for(var k=0;k<len6;k++)
                {//在yoz平面中判断一个点是否在某一个范围内
                    var rad2=Math.abs(rad-arr4[k]*(Math.PI/8));//圆环路径上的点和每一条辅助线的夹角
                    if(rad2<(Math.PI/8)&&r*(Math.sin(rad2))<(0.1))
                    {
                        var index=i*len2+j;//顶点索引
                        var vec=new BABYLON.Vector3(normal[index*3+0],normal[index*3+1],normal[index*3+2]);
                        TransDitch([obj],0.2,vec);
                        break;
                    }
                }
            }
        }
    }
    mesh_origin=BABYLON.MeshBuilder.CreateRibbon(mesh_origin.name,{pathArray:arr_path
        ,updatable:true,instance:mesh_origin,closePath:false,closeArray:false});
    //mesh_origin.material=mat_alpha;
    mesh_origin.sideOrientation=BABYLON.Mesh.DOUBLESIDE;
}
//使一些点向某一向量（空间位置）移动depth长度
function TransDitch(arr,depth,vec3)//对于直角和圆角的处理方法不同？
{
    var len=arr.length;
    for(var i=0;i<len;i++)
    {
        var obj=arr[i];
        obj.addInPlace(vec3.subtract(obj).normalize().scale(depth));
    }
}
//将沟壑扭转为正弦曲线
function TransSin(posx,width,h,width2,obj,rad)
{
    if(!rad)
    {
        rad=0;
    }
    var rad0=Math.atan2(obj.z,obj.y)*4+rad;
    var num=Math.sin(rad0)*h;//正弦偏移量
    if(Math.abs(obj.x-posx)<width2)//在正弦曲线内部
    {
        obj.x+=num;
        //arr_sin.push([obj,arr_sin[arr_sin.length-1]?arr_sin[arr_sin.length-1]])
    }
    else{//在正弦曲线外部却受到曲线影响
        var rate=(obj.x-posx)/width;
        if(num>0)
        {
            if(rate*num>0)//顶点在被挤压的方向
            {
                var num2=(width-num-width2)*rate;
                //obj.x+=(num2+(num+h-(obj.x-posx)));
                obj.x=posx+num+width2+num2;
            }
            else{//在被拉伸的方向
                var num2=(width+num-width2)*rate;
                //obj.x+=(num2+(num+h-(obj.x-posx)));
                obj.x=posx+num-width2+num2;
            }
        }
        else if(num<0)
        {
            if(rate*num>0)//顶点在被挤压的方向
            {
                var num2=(width+num-width2)*rate;
                //obj.x+=(num2+(num+h-(obj.x-posx)));
                obj.x=posx+num+width2+num2;
            }
            else{//在被拉伸的方向
                var num2=(width-num-width2)*rate;
                //obj.x+=(num2+(num+h-(obj.x-posx)));
                obj.x=posx+num-width2+num2;
            }
        }


    }
    //mesh_origin.material=mat_blue;
}
