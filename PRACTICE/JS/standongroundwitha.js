/**
 * Created by Administrator on 2016/8/2.
 */
//在有加速度和重力的情况下考虑类人型物体的第三人称控制
var keys={w:0,s:0,a:0,d:0,space:0,ctrl:0,shift:0};//按键是否保持按下
var witha={forward:0,left:0,up:-9.82};//认为场景中一直存在重力，前后向结合？环境重力
var witha2={forward:0,left:0,up:0};//最终加速度
var v0={forward:0,left:0,up:0};//上一时刻的速度,前后向结合！
var vt={forward:0,left:0,up:0};//下一时刻的速度,前后向结合！
var vm={forward:15,backwards:5,left:5,right:5,up:100,down:100};//各个方向的最大速度
var flag_standonground=0;//是否接触地面
var flag_runfast=1;//加快速度
var ms0=0;//上一时刻毫秒数
var mst=0;//下一时刻毫秒数
var ry0=0;//上一时刻的转角，用来算v0！
var ryt=0;//下一时刻的转角
var rychange=0;
var schange=0;//秒差
var mchange={forward:0,left:0,up:0};//物体自身坐标系上的位移
var vmove=new BABYLON.Vector3(0,0,0);//每一时刻的位移和量
var py0=0;//记录上一时刻的y轴位置，和下一时刻比较确定物体有没有落地！！


function StandOnGroundWithA(object)
{
    //每一帧都会触发这里
    if(ms0==0)
    {
        ms0=new Date();
        ry0=object.rotation.y;
        schange=0;
        py0=object.position.y;
    }
    else
    {
        //计算时间差和转角差
        mst = new Date();
        ryt = object.rotation.y;
        schange = (mst - ms0) / 1000;
        rychange = parseFloat(ryt - ry0);
        ry0=ryt;
        ms0 = mst;

        if (PlayAnnimation === false && (v0.forward != 0 || v0.left != 0))//如果没有动画但又在运动
        {
            totalFrame = skeletonsPlayer[0]._scene._activeSkeletons.data.length;//总帧数
            start = 0;
            end = 100;
            VitesseAnim = parseFloat(100 / 100);//动画的速度比
            scene.beginAnimation(skeletonsPlayer[0], (100 * start) / totalFrame, (100 * end) / totalFrame, true, VitesseAnim);//启动动画，skeletonsPlayer是一个骨骼动画对象，可能是实际显示物体的父物体！！
            //object.position = new BABYLON.Vector3(parseFloat(object.position.x), parseFloat(object.position.y), parseFloat(object.position.z));
            PlayAnnimation = true;
        }

        var v0t = {forward: 0, left: 0, up: 0};
        v0t.forward = v0.forward * parseFloat(Math.cos(rychange)) + (-v0.left * parseFloat(Math.sin(rychange)));
        v0t.left = (v0.forward * parseFloat(Math.sin(rychange))) + (v0.left * parseFloat(Math.cos(rychange)));
        v0t.up = v0.up;
        v0 = v0t;
        //考虑移动速度产生的阻力？
        if (v0.forward == 0) {
            witha.forward = 0;
        }
        else if (v0.forward > 0) {
            witha.forward = -0.5;
        }
        else {
            witha.forward = 0.5;
        }
        if (v0.left == 0) {
            witha.left = 0;
        }
        else if (v0.left > 0) {
            witha.left = -0.5;
        }
        else {
            witha.left = 0.5;
        }
        witha2.forward = witha.forward;
        witha2.left = witha.left;
        witha2.up = witha.up;
        //处理前后
        if (keys.w != 0) {
            witha2.forward += 5;
        }
        else if (keys.s != 0) {
            witha2.forward -= 2;
        }
        //处理左右
        if (keys.a != 0 && keys.d != 0) {

        }
        else if (keys.a != 0) {
            witha2.left += 2;
        }
        else if (keys.d != 0) {
            witha2.left -= 2;
        }
        if (witha2.forward != 0&&flag_standonground==1) {//在地面上才能使用水平加速度
            vt.forward = v0.forward + witha2.forward * schange;//速度变化
            if ((0 < vt.forward && vt.forward < vm.forward) || (0 > vt.forward && vt.forward > -vm.backwards)) {
                mchange.forward = witha2.forward * schange * schange + v0.forward * schange;//加速度产生的距离变化
            }
            else if (vm.forward <= vt.forward) {
                vt.forward = vm.forward;
                mchange.forward = vt.forward * schange;
            }
            else if (-vm.backwards >= vt.forward) {
                vt.forward = -vm.backwards;
                mchange.forward = vt.forward * schange;
            }
        }
        else {
            mchange.forward = v0.forward * schange;
        }
        if (witha2.left != 0&&flag_standonground==1) {
            vt.left = v0.left + witha2.left * schange;//速度变化
            if ((0 < vt.left && vt.left < vm.left) || (0 > vt.left && vt.left > -vm.right)) {
                mchange.left = witha2.left * schange * schange + v0.left * schange;//加速度产生的距离变化
            }
            else if (vm.left <= vt.left) {
                vt.left = vm.left;
                mchange.left = vt.left * schange;
            }
            else if (-vm.right >= vt.left) {
                vt.left = -vm.right;
                mchange.left = vt.left * schange;
            }
        }
        else {
            mchange.left = v0.left * schange;
        }
        if(v0.up<0&&flag_standonground==0&&(0<(py0-object.position.y)<(-mchange.up)*3/4))//正在下落，但没有下落应有的距离
        {
            v0.up=0;
            vt.up=0;
            vm.down=1;
            flag_standonground=1;
            witha.up=-0.5;//考虑到下坡的存在，还要有一点向下的分量，使其能够向下但又不至于抖动过于剧烈
        }
        else if(flag_standonground==1&&((py0-object.position.y)>(-mchange.up)*3/4)>0)//遇到了一个坑
        {
            flag_standonground=0;
            vm.down=100;
            witha.up=-9.82;
        }
        if (witha2.up != 0) {//不在地面才考虑上下移动&&flag_standonground==0

            vt.up = v0.up + witha2.up * schange;//速度变化
            if ((0 < vt.up && vt.up < vm.up) || (0 > vt.up && vt.up > -vm.down)) {
                mchange.up = witha2.up * schange * schange + v0.up * schange;//加速度产生的距离变化
            }
            else if (vm.up <= vt.up) {
                vt.up = vm.up;
                mchange.up = vt.up * schange;
            }
            else if (-vm.down >= vt.up) {
                vt.up = -vm.down;
                mchange.up = vt.up * schange;
            }
        }
        else {
            mchange.up = v0.up * schange;
        }
        v0.forward = vt.forward;
        v0.left = vt.left;
        v0.up = vt.up;
        if (v0.forward < 0.01 && v0.forward > -0.01) {
            v0.forward = 0;
        }
        if (v0.left < 0.01 && v0.left > -0.01) {
            v0.left = 0;
        }
        if (v0.up < 0.01 && v0.up > -0.01) {
            v0.up = 0;
        }
        /*if(flag_standonground==1&&v0.up<0)//如果在地面上就不能再向下了！！
        {
            v0.up = 0;
            mchange.up=0;
        }*/
        if(mchange.forward<0.01&& mchange.forward > -0.01)
         {
            mchange.forward=0;
         }
         if(mchange.left<0.01&& mchange.left > -0.01)
         {
            mchange.left=0;
         }
         if(mchange.up<0.01&& mchange.up > -0.01)
         {
             mchange.up=0;
         }
        if (v0.forward == 0 && v0.left == 0&& v0.up == 0) {

        }
        else {
            if(v0.forward == 0 && v0.left == 0)
            {
                scene.stopAnimation(skeletonsPlayer[0]);
                PlayAnnimation = false;
            }
            py0=object.position.y;
            var vectir1=(new BABYLON.Vector3(parseFloat(Math.sin(parseFloat(object.rotation.y))) * mchange.forward * flag_runfast,
                0, parseFloat(Math.cos(parseFloat(object.rotation.y))) * mchange.forward * flag_runfast)).negate();
            var vectir2=new BABYLON.Vector3(-parseFloat(Math.cos(parseFloat(object.rotation.y))) * mchange.left * flag_runfast,
                0, parseFloat(Math.sin(parseFloat(object.rotation.y))) * mchange.left * flag_runfast).negate();
            var vectir3=new BABYLON.Vector3(0, mchange.up * flag_runfast, 0);
            vmove = vectir1.add(vectir2).add(vectir3);
            object.moveWithCollisions(vmove);
            if(flag_standonground==1)
            {
                //v0.up=0;
                //vt.up=0;
            }
        }
    }
}

