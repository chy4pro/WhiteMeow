<template>
  <div class="
    w-full
    h-auto
    fixed
    left-0
    top-0
    box-border
    flex-row-between
    z-1000
    py-1.6rem
    bg-[rgba(255,255,255,0.3)]
      backdrop-blur-37px
    "
    @mouseleave="open = false">

    <div class="ml-40px cursor-pointer" @click="goHome">
      <Image name="catpaw-logo.svg" alt="" class="w-16.5rem h-4.3rem" />
    </div>
    <!-- <div class="cursor-pointer mr-24px"  @click="goHome">
      <Image name="icon40_home.svg" class="ml-64px my-8px w-4rem h-4rem"/>
    </div> -->
    <div class="cursor-pointer relative mr-64px ">
      <Image name="personal.svg" alt="" class="w-4rem h-4rem" @mouseenter="open = true" @click="goRegister"/>
      <!-- <Image name="comment.svg" alt="" :width="'40px'" :height="'40px'" class="mr-40px cursor-pointer" @click="goFeedBack"/> -->
      <transition name="fade">
        <div v-if="open" class="absolute left-50% transform
          translate-x--50% top-4.8rem w-128px h-a bg-white rounded-8px overflow-hidden" style="box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);">
          <div class="flex-col-center">
            <div class="px-12px w-full">
              <div class="w-full text-center pb-12px color-#666 text-16px mt-20px border-b border-b-solid border-b-[#E7E7E7]">
                <span>{{ nickname }}</span>
              </div>
            </div>

            <div class="px-12px w-full bg-white hover:bg-[var(--pink-01)] cursor-pointer" @click="goPersonal">
            <div class="py-12px flex-row-center ">
              <Image name="icon24_account.svg" :width="'24px'" :height="'24px'" />
              <span class="text-16px font-500 line-height-normal">个人中心</span>
            </div>
            </div>
            
            <div class="px-12px w-full bg-white hover:bg-[var(--pink-01)] cursor-pointer" v-if="token" @click="startLogout">
            <div class="py-12px flex-row-center">
              <Image name="icon24_sign_out.svg" :width="'24px'" :height="'24px'" />
              <span class="text-16px font-500 line-height-normal">退出登录</span>
            </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useLoginStore } from '@/store/index.js';
import { logout } from '@/apis/login.ts'
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
const open = ref(false)
interface UserInfo {
  nickname: string
}

const getNickname = (userInfo: UserInfo) => {
  // 业务逻辑
  if(!userInfo) return '游客'
  
  if(!userInfo.nickname) return '游客'
  
  return userInfo.nickname 
}

const nickname: any = computed(() => {
  const userInfo = loginStore.userInfo
  return getNickname(userInfo)
})

const goHome = () => {
  router.push({ path: '/' });
};

const goFeedBack = () => {
  router.push({ path: '/feedBack' });
};
let token = ref('')
token = storage.getItem('token')

const goPersonal = () => {
  if(!token){
    message.info('请先登录一下哦')
    router.push({ path: '/register' });
  }
}
const goRegister = () => {
  router.push({ path: '/register' });
}
// 登出
const startLogout = async() => {
  //loginStore.isLogin = true;
  try {
    if(token){
      let params = {
        "Authorization": token
      }

      const result = await logout(params);
      if(result && result.message === 'ok'){
        message.success('登出成功')
        // storage.removeItem('userId')
        // storage.removeItem('newUserId')
        // storage.removeItem('token')
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
</script>

<style scoped>
  .list-item{
    
  }
</style>