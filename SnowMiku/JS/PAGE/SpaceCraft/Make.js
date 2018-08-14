/**
 * Created by lz on 2018/8/10.
 */
function MakeCraft()
{
    if(mesh_origin.dispose)
    {
        mesh_origin.dispose();
    }
    arr_path=[];
    var xstartl=-15;
    //var arr0=MakePointPath(new BABYLON.Vector3(-15,0,0),128);//用一个点封口
    //arr_path.push(arr0);
    var arr1=TranceRing1(MakeRing(7,128));
    for(var i=0;i<121;i++)
    {
        var arr_point=CloneArrPoint(arr1);
        //arr_point=TranceRing2(arr_point,i);
        arr_path.push(MoveX(arr_point,i*0.25+xstartl));
    }
    var arr7=MakePointPath(new BABYLON.Vector3(15,0,0),129);//用一个点封口
    arr_path.push(arr7);

    mesh_origin=BABYLON.MeshBuilder.CreateRibbon("mesh_origin",{pathArray:arr_path
        ,updatable:true,closePath:false,closeArray:false});
    mesh_origin.material=mat_frame;
    TransCraft();
}
//上下挤压，对于每个顶点都生效的变换尽量只执行一次
function TranceRing1(arr)
{
    var len=arr.length;
    for(var j=0;j<len;j++)
    {
        var obj=arr[j];
        if(obj.y<0)
        {
            obj.y=obj.y/4;
            if(obj.y<-1)
            {
                obj.y=-1;
            }
        }
        else if(obj.y>2)
        {
            obj.y=(obj.y-2)/2+2;
        }
    }
    return arr;
}
//用一个重合点路径封口
function MakePointPath(vec,size)
{
    var arr_point=[];
    for(var i=0;i<size;i++)
    {
        arr_point.push(vec.clone());
    }
    return arr_point;
}
//有的顶点变换会受到周围顶点的影响，所以要在已经构造好的基础上进行变换
function TransCraft()
{
    var len=arr_path.length;
    //遍历每个点，用程序判断这个点是否符合某些标准，并进行相应变化
    for(var i=0;i<len;i++)
    {
        var arr_point=arr_path[i];
        var len2=arr_point.length;
        for(var j=0;j<len2;j++)
        {
            var obj=arr_point[j];
            //var x=obj.x;
            //var y=obj.y;
            //var z=obj.z;
            //前后呈椎体状
            if(obj.x<-13&&obj.y<0)
            {
                var rate=Math.sin(Math.acos((-13-obj.x)/2/1));//y轴方向缩放系数
                obj.y=obj.y*rate;
            }
            if(obj.x<-10&&obj.y>0)
            {
                var rate=Math.sin(Math.acos((-10-obj.x)/(5/3.25)/3.25));//y轴方向缩放系数
                obj.y=obj.y*rate;
            }
            if(obj.x<0)
            {
                var rate=Math.sin(Math.acos((-obj.x)/(15/7)/7));//y轴方向缩放系数
                obj.z=obj.z*rate;
            }

            //后掠翼，具有圆弧状的边缘
            if(obj.x>0&&obj.y>0&&obj.y<1)
            {
                //这一层翼面和最小翼面的边缘差值
                var rate=Math.cos(Math.asin(Math.abs(0.5-obj.y)/(0.5/1)/1));
                var size1=1*rate;
                var h=14+size1;
                var w=6.5+size1;
                if((15-obj.x)<h)
                {
                    var rate2=Math.cos(Math.asin(Math.abs(15-obj.x)/(h/w)/w));
                    if(obj.z>0)
                    {
                        obj.z+=w*rate2;
                    }
                    else if(obj.z<0)
                    {
                        obj.z-=w*rate2;
                    }
                    var rate3=3/(15-Math.abs(obj.z))
                    obj.x+=rate3;
                }

            }
            //尾翼，考虑将自体变形和添加子网格结合起来？？
            if(obj.x>10&&obj.y>0&&Math.abs(obj.z)<0.5)
            {
                var rate=Math.cos(Math.asin(Math.abs(0-obj.z)/(0.5/1)/1));
                var size1=1*rate;
                var h=4+size1;
                var w=2+size1;
                if((15-obj.x)<h)
                {
                    var rate2=Math.cos(Math.asin(Math.abs(15-obj.x)/(h/w)/w));
                    obj.y+=w*rate2;
                    //var rate3=3/(15-Math.abs(obj.z))
                    //obj.x+=rate3;
                }
            }
        }
    }
    mesh_origin=BABYLON.MeshBuilder.CreateRibbon(mesh_origin.name,{pathArray:arr_path
        ,updatable:true,instance:mesh_origin,closePath:false,closeArray:false});
}