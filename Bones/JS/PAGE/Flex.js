/**
 * Created by lz on 2018/11/30.
 */
//放和左侧伸缩菜单相关的内容
var flex_current=null;//当前展开的flex
function flex()//展缩一块骨骼的配置菜单
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    if(obj.innerHTML=="展开")
    {

        var divs=document.querySelectorAll(".div_flexbottom");//要把其他展开状态的都关掉，同时还要改变高亮顶点（或者边线）状态
        var len=divs.length;
        for(var i=0;i<len;i++)
        {
            divs[i].style.display="none";
            divs[i].parentNode.querySelectorAll("button")[0].innerHTML="展开";
        }
        obj.innerHTML="收缩";
        obj.parentNode.parentNode.querySelectorAll(".div_flexbottom")[0].style.display="block";
        ClearAllClip();
        if(lines_inpicked&&lines_inpicked.dispose)
        {
            lines_inpicked.dispose();
        }
        //bone_current=
        flex_current=obj.parentNode.parentNode;
        var divs=flex_current.querySelectorAll(".div_flexcell");
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
        ClearAllClip();
        if(lines_inpicked&&lines_inpicked.dispose)
        {
            lines_inpicked.dispose();
        }
    }
}
function addBone()//向列表里添加一块骨骼
{
    var container=document.getElementById("div_flexcontainer");
    container.appendChild(document.querySelectorAll("#div_hiden .div_flexible")[0].cloneNode(true));
    var divs=container.querySelectorAll(".div_flexible");
    var len=divs.length;
    divs[len-1].number=len;
    divs[len-1].querySelectorAll("span")[0].innerHTML=len+"";
    var bone={
        'animation':{
            dataType:3,
            framePerSecond:30,
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
    arr_bone.push(bone);
}

var arr_plane=[];
function ShowClip()//在斜面参数发生变化时尝试更新斜面,同时每次单个斜面更新都要重算所有的选中顶点
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
            var div_comment=div.querySelectorAll("div_comment")[0];
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
    var div_key=Open_div2("div_open",{top:50,left:50},500,400,"body",1,450,1);
    var div=div_key.appendChild(document.querySelectorAll("#div_hiden .div_key")[0].cloneNode(true));//弹出的对话框内容
    div.querySelectorAll("span")[0].innerHTML="编辑骨骼"+flex_current.querySelectorAll("span")[0].innerHTML//.getAttribute("number")+"的关键帧";//默认骨骼0不可编辑
    var div_comment=flex_current.querySelectorAll(".div_comment0")[0];//如果没有，在这里会报错吗？
    if(div_comment)
    {
        var obj=JSON.parse(div_comment.innerHTML);
        div.querySelectorAll(".str_indexp")[0].value=obj.str_indexp;
        div.querySelectorAll(".str_fps")[0].value=obj.str_fps;
        div.querySelectorAll(".str_posjx")[0].value=obj.str_posjx;
        div.querySelectorAll(".str_posjy")[0].value=obj.str_posjy;
        div.querySelectorAll(".str_posjz")[0].value=obj.str_posjz;
        div.querySelectorAll(".text_key")[0].value=obj.text_key;
    }
}
function ComputMatrix()//根据关键帧对mesh的骨骼的关键帧矩阵进行修改
{
    var str_key=document.querySelectorAll("#div_open .text_key")[0].value;
    str_key.replace("↵","");
    str_key.replace("\r","");
    str_key.replace("\n","");
    var arr_key=str_key.split("#");
    var len=arr_key.length;
    //计算这一块骨骼的关键帧
    var bone=arr_bone[flex_current.querySelectorAll("span")[0].innerHTML]//.getAttribute("number")];
    var inputs=document.querySelectorAll("#div_open input");
    bone.animation.framePerSecond=parseInt(inputs[1].value);
    bone.parentBoneIndex=parseInt(inputs[0].value);
    bone.animation.keys=[];
    var div_open=document.querySelectorAll("#div_open")[0];//弹出的窗口对象
    var div_comment=flex_current.querySelectorAll(".div_comment0")[0];//注释信息从伸缩对象中提取
    if(!div_comment)
    {
        div_comment=document.createElement("div");
        div_comment.style.display="none";
        div_comment.className="div_comment0";
        flex_current.appendChild(div_comment);
    }
    var obj={};
    obj.str_indexp=div_open.querySelectorAll(".str_indexp")[0].value;
    obj.str_fps=div_open.querySelectorAll(".str_fps")[0].value;
    obj.str_posjx=div_open.querySelectorAll(".str_posjx")[0].value;
    obj.str_posjy=div_open.querySelectorAll(".str_posjy")[0].value;
    obj.str_posjz=div_open.querySelectorAll(".str_posjz")[0].value;
    obj.text_key=div_open.querySelectorAll(".text_key")[0].value;
    div_comment.innerHTML=JSON.stringify(obj);
    /*{
        'animation':{
            dataType:3,
            framePerSecond:document.querySelectorAll("#div_open input")[1].value,
            keys:[],
            loopBehavior:1,
            name:'_bone'+flex_current.number+'Animation',
            property:'_matrix'
        },
        'index':flex_current.number,
        'matrix':BABYLON.Matrix.Identity().toArray(),
        'name':'_bone'+flex_current.number,
        'parentBoneIndex':document.querySelectorAll("#div_open input")[0].value
    }*/
    try
    {
        for(var i=0;i<len;i++)//对于每一个关键帧，先测试所有关键帧都同步的情况，再测试不同步的情况
        {
            var key=arr_key[i];//单条关键帧的脚本代码
            var arr=key.split("@");
            var num_frame=parseInt(arr[0]);
            var script_frame=arr[1];
            var matrix=eval(script_frame);
            var pos_gj=new BABYLON.Vector3(inputs[2].value,inputs[3].value,inputs[4].value);//关节点的坐标
            var count=bone.animation.keys.length;
            var matrix2=LoadParent4ThisKey(bone,count,true);
            /*if(bone.parentBoneIndex!=0)
            {//找父元素的这个关键帧，由此看来父子骨骼的动画必须是同步的！！！！

                matrix2=matrix2.multiply(new BABYLON.Matrix.FromArray(arr_bone[bone.parentBoneIndex].animation.keys[count].value));
            }
            var matrix2=matrix.multiply();
            //动画是否是从根元素不断传递的？是否需要一个loadgrandparent的递归方法？*/

            var vec_temp2=BABYLON.Vector3.TransformCoordinates(pos_gj,matrix2)
                    .subtract(BABYLON.Vector3.TransformCoordinates(pos_gj,matrix.multiply(matrix2)));
            bone.animation.keys.push({frame:num_frame,values:matrix.multiply(BABYLON.Matrix.Translation(vec_temp2.x,vec_temp2.y,vec_temp2.z)).toArray()
            });//推入每一条关键帧
        }
    }
    catch(e)
    {
        console.error(e);
    }
    finally
    {
        delete_div('div_open');
        delete_div("div_mask");
    }

}
var matrix_temp=BABYLON.Matrix.Identity();
//返回的是这个帧的世界矩阵
function LoadParent4ThisKey(bone,index,flag_self)//当前骨骼对象，当前原始关键帧在keys中的索引
{
    var parent=arr_bone[bone.parentBoneIndex];
    var matrix=BABYLON.Matrix.Identity();//出发骨骼因为还没有push，这个index是空的！！
    if(!flag_self)//如果不是出发骨骼，则要返回当前骨骼本身
    {
        matrix=BABYLON.Matrix.FromArray(bone.animation.keys[index].values);
    }

    if(bone.parentBoneIndex==0)
    {
        return matrix;
    }
    else
    {
        matrix=LoadParent4ThisKey(parent,index).multiply(matrix);//父元素在左侧？
        return matrix;
    }
}