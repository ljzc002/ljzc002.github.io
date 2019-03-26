/**
 * Created by lz on 2019/1/8.
 */
$(function() {//允许你绑定一个在DOM（不包含图片）文档载入完成后执行的函数。
// 这个函数的作用如同$(document).ready()一样
    var str_hash=window.location.hash.substr(1);//这些信息在open时默认传来传去？
    var arr_p=str_hash.split("@");
    serverip=arr_p[0];
    httpport=arr_p[1];
    wsport=arr_p[2];
    userid=arr_p[3];
    UrlHead="http://"+serverip+":"+httpport;
    WsHead="ws://"+serverip+":"+wsport;//后面没有撇
    token=localStorage.getItem(userid);

    var FADE_TIME = 150; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize variables
    var $window = $(window);
    var $usernameInput = $('.usernameInput'); // 昵称
    var $messages = $('.messages'); // 消息区域
    var $inputMessage = $('.inputMessage'); // 消息框
    var $loginPage = $('.login.page'); // 登录页
    var $chatPage = $('.chat.page'); // 聊天室页

    // WebSocket
    var ws = new WebSocket(WsHead);

    // Prompt for setting a username
    var username;
    var connected = false; // 连接状态
    var $currentInput = $usernameInput.focus();

    // 设置用户id，并通过这个过程关联上map中的用户
    function setUsername () {
        username = cleanInput($usernameInput.val().trim());
        username=userid;//输入的值其实是没有用的
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            // 发一个进入房间的消息给服务器
            var msg = {};
            msg.t = 1;
            msg.n = username;
            // 通常情况下，房间标识在服务端处理，想测试可以直接使用 url 中的参数输入或者在页面上参数输入
            //msg.room_id = 1;
            ws.send(JSON.stringify(msg));
        }
    }

    // 输出日志信息
    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // 输出聊天信息
    function addChatMessage (data, options) {
        options = options || {};
        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    // DOM 操作
    function addMessageElement (el, options) {
        var $el = $(el);

        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // 清除输入框中注入的信息
    function cleanInput (input) {
        return $('<div/>').text(input).html();
    }

    // 通过 hash 函数给用户名上色
    function getUsernameColor (username) {

        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // 计算颜色下标
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events

    $window.keydown(function (event) {
        // 回车后依旧获取焦点
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // 监听回车键
        if (event.which === 13) {
            if (username) {
                sendMessage();

            } else {
                setUsername();
            }
        }
    });

    // 获取焦点
    $loginPage.click(function () {
        $currentInput.focus();
    });

    // 建立连接的时候更新连接状态
    ws.onopen = function (e) {
        console.log('Connection to server opened');
        connected = true;
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
        }
    }

    ws.onclose = function(e) {
        // 可以在 onclose 和 onerror 中处理重连的逻辑，再决定是否将状态更新为未连接状态
        connected = false;
    }

    ws.onerror = function(e) {
        connected = false;
    }
    // 发送消息
    function sendMessage() {
        if(connected) {
            var msg = {};
            msg.t = 2;
            msg.n = username;
            msg.body = cleanInput($inputMessage.val());
            ws.send(JSON.stringify(msg));
            addChatMessage({username:username,message:msg.body});
            $inputMessage.val("");
        }else {
            log("与服务器断开连接了，刷新重新连接~");
        }

    }

});