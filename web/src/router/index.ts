import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index.vue';
import chat from '@/views/chat/index.vue';
import thanks from '@/views/thanks/index.vue';
import feedBack from '@/views/feedBack/index.vue';
import intro from '@/views/intro/index.vue';
// import smartForm from '../components/SmartForm/index.vue';

export const routes: Array<RouteRecordRaw>  = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat
  },
  {
    path: '/feedBack',
    name: 'feedBack',
    component: feedBack
  },
  {
    path: '/thanks',
    name: 'thanks',
    component: thanks
  },
  {
    path: '/intro',
    name: 'intro',
    component: intro
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
  routes
})


export default router