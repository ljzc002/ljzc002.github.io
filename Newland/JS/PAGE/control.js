/**
 * Created by Administrator on 2017/4/12.
 */
//键盘监听
function onKeyDown(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);//键码转字符
    if(current_player&&(!flag.freeControl)&&(!flag.inputMode))
    {
        cancelEvent(event);//覆盖默认按键响应
        switch (touche)
        {
            //这里认为只有一个主控物体，并且固定作二自由度运动
            case 32: // ESPACE le perso saute，空格是跳
            {
                current_player.keys.space = 1;
                break;
            }
            case 17: // ESPACE le perso saute，ctrl是蹲
            {
                current_player.keys.ctrl = 1;
                break;
            }
            case 87: //
            {
                current_player.keys.w = 1;
                break;
            }
            case 68: //
            {
                current_player.keys.d = 1;
                break;
            }
            case 65: //
            {
                current_player.keys.a = 1;
                break;
            }
            case 83: //
            {
                current_player.keys.s = 1;
                break;
            }
        }
    }
}
function onKeyUp(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);
    //ESC关闭这一级菜单
    if(touche==27)
    {
            if($("#div_btn_third")[0])//如果存在三阶菜单
            {
                delete_div("div_btn_third");
                btn_selected=null;
            }
            else if($("#div_btn_second")[0])//否则考虑二阶菜单
            {
                delete_div("div_btn_second");
                btn_selected=null;
            }
            btn_del2();
            flag.holdMode=null;//不调整焦点
        document.body.style.cursor="auto";//光标恢复默认状态
        flag.pickType="default";//点击模式恢复默认状态
        tryangle_hold=null;
        if(mesh_outlook)
        {
            mesh_outlook.dispose();
            mesh_outlook=null;
        }

    }

    else if(current_player&&(!flag.inputMode))//在自由浏览模式下也有一些快捷键可以被使用
    {
        switch (touche)
        {
            case 220://\显示或隐藏菜单栏
            {
                delete_div("div_btn_second");
                delete_div("div_btn_third");
                var obj=$("#div_control")[0];
                if(obj.style.display=="none")
                {
                    obj.style.display="block";
                }
                else
                {
                    obj.style.display="none";
                }
                break;
            }
            case 49://数字键1
            {
                dispatchMyEvent($(".btn_first")[0],"click");
                break;
            }
            case 50://2
            {
                dispatchMyEvent($(".btn_first")[1],"click");
                break;
            }
            case 51://3
            {
                dispatchMyEvent($(".btn_first")[2],"click");
                break;
            }
            case 52://4
            {
                dispatchMyEvent($(".btn_first")[3],"click");
                break;
            }
            case 53://5
            {
                dispatchMyEvent($(".btn_first")[4],"click");
                break;
            }
            case 54://6
            {
                dispatchMyEvent($(".btn_first")[5],"click");
                break;
            }

            case 55://7
            {
                dispatchMyEvent($(".btn_first")[11],"click");
                break;
            }
            case 56://8
            {
                dispatchMyEvent($(".btn_first")[10],"click");
                break;
            }
            case 57://9
            {
                dispatchMyEvent($(".btn_first")[9],"click");
                break;
            }
            case 48://0
            {
                dispatchMyEvent($(".btn_first")[8],"click");
                break;
            }
            case 189://-
            {
                dispatchMyEvent($(".btn_first")[7],"click");
                break;
            }
            case 187://=
            {
                dispatchMyEvent($(".btn_first")[6],"click");
                break;
            }

            case 13://Enter执行点击事件
            {
                if(btn_selected)
                {
                    dispatchMyEvent(btn_selected,"click");
                }
                else if(mesh_hold&&flag.holdMode==null)
                {
                    //arr_mesh.push(mesh_hold);
                    var count_vec=0;//总共的三角形的个数
                    count_surface=0;
                    mesh_cross.parent=mesh_hidden;
                    if(mesh_hold._children&&mesh_hold._children.length>0)
                    {
                        var len=mesh_hold._children.length;

                        for(var i=0;i<len;i++)//其中有一个是cross！！
                        {
                            try{
                                var child=mesh_hold._children[0];
                                count_vec+=(child.geometry._indices.length/3+2);//在两个子元素之间留出空位
                                child.position=child.absolutePosition.clone();
                                child.parent=mesh_allbase;//每次做这个操作都会少一个元素
                                arr_mesh[child.name]=child;
                            }
                            catch(e)
                            {
                                console.error(e);
                            }

                        }
                    }
                    else{
                        mesh_hold.parent=mesh_allbase;
                        count_vec=mesh_hold.geometry._indices.length/3+2;
                    }
                    var count=1;
                    while(true)
                    {
                        if(count*count>count_vec/2)
                        {
                            break;
                        }
                        else
                        {
                            count++;
                        }
                    }
                    //在这里为每一个顶点重新规定uv？？！！
                    //先只考虑只有一个复杂物体的情况
                    count_uvpart=count;
                    len=mesh_allbase._children.length;
                    var count_vec2=0;
                    var num_dis=1/count;
                    for(var i=0;i<len;i++)
                    {
                        var obj=mesh_allbase._children[i];//对于每一个子元素
                        var vb=obj.geometry._vertexBuffers;
                        var uv=vb.uv._buffer._data;
                        var len2=obj.geometry._indices.length/3;
                        var index=obj.geometry._indices;
                        for(var j=0;j<len2;j++)//对于子元素中的每一组索引
                        {
                            //计算这个三角形所在行数和列数
                            var rownum=parseInt(parseInt((count_vec2+j)/2)/count_uvpart);//从零开始
                            var colnum=parseInt((count_vec2+j)/2)%count_uvpart;
                            if(j%2==0)//偶数个的三角形，这里要讲究顺序，否则会前后相互覆盖！！！！
                            {
                                uv[index[j*3]*2]=colnum*num_dis;
                                uv[index[j*3]*2+1]=(rownum+1)*num_dis;
                                uv[index[j*3+1]*2]=(colnum)*num_dis;
                                uv[index[j*3+1]*2+1]=rownum*num_dis;
                                uv[index[j*3+2]*2]=(colnum+1)*num_dis;
                                uv[index[j*3+2]*2+1]=(rownum)*num_dis;
                            }
                            else
                            {
                                uv[index[j*3]*2]=colnum*num_dis;
                                uv[index[j*3]*2+1]=(rownum+1)*num_dis;
                                uv[index[j*3+1]*2]=(colnum+1)*num_dis;
                                uv[index[j*3+1]*2+1]=rownum*num_dis;
                                uv[index[j*3+2]*2]=(colnum+1)*num_dis;
                                uv[index[j*3+2]*2+1]=(rownum+1)*num_dis;
                            }
                        }
                        count_vec2+=len2;
                        if(count_vec2%2==1)
                        {
                            count_vec2++;
                        }
                    }

                    mesh_hold=null;

                }
                break;
            }
            case 9://tab切换焦点
            {
                if($("#div_btn_third")[0])//如果存在三阶菜单
                {
                    var obj=$("#div_btn_third")[0];//获取三阶菜单对象
                    if(btn_selected==null)
                    {
                        var btn=obj.getElementsByTagName("button")[0];//当前需要突出显示的btn
                        btn_selected=btn;
                        btn.style.borderWidth="4px";

                    }
                    else
                    {
                        btn_selected.style.borderWidth="2px";
                        //取下一个btn
                        var btns=$("#div_btn_third button");
                        var index=$(btn_selected).index()+1;
                        if(index==btns.length)
                        {
                            index=0;
                        }
                        btn=btns[index];
                        btn_selected=btn;
                        btn.style.borderWidth="4px";
                    }
                }
                else if($("#div_btn_second")[0])//否则考虑二阶菜单
                {
                    var obj=$("#div_btn_second")[0];//获取二阶菜单对象
                    if(btn_selected==null)
                    {
                        var btn=obj.getElementsByTagName("button")[0];//当前需要突出显示的btn
                        btn_selected=btn;
                        btn.style.borderWidth="4px";

                    }
                    else
                    {
                        btn_selected.style.borderWidth="2px";
                        //取下一个btn
                        var btns=$("#div_btn_second button");
                        var index=$(btn_selected).index()+1;
                        if(index==btns.length)
                        {
                            index=0;
                        }
                        btn=btns[index];
                        btn_selected=btn;
                        btn.style.borderWidth="4px";
                    }
                }
                break;
            }
            //上下左右键用来调整菜单选项，和自由浏览功能冲突！！！！，改用esc、enter、tab

        }

        if(!flag.freeControl)//如果不是自由浏览状态
        {
            switch (touche)
            {
                //这里认为只有一个主控物体，并且固定作二自由度运动
                case 32: // ESPACE le perso saute，空格是跳
                {
                    current_player.keys.space = 0;
                    break;
                }
                case 17: // ESPACE le perso saute，ctrl是蹲
                {
                    current_player.keys.ctrl = 0;
                    break;
                }
                case 87: //
                {
                    current_player.keys.w = 0;
                    break;
                }
                case 68: //
                {
                    current_player.keys.d = 0;
                    break;
                }
                case 65: //
                {
                    current_player.keys.a = 0;
                    break;
                }
                case 83: //
                {
                    current_player.keys.s = 0;
                    break;
                }

            }
        }
    }
    else if(mesh_hold)//调整焦点物体
    {
        switch (touche)
        {
            //被控制的焦点物体的移动
            case 37://左键
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.x=sub(mesh_hold.position.x,0.1*current_player.flag_objfast);
                            $("#div_choose input")[0].value=mesh_hold.position.x;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(-0.1*current_player.flag_objfast,0,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.y=sub(mesh_hold.rotation.y,0.1);
                            $("#div_choose input")[1].value=mesh_hold.rotation.y;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(0,-0.1,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.x=mul(mesh_hold.scaling.x,0.9);//缩小一点
                            $("#div_choose input")[0].value=mesh_hold.scaling.x;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(0.9,1,1)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }

                break;
            }
            case 38://上键Y轴正向
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.y=add(mesh_hold.position.y,0.1*current_player.flag_objfast);
                            $("#div_choose input")[1].value=mesh_hold.position.y;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(0,0.1*current_player.flag_objfast,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.x=add(mesh_hold.rotation.x,0.1);
                            $("#div_choose input")[0].value=mesh_hold.rotation.x;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(0.1,0,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.y=mul(mesh_hold.scaling.y,1.1);
                            $("#div_choose input")[1].value=mesh_hold.scaling.y;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(1,1.1,1)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }
                break;
            }
            case 39://右键X轴正向
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.x=add(mesh_hold.position.x,0.1*current_player.flag_objfast);
                            $("#div_choose input")[0].value=mesh_hold.position.x;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(0.1*current_player.flag_objfast,0,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.y=add(mesh_hold.rotation.y,0.1);
                            $("#div_choose input")[1].value=mesh_hold.rotation.y;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(0,0.1,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.x=mul(mesh_hold.scaling.x,1.1);
                            $("#div_choose input")[0].value=mesh_hold.scaling.x;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(1.1,1,1)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }
                break;
            }
            case 40://下键
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.y=sub(mesh_hold.position.y,0.1*current_player.flag_objfast);
                            $("#div_choose input")[1].value=mesh_hold.position.y;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(0,-0.1*current_player.flag_objfast,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.x=sub(mesh_hold.rotation.x,0.1);
                            $("#div_choose input")[0].value=mesh_hold.rotation.x;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(-0.1,0,0)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.y=mul(mesh_hold.scaling.y,0.9);
                            $("#div_choose input")[1].value=mesh_hold.scaling.y;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(1,0.9,1)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }
                break;
            }
            case 33://PageUp向内
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.z=add(mesh_hold.position.z,0.1*current_player.flag_objfast);
                            $("#div_choose input")[2].value=mesh_hold.position.z;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(0,0,0.1*current_player.flag_objfast)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.z=sub(mesh_hold.rotation.z,0.1);
                            $("#div_choose input")[2].value=mesh_hold.rotation.z;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(0,0,-0.1)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.z=mul(mesh_hold.scaling.z,1.1);
                            $("#div_choose input")[2].value=mesh_hold.scaling.z;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(1,1,1.1)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }
                break;
            }
            case 34://PageDown向外，z轴负向
            {
                    switch (flag.holdMode)
                    {
                        case "pos":
                        {
                            mesh_hold.position.z=sub(mesh_hold.position.z,0.1*current_player.flag_objfast);
                            $("#div_choose input")[2].value=mesh_hold.position.z;
                            var obj=[WhoAmI,"AdjustPos",mesh_hold.name,new BABYLON.Vector3(0,0,-0.1*current_player.flag_objfast)];
                            PushHistory(obj);
                            break;
                        }
                        case "roa":
                        {
                            mesh_hold.rotation.z=add(mesh_hold.rotation.z,0.1);
                            $("#div_choose input")[2].value=mesh_hold.rotation.z;
                            var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,new BABYLON.Vector3(0,0,0.1)];
                            PushHistory(obj);
                            break;
                        }
                        case "sca":
                        {
                            mesh_hold.scaling.z=mul(mesh_hold.scaling.z,0.9);
                            $("#div_choose input")[2].value=mesh_hold.scaling.z;
                            var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(1,1,0.9)];
                            PushHistory(obj);
                            break;
                        }
                        default :
                            break;
                    }
                break;
            }
        }
    }
}
//各个控制按钮的响应
//切换是否自动长按鼠标
function MouseOff()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    if(engine.isPointerLock==false)
    {
        //flag.mouseOff=true;
        engine.isPointerLock=true;
    }
    else
    {
        //flag.mouseOff=false;
        engine.isPointerLock=false;
    }
}
//切换控制视角
function ChangeViewMode()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    var arr=["first","third"];
    var len=arr.length;
    var index=0;
    for(var i=0;i<len;i++)
    {
        if(flag.viewMode==arr[i])
        {
            index=(i+1);
            break;
        }
    }
    if(index==len)
    {
        index=0;
    }
    flag.viewMode=arr[index];
}
//弹出一个800*450的模式对话框，用来调整速度
function AdjustV()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    delete_div("div_choose");
    delete_div("div_mask");

    var size=window_size();
    Open_div2("div_choose",{left:(size.width)/2-400,top:(size.height)/2-225}
        ,800,450,null//[type]
        ,1,401,1,"#ffffff");
    var div_choose=$("#div_choose")[0];
    div_choose.innerHTML = $("#div_hidden #div_mod1")[0].innerHTML;
    var inputs= div_choose.getElementsByTagName("input");
    flag.inputMode=true;
    inputs[0].value=current_player.flag_runfast;//驾驶的机体不同速度自然不同
    inputs[1].value=freeCamera.speed;//这个是通用的
    inputs[2].value=current_player.flag_objfast;
    inputs[3].value=freeCamera.angularSensibility;
}
//切换是否使用自由浏览模式
function FreeControl()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    var btns=$(".btn_first");
    var len=btns.length;
    if(flag.freeControl==false)
    {
        flag.freeControl=true;
        //禁用除运动控制外其他的所有按钮
        for(var i=0;i<len;i++)
        {
            if(i!=6)
            {
                btns[i].disabled=true;
            }
        }
    }
    else
    {
        flag.freeControl=false;
        for(var i=0;i<len;i++)
        {
            if(i!=6)
            {
                btns[i].disabled=false;
            }
        }
    }
}
//这里可能会定义出很多很多种方法，所以要使用自包含结构封装一下
var Myc=
{

}

