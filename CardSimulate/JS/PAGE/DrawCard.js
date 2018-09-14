/**
 * Created by lz on 2018/9/4.
 */
//通过canvas排布生成动态纹理，（或者加入html2canvas，将dom排版转为dataurl？）
var point_x=10;//这里是顶点个数，实际的宽高要减一
var point_y=17;
var count_cardname=0;
var mesh_arr_cards=null;//用来排布若干card的参考点
function DrawCard()//只绘制一张
{
    mesh_arr_cards.position=MyGame.player.mesh.ballman.backview._absolutePosition.clone();
    mesh_arr_cards.isVisible=false;
    var card_test=new CardMesh();
    var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
        ,card:arr_carddata["test"]
        ,linecolor:new BABYLON.Color3(1, 0, 0)
        //arr_icons改成独立的背景透明mesh，添加在card的右上角
        /*,imagef:"../ASSETS/IMAGE/flower.png"
        ,imagemain:"../ASSETS/IMAGE/play.png",linecolor:"yellow",arr_icons:[],attack:3,hp:4,cost:2
        ,str_comment:"通过canvas排布生成动态纹理，（或者加入html2canvas，将dom排版转为dataurl？）"*/
        ,scene:scene
        ,position:new BABYLON.Vector3(0,0,0)
        ,rotation:new BABYLON.Vector3(0,0,0)
        ,scaling:new BABYLON.Vector3(0.25,0.25,0.25)
    };
    card_test.init(obj_p,scene);
    card_test.mesh.parent=mesh_arr_cards;//这样设置，卡片会在原点闪现一下
    count_cardname++;//每放入一张卡片加一

}
function DrawCard2()//一次添加十张，分成两行，每行5个
{
    mesh_arr_cards.position=MyGame.player.mesh.ballman.backview._absolutePosition.clone();
    for(var i=0;i<10;i++)
    {
        var lenx=5;//每一行的元素个数
        var leny=2;//一页显示的最多有2行
        var x=i%lenx;//从左往右数的索引
        var y=Math.floor(i/lenx);//从上往下数的索引
        var widthp=1.8;//每个卡片经过缩放后的实际宽度
        var heightp=3.2;
        var marginx=0.2;
        var marginy=0.2;
        var posx=(x-lenx/2)*(widthp+marginx);
        var posy=-(y-leny/2)*(heightp+marginy);

        var card_test=new CardMesh();
        var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
            ,card:arr_carddata["test"]
            ,linecolor:new BABYLON.Color3(0, 1, 0)
            //arr_icons改成独立的背景透明mesh，添加在card的右上角
            /*,imagef:"../ASSETS/IMAGE/flower.png"
             ,imagemain:"../ASSETS/IMAGE/play.png",linecolor:"yellow",arr_icons:[],attack:3,hp:4,cost:2
             ,str_comment:"通过canvas排布生成动态纹理，（或者加入html2canvas，将dom排版转为dataurl？）"*/
            ,scene:scene
            ,position:new BABYLON.Vector3(posx,posy,0)
            ,rotation:new BABYLON.Vector3(0,0,0)
            ,scaling:new BABYLON.Vector3(0.2,0.2,0.2)
            ,belongto:MyGame.WhoAmI
        };
        card_test.init(obj_p,scene);
        card_test.mesh.parent=mesh_arr_cards;
    }
}
function DrawCard3()//一页40个，添加翻页
{//需要有一个计数器记录总共有多少行，避免过度翻页？——》直接用最后一个元素计算？
    mesh_arr_cards.position=MyGame.player.mesh.ballman.backview._absolutePosition.clone();
    for(var i=0;i<80;i++)
    {
        var lenx=10;//每一行的元素个数
        var leny=4;//一页显示的最多有2行
        var x=i%lenx;//从左往右数的索引
        var y=Math.floor(i/lenx);//从上往下数的索引
        var widthp=0.9;//每个卡片经过缩放后的实际宽度
        var heightp=1.6;
        var marginx=0.2;
        var marginy=0.2;
        var posx=(x-lenx/2)*(widthp+marginx);
        var posy=-(y-leny/2)*(heightp+marginy)-0.2;

        var card_test=new CardMesh();
        var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
            ,card:arr_carddata["test"]
            ,linecolor:new BABYLON.Color3(0, 1, 0)
            //arr_icons改成独立的背景透明mesh，添加在card的右上角
            /*,imagef:"../ASSETS/IMAGE/flower.png"
             ,imagemain:"../ASSETS/IMAGE/play.png",linecolor:"yellow",arr_icons:[],attack:3,hp:4,cost:2
             ,str_comment:"通过canvas排布生成动态纹理，（或者加入html2canvas，将dom排版转为dataurl？）"*/
            ,scene:scene
            ,position:new BABYLON.Vector3(posx,posy,0)
            ,rotation:new BABYLON.Vector3(0,0,0)
            ,scaling:new BABYLON.Vector3(0.1,0.1,0.1)
            ,belongto:MyGame.WhoAmI
        };
        card_test.init(obj_p,scene);
        card_test.mesh.parent=mesh_arr_cards;
        count_cardname++;
    }
}
//将卡片的绘制和排列分成两个函数
function DrawCard4()
{
    for(var i=0;i<75;i++)
    {
        var card_test=new CardMesh();
        var obj_p={name:"cardname"+count_cardname,point_x:point_x,point_y:point_y
            ,card:arr_carddata["test"]
            ,linecolor:new BABYLON.Color3(0, 1, 0)
            //arr_icons改成独立的背景透明mesh，添加在card的右上角
            /*,imagef:"../ASSETS/IMAGE/flower.png"
             ,imagemain:"../ASSETS/IMAGE/play.png",linecolor:"yellow",arr_icons:[],attack:3,hp:4,cost:2
             ,str_comment:"通过canvas排布生成动态纹理，（或者加入html2canvas，将dom排版转为dataurl？）"*/
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
}
var arr_cardgroup=[{},{},{},{},{}];
var arr_mesh_groupicon=[];//在每一组分组元素前显示组号
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
}