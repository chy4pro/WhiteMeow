<template>
  <div class="home-bg bg-box">
    <NavBar showLogo/>
    
    <div class="intro-wrap">
      <Image name="home-cat.png" :width="300" :height="300"/>

      <h1 class="intro-title">白小喵每天陪着你哦</h1>
      <div class="intro-btn-list">
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

      <div class="input-container">
        <input
          type="text"
          class="chat-input"
          placeholder="从这里输入开始撸喵～"
          v-model="newMessage"
          @keyup.enter.native="sendMessage"
        />
        <div class="send-button" @click="sendMessage">
          <Image name="airplant.svg" class="fly-icon" width="40" height="40"/>
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

<style lang="scss" scoped>
.home-bg.bg-box{
  /* background: url('@/assets/images/home-bg.png') no-repeat center;
  background-size: 100% 100%; */
  background: rgb(255,164,237);
  background: linear-gradient(130deg, rgba(255,164,237,1) 0%, rgba(255,221,236,1) 100%);
  overflow-y: auto;
}
.intro-wrap{
  width: 100%;
  /* height: 100%; */
  margin: 0 auto;
  @include flex-center;
  flex-direction: column;
  .intro-title{
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    margin-top: 20px;
  }
  
  .intro-btn-list{
    margin-top: 20px;
    @include flex-between($flexWrap: wrap);
    .intro-btn{
      margin: 10px 10px;
      /* font-family: KuaiLe; */
      color: $green_1;
    }
  }

  .input-container{
    width: 100%;
    height: 5rem;
    border-radius: 1.5rem;
    box-sizing: border-box;
    position: relative;
    align-self: flex-end;
    background-color: #fff;
    overflow: hidden;
    max-width: 500px;
    margin: 5rem auto 0 auto;
    .chat-input{
      width: 100%;
      height: 100%;
      border: none;
      background: none;
      font-size: $size_18;
      /* font-family: KuaiLe; */
      text-indent: 1em;
      color: $gray_1;
      &:focus{
        outline: none;
      }
    }
    .send-button{
      width: 4rem;
      height: 4rem;
      position: absolute;
      right: 3rem;
      top: 50%;
      transform: translateY(-50%);
      .fly-icon{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>