import { ElLoading } from 'element-plus'
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
        this.status =  options.ws || null;
        this.pingInterval = null;
        // 心跳检测频率
        this._timeout = 40000;
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
        // 建立连接
        this.ws.onopen = (e) => {
            this.status = 'open';
            console.log("连接成功", e)
            // loading.close()
            if(this.isHeart) {
                // 心跳
                this._heartCheck()
            }
            // 给后台发送数据
            if(data !== undefined) {
                return this.ws.send(JSON.stringify({typeStatus: 'init'}))
            }
        }
        // 接受服务器返回的信息
        this.ws.onmessage = (e) => {
            // loading.close()
            if(typeof this.callback === 'function'){
                return this.callback(e.data)
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
        this.onerror = (e) => {
            console.log('onerror',e)
            this._closeSocket(e)
            // loading.close()
        }
    }
    sendMsg(data) {        
        let msg = JSON.stringify(data)
        if(this.ws){
            return this.ws.send(msg)
        }
        else{
            this.status = 'close'
        }
    }
    _resetHeart() {
        clearInterval(this.pingInterval)
        return this
    }
    _heartCheck() {
        this.pingInterval = setInterval(() => {
            if(this.ws.readyState === 1) {
                this.ws.send(JSON.stringify({heartbeat: true}))
                //this.ws.ping()
            }
        },this._timeout)
    }
    _closeSocket(e) {
        this._resetHeart()
        if(this.status !== 'close') {
            console.log('断开，重连', e)
            if(this.isReconnection){
                // 重连
                this.connect()
            }
        }else{
            console.log('手动关闭了', e)
        }
    }
    close() {
        this.status = 'close'
        this._resetHeart()
        return this.ws.close();
    }
}
