/**
 * A player is represented by a box and a free camera.
 * @param scene
 * @param game
 * @param spawnPoint The spawning point of the player
 * @constructor
 */
Player = function(game, spawnPoint) {

    if (!spawnPoint) {
        spawnPoint = new BABYLON.Vector3(0,100,-10);
    }

    // The player spawnPoint
    this.spawnPoint = spawnPoint;
    // The game scene
    this.scene = game.scene;
    // The game
    this.game = game;
    // The player eyes height
    this.height = 2;
    // The player speed
    this.speed = 1;
    // The player inertia
    this.inertia = 0.9;
    // The player angular inertia
    this.angularInertia = 0;
    // The mouse sensibility (lower the better sensible)
    this.angularSensibility = 1000;
    // The player camera
    this.camera = this._initCamera();
    // The player must click on the canvas to activate control
    this.controlEnabled = false;
    // The player weapon
    this.weapon = new Weapon(game, this);
    var _this = this;

    var canvas = this.scene.getEngine().getRenderingCanvas();
    // Event listener on click on the canvas
    canvas.addEventListener("click", function(evt) {
        var width = _this.scene.getEngine().getRenderWidth();
        var height = _this.scene.getEngine().getRenderHeight();

        if (_this.controlEnabled) {
            var pickInfo = _this.scene.pick(width/2, height/2, null, false, _this.camera);//点击信息
            _this.handleUserMouse(evt, pickInfo);//处理点击（射击）
        }
    }, false);

    // Event listener to go pointer lock
    this._initPointerLock();

    // The representation of player in the minimap在小地图上表示玩家的圆锥体
    var s = BABYLON.Mesh.CreateCylinder("mesh_player", 6, 0, 4, 16, 1, this.scene, false, BABYLON.Mesh.DEFAULTSIDE);
    //s.position.y = 10;
    s.position=this.spawnPoint;
    s.rotation.x=Math.PI*0.5;//这个旋转是逆时针的
    s.renderingGroupId=2;
    s.registerBeforeRender(function() {
        s.rotation.y = 0+_this.camera.rotation.y;
        s.rotation.x = 0+_this.camera.rotation.x+Math.PI*0.5;
        s.position.x = _this.camera.position.x;
        s.position.y = _this.camera.position.y;
        s.position.z = _this.camera.position.z;
    });
    this.mmmesh=s;

    var green = new BABYLON.StandardMaterial("green", this.scene);
    green.diffuseColor = BABYLON.Color3.Green();
    green.specularColor = BABYLON.Color3.Black();
    s.material = green;
    s.layerMask = 1;
    s.isPickable=false;

    // Set the active camera for the minimap
    this.scene.activeCameras.push(this.camera);
    //this.scene.activeCamera = this.camera;

    //网络模块！！

};

Player.prototype = {

    _initPointerLock : function() {
        var _this = this;
        // Request pointer lock
        var canvas = this.scene.getEngine().getRenderingCanvas();
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        // Event listener when the pointerlock is updated.
        var pointerlockchange = function (event) {
            _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!_this.controlEnabled) {
                _this.camera.detachControl(canvas);
            } else {
                _this.camera.attachControl(canvas);
            }
        };
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    },

    /**
     * Init the player camera
     * @returns {BABYLON.FreeCamera}
     * @private
     */
    _initCamera : function() {

        var cam = new BABYLON.FreeCamera("camera", this.spawnPoint, this.scene);
        cam.minZ=0.1;
        cam.attachControl(this.scene.getEngine().getRenderingCanvas());
        //此处引入物理引擎！！
        cam.ellipsoid = new BABYLON.Vector3(2, this.height, 2);
        //对相机使用物理引擎会在调整视角时造成意料外的翻滚！！所以还是要把视角和物体分开！！
        //cam.physicsImpostor=new BABYLON.PhysicsImpostor(cam, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 70, restitution: 0.2 ,friction:0.5}, this.scene);

        cam.checkCollisions = true;
        cam.applyGravity = true;
        // 只使用相机运动，控制力稍显不足，需要额外的控制
        cam.keysUp = [87]; // W
        cam.keysDown = [83]; // S
        cam.keysLeft = [65]; // A
        cam.keysRight = [68]; // D
        cam.speed = this.speed;
        cam.inertia = this.inertia;
        cam.angularInertia = this.angularInertia;
        cam.angularSensibility = this.angularSensibility;
        cam.layerMask = 2;
        cam._updatePosition();
        return cam;
    },

    /**
     * Handle the user input on keyboard
     * @param keycode
     */
    handleUserKeyboard : function(keycode) {
        switch (keycode) {

        }
    },

    /**
     * Handle the user input on mouse.
     * click = shoot
     * @param evt
     * @param pickInfo The pick data retrieved when the click has been done
     */
    handleUserMouse : function(evt, pickInfo) {
        this.weapon.fire(pickInfo);
    }

};
