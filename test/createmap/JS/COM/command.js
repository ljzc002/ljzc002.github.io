//一些不依赖UI的命令，计划通过console执行
var command={}
command.loadMap=function(mapName)
{
    var url=UrlHead+"/DATA/"+mapName+".js";
    newland.importScripts(url);
    MyGame.mapData=tempData;//用全局变量过度数据，这个只在world初始化时使用，其后由world同步给所有人，visitor接替world时也使用它内存中的数据。
    //MyGame.socket.emit("worldReady");//把这个放在world用户的loop里？？！！
    MyGame.webGLStart();
}
var clm=command.loadMap;

//导出地形，只用于地形构造器
command.exportObjGround=function()
{
    FrameGround.ExportObjGround(obj_ground);
}
var ceg=command.exportObjGround;

//导入地形，要适用于地形构造器和moba主程序
command.importObjGround=function(func)
{
    FrameGround.ImportObjGround("../../ASSETS/SCENE/","ObjGround3.babylon",func,obj_ground);
}
var cig=command.importObjGround;
command.importObjGround2=function(func)
{
    FrameGround.ImportObjGround(MyGame.mapData.mapScenePath,MyGame.mapData.mapSceneName,func,obj_ground);
}
var cig2=command.importObjGround2;
//注，这里如果设置var cig=command.importObjGround();的意思是cig为importObjGround的返回值
// ，而不是说cig为importObjGround的“执行”，importObjGround只会在cig定义时执行一次，而不在调用cig时执行

//切换地形材质
command.changeGroundMaterial=function(id)
{
        obj_ground["ground1"].ground_base.material=obj_ground["ground1"].obj_mat[id];
}
var ccm=command.changeGroundMaterial;

//在一定距离范围内梯度随机变化地形高度
command.TransVertexGradientlyByDistance=function(arr_pos,dis,arr_ga)
{
    obj_ground["ground1"].TransVertexGradientlyByDistance(new BABYLON.Vector3(arr_pos[0],arr_pos[1],arr_pos[2]),dis
        ,arr_ga);
}
var ct1=command.TransVertexGradientlyByDistance;
//在函数划定范围内同等变化地形高度
command.TransVertexHeightlyByFunc=function(isInArea,height)
{
    obj_ground["ground1"].TransVertex(isInArea,height)
}
var ct2=command.TransVertexHeightlyByFunc;
//刷新isInArea方法
command.RefreshisInArea =function(height)
{
    newland.importScripts("../../JS/COM/additionalscript.js");
}
var cri=command.RefreshisInArea;
//在指定位置建立斜坡
command.TransSlopeByPosition=function(x,z,dir,length,width,h1,h2)
{
    obj_ground["ground1"].TransSlopeByPosition(x,z,dir,length,width,h1,h2)
}
var ct3=command.TransSlopeByPosition;