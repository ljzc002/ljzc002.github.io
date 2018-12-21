/**
 * Created by lz on 2018/11/30.
 */
function addBone()//向列表里添加一块骨骼
{
    var container=document.getElementById("div_flexcontainer");
    container.appendChild(document.querySelectorAll("#div_hiden .div_flexible")[0].cloneNode(true));
    var divs=container.querySelectorAll(".div_flexible");
    var len=divs.length;
    divs[len-1].number=len;//这个属性并不能准确的使用
    divs[len-1].querySelectorAll(".str_flexlen")[0].innerHTML=len+"";
    var bone={
        'animation':{
            dataType:3,
            framePerSecond:num_fps,
            keys:[],
            loopBehavior:1,
            name:'_bone'+len+'Animation',
            property:'_matrix'
        },
        'index':len,
        'matrix':BABYLON.Matrix.Identity().toArray(),
        'name':'_bone'+len,
        'parentBoneIndex':0
    }
    newland.AddBone2SK(obj_scene,0,bone);
}
var mesh_test=null;//必须先期声明一下，否则在ImportMesh的回调中会报错！！！！
function ExportMesh(obj_scene,flag)//这个工程专用的导出方法
{

    if(flag==1)//点击导出按钮，默认此时已经完成了扩展关键帧和矩阵传递的计算
    {
        var str_data=JSON.stringify(obj_scene);
        DownloadText(MakeDateStr()+"testscene",str_data,".babylon");
    }
    else if(flag==0)//点击现场演示按钮
    {
        var str_data="";
        //var bones=obj_scene.skeletons[0].bones;
        HandleBones();

        str_data=JSON.stringify(obj_scene);
        //在现场演示环节里添加扩展关键帧的计算？？
        BABYLON.SceneLoader.ImportMesh("", "", "data:"+str_data, scene
            , function (newMeshes, particleSystems, skeletons) {//载入完成的回调函数
                if(mesh_test)
                {
                    mesh_test.dispose();
                }
                mesh_test=newMeshes[0];
                mesh_test.position.x=20;
                mesh_test.material=mat_frame;
                //var totalFrame=skeletons[0]._scene._activeSkeletons.data.length;
                skeleton=skeletons[0];
                scene.beginAnimation(skeleton, 0, sum_frame, true, 0.5);//缺失了中间的部分！！没有自动插值！！！！

            });
    }
}
//放和左侧伸缩菜单相关的内容
var flex_current=null;//当前展开的flex
function flex()//展缩一块骨骼的配置菜单
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;//obj是展缩按钮
    if(obj.innerHTML=="展开")
    {

        var divs=document.querySelectorAll(".div_flexbottom");//要把其他展开状态的都关掉，同时还要改变高亮顶点（或者边线）状态
        var len=divs.length;
        for(var i=0;i<len;i++)
        {
            divs[i].style.display="none";
            divs[i].parentNode.querySelectorAll("button")[0].innerHTML="展开";
            divs[i].parentNode.querySelectorAll("button")[1].disabled="disabled";
        }
        obj.innerHTML="收缩";
        obj.parentNode.parentNode.querySelectorAll(".div_flexbottom")[0].style.display="block";
        obj.parentNode.querySelectorAll("button")[1].disabled=null;
        ClearAllClip();
        if(lines_inpicked&&lines_inpicked.dispose)
        {
            lines_inpicked.dispose();
        }
        flex_current=obj.parentNode.parentNode;
        var divs=flex_current.querySelectorAll(".div_flexcell");//根据可能存在的初始值初始化文本框，但是还需要手动点击每个骨骼的刷新按钮
        var len2=divs.length;
        for(var i=0;i<len2;i++)
        {
            var div_comment=divs[i].querySelectorAll(".div_comment")[0];
            if(div_comment)//如果这个平面有记录的数据
            {
                var arr=JSON.parse(div_comment.innerHTML);
                var inputs=divs[i].querySelectorAll("input");
                inputs[0].value=arr[0];
                inputs[1].value=arr[1];
                inputs[2].value=arr[2];
                inputs[3].value=arr[3];
            }
        }
    }
    else if(obj.innerHTML=="收缩")
    {
        obj.innerHTML="展开";
        obj.parentNode.parentNode.querySelectorAll(".div_flexbottom")[0].style.display="none";
        obj.parentNode.querySelectorAll("button")[1].disabled="disabled";
        ClearAllClip();
        if(lines_inpicked&&lines_inpicked.dispose)
        {
            lines_inpicked.dispose();
        }
    }
}
function ClearAllClip()//只清理所有的斜面，不处理突出的顶点
{
    var len=arr_plane.length;
    for(var i=0;i<len;i++)
    {
        var plane=arr_plane[i];
        plane.cylinder.dispose();
        plane.mesh.dispose();
        plane.lines_normal.dispose();

        plane=null;
    }
    arr_plane=[];
}

