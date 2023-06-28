import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index.vue';
import chat from '@/views/chat/index.vue';
import feedbackSuccess from '@/views/feedbackSuccess/index.vue';
import feedBack from '@/views/feedBack/index.vue';
import intro from '@/views/intro/index.vue';
// import smartForm from '../components/SmartForm/index.vue';

export const routes: Array<RouteRecordRaw>  = [
  {
    path: '/',
    name: 'home',
    component: ()=> defineAsyncComponent(()=>import('@/views/home/index.vue'))
  },
  {
    path: '/chat',
    name: 'chat',
    component: ()=> defineAsyncComponent(()=>import('@/views/chat/index.vue'))
  },
  {
    path: '/feedBack',
    name: 'feedBack',
    component: ()=> defineAsyncComponent(()=>import('@/views/feedBack/index.vue'))
  },
  {
    path: '/feedbackSuccess',
    name: 'feedbackSuccess',
    component: ()=> defineAsyncComponent(()=>import('@/views/feedbackSuccess/index.vue'))
  },
  {
    path: '/intro',
    name: 'intro',
    component: ()=> defineAsyncComponent(()=>import('@/views/intro/index.vue'))
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
  routes
})


export default router