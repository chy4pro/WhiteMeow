// counter.js
import { defineStore } from 'pinia';
import { checkIsNaN } from '../utils/util';
import { useStorage } from '@vueuse/core'
import Socket from "../utils/http/websocket.js";

export const useCounterStore = defineStore('counter', {
  state: () => ({
    index: useStorage('index', 0),
  }),
  actions: {
    init(){
      const index = this.index;
      if(checkIsNaN(index as any)){
        this.index = 0;
      }
    },
    add() {
      let index:any = this.index;
      
      if(checkIsNaN(index as any)){
        this.index = 0;
      }
      else{
        let addIndex = index + 1;
        this.index = addIndex;
      }

    },
  },
});

export const userMessage = defineStore('message', {
  state: () => ({
    firstMessage: ''
  })
});

//login
export const useLoginStore = defineStore('login', {
  state: () => ({
    isLogin: window.localStorage.getItem('token') ? true : false as any,
    token: window.localStorage.getItem('token') || '' as any,
    userInfo: JSON.parse(window.localStorage.getItem('userInfo') as any),
    userId: window.localStorage.getItem('userId') as any,
    newUserId: window.localStorage.getItem('newUserId') as any,
  }),
  actions: {
    login() {
      this.isLogin = true;
    },
    init(){
      let result = JSON.parse(window.localStorage.getItem('userInfo') as any);
      this.userInfo = useStorage('userInfo', result);
    }
  }
})

export const useChatStore = defineStore('chat', {
  state: () => ({
    enterStartDate: window.localStorage.getItem('enterStartDate') as any,//用户上次进来的时间
    showLoginModal: false,
    currentTipText: '',
    showOnlyOne: false,

    isKeypress: false
  }),
  actions: {
    initEnterStartDate(){
      let result = new Date();
      this.enterStartDate = useStorage('enterStartDate', result.getTime());
    },

    handleSetKeypress(bool: boolean) {
      this.isKeypress = bool
    }
  }
});

interface MyWebSocket{
  sendMsg: ((data: any) => void)
}

export const useSocketStore = defineStore('socket', {
  state: () => ({
    ws: null as any | null,
    receivedCallBack: null as any | null
  }),

  actions: {
    initWebSocket(realUserId:string, userName:string) {
      // this.receivedCallBack = received // 赋值

      // scoket连接

      return (receivedCallback:any) => {
        this.ws = new Socket({
          url: `${import.meta.env.VITE_API_WEBSOCKET_URL}/chatroom/socket?user=${realUserId}&name=${userName}`,
          status: 'open',
          name: '',			// name
          isHeart:true,			// 是否心跳
          isReconnection:true,		// 是否断开重连
          received: receivedCallback
        });
        this.ws.received = receivedCallback
        this.ws.init()
      }
    },
    webSocketConnect(){
      this.ws.connect();
    },
    replaceCallBack(received:any){
      this.ws.received = received
    }
  }
})