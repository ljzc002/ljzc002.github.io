<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>尝试建立一种阶梯式的地面网格-使用脚本生成高低起伏的地形</title>
    <link href="../../CSS/newland.css" rel="stylesheet">
    <script src="../../JS/LIB/babylon.40v.all.max.js"></script>
    </head>
    <body>
    <div id="div_allbase">
    <canvas id="renderCanvas"></canvas>
    <div id="fps" style="z-index: 302;"></div>

    </div>
    </body>
    <script>
var VERSION=1.0,AUTHOR="lz_newland@163.com";
var machine,canvas,engine,scene,gl,MyGame;
canvas = document.getElementById("renderCanvas");
engine = new BABYLON.Engine(canvas, true);
engine.displayLoadingUI();
gl=engine._gl;//决定在这里结合使用原生OpenGL和Babylon.js;
scene = new BABYLON.Scene(engine);
var divFps = document.getElementById("fps");
var serverip,httpport,wsport,userid,UrlHead,WsHead,token;
window.onload=beforewebGL;
function beforewebGL()
{
    if(engine._webGLVersion==2.0)//输出ES版本
    {
        console.log("ES3.0");
    }
    else{
        console.log("ES2.0");
    }

    webGLStart();
}
function OptimizeMesh(mesh)
{
    mesh.convertToFlatShadedMesh();//使用顶点颜色计算代替片元颜色计算
    mesh.freezeWorldMatrix();//冻结世界坐标系
    // mesh.material.needDepthPrePass = true;//启用深度预通过
    //mesh.convertToUnIndexedMesh();//使用三角形绘制代替索引绘制
}
var arr_instance=[];
var fsUI=BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
var segs_x=100;//横向格子数量
var segs_y=100;//纵向格子数量
//var spriteManager = new BABYLON.SpriteManager("spriteManager", png, (segs_x+1)*(segs_y+1)*7, 24, scene);
//spriteManager.renderingGroupId=2;
var size_per=1;//每个格子的尺寸

