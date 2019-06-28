/**
 * Created by lz on 2019/3/12.
 */
var frameDate=0;
function initWs(callback)
{
    var FADE_TIME = 150; // ms
    MyGame.ws= new WebSocket(WsHead);
    var ws=MyGame.ws;
    //var username=MyGame.WhoAmI;
    // 建立连接的时候更新连接状态
    ws.onopen = function (e) {
        console.log('Connection to server opened');
        MyGame.wsConnected = true;
        setUserId();//建立连接后在后台确立用户身份
    }

    // 处理服务器发送过来的消息
    ws.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        //console.log(msg);
        switch(msg.type) {
            case "setuseridok"://身份验证成功，并收到初始化所需要的世界信息
            {
                // 建立连接的响应
                console.log("身份验证成功");
                arr_myunits=msg.myunits;
                myjsonstate=msg.jsonstate;
                arr_webusers=msg.webusers;
                callback();
                break;
            }
            case "tokenfaild":
            {
                alert("身份验证失败，需要重新登录");
                MyGame.wsConnected = false;
                break;
            }
                case "addanewuser"://这个是完成http用户添加后就在world中建立一个BallMan，不论新用户是否连接这个用户都会显示在场景中
                {
                    if(userid=="world")//world用户得知有新用户建立,认为新建的用户肯定没有下属单位？《-新建的用户之前由java生成还未接触过js代码
                    {

                        arr_webusers.push({units:[],id:msg.id,uuid:msg.uuid,jsonstate:msg.jsonstate})
                        //var user=msg.
                        var player = new BallMan();
                        var obj_p={};//初始化参数
                        var mesh_ballman=new BABYLON.Mesh("mesh_ballman"+msg.uuid,scene);
                        obj_p.mesh=mesh_ballman;
                        var jsonstate=JSON.parse(msg.jsonstate);
                        obj_p.mesh.position=newland.MakeVector3(jsonstate.posx,jsonstate.posy,jsonstate.posz
                        ,newland.RandomBetween(-50,50),newland.RandomBetween(0,50),newland.RandomBetween(-50,50));
                        obj_p.mesh.rotation=newland.MakeVector3(jsonstate.rotx,jsonstate.roty,jsonstate.rotz
                        ,0,0,0);
                        obj_p.name=msg.id;//显示的名字
                        obj_p.id=msg.id;//WebSocket Sessionid
                        obj_p.image="../../ASSETS/IMAGE/t_hj.png";
                        player.init(
                            obj_p,scene
                        );
                        MyGame.arr_webplayers[msg.id]=player;
                        var obj_msg={}
                        obj_msg.type="bc_addanewuser";//告知其他webuser新用户的加入
                        obj_msg.id=msg.id;
                        obj_msg.uuid=msg.uuid;
                        obj_msg.jsonstate=msg.jsonstate;

                        sendMessage(JSON.stringify(obj_msg));
                    }
                    break;
                }
            case "bc_addanewuser"://非world用户收到world用户发来的新用户加入消息
            {
                if(userid!="world")//约定新用户必定没有单位
                {
                    if(!MyGame.arr_webplayers[msg.id])
                    {
                        delete msg.type;
                        msg.units=[];
                        arr_webusers.push(msg);
                        var player = new BallMan();
                        var obj_p={};//初始化参数
                        var mesh_ballman=new BABYLON.Mesh("mesh_ballman"+msg.uuid,scene);
                        obj_p.mesh=mesh_ballman;
                        var jsonstate=JSON.parse(msg.jsonstate==""?"{}":msg.jsonstate);
                        //isNaN(null,flase)的结果同样是false！！！！
                        obj_p.mesh.position=newland.MakeVector3(jsonstate.posx,jsonstate.posy,jsonstate.posz,0,10,-30);
                        obj_p.mesh.rotation=newland.MakeVector3(jsonstate.rotx,jsonstate.roty,jsonstate.rotz,0,0,0);
                        obj_p.name=msg.id;//显示的名字
                        obj_p.id=msg.id;//WebSocket Sessionid
                        obj_p.image="../../ASSETS/IMAGE/t_hj.png";
                        player.init(
                            obj_p,scene
                        );
                        msg.mesh=player;
                        player.cardinhand=[];
                        player.arr_units=[];
                        MyGame.arr_webplayers[msg.id]=player;
                    }

                }
                break;
            }
            case "getuserstate_init"://非world用户建立WS连接时，world用户为他们提供世界状态
            {
                if(userid=="world")
                {
                    var obj_msg={};
                    var web_userid=msg.userid;
                    var web_ChannelId=msg.ChannelId;
                    obj_msg.ChannelId=web_ChannelId;//私聊把世界状态发给这个连接
                    obj_msg.type='giveuserstate_init';
                    //这里应该从初始化参数取值还是从，实际Mesh数组取值？把Mesh也保存在初始化参数里！？
                    var len=arr_webusers.length;
                    var webuserswebusers=[];

                    for(var i=0;i<len;i++)//对于world客户端里的每个web用户
                    {
                        var webuser=arr_webusers[i];
                        if(webuser.id==web_userid)//这个用户自己的信息
                        {
                            obj_msg.myunits=[];
                            var units=webuser.mesh.arr_units;
                            var len2=units.length;
                            for(var j=0;j<len2;j++)//对于这个用户的每个单位
                            {
                                var unit=units[j];
                                //解决rot与qua姿态混杂问题
                                var rot=newland.qua2rot(unit.mesh);
                                var obj={};
                                obj.uuid=unit.uuid;
                                //这里存在一个bug，物理仿真之后的Mesh的rotation会被清零！！！！
                                var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                    rotx:rot.x,roty:rot.y,rotz:rot.z,
                                    state:unit.state,belongto:unit.belongto};
                                obj.jsonstate=JSON.stringify(obj_state);
                                obj.ispublic=unit.ispublic;
                                obj.name=unit.name;//updata时不需要同步
                                obj.jsonp=JSON.stringify(unit.jsonp);//updata时不需要同步
                                obj.mainpic=unit.mainpic;//updata时不需要同步
                                obj.mainback=unit.mainback;//updata时不需要同步
                                obj.comment=unit.comment;//updata时不需要同步
                                obj_msg.myunits.push(obj);
                            }
                            var mesh=webuser.mesh.mesh;
                            var obj={posx:mesh.position.x,posy:mesh.position.y,posz:mesh.position.z,
                            rotx:mesh.rotation.x,roty:mesh.rotation.y,rotz:mesh.rotation.z}
                            obj_msg.jsonstate=JSON.stringify(obj);
                        }
                        else//如果一个用户来查询其他用户的信息，则返回所查询用户的公开信息的全部，和非公开信息的部分
                        {
                            var units=webuser.mesh.arr_units;
                            var len2=units.length;
                            var arr_unit=[];//这个web用户的所有单位
                            var obj_user={};
                            for(var j=0;j<len2;j++)
                            {
                                var unit=units[j];
                                //解决rot与qua姿态混杂问题
                                var rot=newland.qua2rot(unit.mesh);
                                if(unit.ispublic==1)//如果这个uint是公开的
                                {
                                    var obj_unit={};
                                    obj_unit.uuid=unit.uuid;
                                    var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                        rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand,
                                        state:unit.state,belongto:unit.belongto};
                                    obj_unit.jsonstate=JSON.stringify(obj_state);
                                    obj_unit.ispublic=unit.ispublic;
                                    obj_unit.name=unit.name;
                                    obj_unit.jsonp=JSON.stringify(unit.jsonp);
                                    obj_unit.mainpic=unit.mainpic;
                                    obj_unit.mainback=unit.mainback;
                                    obj_unit.comment=unit.comment;
                                    //obj_msg.myunits.push(obj);
                                    arr_unit.push(obj_unit);
                                }
                                else
                                {
                                    var unit_temp={};
                                    unit_temp.uuid=unit.uuid;
                                    var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                        rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand,
                                        state:unit.state,belongto:unit.belongto}
                                    unit_temp.jsonstate=JSON.stringify(obj_state);
                                    unit_temp.ispublic=unit.ispublic;
                                    arr_unit.push(unit_temp);
                                }
                            }
                            obj_user.units=arr_unit;
                            obj_user.id=webuser.id;
                            obj_user.uuid=webuser.uuid;

                            var mesh=webuser.mesh.mesh;
                            var obj_state={posx:mesh.position.x,posy:mesh.position.y,posz:mesh.position.z,
                                rotx:mesh.rotation.x,roty:mesh.rotation.y,rotz:mesh.rotation.z}
                            obj_user.jsonstate=JSON.stringify(obj_state);
                            webuserswebusers.push(obj_user);
                        }
                    }
                    //还要把world的单位信息也同步过去！！！！
                    var len=MyGame.arr_units.length;
                    var arr_unit=[];//这个web用户的所有单位
                    var obj_world={};
                    for(var i=0;i<len;i++)
                    {
                        var unit=MyGame.arr_units[i];
                        //解决rot与qua姿态混杂问题
                        var rot=newland.qua2rot(unit.mesh);
                        if(unit.ispublic==1)//如果这个uint是公开的
                        {
                            var obj_unit={};
                            obj_unit.uuid=unit.uuid;
                            var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand
                            ,state:unit.state,belongto:unit.belongto};
                            obj_unit.jsonstate=JSON.stringify(obj_state);
                            obj_unit.ispublic=unit.ispublic;
                            obj_unit.name=unit.name;
                            obj_unit.jsonp=JSON.stringify(unit.jsonp);
                            obj_unit.mainpic=unit.mainpic;
                            obj_unit.mainback=unit.mainback;
                            obj_unit.comment=unit.comment;
                            //obj_msg.myunits.push(obj);
                            arr_unit.push(obj_unit);
                        }
                        else
                        {
                            var unit_temp={};
                            unit_temp.uuid=unit.uuid;
                            var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand
                                ,state:unit.state,belongto:unit.belongto}
                            unit_temp.jsonstate=JSON.stringify(obj_state);
                            unit_temp.ispublic=unit.ispublic;
                            arr_unit.push(unit_temp);
                        }
                    }
                    obj_world.units=arr_unit;
                    obj_world.id="world";
                    obj_world.uuid=token;
                    webuserswebusers.push(obj_world);

                    obj_msg.webusers=webuserswebusers;
                    sendMessage(JSON.stringify(obj_msg));
                }
                break;
            }
            case "quituser":
            {
                if(userid=="world")
                {
                    var id=msg.id;
                    var user=MyGame.arr_webplayers[id];
                    if(user&&user.mesh)
                    {
                        //首先还要把user的所有card清理掉
                        if(user.arr_uints)//规定这个消息删除的必定是webuser的单位，自己的单位列表存在MyGame里
                        {
                            var len=arr_uints.length;
                            for(var i=0;i<len;i++)
                            {
                                arr_uints[i].dispose();
                            }
                        }
                        user.dispose();
                        user=null;
                    }


                    var obj_msg={}
                    obj_msg.type="bc_quituser";//告知其他webuser新用户的加入
                    obj_msg.id=msg.id;

                    sendMessage(JSON.stringify(obj_msg));
                }

                break;
            }
            case "bc_quituser":
            {
                if(userid!="world") {
                    var id = msg.id;
                    if (id == MyGame.userid)//自己就是被登出的用户
                    {
                        console.log("本用户已经被强制下线");
                    }
                    else {
                        var id = msg.id;
                        var user = MyGame.arr_webplayers[id];
                        if (user && user.mesh) {
                            if(user.arr_uints)//规定这个消息删除的必定是webuser的单位
                            {
                                var len=arr_uints.length;
                                for(var i=0;i<len;i++)
                                {
                                    arr_uints[i].dispose();
                                }
                            }
                            user.mesh.dispose();
                            user=null;
                        }
                    }
                }
                break;
            }
            case "catchcard":
            {
                if(userid=="world")//处理抓牌申请
                {
                    var card_uuid=msg.uuid;
                    var webuser_id=msg.userid;
                    var len=arr_cardheap.length;
                    for(var i=0;i<len;i++)//去牌堆里找这一张牌
                    {
                        var card=arr_cardheap[i]
                        if(card.uuid==card_uuid)
                        {
                            card.state="inani";//card进入动画状态，要移动到用户的handpoint位置
                            var ballman=MyGame.arr_webplayers[webuser_id];
                            var pos=newland.vecToGlobal(new BABYLON.Vector3(0,0,0),ballman.handpoint);
                            //除了位置，还应该包括姿态和缩放的变化
                            var vev3=new BABYLON.Vector3(0.3,0.3,0.3);
                            newland.MoveWithAni(card.mesh,pos,60,vev3
                                ,function(){
                                card.belongto=webuser_id;
                                card.state="inhand";
                                ballman.cardinhand.push(card);
                                card.mesh.parent=ballman.handpoint;
                                ArrangeHandCard(ballman.cardinhand);
                                var obj_msg={};
                                obj_msg.type="finish_catchcard";//抓牌完成，通知用户接收控制权
                                //动画完成时还要把card的本身信息发给用户
                                obj_msg.name=card.name;
                                obj_msg.jsonp=card.jsonp;
                                obj_msg.userid=webuser_id;
                                obj_msg.mainpic= card.mainpic;
                                obj_msg.mainback= card.mainback;
                                obj_msg.comment= card.comment.split("_")[1];
                                ChangeCardsBelone("world",webuser_id,card);
                                sendMessage(JSON.stringify(obj_msg));

                            });

                            var obj_msg={};
                            obj_msg.type="detachcontrol";//响应抓牌请求，通知用户交出控制权
                            obj_msg.uuid=card_uuid;
                            obj_msg.userid=webuser_id;
                            sendMessage(JSON.stringify(obj_msg));
                            break;//认为只能找到一次
                        }
                    }
                }
                break;
            }
            case "detachcontrol":
            {
                if(userid!="world")
                {
                    MyGame.flag_view="first_ani";//通知用户的操作由world接管

                }
                break;
            }
            case "attachcontrol":
            {
                if(userid!="world")
                {
                    MyGame.flag_view="first_lock";//通知用户的操作由world接管

                }
                break;
            }
            case "finish_catchcard":
            {
                if(userid!="world")
                {
                    MyGame.flag_view="first_lock";
                    //从world移交给user
                    ChangeCardsBelone("world",userid,pickedCard);
                    //抓牌完成后看到牌面内容，ispublic的变换也类似处理playoutcard
                    pickedCard.state="inhand";
                    pickedCard.name=msg.name;
                    pickedCard.jsonp= msg.jsonp;
                    pickedCard.mainpic= msg.mainpic;
                    pickedCard.mainback= msg.mainback;
                    pickedCard.comment=userid+"_"+msg.comment;
                    var mesh_card=pickedCard.mesh.content;
                    if (MyGame.materials[pickedCard.name])
                    {
                        mesh_card.material = MyGame.materials[pickedCard.name];
                    }
                    else
                    {
                        var materialf = new BABYLON.StandardMaterial(pickedCard.name + "cardf", scene);
                        materialf.diffuseTexture = new BABYLON.Texture(pickedCard.mainpic, scene);
                        materialf.diffuseTexture.hasAlpha = false;
                        materialf.backFaceCulling = true;
                        materialf.bumpTexture =MyGame.textures["grained_uv"];
                        materialf.useLogarithmicDepth = true;
                        materialf.freeze();
                        MyGame.materials[pickedCard.name] = materialf;
                        mesh_card.material =materialf;
                    }

                    MyGame.player.cardinhand.push(pickedCard);
                    //var handpoint=MyGame.player.mesh.ballman.handpoint
                    pickedCard.mesh.parent=MyGame.player.mesh.ballman.handpoint;
                    ArrangeHandCard(MyGame.player.cardinhand);
                    pickedCard=null;
                }
                break;
            }
            case "synchronizestate":
            {//非world用户接收到world用户同步来的状态
                if(MyGame.userid!="world")
                {
                    if(msg.framedate>frameDate)//如果是一个较新的指令
                    {
                        frameDate=msg.framedate;
                        var userdata=msg.userdata;
                        for(key in userdata)
                        {
                            var user =userdata[key];
                            var arr2=[];
                            var player=null;
                            if(key!="world")//非world用户需要同步位置姿态信息
                            {
                                if(key==MyGame.userid)
                                {
                                    player=null;//MyGame.player;//自己的位置由自己控制，并且提交给world
                                    arr2=MyGame.arr_units;
                                }
                                else
                                {
                                    player=MyGame.arr_webplayers[key];
                                    arr2=player.arr_units;
                                }
                                if(player)
                                {
                                    player.mesh.position.x=user.posx;
                                    player.mesh.position.y=user.posy;
                                    player.mesh.position.z=user.posz;
                                    player.mesh.rotation.x=user.rotx;
                                    player.mesh.rotation.y=user.roty;
                                    player.mesh.rotation.z=user.rotz;
                                }
                            }
                            else
                            {
                                arr2=MyGame.arr_worldunits;
                            }
                            var arr=user.arr_units;
                            var len2=arr2.length;
                            if(len2>0)
                            {
                                var len=arr.length;
                                for(var i=0;i<len;i++)//对于每一个同步状态的unit
                                {
                                    var unit=arr[i];
                                    for(var j=0;j<len2;j++)//对于本机上的这个用户的单位
                                    {
                                        var unit2=arr2[j];
                                        if(unit.uuid==unit2.uuid)
                                        {
                                            unit2.mesh.position.x=unit.posx;
                                            unit2.mesh.position.y=unit.posy;
                                            unit2.mesh.position.z=unit.posz;
                                            unit2.mesh.rotation.x=unit.rotx;
                                            unit2.mesh.rotation.y=unit.roty;
                                            unit2.mesh.rotation.z=unit.rotz;
                                            unit2.mesh.scaling.x=unit.scax;
                                            unit2.mesh.scaling.y=unit.scay;
                                            unit2.mesh.scaling.z=unit.scaz;
                                        }
                                    }
                                }
                            }

                        }
                    }

                }
                break;
            }
            case "reportuserstate":
            {
                if(userid=="world")
                {
                    var webuser_id=msg.userid;
                    var player=MyGame.arr_webplayers[webuser_id];
                    player.mesh.position.x=msg.posx;
                    player.mesh.position.y=msg.posy;
                    player.mesh.position.z=msg.posz;
                    player.mesh.rotation.x=msg.rotx;
                    player.mesh.rotation.y=msg.roty;
                    player.mesh.rotation.z=msg.rotz;
                }
                break;
            }
            case "playoutcard":
            {
                if(userid=="world")//world得知其他用户打出一张card
                {
                    var card_uuid=msg.uuid;
                    var webuser_id=msg.userid;
                    var ballman=MyGame.arr_webplayers[webuser_id];
                    var arr_units=ballman.arr_units;
                    var len=arr_units.length;
                    for(var i=0;i<len;i++)
                    {
                        var unit=arr_units[i];
                        if(unit.uuid==card_uuid)
                        {
                            var card=unit;
                            card.ispublic=true;
                            card.state="inphysic";
                            card.mesh.scaling=new BABYLON.Vector3(1,1,1);
                            card.mesh.position=newland.vecToGlobal(new BABYLON.Vector3(0,0,0),card.mesh);
                            card.mesh.parent=null;
                            card.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(card.mesh, BABYLON.PhysicsImpostor.BoxImpostor
                               , { mass: 1, restitution: 0.001 ,friction:300,move:true}, scene);
                            var forward = new BABYLON.Vector3(0,0,1);
                            forward = newland.vecToGlobal(forward, ballman.mesh);
                            var direction = forward.subtract(ballman.mesh.position);
                            direction = BABYLON.Vector3.Normalize(direction).scale(100);
                            card.mesh.physicsImpostor.setLinearVelocity(direction);
                            var len2=ballman.cardinhand.length;
                            for(var j=0;j<len2;j++)
                            {
                                if(card_uuid==ballman.cardinhand[i])
                                {
                                    ballman.cardinhand.splice(i,1);
                                    break;
                                }
                            }
                            ArrangeHandCard(ballman.cardinhand);//重排剩余的卡牌
                            var obj_msg={};
                            obj_msg.type="bc_playoutcard";//通知其他所有用户这一张卡的打出
                            obj_msg.name=card.name;
                            obj_msg.jsonp=card.jsonp;
                            obj_msg.userid=webuser_id;
                            obj_msg.mainpic= card.mainpic;
                            obj_msg.mainback= card.mainback;
                            obj_msg.comment= card.comment.split("_")[1];
                            obj_msg.userid=webuser_id;
                            obj_msg.uuid=card_uuid;
                            sendMessage(JSON.stringify(obj_msg));
                            break;
                        }
                    }
                }
                break;
            }
            case "bc_playoutcard":
            {
                if(userid!="world")
                {
                    var card_uuid=msg.uuid;
                    var webuser_id=msg.userid;
                    var arr_uint=[];
                    //var arr_hand=[];
                    var ballman;
                    if(webuser_id==userid)//如果是自己的卡打出
                    {
                        arr_uint=MyGame.arr_units;
                        ballman=MyGame.player.mesh.ballman;
                    }
                    else
                    {
                        ballman=MyGame.arr_webplayers[webuser_id];
                        arr_uint=ballman.arr_units;
                    }
                    var len=arr_uint.length;
                    for(var i=0;i<len;i++)
                    {
                        var unit=arr_uint[i];
                        if(unit.uuid==card_uuid)//在用户的单位列表里找到card_uuid对应的单位
                        {
                            var card=unit;
                            card.ispublic=true;
                            if(userid!=webuser_id)
                            {
                                unit.name=msg.name;
                                unit.jsonp= msg.jsonp;
                                unit.mainpic= msg.mainpic;
                                unit.mainback= msg.mainback;
                                unit.comment=userid+"_"+msg.comment;
                                var mesh_card=unit.mesh.content;
                                if (MyGame.materials[pickedCard.name])
                                {
                                    mesh_card.material = MyGame.materials[pickedCard.name];
                                }
                                else
                                {
                                    var materialf = new BABYLON.StandardMaterial(pickedCard.name + "cardf", scene);
                                    materialf.diffuseTexture = new BABYLON.Texture(pickedCard.mainpic, scene);
                                    materialf.diffuseTexture.hasAlpha = false;
                                    materialf.backFaceCulling = true;
                                    materialf.bumpTexture =MyGame.textures["grained_uv"];
                                    materialf.useLogarithmicDepth = true;
                                    materialf.freeze();
                                    MyGame.materials[pickedCard.name] = materialf;
                                    mesh_card.material =materialf;
                                }
                            }
                            else if(pickedCard&&MyGame.player.centercursor.color=="orange")
                            {
                                //pickedCard.mesh.line.material=MyGame.materials.mat_black;
                                //pickedCard.mesh.position.y=0;
                                MyGame.player.centercursor.color="blue";
                                pickedCard=null;
                            }
                            card.state="inphysic";
                            card.mesh.scaling=new BABYLON.Vector3(1,1,1);
                            card.mesh.position=newland.vecToGlobal(new BABYLON.Vector3(0,0,0),card.mesh);
                            card.mesh.parent=null;
                            break;
                        }
                    }
                    var len2=ballman.cardinhand.length;//从手牌中剔除
                    for(var j=0;j<len2;j++)
                    {
                        if(card_uuid==ballman.cardinhand[i])
                        {
                            ballman.cardinhand.splice(i,1);
                            break;
                        }
                    }
                    ArrangeHandCard(ballman.cardinhand);//重排剩余的卡牌
                }
                break;
            }
            default :
            {
                console.log("收到不能理解的消息类型");
                break;
            }
        }
    }

    ws.onclose = function(e) {
        // 可以在 onclose 和 onerror 中处理重连的逻辑，再决定是否将状态更新为未连接状态
        MyGame.wsConnected = false;
    }

    ws.onerror = function(e) {
        MyGame.wsConnected = false;
    }
}
function getUserState () {
        //与服务器建立一个ws会话后，用token从服务器获取到用户配置，认为通过了Index后就不需要用户身份验证了
        var msg = {};
        msg.t = 10;//专用于kingofthehill的t，具体方法类型写在body里//wsType.getUserState;
        var body={
            token:MyGame.wsToken,
            func:initUser,//要获取世界状态和手牌状态
        };
        msg.body = JSON.stringify(body);
        MyGame.ws.send(JSON.stringify(msg));

}
//由服务端负责派发成功的操作日志给每个用户，写在dom里还是3dgui里？->写在控制台里？
function logWs(message, options)
{
    console.log(message);
}

// 发送消息
function sendMessage(str_json) {
    if(MyGame.wsConnected) {
        MyGame.ws.send(str_json);
    }else {
        logWs("与服务器断开连接了，刷新重新连接~");
    }

}
function setUserId()
{
    if(userid=="world")
    {//world用户初始化时从数据库获取世界状态，world用户的内存是世界实时状态的保存者，world用户可以把世界状态写入数据库
        var obj_json={
            type:"setuserid",
            userId:userid,
            token:token,
        };
        sendMessage(JSON.stringify(obj_json));
    }
    else{//其他用户初始化时从world用户获取世界状态，并在之后向world提交自己的更改和从world接收同步信息
        var obj_json={
            type:"setuserid2",
            userId:userid,
            token:token,
        };
        sendMessage(JSON.stringify(obj_json));
    }

}