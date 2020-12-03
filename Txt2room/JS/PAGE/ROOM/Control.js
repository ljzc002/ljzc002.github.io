function InitMouse()
{
    canvas.addEventListener("blur",function(evt){//监听失去焦点
        releaseKeyStateOut();
    })
    canvas.addEventListener("focus",function(evt){//改为监听获得焦点，因为调试失去焦点时事件的先后顺序不好说
        releaseKeyStateIn();
    })

    //scene.onPointerPick=onMouseClick;//如果不attachControl onPointerPick不会被触发，并且onPointerPick必须pick到mesh上才会被触发
    canvas.addEventListener("click", function(evt) {//这个监听也会在点击GUI按钮时触发！！
        onMouseClick(evt);//
    }, false);
    canvas.addEventListener("dblclick", function(evt) {//是否要用到鼠标双击？？
        onMouseDblClick(evt);//
    }, false);
    scene.onPointerMove=onMouseMove;
    scene.onPointerDown=onMouseDown;
    scene.onPointerUp=onMouseUp;
    scene.onKeyDown=onKeyDown;
    scene.onKeyUp=onKeyUp;
    node_temp=new BABYLON.TransformNode("node_temp",scene);//用来提取相机的姿态矩阵
    node_temp.rotation=camera0.rotation;
}
function onMouseDblClick(evt)
{
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, null, false, camera0);
    if(pickInfo.hit)
    {
        var mesh = pickInfo.pickedMesh;
        if(mesh.name.split("_")[0]=="mp4")//重放视频
        {
            if(obj_videos[mesh.name])
            {
                var videoTexture=obj_videos[mesh.name];

                    videoTexture.video.currentTime =0;

            }
        }
    }
}
function onMouseClick(evt)
{
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, null, false, camera0);
    if(pickInfo.hit)
    {
        var mesh = pickInfo.pickedMesh;
        if(mesh.name.split("_")[0]=="mp4")//启停视频
        {
            if(obj_videos[mesh.name])
            {
                var videoTexture=obj_videos[mesh.name];
                if(videoTexture.video.paused)
                {
                    videoTexture.video.play();
                }
                else
                {
                    videoTexture.video.pause();
                }
            }
        }
    }

}
var lastPointerX,lastPointerY;
var flag_view="free"
var flag_locked;
var obj_keystate=[];
function onMouseMove(evt)
{

    if(flag_view=="locked")
    {
        evt.preventDefault();
        //绕y轴的旋转角度是根据x坐标计算的
        var rad_y=((scene.pointerX-lastPointerX)/window.innerWidth)*(Math.PI/1);
        var rad_x=((scene.pointerY-lastPointerY)/window.innerHeight)*(Math.PI/1);
        camera0.rotation.y+=rad_y;
        camera0.rotation.x+=rad_x;
    }
    lastPointerX=scene.pointerX;
    lastPointerY=scene.pointerY;
}
function onMouseDown(evt)
{
    if(flag_view=="locked") {
        evt.preventDefault();
    }
}
function onMouseUp(evt)
{
    if(flag_view=="locked") {
        evt.preventDefault();
    }
}
function onKeyDown(event)
{
    if(flag_view=="locked") {
        event.preventDefault();
        var key = event.key;
        obj_keystate[key] = 1;
    }
}
function onKeyUp(event)
{
    var key = event.key;
    if(key=="v"||key=="Escape")
    {
        event.preventDefault();
        if(flag_view=="locked")
        {
            flag_view="free";
            document.exitPointerLock();
        }
        else if(flag_view=="free")
        {
            flag_view="locked";
            canvas.requestPointerLock();
        }
    }
    if(flag_view=="locked") {
        event.preventDefault();

        obj_keystate[key] = 0;
    }
}
function releaseKeyStateIn(evt)
{
    for(var key in obj_keystate)
    {
        obj_keystate[key]=0;
    }
    lastPointerX=scene.pointerX;
    lastPointerY=scene.pointerY;

}
function releaseKeyStateOut(evt)
{
    for(var key in obj_keystate)
    {
        obj_keystate[key]=0;
    }
    // scene.onPointerMove=null;
    // scene.onPointerDown=null;
    // scene.onPointerUp=null;
    // scene.onKeyDown=null;
    // scene.onKeyUp=null;
}
var node_temp;
var pos_last;
function MyBeforeRender()
{
    pos_last=camera0.position.clone();
    scene.registerBeforeRender(
        function(){
            //Think();

        }
    )
    scene.registerAfterRender(
        function() {
            if(flag_view=="locked")
            {
                var flag_speed=1;
                //var m_view=camera0.getViewMatrix();
                //var m_view=camera0.getProjectionMatrix();
                var m_view=node_temp.getWorldMatrix();
                //只检测其运行方向？-》相对论问题！《-先假设直接外围环境不移动
                if(obj_keystate["Shift"]==1)//Shift+w的event.key不是Shift和w，而是W！！！！
                {
                    flag_speed=5;
                }
                var delta=engine.getDeltaTime();
                //console.log(delta);
                flag_speed=flag_speed*engine.getDeltaTime()/10;
                var v_temp=new BABYLON.Vector3(0,0,0);
                if(obj_keystate["w"]==1)
                {
                    v_temp.z+=0.1*flag_speed;

                }
                if(obj_keystate["s"]==1)
                {
                    v_temp.z-=0.1*flag_speed;
                }
                if(obj_keystate["d"]==1)
                {
                    v_temp.x+=0.1*flag_speed;
                }
                if(obj_keystate["a"]==1)
                {
                    v_temp.x-=0.1*flag_speed;
                }
                if(obj_keystate[" "]==1)
                {
                    v_temp.y+=0.1*flag_speed;
                }
                if(obj_keystate["c"]==1)
                {
                    v_temp.y-=0.1*flag_speed;
                }

                //camera0.position=camera0.position.add(BABYLON.Vector3.TransformCoordinates(v_temp,camera0.getWorldMatrix()).subtract(camera0.position));
                //engine.getDeltaTime()

                var pos_temp=camera0.position.add(BABYLON.Vector3.TransformCoordinates(v_temp,m_view));

                var direction=pos_temp.subtract(pos_last);
                //var direction=BABYLON.Vector3.TransformCoordinates(v_temp,m_view);//一次性计算的好处是只需绘制一条射线，缺点是容易射空
                var ray = new BABYLON.Ray(camera0.position, direction, 1);
                var arr=scene.multiPickWithRay(ray);
                arr.sort(sort_compare)//按距离从近到远排序
                var len=arr.length;

                var flag_hit=false;
                for(var k=0;k<len;k++)//对于这条射线击中的每个三角形
                    {
                        var hit=arr[k];
                        var mesh=hit.pickedMesh;
                        var distance=hit.distance;
                        if(mesh||mesh.name)//暂不限制mesh种类
                        {
                            console.log(mesh.name);
                            flag_hit=true;
                            break;
                        }
                    }
                if(!flag_hit)//如果没有被阻拦，则替换位置
                {
                    camera0.position=pos_temp;
                }
                else
                {
                    camera0.position=pos_last;//回溯的太远了
                }
            }
            pos_last=camera0.position.clone();
        }
    )
    engine.runRenderLoop(function () {
        engine.hideLoadingUI();
        if (divFps) {
            // Fps
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
            //engine.get
        }
        //lastframe=new Date().getTime();
        scene.render();
    });
}
function sort_compare(a,b)
{
    return a.distance-b.distance;
}
