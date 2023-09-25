import { messageCenter } from "./messageCenter.js";


export default class Socket {
    /**
     * @description: 初始化实例属性，保存参数
     * 
     */
    constructor(options) {
        this.url = options.url;
        this.callback = options.received || (() => {});
        this.name = options.name || 'default';
        this.ws = null;
        this.status = null;
        this.pingInterval = null;
        this.webSocketState = null//socket状态 true为已连接
        this.waitingTimer = null; // 超时等待时间器
        this.reconnectTimer = null; //断线重连时间器
        // 心跳检测频率
        this._timeout = 5000;//心跳时间
        this._noTimeout = 10000;//没有心跳了进行下一步的时间 
        this._reconnectTimeout = 2000;//断线重连时间
        this._defaultCheckout = 1; // 心跳检测默认失败重连次数
        this.isHeart = options.isHeart;
        this.isReconnection = options.isReconnection;
    }
    init(){
      this.ws = new WebSocket(this.url);
    }
    connect(data) {
        // const loading = ElLoading.service({
        //     target: document.querySelector('#app'),
        //     lock: true,
        //     text: 'Loading',
        //     background: 'rgba(0, 0, 0, 0.7)',
        // })
        console.log('connect连接',this);
        // 建立连接
        this.ws.onopen = (e) => {
            this.status = 'open';
            this.webSocketState = true;

            console.log("连接成功", e)
            messageCenter.emit("onopen");

            // loading.close()
            if(this.isHeart) {
                // 心跳
                this._heartCheck()
            }
            // 给后台发送数据
            if(data !== undefined) {
                this.ws.send(JSON.stringify({typeStatus: 'init'}))
            }
        }
        // 接受服务器返回的信息
        this.ws.onmessage = (e) => {
            // loading.close()
            let data = null
            if(typeof this.callback === 'function'){
                data = JSON.parse(e.data)
                if(data.type === 10){
                    this.webSocketState = true;
                }
                else{
                    this._resetHeart()
                    if(this.isHeart) {
                        // 心跳
                        this._heartCheck()
                    }
                    return this.callback(e.data)
                }
            }else{
                console.log('参数的类型必须为函数')
            }
        }
        // 关闭连接
        this.ws.onclose = (e) => {
            console.log('onclose',e)
            console.info(e.code + ' ' + e.reason + ' ' + e.wasClean);
            
            this._closeSocket(e)
            // loading.close()
        }
        // 报错
        this.ws.onerror = (e) => {
            console.log('onerror',e)
            this.webSocketState = false;
            this._closeSocket(e)
            // loading.close()
        }
    }
    sendMsg(data) {        
        let msg = JSON.stringify(data)
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return this.ws.send(msg)
        }
    }
    _resetHeart() {
        clearTimeout(this.pingInterval)
        return this
    }
    _heartCheck() {
        this.pingInterval = setTimeout(() => {
            if(this.ws.readyState === 1) {
                this.ws.send(JSON.stringify({heartbeat: true}))
            }
            this.waitingTimer = this.waitingServer();
        },this._timeout)
    }
    waitingServer() {
        this.webSocketState = false;
        return setTimeout(() => {
            if (this.webSocketState) return this._heartCheck();
            console.log("心跳无响应，已断线");
            this.reconnectTimer = this.reconnectWebSocket();

        }, this._noTimeout);
    }
    //心跳重连操作
    reconnectWebSocket() {
        if (!this.isReconnection) return;
        return setTimeout(() => {
            messageCenter.emit("reconnect");
        }, this._reconnectTimeout);
    }
    _closeSocket(e) {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        this._resetHeart()
        if(this.status !== 'close' && e.code !== 1000) {
            console.log('断开，重连', e)
            if(this.isReconnection){

                // 重连
                // setTimeout(() => {
                //     this.connect();
                // }, 1000);
                this.connect()
            }
        }else{
            console.log('手动关闭了', e)
        }
    }
    close() {
        this._resetHeart()
        return this.ws.close(1000);
    }
    clearTimer() {
        clearTimeout(this.reconnectTimer);
        clearTimeout(this.heartTimer);
        clearTimeout(this.waitingTimer);
    }
    // 关闭连接
    clear(isReconnection = false) {
        this.isReconnection = isReconnection;
        this.clearTimer();
        this.close();
    }
}
