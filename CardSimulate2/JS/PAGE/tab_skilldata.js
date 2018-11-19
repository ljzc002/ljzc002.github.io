/**
 * Created by lz on 2018/10/22.
 */
//存放技能数据
arr_skilldata={
    test1:{//超频
        name:"test1"//技能的名字
        ,ap:"a"//a主动、p被动
        ,start:"wait"//起始状态
        ,end:"wait"//结束状态
        ,reloadp:3//冷却时间
        ,range:0//影响范围，0表示只影响自身
        ,cost:1//消耗的MP
        ,eval:"console.log('test1')"//执行效果
        ,describe:"移动力+10，持续2回合，冷却3回合，使用后可再次行动。"//鼠标移入时显示的文字描述
    }
    ,test2:{//重击
        name:"test2"//技能的名字
        ,ap:"a"//a主动、p被动
        ,start:"wait"//起始状态
        ,end:"worked"//结束状态
        ,reloadp:2//冷却时间
        ,range:4//影响射程，0表示只影响自身
        ,range2:0//技能范围，0表示单体
        ,cost:1//消耗的MP
        ,eval:"card_Closed2.workstate=worked"//执行效果
        ,describe:"击退1格，50%概率击晕1回合，造成普通攻击+1伤害，冷却2回合。"//鼠标移入时显示的文字描述
    }
    ,test3:{
        name:"test3"//技能的名字
        ,ap:"p_param"//a主动、p被动，p_all在所有环节生效，p_param影响单位属性，p_work在工作环节生效，p_next在点击下一回合时生效，p_weak在下一回合开始时生效（与p_next等效？），p_sleep在工作结束后立即生效，p_destoryed在被破坏时生效，p_beattack被影响时生效
        ,start:"wait"//起始状态
        ,end:"wait"//结束状态
        ,reloadp:0//冷却时间,0表示不需要冷却
        ,range:0//影响范围，0表示只影响自身
        ,cost:0//消耗的MP
        ,eval:"card_Closed2.speed+=10;"//执行效果-》被动技能的执行效果如何触发？？改变属性的被动技能有两种思路，一是在启动时改变属性然后在结束时改回来，二是不改变属性，在工作时临时累加。
        ,eval2:"card_Closed2.speed-=10;"//在结束时改回原始状态
        ,describe:"移动力+10。"
    }
    ,test4:{
        name:"test4"//技能的名字
        ,ap:"p_all"//a主动、p被动
        ,start:"wait"//起始状态
        ,end:"wait"//结束状态
        ,reloadp:0//冷却时间,0表示不需要冷却
        ,range:0//影响范围，0表示只影响自身
        ,cost:0//消耗的MP
        ,eval:"card_Closed2.workstate=worked;"//执行效果-》被动技能的执行效果如何触发？？
        ,describe:"眩晕，无法行动。"
    }
    ,test5:{
        name:"test5"//技能的名字
        ,ap:"a"//a主动、p被动
        ,start:"wait"//起始状态
        ,end:"worked"//结束状态
        ,reloadp:2//冷却时间
        ,range:4//影响射程，0表示只影响自身
        ,range2:2//技能范围，0表示单体
        ,cost:3//消耗的MP
        ,eval:"func_skills.aoe(2,4,0,[])"//执行效果
        ,describe:"在2格范围内造成攻击为4的aoe伤害,会伤害到本方。"//鼠标移入时显示的文字描述
    }
    ,walk:
    {
        name:"walk"
        ,ap:"a"
        ,start:"wait"
        ,end:"moved"
        ,reloadp:0
        ,range:0
        ,cost:0
        ,eval:""
        ,describe:"基础移动，无需特意选择"
    }
    ,nattack:
    {
        name:"nattack"
        ,ap:"a"
        ,start:"wait"
        ,end:"worked"
        ,reloadp:0
        ,range:1
        ,range2:0
        ,cost:0
        ,eval:"func_skills.nattack()"
        ,describe:"普通攻击，是默认的影响方式"
    }
}
var func_skills={
    beforeFight:function(target,skills,skillst)//这里并没有为技能设置优先级，在多个效果同时存在时可能发生不可知的情况
    {
        for(key in skills)
        {
            var skill=skills[key];
            if(skill.ap=="p_work"&&skill.eval)
            {
                eval(skill.eval);
            }
        }
        for(key in skillst)
        {
            var skill=skillst[key];
            if(skill.ap=="p_beattack"&&skill.eval)
            {
                eval(skill.eval);//比如，如果目标有firstattack技能，就跳到另一个效果方法里，nattack的效果则终结
            }
        }
    },
    afterFight:function(target,skills,skillst)
    {
        if(card_Closed2&&card_Closed2.workstate!="dust")
        {
            for(key in skills)
            {
                var skill=skills[key];
                if(skill.ap=="p_work"&&skill.eval2)
                {
                    eval(skill.eval2);
                }
            }

        }
        if(target&&target.workstate!="dust")
        {
            for(key in skillst)
            {
                var skill=skillst[key];
                if(skill.ap=="p_beattack"&&skill.eval2)
                {
                    eval(skill.eval2);//比如，如果目标有firstattack技能，就跳到另一个效果方法里，nattack的效果则终结
                }
            }
        }

    },
    unitDestory:function(target,skills,skillst)
    {
        for(key in skillst)
        {
            var skill=skillst[key];
            if(skill.ap=="p_destoryed"&&skill.eval)
            {
                eval(skill.eval);//比如，如果目标有firstattack技能，就跳到另一个效果方法里，nattack的效果则终结
            }
        }
        if(target.chp<=0)//如果没抢救过来
        {
            target.ani_destory(function(){
                func_skills.ani_final(target,skills,skillst);
            });
        }
    },
    nattack:function()
    {
        var len=arr_cardTarget.length;
        //var count_ani=0
        if(len>0)
        {
            MyGame.flag_view="first_ani";
            card_Closed2.count_ani=len;
        }

        for(var i=0;i<len;i++)
        {
            var target=arr_cardTarget[i];
            if(target.mesh.id==card_Closed2.mesh.id)//规定自己不能nattack自己？？
            {
                func_skills.ani_final();
                continue;
            }
            var skills=card_Closed2.skills;
            var skillst=target.skills;
            func_skills.beforeFight(target,skills,skillst);
            //超多层function嵌套，有没有更先进的解决方法？开始进入回调地狱
            card_Closed2.ani_beat(target,function(){
                target.chp-=card_Closed2.attack;
                target.ani_floatstr("-"+card_Closed2.attack,[],function(){
                    if(target.chp>0)//如果还活着
                    {
                        if(skillst["nattack"])//如果target具备nattack能力则反击之
                        {
                            target.ani_beat(card_Closed2,function(){
                                card_Closed2.chp-=target.attack;
                                card_Closed2.ani_floatstr("-"+target.attack,[],function(){
                                    if(card_Closed2.chp>0)
                                    {
                                        document.getElementById("str_chp").innerHTML=card_Closed2.chp;
                                        card_Closed2.workstate="worked";
                                        func_skills.ani_final(target,skills,skillst);
                                    }
                                    else
                                    {
                                        func_skills.unitDestory(card_Closed2,skills,skillst);
                                    }
                                });
                            });
                        }
                    }
                    else
                    {
                        card_Closed2.workstate="worked";
                        func_skills.unitDestory(target,skills,skillst);
                    }
                });
            });

            if(target.range>=fightDistance)//如果在target的nattack范围内
            {
                //card_Closed2.chp-=target.attack;
            }

            //
        }
    },
    aoe:function(range2,atk,isSafe,arr_state)//造成aoe伤害，影响距离、攻击力、是否会伤害本方、[[给目标添加的效果1、生效的概率、持续的时间]]
    {
        var len=arr_cardTarget.length;
        if(len>0)
        {
            MyGame.flag_view="first_ani";
            card_Closed2.count_ani=len;//有几个目标，就设置几个动画计数
        }
        else
        {
            //return;
        }
        card_Closed2.ani_shake(function(){//自己先晃动一下表示发出
            var skills=card_Closed2.skills;

            func_skills.beforeFight(null,skills,{})//如果下面的target使用var类型变量，因为js的变量提升特性，前面的target也会被自动声明！！，但是let并不具备变量提升功能！！！！
            for(var i=0;i<len;i++)
            {
                let target=arr_cardTarget[i];
                if(isSafe&&target.belongto==card_Closed2.belongto)//如果是安全aoe则跳过本方单位
                {
                    func_skills.ani_final();
                    continue;
                }

                var skillst=target.skills;
                //func_skills.beforeFight(target,{},skillst);
                target.chp-=atk;
                target.ani_floatstr("-"+atk,[],function() {
                    if(target.chp>0)//如果还活着
                    {
                        var len2=arr_state.length;
                        for(var j=0;j<len2;j++)
                        {
                            var state=arr_state[j]
                            if(newland.RandomBool(state[1]))//如果通过概率判定
                            {
                                if(skillst[state[0]])//如果已经有这一效果，则延长持续时间
                                {
                                    skillst[state[0]].last+=state[2];
                                }
                                else
                                {
                                    skillst[state[0]]={last:state[2],reload:"full"};
                                }
                            }
                        }
                        func_skills.ani_final(target,skills,skillst);
                    }
                    else
                    {

                        func_skills.unitDestory(target,skills,skillst);
                    }
                });

            }
            if(card_Closed2.workstate!="dust")
            {
                document.getElementById("str_chp").innerHTML=card_Closed2.chp;
                card_Closed2.workstate="worked";
            }

        })


    },
    brake:function()//停止正在起效的技能
    {

    },
    ani_final:function(target,skills,skillst)//在所有效果动画结束后恢复为first_lock
    {

        card_Closed2.count_ani--;
        if(card_Closed2.count_ani<=0)//假设一个aoe有多个回调线路，要确保每个回调线路都结束，再判定动作结束
        {
            if(target)
            {
                func_skills.afterFight(target,skills,skillst);
            }
            HideAllMask();
            MyGame.player.changePointerLock2("first_lock");
        }

    }

}