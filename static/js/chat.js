class SocketIO {
    constructor() {
        log('socketio init --------------------------')
        // 这里的 /chat 就是我们在 server_socket.py 中定义的 namespace
        let socket = io('http://localhost:18080/chat')

        socket.on('connect', function() {
            // 连接成功后 向服务端发送 my event 事件
            socket.emit('event', {data: "hello"})
            log("connect", socket.id)
        })
        return socket
    }

    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }

    static bindMessageEvent() {
        let socket = this.instance()
        // 接收服务端发送的 receive_message 事件
        // 并且调用 MsgContainer.addMsg 来添加消息
        socket.on('receive_message', function (resp) {
            log("receive_message", resp)
            let output = resp.output
            alert("裁剪成功")
            //
            Video.playEditVideo(output)
        })
    }

    static send(event, form) {
        // event 是事件名字
        // 响应的函数是 ChatRoomNamespace.on_{event}
        // 在我们的使用场景中，event 就是 send_message
        let socket = this.instance()
        socket.emit(event, form)
    }

    static bindEvent() {
        this.bindMessageEvent()
    }
}
