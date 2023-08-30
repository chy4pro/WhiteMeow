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
import { useLoginStore, useChatStore } from "@/store";
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
    component: chat,
    children: 
    [
      {
        path: "freeChat",
        name: "freeChat",
        component: () => import('@/views/chat/freeChat/index.vue'),
        props: true,
        meta: { title: "聊愈喵" },
      },
      {
        path: "testChat",
        name: "testChat",
        component: () => import('@/views/chat/testChat/index.vue'),
        props: true,
        meta: { title: "测试喵" },
        redirect: '/chat/testChat/dailyHome',
        beforeEnter: (to, from, next) => {
          const loginStore = useLoginStore();
          const chatStore = useChatStore()
          const token = loginStore.token
    
          if(token){
            next()
          }
          else{
            chatStore.showLoginModal = true
            next('/chat/freeChat')
          }
        },
        children: [
          {
            path: "dailyHome",
            name: "dailyHome",
            component: () => import('@/views/chat/testChat/dailyHome/index.vue'),
            props: true,
            meta: { title: "今日运势" },
          },
          {
            path: "tarot",
            name: "tarot",
            component: () => import('@/views/chat/testChat/tarot/index.vue'),
            props: true,
            meta: { title: "塔罗牌" },
          },
          {
            path: "interpretationDream",
            name: "interpretationDream",
            component: () => import('@/views/chat/testChat/interpretationDream/index.vue'),
            props: true,
            meta: { title: "ai解梦" },
          },
          {
            path: "sandPlay",
            name: "sandPlay",
            component: () => import('@/views/chat/testChat/sandPlay/index.vue'),
            props: true,
            meta: { title: "心理沙盘" },
          }
        ]
      },
      // {
      //   path: "game",
      //   name: "game",
      //   component: () => import('@/views/chat/game/index.vue'),
      //   props: true,
      //   meta: { title: "冒险喵" },
      //   beforeEnter: (to, from, next) => {
      //     const loginStore = useLoginStore();
      //     const chatStore = useChatStore()
      //     const token = loginStore.token
          
      //     if(token){
      //       next()
      //     }
      //     else{
      //       chatStore.showLoginModal = true
      //       next('/chat/freeChat')
      //     }
      //   },
      //   children: [
      //     {
      //       path: "textAdventure",
      //       name: "textAdventure",
      //       component: () => import('@/views/chat/game/textAdventure/index.vue'),
      //       props: true,
      //       meta: { title: "文字冒险游戏" },
      //     },
      //   ],
      //   redirect: '/chat/game/textAdventure',
      // },
      {
        path: "myCat",
        name: "myCat",
        component: () => import('@/views/chat/myCat/index.vue'),
        props: true,
        meta: { title: "我的喵" },
        beforeEnter: (to, from, next) => {
          const loginStore = useLoginStore();
          const chatStore = useChatStore()
          const token = loginStore.token
          
          if(token){
            next()
          }
          else{
            chatStore.showLoginModal = true
            next('/chat/freeChat')
          }
        },
      },
    ],
    redirect: '/chat/freeChat',
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