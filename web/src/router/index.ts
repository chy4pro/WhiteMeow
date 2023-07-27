import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index.vue';
import chat from '@/views/chat/index.vue';
import feedbackSuccess from '@/views/feedbackSuccess/index.vue';
import feedBack from '@/views/feedBack/index.vue';
import register from '@/views/register/index.vue';
import setPassword from '@/views/setPassword/index.vue';
import setProfile from '@/views/setProfile/index.vue';
import login from '@/views/login/index.vue';
import protocol from '@/views/protocol/index.vue';
import privacy from '@/views/privacy/index.vue';
// import intro from '@/views/intro/index.vue';
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
    path: '/feedbackSuccess',
    name: 'feedbackSuccess',
    component: feedbackSuccess
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/setPassword',
    name: 'setPassword',
    component: setPassword
  },
  {
    path: '/setProfile',
    name: 'setProfile',
    component: setProfile
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/protocol',
    name: 'protocol',
    component: protocol
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: privacy
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
  routes
})


export default router