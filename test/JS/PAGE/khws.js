/**
 * Created by lz on 2019/3/12.
 */
function initWs(callback)
{
    var FADE_TIME = 150; // ms
    MyGame.ws= new WebSocket(WsHead);
    var ws=MyGame.ws;
    //var username=MyGame.WhoAmI;
    // 建立连接的时候更新连接状态
    ws.onopen = function (e) {
        console.log('Connection to server opened');
        MyGame.wsConnected = true;
        getUserState();
        callback();//连接建立成功，则进行接下来的初始化
    }

    // 处理服务器发送过来的消息
    ws.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        console.log(msg);
        switch(msg.t) {
            case 0:
                // 建立连接的响应
                break;
            case -1:
                // 收到进入房间的响应 包含房间信息
                log("欢迎 " + username + " 进入聊天室");
                break;
            case -2:
                // 收到其他人发过来的消息
                var data = {
                    username: msg.n,
                    message: msg.body
                };
                addChatMessage(data);
                break;
            case -10001:
                // 收到其他人进入房间的消息
                log(msg.n + " 进入了聊天室");
                break;
            case -11000:
                // 收到其他人离开房间的信息
                log("用户 " + msg.n + " 离开了聊天室")
                break;
            case -10:
            {
                var body=msg.body;
                var func=body.func;
                switch(func)
                {
                    case "initUserBack":
                    {
                        MyGame.arr_allplayers=body.arr_allplayers;//所有的其他用户-》改用arr_webplayers？
                        MyGame.arr_units=body.arr_units;//所有的单位
                        //在用户的场景中初始化

                        break;
                    }
                        default :
                        {
                            break;
                        }
                }
                break;
            }
                default :
                {
                    console.log("收到不能理解的消息类型");
                    break;
                }
        }
    }

    ws.onclose = function(e) {
        // 可以在 onclose 和 onerror 中处理重连的逻辑，再决定是否将状态更新为未连接状态
        MyGame.wsConnected = false;
    }

    ws.onerror = function(e) {
        MyGame.wsConnected = false;
    }
}
function getUserState () {
        //与服务器建立一个ws会话后，用token从服务器获取到用户配置，认为通过了Index后就不需要用户身份验证了
        var msg = {};
        msg.t = 10;//专用于kingofthehill的t，具体方法类型写在body里//wsType.getUserState;
        var body={
            token:MyGame.wsToken,
            func:initUser,//要获取世界状态和手牌状态
        };
        msg.body = JSON.stringify(body);
        MyGame.ws.send(JSON.stringify(msg));

}
//由服务端负责派发成功的操作日志给每个用户，写在dom里还是3dgui里？->写在控制台里？
function logWs(message, options)
{
    console.log(message);
}

// 发送消息
function sendMessage() {
    if(connected) {
        var msg = {};
        msg.t = 2;
        msg.n = username;
        msg.body = cleanInput($inputMessage.val());
        MyGame.ws.send(JSON.stringify(msg));
    }else {
        logWs("与服务器断开连接了，刷新重新连接~");
    }

}