//回退一步操作
function BackWord()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    PopHistory();

}
//在网格列表里面删除一个
function DeleteMesh(str)
{
    if(arr_mesh[str])
    {
        arr_mesh[str].dispose();
        arr_mesh[str]=null;
    }
}
//反向应用运动
function inAdjustPos(str,vec)
{
    if(arr_mesh[str])
    {
        arr_mesh[str].position=arr_mesh[str].position.subtract(vec);
    }
}
//反向应用姿态
function inAdjustRoa(str,vec)
{
    if(arr_mesh[str])
    {
        arr_mesh[str].rotation=arr_mesh[str].rotation.subtract(vec);
    }
}
//反向应用缩放
function inAdjustSca(str,vec)
{
    var mesh=arr_mesh[str];
    if(mesh)
    {
        mesh.scaling=new BABYLON.Vector3(mesh.scaling.x/vec.x,mesh.scaling.y/vec.y,mesh.scaling.z/vec.z);
    }
}
//弹出一个宽度为240px的非模式对话框对物体的位置进行调整
function AdjustPos(evt)
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var parent=obj.parentNode.parentNode;
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    delete_div("div_choose");
    delete_div("div_mask");

    flag.holdMode="pos";
    var size=window_size();
    Open_div2("div_choose",{left:(size.width)-240-20,top:50}
        ,240,320,parent,0,350,1,"#ffffff");
    var div_choose=$("#div_choose")[0];
    div_choose.innerHTML = $("#div_hidden #div_mod2")[0].innerHTML;
    div_choose.style.pointerEvents="auto";
    flag.inputMode=true;
    var inputs=div_choose.getElementsByTagName("input");
    inputs[0].value=mesh_hold.position.x;
    inputs[1].value=mesh_hold.position.y;
    inputs[2].value=mesh_hold.position.z;
}
//根据脚本计算出mesh_hold对象的位置
function AdjustPos2()
{
    try{
        var pos_old=mesh_hold.position.clone();
        mesh_hold.position=eval($("#div_choose textarea")[0].value);
        var div_choose=$("#div_choose")[0];
        var inputs=div_choose.getElementsByTagName("input");
        var obj=[WhoAmI,"AdjustPos",mesh_hold.name,mesh_hold.position.subtract(pos_old)];//向量的变化量
        PushHistory(obj);
        inputs[0].value=mesh_hold.position.x;
        inputs[1].value=mesh_hold.position.y;
        inputs[2].value=mesh_hold.position.z;

    }
    catch(e)
    {
        console.error(e);
    }

}
function AdjustRoa()
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var parent=obj.parentNode.parentNode;
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    delete_div("div_choose");
    delete_div("div_mask");

    flag.holdMode="roa";
    var size=window_size();
    Open_div2("div_choose",{left:(size.width)-240-20,top:50}
        ,240,320,parent,0,350,1,"#ffffff");
    var div_choose=$("#div_choose")[0];
    div_choose.innerHTML = $("#div_hidden #div_mod3")[0].innerHTML;
    div_choose.style.pointerEvents="auto";
    flag.inputMode=true;
    var inputs=div_choose.getElementsByTagName("input");
    inputs[0].value=mesh_hold.rotation.x;
    inputs[1].value=mesh_hold.rotation.y;
    inputs[2].value=mesh_hold.rotation.z;
}
function AdjustRoa2()
{
    try{
        var roa_old=mesh_hold.rotation.clone();
        mesh_hold.rotation=eval($("#div_choose textarea")[0].value);
        var div_choose=$("#div_choose")[0];
        var inputs=div_choose.getElementsByTagName("input");
        var obj=[WhoAmI,"AdjustRoa",mesh_hold.name,mesh_hold.rotation.subtract(roa_old)];
        PushHistory(obj);
        inputs[0].value=mesh_hold.rotation.x;
        inputs[1].value=mesh_hold.rotation.y;
        inputs[2].value=mesh_hold.rotation.z;
    }
    catch(e)
    {
        console.error(e);
    }
}
function AdjustSca()
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var parent=obj.parentNode.parentNode;
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    delete_div("div_choose");
    delete_div("div_mask");

    flag.holdMode="sca";
    var size=window_size();
    Open_div2("div_choose",{left:(size.width)-240-20,top:50}
        ,240,320,parent,0,350,1,"#ffffff");
    var div_choose=$("#div_choose")[0];
    div_choose.innerHTML = $("#div_hidden #div_mod4")[0].innerHTML;
    div_choose.style.pointerEvents="auto";
    flag.inputMode=true;
    var inputs=div_choose.getElementsByTagName("input");
    inputs[0].value=mesh_hold.scaling.x;
    inputs[1].value=mesh_hold.scaling.y;
    inputs[2].value=mesh_hold.scaling.z;
}
function AdjustSca2()
{
    try{
        var Sca_old=mesh_hold.scaling.clone();
        mesh_hold.scaling=eval($("#div_choose textarea")[0].value);
        var div_choose=$("#div_choose")[0];
        var inputs=div_choose.getElementsByTagName("input");
        var obj=[WhoAmI,"AdjustSca",mesh_hold.name,new BABYLON.Vector3(mesh_hold.scaling.x/Sca_old.x,mesh_hold.scaling.y/Sca_old.y,mesh_hold.scaling.z/Sca_old.z)];
        PushHistory(obj);
        inputs[0].value=mesh_hold.scaling.x;
        inputs[1].value=mesh_hold.scaling.y;
        inputs[2].value=mesh_hold.scaling.z;
    }
    catch(e)
    {
        console.error(e);
    }
}
function Choose_mesh()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
}
function Choose_tryangle()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    document.body.style.cursor="crosshair";
    flag.pickType="tryangle";
}
function Choose_point()
{
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
}