var arr_plane=[];
function ShowClip()//先预留，否则以后要用时添加起来很麻烦
{

}
function ShowClip2()//再点击刷新时根据斜面计算当前骨骼区域
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;//obj是刷新按钮
    ClearAllClip();
    var divs=obj.parentNode.parentNode.querySelectorAll(".div_flexbottom")[0].querySelectorAll(".div_flexcell");
    var str_number=obj.parentNode.parentNode.querySelectorAll("span")[0].innerHTML//.getAttribute("number");//这是骨骼索引编号，但在实际导出模型时并不以它为准，因为可能存在放弃导出的骨骼区块
    var len=6;
    for(var i=0;i<len;i++)//遍历每个斜面设置，绘制出相应斜面
    {
        var div=divs[i];
        var inputs=div.querySelectorAll("input");
        var len2=4;
        var flag=0;
        var arr=[];
        for(var j=0;j<len2;j++)//判断这个斜面是否正常设置
        {
            if(isNaN(parseFloat(inputs[j].value)))//如果这个文本框没有内容或者内容不是数字
            {
                flag=1;
                break;
            }
            else
            {
                arr.push(parseFloat(inputs[j].value));
            }
        }
        if(flag==0)
        {
            var plane=new BABYLON.Plane(arr[0], arr[1], arr[2], arr[3]);
            var div_comment=div.querySelectorAll(".div_comment")[0];
            if(!div_comment)//如果以前没有这个注释内容
            {
                div_comment=document.createElement("div");//建立一个隐形元素把设置持久化
                div_comment.style.display="none";
                div_comment.className="div_comment";
                div.appendChild(div_comment);
            }
            div_comment.innerHTML=JSON.stringify(arr);

            plane.normalize();//必须先把平面标准化，否则生成的平面网格不准确（会参考向量长度生成）
            var mesh_plane=new BABYLON.MeshBuilder.CreatePlane("mesh_plane"+i
                ,{sourcePlane:plane,sideOrientation:BABYLON.Mesh.DOUBLESIDE,size:50},scene);
            //sourcePlane倾斜时sourcePlane有Bug！！！！？？
            mesh_plane.material=mat_alpha_yellow;//由plane生成的mesh没有rotation？？
            var pos1=mesh_plane.position.clone();
            var vec_nomal=plane.normal.clone().normalize();
            var pos2=pos1.add(vec_nomal);
            var lines=[[pos1,pos2]];
            var lines_normal=new BABYLON.MeshBuilder.CreateLineSystem("lines_normal"+i,{lines:lines,updatable:false},scene);
            lines_normal.color=new BABYLON.Color3(1, 0, 0);
            var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder"+i,{height:1,diameterTop:0,diameterBottom:0.2 } ,scene);
            cylinder.parent=mesh_plane;
            cylinder.rotation.x-=Math.PI/2;
            cylinder.position.z-=1.5;
            cylinder.material=mat_red;

            plane.mesh=mesh_plane;
            plane.lines_normal=lines_normal;
            plane.cylinder=cylinder;
            arr_plane.push(plane);
        }
        else
        {
            var div_comment=div.querySelectorAll("div_comment")[0];//如果这个平面设置不成立，但又有记录的数据，则清空记录的数据
            if(div_comment)
            {
                delete_div(div_comment);
            }
        }
    }
    requestAnimFrame(function(){FindVertex(str_number);});
    //FindVertex(str_number);//寻找属于这块骨骼的顶点
}

