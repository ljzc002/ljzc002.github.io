/**
 * Created by lz on 2018/8/13.
 */
function InitMyMaterial()
{
     //火焰
    var fireMaterial = new BABYLON.FireMaterial("fire", scene);
    fireMaterial.diffuseTexture = new BABYLON.Texture("../ASSETS/IMAGE/fire/diffuse2.png", scene);
    fireMaterial.distortionTexture = new BABYLON.Texture("../ASSETS/IMAGE/fire/distortion.png", scene);
    fireMaterial.opacityTexture = new BABYLON.Texture("../ASSETS/IMAGE/fire/opacity3.png", scene);
    fireMaterial.opacityTexture.level = 0.5;
    fireMaterial.speed = 5.0;
    fireMaterial.backFaceCulling=false;
    fireMaterial.twoSidedLighting=true;
    mat_fire=fireMaterial;

    // Water material
    var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
    waterMaterial.bumpTexture = new BABYLON.Texture("../ASSETS/IMAGE/fire/waterbump.png", scene);
    waterMaterial.windForce = -10;
    waterMaterial.waveHeight = 0.5;
    waterMaterial.bumpHeight = 0.1;
    waterMaterial.waveLength = 0.1;
    waterMaterial.waveSpeed = 50.0;
    waterMaterial.colorBlendFactor = 0;
    waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
    waterMaterial.colorBlendFactor = 0;
    waterMaterial.backFaceCulling=false;
    waterMaterial.twoSidedLighting=true;
    mat_water=waterMaterial;

    //毛绒，需要根据具体的网格生成
    /*mat_fur=new BABYLON.FurMaterial("mat_fur", scene);
    mat_fur.furLength = 0;
    mat_fur.furAngle = 0;
    mat_fur.furColor = new BABYLON.Color3(2, 2, 2);
    mat_fur.diffuseTexture = mesh.material.diffuseTexture;
    mat_fur.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", scene);
    mat_fur.furSpacing = 0.1;
    mat_fur.furDensity = 20;
    mat_fur.furSpeed = 300;
    mat_fur.furGravity = new BABYLON.Vector3(0, -1, 0);*/
}