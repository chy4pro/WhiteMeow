<template>

      <!-- <div class="arrow-left" @click="router.go(-1)"></div> -->
  <div class="wh-full">
    <div class="chat-panel">
      <div class="nav-part">
        <SvgImage name="catpaw-logo.svg" class="w-14.3rem h-4rem mt-1.6rem"/>
        <ul class="nav-part-tablist">
          <li @mouseenter="hoverTabItem(index)" @mouseleave="leaveTabItem(index)" @click="handleTabClick(index)" v-for="(tabItem, index) in tabs" :key="index" :class="tabItem.status">
            <div>
              <SvgImage :name="tabItemMap(tabItem)" class="w-2.4rem h-2.4rem inline-block vertical-middle mr-8px"/>

              <span class="inline-block vertical-middle">{{ tabItem.label }}</span>
            </div>
            <div v-if="tabItem.status === 'disable'">
              <SvgImage name="icon24_lock_on.svg" class="w-1.6rem h-1.6rem"/>
            </div>
          </li>
          <!-- <li>
            <div>
              <Image name="icon24_ceshi_miao.svg" alt="" class="w-2.4rem h-2.4rem inline-block vertical-middle mr-8px"/>
              <span class="inline-block vertical-middle">测试喵</span>
            </div>
            <div>
              <Image name="icon24_lock_on.svg" alt="" class="w-1.6rem h-1.6rem"/>
            </div>
          </li>
          <li>
            <div>
              <Image name="icon24_wode_miao.svg" alt="" class="w-2.4rem h-2.4rem inline-block vertical-middle mr-8px"/>
              <span class="inline-block vertical-middle">我的喵</span>
            </div>
            <div>
              <Image name="icon24_lock_on.svg" alt="" class="w-1.6rem h-1.6rem"/>
            </div>
          </li> -->
        </ul>
      </div>
      <div class="main-part" ref="targetDiv">
          <router-view></router-view>
      </div>
    </div>

    <div class="jal-modal-bg" v-show="chatStore.showLoginModal">
      <div class="jal-modal">
      <div class="absolute top-1.6rem right-1.6rem cursor-pointer" @click="closeLoginModal">
        <SvgImage name="icon24_close.svg" class="w-2.4rem h-2.4rem" />
      </div>

      <main class="jal-modal-main">
        <div class="w-8rem h-8rem border-0.4rem border-solid border-#ff6bf0 rounded-50%">
          <SvgImage name="personal.svg" class="wh-full" />
        </div>
        <div class="text-1.6rem font-400 line-height-2.4rem text-center mt-1.6rem">
          <!-- <div>请先登录</div>
          <div>解锁{{ currentLabel }}</div> -->
          <div class="whitespace-pre-line">{{ chatStore.currentTipText }}</div>
        </div>
      </main>
      <footer class="jal-modal-footer">
        <div class="bg-black w-full h-6.4rem color-white text-center text-2rem font-700 py-2rem cursor-pointer" @click="router.push('/register')" v-if="chatStore.currentTipText.indexOf('登录')!=-1">点击跳转</div>
        <div class="bg-black w-full h-6.4rem color-white text-center text-2rem font-700 py-2rem cursor-pointer" @click="closeLoginModal" v-if="chatStore.currentTipText.indexOf('开发中')!=-1">点击关闭</div>
      </footer>
      </div>
    </div>

    <div class="absolute left--33.8rem bottom--9.1rem z-999">
      <SvgImage name="animation-cat.svg" class="w-49.6rem h-38rem" />
    </div>
  </div>



      <!-- <div class="
        w-full
        fixed
        bottom-0
        left-0
        z-1000
        p-30
        flex-center
        box-border">
        <div class="input-container w-full mr-3rem">
          <input
            type="text"
            class="chat-input"
            placeholder="点击聊天"
            v-model="newMessage"
            @keyup.enter.native="sendMessage"
          />
          <div class="send-button" @click="sendMessage" :disabled="!isConnect">
            <Image name="airplant.svg" class="fly-icon" />
          </div>
        </div>
        <Image name="111.gif" class="self-start" alt="" :width="'80px'" :height="'80px'"/>
      </div> -->
</template>

<script setup lang="ts">
import { useChatStore, useLoginStore } from "@manage/shared/store/index.ts";
import { useTabs } from '@manage/shared/hooks/switchTabs.ts'
import { tablistMap, loginTablistMap } from './tablistMap'

const chatStore = useChatStore();
const loginStore = useLoginStore()
const router = useRouter();


const tablist = loginStore.token ? JSON.parse(JSON.stringify(loginTablistMap)) : JSON.parse(JSON.stringify(tablistMap))
const { tabs, currentTab, setTab, hoverTabItem, leaveTabItem, tabItemMap } = useTabs(tablist)
let currentLabel = ref('')
const handleTabClick = (index:number) =>{
  currentLabel.value = tabs.value[index].tipText
  router.push(tabs.value[index].path)
}

const closeLoginModal = () =>{
  chatStore.showLoginModal = false
}

// 根据是否登录判断是否解锁tab
const unlockTabItem = () =>{
  const loginStore = useLoginStore()
  const chatStore = useChatStore();

  if(loginStore.token){
    //先disable项目
    loginTablistMap.forEach((item:any, index:number) =>{
      if(item.status != 'press'){
        tabs.value[index].status  = item.status
      }
    })
    //将所有press > normal
    tabs.value.forEach((item:any, index:number) =>{
      if(item.status != 'disable'){
        tabs.value[index].status  = 'normal'
      }
    })
    tabs.value[currentTab.value].status  = 'press'
    chatStore.showLoginModal = false
  }
  else{
    tablistMap.forEach((item:any, index:number) =>{
      tabs.value[index].status  = item.status
    })
    //将所有press > normal
    tabs.value.forEach((item:any, index:number) =>{
      if(item.status != 'disable'){
        tabs.value[index].status  = 'normal'
      }
    })
    tabs.value[currentTab.value].status  = 'press'

  }
}

const activeTab = (path:string) =>{
  const index = tabs.value.findIndex((item:any) => {
    if(path.indexOf(item.path) != -1){
      return true
    }
    else{
      return false
    }
  })
  let isChildRouter = path.split('/')
  // 子路由不需要
  if(isChildRouter.length < 3){
    setTab(index)
  }
  else{
    setTab(index,true)
  }
  unlockTabItem()
}

//监听路由变化
watch(()=>router.currentRoute.value.path, (val:string)=>{
  if(val){
    activeTab(val)
    //unlockTabItem()
  }
})

onMounted(()=>{
  unlockTabItem()
  activeTab(router.currentRoute.value.path)
})


</script>

<style scoped>

</style>
