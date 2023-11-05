import time


def log(*args):
    print(args, flush=True)


def get_now_timestamp():
    return int(time.time())
