/**
 * The arena is the world where the player will evolve
 * @param scene
 * @constructor
 */
Arena = function(game) {
    this.game = game;
    //地图的宽高
    this.sizew=200;
    this.sizeh=200;
    //链接Babylon模型导出，现场生成地形过于耗时，尝试导入网格？
    /*var vdata_ground=new BABYLON.VertexData.CreateGround({width:this.sizew,height:this.sizeh
        ,subdivisionsX:this.sizew,subdivisionsY:this.sizeh});
    var arr_vposition=vdata_ground.positions;
    var map=[];
    var len=arr_vposition.length/3;
    //将位置相同点和位置相近点整理出来
    for(var i=0;i<len;i++)
    {
        //var p={x:arr_vposition[i*3],y:arr_vposition[i*3+1],z:arr_vposition[i*3+2]};//对于每一个顶点
        var p=new BABYLON.Vector3(arr_vposition[i*3],arr_vposition[i*3+1],arr_vposition[i*3+2]);
        var found=false;
        for(var j=0;j<map.length;j++)
        {
            var arr=map[j];//map数组的每一行都是一个数组
            var p2=arr[0];//这个每一行数组的第一位是一个三元向量
            if(p2.equals(p)||(p2.subtract(p)).lengthSquared()<0.01)
            {
                arr.push(i*3);//行数组后面存储位置的索引
                found=true;
            }
        }
        if(!found)
        {
            var arr=[];
            arr.push(p,i*3);
            map.push(arr);
        }
    }
    map.forEach(
        function(array)
        {
            var num_x=array[0].x;
            var num_y=array[0].y;
            var num_z=array[0].z;
            //如果在平面圆的内部
            if(Math.pow(num_x/2-50,2)+Math.pow(num_z,2)<=2500)
            {
                var len=array.length;
                var num_dy=Math.sqrt(2500-Math.pow(num_z,2)-Math.pow((num_x/2-50),2))/4;
                for(var i=1;i<len;i++)
                {
                    var j=array[i];//是位置的索引数字
                    //反过来修改最初的位置数组
                    arr_vposition[j+1]+=num_dy;
                    if(arr_vposition[j+1]>11)
                    {
                        arr_vposition[j+1]=11;
                    }
                }
            }
        }
    )
    BABYLON.VertexData._ComputeSides(0, arr_vposition, vdata_ground.indices, vdata_ground.normals
        , vdata_ground.uvs);
    var ground=new BABYLON.Mesh("mesh_ground",this.game.scene);
    ground.renderingGroupId=2;
    vdata_ground.applyToMesh(ground, true);*/
    var ground = BABYLON.Mesh.CreateGround("ground",  this.sizew,  this.sizeh, 2, this.game.scene);
    //var ground=this.game.assets["arena2"][1];
    ground.isVisible=true;
    this._deactivateSpecular(ground);
    ground.checkCollisions = true;
    ground.renderingGroupId=2;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9 ,friction:0.5}, this.game.scene);
    MyGame.player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function(main, collided) {
        MyGame.player.standonTheGround = 1;//认为玩家与地面碰撞意味着玩家站在了地上
    });
    this.mesh=ground;

    var _this = this;
    setInterval(function() {
        var posX = _this._randomNumber(-_this.sizew/2, _this.sizew/2);
        var posZ = _this._randomNumber(-_this.sizeh/2, _this.sizeh/2);
        //scene.get
        if(count.targets<20)
        {
            var t = new Target(_this.game, posX, posZ);
            count.targets++;
        }

    }, 1000);

    // Minimap
    var player_x=this.game.player.camera.position.x;
    var player_z=this.game.player.camera.position.z;
    //改用target相机？？
    var mm = new BABYLON.FreeCamera("minimap", new BABYLON.Vector3(player_x,100,player_z), this.game.scene);
    //var mm = new BABYLON.FollowCamera("minimap", new BABYLON.Vector3(player_x,100,player_z), this.game.scene);
    mm.layerMask = 1;
    //mm.setTarget(new BABYLON.Vector3(0.1,0.1,0.1));
    mm.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;

    mm.orthoLeft = player_x-50//-this.sizew/2;
    mm.orthoRight = player_x+50//this.sizew/2;
    mm.orthoTop =  player_z+50//this.sizeh/2;
    mm.orthoBottom = player_z-50//-this.sizeh/2;
    this.mm=mm;

    ground.registerBeforeRender(function() {

        //var player_x=MyGame.player.mmmesh.position.x;
        //var player_z=MyGame.player.mmmesh.position.z;
        //_this.mm.position.x = player_x;//globalPosition,_absolutePosition
        //_this.mm.position.z = player_z;
        //_this.mm.rotation.x = Math.PI/2;
        //_this.mm.rotation.y = 0;
        //_this.mm.rotation.z = -MyGame.player.camera.rotation.y-Math.PI/2;
        //_this.mm.orthoLeft = player_x-50//-this.sizew/2;
        //_this.mm.orthoRight = player_x+50//this.sizew/2;
        //_this.mm.orthoTop =  player_z+50//this.sizeh/2;
        //_this.mm.orthoBottom = player_z-50//-this.sizeh/2;
    });
    //mm.lockedTarget=this.game.player.mmmesh;
    mm.rotation.x = Math.PI/2;
    mm.rotation.z = this.game.player.camera.rotation.y-Math.PI/2;//-Math.PI/2;
    this.mm=mm;

    var xstart = 0.8,
        ystart = 0.75;
    var width = 0.99-xstart,
        height = 1-ystart;

    mm.viewport = new BABYLON.Viewport(
        xstart,
        ystart,
        width,
        height
    );
    this.game.scene.activeCameras.push(mm);
    var canvas = this.game.scene.getEngine().getRenderingCanvas();
    //mm.attachControl(canvas);//加了这一行小地图才能移动！！
    //this.game.scene.activeCamera = mm;
};


Arena.prototype = {

    /**
     * Generates a random number between min and max
     * @param min
     * @param max
     * @returns {number}
     * @private
     */
    _randomNumber : function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    },

    _deactivateSpecular : function(mesh) {
        if (!mesh.material) {
            var mat_grass = new BABYLON.StandardMaterial("mat_grass", this.game.scene);//雪地材质
            mat_grass.diffuseTexture = new BABYLON.Texture("assets/arena/terre.png", this.game.scene);//地面的纹理贴图
            mat_grass.diffuseTexture.uScale = 10.0;//纹理重复效果
            mat_grass.diffuseTexture.vScale = 10.0;
            mat_grass.diffuseTexture.hasAlpha = false;
            mat_grass.backFaceCulling=false;
            mat_grass.diffuseTexture.coordinatesMode=BABYLON.Texture.SPHERICAL_MODE  ;
            mesh.material = mat_grass;
        }
        mesh.material.specularColor = BABYLON.Color3.Black();

    }

};