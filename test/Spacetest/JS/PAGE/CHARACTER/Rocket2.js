//工质发动机（粒子系统版，低粒子量、低亮度、低闪烁）
Rocket=function()
{

}
Rocket.prototype.init=function(param)
{
    param = param || {};
    this.name=param.name;
    this.ship=param.ship;
    this.node=new BABYLON.TransformNode("node_rocket_"+this.name,scene);
    this.node.position=param.pos;
    this.node.rotation=param.rot;
    this.node.parent=this.ship;
    this.mesh=param.mesh;//也可能只是instance
    this.mesh.parent=this.node;
    this.mass=param.mass;
    this.ship.mass+=this.mass
    this.cost2power=param.cost2power;//供能转换为推力的公式
    this.cost2demage=param.cost2demage;//供能对引擎造成损坏的公式，其中包括对故障率的影响
    this.hp=param.hp;
    this.cost=null;//当前供能
    this.power=null;//当前推力
    this.failurerate=param.failurerate;//故障率参数


    //this.scaling=param.scaling||1;

    this.rotxl=param.rotxl;//引擎在x轴上的摆动范围
    this.rotyl=param.rotyl;
    this.rotzl=param.rotzl;


}
Rocket.prototype.fire=function(param)
{
    this.cost=param.cost;
    this.power=this.cost2power(this.cost);
    this.firebasewidth=param.firebasewidth||1;//火焰底部的宽度
    this.firescaling=param.firescaling||1;//喷射火焰尺寸
    //this.firepos=param.firepos||(new BABYLON.Vector3(0,0,0));
    //this.firerot=param.firerot||(new BABYLON.Vector3(0,0,Math.PI));
    /*var particleSystem = new BABYLON.ParticleSystem("particles", 30 , scene, null, true);
    particleSystem.particleTexture = new BABYLON.Texture("../../ASSETS/TEXTURES/fire/T_SteamSpriteSheet.png", scene, true,
        false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

    particleSystem.startSpriteCellID = 0;
    particleSystem.endSpriteCellID = 31;
    particleSystem.spriteCellHeight = 256;
    particleSystem.spriteCellWidth = 128;
    particleSystem.spriteCellChangeSpeed = 4;

    particleSystem.minScaleX = 1.0;
    particleSystem.minScaleY = 2.0;
    particleSystem.maxScaleX = 1.0;
    particleSystem.maxScaleY = 2.0;

    particleSystem.addSizeGradient(0, 0.0, 0.0);
    particleSystem.addSizeGradient(1.0, 1, 1);

    particleSystem.translationPivot = new BABYLON.Vector2(0, -0.5);

    // Where the particles come from
    var radius = 0.4;
    var angle = Math.PI;
    var coneEmitter = new BABYLON.ConeParticleEmitter(radius, angle);
    coneEmitter.radiusRange = 0;
    coneEmitter.heightRange = 0;

    particleSystem.particleEmitterType = coneEmitter;
    particleSystem.emitter= child;

    // Life time of each particle (random between...
    particleSystem.minLifeTime = 4.0;
    particleSystem.maxLifeTime = 4.0;

    // Color gradient over life
    particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
    particleSystem.addColorGradient(0.5, new BABYLON.Color4(1, 1, 1, 70/255));
    particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));

    // Emission rate
    particleSystem.emitRate = 6 ;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

    // Set the gravity of all particles
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

    // Speed
    particleSystem.minEmitPower = 0;
    particleSystem.maxEmitPower = 0 ;
    particleSystem.updateSpeed = 1/60;

    // Start the particle system
    particleSystem.start();*/

    var particleSystem;
    particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity:50000 }, scene);
    particleSystem.activeParticleCount = 50000;
    particleSystem.emitRate = 10000;
    particleSystem.particleTexture = new BABYLON.Texture("../../ASSETS/IMAGE/TEXTURES/fire/flare.png", scene);
    particleSystem.maxLifeTime = 10;
    particleSystem.minSize = 0.01//*this.firescaling;
    particleSystem.maxSize = 0.1//*this.firescaling;
    particleSystem.emitter = this.node;

    var radius = this.firebasewidth;
    var angle = Math.PI;
    var coneEmitter = new BABYLON.ConeParticleEmitter(radius, angle);
    coneEmitter.radiusRange = 1;
    coneEmitter.heightRange = 0;
    particleSystem.particleEmitterType = coneEmitter;

    particleSystem.renderingGroupId=2;
    particleSystem.start();
    //var force=new BABYLON.Vector3(0,-this.power*100000/this.ship.mass,0);//这个其实是加速度而不是力？？
    var force=new BABYLON.Vector3(0,-1,0);
    force=newland.vecToGlobal(force,this.node);
    force=force.subtract(this.node.getAbsolutePosition()).scale(this.power);
    //this.ship.physicsImpostor.applyForce(force,this.node.position)//这个力没有累加性！！？？
    //this.ship.physicsImpostor.applyImpulse(force,new BABYLON.Vector3(0,0,-3.5))//这个相当于只加速一秒
    //this.ship.physicsImpostor.applyForce(force,new BABYLON.Vector3(0,0,-3.5))//Oimo doesn't support applying force. Using impule instead.
    //var ship=this.ship;
    var rocket=this;
    //this.ship.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,0,1),new BABYLON.Vector3(0,0,-2.5));
    /*MyGame.AddNohurry("task_rocketfire_"+this.name,1000,0,
        function(){
            var force=new BABYLON.Vector3(0,-1,0);
            force=newland.vecToGlobal(force,rocket.node);
            force=force.subtract(rocket.node.getAbsolutePosition()).scale(rocket.power);
            rocket.ship.physicsImpostor.applyForce(force,rocket.node.getAbsolutePosition());
        },0)*/
    scene.registerAfterRender(function(){
        var force=new BABYLON.Vector3(0,-1,0);
        force=newland.vecToGlobal(force,rocket.node);
        force=force.subtract(rocket.node.getAbsolutePosition()).scale(rocket.power);
        rocket.ship.physicsImpostor.applyForce(force,rocket.node.getAbsolutePosition());
    })

    //this.ship.physicsImpostor.applyForce(force,this.node.getAbsolutePosition());
}