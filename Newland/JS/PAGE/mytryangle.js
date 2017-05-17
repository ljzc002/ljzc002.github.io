/**
 * Created by Administrator on 2017/5/10.
 */
//把所有和三角形纹理相关的问题都在这里解决
//弹出处理选中的三角形的对话框
function AdjustTry(evt)
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    delete_div("div_btn_third");
    delete_div("div_btn_second");
    btn_selected=null;
    //CloneSurface();
    //delete_div("div_choose");
    //delete_div("div_mask");
    var size=window_size();
    var div_choose=$("#div_choose")[0];
    if(!div_choose)//如果div_choose还不存在，则引入它
    {
        Open_div2("div_choose",{left:(size.width)-320-20,top:50}
           ,320,480,"div_control",0,350,1,"#ffffff");
        div_choose=$("#div_choose")[0];
        div_choose.innerHTML = $("#div_hidden #div_mod5")[0].innerHTML;
        can_tryangle=$("#div_choose canvas")[0];
        context_tryangle = can_tryangle.getContext('2d');
        context_tryangle.fillStyle="rgb(255,255,255)";
        context_tryangle.fillRect(0,0,can_tryangle.width,can_tryangle.height);
        div_choose.onmouseover=function()
        {
            flag.inputMode=true;
        }
        div_choose.onmouseout=function()
        {
            flag.inputMode=false;
        }
    }

    div_choose.style.pointerEvents="auto";
    //flag.inputMode=true;
    var inputs=div_choose.getElementsByTagName("input");
    var color=mesh_outlook.material.diffuseColor;
    inputs[0].value=color.r;
    inputs[1].value=color.g;
    inputs[2].value=color.b;
    inputs[3].value=1;//在html中0是完全透明

    //$("#div_choose ul")[0].appendChild($("#can_tryangle")[0]);

}
//根据填写的颜色生成图元颜色
function AdjustTrya()
{
    var div_choose=$("#div_choose")[0];
    var inputs=div_choose.getElementsByTagName("input");
    var str_r=inputs[0].value;
    var str_g=inputs[1].value;
    var str_b=inputs[2].value;
    var str_a=inputs[3].value;
    try
    {
        var num_r=parseFloat(str_r);
        if(num_r>1){num_r=1;}
        else if(num_r<0){num_r=0;}
        var num_g=parseFloat(str_g);
        if(num_g>1){num_g=1;}
        else if(num_g<0){num_g=0;}
        var num_b=parseFloat(str_b);
        if(num_b>1){num_r=1;}
        else if(num_b<0){num_b=0;}
        var num_a=parseFloat(str_a);
        if(num_a>1){num_r=1;}
        else if(num_a<0){num_a=0;}
        //var vec_color4=new BABYLON.Vector4(num_r,num_g,num_b,num_a).normalize();
        //mesh_outlook.material.diffuseColor=new BABYLON.Color4(vec_color4.w,vec_color4.x,vec_color4.y,vec_color4.z);
        mesh_outlook.material.diffuseColor=new BABYLON.Color4(num_r,num_g,num_b,num_a);
        //var can_tryangle=div_choose.getElementsByTagName("canvas")[0];
        var width=can_tryangle.width;
        var height=can_tryangle.height;
        var context = context_tryangle;
        //context.fillStyle="rgb(255,255,255)";
        //context.fillRect(0,0,width,height);

        context.beginPath();
        context.fillStyle="rgba("+parseInt(255*num_r)+","+parseInt(255*num_g)+","+parseInt(255*num_b)+","+num_a+")";
        context.moveTo((tryangle_hold[0].uv[0]*width),(height-tryangle_hold[0].uv[1]*height));
        context.lineTo((tryangle_hold[1].uv[0]*width),(height-tryangle_hold[1].uv[1]*height));
        context.lineTo((tryangle_hold[2].uv[0]*width),(height-tryangle_hold[2].uv[1]*height));
        context.closePath();
        context.fill();
        var texture_outlook=new BABYLON.Texture.CreateFromBase64String(can_tryangle.toDataURL("image/png")
            ,"texture_outlook"+count_surface,scene);
        mat_outlook = new BABYLON.StandardMaterial("mat_outlook"+count_surface, scene);
        count_surface++;
        mat_outlook.backFaceCulling=false;
        mat_outlook.diffuseTexture = texture_outlook;
        //var str_src=can_tryangle.toDataURL("image/png");//dataurl再怎么变成canvas？？
    }
    catch(e)
    {
        console.error(e);
    }
}
//在关闭拾色器或者打开新拾色器时，生成一个表面覆盖，并且保留图片
function CloneSurface()
{
    if($("#div_choose canvas")[0]&&flag.holdMode=="tryangle")//目前有三角形注目标记
    {
        //var mesh=mesh_outlook.clone("mesh_surface"+count_surface);
        var mesh=newland.make_tryangle(tryangle_hold[0],tryangle_hold[1],tryangle_hold[2],"mesh_surface"+count_surface);
        //var mat=new BABYLON.StandardMaterial("mat_surface"+count_surface, scene);
        //mat.diffuseColor=mat_outlook.diffuseColor.clone();
        //mat.backFaceCulling=false;
        var mat=mat_outlook.clone("mat_surface"+count_surface);
        mesh.material=mat;
        mesh.renderingGroupId=2;
        mesh.isPickable=false;
        mesh.parent=tryangle_hold.mesh;
        count_surface++;
        //mesh_outlook.dispose();
        //can_tryangle=$("#div_choose canvas")[0].clone();
        //document.body.appendChild($("#can_tryangle")[0]);
    }
}
//弹出一个选择图片的对话框
function AdjustTryb()
{
    delete_div("div_choose2");
    delete_div("div_mask");
    var size=window_size();
    Open_div2("div_choose2",{left:(size.width)/2-400,top:(size.height)/2-300}
        ,800,600,null//[type]
        ,1,401,1,"#ffffff");
    var div_choose=$("#div_choose2")[0];
    div_choose.innerHTML = $("#div_hidden #div_mod6")[0].innerHTML;
    div_choose.onmouseover=function()
    {
        flag.inputMode=true;
    }
    div_choose.onmouseout=function()
    {
        flag.inputMode=false;
    }
    //flag.inputMode=true;
}
//显示本地图片
function ShowImg(file)
{
    if(!file.files||!file.files[0])
    {
        return;
    }
    var reader=new FileReader();
    reader.onload=function(evt)
    {
        var image=new Image();
        image.src=evt.target.result;
        var canvas=$("#div_choose2 canvas")[0];
        var context=canvas.getContext('2d');

        context.save();//当前canvas状态入栈
        context.mydata={};
        context.mydata.image=image;
        context.mydata.angle=0;

        context.translate(canvas.width/2,canvas.height/2);//将坐标原点放在canvas中心
        context.rotate(Math.PI/2);
        context.drawImage(image,-512,-512,1024,1024);
        context.mydata.image90=new Image();

        /*html2canvas(canvas.parentNode).then(
            function(c)
            {
                context.mydata.image90.src=c.toDataURL("image/png");
            }
        );
        context.rotate(90);
        context.mydata.image180=new Image();
        html2canvas(canvas.parentNode).then(
            function(c)
            {
                context.mydata.image180.src=c.toDataURL("image/png");
            }
        );
        context.rotate(90);
        context.mydata.image270=new Image();
        html2canvas(canvas.parentNode).then(
            function(c)
            {
                context.mydata.image270.src=c.toDataURL("image/png");
            }
        );*/
        context.mydata.image90.src=canvas.toDataURL("image/png");
        context.rotate(Math.PI/2);
        context.drawImage(image,-512,-512,1024,1024);
        context.mydata.image180=new Image();
        context.mydata.image180.src=canvas.toDataURL("image/png");
        context.rotate(Math.PI/2);
        context.drawImage(image,-512,-512,1024,1024);
        context.mydata.image270=new Image();
        context.mydata.image270.src=canvas.toDataURL("image/png");
        context.restore();
        context.drawImage(image,0,0,1024,1024);
        AdjustTryc();
    }
    reader.readAsDataURL(file.files[0]);
}
//input的值必须在0到1之间！！
function InONE(evt)
{
    var evt=evt||window.event;
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    var num=parseFloat(obj.value);
    if(num>1)
    {
        obj.value=1;
    }
    else if(num<0)
    {
        obj.value=0;
    }
}
//在载入的图片上标记出来选择的区域，要根据can_tryangle的情况生成标记区域，这里的两个canvas的宽高是一样的能省掉一步计算
function AdjustTryc()
{
    var canvas=$("#div_choose canvas")[0];
    var context=canvas.getContext('2d');
    var width=canvas.width;
    var height=canvas.height;

    var canvas2=$("#div_choose2 canvas")[0];
    var context2=canvas2.getContext('2d');
    var div_choose2=$("#div_choose2")[0];
    var width2=canvas2.width;
    var height2=canvas2.height;
    var inputs2=div_choose2.getElementsByTagName("input");

    delete_div("div_tryangle");
    var div=document.createElement("div");
    div.id="div_tryangle";
    div.style.backgroundColor="transparent";
    div.style.border="1px solid #ffff00";
    div.style.width=Math.abs((tryangle_hold[2].uv[0]*width)-(tryangle_hold[0].uv[0]*width))/2+"px";//认为第一个点和第三个点的x坐标的差是宽度
    div.style.height=Math.abs((height-tryangle_hold[0].uv[1]*height)-(height-tryangle_hold[1].uv[1]*height))/2+"px";//认为第一个点和第二个点的y坐标的差是高度
    div.style.position="absolute";
    inputs2[1].value=0;
    inputs2[2].value=0;
    inputs2[3].value=Math.abs((tryangle_hold[2].uv[0]*width)-(tryangle_hold[0].uv[0]*width))/2;
    inputs2[4].value=Math.abs((height-tryangle_hold[0].uv[1]*height)-(height-tryangle_hold[1].uv[1]*height))/2;
    if(tryangle_hold.faceId%2==0)//左下的三角形
    {
        div.style.borderTopRightRadius="4096px";
    }
    else{
        div.style.borderBottomLeftRadius="4096px";
    }
    div.style.cursor="crosshair";
    canvas2.parentNode.appendChild(div);
    var disX = dixY = 0;
    var maxL = canvas2.clientWidth - div.offsetWidth;
    var maxT = canvas2.clientHeight - div.offsetHeight;
    div.style.left="0px";
    div.style.top=maxT+"px";
    div.onmousedown = function(event) {
        var event = event || window.event;
        disX = event.clientX - this.offsetLeft;
        disY = event.clientY - this.offsetTop;
        maxL = canvas2.clientWidth - div.offsetWidth;//div可能缩放！！
        maxT = canvas2.clientHeight - div.offsetHeight;
        canvas2.onmousemove = function(event) {
            var event = event || window.event;
            var iL = event.clientX - disX;
            var iT = event.clientY - disY;

            iL <= 0 && (iL = 0);
            iT <= 0 && (iT = 0);
            iL >= maxL && (iL = maxL);
            iT >= maxT && (iT = maxT);

            div.style.left=iL+"px";
            div.style.top=iT+"px";
            inputs2[1].value=iL;
            inputs2[2].value=(maxT-iT);
            return false;
        };
        div.onmouseup= function()
        {
            div.onmouseup=null;
            canvas2.onmousemove = null;
            canvas2.onmouseup = null;
        }
        canvas2.onmouseup = function() {
            canvas2.onmousemove = null;
            canvas2.onmouseup = null;
            div.releaseCapture && div.releaseCapture()
        };
        /*canvas2.onmouseout= function()
        {
            canvas2.onmousemove = null;
            canvas2.onmouseup = null;
        }*/
        this.setCapture && this.setCapture();
        return false;
    }
}
//缩放选择三角形，要对应修改拖拽规则
function AdjustTrye()
{
    var div=$("#div_tryangle")[0];
    var canvas2=$("#div_choose2 canvas")[0];
    var inputs2=$("#div_choose2 input");
    inputs2[1].value=0;
    inputs2[2].value=0;
    inputs2[3].value <= 0 && (inputs2[3].value = 0);
    inputs2[4].value <= 0 && (inputs2[4].value = 0);
    inputs2[3].value >= 512 && (inputs2[3].value = 512);
    inputs2[4].value >= 512 && (inputs2[4].value = 512);
    div.style.width=inputs2[3].value+"px";
    div.style.height=inputs2[4].value+"px";
    var maxL = canvas2.clientWidth - div.offsetWidth;
    var maxT = canvas2.clientHeight - div.offsetHeight;
    div.style.left="0px";
    div.style.top=maxT+"px";
}
//通过文本框调整三角形位置
function AdjustTryf()
{
    var div=$("#div_tryangle")[0];
    var canvas2=$("#div_choose2 canvas")[0];
    var maxL = canvas2.clientWidth - div.offsetWidth;
    var maxT = canvas2.clientHeight - div.offsetHeight;
    var inputs2=$("#div_choose2 input");
    inputs2[1].value <= 0 && (inputs2[1].value = 0);//这个大小是相对于div_tryangle的！！
    inputs2[2].value <= 0 && (inputs2[2].value = 0);
    inputs2[1].value >= maxL && (inputs2[1].value = maxL);
    inputs2[2].value >= maxT && (inputs2[2].value = maxT);
    div.style.left=inputs2[1].value+"px";
    div.style.top=maxT-inputs2[2].value+"px";
}
//把选中的图元区域复制到最终png上
function AdjustTryd()
{
    var canvas=$("#div_choose canvas")[0];
    var context=canvas.getContext('2d');
    var width=canvas.width;
    var height=canvas.height;

    var canvas2=$("#div_choose2 canvas")[0];
    var context2=canvas2.getContext('2d');
    var div_choose2=$("#div_choose2")[0];
    var width2=canvas2.width;
    var height2=canvas2.height;
    var inputs2=div_choose2.getElementsByTagName("input");
    context.save();
    //context.rotate(context2.mydata.angle);//这个是默认绕坐标轴原点（左上点）旋转的，不好用！！
    context.beginPath();
    context.moveTo((tryangle_hold[0].uv[0]*width),(height-tryangle_hold[0].uv[1]*height));
    context.lineTo((tryangle_hold[1].uv[0]*width),(height-tryangle_hold[1].uv[1]*height));
    context.lineTo((tryangle_hold[2].uv[0]*width),(height-tryangle_hold[2].uv[1]*height));
    context.clip();

    
    var u_scaling=(Math.abs((tryangle_hold[2].uv[0]*width)-(tryangle_hold[0].uv[0]*width))/2)/inputs2[3].value;
    var v_scaling=(Math.abs((height-tryangle_hold[0].uv[1]*height)-(height-tryangle_hold[1].uv[1]*height))/2)/inputs2[4].value;
    var u_move=-inputs2[1].value*2*u_scaling+(tryangle_hold[0].uv[0]*width);
    var v_move=inputs2[2].value*2*v_scaling-tryangle_hold[1].uv[1]*height;
    var angle=context2.mydata.angle;
    if(angle==0)
    {
        context.drawImage(context2.mydata.image,u_move,v_move,(width2)*u_scaling,(height2)*v_scaling);
    }
    else if(angle==90)
    {
        context.drawImage(context2.mydata.image90,u_move,v_move,(width2)*u_scaling,(height2)*v_scaling);
    }
    else if(angle==180)
    {
        context.drawImage(context2.mydata.image180,u_move,v_move,(width2)*u_scaling,(height2)*v_scaling);
    }
    else if(angle==270)
    {
        context.drawImage(context2.mydata.image270,u_move,v_move,(width2)*u_scaling,(height2)*v_scaling);
    }
    //context.drawImage(context2.mydata.image,u_move*u_scaling,v_move*v_scaling,(width2)*u_scaling,(height2)*v_scaling);
    context.closePath();
    context.restore();
    var texture_outlook=new BABYLON.Texture.CreateFromBase64String(can_tryangle.toDataURL("image/png")
        ,"texture_outlook"+count_surface,scene);
    mat_outlook = new BABYLON.StandardMaterial("mat_outlook"+count_surface, scene);
    count_surface++;
    mat_outlook.backFaceCulling=false;
    mat_outlook.diffuseTexture = texture_outlook;
    mesh_outlook.material=mat_outlook;
    btn_del3();
}
//顺时针旋转一些度数
function TurnZ(angle)
{
    var div=$("#div_tryangle")[0];
    var canvas2=$("#div_choose2 canvas")[0];
    var inputs2=$("#div_choose2 input");
    var context2=canvas2.getContext('2d');
    if(angle==0)
    {
        context2.mydata.angle=0;
        context2.drawImage(context2.mydata.image,0,0,1024,1024);
    }
    else if(angle==90)
    {
        context2.mydata.angle=90;
        context2.drawImage(context2.mydata.image90,0,0,1024,1024);
    }
    else if(angle==180)
    {
        context2.mydata.angle=180;
        context2.drawImage(context2.mydata.image180,0,0,1024,1024);
    }
    else if(angle==270)
    {
        context2.mydata.angle=270;
        context2.drawImage(context2.mydata.image270,0,0,1024,1024);
    }

    inputs2[1].value=0;
    inputs2[2].value=0;


    var maxL = canvas2.clientWidth - div.offsetWidth;
    var maxT = canvas2.clientHeight - div.offsetHeight;
    div.style.left="0px";
    div.style.top=maxT+"px";
}
