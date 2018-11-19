/**
 * Created by lz on 2018/10/19.
 */
var point_x=10;//这里是顶点个数，实际的宽高要减一
var point_y=17;
var count_cardname=0;

//将卡片的绘制和排列分成两个函数
function DrawCard4()
{
    for(var i=0;i<20;i++)
    {
        var card_test=new CardMesh();
        var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
            ,card:arr_carddata["OREO"]
            ,linecolor:new BABYLON.Color3(0, 1, 0)
            ,scene:scene
            ,position:new BABYLON.Vector3(0,0,0)
            ,rotation:new BABYLON.Vector3(0,0,0)
            ,scaling:new BABYLON.Vector3(0.1,0.1,0.1)
            ,belongto:MyGame.WhoAmI
        };
        card_test.init(obj_p,scene);
        card_test.mesh.parent=mesh_arr_cards;
        count_cardname++;
    }
    for(var i=0;i<20;i++)
    {
        var card_test=new CardMesh();
        var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
            ,card:arr_carddata["Octocat"]
            ,linecolor:new BABYLON.Color3(0, 0, 1)
            ,scene:scene
            ,position:new BABYLON.Vector3(0,0,0)
            ,rotation:new BABYLON.Vector3(0,0,0)
            ,scaling:new BABYLON.Vector3(0.1,0.1,0.1)
            ,belongto:MyGame.WhoAmI
        };
        card_test.init(obj_p,scene);
        card_test.mesh.parent=mesh_arr_cards;
        count_cardname++;
    }
    //为了方便测试，预先在棋盘上放置一个棋子
    var card_test=new CardMesh();
    var pos,bel,color,type;
    pos=new BABYLON.Vector3(1.5,0,1.5);
    bel=MyGame.WhoAmI;
    color=new BABYLON.Color3(0, 1, 0);
    type="OREO";
    var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
        ,card:arr_carddata[type]
        ,linecolor:color
        ,scene:scene
        ,position:pos
        ,rotation:new BABYLON.Vector3(0,0,0)
        ,scaling:new BABYLON.Vector3(0.1,0.1,0.1)
        ,belongto:bel
    };
    card_test.init(obj_p,scene);
    card_test.mesh.parent=mesh_tiledCard;
    card_test.workstate="wait";
    count_cardname++;
    var card_test2=new CardMesh();
    var pos,bel,color,type;
    pos=new BABYLON.Vector3(-1.5,0,-1.5);
    bel=MyGame.WhoAmI;
    color=new BABYLON.Color3(0, 1, 0);
    type="Octocat";
    var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
        ,card:arr_carddata[type]
        ,linecolor:color
        ,scene:scene
        ,position:pos
        ,rotation:new BABYLON.Vector3(0,0,0)
        ,scaling:new BABYLON.Vector3(0.1,0.1,0.1)
        ,belongto:bel
    };
    card_test2.init(obj_p,scene);
    card_test2.mesh.parent=mesh_tiledCard;
    card_test2.workstate="wait";
    count_cardname++;
}
var skill_current=null;//当前单位选择的技能
var arr_cardTarget=[];//当前效果的目标群体
var fightDistance=0;//fight发生时双方的距离
function NextRound()//将所有棋子的状态置为wait（后续添加对特殊状态的处理）
{
    var units=mesh_tiledCard._children;
    var len=units.length;
    for(var i=0;i<len;i++)
    {
        var unit=units[i];
        card_Closed2=unit;
        var skills=unit.card.skills;//更新每个reload和last的技能时间，还要令回合结束时的被动技能生效
        for(var key in skills)
        {
            var skill=skills[key];
            var skill2=arr_skilldata[key];
            if(skill.ap=="p_next")
            {
                if(skill.eval)
                {
                    eval(skill.eval);
                }
            }
            if(skill.reload!="full")
            {
                skill.reload++;
                if(skill.reload>=skill2.reloadp)//如果装填完毕
                {
                    skill.reload="full"
                }
            }
            if(skill.last!="forever"&&skill.ap!="p_wake")
            {
                skill.last--;
                if(skill.last<=0)//如果持续时间结束
                {
                    if(skill.eval2)
                    {
                        eval(skill.eval2);
                    }

                    delete skills[key];//删除这个效果
                }
            }
        }

            unit.card.workstate="wait";
        /*for(var key in skills)
        {
            if(skill.ap=="p_wake")//p_wake的是触发式的状态，它的last由技能自身控制？
            {
                if(skill.eval)
                {
                    eval(skill.eval);
                    skill.last--;
                    if(skill.last==0)//如果持续时间结束
                    {
                        if(skill.eval2)
                        {
                            eval(skill.eval2);
                        }

                        delete skills[key];//删除这个效果
                    }
                }
            }
        }*/
    }
    card_Closed2=null;
}
function Card2Chess()//将当前选中的手牌设为手中棋子
{
    MyGame.player.centercursor.color="orange";
    MyGame.player.changePointerLock2("first_lock");
    HandCard(1);

    //切换回first_lock状态
}
function Card2Chess2(mesh)//将手中棋子放在棋盘上
{
    if(card_Closed.num_group>-1&&card_Closed.num_group<5)
    {
        delete arr_cardgroup[card_Closed.num_group][card_Closed.mesh.name];
        /*if(Object.getOwnPropertyNames(arr_cardgroup[card.num_group]).length==0)
         {
         arr_mesh_groupicon[card.num_group].isVisible=false;
         }*/
    }
    card_Closed.mesh.parent=null;
    card_Closed.mesh.parent=mesh_tiledCard;
    card_Closed.mesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
    card_Closed.mesh.position=mesh.position.clone();//棋子放在地块位置。
    card_Closed.mesh.position.y=0;
    card_Closed.workstate="wait";
    noPicked(card_Closed);
    card_Closed2=card_Closed;
    card_Closed2.display();
    PickCard2(card_Closed2);
    card_Closed=null;
    MyGame.player.centercursor.color="blue";
}

//function