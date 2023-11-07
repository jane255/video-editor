class Video {
    static video = e(`#video`)
    static videoControls = e(`#video-controls`)
    static editStart = ''
    static editEnd = ''

    static init() {
        // Hide the default controls
        this.video.controls = false
        // Display the user defined video controls
        this.videoControls.style.display = "block"
    }

    static instance(...args) {
        this.i = this.i || new this(...args)
        return this.i
    }

    static bindEventPlay() {
        let video = this.video
        let element = `#playpause`
        bindEvent(element, "click", function (event) {
            if (video.paused || video.ended) {
                video.play()
            } else {
                video.pause()
            }
        })
    }

    static bindEventStop() {
        let video = this.video
        let element = `#stop`
        let progress = e(`#progress`)
        bindEvent(element, "click", function (event) {
            video.pause()
            video.currentTime = 0
            progress.value = 0
        })
    }

    static bindEventTimeUpdate() {
        let video = this.video
        let progress = e(`#progress`)
        let progressBar = e(`#progress-bar`)
        video.addEventListener("timeupdate", () => {
        if (!progress.getAttribute("max"))
            progress.setAttribute("max", video.duration);
            progress.value = video.currentTime;
            progressBar.style.width = `${Math.floor(
                (video.currentTime * 100) / video.duration,
            )}%`
        })
    }

    static bindEventMute() {
        let video = this.video
        let element = `#mute`
        bindEvent(element, "click", function (event) {
            video.muted = !video.muted
        })
    }

    static bindEventVolinc() {
        let element = `#volinc`
        let self = this
        bindEvent(element, "click", function (event) {
            self.alterVolume("+")
        })
    }

    static bindEventVoldec() {
        let element = `#voldec`
        let self = this
        bindEvent(element, "click", function (event) {
            self.alterVolume("-")
        })
    }

    static alterVolume(dir) {
        let video = this.video
        const currentVolume = Math.floor(video.volume * 10) / 10;
        if (dir === "+" && currentVolume < 1) {
            video.volume += 0.2
        } else if (dir === "-" && currentVolume > 0) {
            video.volume -= 0.2
        }
    }

    static bindEventSkipAhead() {
        let element= `#progress`
        let video = this.video
        let progress = e(`#progress`)
        bindEvent(element, "click", function (event) {
            const rect = progress.getBoundingClientRect();
            const pos = (event.pageX - rect.left) / progress.offsetWidth
            video.currentTime = pos * video.duration
        })
    }

    static bindEventFullscreen() {
        let element= `#fs`
        let self = this
        bindEvent(element, "click", function (event) {
            self.handleFullscreen()
        })
    }

    static handleFullscreen() {
        if (document.fullscreenElement !== null) {
            // The document is in fullscreen mode
            document.exitFullscreen()
            this.setFullscreenData(false)
        } else {
            // The document is not in fullscreen mode
            let videoContainer = e(`#videoContainer`)
            videoContainer.requestFullscreen();
            this.setFullscreenData(true)
        }
    }

    static setFullscreenData(state) {
        let videoContainer = e(`#videoContainer`)
        videoContainer.setAttribute("data-fullscreen", !!state)
    }

    static bindEventFullscreenchange() {
        let self = this
        document.addEventListener("fullscreenchange", (e) => {
            self.setFullscreenData(!!document.fullscreenElement)
        })
    }

    static bindEventEditStart() {
        let element= `#edit-start`
        let video = this.video
        let self = this
        bindEvent(element, "click", function (event) {
            let s = parseInt(video.currentTime)
            self.editStart = formatSeconds(s)
            log("设置开始点", self.editStart)
            let ele = e(element)
            ele.innerText = `设置开始点 -- ${self.editStart}`
        })
    }

    static bindEventEditEnd() {
        let element= `#edit-end`
        let video = this.video
        let self = this
        bindEvent(element, "click", function (event) {
            let s = parseInt(video.currentTime)
            self.editEnd = formatSeconds(s)
            log("设置结束点", self.editEnd)
            let ele = e(element)
            ele.innerText = `设置结束点 -- ${self.editEnd}`
        })
    }

    static bindEventEdit() {
        let element= `#edit`
        let self = this
        bindEvent(element, "click", function (event) {
            log("裁剪")
            if (self.editStart.length > 0 && self.editEnd.length > 0) {
                let form = {
                    "start": self.editStart,
                    "end": self.editEnd,
                }
                SocketIO.send("send_message", form)
                //
                self.editStart = 0
                self.editEnd = 0
            }
        })
    }

    static playEditVideo(path) {
        // 因为原视频还在播放，先暂停
        this.video.pause()

        // 创建一个 video 元素
        let video = document.createElement('video')

        // 设置视频的属性
        video.src = path // 替换为你的视频路径
        video.controls = true // 显示视频控制栏

        // 将视频添加到页面中
        let videoContainer = document.createElement('div')
        videoContainer.id = 'video-container'
        videoContainer.appendChild(video)

        // 创建关闭按钮
        let closeButton = document.createElement('button')
        closeButton.className = 'close-button'
        closeButton.innerHTML = '关闭'
        closeButton.addEventListener('click', function() {
            // 暂停视频
            video.pause()
            // 移除视频元素和黑屏容器
            document.body.removeChild(videoContainer)
        })

        videoContainer.appendChild(closeButton)
        document.body.appendChild(videoContainer)

        // 播放视频
        video.play()

        // 监听视频播放结束事件
        video.addEventListener('ended', function() {
            // 暂停视频
            video.pause();
        })
    }

    static bindEvent() {
        // 视频时长更新
        this.bindEventTimeUpdate()
        // 播放
        this.bindEventPlay()
        // 停止并重置
        this.bindEventStop()
        // 静音
        this.bindEventMute()
        // 音量+
        this.bindEventVolinc()
        // 音量-
        this.bindEventVoldec()
        // 视频时长拖动
        this.bindEventSkipAhead()
        // 全屏
        this.bindEventFullscreen()
        this.bindEventFullscreenchange()
        // 设置开始点
        this.bindEventEditStart()
        // 设置结束点
        this.bindEventEditEnd()
        // 设置结束点
        this.bindEventEdit()
    }
}
