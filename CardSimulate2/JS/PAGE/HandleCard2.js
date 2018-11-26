/**
 * Created by lz on 2018/9/10.
 */
var mesh_arr_cards=null;//用来排布若干card的参考点
var arr_cardgroup=[{},{},{},{},{}];
var arr_mesh_groupicon=[];//在每一组分组元素前显示组号
var flag_showhandcard=false;
//根据mesh_arr_cards._children和arr_cardgroup进行排序
function SortCard()
{
    var arr_mycards=mesh_arr_cards._children;
    var len=arr_mycards.length;
    var lenx = 10;//每一行的元素个数
    var leny = 4;//一页显示的最多有2行
    var count=0;//记录元素位置占用了多少个
    var widthp = 0.9;//每个卡片经过缩放后的实际宽度
    var heightp = 1.6;
    var marginx = 0.2;
    var marginy = 0.2;
    var len2=arr_cardgroup.length;
    for(var i=0;i<len2;i++)//先绘制分组的元素
    {
        var obj=arr_cardgroup[i];
        var flag_icon=0;//是否已经放置了标记
        var x=0,y=0;
        for(key in obj)
        {
            x = count % lenx;//从左往右数的索引
            y = Math.floor(count / lenx);//从上往下数的索引
            var posx = (x - lenx / 2) * (widthp + marginx);
            var posy = -(y - leny / 2) * (heightp + marginy) - 0.2;
            if(flag_icon==0)//还未放置标记
            {
                //arr_mesh_groupicon[i].position=new BABYLON.Vector3(posx-1.5,posy,0);
                arr_mesh_groupicon[i].parent=obj[key].mesh;
                arr_mesh_groupicon[i].isVisible=true;
                flag_icon=1;
            }
            obj[key].mesh.position=new BABYLON.Vector3(posx,posy,0);
            count++;
        }
        if(flag_icon==0)//如果最后也每放置标记，说明这个分组没有元素，将分组标记撤除
        {
            arr_mesh_groupicon[i].isVisible=false;
        }
        else
        {//如果用到了这个分组
            count=(y+1)* lenx;//空位补齐
        }
    }
    for(var i=0;i<len;i++)
    {
        var mesh=arr_mycards[i];
        if(mesh.card.num_group==999)//处理没有分组的元素
        {
            var x = count % lenx;//从左往右数的索引
            var y = Math.floor(count / lenx);//从上往下数的索引
            var posx = (x - lenx / 2) * (widthp + marginx);
            var posy = -(y - leny / 2) * (heightp + marginy) - 0.2;
            mesh.position=new BABYLON.Vector3(posx,posy,0);
            count++;
        }

    }

    //预备在这里添加对dust状态卡牌的处理--》
}
//对已经建立的卡片的各种处理方法放在这里
var arr_pickedCards=[];
var card_firstpick=null;
function PickCard(card)
{
    if(card_Closed)//如果有拉近显示的卡片，则先把他恢复原样
    {

        MyGame.flag_view="first_ani";
        var animation1=new BABYLON.Animation("animation1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:15,value:card_Closed.oldpositon}];
        animation1.setKeys(keys1);
        card_Closed.mesh.animations=[];//在推入动画之前最好清空动画数组，如果推入的动画内容相同则相当于只执行一次，如果不同则都会执行
        card_Closed.mesh.animations.push(animation1);
        var animation2=new BABYLON.Animation("animation2","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.5,0.5,0.5)},{frame:15,value:new BABYLON.Vector3(0.1,0.1,0.1)}];
        animation2.setKeys(keys2);
        card_Closed.mesh.animations.push(animation2);
        scene.beginAnimation(card_Closed.mesh, 0, 15, false,1,function(){
            card_Closed=null;
            MyGame.flag_view="first_pick";
            MyGame.UiPanell.buttonc2c.isVisible=false;
        });
        return;
    }

    var len=arr_pickedCards.length;
    var arr_state=MyGame.arr_keystate;
    var arr_mycards=mesh_arr_cards._children;//这个数组里的元素都是网格
    var len2=arr_mycards.length;
    var count=0;//加入分组特性后排序也要修改一下
    var len3=arr_cardgroup;
    for(var i=0;i<len3;i++)
    {
        for(key in arr_cardgroup[i])
        {
            arr_cardgroup[i][key].index=count;
            count++;
        }
    }
    for(var i=0;i<len2;i++)
    {
        arr_mycards[i].card.index=count;
        count++;
    }

    if(card.isPicked)
    //如果目前已经选中这个卡片，
        // 如果有多个选中卡片，如果当前按住了space，则取消它的选中（alt留着用来切换视角）
            //如果按住了shift，则将shift选择的区域截断到这里（允许同时按下？）
            // ，如果没有按住space或shift，则取消除它以外的所有选中
    // 如果只有这一个选中卡片，则放大它
    {
        if(len>1)
        {
            if(arr_state[16]==1)//按着shift
            {
                if(card_firstpick)//如果已经选定过一个卡片，将首选卡片和这个卡片之间的所有卡片选定
                {
                    if(card_firstpick.index>card.index)
                    {
                        for(var i=0;i<len2;i++)
                        {
                            var card0=arr_mycards[i].card;
                            if(i<=card_firstpick.index&&i>=card.index)
                            {
                                if(i!=card_firstpick.index)//首选元素就不向选取数组里放了
                                {
                                    //选中选取范围内的所有元素
                                    getPicked(card0);
                                    //card_firstpick=card;
                                    arr_pickedCards.push(card0);
                                }
                            }
                            else
                            {//删除选取范围外的所有已选中元素
                                if(card0.isPicked)
                                {
                                    noPicked(card0);//
                                    var len3=arr_pickedCards.length;
                                    for(var j=0;j<len3;j++){//从选取数组中找到这个元素，并删除它
                                        if(arr_pickedCards[j].mesh.name==card0.mesh.name)
                                        {
                                            arr_pickedCards.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(card_firstpick.index<card.index)//
                    {
                        for(var i=0;i<len2;i++)
                        {
                            var card0=arr_mycards[i].card;
                            if(i>=card_firstpick.index&&i<=card.index)
                            {
                                if(i!=card_firstpick.index)//首选元素就不向选取数组里放了
                                {
                                    //选中选取范围内的所有元素
                                    getPicked(card0);
                                    //card_firstpick=card;
                                    arr_pickedCards.push(card0);
                                }
                            }
                            else
                            {//删除选取范围外的所有已选中元素
                                if(card0.isPicked)
                                {
                                    noPicked(card0);//
                                    var len3=arr_pickedCards.length;
                                    for(var j=0;j<len3;j++){//从选取数组中找到这个元素，并删除它
                                        if(arr_pickedCards[j].mesh.name==card0.mesh.name)
                                        {
                                            arr_pickedCards.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(card_firstpick.index==card.index)
                    {
                        GetCardClose(card);//将这张卡片拿近
                        //同时释放掉所有被选中的卡片
                        for(var i=0;i<len;i++)
                        {
                            var card0=arr_pickedCards[i];
                            noPicked(card0);
                        }
                        arr_pickedCards=[];
                        card_firstpick=null;
                    }
                }
            }
            if(arr_state[17]==1)//空格代替了ctrl
            {//取消这张卡片的选中
                noPicked(card);
                //var len3=arr_pickedCards.length;
                for(var j=0;j<len;j++){//从选取数组中找到这个元素，并删除它
                    if(arr_pickedCards[j].mesh.name==card.mesh.name)
                    {
                        arr_pickedCards.splice(j,1);
                        break;
                    }
                }
                card_firstpick=arr_pickedCards[arr_pickedCards.length-1];
            }
            if(arr_state[17]!=1&&arr_state[16]!=1)
            {
                GetCardClose(card);//将这张卡片拿近
                //同时释放掉所有被选中的卡片
                for(var i=0;i<len;i++)
                {
                    var card0=arr_pickedCards[i];
                    noPicked(card0);
                }
                arr_pickedCards=[];
                card_firstpick=null;
            }
        }
        else//目前只有这一张卡片被选中，然后点击了他
        {
            GetCardClose(card);
            noPicked(card);
            arr_pickedCards=[];
            card_firstpick=null;
        }
    }
    else    //这张卡片还没有被选中
    {
        if(len>0)//还有其他被选中的卡片
        {
            if(arr_state[16]==1)//按着shift
            {
                if(card_firstpick)//如果已经选定过一个卡片，将首选卡片和这个卡片之间的所有卡片选定
                {//如果选取数组不空则一定有首选元素？？

                    if(card_firstpick.index>card.index)
                    {
                        for(var i=0;i<len2;i++)
                        {
                            var card0=arr_mycards[i].card;
                            if(i<=card_firstpick.index&&i>=card.index)
                            {
                                if(i!=card_firstpick.index)//首选元素就不向选取数组里放了
                                {
                                    //选中选取范围内的所有元素
                                    getPicked(card0);
                                    //card_firstpick=card;
                                    arr_pickedCards.push(card0);
                                }
                            }
                            else
                            {//删除选取范围外的所有已选中元素
                                if(card0.isPicked)
                                {
                                    noPicked(card0);//
                                    var len3=arr_pickedCards.length;
                                    for(var j=0;j<len3;j++){//从选取数组中找到这个元素，并删除它
                                        if(arr_pickedCards[j].mesh.name==card0.mesh.name)
                                        {
                                            arr_pickedCards.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if(card_firstpick.index<card.index)//因为card是未选中的所以card_firstpick.index与card.index不会相等
                    {
                        for(var i=0;i<len2;i++)
                        {
                            var card0=arr_mycards[i].card;
                            if(i>=card_firstpick.index&&i<=card.index)
                            {
                                if(i!=card_firstpick.index)//首选元素就不向选取数组里放了
                                {
                                    //选中选取范围内的所有元素
                                    getPicked(card0);
                                    //card_firstpick=card;
                                    arr_pickedCards.push(card0);
                                }
                            }
                            else
                            {//删除选取范围外的所有已选中元素
                                if(card0.isPicked)
                                {
                                    noPicked(card0);//
                                    var len3=arr_pickedCards.length;
                                    for(var j=0;j<len3;j++){//从选取数组中找到这个元素，并删除它
                                        if(arr_pickedCards[j].mesh.name==card0.mesh.name)
                                        {
                                            arr_pickedCards.splice(j,1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {//理论上讲，这里不会进入
                    getPicked(card);
                    card_firstpick=card;
                    arr_pickedCards.push(card);
                }
            }
            if(arr_state[17]==1)//空格代替了ctrl
            {
                getPicked(card);
                card_firstpick=card;
                arr_pickedCards.push(card);
            }
            if(arr_state[17]!=1&&arr_state[16]!=1)
            {//在没有按下shift或者space时，点击一个未选中的卡片，则释放以前选中的所有卡片，然后选中这个
                for(var i=0;i<len;i++)
                {
                    var card0=arr_pickedCards[i];
                    noPicked(card0);
                }
                arr_pickedCards=[];
                card_firstpick=null;
                getPicked(card);
                card_firstpick=card;
                arr_pickedCards.push(card);
            }
        }
        else//没有其他被选中的卡片，这应该是最简单的情况？
        {
            //card.getPicked();
            getPicked(card);
            card_firstpick=card;
            arr_pickedCards.push(card);
        }
    }
}
function getPicked(card)
{//将卡片标识为选中状态，设置高亮边框，并且将它作为第一个选中点
    card.line.isVisible=true;
    MyGame.hl.addMesh(card.line,card.linecolor);
    MyGame.hl.addMesh(card.mesh,card.linecolor);//mesh不可见则不会生成对应高光层
    //card.line.width=1000;
    //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.2,updatable:true,instance:card.line}, scene);
    card.isPicked=true;
    //card.pickindex=arr_pickedCards.length;//
}
function noPicked(card)
{
    if(card)
    {
        card.line.isVisible=false;
        MyGame.hl.removeMesh(card.line);
        MyGame.hl.removeMesh(card.mesh);
        //card.line.width=100;
        //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.05,updatable:true,instance:card.line}, scene);
        card.isPicked=false;
    }

}

var card_Closed=null;
function GetCardClose(card)
{
    MyGame.flag_view="first_ani";
    if(card_Closed)//如果已经有一个拉近的卡片
    {
        var animation1=new BABYLON.Animation("animation1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:15,value:card_Closed.oldpositon}];
        animation1.setKeys(keys1);
        card_Closed.mesh.animations=[];
        card_Closed.mesh.animations.push(animation1);
        var animation2=new BABYLON.Animation("animation2","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.5,0.5,0.5)},{frame:15,value:new BABYLON.Vector3(0.1,0.1,0.1)}];
        animation2.setKeys(keys2);
        card_Closed.mesh.animations.push(animation2);
        scene.beginAnimation(card_Closed.mesh, 0, 15, false,1,function(){
            card_Closed=card;
            card.oldpositon=card.mesh.position.clone();
            var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:15,value:new BABYLON.Vector3(0,0,-0.5)}];
            animation3.setKeys(keys1);
            card_Closed.mesh.animations=[];
            card_Closed.mesh.animations.push(animation3);
            var animation4=new BABYLON.Animation("animation4","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var keys2=[{frame:0,value:new BABYLON.Vector3(0.1,0.1,0.1)},{frame:15,value:new BABYLON.Vector3(0.5,0.5,0.5)}];
            animation4.setKeys(keys2);
            card_Closed.mesh.animations.push(animation4);
            scene.beginAnimation(card_Closed.mesh, 0, 15, false,1,function(){
                MyGame.UiPanell.buttonc2c.isVisible=true;
                MyGame.flag_view="first_pick";
            });
        });

    }
    else
    {
        card_Closed=card;
        card.oldpositon=card.mesh.position.clone();
        var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:15,value:new BABYLON.Vector3(0,0,-0.5)}];
        animation3.setKeys(keys1);
        card_Closed.mesh.animations=[];
        card_Closed.mesh.animations.push(animation3);
        var animation4=new BABYLON.Animation("animation4","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.1,0.1,0.1)},{frame:15,value:new BABYLON.Vector3(0.5,0.5,0.5)}];
        animation4.setKeys(keys2);
        card_Closed.mesh.animations.push(animation4);
        scene.beginAnimation(card_Closed.mesh, 0, 15, false,1,function(){
            MyGame.flag_view="first_pick";
            if(card_Closed.workstate!="dust")
            {
                MyGame.UiPanell.buttonc2c.isVisible=true;
            }
        });
    }
}

function ScrollUporDown(flag,heightp,row)//flag0表示向上，1表示向下，row表示滚动行数
{
    //var poshand=MyGame.player.mesh.ballman.handpoint._absolutePosition;//此时手的位置
    if(flag==0)
    {
        var arr_mycards=mesh_arr_cards._children;
        var posy=arr_mycards[arr_mycards.length-1].position.y;//找到位置最低的点
        if(mesh_arr_cards.position.y<(0-posy-row*heightp))//不完全精确的限定，但也够了
        {
            mesh_arr_cards.position.y+=row*heightp;
        }

    }
    else if(flag==1)
    {
        if(mesh_arr_cards.position.y>=row*heightp)
        {
            mesh_arr_cards.position.y-=row*heightp
        }

    }
}

function HandleGroup(keyCode)//按1到5时处理手牌分组
{
    var len =arr_pickedCards.length;
    var group=arr_cardgroup[keyCode-49];
    for(var key in group)
    {
        group[key].num_group=999;
    }
    arr_cardgroup[keyCode-49]={};//清空原来的分组
    for(var i=0;i<len;i++)
    {
        var card=arr_pickedCards[i];
        if(card.num_group!=999)//解除原来的绑定
        {
            delete arr_cardgroup[card.num_group][card.mesh.name];
            //如果被删除的那个小队的属性数量降为零，则解散那个小队，其实不需要这样做，因为sort时会去掉空小队
            /*if(Object.getOwnPropertyNames(arr_cardgroup[card.num_group]).length==0)
            {
                arr_mesh_groupicon[card.num_group].isVisible=false;
            }*/
        }
            //arr_cardgroup[card.num_group].delete(card.mesh.name);
        card.num_group=keyCode-49;//双向绑定，第一队要对应索引0！！
        arr_cardgroup[keyCode-49][card.mesh.name]=card;
        noPicked(card);
    }
    //重绘前要清空已选中手牌
    arr_pickedCards=[];
    SortCard()//根据分组情况将手牌重新排序
}
function HandCard(flag)//用动画方式表现手牌的“展开和收拢”
{
    var pos1,pos2;
    //MyGame.flag_view="first_pick";
    HideAllMask();
    if(flag==0)//将手牌从后面推到前面
    {
        /*if(card_Closed2)//如果这时正在棋盘上显示某个单位的范围
        {
            //DisposeRange();
            noPicked(card_Closed2);
            //card_Closed2.isPicked=false;
            card_Closed2=null;
        }*/
        if(card_Closed)
        {
            if(card_Closed.isPicked)
            {
                card_Closed.isPicked=false;
            }
            card_Closed=null;
        }
        MyGame.flag_view="first_ani";
        flag_showhandcard=true;
        var len=mesh_arr_cards._children.length;
        for(var i=0;i<len;i++)
        {
            mesh_arr_cards._children[i].card.display();//让每张手牌可见----
        }
        pos1=new BABYLON.Vector3(0,0,0);
        pos2=new BABYLON.Vector3(0,-2,16);
        var animation3=new BABYLON.Animation("ani_HandCard0","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:pos1},{frame:15,value:pos2}];
        animation3.setKeys(keys1);
        mesh_arr_cards.animations=[];
        mesh_arr_cards.animations.push(animation3);
        scene.beginAnimation(mesh_arr_cards, 0, 15, false,1,function(){
            SortCard();//再次展开手牌时重新排列手牌，因为有的手牌可能变成棋子了
            mesh_arr_cards.position=new BABYLON.Vector3(0,0,0);
            mesh_arr_cards.parent=MyGame.player.mesh.ballman.handpoint;
            MyGame.player.changePointerLock2("first_pick");
            MyGame.UiPanelr.buttonup.isVisible=true;
            MyGame.UiPanelr.buttondown.isVisible=true;
            MyGame.UiPanell.buttonnextr.isVisible=true;//下一回合

        });
    }
    else if(flag==1)//将手牌从前面拉到后面
    {
        MyGame.flag_view="first_ani";
        if(arr_pickedCards.length>0)//隐藏手牌时要把所有选取痕迹去掉？
        {
            var len=arr_pickedCards.length;
            for(var i=0;i<len;i++)
            {
                var card0=arr_pickedCards[i];
                noPicked(card0);
            }
            arr_pickedCards=[];
            card_firstpick=null;
        }
        MyGame.UiPanelr.buttonup.isVisible=false;
        MyGame.UiPanelr.buttondown.isVisible=false;
        MyGame.UiPanell.buttonc2c.isVisible=false;
        MyGame.UiPanell.buttonnextr.isVisible=false;
        pos1=new BABYLON.Vector3(0,0,0);
        pos2=new BABYLON.Vector3(0,2,-16);
        var animation3=new BABYLON.Animation("ani_HandCard1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:pos1},{frame:15,value:pos2}];
        animation3.setKeys(keys1);
        mesh_arr_cards.animations=[];
        mesh_arr_cards.animations.push(animation3);
        scene.beginAnimation(mesh_arr_cards, 0, 15, false,1,function(){
            if(card_Closed)
            {
                card_Closed.mesh.position=card_Closed.oldpositon;
                card_Closed.mesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
            }
            mesh_arr_cards.position=new BABYLON.Vector3(0,0,0);
            mesh_arr_cards.parent=MyGame.player.mesh.ballman.backview;
            MyGame.player.changePointerLock2("first_lock");
            var len=mesh_arr_cards._children.length;
            for(var i=0;i<len;i++)
            {
                mesh_arr_cards._children[i].card.dispose();//让每张手牌不可见----

            }
            flag_showhandcard=false;
        });
    }
}

var card_Closed2=null;
function PickCard2(card)//点击一下选中，高亮边缘，再点击也不放大？-》再点击则拉近镜头后恢复first_lock！！
//同时还要在卡片附近建立一层蓝色或红色的半透明遮罩网格，表示移动及影响范围
{//如果再次点击有已选中卡片，则把相机移到卡片面前
    if(card.isPicked)
    {
        GetCardClose2(card);
        //DisposeRange();//隐藏范围显示，规定点击棋盘时计算到达路径，点击空处时清空范围，点击其他卡牌时切换范围，切换成手牌时清空范围
    }
    else
    {

        if(card.workstate=="wait")
        {
            DisplayRange(card);//这里面包含了清除已有遮罩并且保证棋子的选中
        }
        else if(card.workstate=="moved")
        {
            //首先要检查是否有已经显示的遮罩
            if(arr_DisplayedMasks.length>0)
            {
                HideAllMask();//这里也会清空card_Closed2
            }
            card_Closed2=card;
            getPicked(card_Closed2);
            card.isPicked=true;
            if(card_Closed2.skills["nattack"])
            {
                skill_current=card_Closed2.skills["nattack"];//如果单位具有nattack技能
                document.getElementById("str_sc").innerHTML="nattack";
                canvas.style.cursor="crosshair";
                DisplayRange2(card_Closed2,card_Closed2.skills["nattack"].range);//默认显示nattack技能的范围
            }
        }
        //如果是worked则什么也不做->还是要显示信息的
        else if(card.workstate=="worked")
        {
            if(arr_DisplayedMasks.length>0)
            {
                HideAllMask();//这里也会清空card_Closed2
            }
            card_Closed2=card;
            getPicked(card_Closed2);
            card.isPicked=true;
            document.getElementById("str_sc").innerHTML="Worked";
        }
        MyGame.player.changePointerLock2("first_pick");
        DisplayUnitUI();//同时也要显示棋子操纵ui->html dom att
    }
}
function GetCardClose2(card)//让相机靠近card！！？？
{
    MyGame.flag_view="first_ani";
    MyGame.anicount=2;//如果开启了多个物体的动画，要确定这些物体的动画都结束再退出动画状态
    var pos_card=card.mesh._absolutePosition.clone();
    var pos_camera=MyGame.player.mesh.position.clone();
    var pos=pos_card.clone().add(pos_camera.clone().subtract(pos_card).normalize().scale(3));
    var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var keys1=[{frame:0,value:MyGame.player.mesh.position.clone()},{frame:30,value:pos}];
    animation3.setKeys(keys1);

    var rot_camera=MyGame.player.mesh.rotation.clone();
    var tran_temp=new BABYLON.TransformNode("tran_temp",scene);
    tran_temp.position=pos;
    tran_temp.lookAt(pos_card,Math.PI,0,0);//,Math.PI,Math.PI);YXZ?
    var rot=tran_temp.rotation.clone();//看起来这个rot是反向的，如何把它正过来？
    rot.x=-rot.x;
    //MyGame.PI2=Math.PI*2;
    //rot.x=(rot.x-Math.PI)%MyGame.PI2;
    //rot.y=(rot.y-Math.PI)%MyGame.PI2;
    //rot.z=0;//出现了奇怪的坐标反向
    tran_temp.dispose();
    var animation4=new BABYLON.Animation("animation4","rotation",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var keys2=[{frame:0,value:rot_camera},{frame:30,value:rot}];
    animation4.setKeys(keys2);
    MyGame.player.mesh.animations=[];
    MyGame.Cameras.camera0.animations=[];
    MyGame.player.mesh.animations.push(animation3);//mesh和camera必须使用相同的动画？
    //MyGame.Cameras.camera0.animations.push(animation3);
    MyGame.Cameras.camera0.animations.push(animation4);
    //MyGame.player.mesh.animations.push(animation4);
    card.isPicked=false;
    scene.beginAnimation(MyGame.player.mesh, 0, 30, false,1,function(){
        MyGame.anicount--;
        if(MyGame.anicount==0)
        {
            HideAllMask();
            MyGame.player.changePointerLock2("first_lock");
        }
    });
    scene.beginAnimation(MyGame.Cameras.camera0, 0, 30, false,1,function(){
        MyGame.anicount--;
        if(MyGame.anicount==0)
        {
            HideAllMask();
            MyGame.player.changePointerLock2("first_lock");
        }
    });
}
