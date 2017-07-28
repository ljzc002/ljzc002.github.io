Weapon = function(game, player) {

    this.game = game;
    this.player = player;
    this.type="ray";//ray表示使用射线pick判断击中，ball表示发射一个物理实体用物理引擎判断击中

    // The weapon mesh
    var wp = game.assets["gun"][0];//直接从网格数组里把网格原本取出来了！！
    wp.isVisible = true;
    wp.renderingGroupId=2;
    wp.rotationQuaternion = null;
    wp.rotation.x = -Math.PI/2;
    wp.rotation.y = Math.PI;
    wp.parent = player.head;
    wp.position = player.righthand.position.clone();
    this.mesh = wp;

    // The initial rotation初始位置
    this._initialRotation = this.mesh.rotation.clone();

    // The fire rate
    this.fireRate = 250.0;
    this._currentFireRate = this.fireRate;
    this.canFire = true;

    // The particle emitter
    var scene = this.game.scene;
    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene );
    particleSystem.renderingGroupId=2;
    particleSystem.emitter = this.mesh; // the starting object, the emitter
    particleSystem.particleTexture = new BABYLON.Texture("assets/particles/gunshot_125.png", scene);
    particleSystem.emitRate = 5;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.colorDead = new BABYLON.Color4(1, 1, 1, 0.0);

    particleSystem.minLifeTime = 0.2;
    particleSystem.maxLifeTime = 0.2;

    particleSystem.updateSpeed = 0.02;
    //particleSystem.start();
    this.particleSystem = particleSystem;

    var _this = this;
    this.game.scene.registerBeforeRender(function() {
        if (!_this.canFire) {
            //_this._currentFireRate -= BABYLON.Tools.GetDeltaTime();这个方法没了
            _this._currentFireRate -= _this.game.DeltaTime;
            if (_this._currentFireRate <= 0) {
                _this.canFire = true;
                _this._currentFireRate = _this.fireRate;
            }
        }
    });


};

Weapon.prototype = {

    /**
     * Animate the weapon
     */
    animate : function() {
        this.particleSystem.start();//启动微粒系统

        var start = this._initialRotation.clone();
        var end = start.clone();

        end.x += Math.PI/10;//绕x轴转一个小角度

        // Create the Animation object
        var display = new BABYLON.Animation(
            "fire",
            "rotation",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        // Animations keys
        var keys = [{
            frame: 0,
            value: start
        },{
            frame: 10,
            value: end
        },{
            frame: 100,
            value: start
        }];

        // Add these keys to the animation
        display.setKeys(keys);

        // Link the animation to the mesh枪体转动
        this.mesh.animations.push(display);

        // Run the animation !
        var _this = this;
        this.game.scene.beginAnimation(this.mesh, 0, 100, false, 10, function() {
            _this.particleSystem.stop();
        });


    },

    /**
     * Fire the weapon if possible.
     * The mesh is animated and some particles are emitted.
     */
    fire : function(pickInfo) {
        //if (this.canFire) {
            if (pickInfo.hit && pickInfo.pickedMesh.name === "target") {
                pickInfo.pickedMesh.explode();
                count.targets--;
            } else {
                var b = BABYLON.Mesh.CreateBox("box", 0.1, this.game.scene);
                b.position = pickInfo.pickedPoint.clone();
                b.renderingGroupId=2;
            }
            //this.animate();
            this.canFire = false;
        //} else {
            // Nothing to do : cannot fire
        //}
    }
};