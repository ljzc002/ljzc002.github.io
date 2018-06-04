uniform mat4 worldViewProjection;
uniform mat4 worldView;
//uniform mat4 pMatrix;
attribute vec3 position;
//attribute vec4 aColor;

varying vec3 vPosition;
varying vec3 oPosition;//自身坐标系里的位置

void main(){
    //mat4 uMVPMatrix=(pMatrix*cMatrix)*mvMatrix;
    gl_Position=worldViewProjection*vec4(position,1);
    //vColor=aColor;
    vPosition=vec3(worldView*vec4(position,1));
    oPosition=position;
}