function InitMouse()
{
    canvas.addEventListener("blur",function(evt){//监听失去焦点
        releaseKeyState();
    })
    canvas.addEventListener("focus",function(evt){//改为监听获得焦点，因为调试失去焦点时事件的先后顺序不好说
        releaseKeyState();
    })

}
//注意考虑到手机平台，在正式使用时以没有键盘为考虑
function onKeyDown(event)
{
    var key=event.key
    MyGame.obj_keystate[key]=1;
}
function onKeyUp(event)
{
    var key=event.key
    MyGame.obj_keystate[key]=0;
}
function releaseKeyState()
{
    for(key in MyGame.obj_keystate)
    {
        MyGame.obj_keystate[key]=0;
    }
}