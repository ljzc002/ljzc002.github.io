precision highp float;
//varying vec4 vColor;
varying vec3 vPosition;
varying vec3 oPosition;
//uniform vec4 uColor;
uniform sampler2D utexturedqk;
uniform float wid_utexturedqk;
uniform float hei_utexturedqk;

uniform sampler2D utexturepalpha;//一个单元里保存了四个元素！！！！
//uniform vec3 uarrdqk[60000];//es3.0之前的glsles不支持隐含数组！！！！
uniform float pbeta;
uniform float wid_utexturepalpha;
uniform float hei_utexturepalpha;
//uniform float uarrpalpha[500];//用来测试的行星只有199层，预设为500层应该够了
uniform float uarrpalphalen;
uniform float max_floorf;
uniform float MathPI;

float getDataVec4(vec4 data,int id) {
    for (int i=0; i<4; i++) {
        if (i == id) return data[i];
    }
}
float getData500(float data[500],int id) {
    int len=int(floor(uarrpalphalen+0.5));
    for (int i=0; i<500; i++) {
        if(i>=len)//i不能和非常量比较！！只好换个方式限制它
        {
            return 0.0;
        }
        if (i == id) return data[i];
    }
}

void main()
{
    //vec4 tempColor=uColor;//es3.0之前不支持round！！！！
    //glsl事实上以float为计算基准
    //int max_floor=int(floor(max_floorf+0.5));
    //算层数
    float r=sqrt(oPosition.x*oPosition.x+oPosition.y*oPosition.y+oPosition.z*oPosition.z);
    float beta=asin(oPosition.y/r);//俯仰角
    //int int_beta=int(floor((beta/(pbeta*2.0))+0.5));//层数
    float count_beta=(beta/(pbeta*2.0));
    //int index_beta=int(floor(count_beta+ max_floorf+0.5));//整数层数索引
    float index_beta=floor(count_beta+ max_floorf+0.5);
    //int roomcount=0;
    //使用数据纹理法，取这一层的区分度
    //int int1=int(floor(mod(index_beta,4.0)+0.5));//使用哪个颜色分量
    //float float1=(index_beta/4.0);//在纹理采样器中的顺序索引
    float floatu=(mod(index_beta,wid_utexturepalpha))/(wid_utexturepalpha)+(0.5/wid_utexturepalpha);//猜测u是x轴
    float floatv=(((index_beta)/(wid_utexturepalpha)))/(hei_utexturepalpha)+(0.5/(wid_utexturepalpha*hei_utexturepalpha));
    vec2 UVpalpha=vec2(floatu,floatv);
    vec4 vec4palphas=texture2D(utexturepalpha, UVpalpha);
    float palpha=(vec4palphas[0]*255.0*100.0+vec4palphas[1]*255.0)/pow(10.0,vec4palphas[2]*255.0);
    //float palpha=getData500(uarrpalpha,int(floor(index_beta+0.5)));//改为尝试数组法传递数据
    //取这一层的转角
    float alpha=atan(oPosition.z,oPosition.x);//标准反正切函数有两个参数！！
    if(alpha<0.0)
    {
        alpha+=(MathPI*2.0);
    }
    //取地区块数据纹理的索引
    float floatu2=(alpha/(palpha*2.0))/wid_utexturedqk;
    float floatv2=index_beta/hei_utexturedqk+0.5/hei_utexturedqk;
    vec2 UVdqk=vec2(floatu2,floatv2);
    gl_FragColor=texture2D(utexturedqk, UVdqk);
    //gl_FragColor=vec4palphas;
    //gl_FragColor=texelFetch(utexturedqk,ivec2(int(floor(alpha/(palpha*2.0)+0.5)),int(floor(index_beta+0.5))),0);//这个整数像素的方法是WebGL2开始加入的！！！！
    //gl_FragColor=vec4(1.0*floatu,1.0*floatv,1.0*floatv2,1.0);//红，绿，蓝结果不是0就是1？？！！

    //int index_dqk=roomcount-1+int(floor((alpha/palpha)+0.5));
    //vec4 tempColor=vec4(uarrdqk[index_dqk],1.0);

    //float float_3=index_beta/(max_floorf*2.0);
    //float float_4=oPosition.y/5.0;
    //canvas的imagedata用255,255,255,1定义颜色通道，而glsl用1.0,1.0,1.0,1.0定义！！！！


}
