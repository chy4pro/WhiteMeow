<template>
  <div class="bg-box">
    <NavBar showLogo/>
    
    <div class="container text-center box-border px-20">
      <Image name="home-cat.png" :width="300" :height="300" class="mt-50"/>

      <h1 class="text-30 color-white font-700 mt-20">白小喵每天陪着你哦</h1>
      <div>
        <el-popover
        :width="200"
        trigger="hover"
        content="有人欺负你或者心情不好，请尽管告诉本喵，本喵专治各种不开心"
        placement="top"
        >
          <template #reference>
            <el-button color="#fff" round class="intro-btn">喵喵聊愈</el-button>
          </template>
        </el-popover>
        <el-popover
        :width="200"
        trigger="hover"
        content="当本喵还是小小喵的时候就已经熟读知识百科，不信你来考考我呀!"
        placement="top"
        >
          <template #reference>
            <el-button color="#fff" round class="intro-btn">喵答百科</el-button>
          </template>
        </el-popover>
        <el-popover
        :width="200"
        trigger="hover"
        content="不瞒你说，本喵参加过的考试千千万万，作业不会问问我，说不定我就会呢~"
        placement="top"
        >
          <template #reference>
            <el-button color="#fff" round class="intro-btn">喵写作业</el-button>
          </template>
        </el-popover>
        <el-popover
        :width="200"
        trigger="hover"
        content="出个主意，写个文案，方案，小作文啥的，本喵也非常擅长"
        placement="top"
        >
          <template #reference>
            <el-button color="#fff" round class="intro-btn">职场答喵</el-button>
          </template>
        </el-popover>
      </div>

      <div class="input-container w-full bg-white mt-50 m-a">
        <input
          type="text"
          class="chat-input"
          placeholder="从这里输入开始撸喵～"
          v-model="newMessage"
          @keyup.enter.native="sendMessage"
        />
        <div 
        class="send-button" @click="sendMessage">
          <Image name="airplant.svg" :width="40" :height="40"/>
        </div>
      </div>

      <WeChatCode/>
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