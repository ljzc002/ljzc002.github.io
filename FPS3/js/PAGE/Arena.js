/**
 * The arena is the world where the player will evolve
 * @param scene
 * @constructor
 */
Arena = function(game) {
    this.game = game;

    //链接Babylon模型导出，现场生成地形过于耗时，尝试导入网格？

    //var ground = BABYLON.Mesh.CreateGround("ground",  this.sizew,  this.sizeh, 2, this.game.scene);
    var ground=this.game.assets["mesh_ground"][1];
    ground.isVisible=true;
    this._deactivateSpecular(ground);
    //ground.checkCollisions = true;
    ground.renderingGroupId=2;


    //网格材质
    var mat_frame = new BABYLON.StandardMaterial("mat_frame", scene);
    mat_frame.wireframe = true;
    var mat_grass = new BABYLON.StandardMaterial("mat_grass", this.game.scene);//雪地材质
    mat_grass.diffuseTexture = new BABYLON.Texture("assets/arena/terre.png", this.game.scene);//地面的纹理贴图
    mat_grass.diffuseTexture.uScale = 10.0;//纹理重复效果
    mat_grass.diffuseTexture.vScale = 10.0;
    mat_grass.diffuseTexture.hasAlpha = false;
    mat_grass.backFaceCulling=false;
    mat_grass.diffuseTexture.coordinatesMode=BABYLON.Texture.SPHERICAL_MODE  ;
    mat_grass.specularColor=new BABYLON.Color3(0,0,0);
    ground.material = mat_grass;
    //ground.material=mat_frame;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, restitution: 0.9 ,friction:0.5}, scene);

    MyGame.player.mesh.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, function(main, collided) {
        MyGame.player.standonTheGround = 1;//认为玩家与地面碰撞意味着玩家站在了地上
    });
    this.mesh=ground;

    if(ground.mydata&&ground.mydata.walkabilityMatrix)
    {
        this.walkabilityMatrix=ground.mydata.walkabilityMatrix;
        /*var len=this.walkabilityMatrix.length;
        for(var i=0;i<len;i++)
        {
            var len2=this.walkabilityMatrix[i].length;
            for(var j=0;j<len2;j++)
            {
                if(this.walkabilityMatrix[i][j]!=0)
                {
                    this.walkabilityMatrix[i][j]=1;
                }
            }
        }*/
        //地图的宽高
        this.len_x=ground.mydata.len_x;
        this.len_y=ground.mydata.len_y;
        this.len_s=ground.mydata.len_s;
        this.grid=new PF.Grid(this.len_x,this.len_y,this.walkabilityMatrix);//文档有坑！！

    }

    var _this = this;

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
        //mesh.material.specularColor = BABYLON.Color3.Black();

    }

};