// Cameras rotative qui suit l'acteur joueur
//跟随着角色的旋转相机（法语）
function CameraFollowActor(object)
{
    if(flag_standonground==1) {
        object.rotation.y = -4.69 - cameraArcRotative[0].alpha;//角色的旋转角度，这样当相机旋转时角色也沿轴旋转，角色始终背对相机
    }
    cameraArcRotative[0].target.x = parseFloat(object.position.x);//而弧形旋转相机的中心点则由角色的位置决定，角色移动则弧形旋转相机的位置变化
    cameraArcRotative[0].target.y = parseFloat(object.position.y);
    cameraArcRotative[0].target.z = parseFloat(object.position.z);

    /*if (object.intersectsMesh(ground, true)) {//物体与地面碰撞，这种方式默认把地面用盒子包起来，在物体实际上还未到地面时就会触发碰撞了！！
        flag_standonground=1;
    } else {
        flag_standonground=0;
    }*/
}


function onKeyDown(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);//键码转字符
    switch (touche) {
        case 16: // MAJ Le perso cours
        {
            keys.shift = 1;//速度，加速走
            flag_runfast = 3;
            break;
        }
        case 32: // ESPACE le perso saute，空格是跳
        {
            keys.space = 1;
            witha.up=-9.82;
            flag_standonground=0;
            v0.up = 100;
            break;
        }
    }
    lastms=new Date();
    // Clavier AZERTY
    if (ch == "W") keys.w=1;//法语前进
    if (ch == "A") keys.a=1;
    if (ch == "S") keys.s=1;//法语后退
    if (ch == "D") keys.d=1;
}
// Gestion du clavier quand on relache une touche
function onKeyUp(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);
    switch (touche) {
        case 16: // MAJ Le perso marche
        {
            keys.shift = 0;
            flag_runfast = 1;
            break;
        }
        case 32: // ESPACE le perso ne saute plus
        {
            keys.space = 0;
            break;
        }
    }

    // Clavier AZERTY
    if (ch == "W") keys.w=0;
    if (ch == "A") keys.a=0;
    if (ch == "S") keys.s=0;
    if (ch == "D") keys.d=0;

    //PlayAnnimation = false;
    //scene.stopAnimation(skeletonsPlayer[0]);
}
