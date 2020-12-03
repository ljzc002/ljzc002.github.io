function handleFloor(int_floor,arr,index)
{
    var floor=obj_building[int_floor];
    if(!floor)
    {
        obj_building[int_floor]={};
        floor=obj_building[int_floor];
    }
    var len=arr.length;
    var count=0;
    //继续读txt文本
    for(var i=index;i<len;i++)
    {
        var line=arr[i];
        count++;
        if(count<=seg_z)
        {

            if(!floor[count+""])
            {
                floor[count+""]={}
            }

            for(var j=0;j<seg_x;j++)
            {
                if(line[j])
                {

                    floor[count+""][j+1+""]={type:line[j]};//这个“数组”都是从一开始的
                    //addRoom(count-1,j);//行、列,规划完毕后统一添加渲染
                }
            }
        }
        else
        {
            if(line.substring(0,7)=="//floor")//查找到另一层
            {
                return (index+count-2);
            }
            else if(line.substring(0,8)=="//source")//为这个房间设置资源
            {
                var arr2=line.split(":")[1].split("|");
                if(floor[arr2[0]]&&floor[arr2[0]][arr2[1]])
                {
                    var obj=floor[arr2[0]][arr2[1]];
                    obj.sourceSide=arr2[2];
                    obj.sourceType=arr2[3];
                    obj.sourceUrl=arr2[4];
                }

            }
        }

    }
    return (len);//查找到文件末尾
}
function handleBuilding()
{
    var len=0;
    for(var key in obj_building)
    {
        len++;
    }
    for(var key in obj_building)
    {
        var int_key=parseInt(key);
        var floor=obj_building[key];
        //寻找上下两层，这里假设obj_building是没有顺序的
        var int_key_shang=int_key,int_key_xia=int_key;
        var floor_shang=null,floor_xia=null;
        //for(var i=int_key;i<)
        for(var key2 in obj_building)
        {
            var int_key2=parseInt(key2);
            if((int_key2>int_key)&&(int_key_shang==int_key||int_key_shang>int_key2))
            {
                int_key_shang=int_key2;
                floor_shang=obj_building[key2];
            }
            if((int_key2<int_key)&&(int_key_xia==int_key||int_key_xia<int_key2))
            {
                int_key_shang=int_key2;
                floor_xia=obj_building[key2];
            }
        }
        for(var i=1;i<=seg_z;i++)//对于每一行房间
        {
            var row=floor[i+""];
            if(row)//如果有这一行
            {
                for(var j=0;j<=seg_x;j++)//对于每一个房间
                {
                    var room=row[j+""];
                    //根据房间的类型不同决定是否要查看其周围的房间
                    if(room)
                    {
                        if(room.type=="0"||room.type=="#"||room.type=="^")//普通房间，要考虑前后左右的四个房间状态，要考虑资源放置
                        {
                            //考虑前面
                            if(floor[i-1+""]&&floor[i-1+""][j+""])
                            {
                                var room2=floor[i-1+""][j+""];
                                if(!room2)//如果没有东西，就是普通墙壁
                                {
                                    //网格类型，实例名字，位置，姿态
                                    drawMesh("wall","wall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }

                                else if(room2.type=="|"||room2.type=="+")
                                {
                                    drawMesh("hole","hole_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                                else if(room2.type=="0"||room2.type=="#"||room2.type=="^")//旁边也是一个房间则合并房间，不绘制墙壁
                                {

                                }
                                else//默认绘制墙壁
                                {
                                    drawMesh("wall","wall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                            }
                            else//默认绘制墙壁
                            {
                                drawMesh("wall","wall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5-i)*sizez)
                                    ,new BABYLON.Vector3(0,0,0))
                            }
                            //后面
                            if(floor[i+1+""]&&floor[i+1+""][j+""])
                            {
                                var room2=floor[i+1+""][j+""];
                                if(!room2)//如果没有东西，就是普通墙壁
                                {
                                    //网格类型，实例名字，位置，姿态
                                    drawMesh("wall","wall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }

                                else if(room2.type=="|"||room2.type=="+")
                                {
                                    drawMesh("hole","hole_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                                else if(room2.type=="0"||room2.type=="#"||room2.type=="^")//旁边也是一个房间则合并房间，不绘制墙壁
                                {

                                }
                                else//默认绘制墙壁
                                {
                                    drawMesh("wall","wall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                            }
                            else//默认绘制墙壁
                            {
                                drawMesh("wall","wall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5-i)*sizez)
                                    ,new BABYLON.Vector3(0,0,0))
                            }
                            //左边
                            if(floor[i+""][j-1+""])
                            {
                                var room2=floor[i+""][j-1+""];
                                if(!room2)//如果没有东西，就是普通墙壁
                                {
                                    //网格类型，实例名字，位置，姿态
                                    drawMesh("wall","wall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }

                                else if(room2.type=="-"||room2.type=="+")
                                {
                                    drawMesh("hole","hole_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                                else if(room2.type=="0"||room2.type=="#"||room2.type=="^")//旁边也是一个房间则合并房间，不绘制墙壁
                                {

                                }
                                else//默认绘制墙壁
                                {
                                    drawMesh("wall","wall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                            }
                            else//默认绘制墙壁
                            {
                                drawMesh("wall","wall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5)*sizex,int_key*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(0,Math.PI/2,0))
                            }
                            //右边
                            if(floor[i+""][j+1+""])
                            {
                                var room2=floor[i+""][j+1+""];
                                if(!room2)//如果没有东西，就是普通墙壁
                                {
                                    //网格类型，实例名字，位置，姿态
                                    drawMesh("wall","wall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }

                                else if(room2.type=="-"||room2.type=="+")
                                {
                                    drawMesh("hole","hole_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                                else if(room2.type=="0"||room2.type=="#"||room2.type=="^")//旁边也是一个房间则合并房间，不绘制墙壁
                                {

                                }
                                else//默认绘制墙壁
                                {
                                    drawMesh("wall","wall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                            }
                            else//默认绘制墙壁
                            {
                                drawMesh("wall","wall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5)*sizex,int_key*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(0,Math.PI/2,0))
                            }
                            //上面
                            if(room.type=="^")
                            {
                                drawMesh("hole","hole_y_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key+0.5)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))
                                //还要负责向上连接
                                if(floor_shang)
                                {
                                    for(var k=int_key+1;k<floor_shang;k++)
                                    {
                                        drawMesh("channel","channel_^_"+k+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(k)*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(Math.PI/2,0,0))
                                    }
                                }
                                //暂时不设置弹射器，使用失重模式
                            }
                            else
                            {
                                drawMesh("wall","wall_y_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key+0.5)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))
                            }
                            //下面
                            if(room.type=="#")
                            {
                                drawMesh("hole","hole_y-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key-0.5)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))
                            }
                            else
                            {
                                drawMesh("wall","wall_y-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key-0.5)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))
                            }
                            //翻转方向会影响碰撞检测吗？
                            //最后处理资源
                        }
                        else if(room.type=="-"||room.type=="+"||room.type=="|")//表示通道的三种符号，要考虑其前后左右的位置
                        {
                            if(room.type=="-")
                            {//横向长通道
                                drawMesh("channel","channel_-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(0,Math.PI/2,0))
                            }
                            else if(room.type=="|")
                            {//纵向长通道
                                drawMesh("channel","channel_|_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(0,0,0))
                            }
                            else
                            {//十字连接件
                                //考虑前面
                                if(floor[i-1+""]&&floor[i-1+""][j+""])
                                {
                                    var room2=floor[i-1+""][j+""];
                                    if(!room2)//如果没有东西，就是普通墙壁
                                    {
                                        //网格类型，实例名字，位置，姿态
                                        drawMesh("smallwall","smallwall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5/3-i)*sizez)
                                            ,new BABYLON.Vector3(0,0,0))
                                    }

                                    else if(room2.type=="|"||room2.type=="+"||room2.type=="0"||room2.type=="#"||room2.type=="^")
                                    {//短通道自带位移
                                        drawMesh("shortchannel","shortchannel_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,0,0))
                                    }
                                    else//默认绘制小型墙壁
                                    {
                                        drawMesh("smallwall","smallwall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5/3-i)*sizez)
                                            ,new BABYLON.Vector3(0,0,0))
                                    }
                                }
                                else//默认绘制小型墙壁
                                {
                                    drawMesh("smallwall","smallwall_z_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(0.5/3-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                                //后面
                                if(floor[i+1+""]&&floor[i+1+""][j+""])
                                {
                                    var room2=floor[i+1+""][j+""];
                                    if(!room2)//如果没有东西，就是普通墙壁
                                    {
                                        //网格类型，实例名字，位置，姿态
                                        drawMesh("smallwall","smallwall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5/3-i)*sizez)
                                            ,new BABYLON.Vector3(0,0,0))
                                    }

                                    else if(room2.type=="|"||room2.type=="+"||room2.type=="0"||room2.type=="#"||room2.type=="^")
                                    {
                                        drawMesh("shortchannel","shortchannel_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI,0))
                                    }
                                    else//默认绘制小型墙壁
                                    {
                                        drawMesh("smallwall","smallwall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5/3-i)*sizez)
                                            ,new BABYLON.Vector3(0,0,0))
                                    }
                                }
                                else//默认绘制小型墙壁
                                {
                                    drawMesh("smallwall","smallwall_z-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3(j*sizex,int_key*sizey,(-0.5/3-i)*sizez)
                                        ,new BABYLON.Vector3(0,0,0))
                                }
                                //左边
                                if(floor[i+""][j-1+""])
                                {
                                    var room2=floor[i+""][j-1+""];
                                    if(!room2)//如果没有东西，就是小型墙壁
                                    {
                                        //网格类型，实例名字，位置，姿态
                                        drawMesh("smallwall","smallwall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI/2,0))
                                    }

                                    else if(room2.type=="-"||room2.type=="+"||room2.type=="0"||room2.type=="#"||room2.type=="^")
                                    {
                                        drawMesh("shortchannel","shortchannel_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,-Math.PI/2,0))
                                    }
                                    else//默认绘制小型墙壁
                                    {
                                        drawMesh("smallwall","smallwall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI/2,0))
                                    }
                                }
                                else//默认绘制小型墙壁
                                {
                                    drawMesh("smallwall","smallwall_x-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j-0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                                //右边
                                if(floor[i+""][j+1+""])
                                {
                                    var room2=floor[i+""][j+1+""];
                                    if(!room2)//如果没有东西，就是普通墙壁
                                    {
                                        //网格类型，实例名字，位置，姿态
                                        drawMesh("smallwall","smallwall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI/2,0))
                                    }

                                    else if(room2.type=="-"||room2.type=="+"||room2.type=="0"||room2.type=="#"||room2.type=="^")
                                    {
                                        drawMesh("shortchannel","shortchannel_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI/2,0))
                                    }
                                    else//默认绘制墙壁
                                    {
                                        drawMesh("smallwall","smallwall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                            ,new BABYLON.Vector3(0,Math.PI/2,0))
                                    }
                                }
                                else//默认绘制墙壁
                                {
                                    drawMesh("smallwall","smallwall_x_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j+0.5/3)*sizex,int_key*sizey,(-i)*sizez)
                                        ,new BABYLON.Vector3(0,Math.PI/2,0))
                                }
                                //上面
                                drawMesh("smallwall","smallwall_y_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key+0.5/3)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))
                                //下面
                                drawMesh("smallwall","smallwall_y-_"+int_key+"_"+i+"_"+j,new BABYLON.Vector3((j)*sizex,(int_key-0.5/3)*sizey,(-i)*sizez)
                                    ,new BABYLON.Vector3(Math.PI/2,0,0))

                            }
                        }
                    }
                }
            }
        }
    }
}