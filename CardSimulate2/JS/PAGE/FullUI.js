/**
 * Created by lz on 2018/9/12.
 */
//在这里详细设定全屏等级的UI效果
function MakeFullUI()
{
    var advancedTexture = MyGame.fsUI;
    //手牌阶段的UI
    if(true)
    {
        var UiPanel = new BABYLON.GUI.StackPanel();
        UiPanel.width = "220px";
        UiPanel.fontSize = "14px";
        UiPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        UiPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        UiPanel.color = "white";
        advancedTexture.addControl(UiPanel);
        // ..
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("button1", "向上两行");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.background = "green";
        button1.isVisible=false;
        button1.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                ScrollUporDown(0,1.8,2);
            }
        });
        UiPanel.addControl(button1);
        UiPanel.buttonup=button1;
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("button2", "向下两行");
        button2.paddingTop = "10px";
        button2.width = "100px";
        button2.height = "50px";
        button2.background = "green";
        button2.isVisible=false;
        button2.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                ScrollUporDown(1,1.8,2);
            }
        });
        UiPanel.addControl(button2);
        UiPanel.buttondown=button2;

        var UiPanel2 = new BABYLON.GUI.StackPanel();
        UiPanel2.width = "220px";
        UiPanel2.fontSize = "14px";
        UiPanel2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        UiPanel2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        UiPanel2.color = "white";
        advancedTexture.addControl(UiPanel2);
        var button3 = BABYLON.GUI.Button.CreateSimpleButton("button3", "落子");
        button3.paddingTop = "10px";
        button3.width = "100px";
        button3.height = "50px";
        button3.background = "green";
        button3.isVisible=false;
        button3.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1&&card_Closed&&card_Closed.workstate!="dust")//如果完成了场景的虚拟化
            {
                Card2Chess();//将当前选中的手牌和光标关联起来，换回first_lock，并改变光标的颜色，点击空白地块时落下棋子，
            }
        });
        UiPanel2.addControl(button3);
        UiPanel2.buttonc2c=button3;
        var button4 = BABYLON.GUI.Button.CreateSimpleButton("button4", "下一回合");
        button4.paddingTop = "10px";
        button4.width = "100px";
        button4.height = "50px";
        button4.background = "green";
        button4.isVisible=false;
        button4.onPointerDownObservable.add(function(state,info,coordinates) {
            if(MyGame.init_state==1)//如果完成了场景的虚拟化
            {
                NextRound();//所有棋子的状态变为wait，特殊状态的除外
            }
        });
        UiPanel2.addControl(button4);
        UiPanel2.buttonnextr=button4;
        MyGame.UiPanelr=UiPanel;
        MyGame.UiPanell=UiPanel2;
    }
    //棋子选择阶段的UI
    if(true)
    {
        MyGame.SkillTable=new Att7();
        var all_base=document.getElementById("all_base");
        all_base.style.backgroundColor="#97ceef";
        all_base.style.border="1px solid white";
        var objp={
            base:"div_tab",
            id:"table1",
            rowsp:999,
            isThlocked:1,
            isCollocked:0,//不包括索引列？
            baseColor:"#97ceef",//"transparent"
            stripeColor:"#00aa00",
            pickColor:"#97ceef",
            showIndex:0,
            isStripe:0,
            num_toolhei:124,

        }
        if(MyGame.SkillTable.init(objp)=="ok")
        {
            var obj_datas=[
                "技能表格",
                ["名称","准备"],
                [["strp",["onMouseOver","SkillTableOver()"],["onMouseOut","SkillTableOut()"],["onClick","SkillTableClick()"]],"str"],
                [150,100]
            ];
            MyGame.SkillTable.data=obj_datas
        }
        else{
            console.log("技能表格初始化失败！");
        }
    }
}
function DisplayUnitUI()
{
    //MyGame.SkillTable
    if(card_Closed2)//如果这时已经有选中的单位，则显示单位的效果列表
    {
        document.getElementById("all_base").style.display="block";
        var data=MyGame.SkillTable.data;
        data.splice(4);//清空技能列表
        var card=card_Closed2;
        document.getElementById("str_chp").innerHTML=card.chp;
        document.getElementById("str_thp").innerHTML=card.hp;
        document.getElementById("str_cmp").innerHTML=card.cmp;
        document.getElementById("str_tmp").innerHTML=card.mp;
        document.getElementById("str_atk").innerHTML=card.attack;
        document.getElementById("str_speed").innerHTML=card.speed;
        //document.getElementById("str_range").innerHTML=card.range;
        var skills=card.skills;
        for(key in skills)//遍历显示单位所有的技能
        {
            var skill=skills[key];//单位现在具有的技能
            var skill2=arr_skilldata[key];//技能列表里的技能描述
            var str1=key,str2="full";
            if(skill.last!="forever")
            {
                str1+=("("+skill.last+")");
            }
            if(skill.reload!="full")
            {
                str2=skill.reload+"/"+skill2.reloadp;
            }
            data.push([str1
                ,str2]);
        }
        MyGame.SkillTable.draw(data,0);
        requestAnimFrame(function(){MyGame.SkillTable.AdjustWidth();});
    }


}
function DisposeUnitUI()
{
    skill_current=null;//清空当前选中的技能
    document.getElementById("str_sc").innerHTML="";
    canvas.style.cursor="default";
    arr_cardTarget=[];//清空当前选择的技能目标
    fightDistance=0;
        if(document.getElementById("div_thmask"))//删除锁定表头的遮罩层
        {
            var div =document.getElementById("div_thmask");
            div.parentNode.removeChild(div);
        }
        if(document.getElementById(MyGame.SkillTable.id))//删除表体
        {
            var tab =document.getElementById(MyGame.SkillTable.id);
            tab.parentNode.removeChild(tab);
        }
    document.getElementById("all_base").style.display="none";
}
function SkillTableOver()//在鼠标移入时先隐藏，然后显示悬浮显示描述文字
{
    //console.log("SkillTableOver");
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    delete_div("div_bz");
    Open_div("", "div_bz", 240, 120, 0, 0, obj, "div_tab");
    document.querySelectorAll("#div_bz")[0].innerHTML = MyGame.SkillTable.html_onmouseover;//向弹出项里写入结构
    document.querySelectorAll("#div_bz .div_inmod_lim_content")[0].innerHTML = card_Closed2.skills[obj.innerHTML.split("(")[0]].describe;
}
function SkillTableOut()//鼠标移出时隐藏所有描述文字
{
    //console.log("SkillTableOut");
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    delete_div("div_bz");
}
function SkillTableClick()//点击时触发技能的eval
{
    var evt=evt||window.event||arguments[0];
    cancelPropagation(evt);
    var obj=evt.currentTarget?evt.currentTarget:evt.srcElement;
    delete_div("div_bz");
    if(card_Closed2.workstate!="worked")
    {
        var skillName=obj.innerHTML.split("(")[0];
        if(card_Closed2.cmp>=card_Closed2.skills[skillName].cost)
        {
            skill_current=card_Closed2.skills[skillName];
            document.getElementById("str_sc").innerHTML=skillName;
            //console.log("SkillTableClick");
            //还要显示这个技能的释放范围
            var len=arr_DisplayedMasks.length;
            for(var i=0;i<len;i++)
            {
                arr_DisplayedMasks[i].material=MyGame.materials.mat_alpha_null;//这个数组里存的真的只是遮罩
            }
            arr_DisplayedMasks=[];
            canvas.style.cursor="crosshair";
            DisplayRange2(card_Closed2,skill_current.range);
        }

    }

}