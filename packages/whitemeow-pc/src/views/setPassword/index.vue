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
      backdrop-blur-11.5px
      rounded-24px
      mt-18rem
      mb-18rem
      shadow-lg 
      shadow-[rgba(219,175,201,0.45)]
      overflow-hidden
      flex-shrink-0
      ">
        <div class="flex flex-row-start wh-full">
          <div class="
            w-44.3rem
            h-full
            max-w-443px
            bg-white
          ">
            <div class="mt-9rem mx-4rem">
              <div class="text-center">
                <SvgImage name="catpaw-logo.svg" class="w-16.5rem h-4.3rem my-4.2rem max-w-165px"/>
              </div>

              <div class="text-1.6rem font-600 mb-2.4rem">设置密码</div>
              
              <a-input-password class="normal-input-wrap mb-1.6rem" placeholder="请输入你的密码">
                <template #suffix>
                  <div class="cursor-pointer">
                    <SvgImage name="icon24_close.svg" class="w-2.4rem h-2.4rem"/>
                  </div>
                </template>
              </a-input-password>

              <a-input-password class="normal-input-wrap mb-1.6rem" placeholder="请输入你的密码">
                <template #prefix>
                  <div class="cursor-pointer">
                    <SvgImage name="icon24_close.svg" class="w-2.4rem h-2.4rem"/>
                  </div>
                </template>
              </a-input-password>

                <div class="mt-0.8rem">
                  <a-checkbox class="text-1.4rem pink-checkbox">自动登录</a-checkbox>
                </div>

                  <a-button class="w-full bg-black color-white  min-h-30px h-5.6rem mt-4rem">登录/注册</a-button>

                  <div class="mt-0.8rem flex-row-start">
                    <a-checkbox class="self-start pink-checkbox">
                    </a-checkbox>

                    <div class="ml-0.8rem text-1.4rem">
                      <span>我已阅读并同意</span>
                      <a class="inline-block color-#374AF5">《用户协议》</a>
                      <span>和</span>
                      <a class="inline-block color-#374AF5">《隐私协议》</a>
                    </div>
                  </div>
            </div>


          </div>
          <div class="
            w-64.8rem
            max-w-648px
            h-100%
            bg-[var(--pink-01)]
          ">
            <div class="
          wh-full
          bg-no-repeat
          bg-[url(@/assets/images/login-panel-bg.svg)]
          bg-bottom
        "
        style="background-size: 100%;"
        ></div>
            
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

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const select = ref('+86')
const activeKey = ref('1');

const activeName = ref('first')


const sendMessage = () => {
  if (newMessage.value){
    console.log('我发送了',newMessage.value);
    messageStore.firstMessage = newMessage.value;
    newMessage.value = '';
  }

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
  :deep .el-tabs__item.is-active{
    color: #000;
  }
  :deep .el-tabs__active-bar{
    background-color: #000;
  }
  :deep .el-tabs__item{
    color: #B3B3B3;
  }
  .input-group{
    --at-apply: flex-row-start flex-nowrap ;
  }
  :deep .input-group  .ant-select-selector{
    --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
  }
  .normal-input-wrap{
    --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
  }
  :deep .normal-input-wrap input{
    --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
  }
</style>