function webGLStart()
{
    //光照
    var light0 = new BABYLON.HemisphericLight("light0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1,1,1);//这道“颜色”是从上向下的，底部收到100%，侧方收到50%，顶部没有
    light0.specular = new BABYLON.Color3(0,0,0);
    light0.groundColor = new BABYLON.Color3(1,1,1);//这个与第一道正相反

    var camera0= new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 10, -30), scene);
    camera0.minZ=0.1;
    camera0.attachControl(canvas,true);
    scene.activeCameras.push(camera0);
    var mat_green=new BABYLON.StandardMaterial("mat_green", scene);
    mat_green.diffuseColor = new BABYLON.Color3(0, 1, 0);
    mat_green.freeze();
    //三个参照物
    var mesh_base=new BABYLON.MeshBuilder.CreateSphere("mesh_base",{diameter:1},scene);
    mesh_base.material=mat_green;
    mesh_base.position.x=0;
    mesh_base.renderingGroupId=2;
    //mesh_base.layerMask=2;
    var mesh_base1=new BABYLON.MeshBuilder.CreateSphere("mesh_base1",{diameter:1},scene);
    mesh_base1.position.y=10;
    mesh_base1.position.x=0;
    mesh_base1.material=mat_green;
    mesh_base1.renderingGroupId=2;
    //mesh_base1.layerMask=2;
    var mesh_base2=new BABYLON.MeshBuilder.CreateSphere("mesh_base2",{diameter:1},scene);
    mesh_base2.position.y=-10;
    mesh_base2.position.x=0;
    mesh_base2.material=mat_green;
    mesh_base2.renderingGroupId=2;

    //天空盒
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.disableLighting = true;
    //skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    //skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    //skybox.ambientColor=new BABYLON.Color3(1, 0, 0);
    //“skybox_nx.png”, “skybox_ny.png”, “skybox_nz.png”, “skybox_px.png”, “skybox_py.png”, “skybox_pz.png”.
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../ASSETS/IMAGE/SKYBOX/skybox", scene);//这里的目录不能更深否则babyljs找不到！！
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.renderingGroupId = 1;//这个参数使得天空盒处于所有其他元素之外！？
    skybox.isPickable=false;

    //准备十种数字的纹理->怎么把动态纹理或者canvas转为dataurl？
    /*var texture_number = new BABYLON.DynamicTexture("texture_number", {
        width: 240,
        height: 24
    }, scene);
    var context_comment = texture_number.getContext();*/
    var can_temp=document.createElement("canvas");
    can_temp.width=264;
    can_temp.height=24;
    var context=can_temp.getContext("2d");
    context.fillStyle="rgba(0,0,0,0)";//完全透明？
    context.fillRect(0,0,can_temp.width,can_temp.height);
    context.fillStyle = "#ffffff";
    context.font = "bold 24px monospace";
    context.fillText("0123456789-",0,24);
    var png=can_temp.toDataURL("image/png");


    //这里有两个思路，一是建立一个网格，然后使用纹理坐标选择不同的纹理，如果使用一张纹理图，就要保证所有地形纹理都在这一张图内，并处理不同高低的纹理坐标选取
    //二是为每种纹理建立一个网格类，使用网格类的实例拼凑出地面，如何处理过高的落差《-自动延展？能否处理pick？性能问题？

    obj_landtype={};
    var box_grass=new BABYLON.MeshBuilder.CreateBox("box_grass",{size:size_per},scene);
    var box_tree=new BABYLON.MeshBuilder.CreateBox("box_tree",{size:size_per},scene);
    var box_stone=new BABYLON.MeshBuilder.CreateBox("box_stone",{size:size_per},scene);
    var box_shallowwater=new BABYLON.MeshBuilder.CreateBox("box_shallowwater",{size:size_per},scene);
    var box_deepwater=new BABYLON.MeshBuilder.CreateBox("box_deepwater",{size:size_per},scene);
    box_grass.renderingGroupId = 2;
    box_tree.renderingGroupId = 2;
    box_stone.renderingGroupId = 2;
    box_shallowwater.renderingGroupId = 2;
    box_deepwater.renderingGroupId = 2;
    box_grass.position.y=-100*size_per;
    box_tree.position.y=-101*size_per;
    box_stone.position.y=-102*size_per;
    box_shallowwater.position.y=-103*size_per;
    box_deepwater.position.y=-104*size_per;
    obj_landtype.box_grass=box_grass;
    obj_landtype.box_tree=box_tree;
    obj_landtype.box_stone=box_stone;
    obj_landtype.box_shallowwater=box_shallowwater;
    obj_landtype.box_deepwater=box_deepwater;
    OptimizeMesh(box_grass);
    OptimizeMesh(box_tree);
    OptimizeMesh(box_stone);
    OptimizeMesh(box_shallowwater);
    OptimizeMesh(box_deepwater);

    var mat_grass = new BABYLON.StandardMaterial("mat_grass", scene);//1
    mat_grass.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/LANDTYPE/grass.jpg", scene);
    mat_grass.freeze();
    box_grass.material=mat_grass;
    var mat_tree = new BABYLON.StandardMaterial("mat_tree", scene);//1
    mat_tree.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/LANDTYPE/yulin.png", scene);
    mat_tree.freeze();
    box_tree.material=mat_tree;
    var mat_stone = new BABYLON.StandardMaterial("mat_stone", scene);//1
    mat_stone.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/LANDTYPE/stone.png", scene);
    mat_stone.freeze();
    box_stone.material=mat_stone;
    var mat_shallowwater = new BABYLON.StandardMaterial("mat_shallowwater", scene);//1
    mat_shallowwater.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/LANDTYPE/lake.png", scene);
    mat_shallowwater.freeze();
    box_shallowwater.material=mat_shallowwater;
    var mat_deepwater = new BABYLON.StandardMaterial("mat_deepwater", scene);//1
    mat_deepwater.diffuseTexture = new BABYLON.Texture("../../ASSETS/IMAGE/LANDTYPE/sea.png", scene);
    mat_deepwater.freeze();
    box_deepwater.material=mat_deepwater;

    var mesh0=new BABYLON.Mesh("mesh0",scene);
    //以高度0为海平面，以xy00为大地原点
    //形成初始地块
    for(var i=0;i<=segs_x;i++)
    {
        arr_instance[i]=[];
        for(var j=0;j<segs_y;j++)
        {
            arr_instance[i][j]=[];
            var instance=obj_landtype.box_grass.createInstance("ground_"+i+"_"+j+"_0");
            instance.mydata={i:i,j:j,k:0,landclass:obj_landtype.box_grass};
            instance.position=new BABYLON.Vector3((i-(segs_x/2))*size_per,0,(j-(segs_y/2))*size_per);//都是从负向正堆叠？
            arr_instance[i][j].push(instance);//把每个实例用全局对象保存起来
        }
    }
    MyBeforeRender();
}
//disposeCube(0,0)
function disposeCube(i,j)//移除一个xz位置上的所有可能存在的方块
{
    var len=arr_instance[i][j].length;
    for(var k=0;k<len;k++)
    {
        var instance=arr_instance[i][j][k];
        instance.dispose();
        instance=null;
    }

}
//createCube(0,0,2,obj_landtype.box_stone)
//i，j必定是整数，k可能是小数,都表示单位长度的数量
function createCube(i,j,k,landclass)
{
    var instance=landclass.createInstance("ground_"+i+"_"+j+"_"+k);
    instance.mydata={i:i,j:j,k:k,landclass:landclass};
    instance.position=new BABYLON.Vector3((i-(segs_x/2))*size_per,k*size_per,(j-(segs_y/2))*size_per);//都是从负向正堆叠？
    //arr_instance[i][j].push(instance);
    arr_instance[i][j].unshift(instance);
}
//用对应的方块填充一条路径上所有的xz单元格，先清空单元格内原有方块，然后在指定高度建立一个方块
// ，接着比对所有周围方块的高度（比对四个方向），填补漏出的部分，在填补时注意越低的方块在数组中越靠前。
//createCubePath([{i:0,j:0,k:1,landclass:obj_landtype.box_stone},{i:1,j:1,k:2.5,landclass:obj_landtype.box_stone}])
function createCubePath(cubepath)
{
    var len=cubepath.length;
    for(var i=0;i<len;i++)//对于每一个xz单元格
    {
        var cube=cubepath[i];
        disposeCube(cube.i,cube.j);
        createCube(cube.i,cube.j,cube.k,cube.landclass);
    }
    //初次绘制后进行二次对比，初次绘制的必定是xz单元格中的最高点
    for(var index=0;index<len;index++)
    {
        var cube=cubepath[index];
        var i=cube.i;
        var j=cube.j;
        var k=cube.k;
        //上右下左
        //取四方的最高
        var k1=999;
        if(arr_instance[i])
        {
            var arr1=arr_instance[i][j+1];
            if(arr1)
            {
                var ins_cube1=arr1[arr1.length-1];
                k1=ins_cube1.mydata.k;
            }
        }
        var k2=999;
        if(arr_instance[i+1])
        {
            var arr2=arr_instance[i+1][j];
            if(arr2) {
                var ins_cube2 = arr2[arr2.length - 1];
                k2=ins_cube2.mydata.k;
            }
        }
        var k3=999;
        if(arr_instance[i])
        {
            var arr3=arr_instance[i][j-1];
            if(arr3) {
                var ins_cube3=arr3[arr3.length-1];
                k3=ins_cube3.mydata.k;
            }
        }
        var k4=999;
        if(arr_instance[i-1])
        {
            var arr4=arr_instance[i-1][j+1];
            if(arr4) {
                var ins_cube4=arr4[arr4.length-1];
                k4=ins_cube4.mydata.k;
            }
        }
        //对比四方,如果不存在这个格，则找最大时算作最小，不影响
        /*var maxk=Math.max(ins_cube1?ins_cube1.mydata.k:-999
            ,ins_cube2?ins_cube2.mydata.k:-999
            ,ins_cube3?ins_cube3.mydata.k:-999
            ,ins_cube4?ins_cube4.mydata.k:-999)
        if(maxk==-999)
        {
            maxk=0;
        }*/
        //在四方最高中找最低
        var mink=Math.min(k1,k2,k3,k4);

        var len2=Math.floor((k-mink)/size_per);
        for(var index2=1;index2<=len2;index2++)
        {
            createCube(i,j,k-index2,cube.landclass);
            //arr_instance[i][j].unshift()
        }
    }
}
function MyBeforeRender()
{
    engine.runRenderLoop(function () {
        engine.hideLoadingUI();
        if (divFps) {
            // Fps
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
        }
        scene.render();
    });
}

</script>
</html>