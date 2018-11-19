/**
 * Created by lz on 2018/3/12.
 */
Game=function(init_state,flag_view,wsUri,h2Uri)
{
    var _this = this;
    this.scene=scene;
    this.loader =  new BABYLON.AssetsManager(scene);;//资源管理器
    //控制者数组
    this.arr_myplayers={};
    this.arr_webplayers={};
    this.arr_npcs={};
    this.count={};
    this.count.count_name_npcs=0;
    this.Cameras={};//scene里也有？
    this.websocket;
    this.lights={};
    this.fsUI=BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
    this.hl=new BABYLON.HighlightLayer("hl1", scene);
    this.hl.blurVerticalSize = 1.0;//这个影响的并不是高光的粗细程度，而是将它分成 多条以产生模糊效果，数值表示多条间的间隙尺寸
    this.hl.blurHorizontalSize =1.0;
    this.hl.innerGlow = false;
    this.hl.alphaBlendingMode=3;
    //this.hl.isStroke=true;
    //this.hl.blurTextureSizeRatio=2;
    //this.hl.mainTextureFixedSize=100;
    //this.hl.renderingGroupId=3;
    //this.hl._options.mainTextureRatio=1000;

    this.wsUri=wsUri;
    this.init_state=init_state;//当前运行状态
    /*0-startWebGL
    1-WebGLStarted
    2-PlanetDrawed
     * */
    this.h2Uri=h2Uri;
    //我是谁
    this.WhoAmI=newland.randomString(8);

    this.materials={};
    var mat_frame = new BABYLON.StandardMaterial("mat_frame", scene);
    mat_frame.wireframe = true;
    this.materials.mat_frame=mat_frame;
    var mat_red=new BABYLON.StandardMaterial("mat_red", scene);
    mat_red.diffuseColor = new BABYLON.Color3(1, 0, 0);
    var mat_green=new BABYLON.StandardMaterial("mat_green", scene);
    mat_green.diffuseColor = new BABYLON.Color3(0, 1, 0);
    var mat_blue=new BABYLON.StandardMaterial("mat_blue", scene);
    mat_blue.diffuseColor = new BABYLON.Color3(0, 0, 1);
    this.materials.mat_red=mat_red;
    this.materials.mat_green=mat_green;
    this.materials.mat_blue=mat_blue;

    this.models={};
    this.textures={};
    this.texts={};

    this.flag_startr=0;//开始渲染并且地形初始化完毕
    this.flag_starta=0;
    this.list_nohurry=[];
    this.nohurry=0;//一个计时器，让一些计算不要太频繁
    this.flag_online=false;
    this.flag_view=flag_view;//first/third/input/free
    this.flag_controlEnabled = false;
    this.arr_keystate=[];
    this.SpriteManager=new BABYLON.SpriteManager("treesManagr", "../ASSETS/IMAGE/CURSOR/palm.png", 2000, 100, scene);
    this.SpriteManager.renderingGroupId=2;
}
Game.prototype={
    AddNohurry:function(name,delay,lastt,todo,count)
    {
        if(this.list_nohurry[name])
        {
            return;
        }
        this.list_nohurry[name]={delay:delay,lastt:lastt,todo:todo
            ,count:count};
    },
    RemoveNohurry:function(name)
    {
        delete this.list_nohurry[name];
    },
    HandleNoHurry:function()
    {
        var _this=this;
        if( _this.flag_startr==0)//开始渲染并且地形初始化完毕！！
        {
            engine.hideLoadingUI();
            _this.flag_startr=1;
            _this.lastframet=new Date().getTime();
            _this.firstframet=_this.lastframet;
            _this.DeltaTime=0;
        }
        else
        {
            _this.currentframet=new Date().getTime();
            _this.DeltaTime=_this.currentframet-_this.lastframet;//取得两帧之间的时间
            _this.lastframet=_this.currentframet;
            /*_this.nohurry+=_this.DeltaTime;

            if(MyGame&&_this.nohurry>1000)//每一秒进行一次导航修正
            {
                _this.nohurry=0;

            }*/
            //var time_start=_this.currentframet-_this.firstframet;//当前时间到最初过了多久
            for(var i=0;i<_this.list_nohurry.length;i++)
            {
                var obj_nohurry=_this.list_nohurry[i];
                if(obj_nohurry.lastt==0)
                {
                    obj_nohurry.lastt=new Date().getTime();
                }
                else
                {
                    var time_start=_this.currentframet-obj_nohurry.lastt;
                    if(time_start>obj_nohurry.delay)//如果经过的时间超过了每次执行周期乘以执行次数加一，则执行一次
                    {
                        obj_nohurry.todo();
                        obj_nohurry.count++;
                        obj_nohurry.lastt=_this.currentframet;
                        break;//每一帧最多只做一个费时任务，周期更短的任务放在队列前面，获得更多执行机会
                    }
                }

            }
            if(_this.flag_starta==1)//如果开始进行ai计算，否则只处理和基本ui有关的内容
            {

            }
        }
    }
}