// counter.js
import { defineStore } from 'pinia';
import { storage } from '@/utils/index.ts';
import { useStorage } from '@vueuse/core'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    index: 0 as any,
  }),
  actions: {
    init(){
      const index = useStorage('index', 0);
      this.index = index;
    },
    add() {
      let index = this.index + 1;
      storage.setItem('index', index);
      this.index = index;
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
    userInfo: window.localStorage.getItem('userInfo') || {} as any,
    newUserId: window.localStorage.getItem('newUserId') as any,
  }),
  actions: {
    login() {
      this.isLogin = true;
    }
  }
})