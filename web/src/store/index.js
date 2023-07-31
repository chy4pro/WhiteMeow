// counter.js
import { defineStore } from 'pinia';
import { storage } from '@/utils/index.ts';
export const useCounterStore = defineStore('counter', {
  state: () => ({
    index: 0 | storage.getItem('index'),
  }),
  actions: {
    add() {
      this.index += 1;
      storage.setItem('index', this.index);
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
    isLogin: storage.getItem('token') ? true : false,
    token: storage.getItem('token') || '',
    userInfo: storage.getItem('userInfo') || {},
    newUserId: storage.getItem('newUserId')
  }),
  actions: {
    login() {
      this.isLogin = true;
    }
  }
})