// routerGuard.ts

import { NavigationGuard } from 'vue-router';
import { storage } from '@/utils/index.ts'

const requireAuth: NavigationGuard = (to, from, next) => {
  // 从 localStorage 获取 token
  const token = storage.getItem('token');

  if(to.path === '/register') {
    // 登录过了，可以直接跳转
    if(token){
      next('/chat')
    }
  }
  // else{
  //   // 假设 token 有效的判断条件为：token 不为空
  //   if (token) {
  //     // 有 token，允许访问 chat 页面
  //     next();
  //   } else {
  //     // 没有 token，重定向到登录页面或其他未登录页面
  //     next('/login'); // 替换成您的登录页面路由
  //   }
  // }
};

export default requireAuth;
