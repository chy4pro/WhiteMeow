<template>
  <div class="bg-box wh-full">
    <NavBar showLogo/>
    <div class="
      fixed
      w-111rem
      h-111rem
      rounded-50%
      bottom--60rem
      left--35rem
      bg-[rgba(241,143,219,0.21)]">
    </div>

    <div class="
      fixed
      w-42rem
      h-42rem
      rounded-50%
      top--12rem
      right-15.9rem
      bg-[rgba(241,143,219,0.21)]">
    </div>

    <div class="
      w-108rem
      h-72rem
      max-w-1080px
      max-h-720px
      bg-[rgba(255,255,255,0.7)]
      backdrop-blur-11.5px
      rounded-24px
      mt-18rem
      mb-18rem
      shadow-lg 
      shadow-[rgba(209,126,201,0.45)]
      flex-shrink-0
      ">
      <div class="uno-bg-home-panel-bg.svg wh-full">
        <Image name="catpaw-logo.svg" :width="'16.5rem'" :height="'4.3rem'" class="ml-4rem mt-4.2rem max-w-165px"/>
        <div class="
          absolute
          top-11.6rem
          left-50%
          transform
          translate-x--50%
          flex
          flex-col-center">
          <div>
            <Image name="catpaw-rounded-icon.svg" :width="'20rem'" :height="'20rem'" class="max-w-200px max-h-200px"/>
          </div>
          <div class="mt-64px xs: mt-6px">
            <Image name="slogan-text.svg" :width="'48rem'" :height="'4.3rem'"  class="max-w-480px"/>
          </div>
          <div class="
            mt-80px
            w-28rem
            h-5.6rem
            max-w-280px
            rounded-6px
            bg-black
            color-white" @click="goToChat"
            >
            <h1 class="text-2rem text-center line-height-5.6rem m-0 cursor-pointer">开始撸猫</h1>
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userMessage } from '@/store/index.js';
import { hImage } from '@/utils/preloadImg.js';
const messageStore = userMessage();
const newMessage = ref('');
const router = useRouter();

const sendMessage = () => {
  if (newMessage.value){
    console.log('我发送了',newMessage.value);
    messageStore.firstMessage = newMessage.value;
    newMessage.value = '';
  }

  router.push({ name: 'chat'});
}

const goToChat = () => {
  router.push({ name: 'chat'});
}

onMounted(()=>{
  loadImages();
})

//已加载完成的数量 
const loadCount = ref(0);
//执行下载所有图片
const loadImages = ()=> {
  let imgs = [
    '111.gif',
    'emoji/爱你.png',
    'emoji/抱歉.png',
    'emoji/不开心.png',
    'emoji/吃惊.png',
    'emoji/愤怒:暴躁.png',
    'emoji/好奇.png',
    'emoji/开心:哈哈.png',
    'emoji/哭泣:伤心:难过.png',
    'emoji/快乐.png',
    'emoji/困.png',
    'emoji/期待:好奇.png',
    'emoji/请求.png',
    'emoji/生气.png',
    'emoji/无聊.png',
    'emoji/拥抱:关爱.png',
    'emoji/着急.png',
  ]

  for (let img of imgs) {
    hImage(img)
  }
}
</script>

<style scoped>
.intro-btn{
  margin: 10px 10px;
  /* font-family: KuaiLe; */
  color: var(--green-1);
}


</style>