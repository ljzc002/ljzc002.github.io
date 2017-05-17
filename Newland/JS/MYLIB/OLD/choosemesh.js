/**
 * Created by Administrator on 2017/3/24.
 */
function ChooseMesh(index)
{
    var evt = evt || window.event;
    cancelEvent(event);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var cdmesh=arr_choosemesh[index];//被选中的这个数据集
    cmesh.dispose();
    //var mesh={};
    if(cdmesh[0]==0)
    {
        eval("cmesh="+cdmesh[1]);
        cmesh.renderingGroupId=2;
        cmesh.position=startp;
        cmesh.material=mat_frame;//这里暂时使用全局变量，以后要改成从scene里取材质！！！！
        cmesh.lookAt(endp);
        cmesh.pos=0;
    }
    btn_del2();//添加网网格之后推出弹窗
}
//第一个元素为零表示使用babylonjs内置的Mesh方法，1表示使用自定义的顶点数组等数据集
var arr_choosemesh={
    2:[0,"BABYLON.MeshBuilder.CreateSphere('sphere1',{segments:10,diameter:1},scene);"]
    ,1:[0,"BABYLON.MeshBuilder.CreateBox('box1',{size:1},scene)"]
}
var arr_choosemesh2={
    1:[],2:[]
};
//修改缩放滑块
function ChangeRange(num)
{
    $("#div_choose .str_number")[num].value=$("#div_choose .str_range")[num].value;
    ChangeRange2(num);
}
function ChangeRange2(num)
{
    var className=$("#div_choose div")[0].className;
    var value=$("#div_choose .str_number")[num].value;
    if($("#div_choose .str_range")[num].value!=value)
    {
        $("#div_choose .str_range")[num].value=value;
    }
    if(className=="div_inmod4")//缩放
    {
        if(num==0)
        {
            cmesh.scaling.x=parseFloat(value);
        }
        else if(num==1)
        {
            cmesh.scaling.y=parseFloat(value);
        }
        else if(num==2)
        {
            cmesh.scaling.z=parseFloat(value);
        }
    }
    else if(className=="div_inmod5")//缩放
    {
        if(num==0)
        {
            cmesh.rotation.x+=parseFloat(value);
        }
        else if(num==1)
        {
            cmesh.rotation.y+=parseFloat(value);
        }
        else if(num==2)
        {
            cmesh.rotation.z+=parseFloat(value);
        }
    }
    else if(className=="div_inmod6")//位置
    {
        if(num==0)
        {
            var vector=endp.add(startp.negate()).normalize();

            cmesh.position=startp.add(vector.scale(value));
            cmesh.pos=value;
        }

    }
}