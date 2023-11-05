import config

from flask import Flask


def configured_app():
    a = Flask(__name__, template_folder=config.templates_dir, static_folder=config.static_dir)
    a.config['SECRET_KEY'] = 'secret_key'

    return a


app = configured_app()
# 这个文件都是套路写法
