/**
 * Created by lz on 2018/12/18.
 */
//所有矩阵计算相关内容
function InsertKey()//根据关键帧对mesh的骨骼的关键帧矩阵进行修改
{
    var div_open=document.querySelectorAll("#div_open")[0];//弹出的窗口对象
    var obj={};
    obj.str_indexp=parseInt(div_open.querySelectorAll(".str_indexp")[0].value);
    //obj.str_fps=div_open.querySelectorAll(".str_fps")[0].value;
    obj.str_posjx=parseInt(div_open.querySelectorAll(".str_posjx")[0].value);
    obj.str_posjy=parseInt(div_open.querySelectorAll(".str_posjy")[0].value);
    obj.str_posjz=parseInt(div_open.querySelectorAll(".str_posjz")[0].value);
    obj.text_key=div_open.querySelectorAll(".text_key")[0].value;
    var str_key=obj.text_key;
    str_key.replace("?","");
    str_key.replace("\r","");
    str_key.replace("\n","");
    var arr_key=str_key.split("#");
    var len=arr_key.length;
    //计算这一块骨骼的关键帧
    var bone=arr_bone[flex_current.querySelectorAll("span")[0].innerHTML]//.getAttribute("number")];
    //var inputs=document.querySelectorAll("#div_open input");
    //bone.animation.framePerSecond=parseInt(inputs[1].value);
    bone.parentBoneIndex=obj.str_indexp;
    bone.animation.keys=[];//每次点击计算时都会重写这块骨头的所有初始关键帧-》扩展关键帧要放在后面的环节！！！！
    var div_comment=flex_current.querySelectorAll(".div_comment0")[0];//注释信息从伸缩对象中提取
    if(!div_comment)
    {
        div_comment=document.createElement("div");
        div_comment.style.display="none";
        div_comment.className="div_comment0";
        flex_current.appendChild(div_comment);
    }
    div_comment.innerHTML=JSON.stringify(obj);
    try
    {
        var pos_gj=new BABYLON.Vector3(obj.str_posjx,obj.str_posjy,obj.str_posjz);//关节点的坐标
        bone.pos_gj=pos_gj;//记录这块骨头和父骨头之间的关节点的全局位置
        for(var i=0;i<len;i++)//对于每一个关键帧，先测试所有关键帧都同步的情况，再测试不同步的情况
        {
            var key=arr_key[i];//单条关键帧的脚本代码
            var arr=key.split("@");
            var num_frame=parseInt(arr[0]);
            var script_frame=arr[1];
            var matrix=eval(script_frame);

            //var count=bone.animation.keys.length;
            //var matrix2=LoadParent4ThisKey(bone,count,true);

            //var vec_temp2=BABYLON.Vector3.TransformCoordinates(pos_gj,matrix2)
            //    .subtract(BABYLON.Vector3.TransformCoordinates(pos_gj,matrix.multiply(matrix2)));
            //bone.animation.keys.push({frame:num_frame,values:matrix.multiply(BABYLON.Matrix.Translation(vec_temp2.x,vec_temp2.y,vec_temp2.z)).toArray()
            //});//推入每一条关键帧
            bone.animation.keys.push({frame:num_frame,values:matrix.toArray()})

        }
        flex_current.querySelectorAll(".checkbone")[0].checked=true;
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
function HandleBones()//对每个骨头扩展关键帧，并建立矩阵传递
{
    var len=arr_bone.length;
    var total=len*sum_frame;
    console.log("开始扩展非根骨头的关键帧");
    for(var i=1;i<len;i++)//重新扩展根骨骼之外的所有骨头
    {
        var bone=arr_bone[i];
        newland.ExtendKeys(bone,sum_frame);
        console.log(i+"/"+(len-1));
    }
    var joints=[];
    //var joint0=arr_bone[1].pos_gj;
    console.log("开始调整非根骨头的关键帧")
    for(var i=1;i<len;i++)//对于除根骨头之外的每一块骨头计算传递矩阵，必须把父骨骼放在子骨骼的前面
    {//回溯每块骨头的所有父骨头
        var bone=arr_bone[i];
        joints=[];//提取所有的关节距离
        var sum_j=new BABYLON.Vector3(0,0,0);
        var bone_now=bone;
        while(true)
        {
            var parent=arr_bone[bone_now.parentBoneIndex];//取父骨骼

            if(parent.index!=0)//如果还没有回溯到根骨骼
            {
                joints.unshift({pos_gj:bone_now.pos_gj.clone().subtract(parent.pos_gj),index:parent.index});
                sum_j=sum_j.add(bone_now.pos_gj.clone().subtract(parent.pos_gj));
                bone_now=parent;
            }
            else
            {
                joints.unshift({pos_gj:bone_now.pos_gj,index:0});
                sum_j=sum_j.add(bone_now.pos_gj);
                break;
            }
        }
        var keys=bone.animation.keys;
        var keys2=[];//数组形式表示的矩阵的数组
        bone.keys2=keys2;
        bone.vec_adjusts=[];
        bone.temp1=[];//父。multiply子
        bone.temp1b=[];//子。multiply父
        bone.sum_j=sum_j;
        bone.temp3=[];
        bone.joint=joints[joints.length-1].pos_gj.clone();//这块骨头的上一块骨头的形态
        for(var j=0;j<sum_frame;j++)//对于每一个帧
        {
            var matrix=ms.fa(keys[j].values);//这一帧的局部变换矩阵
            var parent=arr_bone[bone.parentBoneIndex];
            if(bone.parentBoneIndex==0)//第一层骨头
            {
                bone.temp1.push(matrix);
                bone.temp1b.push(matrix);
                bone.vec_adjusts.push(bone.pos_gj.clone().subtract(vs.tr(sum_j.clone(),matrix)));//这个是全局坐标系中的位移
                bone.temp3.push(bone.pos_gj.clone());
            }
            else//第二层及以上骨头
            {

                var matrix2=parent.temp1[j].clone().multiply(matrix);
                bone.temp1.push(matrix2);
                var matrix2b=(matrix.clone()).multiply(parent.temp1b[j].clone());
                bone.temp1b.push(matrix2b);
                var vec=vs.tr(bone.joint.clone(),parent.temp1b[j].clone());
                bone.temp3.push(parent.temp3[j].clone().add(vec));
                bone.vec_adjusts.push((parent.temp3[j].clone().add(vec).subtract(vs.tr(bone.sum_j,matrix2))));
            }
            var vec_adjust=bone.vec_adjusts[j].clone();
            if(bone.parentBoneIndex!=0)
            {
                vec_adjust=vs.tr(vec_adjust.subtract(parent.vec_adjusts[j]),parent.temp1b[j].clone().invert());
            }
            var matrix_adjusted=matrix.multiply(ms.tr(vec_adjust.x,vec_adjust.y,vec_adjust.z))//变换后的这块骨头这一帧的矩阵
            keys2.push({frame:j,values:matrix_adjusted.toArray()});
            //var vec_adjust1=joint0.clone(),vec_adjust2=vs.tr(sum_j.clone(),matrix);//默认至少有一块一层骨头
            //对于每一层父元素
            //var len2=joints.length;//关节的数量比骨头的数量少一
            /*for(var k=1;k<len2;k++)//对于每一个上游关节
            {//这种写法是强制进行所有计算
                var vec1=joints[k].pos_gj;
                for(var l=1;l<=k;l++)
                {
                    vec1=vs.tr(vec1,ms.fa(arr_bone[joints[l].index].animation.keys[j].values));
                }
                vec_adjust1=vec_adjust1.add(vec1);

                vs.tr(vec_adjust2,ms.fa(arr_bone[joints[k].index].animation.keys[j].values))//取这个关节所在的骨头在这一帧的变换矩阵

            }*/
            /*for(var k=0;k<len2;k++)//对于每一个上游关节
            {

            }
            var vec_adjust=vec_adjust1.subtract(vec_adjust2);
            var matrix_adjusted=matrix.multiply(ms.tr(vec_adjust.x,vec_adjust.y,vec_adjust.z))//变换后的这块骨头这一帧的矩阵
            keys2.push({frame:j,values:matrix_adjusted.toArray()});
            bone.vec_adjusts.push(vec_adjust);//以此优化之*/
        }
        console.log(i+"/"+(len-1));
    }
    for(var i=1;i<len;i++)//对于除根骨头之外的每一块骨头用刚才计算出的keys2替换keys
    {
        var bone=arr_bone[i];
        //var temp=bone.animation.keys;
        bone.animation.keys=bone.keys2;//交换
        //bone.keys2=temp;
        delete bone.keys2;//节省文件大小
        delete bone.temp1;
        delete bone.vec_adjusts;
    }
}