/**
 * Created by lz on 2018/9/4.
 */
//卡牌数据
arr_carddata={
    OREO:{
        imageb:"flower"//卡背
        ,imagemain:"../ASSETS/IMAGE/CARD/OREO.png"
        ,imagedust:"../ASSETS/IMAGE/CARD/OREO_dust.png"
        ,background:"Cu"//卡片正面的背景边框
        ,attack:3,hp:4,cost:2,range:2,range2:0,mp:999
        ,speed:10
        ,str_comment:"2017年8月22日，谷歌正式发布了Android 8.0的正式版，其正式名称为：Android Oreo（奥利奥）"
        ,str_title:"安卓小人"
        ,skills:{
            walk:{reload:"full",last:"forever"}//full表示装填完成，和装填达到最大值等效，forever表示这个状态或技能永久具有
            ,nattack:{reload:"full",last:"forever"}
            ,test1:{reload:"full",last:"forever"}
        }
    },
    Octocat:{
        imageb:"flower"//卡背
        ,imagemain:"../ASSETS/IMAGE/CARD/Octocat.jpg"
        ,imagedust:"../ASSETS/IMAGE/CARD/Octocat_dust.png"
        ,background:"Ag"//卡片正面的背景边想 框
        ,attack:3,hp:4,cost:3,range:3,range2:0,mp:999
        ,speed:15
        ,str_comment:"Use the Octocat or GitHub logo to advertise that your product has built-in GitHub integration"
        ,str_title:"章鱼猫"
        ,skills:{
            walk:{reload:"full",last:"forever"}//full表示装填完成，和装填达到最大值等效，forever表示这个状态或技能永久具有
            ,nattack:{reload:"full",last:"forever"}
            ,test2:{reload:0,last:"forever"}//在每次回合结束时遍历所有单位，reload++，last--，同时又要考虑增加装填速度或者减少持续时间之类的被动效果
            ,test5:{reload:"full",last:"forever"}
        }
    }
}