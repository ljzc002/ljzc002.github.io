var flag_thinking=false;
var time_now=0;
var time_last=0;

onmessage=function(event)
{
    var data=event.data;
    if(data=="start"&&!flag_thinking)
    {
        flag_thinking=true;
        //console.log("开始思考");
        Think()
    }
    else if(data=="stop"){
        flag_thinking=false;
        close();
    }
}
function Think()
{
    if(flag_thinking)
    {//如果正在思考
        time_now=new Date().getTime();
        if(time_last!=0)
        {
            if(time_now-time_last>1000)//每一秒执行一次
            {
                time_last=time_now;
                //console.log(time_now);
            }
        }
        else{
            time_last=time_now;
        }



        requestAnimationFrame(Think);
    }

}
//work线程中不可以使用window和document
/*var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback, element) {
            window.setTimeout(callback, 1000/60);
       };
})();*/