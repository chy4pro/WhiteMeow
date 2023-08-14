import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index.vue';
import chat from '@/views/chat/index.vue';
import feedbackSuccess from '@/views/feedbackSuccess/index.vue';
import register from '@/views/register/index.vue';
import setPassword from '@/views/setPassword/index.vue';
import setProfile from '@/views/setProfile/index.vue';
import login from '@/views/login/index.vue';
import protocol from '@/views/protocol/index.vue';
import privacy from '@/views/privacy/index.vue';
import profileCenter from '@/views/profileCenter/index.vue';
import { useLoginStore } from "@/store";
// import intro from '@/views/intro/index.vue';
// import smartForm from '../components/SmartForm/index.vue';
import requireAuth from './routerGuard'; // 导入路由守卫

export const routes: Array<RouteRecordRaw>  = [
  { 
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat
  },
  {
    path: '/profileCenter',
    name: 'profileCenter',
    component: profileCenter,
    beforeEnter: (to, from, next) => {
      const loginStore = useLoginStore();

      const token = loginStore.token

      if(token){
        next()
      }
      else{
        next('/register')
      }
    },
    children: 
    [
      {
        path: "editProfile",
        name: "editProfile",
        component: () => import('@/views/profileCenter/editProfile.vue'),
        props: true,
        meta: { title: "个人信息" },
      },
      {
        path: "editPassword",
        name: "editPassword",
        component: () => import('@/views/profileCenter/editPassword.vue'),
        props: true,
        meta: { title: "修改密码" },
      },
      {
        path: "feedBack",
        name: "feedBack",
        component: () => import('@/views/profileCenter/feedBack.vue'),
        props: true,
        meta: { title: "帮助与反馈" },
      }
    ],
    redirect: '/profileCenter/editProfile',
  },
  {
    path: '/feedbackSuccess',
    name: 'feedbackSuccess',
    component: feedbackSuccess
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    //beforeEnter: requireAuth, // 使用路由守卫
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
    component: login,
    beforeEnter: requireAuth, // 使用路由守卫
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
  },
  {
    path: '/set',
    name: 'set',
    component: () => import('@/views/register/set.vue'),
    beforeEnter: (to, from, next) => {
      const token = window.localStorage.getItem('token');

      if(to.path === '/set') {
        if(token){
          return next('/chat')
        }
        next()
      }
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/register/profile.vue'),
    beforeEnter: (to, from, next) => {
      const token = window.localStorage.getItem('token');

      if(to.path === '/profile') {
        if(token){
          return next('/chat')
        }
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
  routes
})


export default router