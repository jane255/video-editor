from flask_socketio import Namespace
from flask_socketio import emit

from utils import log


class ChatRoomNamespace(Namespace):

    @staticmethod
    def on_connect():
        log('客户端连接')

    @staticmethod
    def on_event(data):
        log(f'on_event 客户端接收到消息:[{data}]')

    @staticmethod
    def on_disconnect():
        log('客户端断开连接', )

    @staticmethod
    def on_send_message(data):
        import subprocess
        from config import project_dir

        log(f'on_send_message 客户端接收到消息:[{data}]')
        start = data.get("start")
        end = data.get('end')
        video = f'{project_dir}/static/resources/pretty.mp4'
        output = f'{project_dir}/static/resources/output.mp4'
        command = f'ffmpeg -ss {start} -to {end} -i {video} -c:v copy -c:a copy -y {output}'
        result = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print('result', result.stdout.read(), result.stderr.read())
        d = dict(
            output=output.split(str(project_dir))[-1],
        )
        # 发送消息到前端，前端使用 socket.on('receive_message', function(data){}) 来接收消息
        emit('receive_message', d)


# 注册一个命名空间
chat_room_namespace = ChatRoomNamespace('/chat')
