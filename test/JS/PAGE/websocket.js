/**
 * Created by lz on 2019/2/28.
 */
var socket;//在React型的单页应用中，这个对象可能是整个页面的全局对象，也可能是从一个类实例化出的实例；
// 在iframe型程序中，每个窗口页都会拥有一个作为全局变量。
function openSocket(ip,userId,passWord) {
    if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    }else {
        console.log("您的浏览器支持WebSocket");
    }
    var socketUrl="ws://ip:2121/im/";
    //socketUrl=socketUrl.replace("https","ws").replace("http","ws");
    console.log(socketUrl)
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function() {
        console.log("websocket已打开");
        var msg={userId:userId,passWord:passWord}
        socket.send("[setUser]" + JSON.stringify(msg));//在后端增加一个用户
    };
    //获得消息事件
    socket.onmessage = function(msg) {
        console.log(msg.data);
        //发现消息进入    开始处理前端触发逻辑
    };
    //关闭事件
    socket.onclose = function() {
        console.log("websocket已关闭");
    };
    //发生了错误事件
    socket.onerror = function() {
        console.log("websocket发生了错误");
    }
}
function sendMessage() {
    if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    }else {
        console.log("您的浏览器支持WebSocket");
        console.log('[{"toUserId":"'+$("#toUserId").val()+'","contentText":"'+$("#contentText").val()+'"}]');
        socket.send('[{"toUserId":"'+$("#toUserId").val()+'","contentText":"'+$("#contentText").val()+'"}]');
    }
}