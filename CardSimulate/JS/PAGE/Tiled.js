/**
 * Created by lz on 2018/9/25.
 */
var mesh_tiledGround=null;//地面网格，但不是真的棋盘网格，而是棋盘网格的父网格，用来调整卡牌高度
function MakeTileds(type,sizex,sizey)//类型0表示默认的正方形，x向格数，y向格数
{
    if(type==0)
    {

        var obj_p={xmin:-30,xmax:30,zmin:-30,zmax:30,precision :{"w" : 2,"h" : 2},subdivisions:{"w" : 20,"h" : 20}
        };
        var tiledGround = new BABYLON.MeshBuilder.CreateTiledGround("mesh_tiledGround1"
                ,obj_p,scene);
        tiledGround.position.y=-1;//这个下沉高度，应该比卡牌高度的一半多一点，那么卡牌应该竖立还是水平平铺？
        //平铺时如何确定卡牌的朝向，如果跟随玩家的视角变化，又会显得凌乱
        tiledGround.parent=mesh_tiledGround;
        mesh_tiledGround.tiled=tiledGround;

        // Create differents materials
        var whiteMaterial = new BABYLON.StandardMaterial("White", scene);
        whiteMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        var blackMaterial = new BABYLON.StandardMaterial("Black", scene);
        blackMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        // Create Multi Material
        var multimat = new BABYLON.MultiMaterial("multi", scene);
        multimat.subMaterials.push(whiteMaterial);
        multimat.subMaterials.push(blackMaterial);
        // Part 3 : Apply the multi material
        // Define multimat as material of the tiled ground
        tiledGround.material = multimat;

        // Needed variables to set subMeshes
        var verticesCount = tiledGround.getTotalVertices();
        var tileIndicesLength = tiledGround.getIndices().length / (obj_p.subdivisions.w * obj_p.subdivisions.h);
        // Set subMeshes of the tiled ground
        tiledGround.subMeshes = [];
        var base = 0;
        for (var row = 0; row < obj_p.subdivisions.h; row++) {
            for (var col = 0; col < obj_p.subdivisions.w; col++) {
                tiledGround.subMeshes.push(new BABYLON.SubMesh(row%2 ^ col%2, 0, verticesCount, base , tileIndicesLength, tiledGround));
                base += tileIndicesLength;
            }
        }
    }
}
arr_tilednodes=[];
mesh_tiledCard=null;
function MakeTileds2(type,sizex,sizez)//换一种地块构造方式，想到tiledGround事实上并没有必要性，如果忽略掉性能上可能存在的优势
{
    //给几种遮罩层建立材质：蓝色、红色、黄色、绿色、全透明
    var mat_alpha_blue=new BABYLON.StandardMaterial("mat_alpha_blue", scene);
    mat_alpha_blue.diffuseTexture = new BABYLON.Texture("../ASSETS/IMAGE/LANDTYPE/alpha_blue.png",scene);
    mat_alpha_blue.diffuseTexture.hasAlpha=true;
    mat_alpha_blue.useAlphaFromDiffuseTexture=true;
    //mat_alpha_blue.hasVertexAlpha=true;
    //mat_alpha_blue.diffuseColor = new BABYLON.Color3(0, 0,1);
    //mat_alpha_blue.alpha=0.2;//不透明度
    mat_alpha_blue.useLogarithmicDepth=true;//为了和卡牌之间正常显示，它也必须这样设置深度？
    MyGame.materials.mat_alpha_blue=mat_alpha_blue;
    var mat_alpha_red=new BABYLON.StandardMaterial("mat_alpha_red", scene);
    mat_alpha_red.diffuseTexture = new BABYLON.Texture("../ASSETS/IMAGE/LANDTYPE/alpha_red.png",scene);
    mat_alpha_red.diffuseTexture.hasAlpha=true;
    mat_alpha_red.useAlphaFromDiffuseTexture=true;
    //mat_alpha_red.diffuseColor = new BABYLON.Color3(1, 0,0);
    //mat_alpha_red.alpha=0.2;//不透明度
    mat_alpha_red.useLogarithmicDepth=true;
    MyGame.materials.mat_alpha_red=mat_alpha_red;
    var mat_alpha_green=new BABYLON.StandardMaterial("mat_alpha_green", scene);
    mat_alpha_green.diffuseTexture = new BABYLON.Texture("../ASSETS/IMAGE/LANDTYPE/alpha_green.png",scene);
    mat_alpha_green.diffuseTexture.hasAlpha=true;
    mat_alpha_green.useAlphaFromDiffuseTexture=true;
    //mat_alpha_green.diffuseColor = new BABYLON.Color3(0, 1,0);
    //mat_alpha_green.alpha=0.2;//不透明度
    mat_alpha_green.useLogarithmicDepth=true;
    MyGame.materials.mat_alpha_green=mat_alpha_green;
    var mat_alpha_yellow=new BABYLON.StandardMaterial("mat_alpha_yellow", scene);
    mat_alpha_yellow.diffuseTexture = new BABYLON.Texture("../ASSETS/IMAGE/LANDTYPE/alpha_yellow.png",scene);
    mat_alpha_yellow.diffuseTexture.hasAlpha=true;
    mat_alpha_yellow.useAlphaFromDiffuseTexture=true;
    //mat_alpha_yellow.diffuseColor = new BABYLON.Color3(1, 1,0);
    //mat_alpha_yellow.alpha=0.2;//不透明度
    mat_alpha_yellow.useLogarithmicDepth=true;
    MyGame.materials.mat_alpha_yellow=mat_alpha_yellow;
    var mat_alpha_null=new BABYLON.StandardMaterial("mat_alpha_null", scene);//或者直接将遮罩设为不可见？
    mat_alpha_null.diffuseColor = new BABYLON.Color3(1, 1,1);
    mat_alpha_null.alpha=0;//不透明度
    mat_alpha_null.useLogarithmicDepth=true;
    MyGame.materials.mat_alpha_null=mat_alpha_null;

    mesh_tiledCard=new BABYLON.Mesh("mesh_tiledCard",scene);//所有单位的父元素
    mesh_tiledCard.parent=mesh_tiledGround;
    if(type==0)// 两层循环
    {
        var obj_p={xmin:-30,xmax:30,zmin:-30,zmax:30,precision :{"w" : 2,"h" : 2},subdivisions:{"w" : sizex,"h" : sizez}
        };
        var heightp=(obj_p.zmax-obj_p.zmin)/sizez;//每一个小块的高度
        var widthp=(obj_p.xmax-obj_p.xmin)/sizex;
        obj_p.heightp=heightp;
        obj_p.widthp=widthp;
        mesh_tiledGround.obj_p=obj_p;//将地块的初始化参数记录下来

        //认为行数从上向下延伸，列数从左向右延伸
        for(var i=0;i<sizez;i++)//从0开始还是从1开始？?
        {//对于每一列？->还是一行一行处理更好
            var z=obj_p.zmax-(heightp*i+0.5*heightp);
            var arr_rownodes=[];
            for(var j=0;j<sizex;j++)
            {
                var x=obj_p.xmin+(widthp*j+0.5*widthp);
                //建立一个显示地面纹理的地块，需要把地块也做成一个类吗？
                var mesh_tiled=new BABYLON.MeshBuilder.CreateGround("mesh_tiled_"+i+"_"+j
                    ,{width:widthp,height:heightp,subdivisionsX : 2,subdivisionsY : 2,updatable:false},scene);
                mesh_tiled.index_row=i;
                mesh_tiled.index_col=j;
                mesh_tiled.heightp=heightp;
                mesh_tiled.widthp=widthp;
                mesh_tiled.position.z=z;
                mesh_tiled.position.x=x;
                mesh_tiled.position.y=-1;
                mesh_tiled.parent=mesh_tiledGround;
                mesh_tiled.renderingGroupId=2;
                //随机给这个地块分配一种地形，参考DataWar的方式？？
                var landtype=newland.RandomChooseFromObj(arr_landtypes);
                mesh_tiled.landtype=landtype.name;
                mesh_tiled.cost=arr_landtypes[landtype.name].cost;
                if(MyGame.materials["mat_"+landtype.name])
                {
                    mesh_tiled.material=MyGame.materials["mat_"+landtype.name];
                }
                else
                {
                    var mat_tiled = new BABYLON.StandardMaterial("mat_"+landtype.name,scene);
                    mat_tiled.diffuseTexture = new BABYLON.Texture(landtype.Url,scene);
                    mat_tiled.useLogarithmicDepth=true;
                    MyGame.materials["mat_"+landtype.name]=mat_tiled;
                    mesh_tiled.material=mat_tiled;
                }
                var mesh_mask=new BABYLON.MeshBuilder.CreatePlane("mesh_mask_"+i+"_"+j
                    ,{width:widthp-0.1,height:heightp-0.1},scene);
                mesh_mask.material=MyGame.materials.mat_alpha_null;//在不显示范围时，所有的遮罩默认不可见
                mesh_mask.parent=mesh_tiled;
                mesh_tiled.mask=mesh_mask;
                mesh_mask.rotation.x=Math.PI*0.5;
                mesh_mask.position.y=0.1;
                mesh_mask.renderingGroupId=2;
                mesh_mask.isPickable=false;
                arr_rownodes.push(mesh_tiled);
            }
            arr_tilednodes.push(arr_rownodes);
        }
    }
}
arr_nodepath={};//使用它保存范围内每一个节点的消耗值，与路径，这个变量是冗余的吗？
arr_DisplayedMasks=[];
arr_noderange={};//保存每个可能被影响的节点（红色材质），它不可以包含arr_nodepath中的节点
function DisplayRange(card)//显示这个card的范围
{
    //首先要检查是否有已经显示的遮罩
    if(arr_DisplayedMasks.length>0)
    {
        HideAllMask();//这里也会清空card_Closed2
    }
    card_Closed2=card;
    card.isPicked=true;
    if(card.workstate!="wait")
    {
        return;//如果不在待命状态则不予显示范围遮罩
    }
    var node_start=FindNode(card.mesh.position);//找到点击的棋子所在的格子
    //var str=node_start.name;
    arr_nodepath={};
    arr_noderange={};
    arr_nodepath[node_start.name]={cost:0,path:[node_start.name],node:node_start};
    //arr_nodepath={str:{cost:0,path:[node_start.name]}};
    //node_start.open=true;
    var list_node=[];
    list_node.push(node_start);//对于每一个节点，如果它周围所有的格子都被计算过了，则设为close
    var power=card.speed;
    var costg=0;//消耗计量器，计算要分成两段，第一段是移动范围，第二段是影响范围（超过移动范围之后，所有地块消耗都视为1）
    //var path=[node_start.name];//只在路径里保存名称，这样可以用concat??

    for(var i=0;i<list_node.length;i++)//这种变长的顺序遍历需要使用数组，而后面的按名称选择又要用到对象属性-》所以保持两套变量？？？？
    {
        var arr_node_neighbor=FindNeighbor(list_node[i]);
        var len=arr_node_neighbor.length;//
        for(var j=0;j<len;j++)
        {
            var nextnode=arr_node_neighbor[j];
            costg=arr_nodepath[list_node[i].name].cost;
            //在计算移动时有两个思路，一是设定每一种地面的行动力消耗，二是设定每一种单位对每一种地形的行动能力，看来第一种更简单
            //不能算上第一个起始节点的消耗
            costg+=nextnode.cost;
            //path.push(nextnode);
            var path2=arr_nodepath[list_node[i].name].path.concat();//去这个邻居节点的上个节点（也就是自家节点）的路径
            path2.push(nextnode.name);//移动区域和范围区域的路径应该是连续的
            if(costg>power)//如果消耗超过了移动力-》要考虑影响范围！！！！
            {
                if(arr_nodepath[nextnode.name])//如果使用其他方式能够到达这个节点
                {
                    continue;//考虑下一个邻居
                }
                else//使用考虑影响范围
                {
                    arr_noderange[nextnode.name]={cost:1,path:[nextnode.name],path0:path2,node:nextnode};//那么这个点可能是影响范围内的起始节点
                }
            }
            else
            {


                if(arr_nodepath[nextnode.name])//如果已经到达过这个节点，则要对消耗进行比较
                {
                    if(arr_nodepath[nextnode.name].cost>costg)//找到了到达这个点的更优方式
                    {
                        arr_nodepath[nextnode.name]={cost:costg,path:path2,node:nextnode};
                    }
                    else{//新的到达这个节点的方式并不更优
                        continue;//考虑下一个邻居
                    }
                }
                else//如果从未到达这个节点，则要计算到这个节点为止的消耗
                {
                    if(arr_noderange[nextnode.name])//如果这个节点在以前被加入了影响节点，但又被证明可以达到
                    {
                        delete arr_noderange[nextnode.name];
                    }
                    arr_nodepath[nextnode.name]={cost:costg,path:path2,node:nextnode};
                    list_node.push(nextnode);
                }
            }
        }
    }
    //寻找单位的影响范围
    var range=card.range;
    var list_noderange=[];
    for(var key in arr_noderange)
    {
        list_noderange.push(arr_noderange[key].node)
    }
    for(var i=0;i<list_noderange.length;i++)
    {
        var arr_node_neighbor=FindNeighbor(list_noderange[i]);
        var len=arr_node_neighbor.length;
        for(var j=0;j<len;j++)
        {
            costg=arr_noderange[list_noderange[i].name].cost;
            costg+=1;
            if(costg>range)
            {
                break;//因为影响范围的cost都是相同的，所以只要有一个邻居超过限度，则所有邻居都不可用
            }
            //如果没有超限
            var nextnode = arr_node_neighbor[j];
            if(arr_nodepath[nextnode.name])//如果这个节点在可到达区域，则必然不在范围区域
            {
                continue;
            }
            else
            {
                var path2=arr_noderange[list_noderange[i].name].path.concat();//从起始点去这个邻居节点的上个节点（也就是自家节点）的路径
                path2.push(nextnode.name);
                if(arr_noderange[nextnode.name])//如果以前曾经到达这个节点
                {
                    if(arr_noderange[nextnode.name].cost>costg)
                    {
                        arr_noderange[nextnode.name]={cost:costg,path:path2,node:nextnode,path0:arr_noderange[list_noderange[i].name].path0};
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    arr_noderange[nextnode.name]={cost:costg,path:path2,node:nextnode,path0:arr_noderange[list_noderange[i].name].path0};
                    list_noderange.push(nextnode);
                }
            }
        }
    }
    DisplayAllMask()

}
function FindNode(pos)//根据pos找到对应的地块
{
    var obj_p=mesh_tiledGround.obj_p;
    var num_row=Math.floor((obj_p.zmax-pos.z)/obj_p.heightp);//暂时不考虑卡牌脱出棋盘之外的情况
    var num_col=Math.floor((pos.x-obj_p.xmin)/obj_p.widthp);
    var node=arr_tilednodes[num_row][num_col];
    return node;
}
function FindNeighbor(node)//寻找一个地块周围的所有地块（最多四个）
{
    var arr_node_neighbor=[]
    var total_row=arr_tilednodes.length;
    var total_col=arr_tilednodes[0].length;
    var index_row=node.index_row;
    var index_col=node.index_col;
    //上面的
    var i=index_row-1;
    if(i>=0)
    {
        arr_node_neighbor.push(arr_tilednodes[i][index_col]);
    }
    //右面的
    i=index_col+1;
    if(i<total_col)
    {
        arr_node_neighbor.push(arr_tilednodes[index_row][i]);
    }
    //下面的
    i=index_row+1;
    if(i<total_row)
    {
        arr_node_neighbor.push(arr_tilednodes[i][index_col]);
    }
    //左面的
    i=index_col-1;
    if(i>=0)
    {
        arr_node_neighbor.push(arr_tilednodes[index_row][i]);
    }
    return arr_node_neighbor;
}
function HideAllMask()//隐藏所有已经显示的mask，并且取消单位的选中
{
    var len=arr_DisplayedMasks.length;
    for(var i=0;i<len;i++)
    {
        arr_DisplayedMasks[i].material=MyGame.materials.mat_alpha_null;
    }
    arr_DisplayedMasks=[];
    arr_nodepath={};
    arr_noderange={};
    noPicked(card_Closed2);
    card_Closed2=null;
}
function DisplayAllMask()//绘制出移动范围和影响范围的遮罩
{
    for(var key in arr_nodepath)
    {
        if(arr_nodepath[key].cost>0)
        {
            arr_nodepath[key].node.mask.material=MyGame.materials.mat_alpha_blue;
        }
        arr_DisplayedMasks.push(arr_nodepath[key].node.mask);
    }
    for(var key in arr_noderange)
    {
        arr_noderange[key].node.mask.material=MyGame.materials.mat_alpha_red;
        arr_DisplayedMasks.push(arr_noderange[key].node.mask);
    }
}

function  PickTiled(pickInfo)//点击地块
{
    //不论是否有范围遮罩，点击地块就笑显示地块属性？
    var mesh=pickInfo.pickedMesh;
    if(arr_DisplayedMasks.length>0&&card_Closed2)//如果存在地块遮罩，并且有选中的单位
    {
        //如果点击的另一个地块里已经有一个单位，这里认为一个地块只能有一个单位，所以要切换被选中的单位
        var mesh_unit=TiledHasCard(mesh);
        if(mesh_unit)//
        {
            if(mesh_unit.name!=card_Closed2.mesh.name)
            {
                PickCard2(mesh_unit.card);
            }
            else//如果点击的是自己的范围！！拉近卡片
            {
                GetCardClose2(mesh_unit.card);
            }
            return;
        }
        //如果没有点击到别的单位的范围
        //点击影响范围也自动寻路过去？
        //if(arr_noderange[mesh.name])//如果在影响范围内
        if(mesh.mask.material.name=="mat_alpha_red")
        {
            //先清空可能存在的黄色路径
            for(var key in arr_noderange)
            {
                var node=arr_noderange[key].node;
                if(node.mask.material.name=="mat_alpha_yellow")
                {
                    node.mask.material=MyGame.materials.mat_alpha_blue;
                }
            }
            if(card_Closed2.workstate=="wait")//如果在等待状态，点击红地块是移动到相应移动边界的意思
            {
                var path=arr_noderange[mesh.name].path0;//取到达这一点的路径
                var len=path.length;
                for(var i=0;i<len;i++)
                {
                    if(arr_nodepath[path[i]]&&!TiledHasCard(arr_nodepath[path[i]].node))
                    {
                        arr_nodepath[path[i]].node.mask.material=MyGame.materials.mat_alpha_yellow;//走过的路径地块标为黄色
                    }
                }
            }
            else if(card_Closed2.workstate=="moved")//如果已经移动了，那么这次点击就是发动效果
            {

            }
        }
        else if(mesh.mask.material.name=="mat_alpha_blue")//如果这个被点击的地块在选中单位的移动范围内
        {
            //先清空可能存在的黄色路径
            for(var key in arr_noderange)
            {
                var node=arr_noderange[key].node;
                if(node.mask.material.name=="mat_alpha_yellow")
                {
                    node.mask.material=MyGame.materials.mat_alpha_blue;
                }
            }
            var path=arr_nodepath[mesh.name].path;//取到达这一点的路径
            var len=path.length;
            for(var i=0;i<len;i++)
            {
                if(arr_nodepath[path[i]]&&!TiledHasCard(arr_nodepath[path[i]].node))//有单位存在的格子不置黄
                {
                    arr_nodepath[path[i]].node.mask.material=MyGame.materials.mat_alpha_yellow;//走过的路径地块标为黄色
                }
            }
        }
        else if(mesh.mask.material.name=="mat_alpha_yellow")
        {
            var path=arr_nodepath[mesh.name].path;//取到达这一点的路径，点到黄色地块的路径必然是可通行的？？
            CardMove2Tiled(path);
        }
        else//点击移动范围外的点
        {
            HideAllMask();
        }
    }
    else{
        //如果在没有选中棋子时，点击了一个存在棋子的地块
        var mesh_unit=TiledHasCard(mesh);
        if(mesh_unit)//
        {
            if(mesh_unit.card)
            {
                PickCard2(mesh_unit.card);
            }
            return;
        }
    }
}
function TiledHasCard(node)//寻找这个地块之内的单位
{
    var units=mesh_tiledCard._children;//这里存储的是卡牌对象的网格
    var len=units.length;
    var xmin=node.position.x-node.widthp/2;
    var xmax=node.position.x+node.widthp/2;
    var zmin=node.position.z-node.heightp/2;
    var zmax=node.position.z+node.heightp/2;
    for(var i=0;i<len;i++)
    {
        var unit=units[i];
        var pos=unit.position;
        if(pos.x<xmax&&pos.x>xmin&&pos.z>zmin&&pos.z<zmax)//如果发现这个单位在这个地块以内
        {
            return unit
        }
    }
    return false;
}
function CardMove2Tiled(path)
{
    MyGame.flag_view="first_ani";
    var len=path.length;
    //预计走一格用0.5秒15帧
    var frame_total=len*15;
    var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var keys1=[];
    for(var i=0;i<len;i++)
    {
        var pos=arr_nodepath[path[i]].node.position.clone();
        pos.y=0;
        keys1.push({frame:i*15,value:pos});
    }
    //var keys1=[{frame:0,value:MyGame.player.mesh.position.clone()},{frame:30,value:pos}];
    animation3.setKeys(keys1);
    card_Closed2.mesh.animations.push(animation3);
    MyGame.anicount=1;
    var len=arr_DisplayedMasks.length;
    for(var i=0;i<len;i++)
    {
        arr_DisplayedMasks[i].material=MyGame.materials.mat_alpha_null;//这个数组里存的真的只是遮罩
    }
    arr_DisplayedMasks=[];//清空它并不会影响移动和影响范围的保存！！！！
    scene.beginAnimation(card_Closed2.mesh, 0, frame_total, false,1,function(){
        MyGame.anicount--;
        if(MyGame.anicount==0)
        {
            MyGame.flag_view="first_lock";
            //HideAllMask();

            card_Closed2.workstate="moved";
            DisplayRange2(card_Closed2,card_Closed2.range);//同一个单位使用不同技能可能有不同的影响范围
        }
    });
}
var arr_noderange2={}//移动之后计算范围用的数据结构
function DisplayRange2(card,range)//只显示移动后的影响范围
{
    var node_start=FindNode(card.mesh.position);
    arr_noderange2={};
    arr_noderange2[node_start.name]={cost:0,path:[node_start.name],node:node_start};
    var costg=0;
    var range=card.range;
    var list_noderange=[node_start];
    for(var i=0;i<list_noderange.length;i++)
    {
        var arr_node_neighbor=FindNeighbor(list_noderange[i]);
        var len=arr_node_neighbor.length;
        for(var j=0;j<len;j++)
        {
            costg=arr_noderange2[list_noderange[i].name].cost;
            costg+=1;
            if(costg>range)
            {
                break;//因为影响范围的cost都是相同的，所以只要有一个邻居超过限度，则所有邻居都不可用
            }
            //如果没有超限
            var nextnode = arr_node_neighbor[j];
            var path2=arr_noderange2[list_noderange[i].name].path.concat();
            path2.push(nextnode.name);
            if(arr_noderange2[nextnode.name])//如果以前曾经到达这个节点
            {
                if(arr_noderange2[nextnode.name].cost>costg)//这里还是否有必要计算路径？？
                {
                    arr_noderange2[nextnode.name]={cost:costg,path:path2,node:nextnode};
                }
                else
                {
                    continue;
                }
            }
            else
            {
                arr_noderange2[nextnode.name]={cost:costg,path:path2,node:nextnode};
                list_noderange.push(nextnode);
            }
        }
    }
    for(var key in arr_noderange2)
    {
        arr_noderange2[key].node.mask.material=MyGame.materials.mat_alpha_red;
        arr_DisplayedMasks.push(arr_noderange2[key].node.mask);
    }
}