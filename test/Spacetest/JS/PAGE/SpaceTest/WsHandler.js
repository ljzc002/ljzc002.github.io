/**
 * Created by lz on 2019/3/12.
 */
var frameDate=0;
function initWs(callback,online)
{
    if(online=="yes")
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
                    arr_myunits=msg.myunits;//按目前的设定，用户信息和单位设定都存在数据库里，如果不连网如何获取它们呢？
                    myjsonstate=msg.jsonstate;//约定这些内容只用于初始化？？
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
                /*case "addanewuser"://这个是完成http用户添加后就在world中建立一个BallMan，不论新用户是否连接这个用户都会显示在场景中
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
                    if(MyGame.userid!="world")//约定新用户必定没有单位
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
                }*/
                case "getuserstate_init"://非world用户建立WS连接时，world用户为他们提供世界状态
                {
                    if(MyGame.userid=="world")
                    {
                        var obj_msg={};
                        var web_userid=msg.userid;
                        var web_ChannelId=msg.ChannelId;
                        obj_msg.ChannelId=web_ChannelId;//私聊把世界状态发给这个连接
                        obj_msg.type='giveuserstate_init';
                        //应该从实际mesh取值，防止维护两套功能重叠的变量
                        var len=MyGame.arr_webplayers.length;
                        var arr_webplayers=MyGame.arr_webplayers;
                        var webuserswebusers=[];

                        for(var key in arr_webplayers)//对于world客户端里的每个web用户
                        {
                            var webuser=arr_webplayers[key];
                            if(webuser.id==web_userid)//这个用户自己的信息
                            {
                                obj_msg.myunits=[];
                                var units=webuser.arr_units;
                                var len2=units.length;
                                for(var j=0;j<len2;j++)//对于这个用户的每个单位
                                {
                                    var unit=units[j];
                                    //解决rot与qua姿态混杂问题<-如果不使用物理引擎则没有这个问题
                                    var rot=newland.qua2rot(unit.mesh);
                                    var obj={};
                                    obj.uuid=unit.uuid;
                                    var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                        rotx:rot.x,roty:rot.y,rotz:rot.z,areaname:unit.area?unit.area.id:null,
                                        state:unit.state,belongto:unit.belongto
                                    ,hp:unit.hp,maxhp:unit.maxhp,mp:unit.mp,maxmp:unit.maxmp,sp:unit.sp,maxsp:unit.maxsp
                                        ,at:unit.at,Cost1:unit.Cost1,Cost2:unit.Cost2,power:unit.power};
                                    obj.jsonstate=JSON.stringify(obj_state);//单位的状态
                                    obj.ispublic=unit.ispublic;
                                    obj.name=unit.name;//updata时不需要同步
                                    obj.jsonp=JSON.stringify(unit.jsonp);//updata时不需要同步
                                    obj.mainpic=unit.mainpic;//updata时不需要同步
                                    obj.mainback=unit.mainback;//updata时不需要同步
                                    obj.comment=unit.comment;//updata时不需要同步

                                    obj_msg.myunits.push(obj);
                                }
                                var mesh=webuser.mesh;
                                var obj={posx:mesh.position.x,posy:mesh.position.y,posz:mesh.position.z,
                                    rotx:mesh.rotation.x,roty:mesh.rotation.y,rotz:mesh.rotation.z,
                                    index_startpoint:webuser.index_startpoint,
                                }
                                obj_msg.jsonstate=JSON.stringify(obj);//用户的状态
                            }
                            else//如果一个用户来查询其他用户的信息，则返回所查询用户的公开信息的全部，和非公开信息的可公开部分
                            {
                                var units=webuser.arr_units;
                                var len2=units.length;
                                var arr_unit=[];//这个web用户的所有单位
                                var obj_user={};
                                for(var j=0;j<len2;j++)
                                {
                                    var unit=units[j];
                                    //解决rot与qua姿态混杂问题
                                    var rot=newland.qua2rot(unit.mesh);
                                    if(unit.ispublic=="1")//如果这个uint是公开的
                                    {
                                        var obj_unit={};
                                        obj_unit.uuid=unit.uuid;
                                        var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                            rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand,
                                            state:unit.state,belongto:unit.belongto,areaname:unit.area?unit.area.id:null,
                                            hp:unit.hp,maxhp:unit.maxhp,mp:unit.mp,maxmp:unit.maxmp,sp:unit.sp,maxsp:unit.maxsp
                                            ,at:unit.at,Cost1:unit.Cost1,Cost2:unit.Cost2,power:unit.power};
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
                                        var obj_unit={};
                                        obj_unit.uuid=unit.uuid;
                                        var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                            rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand,
                                            state:unit.state,belongto:unit.belongto,areaname:unit.area?unit.area.id:null,};
                                        obj_unit.jsonp="{}";
                                        obj_unit.jsonstate=JSON.stringify(obj_state);
                                        obj_unit.ispublic=unit.ispublic;

                                        arr_unit.push(obj_unit);
                                    }
                                }
                                obj_user.units=arr_unit;
                                obj_user.id=webuser.id;
                                obj_user.uuid=webuser.uuid;

                                var mesh=webuser.mesh;
                                var obj_state={posx:mesh.position.x,posy:mesh.position.y,posz:mesh.position.z,
                                    rotx:mesh.rotation.x,roty:mesh.rotation.y,rotz:mesh.rotation.z,
                                    index_startpoint:webuser.index_startpoint,}
                                obj_user.jsonstate=JSON.stringify(obj_state);
                                webuserswebusers.push(obj_user);
                            }
                        }
                        //还要把world的单位信息也同步过去！！！！
                        var len=MyGame.player.arr_units.length;
                        var arr_unit=[];//这个web用户的所有单位
                        var obj_world={};
                        for(var i=0;i<len;i++)
                        {
                            var unit=MyGame.arr_units[i];
                            //解决rot与qua姿态混杂问题
                            var rot=newland.qua2rot(unit.mesh);
                            if(unit.ispublic=="1")//如果这个uint是公开的
                            {
                                var obj_unit={};
                                obj_unit.uuid=unit.uuid;
                                var obj_state={posx:unit.mesh.position.x,posy:unit.mesh.position.y,posz:unit.mesh.position.z,
                                    rotx:rot.x,roty:rot.y,rotz:rot.z,inhand:unit.jsonstate.inhand
                                    ,state:unit.state,belongto:unit.belongto,areaname:unit.area?unit.area.id:null,
                                    hp:unit.hp,maxhp:unit.maxhp,mp:unit.mp,maxmp:unit.maxmp,sp:unit.sp,maxsp:unit.maxsp
                                    ,at:unit.at,Cost1:unit.Cost1,Cost2:unit.Cost2,power:unit.power};
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
                case "synchronizestate"://本次没有自由移动，所以可能不需要这个同步功能，系统一步一动？<-还要通过这里来同步每个unit的状态
                {//非world用户接收到world用户同步来的状态
                    if(MyGame.userid!="world")
                    {
                        if(MyGame.init_state==1&&msg.framedate>frameDate)//如果是一个较新的指令
                        {
                            frameDate=msg.framedate;
                            var userdata=msg.userdata;
                            for(key in userdata)//对于用户状态同步信息中的每个用户
                            {
                                var user =userdata[key];
                                var arr2=[];
                                var player=null;
                                if(key!="world")//非world用户需要同步位置姿态信息
                                {
                                    if(key==MyGame.userid)
                                    {
                                        player=MyGame.player;//MyGame.player;//自己的位置由自己控制，并且提交给world
                                        arr2=player.arr_units;
                                    }
                                    else
                                    {
                                        player=MyGame.arr_webplayers[key];
                                        arr2=player.arr_units;
                                    }
                                }
                                else
                                {
                                    arr2=MyGame.world.arr_units;
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


                case "playoutcard":
                {
                    if(MyGame.userid=="world")//world得知其他用户打出一张card
                    {
                        var card_uuid=msg.uuid;
                        var webuser_id=msg.userid;
                        var areaname=msg.areaname;
                        var ballman=MyGame.arr_webplayers[webuser_id];
                        var arr_units=ballman.arr_units;
                        var len=arr_units.length;
                        for(var i=0;i<len;i++)
                        {
                            var unit=arr_units[i];
                            if(unit.uuid==card_uuid)//找到了要打出的这张牌
                            {
                                var card=unit;
                                card.ispublic="1";
                                card.state="inani";
                                //card.mesh.scaling=new BABYLON.Vector3(1,1,1);
                                card.mesh.position=newland.vecToGlobal(new BABYLON.Vector3(0,0,0),card.mesh);
                                card.mesh.parent=null;

                                var pos1=card.mesh.position.clone();
                                var pos2;
                                var area_mesh;
                                //从物理引擎控制改为动画控制
                                for(var key in MyGame.obj_ground)//寻找目标位置
                                {
                                    var ground=MyGame.obj_ground[key];
                                    var arr=ground.arr_mesharea;
                                    var len2=arr.length;
                                    for(var j=0;j<len2;j++)
                                    {
                                        var area=arr[j];
                                        if(area.name==areaname)
                                        {
                                            pos2=area.absolutePosition.clone();
                                            pos2.y+=0.1;//还是要让standalone的卡牌在顶部，能够先于放置区被点击到
                                            area_mesh=area;
                                            break;
                                        }
                                    }
                                    if(pos2)
                                    {
                                        break;
                                    }
                                }
                                if(card.standalone)
                                {
                                    card.area=area_mesh;
                                }
                                else if(area_mesh.unit)
                                {
                                    area_mesh.unit.arr_equipment.push(card);
                                }

                                //启动动画
                                var rot_temp=new BABYLON.Vector3(Math.PI/2,0,0);
                                if(ballman.index_startpoint==2)
                                {
                                    rot_temp.x=-Math.PI/2;
                                }
                                newland.MoveWithAni2(card.mesh,pos2,(rot_temp),(new BABYLON.Vector3(1,1,1)),60
                                    ,function(){
                                        //card.belongto=webuser_id;
                                        card.state="inarea";
                                        if(card.standalone)
                                        {
                                            area_mesh.unit=card;
                                            area_mesh.isPickable=false;
                                        }
                                        else
                                        {
                                            area_mesh.unit.arr_equipment.push(card);
                                        }
                                        card.showStrip();
                                        var obj_msg={};
                                        obj_msg.type="finish_playoutcard";//抓牌完成，通知用户接收控制权
                                        //动画完成时还要把card的本身信息发给用户
                                        obj_msg.name=card.name;
                                        obj_msg.userid=webuser_id;
                                        obj_msg.uuid=card.uuid;
                                        sendMessage(JSON.stringify(obj_msg));
                                    });

                                var len2=ballman.cardinhand.length;
                                for(var j=0;j<len2;j++)
                                {
                                    if(card_uuid==ballman.cardinhand[j].uuid)
                                    {
                                        ballman.cardinhand.splice(j,1);
                                        break;
                                    }
                                }
                                CardMesh2.ArrangeHandCard(ballman.cardinhand);//重排剩余的卡牌

                                //广播告知出牌信息
                                var obj_msg={};
                                obj_msg.type="bc_playoutcard";//通知其他所有用户这一张卡的打出
                                obj_msg.name=card.name;
                                obj_msg.jsonp=card.jsonp;
                                var obj_state={
                                    hp:unit.hp,maxhp:unit.maxhp,mp:unit.mp,maxmp:unit.maxmp,sp:unit.sp,maxsp:unit.maxsp
                                    ,at:unit.at,Cost1:unit.Cost1,Cost2:unit.Cost2,power:unit.power};
                                obj_msg.jsonstate=JSON.stringify(obj_state);//单位的状态
                                obj_msg.userid=webuser_id;
                                obj_msg.mainpic= card.mainpic;
                                obj_msg.mainback= card.mainback;
                                obj_msg.comment= card.comment.split("_")[1];
                                obj_msg.userid=webuser_id;
                                obj_msg.uuid=card_uuid;
                                obj_msg.areaname=areaname;
                                sendMessage(JSON.stringify(obj_msg));
                                break;
                            }
                        }
                    }
                    break;
                }
                case "bc_playoutcard":
                {
                    if(MyGame.userid!="world")
                    {
                        var card_uuid=msg.uuid;
                        var webuser_id=msg.userid;
                        var arr_uint=[];
                        //var arr_hand=[];
                        var ballman;
                        if(webuser_id==MyGame.userid)//如果是自己的卡打出
                        {
                            arr_uint=MyGame.player.arr_units;
                            ballman=MyGame.player;
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
                                card.ispublic="1";
                                if(MyGame.WhoAmI!=webuser_id)//其他人的卡->打出后显示卡牌的详情
                                {
                                    unit.name=msg.name;
                                    unit.jsonp= msg.jsonp;
                                    var jsonp=unit.jsonp;
                                    unit.arr_skillindex=jsonp.skills;
                                    unit.standalone=jsonp.standalone;
                                    unit.backUVs=jsonp.backUVs;
                                    unit.frontUVs=jsonp.frontUVs;

                                    unit.mainpic= msg.mainpic;
                                    unit.mainback= msg.mainback;
                                    unit.comment=unit.ownerid+"_"+msg.comment;
                                    var jsonstate=JSON.parse(msg.jsonstate);
                                    unit.hp=jsonstate.hp;
                                    unit.maxhp=jsonstate.maxhp;
                                    unit.mp=jsonstate.mp;
                                    unit.maxmp=jsonstate.maxmp;
                                    unit.sp=jsonstate.sp;
                                    unit.maxsp=jsonstate.maxsp;
                                    unit.at=jsonstate.at;
                                    unit.Cost1=jsonstate.Cost1;
                                    unit.Cost2=jsonstate.Cost2;
                                    unit.power=jsonstate.power||1;

                                    var mesh_card=unit.mesh;
                                    if (MyGame.materials[card.name])
                                    {
                                        mesh_card.material = MyGame.materials[card.name];
                                    }
                                    else
                                    {
                                        var materialf = new BABYLON.StandardMaterial(card.name + "cardf", scene);
                                        materialf.diffuseTexture = new BABYLON.Texture(card.mainpic, scene);
                                        materialf.diffuseTexture.hasAlpha = false;
                                        materialf.backFaceCulling = true;
                                        materialf.bumpTexture =MyGame.textures["grained_uv"];
                                        materialf.useLogarithmicDepth = true;
                                        materialf.freeze();
                                        MyGame.materials[card.name] = materialf;
                                        mesh_card.material =materialf;
                                    }
                                }
                                var areaname=msg.areaname;
                                card.state="inani";
                                //card.mesh.scaling=new BABYLON.Vector3(1,1,1);
                                card.mesh.position=newland.vecToGlobal(new BABYLON.Vector3(0,0,0),card.mesh);
                                card.mesh.parent=null;
                                var flag_area=false;
                                for(var key in MyGame.obj_ground)//寻找目标位置
                                {
                                    var ground=MyGame.obj_ground[key];
                                    var arr=ground.arr_mesharea;
                                    var len2=arr.length;
                                    for(var j=0;j<len2;j++)
                                    {
                                        var area=arr[j];
                                        if(area.name==areaname)
                                        {
                                            flag_area=true;
                                            if(card.standalone)
                                            {
                                                area.unit=card;
                                                card.area=area;
                                                area.isPickable=false;
                                            }
                                            else if(area.unit)
                                            {
                                                area.unit.arr_equipment.push(card);
                                            }
                                            break;
                                        }
                                    }
                                    if(pos2)
                                    {
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        var len2=ballman.cardinhand.length;//从手牌中剔除
                        for(var j=0;j<len2;j++)
                        {
                            if(card_uuid==ballman.cardinhand[j].uuid)
                            {
                                ballman.cardinhand.splice(j,1);
                                break;
                            }
                        }
                        CardMesh2.ArrangeHandCard(ballman.cardinhand);//重排剩余的卡牌
                    }
                    break;
                }
                case "finish_playoutcard":
                {
                    if(MyGame.userid!="world") {
                        var card_uuid = msg.uuid;
                        var webuser_id = msg.userid;
                        var arr_uint = [];
                        var ballman;
                        if (webuser_id == MyGame.userid)//如果是自己的卡打出
                        {
                            arr_uint = MyGame.player.arr_units;
                            ballman = MyGame.player;
                        }
                        else {
                            ballman = MyGame.arr_webplayers[webuser_id];
                            arr_uint = ballman.arr_units;
                        }
                        var len = arr_uint.length;
                        for (var i = 0; i < len; i++) {
                            var unit = arr_uint[i];
                            if (unit.uuid == card_uuid)//在用户的单位列表里找到card_uuid对应的单位
                            {
                                var card = unit;
                                card.state = "inarea";
                                //绘制血条
                                card.showStrip();
                                break;
                            }
                        }
                        if(webuser_id==MyGame.WhoAmI)//解冻当前行动用户控制，因为是回合制，其他用户仍冻结
                        {
                            MyGame.flag_view="first_pick";
                        }

                    }

                    break;
                }
                case "releaseskill": {//world只负责具体执行技能和同步，技能的触发和对象选择全由普通用户负责
                    if (MyGame.userid == "world") {
                        releaseSkill(msg)
                    }
                    break;
                }
                case "bc_actionstart":
                {
                    if(MyGame.userid!="world")
                    {//msg
                        var actiontype=msg.actiontype;
                        var webuserid=msg.webuserid;
                        var uuid=msg.uuid;
                        var card=findCardByUuid(uuid,webuserid)
                        if(card)
                        {
                            card.state="inani";
                        }
                        //MyGame.flag_view="first_ani";//不修改普通用户的操作状态，否则还要改回来很麻烦
                        var actiontype=msg.actiontype;
                        if(actiontype=="throwAction")//"moveAction"没有额外的动作
                        {
                            var flag_ani=msg.flag_ani;//每个发射体
                            var target_ani=msg.target_ani;
                            var throwtype=msg.throwtype;
                            if(throwtype=="attack")
                            {
                                MyGame.bullet.material=MyGame.materials.mat_red;
                            }
                            else if(throwtype=="heal")
                            {
                                MyGame.bullet.material=MyGame.materials.mat_green;
                            }
                            MyGame.obj_bulletinstance={};
                            for(var key in flag_ani)
                            {
                                let instance_bullet=MyGame.bullet.createInstance(key);
                                instance_bullet.position=card.mesh.position.clone();
                                instance_bullet.position.y+=1;
                                MyGame.obj_bulletinstance[key]=instance_bullet;
                                var animation=new BABYLON.Animation(key,"position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                                var pos1=instance_bullet.position.clone();
                                var p=target_ani[key]
                                var pos2=new BABYLON.Vector3(p.x,p.y,p.z);
                                var keys=[{frame:0,value:pos1},{frame:30,value:pos2}];
                                animation.setKeys(keys);
                                instance_bullet.animations.push(animation);
                                scene.beginAnimation(instance_bullet, 0, 30, false,1,function(){
                                    instance_bullet.dispose();
                                });
                            }
                        }
                        else if(actiontype=="attacktoAction")
                        {

                        }
                        else if(actiontype=="attackAction")
                        {

                        }
                    }
                    break;
                }
                case "finish_action":
                {
                    if(MyGame.userid!="world")
                    {
                        var actiontype=msg.actiontype;
                        var webuserid=msg.webuserid;
                        var uuid=msg.uuid;
                        var areaname=msg.areaname;
                        if(actiontype=="moveAction")//ifelse比swichcase要灵活一些
                        {
                            var card=findCardByUuid(uuid,webuserid)
                            if(card)
                            {
                                card.state="inarea";
                                
                            }
                            var area=findAreaByName(areaname);
                            if(card&&area)
                            {
                                card.area.isPickable=true;
                                card.area.unit=null;
                                card.area=area;
                                area.unit=card;
                                area.isPickable=false;
                            }
                            if(webuserid==MyGame.WhoAmI)//解冻当前行动用户控制，因为是回合制，其他用户仍冻结
                            {
                                MyGame.flag_view="first_pick";
                            }
                        }
                        else if(actiontype=="throwAction")
                        {
                            var card=findCardByUuid(uuid,webuserid)
                            if(card)
                            {
                                card.state="inarea";
                            }
                            if(webuserid==MyGame.WhoAmI)//解冻当前行动用户控制，因为是回合制，其他用户仍冻结
                            {
                                MyGame.flag_view="first_pick";
                            }
                            //for(key in )
                        }
                        else if(actiontype=="attacktoAction")
                        {
                            var card=findCardByUuid(uuid,webuserid)
                            if(card)
                            {
                                card.state="inarea";
                            }
                            if(webuserid==MyGame.WhoAmI)//解冻当前行动用户控制，因为是回合制，其他用户仍冻结
                            {
                                MyGame.flag_view="first_pick";
                            }
                        }
                        else if(actiontype=="attackAction")
                        {
                            var card=findCardByUuid(uuid,webuserid)
                            if(card)
                            {
                                card.state="inarea";
                            }
                            if(webuserid==MyGame.WhoAmI)//解冻当前行动用户控制，因为是回合制，其他用户仍冻结
                            {
                                MyGame.flag_view="first_pick";
                            }
                        }
                    }
                    break;
                }
                case "command_once":
                {
                    if(MyGame.userid!="world")
                    {
                        var commandtype=msg.commandtype;
                        var webuserid=msg.webuserid;
                        var carduuid=msg.carduuid;
                        var areaname=msg.areaname;
                        var action=msg.action;
                        if(commandtype=="card_hited"){
                            var card=findCardByUuid(carduuid,webuserid);
                            if(card)
                            {//单位被击中，飘起文字提示并修改指示条
                                card.ani_shake(function() {
                                    if (action.strip_sp) {
                                        card.ani_floatstr(action.strip_sp[0], [["fillStyle", "#ffff00"]]);
                                        card.sp = action.strip_sp[1];
                                        card.changeStrip("strip_sp", action.strip_sp[1]);
                                    }
                                    else if (action.strip_hp) {
                                        card.ani_floatstr(action.strip_hp[0], [["fillStyle", "#ff0000"]]);
                                        card.hp = action.strip_hp[1];
                                        card.changeStrip("strip_hp", action.strip_hp[1]);
                                    }
                                    else if (action.strip_mp) {
                                        card.ani_floatstr(action.strip_mp[0], [["fillStyle", "#0000ff"]]);
                                        card.mp = action.strip_mp[1];
                                        card.changeStrip("strip_mp", action.strip_mp[1]);
                                    }
                                });
                            }
                        }
                        else if(commandtype=="card_dead")
                        {
                            var card=findCardByUuid(carduuid,webuserid);
                            if(card)
                            {
                                card.state="isdestoried";
                                card.ani_floatstr("dead",[["fillStyle","#aaaaaa"]]);
                                card.changeStrip("strip_hp",0,function(){
                                    card.ani_destory();
                                });
                            }
                        }

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
    else
    {
        MyGame.ws="NotOnline";
        console.log("非联网模式");
        callback();
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
    if(MyGame.userid=="world")
    {//world用户初始化时从数据库获取世界状态，world用户的内存是世界实时状态的保存者，world用户可以把世界状态写入数据库
        var obj_json={
            type:"setuserid",
            userId:MyGame.userid,
            token:token,
            pgid:pgid,
        };
        sendMessage(JSON.stringify(obj_json));
    }
    else{//其他用户初始化时从world用户获取世界状态，并在之后向world提交自己的更改和从world接收同步信息
        var obj_json={
            type:"setuserid2",
            userId:MyGame.userid,
            token:token,
            pgid:pgid,
        };
        sendMessage(JSON.stringify(obj_json));
    }

}