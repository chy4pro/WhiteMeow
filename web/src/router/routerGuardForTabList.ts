// routerGuard.ts

import { NavigationGuard } from 'vue-router';
import { useLoginStore, useChatStore } from "@/store";
import { tablistMap, loginTablistMap } from '@/views/chat/tablistMap'

const tabListAuth: NavigationGuard = (to, from, next) => {
  const loginStore = useLoginStore();
  const chatStore = useChatStore()
  const token = loginStore.token

  if(token){
    loginTablistMap.forEach((item:any) =>{
      if(to.path.indexOf(item.path)!=-1){
        if(item.status != 'disable'){
          next()
        }
        else{
          chatStore.showLoginModal = true
          next('/chat/freeChat')
        }
      }
    })
  }
  else{
    chatStore.showLoginModal = true
    next('/chat/freeChat')
  }
};

export default tabListAuth;
