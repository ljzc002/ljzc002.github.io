/**
 * Created by Administrator on 2016/8/1.
 */
var keys={left:0,right:0,arriere:0,avancer:0,up:0,down:9.82};//当前保持按下的按键-》加速度
var v0={left:0,right:0,arriere:0,avancer:0,up:0,down:0};//上一时刻的速度
var vt={left:0,right:0,arriere:0,avancer:0,up:0,down:0};//当前的速度
var vm={left:5,right:5,arriere:5,avancer:15,up:100,down:100};//最大速度
var flag_standonground=1;//是否接触地面
var VitessePerso = 5, forward, backwards,rightwards,leftwards;
var lastms=0;//上一毫秒数
var lastms2=0;
var schange=0;
var mchange=0;




function animatActor()
{
    if(PlayAnnimation === false && (keys.avancer>1 || keys.arriere>1||keys.right>1||keys.left>1)) {//如果没有动画
        totalFrame = skeletonsPlayer[0]._scene._activeSkeletons.data.length;//总帧数
        start = 0;
        end = 100;
        VitesseAnim = parseFloat(100 / 100);//动画的速度比
        scene.beginAnimation(skeletonsPlayer[0], (100*start)/totalFrame, (100*end)/totalFrame, true, VitesseAnim);//启动动画，skeletonsPlayer是一个骨骼动画对象，可能是实际显示物体的父物体！！
        meshPlayer.position = new BABYLON.Vector3(parseFloat(meshPlayer.position.x), parseFloat(meshPlayer.position.y), parseFloat(meshPlayer.position.z));
        PlayAnnimation = true;
    }
    lastms2=lastms;
    //WriteLog(">>lastms:"+lastms);

    schange=((new Date())-lastms2)/1000;
    //if()

    lastms=new Date();
    //WriteLog("schange:"+schange);
    if(lastms2!=0)
    {
        if (keys.avancer > 0) {	// 向前
            if (flag_standonground == 1)//脚踏实地，考虑加速度
            {
                if (vt.avancer < vm.avancer) //这里暂时忽略超越的那一刻
                {
                    vt.avancer = vt.avancer + keys.avancer * schange;
                }
                else {
                    vt.avancer = vm.avancer;
                }
                mchange = (vt.avancer + v0.avancer) * schange / 2;
                v0.avancer = vt.avancer;
                v0.arriere = -v0.avancer;
                vt.arriere = -vt.avancer;
            }
            else//离开地面，则不再加速
            {
                mchange = v0.avancer * schange;
            }
            forward = new BABYLON.Vector3(parseFloat(Math.sin(parseFloat(meshPlayer.rotation.y))) * mchange / VitessePerso, 0, parseFloat(Math.cos(parseFloat(meshPlayer.rotation.y))) * mchange / VitessePerso);
            forward = forward.negate();//反向？
            meshPlayer.moveWithCollisions(forward);
        }
        else if (keys.arriere > 0) { // 向后
            if (flag_standonground == 1)//脚踏实地，考虑加速度
            {
                if (vt.arriere < vm.arriere) //这里暂时忽略超越的那一刻
                {
                    vt.arriere = vt.arriere + keys.arriere * schange;
                }
                else {
                    vt.arriere = vm.arriere;
                }
                mchange = (vt.arriere + v0.arriere) * schange / 2;
                v0.arriere = vt.arriere;
                v0.avancer = -v0.arriere;
                vt.avancer = -vt.arriere;
            }
            else//离开地面，则不再加速
            {
                mchange = v0.arriere * schange;
            }
            backwards = new BABYLON.Vector3(parseFloat(Math.sin(parseFloat(meshPlayer.rotation.y))) * mchange / VitessePerso, 0, parseFloat(Math.cos(parseFloat(meshPlayer.rotation.y))) * mchange / VitessePerso);
            meshPlayer.moveWithCollisions(backwards);
        }
        if (keys.left == 1 && keys.right == 1)// 左右都按就什么都不做
        {

        }
        else if (keys.left == 1) { // 向左
            leftwards = new BABYLON.Vector3(parseFloat(Math.cos(parseFloat(meshPlayer.rotation.y))) / (2 * VitessePerso), 0, parseFloat(Math.sin(parseFloat(meshPlayer.rotation.y))) / (2 * VitessePerso));
            //leftwards = leftwards.negate();//反向
            meshPlayer.moveWithCollisions(leftwards);
        }
        else if (keys.right == 1) { // En right
            rightwards = new BABYLON.Vector3(parseFloat(Math.cos(parseFloat(meshPlayer.rotation.y))) / (2 * VitessePerso), 0, parseFloat(Math.sin(parseFloat(meshPlayer.rotation.y))) / (2 * VitessePerso));
            rightwards = rightwards.negate();//反向
            meshPlayer.moveWithCollisions(rightwards);
        }


        else if (keys.saut == 1) { // En up
            upwards = new BABYLON.Vector3(0, 0.1, 0);
            meshPlayer.moveWithCollisions(upwards);
        }
        WriteLog("keys:{left:"+keys.left+",right:"+keys.right+",arriere:"+keys.arriere+",avancer:"+keys.avancer+",up:"+keys.up+",down:"+keys.down+"}");
        WriteLog("v0:{left:"+v0.left+",right:"+v0.right+",arriere:"+v0.arriere+",avancer:"+v0.avancer+",up:"+v0.up+",down:"+v0.down+"}");
        WriteLog("vt:{left:"+vt.left+",right:"+vt.right+",arriere:"+vt.arriere+",avancer:"+vt.avancer+",up:"+vt.up+",down:"+vt.down+"}");
        WriteLog("flag_standonground:" + flag_standonground);
    }
}

// Cameras rotative qui suit l'acteur joueur
//跟随着角色的旋转相机（法语）
function CameraFollowActor()
{
    if(flag_standonground==1) {
        meshPlayer.rotation.y = -4.69 - cameraArcRotative[0].alpha;//角色的旋转角度，这样当相机旋转时角色也沿轴旋转，角色始终背对相机
    }
    cameraArcRotative[0].target.x = parseFloat(meshPlayer.position.x);//而弧形旋转相机的中心点则由角色的位置决定，角色移动则弧形旋转相机的位置变化
    cameraArcRotative[0].target.z = parseFloat(meshPlayer.position.z);
}


// Gestion du clavier quand on presse une touche
//当有按键按下时，认为一直按下的键是加速度，而只按一下的键是提供一个初速度，比如跳跃、射击。
function onKeyDown(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);//键码转字符
    switch (touche) {
        case 16: // MAJ Le perso cours
            VitessePerso = 2.5;//速度，加速走
            break;
        case 32: // ESPACE le perso saute，空格是跳
            keys.saut=1;
            break;
    }
    lastms=new Date();
    // Clavier AZERTY
    if (ch == "W") keys.avancer=5;//法语前进
    if (ch == "A") keys.left=1;
    if (ch == "S") keys.arriere=1;//法语后退
    if (ch == "D") keys.right=1;
}
// Gestion du clavier quand on relache une touche
function onKeyUp(event)
{
    var touche = event.keyCode;
    var ch = String.fromCharCode(touche);
    switch (touche) {
        case 16: // MAJ Le perso marche
            VitessePerso = 5;
            break;
        case 32: // ESPACE le perso ne saute plus
            keys.saut=0;
            break;
    }

    // Clavier AZERTY
    if (ch == "W") keys.avancer=0;
    if (ch == "A") keys.left=0;
    if (ch == "S") keys.arriere=0;
    if (ch == "D") keys.right=0;

    PlayAnnimation = false;
    //scene.stopAnimation(skeletonsPlayer[0]);
}