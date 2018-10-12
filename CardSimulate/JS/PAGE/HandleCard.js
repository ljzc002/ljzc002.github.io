/**
 * Created by lz on 2018/9/10.
 */
//对已经建立的卡片的各种处理方法放在这里
var arr_pickedCards=[];
function PickCard(card)
{
    if(card_Closed)//如果有拉近显示的卡片，则先把他恢复原样
    {
        MyGame.flag_view="first_ani";
        var animation1=new BABYLON.Animation("animation1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:30,value:card_Closed.oldpositon}];
        animation1.setKeys(keys1);
        card_Closed.mesh.animations.push(animation1);
        var animation2=new BABYLON.Animation("animation2","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.5,0.5,0.5)},{frame:30,value:new BABYLON.Vector3(0.2,0.2,0.2)}];
        animation2.setKeys(keys2);
        card_Closed.mesh.animations.push(animation2);
        scene.beginAnimation(card_Closed.mesh, 0, 30, false,1,function(){
            card_Closed=null;
            MyGame.flag_view="first_pick";
        });
        return;
    }

    var len=arr_pickedCards.length;
    var arr_state=MyGame.arr_keystate;
    var arr_mycards=mesh_arr_cards._children;//这个数组里的元素都是网格
    var len2=arr_mycards.length;
    for(var i=0;i<len2;i++)
    {
        arr_mycards[i].card.index=i;
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
            if(arr_state[32]==1)//空格代替了ctrl
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
            if(arr_state[32]!=1&&arr_state[16]!=1)
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
            if(arr_state[32]==1)//空格代替了ctrl
            {
                getPicked(card);
                card_firstpick=card;
                arr_pickedCards.push(card);
            }
            if(arr_state[32]!=1&&arr_state[16]!=1)
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
function getPicked0(card)
{//将卡片标识为选中状态，设置高亮边框，并且将它作为第一个选中点
    card.line.isVisible=true;
    MyGame.hl.addMesh(card.line,card.linecolor);
    //card.line.width=1000;
    //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.2,updatable:true,instance:card.line}, scene);
    card.isPicked=true;
    //card.pickindex=arr_pickedCards.length;//
}
function noPicked0(card)
{
    card.line.isVisible=false;
    MyGame.hl.removeMesh(card.line);
    //card.line.width=100;
    //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.05,updatable:true,instance:card.line}, scene);
    card.isPicked=false;
}
function getPicked(card)
{//将卡片标识为选中状态，设置高亮边框，并且将它作为第一个选中点
    //card.line.isVisible=true;
    MyGame.hl.addMesh(card.cardf,card.linecolor);
    //card.line.width=1000;
    //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.2,updatable:true,instance:card.line}, scene);
    card.isPicked=true;
    //card.pickindex=arr_pickedCards.length;//
}
function noPicked(card)
{
    //card.line.isVisible=false;
    MyGame.hl.removeMesh(card.cardf);
    //card.line.width=100;
    //card.line=BABYLON.MeshBuilder.CreateTube(card.line.name, {path: card.path_line, radius:0.05,updatable:true,instance:card.line}, scene);
    card.isPicked=false;
}
var card_Closed=null;
function GetCardClose(card)
{
    MyGame.flag_view="first_ani";
    if(card_Closed)//如果已经有一个拉近的卡片
    {
        var animation1=new BABYLON.Animation("animation1","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:30,value:card_Closed.oldpositon}];
        animation1.setKeys(keys1);
        card_Closed.mesh.animations.push(animation1);
        var animation2=new BABYLON.Animation("animation2","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.5,0.5,0.5)},{frame:30,value:new BABYLON.Vector3(0.2,0.2,0.2)}];
        animation2.setKeys(keys2);
        card_Closed.mesh.animations.push(animation2);
        scene.beginAnimation(card_Closed.mesh, 0, 30, false,1,function(){
            card_Closed=card;
            card.oldpositon=card.mesh.position.clone();
            var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:30,value:new BABYLON.Vector3(0,0,-0.5)}];
            animation3.setKeys(keys1);
            card_Closed.mesh.animations.push(animation3);
            var animation4=new BABYLON.Animation("animation4","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            var keys2=[{frame:0,value:new BABYLON.Vector3(0.2,0.2,0.2)},{frame:30,value:new BABYLON.Vector3(0.5,0.5,0.5)}];
            animation4.setKeys(keys2);
            card_Closed.mesh.animations.push(animation4);
            scene.beginAnimation(card_Closed.mesh, 0, 30, false,1,function(){

                MyGame.flag_view="first_pick";
            });
        });

    }
    else
    {
        card_Closed=card;
        card.oldpositon=card.mesh.position.clone();
        var animation3=new BABYLON.Animation("animation3","position",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys1=[{frame:0,value:card_Closed.mesh.position.clone()},{frame:30,value:new BABYLON.Vector3(0,0,-0.5)}];
        animation3.setKeys(keys1);
        card_Closed.mesh.animations.push(animation3);
        var animation4=new BABYLON.Animation("animation4","scaling",30,BABYLON.Animation.ANIMATIONTYPE_VECTOR3,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        var keys2=[{frame:0,value:new BABYLON.Vector3(0.2,0.2,0.2)},{frame:30,value:new BABYLON.Vector3(0.5,0.5,0.5)}];
        animation4.setKeys(keys2);
        card_Closed.mesh.animations.push(animation4);
        scene.beginAnimation(card_Closed.mesh, 0, 30, false,1,function(){
            MyGame.flag_view="first_pick";
        });
    }
}