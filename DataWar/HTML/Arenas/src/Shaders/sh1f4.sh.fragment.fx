precision mediump float;
//varying vec4 vColor;
varying vec3 vPosition;
uniform vec4 uColor;
void main()
{
    vec4 tempColor=uColor;
    //对2取模
    if(mod((vPosition.x+vPosition.y+vPosition.z),2.0)>1.0)
    {
        tempColor+=vec4(0.0,-0.4,0.0,0.0);
    }
    gl_FragColor=tempColor;
    //gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}