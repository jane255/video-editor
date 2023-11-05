from flask_socketio import Namespace
from flask_socketio import emit

from utils import log


class ChatRoomNamespace(Namespace):

    @staticmethod
    def on_connect():
        log('客户端连接')

    @staticmethod
    def on_join_room():
        pass

    @staticmethod
    def on_disconnect():
        log('客户端断开连接', )

    @staticmethod
    def on_send_message(data):
        # 这里可以使用 session 来获取当前用户的信息
        log(f'客户端接收到消息:[{data}]')

        d = dict(
        )
        # 发送消息到前端，前端使用 socket.on('receive_message', function(data){}) 来接收消息
        emit('receive_message', d, room="")


# 注册一个命名空间
chat_room_namespace = ChatRoomNamespace('/video')