var lines_inpicked=null;
function FindVertex(str_number)//突出显示骨骼范围内的所有顶点
{
    if (divFps) {
        // Fps
        divFps.innerHTML = "0fps";
    }
    if(!mesh_origin||!mesh_origin.dispose)
    {
        console.log("尚未加载模型");
        return;
    }
    if(lines_inpicked&&lines_inpicked.dispose)
    {
        lines_inpicked.dispose();
    }
    var len=arr_plane.length;
    if(len>0)//如果有平面，则开始遍历模型顶点
    {
        var mesh=mesh_origin;
        var vb=mesh.geometry._vertexBuffers;
        var data_pos=vb.position._buffer._data;
        var len_pos=data_pos.length;
        var data_index=mesh.geometry._indices;
        var len_index=data_index.length;
        var lines=[];
        var matricesIndices=mesh_origin.matricesIndices;
        var matricesWeights=mesh_origin.matricesWeights;

        for(var i=0;i<len_pos;i+=3)//对于每个顶点
        {
            console.log(i/3+1+"/"+len_pos/3);//显示当前操作到第几个顶点
            if(matricesIndices[i/3]==parseInt(str_number))//要清空旧的设定
            {
                matricesIndices[i/3]=0;
            }
            var pos=new BABYLON.Vector3(data_pos[i],data_pos[i+1],data_pos[i+2]);
            var flag=0;
            for(var j=0;j<len;j++)//对于每一个切分平面
            {
                var num=arr_plane[j].signedDistanceTo(pos);
                if(num<0)
                {
                    flag=1;
                    break;
                }
            }
            if(flag==0)
            {
                var index_vertex=i/3;
                var vec=pos;
                matricesIndices[index_vertex]=parseInt(str_number);//修改这个顶点的骨骼绑定
                //下面进行突出显示，遍历索引？
                for(var j=0;j<len_index;j+=3)
                {
                    if(index_vertex==data_index[j])//三角形的第一个顶点
                    {
                        var num2=data_index[j+1]*3;
                        var num3=data_index[j+2]*3;
                        var vec2=new BABYLON.Vector3(data_pos[num2],data_pos[num2+1],data_pos[num2+2]);
                        var vec3=new BABYLON.Vector3(data_pos[num3],data_pos[num3+1],data_pos[num3+2]);
                        lines.push([vec,vec2]);
                        lines.push([vec,vec3]);
                    }
                    else if(index_vertex==data_index[j+1])//三角形的第一个顶点
                    {
                        var num2=data_index[j]*3;
                        var num3=data_index[j+2]*3;
                        var vec2=new BABYLON.Vector3(data_pos[num2],data_pos[num2+1],data_pos[num2+2]);
                        var vec3=new BABYLON.Vector3(data_pos[num3],data_pos[num3+1],data_pos[num3+2]);
                        lines.push([vec,vec2]);
                        lines.push([vec,vec3]);
                    }
                    else if(index_vertex==data_index[j+2])//三角形的第一个顶点
                    {
                        var num2=data_index[j]*3;
                        var num3=data_index[j+1]*3;
                        var vec2=new BABYLON.Vector3(data_pos[num2],data_pos[num2+1],data_pos[num2+2]);
                        var vec3=new BABYLON.Vector3(data_pos[num3],data_pos[num3+1],data_pos[num3+2]);
                        lines.push([vec,vec2]);
                        lines.push([vec,vec3]);
                    }
                }
            }
        }
        lines_inpicked=new BABYLON.MeshBuilder.CreateLineSystem("lines_inpicked",{lines:lines,updatable:false},scene);
        lines_inpicked.color=new BABYLON.Color3(0, 1, 0);
    }
    else
    {
        console.log("没有设置符合规则的斜面");
        return;
    }
}
function OpenDivKey()//弹出一个对话框，编辑父骨骼和关键帧动画
{
    delete_div("div_open");
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;//obj是编辑关键帧按钮
    var div_key=Open_div2("div_open",{top:50,left:50},500,400,"body",1,450,1);
    var div=div_key.appendChild(document.querySelectorAll("#div_hiden .div_key")[0].cloneNode(true));//弹出的对话框内容
    div.querySelectorAll("span")[0].innerHTML="编辑骨骼"+obj.parentNode.querySelectorAll("span")[0].innerHTML//.getAttribute("number")+"的关键帧";//默认骨骼0不可编辑
    var div_comment=flex_current.querySelectorAll(".div_comment0")[0];//如果没有，在这里会报错吗？
    if(div_comment)
    {
        var obj=JSON.parse(div_comment.innerHTML);
        div.querySelectorAll(".str_indexp")[0].value=obj.str_indexp;
        //div.querySelectorAll(".str_fps")[0].value=obj.str_fps;
        div.querySelectorAll(".str_posjx")[0].value=obj.str_posjx;
        div.querySelectorAll(".str_posjy")[0].value=obj.str_posjy;
        div.querySelectorAll(".str_posjz")[0].value=obj.str_posjz;
        div.querySelectorAll(".text_key")[0].value=obj.text_key;
    }
}
function reInit()
{
    var flexs=document.querySelectorAll("#div_flexcontainer")[0].querySelectorAll(".div_flexible");
    var len=flexs.length;
    for(var i=0;i<len;i++)//对于加载的每一个flex对象
    {
        var flex=flexs[i];
        var bone={
            'animation':{
                dataType:3,
                framePerSecond:num_fps,
                keys:[],
                loopBehavior:1,
                name:'_bone'+(i+1)+'Animation',
                property:'_matrix'
            },
            'index':(i+1),
            'matrix':BABYLON.Matrix.Identity().toArray(),
            'name':'_bone'+(i+1),
            'parentBoneIndex':0
        }
        newland.AddBone2SK(obj_scene,0,bone);

        var divs=flex.querySelectorAll(".div_flexcell");//根据可能存在的初始值初始化文本框，但是还需要手动点击每个骨骼的刷新按钮
        var len2=divs.length;
        for(var j=0;j<len2;j++)//初始化每个斜面的输入值
        {
            var div_comment=divs[j].querySelectorAll(".div_comment")[0];
            if(div_comment)//如果这个平面有记录的数据
            {
                var arr=JSON.parse(div_comment.innerHTML);
                var inputs=divs[j].querySelectorAll("input");
                inputs[0].value=arr[0];
                inputs[1].value=arr[1];
                inputs[2].value=arr[2];
                inputs[3].value=arr[3];
            }
        }

        var div_bottom=flex.querySelectorAll(".div_flexbottom")[0];
        if(div_bottom.style.display=="block")
        {
            flex_current=flex;
        }
    }
}
