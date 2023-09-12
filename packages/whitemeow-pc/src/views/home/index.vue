<template>
      <div class="uno-bg-home-panel-bg wh-full rounded-24px
      relative
      overflow-hidden">
        <SvgImage name="catpaw-logo.svg" class="w-16.5rem h-4.3rem ml-4rem mt-4.2rem max-w-165px"/>
        <div class="
          absolute
          top-11.6rem
          left-50%
          transform
          translate-x--50%
          flex
          flex-col-center">
          <div>
            <SvgImage name="catpaw-rounded-icon.svg" class="w-20rem h-20rem max-w-200px max-h-200px"/>
          </div>
          <div class="mt-64px xs: mt-6px">
            <SvgImage name="slogan-text.svg" class="w-48rem h-4.3rem max-w-480px"/>
          </div>
          <button class="
            mt-80px
            w-28rem
            h-5.6rem
            max-w-280px
            rounded-6px
            decoration-none
            border-none
            bg-black
            hover:bg-[rgba(0,0,0,0.8)]
            active:bg-[rgba(0,0,0,0.6)]
            disabled:bg-[rgba(0,0,0,0.4)]
            line-height-28px
            color-white"
            @click="goToChat"
            href="javascript:void(0)"
            >
            <h1 class="
            text-2rem
            text-center
            m-0
            font-700
            cursor-pointer">开始撸猫</h1>
          </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { userMessage } from '@manage/shared/store/index.js';
import { hImage } from '@manage/shared/utils/preloadImg.js';
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
  'Avatar.svg',
  'Avatar2.svg',
  'Vector.svg',
  'airplant.svg',
  'animation-cat.svg',
  'bg_mi.svg',
  'btn_confirm.svg',
  'cat_red.svg',
  'cat_red2.svg',
  'cat_red3.svg',
  'cat_white.svg',
  'catpaw-icon.svg',
  'catpaw-logo.svg',
  'catpaw-rounded-icon.svg',
  'chat-triangle-pink.svg',
  'chat-triangle-white.svg',
  'comment.svg',
  'dialog_box.svg',
  'dialog_box_large.svg',
  'dialog_box_middle.svg',
  'dialog_box_small.svg',
  'dialog_cat_box.svg',
  'home-panel-bg.svg',
  'icon24_account.svg',
  'icon_arrow_left.svg',
  'icon24_ceshi_miao.svg',
  'icon24_close.svg',
  'icon24_eye.svg',
  'icon24_lock_on.svg',
  'icon24_sign_out.svg',
  'icon24_wode_miao.svg',
  'icon24_聊愈喵.svg',
  'icon40_home.svg',
  'icon_account_disable.svg',
  'icon_account_hover.svg',
  'icon_account_normal.svg',
  'icon_account_press.svg',
  'icon_arrow_left.svg',
  'icon_bad.svg',
  'icon_black_delete.svg',
  'icon_close_white.svg',
  'icon_cs_disable.svg',
  'icon_cs_hover.svg',
  'icon_cs_normal.svg',
  'icon_cs_press.svg',
  'icon_delete.svg',
  'icon_feedback_hover.svg',
  'icon_feedback_normal.svg',
  'icon_feedback_press.svg',
  'icon_good.svg',
  'icon_heart.svg',
  'icon_heart_active.svg',
  'icon_lockon_disable.svg',
  'icon_lockon_hover.svg',
  'icon_lockon_normal.svg',
  'icon_lockon_press.svg',
  'icon_ly_disable.svg',
  'icon_ly_hover.svg',
  'icon_ly_normal.svg',
  'icon_ly_press.svg',
  'icon_more.svg',
  'icon_mx_disable.svg',
  'icon_mx_hover.svg',
  'icon_mx_normal.svg',
  'icon_mx_press.svg',
  'icon_plus.svg',
  'icon_send_active.svg',
  'icon_send_disable.svg',
  'icon_send_hover.svg',
  'icon_send_normal.svg',
  'icon_wd_disable.svg',
  'icon_wd_hover.svg',
  'icon_wd_normal.svg',
  'icon_wd_press.svg',
  'login-panel-bg.svg',
  'login-panel-close.svg',
  'logo.svg',
  'personal.svg',
  'slogan-text.svg',
  'star.svg'
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

.uno-bg-home-panel-bg{
  background: url('shared/~/home-panel-bg.png');
  background-size: 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
</style>