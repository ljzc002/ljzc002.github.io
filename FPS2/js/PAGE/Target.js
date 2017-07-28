Target = function(game, posX, posZ) {

    BABYLON.Mesh.call(this, "target", game.scene);//先建立一个空的mesh用来继承，再设置顶点数据！！
    var vd = BABYLON.VertexData.CreateSphere({segments:16,diameter:5});
    vd.applyToMesh(this, false);
    this.renderingGroupId=2;
    // The game
    this.game = game;

    // Target position
    this.position = new BABYLON.Vector3(posX, 4, posZ);

    // Check collisions
    //this.checkCollisions = true;
    this.physicsImpostor=new BABYLON.PhysicsImpostor(this
        , BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.1 ,friction:1.5}, scene);

    var _this = this;
    this.game.scene.registerBeforeRender(function() {
        //_this.rotation.y += 0.01;
    });
};

// Our object is a BABYLON.Mesh我们的对象是一个BABYLON.Mesh
Target.prototype = Object.create(BABYLON.Mesh.prototype);
// And its constructor is the Ship function described above.它的构造函数是上面定义的那个
Target.prototype.constructor = Target;

Target.prototype.explode = function() {
    this.dispose();
};