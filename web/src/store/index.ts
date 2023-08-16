// counter.js
import { defineStore } from 'pinia';
import { storage, checkIsNaN } from '@/utils/index.ts';
import { useStorage } from '@vueuse/core'

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
    showLoginModal: false,
  })
});