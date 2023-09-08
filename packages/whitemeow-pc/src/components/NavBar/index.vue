<template>
  <div class="
    w-full
    fixed
    left-0
    top-0
    box-border
    flex-row-between
    z-1000
    h-56px
    bg-[rgba(255,255,255,0.3)]
      backdrop-blur-37px
    "
    >

    <div class="ml-40px cursor-pointer w-165px h-43px" @click="goHome">
      <SvgImage name="catpaw-logo.svg" class="wh-full" />
    </div>
    <!-- <div class="cursor-pointer mr-24px"  @click="goHome">
      <Image name="icon40_home.svg" class="ml-64px my-8px w-4rem h-4rem"/>
    </div> -->
    <div class="cursor-pointer relative mr-64px w-40px h-40px" @mouseenter="open = true" @click="goRegister">
      <SvgImage name="personal.svg" class="wh-full" />
      <!-- <Image name="comment.svg" alt="" :width="'40px'" :height="'40px'" class="mr-40px cursor-pointer" @click="goFeedBack"/> -->
      <transition name="fade">
        <div class="pt-8px" v-if="open"  @mouseleave="open = false">
          <div class="absolute left-50% transform
            translate-x--50% w-128px h-a bg-white rounded-8px overflow-hidden" style="box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);">
            <div class="flex-col-center pb-12px">
              <div class="px-12px w-full">
                <div class="w-full text-center pb-12px color-#666 text-16px mt-20px border-b border-b-solid border-b-[#E7E7E7]">
                  <span>{{ name }}</span>
                </div>
              </div>

              <div class="px-12px w-full bg-white hover:bg-[var(--pink-01)] cursor-pointer" @click="goRegister()" v-if="!loginStore.token">
              <div class="py-12px flex-row-center ">
                <SvgImage name="icon24_account.svg" class="w-24px h-24px" />
                <span class="text-16px font-500 line-height-normal">注册/登录</span>
              </div>
              </div>

              <div class="px-12px w-full bg-white hover:bg-[var(--pink-01)] cursor-pointer" @click="goRouter('/profileCenter/editProfile')" v-if="loginStore.token">
              <div class="py-12px flex-row-center ">
                <SvgImage name="icon24_account.svg" class="w-24px h-24px" />
                <span class="text-16px font-500 line-height-normal">个人中心</span>
              </div>
              </div>
              
              <div class="px-12px w-full bg-white hover:bg-[var(--pink-01)] cursor-pointer" v-if="loginStore.token" @click="startLogout">
              <div class="py-12px flex-row-center">
                <SvgImage name="icon24_sign_out.svg"  class="w-24px h-24px"  />
                <span class="text-16px font-500 line-height-normal">退出登录</span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import messageBox from '@/components/MessageBox/index.ts';
import { useLoginStore } from '@/store/index.js';
import { logout } from '@manage/shared/apis/login.ts'
import { storage } from '@/utils/index.ts'
import { message } from 'ant-design-vue';
const router = useRouter();
const loginStore = useLoginStore();

const props = defineProps({
  showLogo: {
    type: Boolean,
    default: false
  }
});
let open = ref(false)
interface UserInfo {
  name: string
}

const getName = (userInfo: UserInfo) => {
  // 业务逻辑
  if(!userInfo) return '游客'

  if(userInfo.name==='') return '游客'
  
  return userInfo.name 
}

const name: any = computed(() => {
  const name = getName(loginStore.userInfo)
  return name;
})

const getToken: any = computed(() => {
  const hasToken = loginStore.token ? true : false
  return hasToken
})

const goHome = () => {
  router.push({ path: '/' });
};

const goFeedBack = () => {
  router.push({ path: '/feedBack' });
};
let token = ref('')

const goPersonal = () => {
  if(!token){
    message.info('请先登录一下哦')
    router.push({ path: '/register' });
  }
}
const goRegister = () => {
  console.log(loginStore.token);
  
  if(loginStore.token){
    return;
  }
  router.push({ path: '/register' });
}

const goRouter = (path: string) => {
  router.push({ path: path });
}
// 登出
const startLogout = async() => {
  //loginStore.isLogin = true;
  try {
    if(token){
      let params = {
        "Authorization": token
      }

      const res = await logout(params);
      let result:any = res.data;
      if(result && result.message === 'ok'){
        messageBox.success('登出成功')
        // storage.removeItem('userId')
        // storage.removeItem('newUserId')
        // storage.removeItem('token')
        loginStore.token = null
        loginStore.userInfo = null
        storage.clear()
        //router.push({ path: '/'});
        goHome()
      }
    }
    else{
      
    }

  } catch (err) {
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }
}

const leaveNav = () => {
  setTimeout(()=>{open.value = false},1000)
}
</script>

<style scoped>
  .list-item{
    
  }
</style>